import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { botChainMainnet, botChainTestnet } from './botchain';

// Get projectId from environment or use a default
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || process.env.NEXT_PUBLIC_PROJECT_ID || 'c43f36da76c6ec227aa6d98c25dbbb11';

export const networks = [botChainMainnet];

// Set up Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
