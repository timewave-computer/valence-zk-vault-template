import { fetchVaultsMetadata } from "@/server";

export default async function Home() {
  let vaultsMetadata: any[] = [];
  try {
    const vaultsMetadata = await fetchVaultsMetadata();
    console.log('vaultsMetadata', vaultsMetadata);
  } catch (error) {
    console.error('Error fetching vaults metadata', error);
    return (
      <div>Error fetching vaults metadata</div>
    );
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        Vaults UI Demo App
      </main>
    </div>
  );
}
