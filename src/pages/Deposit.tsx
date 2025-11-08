import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AmountInput } from '@/components/pix/AmountInput';
import { ConversionHint } from '@/components/pix/ConversionHint';
import { PixPaymentCard } from '@/components/pix/PixPaymentCard';
import { NetworkBadge } from '@/components/ui/network-badge';
import { FullBackdropLoading } from '@/components/ui/full-backdrop-loading';
import { PixPayload } from '@/lib/types/pix';
import { NetworkType, AssetSymbol } from '@/lib/types/wallet';
import { toast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { postPixWebhook } from '@/lib/api';
import { targetChain } from '@/lib/wagmi';

export default function Deposit() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [amountBRL, setAmountBRL] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<AssetSymbol | null>('BRLA');
  const envNetwork: NetworkType = targetChain.id === 42161 ? 'ARBITRUM_ONE' : 'ARBITRUM_SEPOLIA';
  const [selectedNetwork] = useState<NetworkType>(envNetwork);
  const [pixData, setPixData] = useState<PixPayload | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmittingWebhook, setIsSubmittingWebhook] = useState(false);

  const fee = amountBRL > 0 ? Math.max(0.85, amountBRL * 0.015) : 0;
  const estimatedAmount = amountBRL; // BRLA 1:1 com BRL
  const totalAmount = amountBRL + fee;

  const amountError =
    amountBRL > 0 && amountBRL < 1
      ? 'Valor mínimo é R$ 1,00'
      : amountBRL > 50000
      ? 'Valor máximo é R$ 50.000,00'
      : '';

  const canGenerate = amountBRL >= 1 && amountBRL <= 50000 && !pixData && selectedAsset !== null;

  const handleGeneratePix = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockPix: PixPayload = {
        raw: `00020126580014br.gov.bcb.pix0136${Date.now()}@cryptowallet.com.br5204000053039865802BR5920CRYPTOWALLET LTDA6009SAO PAULO62070503***6304${Math.random()
          .toString(36)
          .substring(7)
          .toUpperCase()}`,
        chave: 'pix@cryptowallet.com.br',
        valor: totalAmount,
        descricao: `Depósito para ${selectedAsset} na rede ${selectedNetwork}`,
        txid: `PIX${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        beneficiario: 'CRYPTOWALLET LTDA',
        expiraEm: new Date(Date.now() + 1000 * 60 * 5),
        cidade: 'SAO PAULO',
      };

      setPixData(mockPix);
      setIsGenerating(false);
      toast({ title: 'PIX Gerado!', description: 'Pague usando seu aplicativo bancário' });
    }, 800);
  };

  const handleCancel = () => setPixData(null);

  const handleMarkAsPaid = async () => {
    if (!isConnected || !address) {
      toast({ title: 'Conecte sua carteira', description: 'Faça login para continuar', variant: 'destructive' });
      return;
    }
    if (!pixData) return;
    try {
      setIsSubmittingWebhook(true);
      const amountStr = String(Math.floor(estimatedAmount));
      await postPixWebhook({ wallet_address: address, amount: amountStr });
      toast({ title: 'Pagamento registrado', description: 'Acabamos de processar seu crédito on-chain' });
      navigate('/history');
    } catch (e: any) {
      const msg = String(e?.message || '');
      const description = /http|network|fetch|Failed to fetch/i.test(msg)
        ? 'Servidor indisponível, tente mais tarde'
        : 'Falha ao notificar o servidor';
      toast({ title: 'Erro', description, variant: 'destructive' });
    } finally {
      setIsSubmittingWebhook(false);
    }
  };

  const handleExpire = () =>
    toast({ title: 'PIX Expirado', description: 'Este PIX expirou. Gere um novo para continuar.', variant: 'destructive' });

  return (
    <div className="min-h-screen bg-background">
      {/* Full Backdrop Loading */}
      <FullBackdropLoading
        isOpen={isGenerating || isSubmittingWebhook}
        message={isGenerating ? 'Gerando Pix...' : 'Confirmando pagamento...'}
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
                      BRLA
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
            confirmLoading={isSubmittingWebhook}
          />
        )}
      </div>
    </div>
  );
}
