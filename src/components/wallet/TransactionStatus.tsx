import { CheckCircle2, Clock, XCircle, Loader2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TransactionState = 
  | 'idle' 
  | 'reviewing' 
  | 'awaiting_signature' 
  | 'pending' 
  | 'success' 
  | 'failed';

interface TransactionStatusProps {
  state: TransactionState;
  className?: string;
  showLabel?: boolean;
}

const stateConfig: Record<TransactionState, {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  bgColor: string;
}> = {
  idle: {
    icon: FileText,
    label: 'Pronto',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  reviewing: {
    icon: FileText,
    label: 'Revisando',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  awaiting_signature: {
    icon: Loader2,
    label: 'Aguardando Assinatura',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  pending: {
    icon: Clock,
    label: 'Pendente',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  success: {
    icon: CheckCircle2,
    label: 'Concluído',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  failed: {
    icon: XCircle,
    label: 'Falhou',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
};

export function TransactionStatus({ state, className, showLabel = true }: TransactionStatusProps) {
  const config = stateConfig[state];
  const Icon = config.icon;
  const isAnimated = state === 'awaiting_signature' || state === 'pending';

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className={cn('p-1.5 rounded-lg', config.bgColor)}>
        <Icon 
          className={cn('w-4 h-4', config.color, isAnimated && 'animate-spin')} 
        />
      </div>
      {showLabel && (
        <span className={cn('text-sm font-medium', config.color)}>
          {config.label}
        </span>
      )}
    </div>
  );
}
