import { isAddress } from "viem";
import { wagmiConfig } from "@/config";
import vaultAddresses from "../../vaults.config.json";
import { VaultsTable } from "@/components";
import { fetchVaultData, VaultMeta } from "@/server";

export default async function VaultsPage() {
  let vaultsMetadata: VaultMeta[] | undefined = undefined;
  try {
    const vaultRequests = await Promise.allSettled(
      vaultAddresses.map(async (address: string): Promise<VaultMeta> => {
        if (!isAddress(address)) {
          throw new Error(`Invalid address: ${address}`);
        }
        return fetchVaultData(wagmiConfig, address);
      }),
    );
    vaultsMetadata = vaultRequests
      .filter((request) => request.status === "fulfilled")
      .map((request) => request.value);

    const failedRequests = vaultRequests
      .filter((request) => request.status === "rejected")
      .map((request) => request.reason);
    if (failedRequests.length > 0) {
      throw new Error(failedRequests.join(", "));
    }
  } catch (error) {
    console.error("error fetching vaults metadata", error);
    return (
      <main>
        <h1 className="text-3xl font-bold py-4">Vaults</h1>
        <p className="text-red-500">
          {"Failed to fetch vaults. Please try again."}
        </p>
      </main>
    );
  }
  return (
    <main>
      <h1 className="text-3xl font-bold py-4">Vaults</h1>
      <VaultsTable vaultsMetadata={vaultsMetadata} />
    </main>
  );
}
