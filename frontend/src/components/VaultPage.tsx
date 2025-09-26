"use client";

import { VaultMeta } from "@/server";
import { formatUnits } from "viem";
import { formatToTwoDecimals } from "@/lib/utils";
import { Button, TextInput } from "@/components/";
import { useState } from "react";

export type VaultPageProps = {
  vaultMeta?: VaultMeta;
  vaultAddress: string;
};

export const VaultPage = ({ vaultMeta, vaultAddress }: VaultPageProps) => {
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    if (!vaultMeta) {
        return <div>Unable to fetch vault data for vault at <span className="font-mono font-light">{vaultAddress}</span></div>;
    }
  return (
    <div>
      <section className="flex flex-col items-center justify-center p-8 border border-gray-200 ">
        <h2 className="text-2xl font-semibold ">Total Assets</h2>
        <p className="font-mono font-light text-4xl pt-2">{formatToTwoDecimals(formatUnits(vaultMeta.vault.totalAssets, vaultMeta.vault.decimals))} {vaultMeta.asset.symbol}</p>
      </section>
      <section className="flex flex-col md:grid md:grid-cols-2 gap-4 pt-4">
        <div className="border border-gray-100 p-8 flex flex-col items-start">
            <h2 className="text-lg font-semibold pb-4  ">Deposit</h2>
            <div className="flex flex-row gap-4 items-center w-full ">
            <TextInput
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
             type="number" className="grow" />
            <Button
            isDisabled
              variant="secondary"
             onClick={() => {}}>Deposit</Button>
            </div>  
        </div>
        <div className="border border-gray-100 p-8 flex flex-col items-start">
            <h2 className="text-lg font-semibold pb-4 ">Withdraw</h2>
            <div className="flex flex-row gap-4 items-center w-full">
            <TextInput
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
             type="number" className="grow" />
            <Button
              variant="secondary"
             onClick={() => {}}>Withdraw</Button>
            </div>  
        </div>

      </section>
    </div>
  );
};