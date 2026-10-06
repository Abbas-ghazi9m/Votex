import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeMetadataHash, verifyMetadataIntegrity } from "@/lib/crypto/metadataHash";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const election = db.getElection(id);
  if (!election) {
    return NextResponse.json({ error: "Election not found" }, { status: 404 });
  }

  const canonicalObj = election.canonicalMetadata || {
    title: election.title,
    description: election.description,
    startTime: Math.floor(new Date(election.startTime).getTime() / 1000),
    endTime: Math.floor(new Date(election.endTime).getTime() / 1000),
    adminAddress: election.adminAddress,
    rules: {
      singleChoice: true,
      requireEligibilityWhitelist: true,
      allowAbstain: false,
      minimumCandidates: 2,
    },
    version: "1.0.0",
  };

  const { canonicalJson, hashHex } = computeMetadataHash(canonicalObj);
  const integrityVerification = verifyMetadataIntegrity(canonicalJson, election.metadataHash);

  return NextResponse.json({
    electionId: election.id,
    blockchainElectionId: election.blockchainElectionId,
    title: election.title,
    contractAddress: election.contractAddress,
    network: {
      name: "Polygon Amoy Testnet",
      chainId: 80002,
      explorer: `https://amoy.polygonscan.com/address/${election.contractAddress}`,
    },
    metadataHash: election.metadataHash,
    calculatedHash: hashHex,
    isHashVerified: integrityVerification.isValid,
    canonicalJson,
    timelineEvents: election.transactions,
    totalVotesRecorded: election.totalVotes,
    eligibleVotersCount: election.eligibleVoterCount,
    status: election.status,
  });
}
