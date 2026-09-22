'use client';

import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ARCADE_SCORE_CONTRACT_ADDRESS } from '../config/arcadeContract';

export const OnChainScoreCard: React.FC = () => {
  const {
    account,
    isConnected,
    isBotChain,
    globalScore,
    globalWins,
    maxStreak,
    onChainStats,
    isSyncing,
    lastTxHash,
    syncScoreToChain,
    connectWallet,
  } = useWeb3();

  const onChainScore = onChainStats ? onChainStats.totalPoints : 0;
  const isUpToDate = globalScore > 0 && onChainScore >= globalScore;
  const hasUnsavedPoints = globalScore > onChainScore;

  return (
    <div className="onchain-sync-card">
      <div className="onchain-card-header">
        <div className="onchain-header-left">
          <span className="onchain-beacon" />
          <span className="onchain-title">BOT CHAIN ON-CHAIN VAULT</span>
        </div>
        <span className="onchain-network-badge" style={{ background: 'rgba(0, 255, 157, 0.15)', borderColor: 'rgba(0, 255, 157, 0.5)', color: '#00ff9d' }}>MAINNET (677)</span>
      </div>

      <div className="onchain-stats-grid">
        {/* Local Session PTS */}
        <div className="onchain-stat-box">
          <div className="stat-label">SESSION POINTS</div>
          <div className="stat-value local-pts">🏆 {globalScore} PTS</div>
          <div className="stat-subtext">Wins: {globalWins} | Streak: {maxStreak}x</div>
        </div>

        {/* On-Chain Verified PTS */}
        <div className="onchain-stat-box">
          <div className="stat-label">ON-CHAIN VERIFIED</div>
          <div className="stat-value onchain-pts">
            ⛓️ {onChainScore} PTS
          </div>
          <div className="stat-subtext">
            {onChainStats && onChainStats.lastUpdated > 0
              ? `Synced: ${new Date(onChainStats.lastUpdated * 1000).toLocaleTimeString()}`
              : 'Not Synced Yet'}
          </div>
        </div>
      </div>

      {/* Sync / Commit Action */}
      <div className="onchain-actions-row">
        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="onchain-sync-btn"
          >
            ⚡ Connect Wallet to Record Score
          </button>
        ) : (
          <button
            onClick={syncScoreToChain}
            disabled={isSyncing || (!hasUnsavedPoints && globalScore === 0)}
            className={`onchain-sync-btn ${hasUnsavedPoints ? 'pulse-sync' : ''}`}
            title="Commit your high score to BOT Chain Mainnet smart contract"
          >
            {isSyncing ? (
              <>
                <span className="sync-spinner" />
                <span>Recording to BOT Chain...</span>
              </>
            ) : isUpToDate ? (
              <>
                <span>✅</span>
                <span>Score Synced On-Chain</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Record {globalScore} PTS to BOT Chain</span>
              </>
            )}
          </button>
        )}

        {/* Explorer Link */}
        {lastTxHash ? (
          <a
            href={`https://scan.botchain.ai/tx/${lastTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="onchain-explorer-btn"
          >
            🔍 View Tx on BOT Scan ↗
          </a>
        ) : (
          <a
            href={`https://scan.botchain.ai/address/${ARCADE_SCORE_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="onchain-explorer-btn"
          >
            📜 View Score Contract ↗
          </a>
        )}
      </div>
    </div>
  );
};
