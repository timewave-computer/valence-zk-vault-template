import { useMutation } from "@tanstack/react-query";
import { useWalletClient, usePublicClient } from "wagmi";
import { Address, erc4626Abi, Hash } from "viem";
import { VaultMeta } from "@/server";

export interface UseVaultWithdrawInput {
  vaultMeta: VaultMeta;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useVaultWithdraw = ({
  vaultMeta,
  onSuccess,
  onError,
}: UseVaultWithdrawInput) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const withdraw = async (amount: bigint, address: Address) => {
    if (!walletClient || !publicClient) {
      throw new Error("Wallet client not found");
    }

    // approve the vault to spend vault shares (shares owned by user)
    const { request: approveRequest } = await publicClient.simulateContract({
      address: vaultMeta.vault.address,
      account: address,
      abi: erc4626Abi,
      functionName: "approve",
      args: [vaultMeta.vault.address, amount],
    });

    const approveHash = await walletClient.writeContract(approveRequest);

    // Wait for approval to be mined
    await publicClient.waitForTransactionReceipt({
      hash: approveHash,
      timeout: 100000,
    });

    // redeem shares for tokens
    const { request: redeemRequest } = await publicClient.simulateContract({
      account: address,
      address: vaultMeta.vault.address,
      abi: erc4626Abi,
      functionName: "redeem",
      args: [amount, address, address],
    });

    const redeemHash = await walletClient.writeContract(redeemRequest);

    // Wait for deposit to be mined
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: redeemHash,
      timeout: 100000,
    });

    if (receipt.status !== "success") {
      console.error("Transaction reciept:", receipt);
      throw new Error(`Transaction reciept status: ${receipt.status}`);
    }
    return redeemHash;
  };

  return useMutation({
    mutationFn: async ({
      amount,
      address,
    }: {
      amount: bigint;
      address: Address;
    }): Promise<Hash> => {
      return withdraw(amount, address);
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};
