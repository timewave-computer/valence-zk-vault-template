import { QUERY_KEYS } from "@/const";
import { erc4626Abi } from "viem";
import { VaultMeta } from "@/server";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { readContracts } from "wagmi/actions";

export interface UseVaultDataInput {
  vaultMeta: VaultMeta;
}
export const useVaultData = ({ vaultMeta }: UseVaultDataInput) => {
  const wagmiConfig = useConfig();

  return useQuery({
    refetchInterval: 10000,
    retry: false,
    initialData: {
      totalAssets: vaultMeta.vault.totalAssets,
    },
    queryKey: [QUERY_KEYS.VAULT_DATA, vaultMeta.vault.address],
    queryFn: async () => {
      const data = await readContracts(wagmiConfig, {
        allowFailure: false,
        contracts: [
          {
            address: vaultMeta.vault.address,
            abi: erc4626Abi,
            functionName: "totalAssets",
            args: [],
          },
        ],
      });

      const totalAssets = data[0];
      return {
        totalAssets: totalAssets,
      };
    },
  });
};
