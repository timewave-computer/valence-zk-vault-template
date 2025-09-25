import { VaultMeta } from "@/server";

export type VaultsTableProps = {
  vaultsMetadata?: VaultMeta[];
};

export const VaultsTable = ({
  vaultsMetadata,
}: VaultsTableProps) => {
  if (!vaultsMetadata || vaultsMetadata.length === 0) {
    return <div>No vaults to show</div>;
  }
  return <div>Table placeholder</div>;
};
