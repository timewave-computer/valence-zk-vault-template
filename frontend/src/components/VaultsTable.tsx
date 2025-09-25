import { VaultMeta } from "@/server";

export const VaultsTable = ({
  vaultsMetadata,
}: {
  vaultsMetadata?: VaultMeta[];
}) => {
  if (!vaultsMetadata) {
    return <div>No vaults to show</div>;
  }
  return <div>Table placeholder</div>;
};
