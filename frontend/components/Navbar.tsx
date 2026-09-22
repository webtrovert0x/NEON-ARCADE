'use client';

import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { WalletWidget } from './WalletWidget';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    soundEnabled,
    toggleSound,
    globalScore,
    globalWins,
  } = useWeb3();

  return (
    <header className="navbar">
      {/* Brand Section */}
      <div className="nav-brand" onClick={() => setActiveTab('lobby')}>
        <div className="nav-logo-icon">⚡</div>
        <div className="nav-brand-text">NEON ARCADE</div>
        <span className="nav-testnet-tag" style={{ background: 'rgba(0, 255, 157, 0.15)', borderColor: 'rgba(0, 255, 157, 0.5)', color: '#00ff9d' }}>MAINNET</span>
      </div>

      {/* Game Selector Tabs */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'lobby' ? 'active' : ''}`}
          onClick={() => setActiveTab('lobby')}
        >
          🎮 Lobby
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'neon-oracle' ? 'active' : ''}`}
          onClick={() => setActiveTab('neon-oracle')}
        >
          🔮 Neon Oracle
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'quantum-flip' ? 'active' : ''}`}
          onClick={() => setActiveTab('quantum-flip')}
        >
          🪙 Quantum Flip
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'cipher-breaker' ? 'active' : ''}`}
          onClick={() => setActiveTab('cipher-breaker')}
        >
          🔐 Cipher Breaker
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'grid-rush' ? 'active' : ''}`}
          onClick={() => setActiveTab('grid-rush')}
        >
          ⚡ Grid Rush
        </button>
      </nav>

      {/* Right Controls: Score + Wallet + Audio */}
      <div className="nav-controls">
        {/* Global XP / Score Pill */}
        <div
          className="score-pill"
          title={`Total Wins: ${globalWins}`}
        >
          🏆 {globalScore} PTS
        </div>

        {/* Web3 Wallet Widget */}
        <WalletWidget />

        {/* Audio Toggle */}
        <button
          className="icon-btn"
          onClick={toggleSound}
          aria-label="Toggle Sound"
          title={soundEnabled ? 'Mute SFX' : 'Unmute SFX'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  );
};
