"use client";

import { http } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  POLYGON_AMOY_CHAIN_ID,
  POLYGON_AMOY_CUSTOM,
  CONTRACT_ADDRESSES,
} from "./constants";

export { POLYGON_AMOY_CHAIN_ID, POLYGON_AMOY_CUSTOM, CONTRACT_ADDRESSES };

export const wagmiConfig = getDefaultConfig({
  appName: "VOTEX — Decentralized Secure Digital Voting",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",
  chains: [POLYGON_AMOY_CUSTOM as any],
  transports: {
    [polygonAmoy.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL || "https://rpc-amoy.polygon.technology/"
    ),
  },
  ssr: true,
});
