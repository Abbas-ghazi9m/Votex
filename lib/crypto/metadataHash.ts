import { createHash } from "crypto";

export interface ElectionMetadata {
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  adminAddress: string;
  rules: {
    singleChoice: boolean;
    requireEligibilityWhitelist: boolean;
    allowAbstain: boolean;
    minimumCandidates: number;
  };
  organization?: string;
  contactEmail?: string;
  version: string;
}

/**
 * Deterministically sorts object keys for canonical JSON serialization.
 */
export function canonicalizeJSON(obj: any): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return "[" + obj.map((item) => canonicalizeJSON(item)).join(",") + "]";
  }

  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map((key) => {
    return JSON.stringify(key) + ":" + canonicalizeJSON(obj[key]);
  });

  return "{" + pairs.join(",") + "}";
}

/**
 * Computes a standard SHA-256 hash of the canonical JSON string.
 * Returns bytes32 hex formatted (0x...) matching EVM bytes32.
 */
export function computeMetadataHash(metadata: ElectionMetadata | Record<string, any>): {
  canonicalJson: string;
  hashHex: `0x${string}`;
  algorithm: string;
} {
  const canonicalJson = canonicalizeJSON(metadata);
  const hashHex = ("0x" +
    createHash("sha256").update(canonicalJson, "utf8").digest("hex")) as `0x${string}`;

  return {
    canonicalJson,
    hashHex,
    algorithm: "SHA-256",
  };
}

/**
 * Validates off-chain metadata against an on-chain bytes32 hash.
 */
export function verifyMetadataIntegrity(
  rawOrCanonicalJson: string | object,
  expectedHash: string
): { isValid: boolean; calculatedHash: string; canonicalJson: string } {
  const canonicalJson =
    typeof rawOrCanonicalJson === "string"
      ? canonicalizeJSON(JSON.parse(rawOrCanonicalJson))
      : canonicalizeJSON(rawOrCanonicalJson);

  const calculatedHash = "0x" + createHash("sha256").update(canonicalJson, "utf8").digest("hex");
  const normalizedExpected = expectedHash.toLowerCase().startsWith("0x")
    ? expectedHash.toLowerCase()
    : "0x" + expectedHash.toLowerCase();

  return {
    isValid: calculatedHash.toLowerCase() === normalizedExpected,
    calculatedHash,
    canonicalJson,
  };
}
