"use client";

import { VaultMeta } from "@/server";
import { VaultDeposit, VaultMetaDisplay, VaultWithdraw } from "@/components/";

export type VaultPageProps = {
  vaultMeta: VaultMeta;
  vaultAddress: string;
};

export const VaultPage = ({ vaultMeta }: VaultPageProps) => {
  return (
    <div>
      <p>
        <span className="font-semibold">Base: </span>
        {vaultMeta.asset.symbol}{" "}
        <span className="font-mono font-light text-base break-all">
          ({vaultMeta.asset.address})
        </span>
      </p>
      <VaultMetaDisplay vaultMeta={vaultMeta} />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <VaultDeposit vaultMeta={vaultMeta} />
        <VaultWithdraw vaultMeta={vaultMeta} />
      </section>
    </div>
  );
};
