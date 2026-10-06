import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { computeMetadataHash } from "@/lib/crypto/metadataHash";

const CreateElectionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  startTime: z.string(),
  endTime: z.string(),
  adminAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid admin address"),
  rules: z.object({
    singleChoice: z.boolean().default(true),
    requireEligibilityWhitelist: z.boolean().default(true),
    allowAbstain: z.boolean().default(false),
    minimumCandidates: z.number().default(2),
  }).optional(),
  organization: z.string().optional(),
  contactEmail: z.string().email().optional(),
  initialCandidates: z.array(z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    imageUrl: z.string().url().or(z.string()),
    manifestoUrl: z.string().optional(),
  })).optional(),
});

export async function GET() {
  const elections = db.getElections();
  return NextResponse.json({ elections });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateElectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, description, startTime, endTime, adminAddress, rules, organization, contactEmail, initialCandidates } = parsed.data;

    // Build canonical metadata object
    const canonicalMetadata = {
      title,
      description,
      startTime: Math.floor(new Date(startTime).getTime() / 1000),
      endTime: Math.floor(new Date(endTime).getTime() / 1000),
      adminAddress,
      rules: rules || {
        singleChoice: true,
        requireEligibilityWhitelist: true,
        allowAbstain: false,
        minimumCandidates: 2,
      },
      organization: organization || "VOTEX Governance Council",
      contactEmail: contactEmail || "elections@votex.network",
      version: "1.0.0",
    };

    const { hashHex } = computeMetadataHash(canonicalMetadata);

    const created = db.createElection({
      title,
      description,
      startTime,
      endTime,
      metadataHash: hashHex,
      canonicalMetadata,
      adminAddress,
    });

    // Add candidates if provided
    if (initialCandidates && initialCandidates.length > 0) {
      for (const cand of initialCandidates) {
        db.addCandidate(created.id, cand);
      }
    }

    return NextResponse.json({
      success: true,
      election: db.getElection(created.id),
      metadataHash: hashHex,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create election" },
      { status: 500 }
    );
  }
}
