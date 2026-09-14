'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBalance } from 'wagmi';
import { useWeb3 } from '../context/Web3Context';
import { playSound } from '../lib/audio';

export const WalletWidget: React.FC = () => {
  const {
    account,
    isConnected,
    isBotChain,
    connectWallet,
    disconnectWallet,
    switchToBotChain,
    openAppKit,
    soundEnabled,
    showToast,
  } = useWeb3();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch real-time BOT balance on testnet
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: (account as `0x${string}`) || undefined,
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    playSound('click', soundEnabled);
    showToast('Address copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const formatBalance = () => {
    if (isBalanceLoading) return '...';
    if (!balanceData) return '0.00 BOT';
    const val = parseFloat(balanceData.formatted);
    if (isNaN(val)) return '0.00 BOT';
    if (val === 0) return '0.00 BOT';
    if (val < 0.001) return '<0.001 BOT';
    return `${val.toFixed(3)} ${balanceData.symbol || 'BOT'}`;
  };

  if (!isConnected || !account) {
    return (
      <button
        onClick={connectWallet}
        className="wallet-connect-btn"
        title="Connect Web3 Wallet via Reown AppKit"
      >
        <span className="wallet-btn-icon">⚡</span>
        <span className="wallet-btn-text">Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="wallet-widget-container" ref={dropdownRef}>
      {/* Network Warning Pill if on wrong chain */}
      {!isBotChain && (
        <button
          onClick={switchToBotChain}
          className="network-switch-pill"
          title="Click to switch to BOT Chain Testnet (968)"
        >
          ⚠️ Switch to BOT Chain
        </button>
      )}

      {/* Ultra-Sleek Cyberpunk Glass Pill */}
      <div
        onClick={() => {
          playSound('click', soundEnabled);
          setDropdownOpen(!dropdownOpen);
        }}
        className={`wallet-glass-pill ${!isBotChain ? 'network-warning' : ''} ${dropdownOpen ? 'active-dropdown' : ''}`}
        role="button"
        tabIndex={0}
        aria-expanded={dropdownOpen}
      >
        {/* Network & Live Balance Segment */}
        <div className="wallet-pill-segment balance-segment" title="Connected to BOT Chain Testnet">
          <span
            className={`wallet-live-beacon ${isBotChain ? 'beacon-live' : 'beacon-warn'}`}
          />
          <span className="wallet-balance-text">{formatBalance()}</span>
        </div>

        <div className="wallet-pill-divider" />

        {/* Address Segment */}
        <div className="wallet-pill-segment address-segment" title={`Connected: ${account}`}>
          <span className="wallet-addr-text">{truncateAddress(account)}</span>
          <span className={`wallet-caret ${dropdownOpen ? 'open' : ''}`}>▾</span>
        </div>
      </div>

      {/* Cyberpunk Holographic Dropdown Menu */}
      {dropdownOpen && (
        <div className="wallet-dropdown-menu">
          <div className="wallet-dropdown-header">
            <div className="wallet-dropdown-avatar">⚡</div>
            <div className="wallet-dropdown-info">
              <div className="wallet-dropdown-title">OPERATOR ACCOUNT</div>
              <div className="wallet-dropdown-addr">{truncateAddress(account)}</div>
            </div>
            <span className="wallet-status-badge">ONLINE</span>
          </div>

          <div className="wallet-dropdown-balance-card">
            <div className="balance-card-label">AVAILABLE BALANCE</div>
            <div className="balance-card-value">
              <span className="balance-amount">{formatBalance()}</span>
            </div>
          </div>

          <div className="wallet-dropdown-divider" />

          {/* Network Row */}
          <div className="wallet-dropdown-item network-row">
            <span className="item-label">Network</span>
            <div className="network-status-group">
              <span className={`network-dot ${isBotChain ? 'online' : 'offline'}`} />
              <span className="network-name-text">
                {isBotChain ? 'BOT Chain Testnet (968)' : 'Wrong Network'}
              </span>
            </div>
          </div>

          <div className="wallet-dropdown-divider" />

          {/* Action Buttons */}
          <div className="wallet-dropdown-actions">
            <button
              onClick={handleCopy}
              className="wallet-dropdown-action"
            >
              <span className="action-icon">{copied ? '✅' : '📋'}</span>
              <span className="action-label">{copied ? 'Copied to Clipboard!' : 'Copy Address'}</span>
            </button>

            <a
              href={`https://scan.bohr.life/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wallet-dropdown-action"
              onClick={() => setDropdownOpen(false)}
            >
              <span className="action-icon">🔍</span>
              <span className="action-label">View on Bohr Scan ↗</span>
            </a>

            <button
              onClick={() => {
                setDropdownOpen(false);
                openAppKit();
              }}
              className="wallet-dropdown-action"
            >
              <span className="action-icon">⚙️</span>
              <span className="action-label">AppKit Wallet Manager</span>
            </button>

            <div className="wallet-dropdown-divider" />

            <button
              onClick={() => {
                setDropdownOpen(false);
                disconnectWallet();
              }}
              className="wallet-dropdown-action disconnect"
            >
              <span className="action-icon">🚪</span>
              <span className="action-label">Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
