import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAuthNonce, createSiweMessage } from "@/lib/auth/siwe";
import { POLYGON_AMOY_CHAIN_ID } from "@/lib/blockchain/constants";

const QuerySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    const parsed = QuerySchema.safeParse({ address });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const nonce = generateAuthNonce(parsed.data.address);
    const message = createSiweMessage({
      address: parsed.data.address,
      nonce,
      chainId: POLYGON_AMOY_CHAIN_ID,
    });

    return NextResponse.json({ nonce, message });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate nonce" },
      { status: 500 }
    );
  }
}
