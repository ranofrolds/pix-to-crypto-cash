import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TransactionItem } from '@/components/wallet/TransactionItem';
import { EmptyState } from '@/components/ui/empty-state';
import { TransactionStatus, Transaction } from '@/lib/types/wallet';
import { History as HistoryIcon } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useWalletTransactions } from '@/hooks/use-wallet-transactions';
import { transformBackendTransactions } from '@/lib/utils/transform-transactions';
import { Skeleton } from '@/components/ui/skeleton';

export default function History() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { data: transactionsData, isLoading } = useWalletTransactions(address);
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');

  // Transform backend transactions to UI format
  const allTransactions: Transaction[] = transactionsData?.data?.transactions
    ? transformBackendTransactions(transactionsData.data.transactions)
    : [];

  const filteredTransactions = allTransactions.filter((tx) =>
    statusFilter === 'all' ? true : tx.status === statusFilter
  );

  const statusCounts = {
    all: allTransactions.length,
    pending: allTransactions.filter((tx) => tx.status === 'pending').length,
    success: allTransactions.filter((tx) => tx.status === 'success').length,
    failed: allTransactions.filter((tx) => tx.status === 'failed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Histórico</h1>
              <p className="text-sm text-muted-foreground">Todas as transações</p>
            </div>
          </div>
        </div>
      </header> 

      <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Transactions List */}
        <Card className="p-6 bg-gradient-card border-border/50">
          <h2 className="text-lg font-semibold mb-4">Transações</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-14 w-full" />
                </div>
              ))}
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} className="mb-2" />
            ))
          ) : (
            <EmptyState
              icon={HistoryIcon}
              title="Nenhuma transação encontrada"
              description={!address ? "Conecte sua carteira para ver suas transações" : "Não há transações com este filtro"}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
