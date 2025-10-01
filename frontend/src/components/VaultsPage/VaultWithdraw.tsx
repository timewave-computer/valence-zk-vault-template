"use client";
import { VaultMeta } from "@/server";
import { Button, TextInput } from "@/components/common";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useUserAssetBalances } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useVaultWithdraw } from "@/hooks";
import { QUERY_KEYS } from "@/const";
import { parseUnits } from "viem";
import { useCallback } from "react";

export const VaultWithdraw = ({ vaultMeta }: { vaultMeta: VaultMeta }) => {
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const { address: userAddress } = useAccount();

  const { data: userBalances } = useUserAssetBalances({
    vaultMeta,
    address: userAddress,
  });
  const queryClient = useQueryClient();

  const isWithdrawDisabled =
    !userAddress ||
    !userBalances?.userVaultAssetBalance ||
    userBalances.userVaultAssetBalance === BigInt(0);

  const { mutate: withdraw } = useVaultWithdraw({
    vaultMeta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_BALANCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VAULT_DATA] });
    },
    onError: (error) => {
      console.error("Error withdrawing:", error);
    },
  });
  const handleWithdraw = useCallback(() => {
    if (!userAddress) {
      return;
    }
    const amount = parseUnits(withdrawAmount, vaultMeta.vault.decimals);
    withdraw({ amount, address: userAddress });
  }, [userAddress, withdrawAmount, withdraw, vaultMeta]);

  return (
    <div className="border border-gray-100 p-8 flex flex-col items-start">
      <h2 className="text-lg font-semibold pb-4 ">Withdraw</h2>
      <div className="flex flex-row gap-4 items-center w-full">
        <TextInput
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          type="number"
          className="grow"
        />
        <Button
          isDisabled={isWithdrawDisabled}
          variant="secondary"
          onClick={() => {
            handleWithdraw();
          }}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
};
