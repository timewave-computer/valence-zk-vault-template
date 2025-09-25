import { VaultsTable } from "@/components";
import { fetchVaultsMetadata, VaultMeta } from "@/server";

export default async function VaultsPage() {
  let vaultsMetadata: VaultMeta[] | undefined = undefined;
  try {
    vaultsMetadata = await fetchVaultsMetadata();
  } catch (error) {
    console.error("Error fetching vaults metadata", error);
  }
  return (
    <main>
      <h1 className="text-2xl font-bold">Vaults</h1>
      <VaultsTable vaultsMetadata={vaultsMetadata} />
    </main>
  );
}
