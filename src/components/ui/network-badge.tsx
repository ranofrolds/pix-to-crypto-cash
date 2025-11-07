import { Badge } from '@/components/ui/badge';
import { NetworkType } from '@/lib/types/wallet';

interface NetworkBadgeProps {
  network: NetworkType;
  showFullName?: boolean;
}

const networkConfig: Record<NetworkType, { color: string; label: string; fullLabel: string }> = {
  TRON: {
    color: 'border-[hsl(var(--network-tron))] text-[hsl(var(--network-tron))] bg-[hsl(var(--network-tron)/0.1)]',
    label: 'TRX',
    fullLabel: 'TRON',
  },
  ERC20: {
    color: 'border-[hsl(var(--network-ethereum))] text-[hsl(var(--network-ethereum))] bg-[hsl(var(--network-ethereum)/0.1)]',
    label: 'ETH',
    fullLabel: 'Ethereum',
  },
  BTC: {
    color: 'border-[hsl(var(--network-bitcoin))] text-[hsl(var(--network-bitcoin))] bg-[hsl(var(--network-bitcoin)/0.1)]',
    label: 'BTC',
    fullLabel: 'Bitcoin',
  },
  PIX: {
    color: 'border-accent text-accent bg-accent/10',
    label: 'PIX',
    fullLabel: 'PIX',
  },
  BASE_SEPOLIA: {
    color: 'border-primary text-primary bg-primary/10',
    label: 'BASE',
    fullLabel: 'Base (Sepolia)',
  },
};

export function NetworkBadge({ network, showFullName = false }: NetworkBadgeProps) {
  const config = networkConfig[network];

  return (
    <Badge variant="outline" className={`${config.color} font-mono text-xs px-2 py-0.5`}>
      {showFullName ? config.fullLabel : config.label}
    </Badge>
  );
}
