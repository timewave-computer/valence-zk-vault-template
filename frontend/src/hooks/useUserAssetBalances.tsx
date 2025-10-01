import { VaultMeta } from "@/server";
import { erc20Abi, erc4626Abi } from "viem";
import { useAccount, useConfig } from "wagmi";
import { readContract, readContracts } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const";

export interface UseUserAssetBalancesInput {
  vaultMeta: VaultMeta;
}
export const useUserAssetBalances = ({
  vaultMeta,
}: UseUserAssetBalancesInput) => {
  const { address } = useAccount();
  const wagmiConfig = useConfig();

  return useQuery({
    enabled: !!address,
    refetchInterval: 10000,
    retry: false,
    queryKey: [QUERY_KEYS.USER_BALANCES, vaultMeta.vault.address, address],
    queryFn: async () => {
      if (!address) {
        throw new Error("Address is not connected");
      }

      const data = await readContracts(wagmiConfig, {
        allowFailure: false,
        contracts: [
          {
            address: vaultMeta.vault.address,
            abi: erc4626Abi,
            functionName: "balanceOf",
            args: [address],
          },
          {
            address: vaultMeta.asset.address,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address],
          },
        ],
      });

      

      const userVaultAssetBalance = data[0];
      const userBaseAssetBalance = data[1];

      // convert "vault shares" to "base asset"
      const userVaultBaseAssetBalance = await readContract(wagmiConfig, {
          address: vaultMeta.vault.address,
          abi: erc4626Abi,
          functionName: "convertToAssets",
          args: [userVaultAssetBalance],   
      });
      

      return {
        userVaultAssetBalance: userVaultAssetBalance,
        userVaultBaseAssetBalance: userVaultBaseAssetBalance,
        userBaseAssetBalance: userBaseAssetBalance,
        
      };
    },
  });
};
