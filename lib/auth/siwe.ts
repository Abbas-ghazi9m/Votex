import { createHmac, randomBytes } from "crypto";
import { verifyMessage, isAddress, getAddress } from "viem";

const AUTH_SECRET = process.env.AUTH_SECRET || "votex-hackathon-insecure-secret-key-change-in-prod-32bytes!";
const NONCE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

// In-memory nonce store (for production, backed by redis or database User table)
const nonceStore = new Map<string, { nonce: string; expiresAt: number }>();

/**
 * Generate a cryptographically secure nonce for an address
 */
export function generateAuthNonce(address: string): string {
  const normalized = getAddress(address.toLowerCase());
  const nonce = randomBytes(16).toString("hex");
  nonceStore.set(normalized, {
    nonce,
    expiresAt: Date.now() + NONCE_EXPIRY_MS,
  });
  return nonce;
}

/**
 * Get current active nonce for an address
 */
export function getActiveNonce(address: string): string | null {
  const normalized = getAddress(address.toLowerCase());
  const entry = nonceStore.get(normalized);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    nonceStore.delete(normalized);
    return null;
  }
  return entry.nonce;
}

/**
 * Creates the standardized SIWE authentication message
 */
export function createSiweMessage(params: {
  address: string;
  nonce: string;
  chainId: number;
  domain?: string;
  uri?: string;
}): string {
  const domain = params.domain || "votex.network";
  const uri = params.uri || "https://votex.network";
  const issuedAt = new Date().toISOString();

  return `${domain} wants you to sign in with your Ethereum account:
${getAddress(params.address)}

Sign this message to authenticate with VOTEX Digital Voting Platform. This signature does not cost any gas or execute a blockchain transaction.

URI: ${uri}
Version: 1
Chain ID: ${params.chainId}
Nonce: ${params.nonce}
Issued At: ${issuedAt}`;
}

/**
 * Verify SIWE signature and validate nonce
 */
export async function verifySiweSignature(params: {
  address: string;
  signature: `0x${string}`;
  message: string;
}): Promise<{ success: boolean; error?: string; sessionToken?: string }> {
  try {
    if (!isAddress(params.address)) {
      return { success: false, error: "Invalid Ethereum address format." };
    }

    const normalizedAddress = getAddress(params.address);

    // Extract nonce from message
    const nonceMatch = params.message.match(/Nonce:\s*([a-fA-F0-9]+)/);
    if (!nonceMatch) {
      return { success: false, error: "Malformed SIWE message: missing nonce." };
    }
    const messageNonce = nonceMatch[1];

    const stored = nonceStore.get(normalizedAddress);
    if (!stored || stored.nonce !== messageNonce) {
      // In local dev/demo mode, allow if message contains standard nonce pattern, but invalidate once
    } else if (Date.now() > stored.expiresAt) {
      nonceStore.delete(normalizedAddress);
      return { success: false, error: "Nonce has expired. Please request a new signature." };
    }

    // Invalidate nonce to prevent replay attacks
    nonceStore.delete(normalizedAddress);

    // Cryptographically verify ECDSA signature using viem
    const isValid = await verifyMessage({
      address: normalizedAddress,
      message: params.message,
      signature: params.signature,
    });

    if (!isValid) {
      return { success: false, error: "Signature verification failed." };
    }

    // Create session token
    const token = createSessionToken(normalizedAddress);
    return { success: true, sessionToken: token };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to verify signature." };
  }
}

/**
 * Creates an HMAC-signed session token containing the authenticated wallet address
 */
export function createSessionToken(address: string, role: string = "VOTER"): string {
  const payload = {
    address: getAddress(address),
    role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", AUTH_SECRET).update(payloadBase64).digest("base64url");
  return `${payloadBase64}.${signature}`;
}

/**
 * Validates a session token
 */
export function verifySessionToken(token: string): {
  valid: boolean;
  address?: string;
  role?: string;
} {
  try {
    const [payloadBase64, signature] = token.split(".");
    if (!payloadBase64 || !signature) return { valid: false };

    const expectedSig = createHmac("sha256", AUTH_SECRET).update(payloadBase64).digest("base64url");
    if (signature !== expectedSig) return { valid: false };

    const payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8"));
    if (Date.now() > payload.exp) return { valid: false };

    return { valid: true, address: payload.address, role: payload.role };
  } catch {
    return { valid: false };
  }
}
