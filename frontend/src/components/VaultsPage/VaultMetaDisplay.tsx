import { useUserAssetBalances, useVaultData } from "@/hooks";
import { VaultMeta } from "@/server";
import { formatToTwoDecimals } from "@/lib/utils";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

export const VaultMetaDisplay = ({ vaultMeta }: { vaultMeta: VaultMeta }) => {
  const { data: vaultData } = useVaultData({ vaultMeta });
  const { address: userAddress } = useAccount();

  const vaultAssetBalance = formatToTwoDecimals(
    formatUnits(
      vaultData?.totalAssets ?? vaultMeta.vault.totalAssets,
      vaultMeta.vault.decimals,
    ),
  );

  const { data: userBalances } = useUserAssetBalances({
    vaultMeta,
    address: userAddress,
  });
  const userVaultBaseAssetBalance = userBalances?.userVaultBaseAssetBalance
    ? formatToTwoDecimals(
        formatUnits(
          userBalances.userVaultBaseAssetBalance,
          vaultMeta.asset.decimals,
        ),
      )
    : undefined;

  const userBaseAssetBalance = userBalances?.userBaseAssetBalance
    ? formatToTwoDecimals(
        formatUnits(
          userBalances.userBaseAssetBalance,
          vaultMeta.asset.decimals,
        ),
      )
    : undefined;

  return (
    <section className="flex flex-row gap-16 flex-wrap items-center justify-start  py-8">
      <div className="flex flex-col items-start justify-center ">
        <h2 className="text-2xl font-semibold ">Vault TVL</h2>
        <p className="font-mono font-light text-xl pt-2">
          {vaultAssetBalance} {vaultMeta.asset.symbol}
        </p>
      </div>
      <div className="flex flex-col items-start justify-center ">
        <h2 className="text-2xl font-semibold ">APR</h2>
        <p className="font-mono font-light text-xl pt-2">
          {formatToTwoDecimals(vaultMeta.vault.apr * 100)}%
        </p>
      </div>
      {userAddress && (
        <>
          {" "}
          <div className="flex flex-col items-start justify-center ">
            <h2 className="text-2xl font-semibold ">Your Vault Position</h2>
            <p className="font-mono font-light text-xl pt-2">
              {userVaultBaseAssetBalance
                ? `${userVaultBaseAssetBalance} ${vaultMeta.asset.symbol}`
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-start justify-center ">
            <h2 className="text-2xl font-semibold ">
              Your {vaultMeta.asset.symbol} Balance
            </h2>
            <p className="font-mono font-light text-xl pt-2">
              {userBaseAssetBalance ?? "-"}
            </p>
          </div>
        </>
      )}
    </section>
  );
};
