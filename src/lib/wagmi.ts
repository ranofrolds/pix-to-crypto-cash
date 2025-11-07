import { createConfig, http } from "wagmi";
import { coinbaseWallet } from "@wagmi/connectors";
import { arbitrum, arbitrumSepolia } from "viem/chains";
import { defineChain, type Chain } from "viem";
import { getEnv } from "./env";

const env = getEnv();

// Resolve chain based on env
const resolvedChain: Chain =
  env.ARBITRUM_CHAIN_ID === arbitrum.id
    ? arbitrum
    : env.ARBITRUM_CHAIN_ID === arbitrumSepolia.id
    ? arbitrumSepolia
    : // fallback to Sepolia if unknown id
      arbitrumSepolia;

// Ensure we use the provided RPC for the target chain
const chainWithCustomRpc: Chain = defineChain({
  ...resolvedChain,
  rpcUrls: {
    ...resolvedChain.rpcUrls,
    default: { http: env.ARBITRUM_RPC ? [env.ARBITRUM_RPC] : resolvedChain.rpcUrls.default.http },
    public: { http: env.ARBITRUM_RPC ? [env.ARBITRUM_RPC] : resolvedChain.rpcUrls.public?.http ?? [] },
  },
});

export const targetChain = chainWithCustomRpc;

export const wagmiConfig = createConfig({
  chains: [targetChain],
  transports: {
    [targetChain.id]: http(targetChain.rpcUrls.default.http[0]!),
  },
  connectors: [
    coinbaseWallet({
      version: "4",
      preference: { options: "smartWalletOnly" },
      appName: "Pix to Crypto Cash",
      appLogoUrl: "/icon.png",
      // Optional: target chain id for initial provider
      chainId: targetChain.id,
      // COINBASE_APP_ID is configured in the dashboard (not required in SDK init here),
      // but we keep it available for future use if needed.
    }),
  ],
});
