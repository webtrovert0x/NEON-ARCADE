'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { GameCard } from '../components/GameCard';
import { OnChainScoreCard } from '../components/OnChainScoreCard';
import { NeonOracleGame } from '../components/games/NeonOracleGame';
import { QuantumFlipGame } from '../components/games/QuantumFlipGame';
import { CipherBreakerGame } from '../components/games/CipherBreakerGame';
import { GridRushGame } from '../components/games/GridRushGame';
import { useWeb3 } from '../context/Web3Context';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('lobby');
  const { globalWins, globalScore } = useWeb3();

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'lobby' && (
        <div>
          {/* Hero Section */}
          <div className="arcade-hero">
            <div
              style={{
                display: 'inline-block',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.8rem',
                color: 'var(--neon-cyan)',
                background: 'rgba(0, 240, 255, 0.1)',
                padding: '6px 16px',
                borderRadius: '999px',
                border: '1px solid rgba(0,240,255,0.3)',
                marginBottom: '12px',
                letterSpacing: '1.5px',
              }}
            >
              BOT CHAIN TESTNET ARCADE
            </div>
            <h1 className="arcade-title">NEON ARCADE</h1>
            <p className="arcade-sub">
              Decentralized quantum mini-games, prediction matrices & high score challenges
            </p>
          </div>

          {/* On-Chain Score Sync & Vault Card */}
          <OnChainScoreCard />

          {/* Arcade Global Stats Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '36px',
            }}
          >
            <div
              style={{
                background: 'rgba(13, 17, 34, 0.7)',
                border: '1px solid rgba(0,240,255,0.2)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GAMES WON</div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.8rem', color: 'var(--neon-cyan)' }}>
                {globalWins}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(13, 17, 34, 0.7)',
                border: '1px solid rgba(255,190,11,0.2)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ARCADE SCORE</div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.8rem', color: 'var(--neon-gold)' }}>
                🏆 {globalScore} PTS
              </div>
            </div>

            <div
              style={{
                background: 'rgba(13, 17, 34, 0.7)',
                border: '1px solid rgba(0,255,157,0.2)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TARGET NETWORK</div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem', color: 'var(--neon-green)', marginTop: '4px' }}>
                BOT Chain (968)
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="games-grid">
            <GameCard
              id="neon-oracle"
              badge="SIGNATURE PREDICTION"
              badgeColor="cyan"
              icon="🔮"
              title="Neon Oracle"
              description="Probe harmonic frequencies and synchronize with the quantum matrix across 3 difficulty tiers."
              reward="+500 PTS Max"
              onSelect={setActiveTab}
            />

            <GameCard
              id="quantum-flip"
              badge="DOUBLE OR NOTHING"
              badgeColor="magenta"
              icon="🪙"
              title="Quantum Flip"
              description="Predict binary quantum spin collapse and build consecutive streak multipliers up to 16x."
              reward="Up to 16x Multiplier"
              onSelect={setActiveTab}
            />

            <GameCard
              id="cipher-breaker"
              badge="SECURITY TERMINAL"
              badgeColor="purple"
              icon="🔐"
              title="Cipher Breaker"
              description="Deduce the encrypted 4-digit holographic security code using positional feedback telemetry."
              reward="+350 PTS Vault"
              onSelect={setActiveTab}
            />

            <GameCard
              id="grid-rush"
              badge="HIGH MULTIPLIER"
              badgeColor="gold"
              icon="⚡"
              title="Grid Rush"
              description="Slide probability thresholds, roll quantum dice, and hunt multipliers up to 50x payout."
              reward="Up to 50x Multiplier"
              onSelect={setActiveTab}
            />
          </div>

          {/* Quick Info & Telemetry Card */}
          <div
            className="cyber-card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h4 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>
                Powered by BOT Chain Testnet
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Chain ID: 968 (0x3c8) • RPC: https://rpc.bohr.life • Zero latency & high scores
              </p>
            </div>
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-tab-btn"
              style={{ textDecoration: 'none', color: 'var(--neon-cyan)', borderColor: 'var(--neon-cyan)' }}
            >
              Testnet Scan ↗
            </a>
          </div>
        </div>
      )}

      {activeTab === 'neon-oracle' && <NeonOracleGame />}
      {activeTab === 'quantum-flip' && <QuantumFlipGame />}
      {activeTab === 'cipher-breaker' && <CipherBreakerGame />}
      {activeTab === 'grid-rush' && <GridRushGame />}
    </>
  );
}
