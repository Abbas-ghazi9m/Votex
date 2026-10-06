# VOTEX — Security Specification & Threat Model

> **"Vote Once. Verify Everything. Trust No One."**

---

## 1. Threat Model & Security Posture

VOTEX is engineered under an adversarial model where network observers, malicious voters, compromised servers, and unauthorized administrators may attempt to manipulate or disrupt elections.

| Threat Actor | Motivation | Assumed Capabilities |
| :--- | :--- | :--- |
| **Malicious Voter** | Cast multiple ballots or vote outside eligibility | Controls private key; attempts to submit repeated or out-of-order transactions |
| **Rogue Administrator** | Alter candidate totals or manipulate timelines | Possesses server admin credentials or unauthorized wallet key |
| **Compromised Database / Server** | Falsify vote tallies or modify election parameters | Full SQL root access; control over web API responses |
| **Network Eavesdropper** | Intercept or replay authentication sessions | Observes public mempool transactions and HTTP traffic |

---

## 2. Smart Contract Defenses

### 2.1 Checks-Effects-Interactions Pattern
The ballot casting function (`castVote`) in `VotingElection.sol` adheres strictly to the Checks-Effects-Interactions paradigm to eliminate reentrancy vulnerabilities:

```solidity
function castVote(uint256 candidateId) external override {
    // 1. CHECKS
    if (status != ElectionTypes.ElectionStatus.ACTIVE) revert ElectionTypes.ElectionNotActive();
    if (block.timestamp < startTime) revert ElectionTypes.ElectionNotActive();
    if (block.timestamp > endTime) revert ElectionTypes.ElectionEnded();
    if (!eligibleVoters[msg.sender]) revert ElectionTypes.NotEligible();
    if (hasVoted[msg.sender]) revert ElectionTypes.AlreadyVoted();

    ElectionTypes.Candidate storage candidate = _candidates[candidateId];
    if (!candidate.exists) revert ElectionTypes.InvalidCandidate();

    // 2. EFFECTS (State updated before any external interaction)
    hasVoted[msg.sender] = true;
    _voterRecords[msg.sender] = ElectionTypes.VoterInfo({
        isEligible: true,
        hasVoted: true,
        votedCandidateId: candidateId,
        timestamp: block.timestamp
    });
    candidate.voteCount += 1;
    totalVotes += 1;

    // 3. INTERACTIONS / EVENT LOGS
    emit VoteCast(electionId, msg.sender, candidateId, block.timestamp);
}
```

### 2.2 Double-Voting Invariant
Double-voting is prevented deterministically at the EVM level. The boolean state mapping `hasVoted[msg.sender]` is checked as the first precondition and set to `true` atomically within the same transaction. Any secondary invocation from the same address triggers an immediate EVM revert with custom error `AlreadyVoted()`.

### 2.3 Strict Access Control
Administrative functions (`addCandidate`, `registerVoter`, `startElection`, `endElection`, `finalizeElection`) enforce the `onlyAdmin` modifier:
- `msg.sender != admin` reverts with `ElectionTypes.Unauthorized()`.
- Phishing vectors using `tx.origin` are strictly prohibited; only `msg.sender` is evaluated.

### 2.4 Solidity 0.8.24 Overflow & Underflow Protection
Native checked arithmetic prevents integer overflow and underflow vulnerabilities without requiring external SafeMath libraries.

---

## 3. Web3 Authentication & SIWE Security

1. **Cryptographic Nonces:** Nonces are generated via 16 cryptographically secure random bytes (`crypto.randomBytes(16)`), stored with a 10-minute expiry window, and invalidated immediately upon successful signature validation (single-use replay prevention).
2. **EIP-4361 Standardized Messaging:** The signature payload enforces strict domain, URI, and Chain ID (`80002` Polygon Amoy) binding, preventing cross-domain signature re-use attacks.
3. **ECDSA Verification:** Verified server-side via `viem.verifyMessage` using public key recovery.
4. **Session Tokens:** HMAC-SHA256 signed session payloads are stored in `httpOnly`, `sameSite=lax`, and `secure` browser cookies.

---

## 4. Potential Attack Vectors & Mitigations

### 4.1 Front-Running / Transaction Sniping
- **Risk:** An adversary monitors the mempool to copy a voter's ballot choice or time their vote before block inclusion.
- **Mitigation:** In the base MVP, ballots are registered to the caller's specific whitelisted `msg.sender`. Front-running another voter's transaction does not steal or invalidate their vote because each whitelisted wallet has an independent ballot slot.

### 4.2 Database Tampering (SQL Injection / Compromised Credentials)
- **Risk:** An attacker injects SQL commands to artificially inflate a candidate's vote count in the database table.
- **Mitigation:** Database counts are treated as read-only telemetry. When verifying final certified results, the frontend and audit tools read directly from the blockchain contract via RPC calls, exposing any database tampering immediately.

### 4.3 Sybil Attacks / Mass Registration
- **Risk:** An attacker creates hundreds of disposable wallet addresses to flood an election.
- **Mitigation:** The smart contract requires explicit admin whitelisting via `eligibleVoters[address]`. Random or newly generated addresses that lack pre-registration cannot cast ballots.

---

## 5. Security Checklist Audit

- [x] Checks-Effects-Interactions implemented on all state-modifying functions
- [x] No `tx.origin` used anywhere in codebase
- [x] Gas-efficient custom errors utilized instead of string revert messages
- [x] Comprehensive Foundry unit and invariant tests
- [x] Replay-protected SIWE nonces with TTL
- [x] No private keys or secrets committed to git repository
- [x] Canonical JSON deterministic serialization for SHA-256 metadata hashing
