import { useMemo, useState } from 'react';
import { Wallet as WalletIcon, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { targetChain } from '@/lib/wagmi';
import { toast } from 'sonner';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

interface WalletConnectButtonProps {
  onConnect?: () => void;
  variant?: 'default' | 'outline';
}

function truncateAddress(addr?: string) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function WalletConnectButton({ onConnect, variant = 'default' }: WalletConnectButtonProps) {
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const coinbaseConnector = useMemo(
    () => connectors.find((c) => c.id === 'coinbaseWalletSDK'),
    [connectors]
  );

  const handleLogin = async () => {
    try {
      if (!coinbaseConnector) {
        toast.error('Coinbase indisponível');
        return;
      }
      await connect({ connector: coinbaseConnector, chainId: targetChain.id, instantOnboarding: true });
      onConnect?.();
      setIsDialogOpen(false);
    } catch (err: any) {
      const message = String(err?.message || '');
      if (/rejected|denied|closed|cancel/i.test(message)) {
        toast.message('Login cancelado', { description: 'Tentar novamente' });
      } else {
        toast.error('Falha ao conectar', { description: 'RPC indisponível, tente mais tarde' });
      }
    }
  };

  const handleSwitch = async () => {
    try {
      await switchChainAsync({ chainId: targetChain.id });
    } catch (err: any) {
      const message = String(err?.message || '');
      if (/rejected|denied/i.test(message)) {
        toast.message('Troca de rede cancelada');
      } else {
        toast.error('Não foi possível trocar a rede');
      }
    }
  };

  if (!isConnected) {
    return (
      <ConnectWallet
        disconnectedLabel={
          <span className="inline-flex items-center gap-2">
            <WalletIcon className="w-4 h-4" /> Entrar com Coinbase (Google/Apple/Passkey)
          </span>
        }
        className="px-3 py-2 rounded-md border border-border bg-secondary/50 hover:bg-secondary transition-colors"
        onConnect={onConnect}
      />
    );
  }

  const wrongNetwork = chainId !== targetChain.id;

  return (
    <div className="flex items-center gap-2">
      {wrongNetwork ? (
        <Button variant="destructive" size="sm" onClick={handleSwitch} disabled={isSwitching}>
          {isSwitching ? 'Trocando...' : 'Trocar para Arbitrum'}
        </Button>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-9 font-mono">
            <WalletIcon className="w-3.5 h-3.5" />
            <span className="text-xs">{truncateAddress(address)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => disconnect()} className="text-destructive">
            Desconectar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
