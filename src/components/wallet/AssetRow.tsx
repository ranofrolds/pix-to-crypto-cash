import { NetworkBadge } from '@/components/ui/network-badge';
import { formatCrypto, formatCurrency } from '@/lib/utils/format';
import { Asset } from '@/lib/types/wallet';

interface AssetRowProps {
  asset: Asset;
  onClick?: () => void;
}

export function AssetRow({ asset, onClick }: AssetRowProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer border border-border/50"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
          {asset.symbol.slice(0, 1)}
        </div>
        <div>
          <p className="font-semibold text-base">{asset.symbol}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{asset.name}</p>
            <NetworkBadge network={asset.network} />
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold font-mono text-base">{formatCrypto(asset.balance, asset.symbol)}</p>
        <p className="text-sm text-muted-foreground">{formatCurrency(asset.balanceUSD, 'USD')}</p>
      </div>
    </div>
  );
}
