import { useState } from 'react';
import { ChevronDown, Wallet as WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NetworkBadge } from '@/components/ui/network-badge';
import { NetworkType } from '@/lib/types/wallet';

interface WalletConnectButtonProps {
  onConnect?: () => void;
  variant?: 'default' | 'outline';
}

export function WalletConnectButton({ onConnect, variant = 'default' }: WalletConnectButtonProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('TRON');

  const handleConnect = () => {
    setIsConnected(true);
    onConnect?.();
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const networks: NetworkType[] = ['TRON', 'ERC20', 'BTC'];

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} variant={variant} className="gap-2">
        <WalletIcon className="w-4 h-4" />
        Conectar Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Network Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <NetworkBadge network={selectedNetwork} />
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {networks.map((network) => (
            <DropdownMenuItem
              key={network}
              onClick={() => setSelectedNetwork(network)}
              className="gap-2"
            >
              <NetworkBadge network={network} showFullName />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Wallet Address */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-9 font-mono">
            <WalletIcon className="w-3.5 h-3.5" />
            <span className="text-xs">0x742d...f44e</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
            Desconectar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
