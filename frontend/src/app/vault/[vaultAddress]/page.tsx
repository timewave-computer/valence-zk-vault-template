import { fetchVaultData, VaultMeta } from "@/server";
import { wagmiConfig } from "@/config";
import { isAddress, type Address } from "viem";
import { VaultPage } from "@/components";
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
        fetchError = `Unable to fetch vault metadata for: ${vaultAddress}`;
        console.error(fetchError);
    }

  return (
    <main>
      <h1 className="text-2xl font-bold py-4">{vaultMeta?.vault.name ?? 'Vault'} <span className="font-mono font-light text-sm break-all">{vaultAddress}</span></h1>
      {fetchError && <p className="text-red-500">{fetchError}</p>}
      <Suspense fallback={<p>Loading...</p>}>
       {<VaultPage vaultMeta={vaultMeta} vaultAddress={vaultAddress} />}
      </Suspense>
    </main>
  );
}