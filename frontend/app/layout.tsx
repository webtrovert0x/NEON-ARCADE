import './globals.css';
import type { Metadata } from 'next';
import { AppKitProvider } from '../context/AppKitProvider';
import { Web3Provider } from '../context/Web3Context';
import { Toast } from '../components/Toast';

export const metadata: Metadata = {
  title: 'NEON ARCADE | BOT Chain Mainnet Gaming Hub',
  description: 'Cyberpunk Web3 arcade featuring Neon Oracle, Quantum Flip, Cipher Breaker, and Grid Rush on BOT Chain Mainnet using Reown AppKit & Wagmi.',
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppKitProvider>
          <Web3Provider>
            <div className="cyber-bg" aria-hidden="true" />
            <div className="cyber-grid" aria-hidden="true" />
            <div className="scanlines" aria-hidden="true" />
            <div className="main-layout">
              {children}
            </div>
            <Toast />
          </Web3Provider>
        </AppKitProvider>
      </body>
    </html>
  );
}
