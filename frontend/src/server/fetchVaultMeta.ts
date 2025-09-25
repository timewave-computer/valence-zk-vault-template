"use server";
import { readContracts } from "@wagmi/core";
import { wagmiConfig } from "@/config";
import { erc4626Abi, erc20Abi, type Address } from "viem";
import vaultAddresses from "../../vaults.config.json";

export type VaultMeta = {
  vault: {
    address: Address;
    decimals: number;
    totalAssets: bigint;
  };
  asset: {
    address: Address;
    decimals: number;
    name: string;
    symbol: string;
  };
};

export async function fetchVaultsMetadata(): Promise<VaultMeta[]> {
  const vaultMeta = await Promise.all(
    vaultAddresses.map(async (address: string): Promise<VaultMeta> => {
      const vaultAddress = address as Address;

      const vaultContractQueries = await readContracts(wagmiConfig, {
        contracts: [
          {
            address: vaultAddress,
            abi: erc4626Abi,
            functionName: "asset",
            args: [],
          },
          {
            address: vaultAddress,
            abi: erc20Abi,
            functionName: "decimals",
            args: [],
          },
          {
            address: vaultAddress,
            abi: erc4626Abi,
            functionName: "totalAssets",
            args: [],
          },
        ],
      });

      const assetAddress = vaultContractQueries[0].result as Address;
      const decimals = vaultContractQueries[1].result as number;
      const totalAssets = vaultContractQueries[2].result as bigint;

      const assetContractQueries = await readContracts(wagmiConfig, {
        contracts: [
          {
            address: assetAddress,
            functionName: "decimals",
            abi: erc20Abi,
          },
          {
            address: assetAddress,
            functionName: "name",
            abi: erc20Abi,
          },
          {
            address: assetAddress,
            functionName: "symbol",
            abi: erc20Abi,
          },
        ],
      });
      const assetDecimals = assetContractQueries[0].result as number;
      const assetName = assetContractQueries[1].result as string;
      const assetSymbol = assetContractQueries[2].result as string;

      return {
        vault: {
          address: vaultAddress,
          decimals,
          totalAssets,
        },
        asset: {
          address: assetAddress,
          decimals: assetDecimals,
          name: assetName,
          symbol: assetSymbol,
        },
      };
    }),
  );
  return vaultMeta;
}
