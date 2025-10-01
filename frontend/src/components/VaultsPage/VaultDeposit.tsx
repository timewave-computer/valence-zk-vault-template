import { Button, TextInput } from "@/components/common";
import { useState, useCallback } from "react";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useUserAssetBalances, useVaultDeposit } from "@/hooks";
import { QUERY_KEYS } from "@/const";
import { useQueryClient } from "@tanstack/react-query";
import { VaultMeta } from "@/server";

export const VaultDeposit = ({ vaultMeta }: { vaultMeta: VaultMeta }) => {
  const [depositAmount, setDepositAmount] = useState<string>("");
  const { address: userAddress } = useAccount();
  const queryClient = useQueryClient();
  const { data: userBalances } = useUserAssetBalances({
    vaultMeta,
    address: userAddress,
  });

  const isDepositDisabled =
    !userAddress ||
    !userBalances?.userBaseAssetBalance ||
    userBalances.userBaseAssetBalance === BigInt(0);

  const { mutate: deposit } = useVaultDeposit({
    vaultMeta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_BALANCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VAULT_DATA] });
    },
    onError: (error) => {
      console.error("Error depositing:", error);
    },
  });

  const handleDeposit = useCallback(() => {
    if (!userAddress) {
      return;
    }
    const amount = parseUnits(depositAmount, vaultMeta.asset.decimals);
    deposit({ amount, address: userAddress });
  }, [userAddress, depositAmount, deposit, vaultMeta]);

  return (
    <div className="border border-gray-100 p-8 flex flex-col items-start">
      <h2 className="text-lg font-semibold pb-4  ">Deposit</h2>
      <div className="flex flex-row gap-4 items-center w-full ">
        <TextInput
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          type="number"
          className="grow"
        />
        <Button
          variant="secondary"
          onClick={() => {
            handleDeposit();
          }}
          isDisabled={isDepositDisabled}
        >
          Deposit
        </Button>
      </div>
    </div>
  );
};
