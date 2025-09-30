import { DomainClientsConfig } from "@valence-protocol/domain-clients-react";
import { createConfig, http } from "wagmi";
import { createClient } from "viem";
import { mainnet, sepolia } from "wagmi/chains";

const localEthereum = {
  id: 31337,
  testnet: true,
  name: "Local Ethereum Devnet",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["http://localhost:8545"] },
  },
};

export const wagmiConfig = createConfig({
  chains: [localEthereum, sepolia, mainnet],
  ssr: true, // for nextjs hydration errors
  client({ chain }) {
    return createClient({
      chain,
      transport: http(chain.rpcUrls.default.http[0]),
    });
  },
});

export const domainClientsConfig: DomainClientsConfig = {
  evm: {
    wagmiConfig,
    defaultChainId: localEthereum.id,
  },
};
