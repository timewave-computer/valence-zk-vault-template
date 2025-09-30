'use client';
import { domainClientsConfig } from "@/config/domainClients.config";
import { ReactQueryProvider } from "@/context/ReactQueryProvider";
import { DomainModalProvider } from "@valence-protocol/domain-modal-react";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
    <DomainModalProvider config={domainClientsConfig}>
      {children}
    </DomainModalProvider>
    </ReactQueryProvider>
  );
};