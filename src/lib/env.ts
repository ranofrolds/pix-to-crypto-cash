// Simple env reader with minimal validation for client-side usage

export type AppEnv = {
  ARBITRUM_CHAIN_ID: number;
  ARBITRUM_RPC: string;
  CONTRACT_ADDRESS?: string;
  COINBASE_APP_ID?: string;
  BACKEND_URL?: string;
};

function readNumber(value: string | undefined, fallback?: number): number {
  const v = value?.trim();
  if (!v) return fallback ?? NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback ?? NaN;
}

export function getEnv(): AppEnv {
  const chainId = readNumber(import.meta.env.VITE_ARBITRUM_CHAIN_ID, 421614);
  const rpc = (import.meta.env.VITE_ARBITRUM_RPC as string | undefined)?.trim();
  const contract = (import.meta.env.VITE_CONTRACT_ADDRESS as string | undefined)?.trim();
  const appId = (import.meta.env.VITE_COINBASE_APP_ID as string | undefined)?.trim();
  const backend = (import.meta.env.VITE_BACKEND_URL as string | undefined)?.trim();

  if (!rpc) {
    // Keep error minimal and actionable
    // eslint-disable-next-line no-console
    console.error("VITE_ARBITRUM_RPC ausente. Defina nas variáveis do Vercel.");
  }

  return {
    ARBITRUM_CHAIN_ID: chainId,
    ARBITRUM_RPC: rpc ?? "",
    CONTRACT_ADDRESS: contract,
    COINBASE_APP_ID: appId,
    BACKEND_URL: backend ?? "http://localhost:3000",
  };
}
