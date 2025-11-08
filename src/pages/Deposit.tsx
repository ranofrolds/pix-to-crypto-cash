import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AmountInput } from '@/components/pix/AmountInput';
import { ConversionHint } from '@/components/pix/ConversionHint';
import { PixPaymentCard } from '@/components/pix/PixPaymentCard';
import { NetworkBadge } from '@/components/ui/network-badge';
import { FullBackdropLoading } from '@/components/ui/full-backdrop-loading';
import { SuccessAnimation } from '@/components/ui/success-animation';
import { PixPayload } from '@/lib/types/pix';
import { NetworkType, AssetSymbol } from '@/lib/types/wallet';
import { toast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { createPixCharge, getBalance, getWalletTransactions } from '@/lib/api';
import { targetChain } from '@/lib/wagmi';
import { useBalancePolling } from '@/hooks/use-balance-polling';
import { formatCurrency } from '@/lib/utils/format';
import { transformBackendTransaction } from '@/lib/utils/transform-transactions';
import { useQueryClient } from '@tanstack/react-query';

interface BackendBalanceResponse {
  success: boolean;
  data: {
    address: string;
    balance: string;
    balanceRaw: string;
  };
}

export default function Deposit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();
  const [amountBRL, setAmountBRL] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<AssetSymbol | null>('BRLA');
  const envNetwork: NetworkType = targetChain.id === 42161 ? 'ARBITRUM_ONE' : 'ARBITRUM_SEPOLIA';
  const [selectedNetwork] = useState<NetworkType>(envNetwork);
  const [pixData, setPixData] = useState<PixPayload | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [initialBalance, setInitialBalance] = useState(0);
  const [enablePolling, setEnablePolling] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [creditedAmount, setCreditedAmount] = useState(0);

  const [calculatedFee, setCalculatedFee] = useState(0);
  const fee = calculatedFee > 0 ? calculatedFee : (amountBRL > 0 ? Math.max(0.85, amountBRL * 0.015) : 0);
  const estimatedAmount = amountBRL; // BRLA 1:1 com BRL
  const totalAmount = amountBRL + fee;

  // Balance polling hook
  const { balanceChanged, newBalance, isPolling, timeoutReached, stopPolling } = useBalancePolling(
    address,
    initialBalance,
    enablePolling
  );

  const amountError =
    amountBRL > 0 && amountBRL < 1
      ? 'Valor mínimo é R$ 1,00'
      : amountBRL > 50000
      ? 'Valor máximo é R$ 50.000,00'
      : '';

  const canGenerate = amountBRL >= 1 && amountBRL <= 50000 && !pixData && selectedAsset !== null;

  const handleGeneratePix = async () => {
    if (!isConnected || !address) {
      toast({
        title: 'Conecte sua carteira',
        description: 'Faça login para gerar o PIX',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    try {
      // 1. Captura balance inicial antes de gerar PIX
      const balanceResponse = await getBalance(address);
      const backendResponse = balanceResponse as unknown as BackendBalanceResponse;
      const balance = backendResponse?.data?.balance;
      const currentBalance = typeof balance === 'string' ? Number(balance) : (balance as number | undefined);
      const balanceValue = Number.isFinite(currentBalance as number) ? (currentBalance as number) : 0;

      setInitialBalance(balanceValue);

      // 2. Gera PIX via Woovi
      const response = await createPixCharge(address, totalAmount);

      if (!response.success) {
        throw new Error(response.message || 'Falha ao gerar PIX');
      }

      // Converte centavos para BRL
      const feeInBRL = response.data.fee / 100;
      const valueInBRL = response.data.value / 100;

      setCalculatedFee(feeInBRL);

      const pixPayload: PixPayload = {
        raw: response.data.brCode,
        brCode: response.data.brCode,
        qrCodeImage: response.data.qrCodeImage,
        chave: 'pix@woovi.com',
        valor: valueInBRL,
        descricao: `Depósito para ${selectedAsset} na rede ${selectedNetwork}`,
        txid: response.data.transactionId,
        beneficiario: 'MOBILIZE SOLUCOES',
        expiraEm: new Date(response.data.expiresDate),
        cidade: 'SAO PAULO',
      };

      setPixData(pixPayload);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error || '');
      const description = /http|network|fetch|Failed to fetch/i.test(msg)
        ? 'Servidor indisponível, tente mais tarde'
        : msg || 'Erro ao gerar PIX';

      toast({
        title: 'Erro ao gerar PIX',
        description,
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    setPixData(null);
    setEnablePolling(false);
    stopPolling();
  };

  const handleMarkAsPaid = () => {
    if (!isConnected || !address) {
      toast({
        title: 'Conecte sua carteira',
        description: 'Faça login para continuar',
        variant: 'destructive'
      });
      return;
    }
    if (!pixData) return;

    // Inicia long polling
    setEnablePolling(true);
    toast({
      title: 'Aguardando pagamento',
      description: 'Verificando confirmação do PIX...'
    });
  };

  const handleExpire = () =>
    toast({ title: 'PIX Expirado', description: 'Este PIX expirou. Gere um novo para continuar.', variant: 'destructive' });

  // Effect: Listen to balance changes from polling
  useEffect(() => {
    if (balanceChanged && newBalance > initialBalance && address) {
      setEnablePolling(false);
      const credited = newBalance - initialBalance;

      // Set animation state
      setCreditedAmount(credited);
      setShowSuccessAnimation(true);

      // Fetch latest transaction
      const fetchLatestTransaction = async () => {
        try {
          const transactionsResponse = await getWalletTransactions(address);
          const transactions = transactionsResponse?.data?.transactions || [];

          if (transactions.length > 0) {
            // Get the most recent transaction
            const latestTx = transformBackendTransaction(transactions[0]);

            // Store receipt data in sessionStorage
            const receiptData = {
              txHash: latestTx.hash,
              blockNumber: 0, // Not available from backend
              gasUsed: '0', // Not available from backend
              walletAddress: address,
              amount: String(latestTx.amountBRL),
              explorer: latestTx.explorerUrl,
              timestamp: latestTx.createdAt.toISOString(),
            };
            sessionStorage.setItem('receipt_data', JSON.stringify(receiptData));

            // Invalidate caches
            queryClient.invalidateQueries({ queryKey: ['backend-balance', address] });
            queryClient.invalidateQueries({ queryKey: ['wallet-transactions', address] });

            // Navigate to receipt page after animation (3s)
            setTimeout(() => {
              navigate(`/receipt/${latestTx.hash}`);
            }, 3500);
          } else {
            // Fallback: no transactions found, go to dashboard
            queryClient.invalidateQueries({ queryKey: ['backend-balance', address] });

            setTimeout(() => {
              navigate('/dashboard');
            }, 3500);
          }
        } catch (error) {
          console.error('Failed to fetch latest transaction:', error);

          // Fallback on error
          queryClient.invalidateQueries({ queryKey: ['backend-balance', address] });

          setTimeout(() => {
            navigate('/dashboard');
          }, 3500);
        }
      };

      fetchLatestTransaction();
    }
  }, [balanceChanged, newBalance, initialBalance, address, navigate, queryClient]);

  // Effect: Handle polling timeout
  useEffect(() => {
    if (timeoutReached && isPolling === false && enablePolling) {
      setEnablePolling(false);
      stopPolling();
      toast({
        title: 'Tempo esgotado',
        description: 'Pagamento ainda não confirmado. Verifique seu saldo no Dashboard.',
        variant: 'default',
      });

      // Navigate to dashboard anyway
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [timeoutReached, isPolling, enablePolling, navigate, stopPolling]);

  return (
    <div className="min-h-screen bg-background">
      {/* Success Animation */}
      <SuccessAnimation
        isVisible={showSuccessAnimation}
        amount={creditedAmount}
        duration={3000}
        onComplete={() => setShowSuccessAnimation(false)}
      />

      {/* Full Backdrop Loading */}
      <FullBackdropLoading
        isOpen={isGenerating || isPolling}
        message={isGenerating ? 'Gerando Pix...' : 'Aguardando confirmação do pagamento...'}
      />

      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(pixData ? '#' : '/')} disabled={!!pixData}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {!isConnected && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                Conecte sua carteira para gerar o PIX
              </p>
            )}
            <div>
              <h1 className="text-xl font-bold">Depositar via Pix</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6 mt-12">
        {!pixData ? (
          <>
            <Card className="p-6 bg-gradient-card border-border/50">
              <AmountInput value={amountBRL} onChange={setAmountBRL} error={amountError} min={1} max={5000} />
              {!canGenerate && isConnected && (amountBRL === 0 || !selectedAsset) && (
                <p className="text-xs text-muted-foreground mt-2">
                  {!selectedAsset ? 'Selecione o ativo BRLA para continuar.' : 'Informe um valor válido para gerar o Pix.'}
                </p>
              )}
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block">Ativo a Creditar</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant={selectedAsset === 'BRLA' ? 'default' : 'outline'} onClick={() => setSelectedAsset('BRLA')} className="h-12" disabled>
                      BRLR
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Rede</label>
                  <div className="flex items-center gap-2">
                    <NetworkBadge network={selectedNetwork} showFullName />
                  </div>
                </div>
              </div>
            </Card>

            {amountBRL > 0 && !amountError && (
              <ConversionHint amountBRL={amountBRL} asset={selectedAsset} estimatedAmount={estimatedAmount} fee={fee} isLoading={isGenerating} />
            )}

            <Button className="w-full h-14 text-lg shadow-glow gap-2" onClick={handleGeneratePix} disabled={!isConnected || !canGenerate || isGenerating}>
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Pix
                </>
              )}
            </Button>
          </>
        ) : (
          <PixPaymentCard
            pixData={pixData}
            onCancel={handleCancel}
            onMarkAsPaid={handleMarkAsPaid}
            onExpire={handleExpire}
            confirmLabel="Já paguei"
            confirmLoading={isPolling}
          />
        )}
      </div>
    </div>
  );
}
