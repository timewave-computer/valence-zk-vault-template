import { DomainClientsConfig } from '@valence-protocol/domain-clients-react';
import { mainnet, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';
import { createClient } from 'viem';
import { createEvmConfig } from '@valence-protocol/domain-clients-core/evm';

const localTestnet = {
    id: 31337,
    testnet: true,
    name: "Local Testnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ['http://localhost:8545'] },
    },
  };

const wagmiConfig = createEvmConfig({
    chains: [localTestnet,sepolia,mainnet],
    ssr: true, // required for Next.js, prevents hydration errors
    client: ({ chain }) => {
      return createClient({
        chain,
        transport: http(chain.rpcUrls.default.http[0]),
      });
    },
  });
  
   const evmConfig = {
    wagmiConfig,
    defaultChainId: localTestnet.id,
  };

export const domainClientsConfig: DomainClientsConfig = {
  evm: evmConfig,
};




