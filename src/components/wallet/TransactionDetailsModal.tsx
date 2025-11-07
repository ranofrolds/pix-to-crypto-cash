import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Transaction } from '@/lib/types/wallet';
import { formatDate, formatCurrency, formatCrypto } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { NetworkBadge } from '@/components/ui/network-badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsModal({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const statusMap = {
    success: 'Transação concluída',
    pending: 'Transação pendente',
    failed: 'Transação falhou',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da transação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Data e hora</span>
            <span className="text-sm font-medium text-right">
              {formatDate(transaction.createdAt)}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Tipo</span>
            <span className="text-sm font-medium text-right">{transaction.method}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Valor de origem</span>
            <span className="text-sm font-medium text-right">
              {transaction.amountBRL ? formatCurrency(transaction.amountBRL) : '-'}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Valor de destino</span>
            <span className="text-sm font-medium text-right">
              {formatCrypto(transaction.amountAsset, transaction.asset)}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Provedor</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{transaction.asset}</span>
              {transaction.network && <NetworkBadge network={transaction.network} />}
            </div>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="text-sm font-medium text-right">
              {statusMap[transaction.status]}
            </span>
          </div>

          {transaction.hash && (
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Transação</span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-sm font-medium"
                onClick={() => {
                  // In real app, would open block explorer
                  window.open(`https://polygonscan.com/tx/${transaction.hash}`, '_blank');
                }}
              >
                Ver recibo
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <Button onClick={() => onOpenChange(false)} className="w-full">
          Fechar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
