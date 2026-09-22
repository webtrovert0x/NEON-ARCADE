# ⚡ NEON ARCADE — BOT Chain Mainnet Multi-Game Web3 Suite

![Next.js](https://img.shields.io/badge/Next.js-14+-00f0ff?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-TSX-3178C6?style=for-the-badge&logo=typescript)
![Network](https://img.shields.io/badge/Network-BOT%20Chain%20Mainnet-00ff9d?style=for-the-badge)
![Whitepaper](https://img.shields.io/badge/Whitepaper-v3.0.0-ff007f?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-00f0ff?style=for-the-badge)

**Neon Arcade** is a decentralized cyberpunk gaming hub and prediction platform built on **Next.js (`.tsx`)**, powered by **Reown AppKit** and **Wagmi v2**, running on **BOT Chain Mainnet (`Chain ID: 677`)**.

📄 **Read the complete system specification in the [NEON ARCADE WHITEPAPER](WHITEPAPER.md).**

---

## 🎮 Featured Games in the Arcade

1. 🔮 **Neon Oracle** (Quantum Frequency Prediction)
   - 3 calibration tiers: *Initiate (1-50, +100 PTS)*, *Seer (1-100, +250 PTS)*, *Grand Oracle (1-500, +500 PTS)*.
   - Interactive 3D quantum sphere, procedural harmonic audio cues, and smart quantum hints.

2. 🪙 **Quantum Flip** (Binary State Double-or-Nothing)
   - Predict Cyan `0x0` or Magenta `0x1` quantum state collapse.
   - 3D animated coin flip, progressive streak multipliers (2x, 4x, 8x, 16x!), and instant score lock-in mechanics.

3. 🔐 **Cipher Breaker** (Security Terminal Vault)
   - Deduce the 4-digit holographic security code.
   - Real-time positional telemetry (`🟢 Exact Matches` vs `🟡 Displaced Digits`).
   - Earn +350 PTS on vault breach.

4. ⚡ **Grid Rush** (Probability & Multiplier Matrix)
   - Slide target roll thresholds (1 - 99) with live win probability and score multipliers scaling up to 50x PTS!

---

## 🌐 BOT Chain Mainnet Parameters

| Parameter | Value |
| :--- | :--- |
| **Network Name** | BOT Chain Mainnet |
| **Chain ID** | `677` (`0x2a5`) |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Currency Symbol** | `BOT` (Decimals: 18) |
| **Total Supply** | 150 Million BOT |
| **Mainnet Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |

---

## 🚀 Quick Start

### 1. Run the Frontend
```bash
# Run Next.js dev server from root:
npm run dev:frontend

# Or directly from the frontend directory:
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Smart Contracts & On-Chain Vault

Deployed live on **BOT Chain Mainnet (`677`)**:
- 🏆 **`NeonArcadeScore`**: [`0x1b86c8c2F24f748302edc6fe8f53A161F7c4cFF0`](https://scan.botchain.ai/address/0x1b86c8c2F24f748302edc6fe8f53A161F7c4cFF0)
- 🔮 **`NeonOracle`**: [`0xDC93C0E2B3DB34C8d6582f9bdCF82BfdbceCCE6c`](https://scan.botchain.ai/address/0xDC93C0E2B3DB34C8d6582f9bdCF82BfdbceCCE6c)

Deploy or verify contracts:
```bash
# Deploy to BOT Chain Mainnet
npm run deploy:mainnet

# Verify contracts on BOT Chain Explorer
npm run verify:mainnet
```

---

## 📄 License
MIT License