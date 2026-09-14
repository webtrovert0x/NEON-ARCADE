'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { playSound } from '../../lib/audio';

interface AttemptLog {
  code: string;
  exact: number;
  displaced: number;
}

export const CipherBreakerGame: React.FC = () => {
  const { soundEnabled, recordWin, showToast } = useWeb3();

  const maxAttempts = 6;
  const pointsReward = 350;

  const [secretCode, setSecretCode] = useState<string>('0000');
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [attempts, setAttempts] = useState<AttemptLog[]>([]);
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [status, setStatus] = useState<string>('SECURITY VAULT LOCKED');
  const [isBreached, setIsBreached] = useState<boolean>(false);

  const generateSecretCode = () => {
    const pool = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = '';
    for (let i = 0; i < 4; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      result += pool[idx];
      pool.splice(idx, 1);
    }
    return result;
  };

  const initGame = () => {
    const code = generateSecretCode();
    setSecretCode(code);
    setDigits(['', '', '', '']);
    setAttempts([]);
    setGameActive(true);
    setIsBreached(false);
    setStatus('SECURITY VAULT LOCKED');
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    playSound('click', soundEnabled);

    // Auto-focus next input if filled
    if (val && index < 3) {
      const nextInput = document.getElementById(`cipher-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`cipher-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === 'Enter') {
      submitCode();
    }
  };

  const submitCode = () => {
    if (!gameActive) return;
    const fullCode = digits.join('');
    if (fullCode.length !== 4) {
      showToast('Enter all 4 security digits!', 'warn');
      return;
    }

    let exact = 0;
    let displaced = 0;

    for (let i = 0; i < 4; i++) {
      if (fullCode[i] === secretCode[i]) {
        exact++;
      } else if (secretCode.includes(fullCode[i])) {
        displaced++;
      }
    }

    const newAttempts = [...attempts, { code: fullCode, exact, displaced }];
    setAttempts(newAttempts);

    if (exact === 4) {
      // BREACHED!
      setGameActive(false);
      setIsBreached(true);
      recordWin(pointsReward);
      playSound('unlock', soundEnabled);
      setStatus('🔓 VAULT BREACHED! DECRYPTION COMPLETE');
      showToast(`Access Granted! +${pointsReward} PTS Earned!`, 'success');
    } else if (newAttempts.length >= maxAttempts) {
      // LOCKED OUT
      setGameActive(false);
      playSound('fail', soundEnabled);
      setStatus(`🔒 LOCKDOWN INITIATED! Code was [ ${secretCode} ]`);
      showToast('Security lockdown triggered!', 'error');
    } else {
      playSound('higher', soundEnabled);
      setStatus(`TELEMETRY: ${exact} EXACT, ${displaced} DISPLACED`);
      setDigits(['', '', '', '']);
      const firstInput = document.getElementById('cipher-input-0');
      if (firstInput) firstInput.focus();
    }
  };

  const attemptsRemaining = maxAttempts - attempts.length;

  return (
    <div className="cyber-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div
          style={{
            display: 'inline-block',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.75rem',
            color: 'var(--neon-green)',
            background: 'rgba(0, 255, 157, 0.12)',
            padding: '4px 12px',
            borderRadius: '4px',
            border: '1px solid rgba(0,255,157,0.3)',
            marginBottom: '8px',
          }}
        >
          SECURITY TERMINAL
        </div>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', color: '#fff' }}>
          CIPHER BREAKER
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Deduce the 4-digit holographic passcode to breach the security vault
        </p>
      </div>

      {/* Vault Status Graphic */}
      <div
        style={{
          textAlign: 'center',
          padding: '16px',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '12px',
          border: '1px solid rgba(0,240,255,0.2)',
          marginBottom: '20px',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>
          {isBreached ? '🔓' : attemptsRemaining <= 0 ? '🔒' : '🛡️'}
        </div>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '1.1rem',
            color: isBreached ? 'var(--neon-green)' : attemptsRemaining <= 0 ? 'var(--neon-magenta)' : 'var(--neon-cyan)',
            fontWeight: '700',
          }}
        >
          {status}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Remaining Breach Cycles: <strong style={{ color: '#fff' }}>{attemptsRemaining}/{maxAttempts}</strong>
        </div>
      </div>

      {/* 4-Digit Input Fields */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
        {digits.map((digit, i) => (
          <input
            key={i}
            id={`cipher-input-${i}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={!gameActive}
            style={{
              width: '64px',
              height: '64px',
              fontSize: '2rem',
              textAlign: 'center',
              borderRadius: '10px',
              border: '2px solid rgba(0,240,255,0.4)',
            }}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button
          onClick={submitCode}
          disabled={!gameActive}
          style={{
            flex: 2,
            background: 'linear-gradient(135deg, var(--neon-green), #00b4d8)',
            color: '#000',
            fontWeight: '800',
            fontSize: '1.1rem',
            padding: '14px',
            borderRadius: '10px',
            border: 'none',
            cursor: gameActive ? 'pointer' : 'not-allowed',
            opacity: gameActive ? 1 : 0.5,
          }}
        >
          INJECT CODE
        </button>
        <button
          onClick={() => {
            playSound('click', soundEnabled);
            initGame();
          }}
          className="nav-tab-btn"
          style={{ flex: 1, justifyContent: 'center' }}
        >
          🔄 Reset Vault
        </button>
      </div>

      {/* Decryption Logs Feed */}
      <div
        style={{
          background: 'rgba(5, 8, 18, 0.7)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '16px',
        }}
      >
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
          Passcode Probe History:
        </div>
        {attempts.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Awaiting initial decryption attempt...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {attempts.map((att, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontFamily: 'Orbitron, sans-serif',
                }}
              >
                <span style={{ fontSize: '1.1rem', letterSpacing: '4px', color: 'var(--neon-cyan)' }}>
                  {att.code}
                </span>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--neon-green)' }}>🟢 {att.exact} EXACT</span>
                  <span style={{ color: 'var(--neon-gold)' }}>🟡 {att.displaced} DISPLACED</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
