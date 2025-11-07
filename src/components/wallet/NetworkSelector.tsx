import { Badge } from '@/components/ui/badge';
import { NetworkType } from '@/lib/types/wallet';

interface NetworkSelectorProps {
  networks: NetworkType[];
  selected: NetworkType;
  onChange: (network: NetworkType) => void;
}

const networkLabels: Record<NetworkType, string> = {
  TRON: 'TRON (TRC20)',
  ERC20: 'Ethereum (ERC20)',
  BTC: 'Bitcoin',
  PIX: 'PIX',
  BASE_SEPOLIA: 'Base (Sepolia)',
  ARBITRUM_SEPOLIA: 'Arbitrum (Sepolia)',
  ARBITRUM_ONE: 'Arbitrum One',
};

export function NetworkSelector({ networks, selected, onChange }: NetworkSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Rede</label>
      <div className="flex flex-wrap gap-2">
        {networks.map((network) => (
          <Badge
            key={network}
            variant={selected === network ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => onChange(network)}
          >
            {networkLabels[network]}
          </Badge>
        ))}
      </div>
    </div>
  );
}
