# ⚡ NEON ARCADE — WHITEPAPER
### Decentralized Quantum Mini-Games & On-Chain High Score Ecosystem
**Version:** 2.1.0 • **Network:** BOT Chain Testnet (Chain ID: 968) • **Date:** September 2026

---

## 1. Executive Summary

**NEON ARCADE** is a high-performance, cyberpunk-themed Web3 gaming portal built on **BOT Chain Testnet** using **Next.js 14 (`.tsx`)**, **Reown AppKit**, and **Wagmi v2**. 

The platform bridges instant, zero-latency browser gaming with verifiable on-chain transparency. Players engage in a suite of quantum prediction matrices, deduction challenges, and streak multipliers, accumulating Points (`🏆 PTS`), Experience, and Achievements with the option to permanently commit their records to the **BOT Chain blockchain**.

---

## 2. Core Architecture & Technology Stack

```
                                  ┌────────────────────────┐
                                  │   NEON ARCADE CLIENT   │
                                  │  (Next.js 14 / React)  │
                                  └───────────┬────────────┘
                                              │
                     ┌────────────────────────┼────────────────────────┐
                     │                        │                        │
          ┌──────────▼──────────┐  ┌──────────▼──────────┐  ┌──────────▼──────────┐
          │    Reown AppKit     │  │  Procedural Web     │  │  Client-Side State  │
          │   & Wagmi v2/Viem   │  │   Audio Synth Engine│  │   & Streak Engine   │
          └──────────┬──────────┘  └─────────────────────┘  └──────────┬──────────┘
                     │                                                 │
                     ▼                                                 ▼
          ┌───────────────────────────────────────────────────────────────────────┐
          │                       BOT CHAIN TESTNET (ID: 968)                     │
          │                   Smart Contract: NeonArcadeScore.sol                 │
          │               Explorer: https://scan.bohr.life/address/...            │
          └───────────────────────────────────────────────────────────────────────┘
```

### 2.1 Technology Matrix
* **Frontend Framework**: Next.js 14 App Router, React 18, TypeScript (`.tsx`).
* **Design System**: Vanilla Cyberpunk CSS Tokens, Glassmorphism, Orbitron & Rajdhani Typography.
* **Web3 Integration**: `@reown/appkit`, `@reown/appkit-adapter-wagmi`, `wagmi@2.x`, `viem`.
* **Audio Engine**: Native procedural Web Audio API synthesizer (Zero asset dependencies).
* **Smart Contracts**: Solidity 0.8.20 (Hardhat environment).

---

## 3. Network Parameters (BOT Chain Testnet)

| Parameter | Specification |
| :--- | :--- |
| **Network Name** | BOT Chain Testnet |
| **Chain ID** | `968` (`0x3c8`) |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Native Token** | `BOT` |
| **Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |
| **Contract Target** | EVM `paris` compatible |

---

## 4. Game Suite Specifications & Mechanics

### 🔮 1. Neon Oracle (Quantum Frequency Synchronization)
* **Concept**: Probe and synchronize with an encrypted quantum harmonic frequency across 3 difficulty tiers.
* **Tiers & Rewards**:
  * **Initiate**: Range `1 — 50`, 7 Energy Nodes, `+100 PTS`
  * **Seer**: Range `1 — 100`, 5 Energy Nodes, `+250 PTS`
  * **Grand Oracle**: Range `1 — 500`, 8 Energy Nodes, `+500 PTS`
* **Features**: Dynamic 3D quantum orb resonance, directional proximity telemetry (`Proximity Critical`, `Signal Warm`, `Signal Cold`), and cryptographic parity/prime hints.

---

### 🪙 2. Quantum Flip (Superposition Double-or-Nothing)
* **Concept**: Predict binary quantum state collapse (`Cyan 0x0` vs `Magenta 0x1`).
* **Multiplier Scaling**:
  $$\text{Score} = \text{Base Points} \times 2^{\text{Streak}}$$
  $$\text{Multipliers: } 2\times \rightarrow 4\times \rightarrow 8\times \rightarrow 16\times$$
* **Mechanics**: Full 3D coin flip physics with real-time risk mitigation (Cashout & Lock-in Score vs Double-or-Nothing streak continuation).

---

### 🔐 3. Cipher Breaker (Holographic Security Terminal)
* **Concept**: Deduce a randomly generated 4-digit holographic security vault code within 6 breach attempts.
* **Telemetry**:
  * 🟢 **Exact Matches**: Correct digits in the exact index position.
  * 🟡 **Displaced Digits**: Correct digits located in alternate index positions.
* **Reward**: `+350 PTS` upon security bypass.

---

### ⚡ 4. Grid Rush (Probability Threshold Matrix)
* **Concept**: Slide probability thresholds ($1\% - 95\%$) and roll a 100-sided quantum die.
* **Mathematical Model**:
  $$\text{Multiplier} = \frac{98}{\text{Target Number}}$$
* **Payout Range**: Scales smoothly up to $50\times$ points on high-difficulty rolls.

---

## 5. On-Chain Scoring & State Architecture

### 5.1 Hybrid State Flow (Frictionless UX)
To avoid disrupting gameplay with repetitive MetaMask signing modals on every guess or roll, Neon Arcade implements an **On-Demand On-Chain Commit Model**:

1. **Instant Session Play**: Points, wins, and streaks update locally in real-time with zero gas and zero latency.
2. **One-Click Blockchain Vaulting**: Players commit their accumulated high score whenever desired via the `OnChainScoreCard` component.
3. **Smart Contract Verification**: `NeonArcadeScore.sol` updates the player's monotonic high score and emits a `ScoreRecorded` event to BOT Chain Testnet.

### 5.2 Smart Contract Interface (`NeonArcadeScore.sol`)
```solidity
struct PlayerStats {
    uint256 totalPoints;
    uint256 gamesWon;
    uint256 highStreak;
    uint256 lastUpdated;
}

function recordScore(uint256 points, uint256 won, uint256 streak) external;
function getPlayerStats(address player) external view returns (PlayerStats memory);
function getTotalPlayers() external view returns (uint256);
```

---

## 6. Security, Gas & Tokenomics

* **Gas Efficiency**: Score commitment transactions require only **~30,000 gas units** ($< 0.0001\text{ BOT}$).
* **Free-to-Play Testnet Model**: Gas is paid in testnet BOT tokens obtained via faucets, removing financial barriers for participants.
* **Private Key Security**: Deployment environments isolate secrets with strict `.gitignore` protection and `.env.example` templates.

---

## 7. Development Roadmap

* [x] **Phase 1**: Cyberpunk Web3 Arcade Portal with Next.js 14 & Reown AppKit.
* [x] **Phase 2**: 4 Playable Arcade Games with Web Audio Synthesizer SFX.
* [x] **Phase 3**: On-Chain Score Vault Smart Contract on BOT Chain Testnet (`968`).
* [ ] **Phase 4**: Global On-Chain Leaderboard & Player Ranking Subgraph.
* [ ] **Phase 5**: Soulbound Achievement Badges (ERC-721/1155) minted for top score milestones.
* [ ] **Phase 6**: Multiplayer PVP Duel Modes & Mainnet Launch.

---

## 8. License & Disclaimer
Neon Arcade is open-source software released under the **MIT License**.
*BOT Chain Testnet is an experimental testing environment.*
