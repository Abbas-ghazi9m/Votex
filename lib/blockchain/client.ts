import { createPublicClient, http } from "viem";
import { POLYGON_AMOY_CUSTOM } from "./constants";

export const publicClient = createPublicClient({
  chain: POLYGON_AMOY_CUSTOM,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || "https://rpc-amoy.polygon.technology/"),
});
