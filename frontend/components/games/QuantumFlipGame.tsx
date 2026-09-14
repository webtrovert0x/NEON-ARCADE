'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { playSound } from '../../lib/audio';

export const QuantumFlipGame: React.FC = () => {
  const { soundEnabled, recordWin, showToast } = useWeb3();

  const [basePoints, setBasePoints] = useState<number>(100);
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [flipDegree, setFlipDegree] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [potScore, setPotScore] = useState<number>(0);

  const flipCoin = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    playSound('flip', soundEnabled);
    setCoinResult(null);

    // Random outcome: heads (0) or tails (1)
    const outcome: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
    const extraRotations = 1800 + (outcome === 'tails' ? 180 : 0);
    const newDegree = flipDegree + extraRotations;
    setFlipDegree(newDegree);

    setTimeout(() => {
      setIsFlipping(false);
      setCoinResult(outcome);

      if (outcome === selectedSide) {
        // WON FLIP
        const nextStreak = streak + 1;
        const multiplier = Math.pow(2, nextStreak);
        const currentScore = basePoints * multiplier;
        setStreak(nextStreak);
        setPotScore(currentScore);
        playSound('win', soundEnabled);
        showToast(`Quantum State Match! Multiplier: ${multiplier}x (${currentScore} PTS)`, 'success');
      } else {
        // LOST FLIP
        setStreak(0);
        setPotScore(0);
        playSound('fail', soundEnabled);
        showToast('Quantum State Collapse! Streak lost.', 'error');
      }
    }, 1200);
  };

  const cashout = () => {
    if (potScore <= 0) return;
    recordWin(potScore);
    showToast(`Locked in ${potScore} PTS Score!`, 'success');
    playSound('win', soundEnabled);
    setPotScore(0);
    setStreak(0);
  };

  return (
    <div className="cyber-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'inline-block',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.75rem',
            color: 'var(--neon-magenta)',
            background: 'rgba(255, 0, 127, 0.12)',
            padding: '4px 12px',
            borderRadius: '4px',
            border: '1px solid rgba(255,0,127,0.3)',
            marginBottom: '8px',
          }}
        >
          BINARY QUANTUM ENGINE
        </div>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', color: '#fff' }}>
          QUANTUM FLIP
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Predict the collapsed quantum state & build consecutive streak multipliers
        </p>
      </div>

      {/* 3D Coin Animation */}
      <div className="coin-wrapper">
        <div
          className={`coin ${isFlipping ? 'flipping' : ''}`}
          style={{
            transform: !isFlipping ? `rotateY(${flipDegree}deg)` : undefined,
          }}
        >
          <div className="coin-side coin-heads">CYAN [0]</div>
          <div className="coin-side coin-tails">MAGENTA [1]</div>
        </div>
      </div>

      {/* Status Bar */}
      <div
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '1.1rem',
          color: coinResult ? (coinResult === selectedSide ? 'var(--neon-green)' : 'var(--neon-magenta)') : 'var(--neon-cyan)',
          margin: '16px 0',
          minHeight: '28px',
        }}
      >
        {isFlipping
          ? 'SPINNING QUANTUM SUPERPOSITION...'
          : coinResult
          ? `RESULT: ${coinResult.toUpperCase()} ${coinResult === selectedSide ? '✨ (WIN)' : '⚠️ (COLLAPSED)'}`
          : 'SELECT QUANTUM STATE & INITIATE'}
      </div>

      {/* State Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
        <button
          className={`nav-tab-btn ${selectedSide === 'heads' ? 'active' : ''}`}
          style={{
            padding: '14px',
            justifyContent: 'center',
            borderColor: selectedSide === 'heads' ? 'var(--neon-cyan)' : undefined,
            boxShadow: selectedSide === 'heads' ? '0 0 15px rgba(0,240,255,0.4)' : undefined,
          }}
          disabled={isFlipping}
          onClick={() => {
            playSound('click', soundEnabled);
            setSelectedSide('heads');
          }}
        >
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--neon-cyan)' }}>
            CYAN 0x0
          </span>
        </button>

        <button
          className={`nav-tab-btn ${selectedSide === 'tails' ? 'active' : ''}`}
          style={{
            padding: '14px',
            justifyContent: 'center',
            borderColor: selectedSide === 'tails' ? 'var(--neon-magenta)' : undefined,
            boxShadow: selectedSide === 'tails' ? '0 0 15px rgba(255,0,127,0.4)' : undefined,
          }}
          disabled={isFlipping}
          onClick={() => {
            playSound('click', soundEnabled);
            setSelectedSide('tails');
          }}
        >
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--neon-magenta)' }}>
            MAGENTA 0x1
          </span>
        </button>
      </div>

      {/* Base Multiplier / Points Selector */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
          Base Score Tier:
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {[50, 100, 250, 500].map((val) => (
            <button
              key={val}
              className={`nav-tab-btn ${basePoints === val ? 'active' : ''}`}
              disabled={isFlipping || streak > 0}
              onClick={() => {
                playSound('click', soundEnabled);
                setBasePoints(val);
              }}
            >
              {val} PTS
            </button>
          ))}
        </div>
      </div>

      {/* Flip Action & Lock in */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={flipCoin}
          disabled={isFlipping}
          style={{
            flex: 2,
            background: 'linear-gradient(135deg, var(--neon-magenta), #9900ff)',
            color: '#fff',
            fontWeight: '900',
            fontSize: '1.1rem',
            padding: '14px',
            borderRadius: '10px',
            border: 'none',
            cursor: isFlipping ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 20px rgba(255, 0, 127, 0.4)',
          }}
        >
          {streak > 0 ? `DOUBLE UP (${Math.pow(2, streak + 1)}x)` : 'FLIP QUANTUM COIN'}
        </button>

        {potScore > 0 && (
          <button
            onClick={cashout}
            disabled={isFlipping}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, var(--neon-green), #00b4d8)',
              color: '#000',
              fontWeight: '900',
              fontSize: '1.1rem',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 255, 157, 0.4)',
            }}
          >
            LOCK IN {potScore} PTS
          </button>
        )}
      </div>

      {/* Streak Telemetry Box */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginTop: '24px',
          padding: '14px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CURRENT STREAK</div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: 'var(--neon-gold)' }}>
            {streak} {streak > 0 ? '🔥' : ''}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>STREAK SCORE</div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: 'var(--neon-green)' }}>
            🏆 {potScore} PTS
          </div>
        </div>
      </div>
    </div>
  );
};
