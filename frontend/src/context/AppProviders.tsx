'use client';

import { domainClientsConfig } from '@/config/domainClientsConfig';
import { DomainModalProvider } from '@valence-protocol/domain-modal-react';
import { ReactQueryProvider } from '@/context';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return <ReactQueryProvider>
  <DomainModalProvider config={domainClientsConfig}>{children}</DomainModalProvider>;
  </ReactQueryProvider>
};