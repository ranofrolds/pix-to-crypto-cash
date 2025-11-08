import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NetworkBadge } from '@/components/ui/network-badge';
import { ExplorerLink } from '@/components/wallet/ExplorerLink';
import { formatCurrency, formatRelativeTime, formatCrypto, truncateAddress } from '@/lib/utils/format';
import { Transaction } from '@/lib/types/wallet';
import { cn } from '@/lib/utils';
interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
  className?: string;
}

const statusMap: Record<Transaction['status'], 'pending' | 'success' | 'failed'> = {
  pending: 'pending',
  success: 'success',
  failed: 'failed',
};

export function TransactionItem({ transaction, onClick, className }: TransactionItemProps) {
  const isDeposit = transaction.type === 'deposit';
  const DirectionIcon = isDeposit ? ArrowDownLeft : ArrowUpRight;

  return (
    <div
      className={cn("flex items-start justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer border border-border/50", className)}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className={`w-10 h-10 rounded-lg ${isDeposit ? 'bg-accent/10' : 'bg-primary/10'} flex items-center justify-center flex-shrink-0`}>
          <DirectionIcon className={`w-5 h-5 ${isDeposit ? 'text-accent' : 'text-primary'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold capitalize">{transaction.type}</p>
            <Badge variant="secondary" className="text-xs font-mono">
              {transaction.method}
            </Badge>
            {transaction.network && <NetworkBadge network={transaction.network} />}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-muted-foreground">{formatRelativeTime(transaction.createdAt)}</p>
            {transaction.hash && transaction.explorerUrl && (
              <>
                <span className="text-muted-foreground">•</span>
                <ExplorerLink url={transaction.explorerUrl}>
                  <span className="text-xs font-mono">{truncateAddress(transaction.hash, 4, 4)}</span>
                </ExplorerLink>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <p className="font-semibold font-mono mb-1">
          {isDeposit ? '+' : '-'}
          {formatCrypto(transaction.amountAsset, transaction.asset)}
        </p>
        {transaction.amountBRL && (
          <p className="text-sm text-muted-foreground mb-2">{formatCurrency(transaction.amountBRL)}</p>
        )}
      </div>
    </div>
  );
}
