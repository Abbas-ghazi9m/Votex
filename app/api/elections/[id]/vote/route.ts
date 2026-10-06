import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const VoteSchema = z.object({
  candidateId: z.number().int().positive(),
  voterAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid voter address"),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash").optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = VoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { candidateId, voterAddress, txHash } = parsed.data;
    const result = db.recordVote(id, candidateId, voterAddress, txHash);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to record vote" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      txHash: result.txHash,
      blockNumber: result.blockNumber,
      message: "Vote confirmed and recorded on blockchain.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal error recording vote" },
      { status: 500 }
    );
  }
}
