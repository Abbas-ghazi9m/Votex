import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const PatchStatusSchema = z.object({
  status: z.enum(["CREATED", "ACTIVE", "ENDED", "FINALIZED"]),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const election = db.getElection(id);
  if (!election) {
    return NextResponse.json({ error: "Election not found" }, { status: 404 });
  }

  return NextResponse.json({ election });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = PatchStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = db.updateElectionStatus(id, parsed.data.status);
    if (!updated) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      election: db.getElection(id),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update election status" },
      { status: 500 }
    );
  }
}
