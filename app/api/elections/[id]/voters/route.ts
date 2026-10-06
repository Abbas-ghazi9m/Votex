import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const RegisterVoterSchema = z.object({
  action: z.enum(["register", "remove", "batch_register"]).default("register"),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address").optional(),
  walletAddresses: z.array(z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address")).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = RegisterVoterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { action, walletAddress, walletAddresses } = parsed.data;

    if (action === "register" && walletAddress) {
      const ok = db.registerVoter(id, walletAddress);
      return NextResponse.json({ success: ok });
    }

    if (action === "remove" && walletAddress) {
      const ok = db.removeVoter(id, walletAddress);
      return NextResponse.json({ success: ok });
    }

    if (action === "batch_register" && walletAddresses) {
      let registered = 0;
      for (const addr of walletAddresses) {
        if (db.registerVoter(id, addr)) registered++;
      }
      return NextResponse.json({ success: true, count: registered });
    }

    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to modify voter eligibility" },
      { status: 500 }
    );
  }
}
