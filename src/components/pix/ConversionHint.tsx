import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatCrypto } from '@/lib/utils/format';
import { AssetSymbol } from '@/lib/types/wallet';

interface ConversionHintProps {
  amountBRL: number;
  asset: AssetSymbol;
  estimatedAmount: number;
  fee: number;
  isLoading?: boolean;
}

export function ConversionHint({ amountBRL, asset, estimatedAmount, fee, isLoading }: ConversionHintProps) {
  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-card border-primary/20">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-4 w-48" />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-primary/20 shadow-glow">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Você receberá aproximadamente</p>
        
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Valor PIX</p>
            <p className="text-xl font-bold font-mono">{formatCurrency(amountBRL)}</p>
          </div>
          
          <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
          
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Você recebe</p>
            <p className="text-xl font-bold text-accent font-mono">
              {formatCrypto(estimatedAmount, asset)}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa de processamento</span>
            <span className="font-medium font-mono">{formatCurrency(fee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimativa de gas</span>
            <span className="font-medium font-mono text-warning">~0.5 TRX</span>
          </div>
          <div className="flex justify-between text-base font-semibold pt-2 border-t border-border/30">
            <span>Total a pagar</span>
            <span className="font-mono">{formatCurrency(amountBRL + fee)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
