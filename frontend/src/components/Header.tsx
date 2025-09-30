"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components";
import {
  shortenAddress,
  useDomainModal,
} from "@valence-protocol/domain-modal-react";
import { useAccount } from "wagmi";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const { showModal } = useDomainModal();
  const { address, isConnected } = useAccount();

  return (
    <header className="w-full flex flex-wrap gap-4 justify-between items-center py-4 mb-4">
      {/* Logo and App Name */}
      <Link href="/" className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">V</span>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white ">Valence ZK Vaults</h1>
        </div>
      </Link>

      {/* Main Button */}
      <div className="flex items-center">
        {isConnected && address ? (
          <Button variant="secondary" onClick={() => showModal()}>
            {shortenAddress(address)}
          </Button>
        ) : (
          <Button variant="primary" onClick={() => showModal()}>
            Wallet
          </Button>
        )}
      </div>
    </header>
  );
};
