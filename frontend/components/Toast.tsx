'use client';

import React from 'react';
import { useWeb3 } from '../context/Web3Context';

export const Toast: React.FC = () => {
  const { toastMessage, toastType } = useWeb3();

  if (!toastMessage) return null;

  const borderColor =
    toastType === 'warn'
      ? 'var(--neon-magenta)'
      : toastType === 'success'
      ? 'var(--neon-green)'
      : toastType === 'error'
      ? '#ff3333'
      : 'var(--neon-cyan)';

  return (
    <div
      className="cyber-toast show"
      style={{ borderColor, boxShadow: `0 0 20px ${borderColor}` }}
      role="alert"
    >
      <span>{toastType === 'success' ? '✨' : toastType === 'warn' ? '⚠️' : 'ℹ️'}</span>
      <span>{toastMessage}</span>
    </div>
  );
};
