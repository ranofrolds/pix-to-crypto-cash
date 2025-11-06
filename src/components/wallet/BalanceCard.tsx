import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/format';

interface BalanceCardProps {
  title: string;
  amount: number;
  currency?: 'BRL' | 'USD';
  change?: number;
  isMain?: boolean;
}

export function BalanceCard({ title, amount, currency = 'BRL', change, isMain }: BalanceCardProps) {
  const isPositive = change && change > 0;

  return (
    <Card className={`p-6 ${isMain ? 'bg-gradient-primary text-primary-foreground border-0' : ''}`}>
      <p className={`text-sm ${isMain ? 'text-primary-foreground/80' : 'text-muted-foreground'} mb-2`}>
        {title}
      </p>
      <div className="flex items-baseline justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {formatCurrency(amount, currency)}
        </h2>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            isMain 
              ? 'text-primary-foreground/90' 
              : isPositive 
                ? 'text-accent' 
                : 'text-destructive'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(change).toFixed(2)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
}
