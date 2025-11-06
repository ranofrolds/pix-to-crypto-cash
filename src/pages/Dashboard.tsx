import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowUpRight, History, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BalanceCard } from '@/components/wallet/BalanceCard';
import { TransactionItem } from '@/components/wallet/TransactionItem';
import { EmptyState } from '@/components/ui/empty-state';
import { mockBalance, mockTransactions, mockAssets } from '@/lib/mocks/fixtures';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const totalUSD = mockAssets.reduce((sum, asset) => sum + asset.balanceUSD, 0);
  const recentTransactions = mockTransactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">CryptoWallet</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <BalanceCard
            title="Saldo Total"
            amount={totalUSD}
            currency="USD"
            change={5.2}
            isMain
          />
          <BalanceCard
            title="Saldo em Reais"
            amount={mockBalance.BRL}
            currency="BRL"
            change={-1.3}
          />
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              className="h-auto py-4 justify-start gap-3"
              onClick={() => navigate('/deposit')}
            >
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Depositar</p>
                <p className="text-xs opacity-90">Cripto ou PIX</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 justify-start gap-3"
              onClick={() => navigate('/history')}
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Histórico</p>
                <p className="text-xs text-muted-foreground">Ver todas</p>
              </div>
            </Button>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
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
                  onClick={() => navigate('/history')}
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
    </div>
  );
}
