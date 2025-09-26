import { type Address } from "viem";
import { wagmiConfig } from "@/config";
import vaultAddresses from "../../vaults.config.json";
import { VaultsTable } from "@/components";
import { fetchVaultData, VaultMeta } from "@/server";


export default async function VaultsPage() {
  let vaultsMetadata: VaultMeta[] | undefined = undefined;
  let fetchError: string | undefined = undefined;
  try {
    const vaultRequests = await Promise.allSettled(
      vaultAddresses.map(async (address: string): Promise<VaultMeta> => {
        return fetchVaultData(wagmiConfig, address as Address);
      }),
    );
    vaultsMetadata = vaultRequests
      .filter((request) => request.status === "fulfilled")
      .map((request) => request.value);

    const failedRequests = vaultRequests
      .filter((request) => request.status === "rejected")
      .map((request) => request.reason);
    if (failedRequests.length > 0) {
      fetchError = `Unable to fetch vault metadata for: ${failedRequests.join(", ")}`;
      console.error(fetchError);
    }

  } catch (error) {
    console.error("Error fetching vaults metadata", error);
    fetchError = "Error fetching vaults. Please try again.";
  }
  return (
    <main>
      <h1 className="text-2xl font-bold py-4">Vaults</h1>
      {fetchError && <p className="text-red-500">{fetchError}</p>}
      <VaultsTable vaultsMetadata={vaultsMetadata} />
    </main>
  );
}
