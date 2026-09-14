'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { playSound } from '../../lib/audio';

export const GridRushGame: React.FC = () => {
  const { soundEnabled, recordWin, showToast } = useWeb3();

  const [targetNumber, setTargetNumber] = useState<number>(50);
  const [direction, setDirection] = useState<'under' | 'over'>('under');
  const [basePoints, setBasePoints] = useState<number>(100);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [hasWon, setHasWon] = useState<boolean | null>(null);

  // Math: Win Chance & Multiplier calculation
  const winChance = direction === 'under' ? targetNumber : 100 - targetNumber;
  const multiplier = winChance > 0 ? +(98 / winChance).toFixed(2) : 0;
  const potentialScore = Math.round(basePoints * multiplier);

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    playSound('flip', soundEnabled);
    setRollResult(null);
    setHasWon(null);

    // Random roll from 0.00 to 99.99
    const outcome = +(Math.random() * 99.99).toFixed(2);

    let counter = 0;
    const interval = setInterval(() => {
      setRollResult(+(Math.random() * 99.99).toFixed(2));
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setIsRolling(false);
        setRollResult(outcome);

        const won = direction === 'under' ? outcome < targetNumber : outcome > targetNumber;
        setHasWon(won);

        if (won) {
          recordWin(potentialScore);
          playSound('win', soundEnabled);
          showToast(`Jackpot! Rolled ${outcome}. +${potentialScore} PTS!`, 'success');
        } else {
          playSound('fail', soundEnabled);
          showToast(`Rolled ${outcome}. Target threshold missed!`, 'error');
        }
      }
    }, 50);
  };

  return (
    <div className="cyber-card" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'inline-block',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.75rem',
            color: 'var(--neon-gold)',
            background: 'rgba(255, 190, 11, 0.12)',
            padding: '4px 12px',
            borderRadius: '4px',
            border: '1px solid rgba(255,190,11,0.3)',
            marginBottom: '8px',
          }}
        >
          PROBABILITY MATRIX
        </div>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', color: '#fff' }}>
          GRID RUSH
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Calibrate your risk, roll the quantum dice & capture high multipliers
        </p>
      </div>

      {/* Roll Display Box */}
      <div
        style={{
          background: 'rgba(0,0,0,0.5)',
          border: `2px solid ${hasWon === true ? 'var(--neon-green)' : hasWon === false ? 'var(--neon-magenta)' : 'var(--neon-cyan)'}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: `0 0 25px ${hasWon === true ? 'rgba(0,255,157,0.3)' : hasWon === false ? 'rgba(255,0,127,0.3)' : 'rgba(0,240,255,0.2)'}`,
        }}
      >
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
          QUANTUM DIE ROLL
        </div>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '3.5rem',
            fontWeight: '900',
            color: hasWon === true ? 'var(--neon-green)' : hasWon === false ? 'var(--neon-magenta)' : '#fff',
            letterSpacing: '2px',
          }}
        >
          {rollResult !== null ? rollResult : '00.00'}
        </div>
        <div style={{ fontSize: '0.95rem', color: 'var(--neon-cyan)', fontFamily: 'Orbitron, sans-serif', marginTop: '6px' }}>
          Target: {direction === 'under' ? `< ${targetNumber}` : `> ${targetNumber}`}
        </div>
      </div>

      {/* Probability Sliders & Controls */}
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '20px',
        }}
      >
        {/* Direction Switch */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
          <button
            className={`nav-tab-btn ${direction === 'under' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => {
              playSound('click', soundEnabled);
              setDirection('under');
            }}
          >
            ROLL UNDER ▼
          </button>
          <button
            className={`nav-tab-btn ${direction === 'over' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => {
              playSound('click', soundEnabled);
              setDirection('over');
            }}
          >
            ROLL OVER ▲
          </button>
        </div>

        {/* Range Slider */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Target Threshold:</span>
            <span style={{ color: 'var(--neon-cyan)', fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
              {targetNumber}
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="98"
            value={targetNumber}
            onChange={(e) => setTargetNumber(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--neon-cyan)', cursor: 'pointer' }}
          />
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WIN CHANCE</div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.2rem', color: 'var(--neon-cyan)' }}>
              {winChance}%
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MULTIPLIER</div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.2rem', color: 'var(--neon-gold)' }}>
              {multiplier}x
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>POTENTIAL SCORE</div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.2rem', color: 'var(--neon-green)' }}>
              🏆 {potentialScore} PTS
            </div>
          </div>
        </div>
      </div>

      {/* Base Tier Calibration */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
          Base Score Tier:
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {[50, 100, 250, 500].map((val) => (
            <button
              key={val}
              className={`nav-tab-btn ${basePoints === val ? 'active' : ''}`}
              disabled={isRolling}
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

      {/* Roll Action Button */}
      <button
        onClick={rollDice}
        disabled={isRolling}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, var(--neon-gold), #ff8800)',
          color: '#000',
          fontWeight: '900',
          fontSize: '1.2rem',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          cursor: isRolling ? 'not-allowed' : 'pointer',
          boxShadow: '0 0 25px rgba(255, 190, 11, 0.4)',
        }}
      >
        {isRolling ? 'ROLLING QUANTUM DIE...' : `ROLL MATRIX (${multiplier}x)`}
      </button>
    </div>
  );
};
