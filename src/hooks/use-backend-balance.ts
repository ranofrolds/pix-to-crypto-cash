import { useQuery } from "@tanstack/react-query";
import { getBalance } from "@/lib/api";

export function useBackendBalance(address?: string) {
  return useQuery({
    queryKey: ["backend-balance", address],
    queryFn: async () => {
      if (!address) throw new Error("Sem endereço");
      return getBalance(address);
    },
    enabled: !!address,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
}

