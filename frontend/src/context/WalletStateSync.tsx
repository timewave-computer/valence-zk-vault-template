'use client';
/**
 * this is a temporary hack to keep the wallet state synced when use leaves the page
 */
import { useKeepEvmWalletStateSynced } from "@valence-protocol/domain-modal-react";
export const WalletStateSync = () => {
    useKeepEvmWalletStateSynced()
  return (
   <></>
  );
};