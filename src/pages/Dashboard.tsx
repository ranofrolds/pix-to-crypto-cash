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
import { mockBalance, mockTransactions, mockAssets } from '@/lib/mocks/fixtures';
import { Transaction } from '@/lib/types/wallet';
import { formatCurrency, formatCrypto } from '@/lib/utils/format';

export default function Dashboard() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const brlaAsset = mockAssets.find(asset => asset.symbol === 'BRLA');
  const totalBRLA = brlaAsset?.balance || 0;
  const recentTransactions = mockTransactions.slice(0, 5);

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
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">CryptoWallet</h1>
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

          <p className="text-xs text-muted-foreground mb-2">Total investido + Conta Multimoedas</p>
          
          <h3 className="text-4xl font-bold mb-6">
            {balanceVisible ? formatCurrency(totalBRLA, 'BRL') : 'R$ ••••••'}
          </h3>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="border-l-4 border-primary pl-3">
              <p className="text-xs text-muted-foreground mb-1">Criptomoedas</p>
              <p className="text-sm font-semibold">
                {balanceVisible ? formatCurrency(totalBRLA, 'BRL') : 'R$0,00'}
              </p>
            </div>
            <div className="pl-3">
              <p className="text-xs text-muted-foreground mb-1">Renda Fácil</p>
              <p className="text-sm font-semibold">
                {balanceVisible ? 'R$0,00' : 'R$0,00'}
              </p>
            </div>
            <div className="pl-3">
              <p className="text-xs text-muted-foreground mb-1">Cestas cripto</p>
              <p className="text-sm font-semibold">
                {balanceVisible ? 'R$0,00' : 'R$0,00'}
              </p>
            </div>
            <div className="pl-3">
              <p className="text-xs text-muted-foreground mb-1">Conta multimoedas</p>
              <p className="text-sm font-semibold">
                {balanceVisible ? 'R$0,00' : 'R$0,00'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 h-auto py-3 bg-accent hover:bg-accent/90"
              onClick={() => navigate('/deposit')}
            >
              Depositar
            </Button>
            <Button
              variant="secondary"
              className="flex-1 h-auto py-3"
              onClick={() => {/* TODO: implement withdraw */}}
            >
              Retirar fundos
            </Button>
          </div>
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
