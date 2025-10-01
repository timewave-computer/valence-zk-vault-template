import { fetchVaultData, VaultMeta } from "@/server";
import { wagmiConfig } from "@/config";
import { VaultPage } from "@/components";
import { isAddress } from "viem";
import { Suspense } from "react";

export type PageProps = {
  params: {
    vaultAddress: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { vaultAddress } = await params;

  let vaultMeta: VaultMeta | undefined = undefined;
  let fetchError: string | undefined = undefined;
  try {
    if (!isAddress(vaultAddress)) {
      throw new Error(`Invalid address: ${vaultAddress}`);
    }
    vaultMeta = await fetchVaultData(wagmiConfig, vaultAddress);
  } catch (error) {
    console.error(error);
    fetchError = `Unable to fetch vault metadata for: ${vaultAddress}`;
    return (
      <main>
        <h1 className="text-3xl font-bold py-4">
          {"Vault"}{" "}
          <span className="font-mono font-light text-base break-all">
            {vaultAddress}
          </span>
        </h1>
        <p className="text-red-500">{fetchError}</p>
      </main>
    );
  }

  return (
    <main>
      <h1 className="text-3xl font-bold py-4">
        {vaultMeta?.vault.name ?? "Vault"}{" "}
        <span className="font-mono font-light text-base break-all">
          {vaultAddress}
        </span>
      </h1>
      <Suspense fallback={<p>Loading...</p>}>
        {<VaultPage vaultMeta={vaultMeta} vaultAddress={vaultAddress} />}
      </Suspense>
    </main>
  );
}
