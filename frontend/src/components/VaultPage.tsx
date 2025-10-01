"use client";

import { VaultMeta } from "@/server";
import { formatUnits, parseUnits } from "viem";
import { formatToTwoDecimals } from "@/lib/utils";
import { Button, TextInput } from "@/components/";
import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import {
  useUserAssetBalances,
  useVaultDeposit,
  useVaultWithdraw,
} from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const";
import { useVaultData } from "@/hooks/useVaultData";

export type VaultPageProps = {
  vaultMeta: VaultMeta;
  vaultAddress: string;
};

export const VaultPage = ({ vaultMeta }: VaultPageProps) => {
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const { address } = useAccount();
  const { data: userBalances } = useUserAssetBalances({ vaultMeta });
  const { data: vaultData } = useVaultData({ vaultMeta });
  const queryClient = useQueryClient();

  const vaultAssetBalance = formatToTwoDecimals(
    formatUnits(
      vaultData?.totalAssets ?? vaultMeta.vault.totalAssets,
      vaultMeta.vault.decimals,
    ),
  );

  const userVaultBaseAssetBalance = userBalances?.userVaultBaseAssetBalance
    ? formatToTwoDecimals(
        formatUnits(userBalances.userVaultBaseAssetBalance, vaultMeta.asset.decimals),
      )
    : undefined;
  const userBaseAssetBalance = userBalances?.userBaseAssetBalance
    ? formatToTwoDecimals(
        formatUnits(userBalances.userBaseAssetBalance, vaultMeta.asset.decimals),
      )
    : undefined;

  const isDepositDisabled =
    !address ||
    !userBalances?.userBaseAssetBalance ||
    userBalances.userBaseAssetBalance === BigInt(0);
  const isWithdrawDisabled =
    !address ||
    !userBalances?.userVaultAssetBalance ||
    userBalances.userVaultAssetBalance === BigInt(0);

  const { mutate: deposit } = useVaultDeposit({
    vaultMeta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_BALANCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VAULT_DATA] });
    },
    onError: (error) => {
      console.error("Error depositing:", error);
    },
  });

  const handleDeposit = useCallback(() => {
    if (!address) {
      return;
    }
    const amount = parseUnits(depositAmount, vaultMeta.asset.decimals);
    deposit({ amount, address });
  }, [address, depositAmount, deposit, vaultMeta]);

  const { mutate: withdraw } = useVaultWithdraw({
    vaultMeta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_BALANCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VAULT_DATA] });
    },
    onError: (error) => {
      console.error("Error withdrawing:", error);
    },
  });
  const handleWithdraw = useCallback(() => {
    if (!address) {
      return;
    }
    const amount = parseUnits(withdrawAmount, vaultMeta.vault.decimals);
    withdraw({ amount, address });
  }, [address, withdrawAmount, withdraw, vaultMeta]);

  return (
    <div>
      <p>
        <span className="font-semibold">Base: </span>
        {vaultMeta.asset.symbol}{" "}
        <span className="font-mono font-light text-base break-all">
          ({vaultMeta.asset.address})
        </span>
      </p>
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
        {address && (
          <>
            {" "}
            <div className="flex flex-col items-start justify-center ">
              <h2 className="text-2xl font-semibold ">Your Vault Position</h2>
              <p className="font-mono font-light text-xl pt-2">
                {userVaultBaseAssetBalance ? `${userVaultBaseAssetBalance} ${vaultMeta.asset.symbol}` : "-"}
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

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="border border-gray-100 p-8 flex flex-col items-start">
          <h2 className="text-lg font-semibold pb-4  ">Deposit</h2>
          <div className="flex flex-row gap-4 items-center w-full ">
            <TextInput
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              type="number"
              className="grow"
            />
            <Button
              variant="secondary"
              onClick={() => {
                handleDeposit();
              }}
              isDisabled={isDepositDisabled}
            >
              Deposit
            </Button>
          </div>
        </div>
        <div className="border border-gray-100 p-8 flex flex-col items-start">
          <h2 className="text-lg font-semibold pb-4 ">Withdraw</h2>
          <div className="flex flex-row gap-4 items-center w-full">
            <TextInput
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              type="number"
              className="grow"
            />
            <Button
              isDisabled={isWithdrawDisabled}
              variant="secondary"
              onClick={() => {
                handleWithdraw();
              }}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
