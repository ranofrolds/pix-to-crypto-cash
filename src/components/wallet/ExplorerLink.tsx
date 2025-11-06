import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NetworkType } from '@/lib/types/wallet';

interface ExplorerLinkProps {
  hash: string;
  network: NetworkType;
  type?: 'tx' | 'address';
  children?: React.ReactNode;
}

const explorerUrls: Record<NetworkType, string> = {
  TRON: 'https://tronscan.org/#',
  ERC20: 'https://etherscan.io',
  BTC: 'https://blockchair.com/bitcoin',
  PIX: '#',
};

export function ExplorerLink({ hash, network, type = 'tx', children }: ExplorerLinkProps) {
  const baseUrl = explorerUrls[network];
  const path = type === 'tx' ? 'transaction' : 'address';
  const url = network === 'PIX' ? '#' : `${baseUrl}/${path}/${hash}`;

  if (network === 'PIX') return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 h-auto p-0 text-primary hover:text-primary/80"
      asChild
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        {children || 'Ver no Explorer'}
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </Button>
  );
}
