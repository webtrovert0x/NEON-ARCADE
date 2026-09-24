'use client';

import React, { ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, type Config } from 'wagmi';
import { projectId, wagmiAdapter } from '../config';
import { botChainMainnet } from '../config/botchain';

// Setup query client
const queryClient = new QueryClient();

// General app metadata
const metadata = {
  name: 'Neon Arcade',
  description: 'Cyberpunk Web3 Gaming Hub on BOT Chain Mainnet',
  url: 'https://neonarcade.xyz',
  icons: ['/logo.jpg'],
};

// Create the AppKit instance at module level
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [botChainMainnet],
  defaultNetwork: botChainMainnet,
  metadata,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#00f0ff',
    '--w3m-color-mix': '#070913',
    '--w3m-color-mix-strength': 40,
    '--w3m-border-radius-master': '10px',
  },
  features: {
    analytics: true,
  },
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
