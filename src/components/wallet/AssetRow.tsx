import { Badge } from '@/components/ui/badge';
import { formatCrypto, formatCurrency } from '@/lib/utils/format';
import { Asset } from '@/lib/types/wallet';

interface AssetRowProps {
  asset: Asset;
  onClick?: () => void;
}

export function AssetRow({ asset, onClick }: AssetRowProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
          {asset.symbol.slice(0, 1)}
        </div>
        <div>
          <p className="font-semibold">{asset.symbol}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{asset.name}</p>
            <Badge variant="secondary" className="text-xs">
              {asset.network}
            </Badge>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">{formatCrypto(asset.balance, asset.symbol)}</p>
        <p className="text-sm text-muted-foreground">{formatCurrency(asset.balanceUSD, 'USD')}</p>
      </div>
    </div>
  );
}
