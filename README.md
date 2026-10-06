# VOTEX — Decentralized Secure Digital Voting Platform

<div align="center">

### *"Vote Once. Verify Everything. Trust No One."*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.24-363636?logo=solidity)](https://soliditylang.org/)
[![Network](https://img.shields.io/badge/Network-Polygon_Amoy_(80002)-8247E5?logo=polygon)](https://amoy.polygonscan.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 1. Project Overview & Vision

**VOTEX** is an educational, production-quality decentralized digital voting platform designed for collegiate elections, hackathons, and community governance. It demonstrates how EVM smart contracts, deterministic cryptographic hashing, and decentralized consensus solve the vulnerabilities inherent in traditional database-backed voting systems.

### Primary Value Proposition
- **Vote Integrity:** Ballots are sealed on the Polygon Amoy blockchain.
- **One-Person-One-Vote:** Mathematically enforced at the EVM bytecode level; duplicate votes revert immediately.
- **Tamper-Evident Records:** No database administrator or server owner can alter candidate totals or delete ballots.
- **Independent Public Auditing:** Anyone can independently verify canonical SHA-256 metadata integrity and replay blockchain event logs.
- **Wallet-Based Authentication:** Standardized Sign-In With Ethereum (SIWE / EIP-4361) with single-use cryptographic nonces.

> **Academic & Demonstration Disclaimer:**
> VOTEX is designed for educational and collegiate governance demonstrations. It is **NOT** intended for national or government-level elections and does not claim absolute secret-ballot anonymity. See [`docs/PRIVACY.md`](docs/PRIVACY.md) for full cryptographic boundaries.

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | Next.js 16+ (App Router), React 19, TypeScript (Strict Mode) |
| **Styling & UI** | Tailwind CSS v4, Lucide React icons, Framer Motion |
| **Analytics & Visuals** | Recharts (dynamic bar/donut charts), Canvas-Confetti, QRCode |
| **Web3 & Blockchain** | viem, wagmi, RainbowKit, Polygon Amoy Testnet (Chain ID `80002`) |
| **Smart Contracts** | Solidity `^0.8.24`, OpenZeppelin patterns, Foundry / Forge |
| **Database & Cache** | Prisma ORM, PostgreSQL / Supabase, resilient in-memory fallback |
| **Authentication** | Sign-In With Ethereum (SIWE / EIP-4361), HMAC session cookies |
| **Validation & Cryptography** | Zod schemas, Node `crypto` (deterministic SHA-256 canonical serializer) |

---

## 3. High-Level Architecture

```
                    ┌────────────────────────┐
                    │  Next.js 16 Frontend   │
                    │ React + TS + Tailwind  │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │       Web3 Layer       │
                    │   wagmi + viem + SIWE  │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   Solidity Contracts   │
                    │  ElectionManager.sol   │
                    │   VotingElection.sol   │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │  Polygon Amoy Network  │
                    │  (Immutable Consensus) │
                    └────────────────────────┘
```

---

## 4. Smart Contract Architecture

The protocol uses clean, modular Solidity `^0.8.24` contracts:

- [`contracts/VotingElection.sol`](contracts/VotingElection.sol): Core election contract managing candidate registries, voter eligibility whitelists, one-person-one-vote rules, state transitions, and emission of bloom-filter indexed `VoteCast` events.
- [`contracts/ElectionManager.sol`](contracts/ElectionManager.sol): Protocol registry and factory contract for deploying and indexing multiple elections.
- [`contracts/libraries/ElectionTypes.sol`](contracts/libraries/ElectionTypes.sol): Shared data structures, state enums (`CREATED`, `ACTIVE`, `ENDED`, `FINALIZED`), and gas-efficient custom errors (`AlreadyVoted()`, `NotEligible()`, `ElectionNotActive()`, etc.).
- [`contracts/interfaces/IVotingElection.sol`](contracts/interfaces/IVotingElection.sol): Standard interface for all VOTEX election contracts.

---

## 5. Quick Start: Local Development

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+`
- MetaMask or any Web3 wallet extension connected to **Polygon Amoy Testnet**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/votex.git
cd votex
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(The platform operates out-of-the-box in local demo mode with seeded university student council elections even if `DATABASE_URL` is unset!)*

### 3. Run Automated Tests
```bash
npm test
```

### 4. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Smart Contract Deployment (Polygon Amoy)

Using Foundry (`forge`):

### 1. Compile Contracts
```bash
forge build
```

### 2. Run Foundry Test Suite
```bash
forge test -vvv
```

### 3. Broadcast Deployment to Polygon Amoy
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://rpc-amoy.polygon.technology/ \
  --private-key $YOUR_PRIVATE_KEY \
  --broadcast \
  --verify
```

---

## 7. Interactive Pages & Workflows

1. **`/` (Landing Page):** Complete platform showcase featuring the interactive **Traditional DB vs VOTEX** comparison, architectural visualizer, feature breakdown, and FAQs.
2. **`/dashboard`:** Voter portal displaying active governance elections, participation turnouts, countdown timers, and voter status.
3. **`/elections/[id]`:** Ballot voting interface with candidate manifesto modals, live countdown, and the animated **5-stage voting flow modal** (Preparing -> Wallet Signature -> Broadcast -> Block Confirmation -> Confetti Celebration).
4. **`/elections/[id]/results`:** Dynamic results visualization using Recharts bar and donut charts, turnout percentages, and winner certificates.
5. **`/admin`:** Administrative console with real-time KPI telemetry, election creation wizard with automatic SHA-256 hash generation, candidate additions, voter whitelist management, and lifecycle controls.
6. **`/verify`:** Independent blockchain transaction explorer for looking up raw hashes, mined blocks, gas used, and decoded on-chain events.
7. **`/audit/[id]`:** Public cryptographic audit suite with canonical JSON editor, live SHA-256 integrity verifier, on-chain event ledger, and mobile QR code generation.

---

## 8. Documentation Index

- 📘 [System Architecture & Diagrams (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md)
- 🔒 [Security Model & Threat Defenses (`docs/SECURITY.md`)](docs/SECURITY.md)
- 👁️ [Privacy Assessment & Zero-Knowledge Roadmap (`docs/PRIVACY.md`)](docs/PRIVACY.md)

---

## 9. License

Released under the **MIT License**. Created for academic, hackathon, and educational governance research.
