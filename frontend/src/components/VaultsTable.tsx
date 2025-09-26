"use client";
import { type VaultMeta } from "@/server";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components";
import { useRouter } from "next/navigation";
import { formatToTwoDecimals } from "@/lib/utils";
import { formatUnits } from "viem";

export type VaultsTableProps = {
  vaultsMetadata?: VaultMeta[];
};

const tableColumns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "vaultAddress", header: "Address" },
  { accessorKey: "symbol", header: "Vault Asset" },
  { accessorKey: "totalAssets", header: "Total Assets" },
];

export const VaultsTable = ({ vaultsMetadata }: VaultsTableProps) => {
  const data =
    vaultsMetadata?.map((vault) => ({
      id: vault.vault.address,
      name: vault.vault.name,
      symbol: vault.asset.symbol,
      vaultAddress: vault.vault.address,
      totalAssets: formatToTwoDecimals(formatUnits(vault.vault.totalAssets, vault.vault.decimals)),
    })) ?? [];

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  const router = useRouter();

  if (!vaultsMetadata || data.length === 0) {
    return <div>No vaults to show</div>;
  }
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
      
          <TableRow
          onClick={() => {
            router.push(`/vault/${row.original.vaultAddress}`);
          }}
          key={row.id}
            className="hover:scale-[1.01] transition-all duration-200 ease-in-out group cursor-pointer"
     
          >
                     

            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="group-hover:text-foreground/90 transition-colors"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
            
          </TableRow>
   
        ))}
      </TableBody>
    </Table>
  );
};
