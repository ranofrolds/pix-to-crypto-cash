import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TransactionItem } from '@/components/wallet/TransactionItem';
import { EmptyState } from '@/components/ui/empty-state';
import { mockTransactions } from '@/lib/mocks/fixtures';
import { TransactionStatus } from '@/lib/types/wallet';
import { History as HistoryIcon } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');

  const filteredTransactions = mockTransactions.filter((tx) =>
    statusFilter === 'all' ? true : tx.status === statusFilter
  );

  const statusCounts = {
    all: mockTransactions.length,
    pending: mockTransactions.filter((tx) => tx.status === 'pending').length,
    success: mockTransactions.filter((tx) => tx.status === 'success').length,
    failed: mockTransactions.filter((tx) => tx.status === 'failed').length,
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

      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtrar por status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'success', 'failed'] as const).map((status) => (
              <Badge
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1.5"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'Todas' : status === 'pending' ? 'Pendente' : status === 'success' ? 'Concluído' : 'Falhou'}
                <span className="ml-1.5 opacity-70">({statusCounts[status]})</span>
              </Badge>
            ))}
          </div>
        </Card>

        {/* Transactions List */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Transações {statusFilter !== 'all' && `(${filteredTransactions.length})`}
          </h2>
          <div className="space-y-2">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))
            ) : (
              <EmptyState
                icon={HistoryIcon}
                title="Nenhuma transação encontrada"
                description="Não há transações com este filtro"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
