'use client';

import React from 'react';
import { ARCADE_SCORE_CONTRACT_ADDRESS } from '../config/arcadeContract';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: '60px',
        padding: '32px 24px',
        borderTop: '1px solid rgba(0, 240, 255, 0.15)',
        background: 'rgba(7, 9, 19, 0.85)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px 16px 0 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Top Ecosystem Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Brand & Ecosystem info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src="/logo.jpg"
            alt="Neon Arcade Logo"
            style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid rgba(0,240,255,0.4)', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', color: '#fff', letterSpacing: '1px' }}>
              NEON ARCADE
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Decentralized Quantum Gaming & On-Chain Score Vault
            </div>
          </div>
        </div>

        {/* Official BOT Chain Ecosystem Links (Criterion 3) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="https://botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(0, 255, 157, 0.08)',
              border: '1px solid rgba(0, 255, 157, 0.3)',
              color: '#00ff9d',
              fontSize: '0.85rem',
              textDecoration: 'none',
              fontFamily: 'Orbitron, sans-serif',
              transition: 'all 0.2s ease',
            }}
          >
            <span>🤖</span>
            <span>BOT Chain Website ↗</span>
          </a>

          <a
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#00f0ff',
              fontSize: '0.85rem',
              textDecoration: 'none',
              fontFamily: 'Orbitron, sans-serif',
              transition: 'all 0.2s ease',
            }}
          >
            <span>🔍</span>
            <span>BOT Chain Explorer ↗</span>
          </a>

          <a
            href={`https://scan.botchain.ai/address/${ARCADE_SCORE_CONTRACT_ADDRESS}#code`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 0, 127, 0.08)',
              border: '1px solid rgba(255, 0, 127, 0.3)',
              color: '#ff007f',
              fontSize: '0.85rem',
              textDecoration: 'none',
              fontFamily: 'Orbitron, sans-serif',
              transition: 'all 0.2s ease',
            }}
          >
            <span>📜</span>
            <span>Verified Score Contract ↗</span>
          </a>
        </div>
      </div>

      {/* Bottom Telemetry & Copyright */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}
      >
        <div>
          Powered by <strong style={{ color: '#00ff9d' }}>BOT Chain Mainnet</strong> (Chain ID: 677 • RPC: https://rpc.botchain.ai)
        </div>
        <div>
          © {new Date().getFullYear()} Neon Arcade. 100% On-Chain Verified.
        </div>
      </div>
    </footer>
  );
};
