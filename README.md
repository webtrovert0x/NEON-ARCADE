# ⚡ NEON ARCADE — BOT Chain Testnet Multi-Game Web3 Suite

![Next.js](https://img.shields.io/badge/Next.js-14+-00f0ff?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-TSX-3178C6?style=for-the-badge&logo=typescript)
![Network](https://img.shields.io/badge/Network-BOT%20Chain%20Testnet-8a2be2?style=for-the-badge)
![Whitepaper](https://img.shields.io/badge/Whitepaper-v2.1.0-ff007f?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-00ff9d?style=for-the-badge)

**Neon Arcade** is a decentralized cyberpunk gaming hub and prediction platform built on **Next.js (`.tsx`)**, powered by **Reown AppKit** and **Wagmi v2**, tailored exclusively for **BOT Chain Testnet (`Chain ID: 968`)**.

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

## 🌐 BOT Chain Testnet Parameters

| Parameter | Value |
| :--- | :--- |
| **Network Name** | BOT Chain Testnet |
| **Chain ID** | `968` (`0x3c8`) |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Currency Symbol** | `BOT` |
| **Testnet Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |

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

Deployed live on **BOT Chain Testnet (`968`)**:
- 🏆 **`NeonArcadeScore`**: [`0x2726459981F58d2ea331A2309655DB267057aaC8`](https://scan.bohr.life/address/0x2726459981F58d2ea331A2309655DB267057aaC8)
- 🔮 **`NeonOracle`**: [`0xa5af6637A9bAB165CDF467b5385250770757cb01`](https://scan.bohr.life/address/0xa5af6637A9bAB165CDF467b5385250770757cb01)

Deploy or verify contracts:
```bash
# Deploy to BOT Chain Testnet
npm run deploy:testnet

# Verify contract
npm run verify:testnet
```

---

## 📄 License
MIT License