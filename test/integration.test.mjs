import test from "node:test";
import assert from "node:assert/strict";

test("VOTEX Protocol Business Logic: One-person-one-vote and Double Vote Rejection", () => {
  const voters = new Map();
  const candidates = [
    { id: 1, name: "Alice", votes: 0 },
    { id: 2, name: "Bob", votes: 0 }
  ];

  function registerVoter(address) {
    voters.set(address.toLowerCase(), { isEligible: true, hasVoted: false });
  }

  function castVote(voterAddress, candidateId) {
    const voter = voters.get(voterAddress.toLowerCase());
    if (!voter || !voter.isEligible) {
      throw new Error("NotEligible");
    }
    if (voter.hasVoted) {
      throw new Error("AlreadyVoted");
    }
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) {
      throw new Error("InvalidCandidate");
    }

    // Effect
    voter.hasVoted = true;
    candidate.votes += 1;
    return true;
  }

  const voterWallet = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
  const ineligibleWallet = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc";

  // 1. Ineligible voter rejected
  assert.throws(() => castVote(ineligibleWallet, 1), /NotEligible/);

  // 2. Whitelist voter
  registerVoter(voterWallet);
  assert.equal(voters.get(voterWallet).isEligible, true);
  assert.equal(voters.get(voterWallet).hasVoted, false);

  // 3. Valid vote accepted
  assert.equal(castVote(voterWallet, 1), true);
  assert.equal(candidates[0].votes, 1);
  assert.equal(voters.get(voterWallet).hasVoted, true);

  // 4. Invariant: Duplicate vote must strictly revert
  assert.throws(() => castVote(voterWallet, 2), /AlreadyVoted/);
  assert.equal(candidates[0].votes, 1);
  assert.equal(candidates[1].votes, 0);
});
