import { useMutation } from "@tanstack/react-query";
import { useWalletClient, usePublicClient } from "wagmi";
import { Address, erc20Abi, erc4626Abi, Hash } from "viem";
import { VaultMeta } from "@/server";


export interface UseVaultDepositInput {
    vaultMeta: VaultMeta;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const useVaultDeposit = ({ vaultMeta, onSuccess, onError }: UseVaultDepositInput) => {

    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    const deposit = async (amount: bigint, address: Address) => {
        if (!walletClient || !publicClient) {
            throw new Error("Wallet client not found");
        }

        const { request: approveRequest } = await publicClient.simulateContract({
            address: vaultMeta.asset.address as Address,
            account: address,
            abi: erc20Abi,
            functionName: "approve",
            args: [address, amount],
          });

          const approveHash = await walletClient.writeContract(approveRequest);

            // Wait for approval to be mined
            await publicClient.waitForTransactionReceipt({
            hash: approveHash,
            timeout: 100000,
            });

                  // deposit tokens into vault
      const { request: depositRequest } = await publicClient.simulateContract({
        address: vaultMeta.vault.address as Address,
        abi: erc4626Abi,
        functionName: "deposit",
        args: [amount, address],
        account: address,
      });

      const depositHash = await walletClient.writeContract(depositRequest);

      // Wait for deposit to be mined
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: depositHash,
        timeout: 100000,
      });

      if (receipt.status !== "success") {
        console.error("Transaction reciept:", receipt);
        throw new Error(`Transaction reciept status: ${receipt.status}`);
      }
      return depositHash;
    }

    return useMutation({
        mutationFn: async ({ amount, address }: { amount: bigint; address: Address }): Promise<Hash> => {
            return deposit(amount, address);
        },
        onSuccess: onSuccess,
        onError: onError,
    });
};