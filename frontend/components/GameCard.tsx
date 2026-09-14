'use client';

import React from 'react';
import { playSound } from '../lib/audio';
import { useWeb3 } from '../context/Web3Context';

interface GameCardProps {
  id: string;
  badge: string;
  badgeColor: 'cyan' | 'magenta' | 'purple' | 'gold';
  icon: string;
  title: string;
  description: string;
  reward: string;
  onSelect: (id: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  id,
  badge,
  badgeColor,
  icon,
  title,
  description,
  reward,
  onSelect,
}) => {
  const { soundEnabled } = useWeb3();

  return (
    <div
      className="game-card-item"
      onClick={() => {
        playSound('click', soundEnabled);
        onSelect(id);
      }}
    >
      <div>
        <div className={`game-badge ${badgeColor}`}>{badge}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.6rem' }}>{icon}</span>
          <h3 className="game-name">{title}</h3>
        </div>
        <p className="game-desc">{description}</p>
      </div>

      <div className="game-footer">
        <span className="game-bounty">🏆 {reward}</span>
        <button className="play-now-btn">PLAY ↗</button>
      </div>
    </div>
  );
};
