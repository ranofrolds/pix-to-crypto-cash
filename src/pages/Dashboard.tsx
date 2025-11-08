import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowUpRight, History, Eye, EyeOff, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { BalanceCard } from '@/components/wallet/BalanceCard';
import { TransactionItem } from '@/components/wallet/TransactionItem';
import { EmptyState } from '@/components/ui/empty-state';
import { TransactionDetailsModal } from '@/components/wallet/TransactionDetailsModal';
import { Transaction } from '@/lib/types/wallet';
import { formatCurrency } from '@/lib/utils/format';
import { useAccount } from 'wagmi';
import { useBackendBalance } from '@/hooks/use-backend-balance';
import { useWalletTransactions } from '@/hooks/use-wallet-transactions';
import { transformBackendTransactions } from '@/lib/utils/transform-transactions';

interface BackendBalanceResponse {
  success: boolean;
  data: {
    address: string;
    balance: string;
    balanceRaw: string;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { data, isLoading, error } = useBackendBalance(address);
  const { data: transactionsData, isLoading: isLoadingTransactions } = useWalletTransactions(address);

  // Extract balance from backend response: { success: true, data: { balance: "21.0" } }
  const totalBRLA = (() => {
    if (!data) return 0;
    const backendResponse = data as unknown as BackendBalanceResponse;
    const balance = backendResponse?.data?.balance;
    const n = typeof balance === 'string' ? Number(balance) : (balance as number | undefined);
    return Number.isFinite(n as number) ? (n as number) : 0;
  })();

  // Transform backend transactions to UI format and get recent 3
  const recentTransactions: Transaction[] = transactionsData?.data?.transactions
    ? transformBackendTransactions(transactionsData.data.transactions).slice(0, 3)
    : [];

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/refuconnect-logo.png"
                alt="RefuConnect"
                className="h-8 w-auto"
              />
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Section */}
        <Card className="p-6 bg-gradient-card border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-sm text-muted-foreground">Visão geral</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setBalanceVisible(!balanceVisible)}
            >
              {balanceVisible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mb-2">Total investido</p>
          
          <h3 className="text-4xl font-bold mb-6">
            {isLoading ? '---' : balanceVisible ? formatCurrency(totalBRLA, 'BRL') : 'R$ ***'}
          </h3>

          <Button
            className="flex-1 h-12 py-3 text-lg"
            size="lg"
            onClick={() => navigate('/deposit')} disabled={!isConnected}
          >
            Depositar
          </Button>
        </Card>


        {/* Recent Transactions */}
        <Card className="p-6 bg-gradient-card border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Transações Recentes</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/history')}
            >
              Ver todas
            </Button>
          </div>
          <div className="space-y-2">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  onClick={() => handleTransactionClick(tx)}
                />
              ))
            ) : (
              <EmptyState
                icon={History}
                title="Nenhuma transação"
                description="Suas transações aparecerão aqui"
                action={{
                  label: 'Fazer primeiro depósito',
                  onClick: () => navigate('/deposit'),
                }}
              />
            )}
          </div>
        </Card>
      </div>

      <TransactionDetailsModal
        transaction={selectedTransaction}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}


