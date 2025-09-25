import { VaultsTable } from "@/components";
import { fetchVaultsMetadata, VaultMeta } from "@/server";

export default async function VaultsPage() {
  let vaultsMetadata: VaultMeta[] | undefined = undefined;
  let fetchError: string | undefined = undefined;
  try {
    vaultsMetadata = await fetchVaultsMetadata();
  } catch (error) {
    console.error("Error fetching vaults metadata", error);
    fetchError = "Error fetching vaults. Please try again.";
  }
  return (
    <main>
      <h1 className="text-2xl font-bold">Vaults</h1>
      {fetchError && <p className="text-red-500">{fetchError}</p>}
      <VaultsTable vaultsMetadata={vaultsMetadata} />
    </main>
  );
}
