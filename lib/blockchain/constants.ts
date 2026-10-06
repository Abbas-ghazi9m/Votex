import { polygonAmoy } from "viem/chains";

// Target Network: Polygon Amoy Testnet (Chain ID 80002)
export const POLYGON_AMOY_CHAIN_ID = 80002;

export const POLYGON_AMOY_CUSTOM = {
  ...polygonAmoy,
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_URL || "https://rpc-amoy.polygon.technology/",
        "https://polygon-amoy-bor-rpc.publicnode.com",
      ],
    },
    public: {
      http: [
        process.env.NEXT_PUBLIC_RPC_URL || "https://rpc-amoy.polygon.technology/",
        "https://polygon-amoy-bor-rpc.publicnode.com",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "PolygonScan Amoy",
      url: "https://amoy.polygonscan.com",
    },
  },
};

export const CONTRACT_ADDRESSES = {
  electionManager: (process.env.NEXT_PUBLIC_MANAGER_ADDRESS ||
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0") as `0x${string}`,
  demoElection: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x34A60E36f1c48F4f8d4862e3E2F4d4c5145b23d9") as `0x${string}`,
};
