import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const AddCandidateSchema = z.object({
  name: z.string().min(1, "Candidate name is required"),
  description: z.string().min(1, "Candidate description is required"),
  imageUrl: z.string().min(1, "Image URL or CID is required"),
  manifestoUrl: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = AddCandidateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const candidate = db.addCandidate(id, parsed.data);
    if (!candidate) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, candidate });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to add candidate" },
      { status: 500 }
    );
  }
}
