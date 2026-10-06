export const VotingElectionABI = [
  {
    "type": "constructor",
    "inputs": [
      { "name": "_electionId", "type": "uint256" },
      { "name": "_title", "type": "string" },
      { "name": "_description", "type": "string" },
      { "name": "_metadataHash", "type": "bytes32" },
      { "name": "_startTime", "type": "uint256" },
      { "name": "_endTime", "type": "uint256" },
      { "name": "_admin", "type": "address" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "electionId",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "title",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "description",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "metadataHash",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes32" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "startTime",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "endTime",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "admin",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "status",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint8" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalVotes",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "eligibleVoterCount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addCandidate",
    "inputs": [
      { "name": "name", "type": "string" },
      { "name": "candidateDescription", "type": "string" },
      { "name": "metadataURI", "type": "string" }
    ],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerVoter",
    "inputs": [{ "name": "voter", "type": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerVotersBatch",
    "inputs": [{ "name": "voters", "type": "address[]" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeVoter",
    "inputs": [{ "name": "voter", "type": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "startElection",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "endElection",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "finalizeElection",
    "inputs": [],
    "outputs": [{ "name": "winnerId", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "castVote",
    "inputs": [{ "name": "candidateId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getElectionDetails",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          { "name": "electionId", "type": "uint256" },
          { "name": "title", "type": "string" },
          { "name": "description", "type": "string" },
          { "name": "metadataHash", "type": "bytes32" },
          { "name": "startTime", "type": "uint256" },
          { "name": "endTime", "type": "uint256" },
          { "name": "status", "type": "uint8" },
          { "name": "totalVotes", "type": "uint256" },
          { "name": "eligibleVoterCount", "type": "uint256" },
          { "name": "admin", "type": "address" },
          { "name": "exists", "type": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllCandidates",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          { "name": "id", "type": "uint256" },
          { "name": "name", "type": "string" },
          { "name": "description", "type": "string" },
          { "name": "metadataURI", "type": "string" },
          { "name": "voteCount", "type": "uint256" },
          { "name": "exists", "type": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isVoterEligible",
    "inputs": [{ "name": "voter", "type": "address" }],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasVoterVoted",
    "inputs": [{ "name": "voter", "type": "address" }],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getWinner",
    "inputs": [],
    "outputs": [
      { "name": "winnerId", "type": "uint256" },
      { "name": "winnerName", "type": "string" },
      { "name": "voteCount", "type": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ElectionInitialized",
    "inputs": [
      { "name": "electionId", "type": "uint256", "indexed": true },
      { "name": "title", "type": "string", "indexed": false },
      { "name": "metadataHash", "type": "bytes32", "indexed": false },
      { "name": "startTime", "type": "uint256", "indexed": false },
      { "name": "endTime", "type": "uint256", "indexed": false },
      { "name": "admin", "type": "address", "indexed": true }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CandidateAdded",
    "inputs": [
      { "name": "electionId", "type": "uint256", "indexed": true },
      { "name": "candidateId", "type": "uint256", "indexed": true },
      { "name": "name", "type": "string", "indexed": false },
      { "name": "metadataURI", "type": "string", "indexed": false }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "VoterRegistered",
    "inputs": [
      { "name": "electionId", "type": "uint256", "indexed": true },
      { "name": "voter", "type": "address", "indexed": true }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "VoterRemoved",
    "inputs": [
      { "name": "electionId", "type": "uint256", "indexed": true },
      { "name": "voter", "type": "address", "indexed": true }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ElectionStarted",
    "inputs": [
      { "name": "electionId", "type": "uint256", "indexed": true },
      { "name": "timestamp", "type": "uint256", "indexed": false }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ElectionEnded",
    "inputs": [
      { "name": "electionId", "type": "uint256", "indexed": true },
      { "name": "timestamp", "type": "uint256", "indexed": false }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ElectionFinalized",
    "inputs": [
      { "name": "electionId", "type": "uint256", "indexed": true },
      { "name": "winningCandidateId", "type": "uint256", "indexed": false },
      { "name": "totalVotes", "type": "uint256", "indexed": false },
      { "name": "timestamp", "type": "uint256", "indexed": false }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "VoteCast",
    "inputs": [
      { "name": "electionId", "type": "uint256", "indexed": true },
      { "name": "voter", "type": "address", "indexed": true },
      { "name": "candidateId", "type": "uint256", "indexed": true },
      { "name": "timestamp", "type": "uint256", "indexed": false }
    ],
    "anonymous": false
  }
] as const;
