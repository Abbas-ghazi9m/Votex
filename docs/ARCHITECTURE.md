# VOTEX — Architecture Specification

> **"Vote Once. Verify Everything. Trust No One."**

---

## 1. High-Level System Architecture

VOTEX implements a strict separation between **authoritative blockchain state** and **off-chain indexing/metadata caching**. The blockchain EVM smart contract is the sole source of truth for vote counts, eligibility status, and lifecycle transitions.

```mermaid
flowchart TD
    subgraph ClientLayer ["Client & Interface Layer"]
        A[Voter / Administrator Browser] --> B[Next.js 16 App Router UI]
        B --> C[RainbowKit & Wagmi Web3 Connectors]
        B --> D[Cryptographic Verification Engine]
    end

    subgraph AuthLayer ["Authentication Layer"]
        C --> E[SIWE EIP-4361 Nonce Challenge]
        E --> F[ECDSA Signature Verification]
        F --> G[HMAC-SHA256 Session Cookie]
    end

    subgraph BlockchainLayer ["Polygon Amoy Blockchain (Authoritative)"]
        C -->|castVote / adminTx| H[VotingElection.sol Contract]
        H -->|Check-Effects-Interactions| I[EVM State Mappings]
        I -->|hasVoted = true| J[Duplicate Vote Rejection]
        H -->|Emit| K[Bloom Filter Event Logs]
    end

    subgraph IndexerLayer ["Off-Chain Auxiliary Layer (Cache Only)"]
        B --> L[Next.js Server API Routes]
        L --> M[Prisma ORM]
        M --> N[(PostgreSQL / Supabase)]
        K -.->|Read & Cache| L
    end

    subgraph PublicAudit ["Independent Public Verification"]
        D -->|Fetch Event Logs| K
        D -->|Compute SHA-256| O[Canonical Metadata Hash]
        O -->|Compare against bytes32| H
        P[Independent Observer] -->|Inspect Transactions| Q[PolygonScan Explorer]
    end
```

---

## 2. Separation of Architectural Concerns

To adhere to institutional-grade security principles, VOTEX delineates 5 decoupled stages:

| Stage | Responsibility | Enforcement Mechanism |
| :--- | :--- | :--- |
| **1. Voter Identity / Whitelist** | Registering approved voter wallets | Admin invokes `registerVoter(address)` on-chain |
| **2. Voting Authorization** | Verifying wallet ownership & eligibility | SIWE signature challenge + contract `isVoterEligible` check |
| **3. Vote Recording** | Atomically tallying ballot & locking voter | `castVote(candidateId)` with Checks-Effects-Interactions |
| **4. Public Verification** | Independent confirmation by voters & auditors | Direct RPC event inspection & PolygonScan transaction receipts |
| **5. Election Administration** | State machine lifecycle & candidate registry | `onlyAdmin` access-controlled methods with custom errors |

---

## 3. Sequence Diagram: Voting UX Flow

```mermaid
sequenceDiagram
    autonumber
    actor Voter
    participant UI as Next.js Web3 Frontend
    participant Wallet as MetaMask / Rainbow Wallet
    participant API as VOTEX API (SIWE)
    participant Contract as VotingElection.sol (Polygon Amoy)
    participant Explorer as PolygonScan

    Voter->>UI: Connect Wallet
    UI->>API: GET /api/auth/nonce?address=0x...
    API-->>UI: Nonce + EIP-4361 Message
    UI->>Wallet: Prompt personal_sign(message)
    Wallet-->>UI: ECDSA Signature
    UI->>API: POST /api/auth/verify (signature, message)
    API-->>UI: Set Secure Session Cookie

    Voter->>UI: Select Candidate & Click "Vote"
    UI->>UI: Show Confirmation Modal (Rules & Warnings)
    Voter->>UI: Confirm Ballot Choice
    UI->>Wallet: Prompt Transaction: castVote(candidateId)
    Wallet->>Contract: Broadcast Tx to Polygon Amoy RPC
    Contract->>Contract: Verify Active && isEligible && !hasVoted
    Contract->>Contract: Effects: hasVoted=true, voteCount++
    Contract-->>Contract: Emit VoteCast(electionId, voter, candidateId)
    Contract-->>UI: Transaction Hash & Block Receipt
    UI-->>Voter: Confetti + "Vote Successfully Recorded"
    Voter->>Explorer: Open PolygonScan to verify raw receipt
```

---

## 4. Database Trust Boundaries

A critical requirement of VOTEX is that **the database is never trusted for voting calculations**:

1. **No Silent State Changes:** If an attacker gains full root access to PostgreSQL and changes candidate vote counts in the database table, the UI and public audit tools immediately flag the discrepancy by re-reading the authoritative total directly from the smart contract via `publicClient.readContract()`.
2. **Metadata Integrity Guarantee:** Off-chain descriptions and candidate manifestos are pinned via deterministic canonical JSON and committed to the blockchain as an immutable `bytes32 metadataHash`. Any off-chain database modification causes immediate SHA-256 hash mismatch alerts.

---

## 5. State Machine Lifecycle

```mermaid
stateDiagram-v2
    [*] --> CREATED: ElectionManager.createElection()
    CREATED --> ACTIVE: admin.startElection() (Requires >= 2 Candidates)
    ACTIVE --> ENDED: admin.endElection() OR block.timestamp > endTime
    ENDED --> FINALIZED: admin.finalizeElection() (Locks Tallies & Seals Winner)
    FINALIZED --> [*]
```
