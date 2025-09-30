"use client";

import { VaultMeta } from "@/server";
import { formatUnits, parseUnits } from "viem";
import { formatToTwoDecimals } from "@/lib/utils";
import { Button, TextInput } from "@/components/";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useUserAssetBalances } from "@/hooks";


export type VaultPageProps = {
  vaultMeta: VaultMeta;
  vaultAddress: string;
};

export const VaultPage = ({ vaultMeta }: VaultPageProps) => {
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const { address } = useAccount();
  const { data,isLoading } = useUserAssetBalances({ vaultMeta });
console.log(data, isLoading);
  const isDepositDisabled = !address;
  const isWithdrawDisabled = !address;

  const userVaultAssetBalance = data?.vaultAssetBalance ? formatToTwoDecimals(parseUnits(data.vaultAssetBalance.toString(), vaultMeta.vault.decimals)) : undefined;

  const userBaseAssetBalance = data?.baseAssetBalance ? formatToTwoDecimals(parseUnits(data.baseAssetBalance.toString(), vaultMeta.asset.decimals)) : undefined;
  return (
    <div>
      <section className="flex flex-row gap-16 flex-wrap items-center justify-start  py-8">
      <div className="flex flex-col items-start justify-center ">
        <h2 className="text-2xl font-semibold ">Total Assets</h2>
        <p className="font-mono font-light text-xl pt-2">
          {formatToTwoDecimals(
            parseUnits(vaultMeta.vault.totalAssets.toString(), vaultMeta.vault.decimals),
          )}{" "}
          {vaultMeta.asset.symbol}
        </p>
      </div>
      <div className="flex flex-col items-start justify-center ">
        <h2 className="text-2xl font-semibold ">APR</h2>
        <p className="font-mono font-light text-xl pt-2">
          {formatToTwoDecimals(vaultMeta.vault.apr*100)}
          %
        </p>
      </div>
    { address && <>  <div className="flex flex-col items-start justify-center ">
        <h2 className="text-2xl font-semibold ">Your Vault Position</h2>
        <p className="font-mono font-light text-xl pt-2">
          {userVaultAssetBalance ?? '-'} 
        </p>
      </div>
      <div className="flex flex-col items-start justify-center ">
        <h2 className="text-2xl font-semibold ">Wallet Asset Balance</h2>
        <p className="font-mono font-light text-xl pt-2">
          {userBaseAssetBalance ?? '-'} 
        </p>
      </div>
      </>
      }


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
             variant="secondary" onClick={() => {}} isDisabled={isDepositDisabled}>
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
             variant="secondary" onClick={() => {}}>
              Withdraw
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

