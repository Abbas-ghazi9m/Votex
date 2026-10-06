import { computeMetadataHash } from "../crypto/metadataHash";

export interface CandidateRecord {
  id: string;
  blockchainCandidateId: number;
  electionId: string;
  name: string;
  description: string;
  imageUrl: string;
  manifestoUrl?: string;
  voteCount: number;
}

export interface VoterEligibilityRecord {
  id: string;
  electionId: string;
  walletAddress: string;
  registeredAt: string;
  hasVoted?: boolean;
}

export interface BlockchainTransactionRecord {
  id: string;
  electionId: string;
  txHash: string;
  blockNumber: number;
  type: "ELECTION_CREATED" | "CANDIDATE_ADDED" | "VOTER_REGISTERED" | "ELECTION_STARTED" | "VOTE_CAST" | "ELECTION_ENDED" | "ELECTION_FINALIZED";
  fromAddress: string;
  timestamp: string;
  status: "CONFIRMED" | "PENDING" | "FAILED";
  details?: Record<string, any>;
}

export interface ElectionRecord {
  id: string;
  blockchainElectionId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  metadataHash: string;
  canonicalMetadata?: any;
  contractAddress: string;
  adminAddress: string;
  status: "CREATED" | "ACTIVE" | "ENDED" | "FINALIZED";
  totalVotes: number;
  eligibleVoterCount: number;
  createdAt: string;
  candidates: CandidateRecord[];
  voterEligibilities: VoterEligibilityRecord[];
  transactions: BlockchainTransactionRecord[];
}

// Initial realistic demo election data
const initialMetadata = {
  title: "University Student Council Election 2026",
  description: "Official campus election for Student Government Association leadership.",
  startTime: Math.floor(Date.now() / 1000) - 3600, // started 1 hour ago
  endTime: Math.floor(Date.now() / 1000) + 7 * 86400, // 7 days from now
  adminAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  rules: {
    singleChoice: true,
    requireEligibilityWhitelist: true,
    allowAbstain: false,
    minimumCandidates: 2,
  },
  organization: "State Polytechnic University SGA",
  contactEmail: "elections@polytechnic.edu",
  version: "1.0.0",
};

const initialHashObj = computeMetadataHash(initialMetadata);

const defaultElections: ElectionRecord[] = [
  {
    id: "election-1",
    blockchainElectionId: 1,
    title: "University Student Council Election 2026",
    description: "Official campus-wide election for Student Government Association Executive Leadership.",
    startTime: new Date(Date.now() - 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
    metadataHash: initialHashObj.hashHex,
    canonicalMetadata: initialMetadata,
    contractAddress: "0x34A60E36f1c48F4f8d4862e3E2F4d4c5145b23d9",
    adminAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    status: "ACTIVE",
    totalVotes: 34,
    eligibleVoterCount: 150,
    createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
    candidates: [
      {
        id: "cand-1",
        blockchainCandidateId: 1,
        electionId: "election-1",
        name: "Alice Chen",
        description: "Focusing on campus sustainability, 24/7 mental health access, and open university budget audits.",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
        manifestoUrl: "https://votex.network/manifestos/alice-chen-2026.pdf",
        voteCount: 18,
      },
      {
        id: "cand-2",
        blockchainCandidateId: 2,
        electionId: "election-1",
        name: "Bob Miller",
        description: "Advancing STEM research funding, student startup grants, and state-of-the-art campus lab access.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
        manifestoUrl: "https://votex.network/manifestos/bob-miller-2026.pdf",
        voteCount: 11,
      },
      {
        id: "cand-3",
        blockchainCandidateId: 3,
        electionId: "election-1",
        name: "Clara Rodriguez",
        description: "Championing commuter transit subsidies, affordable on-campus dining, and multicultural community spaces.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
        manifestoUrl: "https://votex.network/manifestos/clara-rodriguez-2026.pdf",
        voteCount: 5,
      },
    ],
    voterEligibilities: [
      {
        id: "elig-1",
        electionId: "election-1",
        walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        registeredAt: new Date(Date.now() - 80000 * 1000).toISOString(),
        hasVoted: true,
      },
      {
        id: "elig-2",
        electionId: "election-1",
        walletAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        registeredAt: new Date(Date.now() - 75000 * 1000).toISOString(),
        hasVoted: false,
      },
      {
        id: "elig-3",
        electionId: "election-1",
        walletAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        registeredAt: new Date(Date.now() - 70000 * 1000).toISOString(),
        hasVoted: false,
      },
    ],
    transactions: [
      {
        id: "tx-init-1",
        electionId: "election-1",
        txHash: "0x89d2d46e16f387b925b64cfa2281896791bf97dc21f37e402a5435b62bfa1201",
        blockNumber: 15423891,
        type: "ELECTION_CREATED",
        fromAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        timestamp: new Date(Date.now() - 86400 * 1000).toISOString(),
        status: "CONFIRMED",
        details: { title: "University Student Council Election 2026", metadataHash: initialHashObj.hashHex },
      },
      {
        id: "tx-cand-1",
        electionId: "election-1",
        txHash: "0x3f98c801e0d37e28329df0289bca759f635489f64bf711aebe6858e6580927c3",
        blockNumber: 15423910,
        type: "CANDIDATE_ADDED",
        fromAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        timestamp: new Date(Date.now() - 86200 * 1000).toISOString(),
        status: "CONFIRMED",
        details: { candidateId: 1, name: "Alice Chen" },
      },
      {
        id: "tx-start-1",
        electionId: "election-1",
        txHash: "0x12a9bcfe901238495a8402f0129bcfe829104fa285012a9cbf812039fa8201de",
        blockNumber: 15424500,
        type: "ELECTION_STARTED",
        fromAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
        status: "CONFIRMED",
        details: { status: "ACTIVE" },
      },
    ],
  },
  {
    id: "election-2",
    blockchainElectionId: 2,
    title: "Computer Science Society Executive Board 2026",
    description: "Annual departmental election for Society President and Technical Lead.",
    startTime: new Date(Date.now() - 14 * 86400 * 1000).toISOString(),
    endTime: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    metadataHash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    canonicalMetadata: { title: "CS Society 2026", department: "Computer Science" },
    contractAddress: "0x98b58473e6a9876543210fedcba9876543210123",
    adminAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    status: "FINALIZED",
    totalVotes: 128,
    eligibleVoterCount: 140,
    createdAt: new Date(Date.now() - 15 * 86400 * 1000).toISOString(),
    candidates: [
      {
        id: "cand-201",
        blockchainCandidateId: 1,
        electionId: "election-2",
        name: "David Kim",
        description: "Organized 3 major hackathons; introducing AI & Web3 technical workshops.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
        voteCount: 78,
      },
      {
        id: "cand-202",
        blockchainCandidateId: 2,
        electionId: "election-2",
        name: "Sarah Patel",
        description: "Open-source mentorship programs and enterprise internship pipeline partnerships.",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
        voteCount: 50,
      },
    ],
    voterEligibilities: [],
    transactions: [
      {
        id: "tx-fin-2",
        electionId: "election-2",
        txHash: "0xca54b6791ef38029cba8271048bcf6201948ba5c182903746a5bce9204981fca",
        blockNumber: 15410291,
        type: "ELECTION_FINALIZED",
        fromAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        timestamp: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
        status: "CONFIRMED",
        details: { winner: "David Kim", winnerId: 1, totalVotes: 128 },
      },
    ],
  },
];

// Persistent runtime store
class Store {
  private elections: ElectionRecord[] = [...defaultElections];

  getElections(): ElectionRecord[] {
    return this.elections;
  }

  getElection(id: string): ElectionRecord | undefined {
    return this.elections.find(
      (e) => e.id === id || e.blockchainElectionId.toString() === id || e.contractAddress.toLowerCase() === id.toLowerCase()
    );
  }

  createElection(data: Partial<ElectionRecord>): ElectionRecord {
    const nextBlockchainId = this.elections.length + 1;
    const newElection: ElectionRecord = {
      id: `election-${Date.now()}`,
      blockchainElectionId: nextBlockchainId,
      title: data.title || "Untitled Election",
      description: data.description || "",
      startTime: data.startTime || new Date().toISOString(),
      endTime: data.endTime || new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
      metadataHash: data.metadataHash || "0x0000000000000000000000000000000000000000000000000000000000000000",
      canonicalMetadata: data.canonicalMetadata || {},
      contractAddress: data.contractAddress || `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      adminAddress: data.adminAddress || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      status: "CREATED",
      totalVotes: 0,
      eligibleVoterCount: 0,
      createdAt: new Date().toISOString(),
      candidates: data.candidates || [],
      voterEligibilities: [],
      transactions: [
        {
          id: `tx-${Date.now()}`,
          electionId: `election-${nextBlockchainId}`,
          txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          blockNumber: 15424000 + Math.floor(Math.random() * 5000),
          type: "ELECTION_CREATED",
          fromAddress: data.adminAddress || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          timestamp: new Date().toISOString(),
          status: "CONFIRMED",
          details: { title: data.title },
        },
      ],
    };

    this.elections.unshift(newElection);
    return newElection;
  }

  addCandidate(electionId: string, candidate: { name: string; description: string; imageUrl: string; manifestoUrl?: string }): CandidateRecord | null {
    const election = this.getElection(electionId);
    if (!election) return null;

    const newCandidate: CandidateRecord = {
      id: `cand-${Date.now()}`,
      blockchainCandidateId: election.candidates.length + 1,
      electionId: election.id,
      name: candidate.name,
      description: candidate.description,
      imageUrl: candidate.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      manifestoUrl: candidate.manifestoUrl,
      voteCount: 0,
    };

    election.candidates.push(newCandidate);
    election.transactions.push({
      id: `tx-${Date.now()}`,
      electionId: election.id,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      blockNumber: 15424500 + Math.floor(Math.random() * 100),
      type: "CANDIDATE_ADDED",
      fromAddress: election.adminAddress,
      timestamp: new Date().toISOString(),
      status: "CONFIRMED",
      details: { candidateId: newCandidate.blockchainCandidateId, name: newCandidate.name },
    });

    return newCandidate;
  }

  registerVoter(electionId: string, walletAddress: string): boolean {
    const election = this.getElection(electionId);
    if (!election) return false;

    const normalized = walletAddress.toLowerCase();
    const existing = election.voterEligibilities.find((v) => v.walletAddress.toLowerCase() === normalized);
    if (existing) return true;

    election.voterEligibilities.push({
      id: `elig-${Date.now()}`,
      electionId: election.id,
      walletAddress,
      registeredAt: new Date().toISOString(),
      hasVoted: false,
    });
    election.eligibleVoterCount++;

    election.transactions.push({
      id: `tx-${Date.now()}`,
      electionId: election.id,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      blockNumber: 15424550 + Math.floor(Math.random() * 100),
      type: "VOTER_REGISTERED",
      fromAddress: election.adminAddress,
      timestamp: new Date().toISOString(),
      status: "CONFIRMED",
      details: { voter: walletAddress },
    });

    return true;
  }

  removeVoter(electionId: string, walletAddress: string): boolean {
    const election = this.getElection(electionId);
    if (!election) return false;

    const initialLength = election.voterEligibilities.length;
    election.voterEligibilities = election.voterEligibilities.filter(
      (v) => v.walletAddress.toLowerCase() !== walletAddress.toLowerCase()
    );
    if (election.voterEligibilities.length < initialLength) {
      election.eligibleVoterCount = Math.max(0, election.eligibleVoterCount - 1);
      return true;
    }
    return false;
  }

  updateElectionStatus(electionId: string, status: "CREATED" | "ACTIVE" | "ENDED" | "FINALIZED"): boolean {
    const election = this.getElection(electionId);
    if (!election) return false;

    election.status = status;
    const txTypeMap = {
      ACTIVE: "ELECTION_STARTED" as const,
      ENDED: "ELECTION_ENDED" as const,
      FINALIZED: "ELECTION_FINALIZED" as const,
      CREATED: "ELECTION_CREATED" as const,
    };

    election.transactions.push({
      id: `tx-${Date.now()}`,
      electionId: election.id,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      blockNumber: 15424600 + Math.floor(Math.random() * 100),
      type: txTypeMap[status],
      fromAddress: election.adminAddress,
      timestamp: new Date().toISOString(),
      status: "CONFIRMED",
      details: { newStatus: status },
    });

    return true;
  }

  recordVote(electionId: string, candidateId: number, voterAddress: string, txHash?: string): { success: boolean; error?: string; txHash: string; blockNumber: number } {
    const election = this.getElection(electionId);
    if (!election) return { success: false, error: "Election not found", txHash: "", blockNumber: 0 };

    if (election.status !== "ACTIVE") {
      return { success: false, error: "Election is not active for voting.", txHash: "", blockNumber: 0 };
    }

    const voter = election.voterEligibilities.find((v) => v.walletAddress.toLowerCase() === voterAddress.toLowerCase());
    if (voter && voter.hasVoted) {
      return { success: false, error: "This wallet has already cast a vote in this election.", txHash: "", blockNumber: 0 };
    }

    const candidate = election.candidates.find((c) => c.blockchainCandidateId === candidateId);
    if (!candidate) {
      return { success: false, error: "Candidate not found.", txHash: "", blockNumber: 0 };
    }

    if (voter) {
      voter.hasVoted = true;
    } else {
      // In open demo mode, register as voted
      election.voterEligibilities.push({
        id: `elig-${Date.now()}`,
        electionId: election.id,
        walletAddress: voterAddress,
        registeredAt: new Date().toISOString(),
        hasVoted: true,
      });
      election.eligibleVoterCount++;
    }

    candidate.voteCount++;
    election.totalVotes++;

    const finalTxHash = txHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    const blockNumber = 15424700 + Math.floor(Math.random() * 50);

    election.transactions.push({
      id: `tx-${Date.now()}`,
      electionId: election.id,
      txHash: finalTxHash,
      blockNumber,
      type: "VOTE_CAST",
      fromAddress: voterAddress,
      timestamp: new Date().toISOString(),
      status: "CONFIRMED",
      details: { candidateId, candidateName: candidate.name },
    });

    return {
      success: true,
      txHash: finalTxHash,
      blockNumber,
    };
  }
}

// Global singleton store
const globalForStore = globalThis as unknown as { votexStore: Store };
export const db = globalForStore.votexStore || new Store();
if (process.env.NODE_ENV !== "production") globalForStore.votexStore = db;
