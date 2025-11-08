import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, ExternalLink, Copy, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/lib/utils/format';
import { useAccount } from 'wagmi';
import { getWalletTransactions } from '@/lib/api';
import { transformBackendTransaction } from '@/lib/utils/transform-transactions';

interface ReceiptData {
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  walletAddress: string;
  amount: string;
  explorer: string;
  timestamp?: string;
}

export default function Receipt() {
  const navigate = useNavigate();
  const { txHash } = useParams<{ txHash: string }>();
  const { address } = useAccount();
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReceiptData = async () => {
      // Try to get receipt data from sessionStorage first
      const storedData = sessionStorage.getItem('receipt_data');
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          setReceiptData(data);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('Failed to parse receipt data', e);
        }
      }

      // Fallback: fetch from backend if sessionStorage is empty
      if (address && txHash) {
        try {
          const transactionsResponse = await getWalletTransactions(address);
          const transactions = transactionsResponse?.data?.transactions || [];

          // Find transaction by hash
          const transaction = transactions.find((tx) => tx.hash === txHash);

          if (transaction) {
            const transformedTx = transformBackendTransaction(transaction);

            const data: ReceiptData = {
              txHash: transformedTx.hash,
              blockNumber: 0,
              gasUsed: '0',
              walletAddress: address,
              amount: String(transformedTx.amountBRL),
              explorer: transformedTx.explorerUrl,
              timestamp: transformedTx.createdAt.toISOString(),
            };

            setReceiptData(data);
          }
        } catch (error) {
          console.error('Failed to fetch transaction:', error);
        }
      }

      setIsLoading(false);
    };

    fetchReceiptData();
  }, [txHash, address]);

  const handleCopyTxHash = async () => {
    if (!receiptData?.txHash) return;
    try {
      await copyToClipboard(receiptData.txHash);
      toast({ title: 'Copiado!', description: 'Hash da transação copiado para área de transferência' });
    } catch {
      toast({ title: 'Erro', description: 'Falha ao copiar', variant: 'destructive' });
    }
  };

  const handleViewExplorer = () => {
    if (receiptData?.explorer) {
      window.open(receiptData.explorer, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 bg-gradient-card border-border/50 text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando recibo...</p>
        </Card>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 bg-gradient-card border-border/50 text-center">
          <p className="text-muted-foreground mb-4">Recibo não encontrado</p>
          <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
        </Card>
      </div>
    );
  }

  const formattedDate = receiptData.timestamp
    ? new Date(receiptData.timestamp).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Comprovante</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Success Header */}
        <Card className="p-8 bg-gradient-card border-border/50 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Transação concluída</h2>
          <p className="text-muted-foreground">
            Seu depósito foi processado com sucesso!
          </p>
        </Card>

        {/* Transaction Details */}
        <Card className="p-6 bg-gradient-card border-border/50">
          <h3 className="text-lg font-semibold mb-6 pb-3 border-b border-border/50">
            Detalhes da transação
          </h3>

          <div className="space-y-4">
            {/* Data e hora */}
            <div className="flex justify-between items-center py-3 border-b border-border/30">
              <span className="text-muted-foreground">Data e hora</span>
              <span className="font-medium">{formattedDate}</span>
            </div>

            {/* Tipo */}
            <div className="flex justify-between items-center py-3 border-b border-border/30">
              <span className="text-muted-foreground">Tipo</span>
              <span className="font-medium">Depósito em reais para BRLA</span>
            </div>

            {/* Valor de origem */}
            <div className="flex justify-between items-center py-3 border-b border-border/30">
              <span className="text-muted-foreground">Valor de origem</span>
              <span className="font-medium">R$ {Number(receiptData.amount).toFixed(2)}</span>
            </div>

            {/* Valor de destino */}
            <div className="flex justify-between items-center py-3 border-b border-border/30">
              <span className="text-muted-foreground">Valor de destino</span>
              <span className="font-medium">{receiptData.amount} BRLA</span>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center py-3 border-b border-border/30">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-green-500">Transação concluída.</span>
            </div>

            {/* Gas Used */}
            <div className="flex justify-between items-center py-3 border-b border-border/30">
              <span className="text-muted-foreground">Gas usado</span>
              <span className="font-medium font-mono">{Number(receiptData.gasUsed).toLocaleString()}</span>
            </div>

            {/* Transaction Hash */}
            <div className="flex justify-between items-start py-3">
              <span className="text-muted-foreground">Transação</span>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm break-all text-right max-w-[200px]">
                    {receiptData.txHash.slice(0, 10)}...{receiptData.txHash.slice(-8)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={handleCopyTxHash}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewExplorer}
                  className="gap-2"
                >
                  Ver recibo
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/history')}
          >
            Ver histórico
          </Button>
          <Button
            className="flex-1"
            onClick={() => navigate('/dashboard')}
          >
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
}
