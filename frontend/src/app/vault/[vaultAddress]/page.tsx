export type VaultPageProps = {
  params: {
    vaultAddress: string;
  };
};

export default function VaultPage({ params }: VaultPageProps) {
    const { vaultAddress } = params;
  return (
    <main>
      <h1 className="text-2xl font-bold">Vault</h1>
      <p className="font-mono">{vaultAddress}</p>
    </main>
  );
}