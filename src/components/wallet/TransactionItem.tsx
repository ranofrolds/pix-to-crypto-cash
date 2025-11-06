import { CheckCircle2, Clock, XCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatRelativeTime, formatCrypto } from '@/lib/utils/format';
import { Transaction } from '@/lib/types/wallet';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pendente',
    variant: 'secondary' as const,
    color: 'text-warning',
  },
  success: {
    icon: CheckCircle2,
    label: 'Concluído',
    variant: 'secondary' as const,
    color: 'text-accent',
  },
  failed: {
    icon: XCircle,
    label: 'Falhou',
    variant: 'destructive' as const,
    color: 'text-destructive',
  },
};

export function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const status = statusConfig[transaction.status];
  const StatusIcon = status.icon;
  const isDeposit = transaction.type === 'deposit';
  const DirectionIcon = isDeposit ? ArrowDownLeft : ArrowUpRight;

  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${isDeposit ? 'bg-accent/10' : 'bg-primary/10'} flex items-center justify-center`}>
          <DirectionIcon className={`w-5 h-5 ${isDeposit ? 'text-accent' : 'text-primary'}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold capitalize">{transaction.type}</p>
            <Badge variant="secondary" className="text-xs">
              {transaction.method}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{formatRelativeTime(transaction.createdAt)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">
          {isDeposit ? '+' : '-'}
          {formatCrypto(transaction.amountAsset, transaction.asset)}
        </p>
        {transaction.amountBRL && (
          <p className="text-sm text-muted-foreground">{formatCurrency(transaction.amountBRL)}</p>
        )}
        <div className="flex items-center gap-1 justify-end mt-1">
          <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
          <span className={`text-xs ${status.color}`}>{status.label}</span>
        </div>
      </div>
    </div>
  );
}
