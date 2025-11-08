import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WagmiProvider } from "wagmi";
import { wagmiConfig, targetChain } from "./lib/wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { arbitrum as wagmiArbitrum, arbitrumSepolia as wagmiArbitrumSepolia } from "wagmi/chains";
import { getEnv } from "./lib/env";

const env = getEnv();
const ocChain = targetChain.id === 42161 ? wagmiArbitrum : wagmiArbitrumSepolia;

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={wagmiConfig}>
    <OnchainKitProvider apiKey={env.COINBASE_APP_ID} chain={ocChain} rpcUrl={env.ARBITRUM_RPC || targetChain.rpcUrls.default.http[0]!}>
      <App />
    </OnchainKitProvider>
  </WagmiProvider>
);
