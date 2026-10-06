export const ElectionManagerABI = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "protocolOwner",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "electionCount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "electionContracts",
    "inputs": [{ "name": "", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "createElection",
    "inputs": [
      { "name": "title", "type": "string" },
      { "name": "description", "type": "string" },
      { "name": "metadataHash", "type": "bytes32" },
      { "name": "startTime", "type": "uint256" },
      { "name": "endTime", "type": "uint256" }
    ],
    "outputs": [
      { "name": "electionId", "type": "uint256" },
      { "name": "electionAddress", "type": "address" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAllElectionIds",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAdminElections",
    "inputs": [{ "name": "admin", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ElectionCreated",
    "inputs": [
      { "name": "electionId", "type": "uint256", "indexed": true },
      { "name": "electionAddress", "type": "address", "indexed": true },
      { "name": "title", "type": "string", "indexed": false },
      { "name": "metadataHash", "type": "bytes32", "indexed": false },
      { "name": "admin", "type": "address", "indexed": true },
      { "name": "startTime", "type": "uint256", "indexed": false },
      { "name": "endTime", "type": "uint256", "indexed": false }
    ],
    "anonymous": false
  }
] as const;
