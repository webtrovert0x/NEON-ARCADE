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
    isBotChain,
    switchToBotChain,
  } = useWeb3();

  return (
    <header className="navbar-wrapper">
      {/* ─── TOP BAR: Brand, Chain, Score, BOT Chain Link & Wallet ─── */}
      <div className="navbar-top">
        {/* Left: Brand & Chain Indicator */}
        <div className="nav-top-left">
          <div
            className="nav-brand"
            onClick={() => setActiveTab('lobby')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <img
              src="/logo.jpg"
              alt="NEON ARCADE Logo"
              className="nav-logo-img"
            />
            <div className="nav-brand-text">NEON ARCADE</div>
            <span className="nav-mainnet-badge">
              <span className="live-dot" />
              MAINNET
            </span>
          </div>

          {/* Target Chain Badge */}
          <div
            className={`nav-chain-pill ${isBotChain ? 'chain-active' : 'chain-warning'}`}
            onClick={!isBotChain ? switchToBotChain : undefined}
            title={isBotChain ? 'Connected to BOT Chain Mainnet (677)' : 'Click to switch to BOT Chain Mainnet (677)'}
          >
            <img
              src="/bot_token_icon.svg"
              alt="BOT Chain"
              style={{ width: '15px', height: '15px' }}
            />
            <span className="chain-text">BOT Chain</span>
            <span className="chain-id-tag">677</span>
          </div>
        </div>

        {/* Right: Score Pill, Official BOT Chain Link, Wallet Widget, Audio */}
        <div className="nav-top-right">
          {/* Global XP / Score Pill */}
          <div className="score-pill" title={`Total Wins: ${globalWins}`}>
            🏆 {globalScore} PTS
          </div>

          {/* Official BOT Chain Link */}
          <a
            href="https://www.botchain.ai/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-botchain-link"
            title="Visit official BOT Chain Website"
          >
            <img
              src="/bot_token_icon.svg"
              alt="BOT Chain"
              style={{ width: '15px', height: '15px' }}
            />
            <span>BOT Chain ↗</span>
          </a>

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
      </div>

      {/* ─── BOTTOM BAR: Available Arcade Games Navigation ─── */}
      <nav className="navbar-bottom">
        <div className="nav-games-label">
          <span>🎮 ARCADE GAMES</span>
        </div>

        <div className="nav-games-tabs">
          <button
            className={`nav-game-tab ${activeTab === 'lobby' ? 'active' : ''}`}
            onClick={() => setActiveTab('lobby')}
          >
            <span className="tab-icon">🕹️</span>
            <span className="tab-title">Lobby</span>
          </button>

          <button
            className={`nav-game-tab ${activeTab === 'neon-oracle' ? 'active' : ''}`}
            onClick={() => setActiveTab('neon-oracle')}
          >
            <span className="tab-icon">🔮</span>
            <span className="tab-title">Neon Oracle</span>
            <span className="tab-badge cyan">Prediction</span>
          </button>

          <button
            className={`nav-game-tab ${activeTab === 'quantum-flip' ? 'active' : ''}`}
            onClick={() => setActiveTab('quantum-flip')}
          >
            <span className="tab-icon">🪙</span>
            <span className="tab-title">Quantum Flip</span>
            <span className="tab-badge magenta">16x Multiplier</span>
          </button>

          <button
            className={`nav-game-tab ${activeTab === 'cipher-breaker' ? 'active' : ''}`}
            onClick={() => setActiveTab('cipher-breaker')}
          >
            <span className="tab-icon">🔐</span>
            <span className="tab-title">Cipher Breaker</span>
            <span className="tab-badge purple">+350 PTS</span>
          </button>

          <button
            className={`nav-game-tab ${activeTab === 'grid-rush' ? 'active' : ''}`}
            onClick={() => setActiveTab('grid-rush')}
          >
            <span className="tab-icon">⚡</span>
            <span className="tab-title">Grid Rush</span>
            <span className="tab-badge gold">50x Multiplier</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
