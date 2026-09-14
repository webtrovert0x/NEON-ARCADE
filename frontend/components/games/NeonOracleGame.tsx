'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { playSound } from '../../lib/audio';

interface TierConfig {
  name: string;
  max: number;
  attempts: number;
  points: number;
}

const TIERS: Record<string, TierConfig> = {
  initiate: { name: 'Initiate', max: 50, attempts: 7, points: 100 },
  seer: { name: 'Seer', max: 100, attempts: 5, points: 250 },
  grand: { name: 'Grand Oracle', max: 500, attempts: 8, points: 500 },
};

export const NeonOracleGame: React.FC = () => {
  const { soundEnabled, recordWin, showToast } = useWeb3();

  const [tier, setTier] = useState<string>('seer');
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);
  const [guessInput, setGuessInput] = useState<string>('');
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [statusText, setStatusText] = useState<string>('ORACLE AWAITING FREQUENCY...');
  const [history, setHistory] = useState<{ val: number; result: 'low' | 'high' | 'win' }[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  // Local game stats
  const [streak, setStreak] = useState<number>(0);
  const [totalWins, setTotalWins] = useState<number>(0);

  const initRound = (selectedTier = tier) => {
    const config = TIERS[selectedTier];
    setTier(selectedTier);
    setTargetNumber(Math.floor(Math.random() * config.max) + 1);
    setAttemptsLeft(config.attempts);
    setGuessInput('');
    setHistory([]);
    setHint(null);
    setGameActive(true);
    setGameWon(false);
    setStatusText('ORACLE AWAITING FREQUENCY...');
  };

  useEffect(() => {
    initRound('seer');
  }, []);

  const handleGuess = () => {
    if (!gameActive) return;
    const guess = parseInt(guessInput, 10);
    const config = TIERS[tier];

    if (isNaN(guess) || guess < 1 || guess > config.max) {
      showToast(`Enter a frequency between 1 and ${config.max}`, 'warn');
      playSound('fail', soundEnabled);
      return;
    }

    if (history.some((h) => h.val === guess)) {
      showToast(`Frequency ${guess} already probed!`, 'warn');
      return;
    }

    setIsAnalyzing(true);
    const newAttempts = attemptsLeft - 1;
    setAttemptsLeft(newAttempts);

    setTimeout(() => {
      setIsAnalyzing(false);

      if (guess === targetNumber) {
        // WIN
        setGameActive(false);
        setGameWon(true);
        setTotalWins((w) => w + 1);
        setStreak((s) => s + 1);
        recordWin(config.points);
        playSound('win', soundEnabled);
        setHistory((prev) => [...prev, { val: guess, result: 'win' }]);
        setStatusText(`🌟 ORACLE SYNCHRONIZED! TARGET WAS [ ${targetNumber} ]`);
        showToast(`Synchronized! +${config.points} PTS Earned!`, 'success');
      } else {
        const isTooLow = guess < targetNumber;
        setHistory((prev) => [...prev, { val: guess, result: isTooLow ? 'low' : 'high' }]);

        if (newAttempts <= 0) {
          // LOSS
          setGameActive(false);
          setStreak(0);
          playSound('fail', soundEnabled);
          setStatusText(`⚠️ ORACLE OVERLOAD! Frequency was [ ${targetNumber} ]`);
          showToast('Energy nodes depleted.', 'error');
        } else {
          playSound(isTooLow ? 'higher' : 'lower', soundEnabled);
          const diff = Math.abs(guess - targetNumber);
          const proximity = diff <= 5 ? '🔥 PROXIMITY CRITICAL' : diff <= 15 ? '⚡ SIGNAL WARM' : '❄️ SIGNAL COLD';
          setStatusText(`${proximity}: TARGET IS ${isTooLow ? 'HIGHER ▲' : 'LOWER ▼'}`);
        }
      }
      setGuessInput('');
    }, 250);
  };

  const requestHint = () => {
    if (!gameActive || attemptsLeft <= 1) {
      showToast('Need at least 2 energy nodes for quantum hint', 'warn');
      return;
    }
    playSound('hint', soundEnabled);
    const isEven = targetNumber % 2 === 0;
    const isPrime = (n: number) => {
      if (n <= 1) return false;
      if (n <= 3) return true;
      if (n % 2 === 0 || n % 3 === 0) return false;
      for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
      }
      return true;
    };
    const config = TIERS[tier];
    const hints = [
      `Target frequency is an ${isEven ? 'EVEN' : 'ODD'} harmonic.`,
      isPrime(targetNumber) ? 'Quantum scan detects a PRIME signature.' : 'Frequency is a COMPOSITE number.',
      targetNumber > config.max / 2
        ? `Frequency is in the UPPER half [>${Math.floor(config.max / 2)}].`
        : `Frequency is in the LOWER half [≤${Math.floor(config.max / 2)}].`,
    ];
    setHint(hints[Math.floor(Math.random() * hints.length)]);
    showToast('Quantum hint decoded!');
  };

  const config = TIERS[tier];

  return (
    <div className="cyber-card" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div
          style={{
            display: 'inline-block',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.75rem',
            color: 'var(--neon-purple)',
            background: 'rgba(168, 85, 247, 0.12)',
            padding: '4px 12px',
            borderRadius: '4px',
            border: '1px solid rgba(168,85,247,0.3)',
            marginBottom: '8px',
          }}
        >
          FREQUENCY MATRIX
        </div>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', color: '#fff' }}>
          NEON ORACLE
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Decrypt the target quantum frequency on BOT Chain Testnet
        </p>
      </div>

      {/* 3D Oracle Sphere Core */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div
          className="oracle-core"
          style={{
            transform: isAnalyzing ? 'scale(1.15)' : 'scale(1)',
            filter: gameWon ? 'hue-rotate(90deg)' : 'none',
          }}
        >
          <div className="oracle-rings"></div>
        </div>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '1.05rem',
            color: gameWon ? 'var(--neon-green)' : 'var(--neon-cyan)',
            minHeight: '26px',
            textShadow: '0 0 10px rgba(0,240,255,0.4)',
          }}
        >
          {statusText}
        </div>
      </div>

      {/* Tier Selector */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calibration Tier</span>
          <span style={{ color: 'var(--neon-cyan)', fontFamily: 'Orbitron, sans-serif' }}>
            [ Range: 1 — {config.max} ]
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {Object.entries(TIERS).map(([key, t]) => (
            <button
              key={key}
              className={`nav-tab-btn ${tier === key ? 'active' : ''}`}
              style={{ padding: '10px 6px', flexDirection: 'column', textAlign: 'center', width: '100%' }}
              onClick={() => {
                playSound('click', soundEnabled);
                initRound(key);
              }}
            >
              <span style={{ fontWeight: '800', fontSize: '0.85rem' }}>{t.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 — {t.max}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--neon-gold)' }}>🏆 +{t.points} PTS</span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy Nodes & Input */}
      <div
        style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(0,240,255,0.2)',
          borderRadius: '14px',
          padding: '18px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ENERGY NODES:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: config.attempts }).map((_, i) => (
              <div
                key={i}
                className={`energy-node ${i >= attemptsLeft ? 'spent' : ''}`}
              />
            ))}
          </div>
          <span style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--neon-cyan)', fontSize: '0.9rem' }}>
            {attemptsLeft}/{config.attempts}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
            disabled={!gameActive}
            placeholder="PROBE FREQ"
            style={{ flex: 1, textAlign: 'center', fontSize: '1.2rem' }}
          />
          <button
            onClick={handleGuess}
            disabled={!gameActive}
            style={{
              background: 'linear-gradient(135deg, var(--neon-cyan), #0077ff)',
              color: '#000',
              fontWeight: '800',
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: gameActive ? 'pointer' : 'not-allowed',
              opacity: gameActive ? 1 : 0.5,
            }}
          >
            PROBE
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button
            onClick={requestHint}
            disabled={!gameActive || !!hint}
            className="nav-tab-btn"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            🔮 Quantum Hint
          </button>
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              initRound();
            }}
            className="nav-tab-btn"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            🔄 Re-Calibrate
          </button>
        </div>

        {hint && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              background: 'rgba(168, 85, 247, 0.15)',
              borderLeft: '3px solid var(--neon-purple)',
              borderRadius: '6px',
              fontSize: '0.9rem',
              color: '#e9d5ff',
            }}
          >
            🔮 {hint}
          </div>
        )}
      </div>

      {/* History Telemetry Stream */}
      <div
        style={{
          background: 'rgba(5, 8, 18, 0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px',
        }}
      >
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
          Signal Telemetry Logs:
        </div>
        <div>
          {history.length === 0 ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No frequencies submitted yet.</span>
          ) : (
            history.map((h, i) => (
              <span
                key={i}
                className={`guess-chip ${h.result === 'low' ? 'chip-low' : h.result === 'high' ? 'chip-high' : 'chip-win'}`}
              >
                {h.val} {h.result === 'low' ? '▲ HIGHER' : h.result === 'high' ? '▼ LOWER' : '★ SYNCHRONIZED'}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Game Stats HUD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.2rem', color: 'var(--neon-cyan)' }}>
            {totalWins}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL SYNCS</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.2rem', color: '#fff' }}>
            {streak} 🔥
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACTIVE STREAK</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.2rem', color: 'var(--neon-gold)' }}>
            {totalWins * config.points}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL SCORE</div>
        </div>
      </div>
    </div>
  );
};
