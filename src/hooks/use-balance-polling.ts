import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBalance } from '@/lib/api';

interface BalancePollingResult {
  balanceChanged: boolean;
  newBalance: number;
  isPolling: boolean;
  timeoutReached: boolean;
  stopPolling: () => void;
}

interface BackendBalanceResponse {
  success: boolean;
  data: {
    address: string;
    balance: string;
    balanceRaw: string;
  };
}

const POLLING_INTERVAL = 3000; // 3 seconds
const POLLING_TIMEOUT = 300000; // 5 minutes

/**
 * Hook para fazer long polling do balance até que ele mude
 * @param address - Endereço da wallet
 * @param initialBalance - Balance inicial para comparação
 * @param enabled - Se o polling está ativo
 */
export function useBalancePolling(
  address: string | undefined,
  initialBalance: number,
  enabled: boolean
): BalancePollingResult {
  const [balanceChanged, setBalanceChanged] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [isPolling, setIsPolling] = useState(enabled);
  const startTimeRef = useRef<number>(Date.now());
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['balance-polling', address],
    queryFn: async () => {
      if (!address) throw new Error('Sem endereço');
      return getBalance(address);
    },
    enabled: isPolling && !!address,
    refetchInterval: POLLING_INTERVAL,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const stopPolling = () => {
    setIsPolling(false);
  };

  // Extract current balance from response
  const currentBalance = (() => {
    if (!data) return 0;
    const backendResponse = data as unknown as BackendBalanceResponse;
    const balance = backendResponse?.data?.balance;
    const n = typeof balance === 'string' ? Number(balance) : (balance as number | undefined);
    return Number.isFinite(n as number) ? (n as number) : 0;
  })();

  useEffect(() => {
    if (!isPolling) return;

    // Check if balance changed
    if (currentBalance > initialBalance && !balanceChanged) {
      setBalanceChanged(true);
      setIsPolling(false);

      // Invalidate balance cache to update Dashboard
      queryClient.invalidateQueries({ queryKey: ['backend-balance', address] });
    }

    // Check timeout
    const elapsed = Date.now() - startTimeRef.current;
    if (elapsed >= POLLING_TIMEOUT && !timeoutReached) {
      setTimeoutReached(true);
      setIsPolling(false);
    }
  }, [currentBalance, initialBalance, isPolling, balanceChanged, timeoutReached, address, queryClient]);

  // Reset when enabled changes
  useEffect(() => {
    if (enabled) {
      setBalanceChanged(false);
      setTimeoutReached(false);
      setIsPolling(true);
      startTimeRef.current = Date.now();
    }
  }, [enabled]);

  return {
    balanceChanged,
    newBalance: currentBalance,
    isPolling,
    timeoutReached,
    stopPolling,
  };
}
