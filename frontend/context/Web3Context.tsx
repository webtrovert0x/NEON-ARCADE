'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { botChainMainnet, botChainTestnet } from '../config/botchain';
import { ARCADE_SCORE_CONTRACT_ADDRESS, ARCADE_SCORE_ABI } from '../config/arcadeContract';
import { playSound } from '../lib/audio';

interface OnChainStats {
  totalPoints: number;
  gamesWon: number;
  highStreak: number;
  lastUpdated: number;
}

interface Web3ContextType {
  account: string | null;
  chainId: number | undefined;
  isBotChain: boolean;
  isConnected: boolean;
  soundEnabled: boolean;
  globalScore: number;
  globalWins: number;
  maxStreak: number;
  onChainStats: OnChainStats | null;
  isSyncing: boolean;
  lastTxHash: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToBotChain: () => Promise<void>;
  toggleSound: () => void;
  recordWin: (pointsEarned: number) => void;
  recordStreak: (streak: number) => void;
  syncScoreToChain: () => Promise<void>;
  refetchOnChainStats: () => void;
  toastMessage: string | null;
  toastType: 'info' | 'success' | 'warn' | 'error';
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  openAppKit: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { writeContractAsync } = useWriteContract();

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [globalScore, setGlobalScore] = useState<number>(0);
  const [globalWins, setGlobalWins] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'warn' | 'error'>('info');

  const isBotChain = chainId === botChainMainnet.id;

  // Read on-chain score stats for the connected account
  const { data: rawContractStats, refetch: refetchStats } = useReadContract({
    address: ARCADE_SCORE_CONTRACT_ADDRESS,
    abi: ARCADE_SCORE_ABI,
    functionName: 'getPlayerStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isBotChain,
    },
  });

  const parsedOnChainStats: OnChainStats | null = rawContractStats
    ? {
        totalPoints: Number(rawContractStats.totalPoints),
        gamesWon: Number(rawContractStats.gamesWon),
        highStreak: Number(rawContractStats.highStreak),
        lastUpdated: Number(rawContractStats.lastUpdated),
      }
    : null;

  const showToast = (msg: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('neon_sound_pref', String(next));
    if (next) playSound('click', true);
  };

  const recordWin = (pointsEarned: number) => {
    setGlobalWins((w) => {
      const nw = w + 1;
      localStorage.setItem('neon_global_wins', String(nw));
      return nw;
    });
    setGlobalScore((s) => {
      const ns = s + pointsEarned;
      localStorage.setItem('neon_global_score', String(ns));
      return ns;
    });
  };

  const recordStreak = (streak: number) => {
    setMaxStreak((prev) => {
      if (streak > prev) {
        localStorage.setItem('neon_max_streak', String(streak));
        return streak;
      }
      return prev;
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSound = localStorage.getItem('neon_sound_pref');
      if (storedSound !== null) setSoundEnabled(storedSound === 'true');
      const storedWins = localStorage.getItem('neon_global_wins');
      if (storedWins) setGlobalWins(parseInt(storedWins, 10) || 0);
      const storedScore = localStorage.getItem('neon_global_score');
      if (storedScore) setGlobalScore(parseInt(storedScore, 10) || 0);
      const storedStreak = localStorage.getItem('neon_max_streak');
      if (storedStreak) setMaxStreak(parseInt(storedStreak, 10) || 0);
    }
  }, []);

  const connectWallet = async () => {
    playSound('click', soundEnabled);
    try {
      await open();
    } catch (e: any) {
      showToast(e.message || 'Error opening wallet modal', 'error');
    }
  };

  const disconnectWallet = () => {
    playSound('click', soundEnabled);
    try {
      disconnect();
      showToast('Wallet disconnected', 'info');
    } catch (e: any) {
      showToast(e.message || 'Error disconnecting', 'error');
    }
  };

  const switchToBotChain = async () => {
    playSound('click', soundEnabled);
    try {
      if (switchChain) {
        switchChain({ chainId: botChainMainnet.id });
        showToast('Switching to BOT Chain Mainnet...', 'info');
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to switch network', 'error');
    }
  };

  const syncScoreToChain = async () => {
    if (!address) {
      showToast('Please connect wallet to record score on BOT Chain', 'warn');
      await connectWallet();
      return;
    }
    if (!isBotChain) {
      showToast('Please switch to BOT Chain Mainnet (677)', 'warn');
      await switchToBotChain();
      return;
    }

    playSound('click', soundEnabled);
    setIsSyncing(true);

    try {
      const hash = await writeContractAsync({
        address: ARCADE_SCORE_CONTRACT_ADDRESS,
        abi: ARCADE_SCORE_ABI as any,
        functionName: 'recordScore',
        args: [BigInt(globalScore), BigInt(globalWins), BigInt(maxStreak)],
      } as any);

      setLastTxHash(hash);
      playSound('win', soundEnabled);
      showToast('⚡ High score submitted to BOT Chain Mainnet!', 'success');

      // Refresh stats after block inclusion
      setTimeout(() => {
        refetchStats();
      }, 3500);
    } catch (err: any) {
      showToast(err.shortMessage || err.message || 'Failed to sync score to chain', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account: address || null,
        chainId,
        isBotChain,
        isConnected,
        soundEnabled,
        globalScore,
        globalWins,
        maxStreak,
        onChainStats: parsedOnChainStats,
        isSyncing,
        lastTxHash,
        connectWallet,
        disconnectWallet,
        switchToBotChain,
        toggleSound,
        recordWin,
        recordStreak,
        syncScoreToChain,
        refetchOnChainStats: refetchStats,
        toastMessage,
        toastType,
        showToast,
        openAppKit: open,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
