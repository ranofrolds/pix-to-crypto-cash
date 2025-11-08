import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';

type Props = { children: ReactNode };

export default function RequireWallet({ children }: Props) {
  const { isConnected } = useAccount();
  const location = useLocation();

  if (!isConnected) {
    return <Navigate to="/" state={{ from: location, reason: 'wallet_required' }} replace />;
  }

  return <>{children}</>;
}

