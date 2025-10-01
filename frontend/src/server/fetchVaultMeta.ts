"use server";
import { readContracts, type Config } from "@wagmi/core";
import { erc4626Abi, erc20Abi, type Address } from "viem";

export type VaultMeta = {
  vault: {
    address: Address;
    name: string;
    decimals: number;
    totalAssets: bigint;
    apr: number;
  };
  asset: {
    address: Address;
    decimals: number;
    name: string;
    symbol: string;
  };
};

export async function fetchVaultData(
  wagmiConfig: Config,
  vaultAddress: Address,
): Promise<VaultMeta> {
  try {
  
  const vaultData = await readContracts(wagmiConfig, {
    allowFailure: false,
    contracts: [
      {
        address: vaultAddress,
        abi: erc20Abi,
        functionName: "name",
        args: [],
      },
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

  const name = vaultData[0]
  const assetAddress = vaultData[1]
  const decimals = vaultData[2]
  const totalAssets = vaultData[3]


  const assetData = await readContracts(wagmiConfig, {
    allowFailure: false,
    contracts: [
      { address: assetAddress, abi: erc20Abi, functionName: "decimals" },
      { address: assetAddress, abi: erc20Abi, functionName: "name" },
      { address: assetAddress, abi: erc20Abi, functionName: "symbol" },
    ],
  });
  const assetDecimals = assetData[0];
  const assetName = assetData[1];
  const assetSymbol = assetData[2];

  const vaultApr = 0.15; // FYI: this is typically handled externally and fetching from a trusted API


  return {
    vault: {
      name,
      address: vaultAddress,
      decimals,
      totalAssets,
      apr: vaultApr,
    },
    asset: {
      address: assetAddress,
      decimals: assetDecimals,
      name: assetName,
      symbol: assetSymbol,
    },
  };
}

  catch (error) {
    console.error("Fetch vault data error for:", vaultAddress, error);
    throw Error("Failed to fetch vault data for address: " + vaultAddress);
  }
  
}
