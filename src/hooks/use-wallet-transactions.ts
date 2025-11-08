import { useQuery } from "@tanstack/react-query";
import { getWalletTransactions } from "@/lib/api";

export function useWalletTransactions(address?: string) {
  return useQuery({
    queryKey: ["wallet-transactions", address],
    queryFn: async () => {
      if (!address) throw new Error("Sem endereço");
      return getWalletTransactions(address);
    },
    enabled: !!address,
    staleTime: 3000_000, // 30 seconds
    refetchInterval: 6000_000, // Refetch every 60 seconds
    refetchOnWindowFocus: true,
  });
}
