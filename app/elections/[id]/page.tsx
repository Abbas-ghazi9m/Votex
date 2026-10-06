"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { useAuth } from "@/components/providers/Web3Provider";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Vote,
  ExternalLink,
  Lock,
  AlertTriangle,
  QrCode,
  FileText,
  BarChart3,
  Layers,
  ArrowRight
} from "lucide-react";
import { ElectionCountdown } from "@/components/elections/ElectionCountdown";
import { VotingFlowModal } from "@/components/voting/VotingFlowModal";
import { CandidateManifestoModal } from "@/components/elections/CandidateManifestoModal";
import { QRCodeAuditModal } from "@/components/blockchain/QRCodeAuditModal";
import { VerificationStatusBadge } from "@/components/blockchain/VerificationStatusBadge";

export default function ElectionDetailPage() {
  const params = useParams();
  const electionId = params.id as string;

  const { address, isConnected } = useAccount();
  const { isAuthenticated, signInWithEthereum } = useAuth();

  const [election, setElection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [manifestoCandidate, setManifestoCandidate] = useState<any>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [hasVotedLocal, setHasVotedLocal] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string>("");

  const fetchElection = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/elections/${electionId}`);
      const data = await res.json();
      if (data.election) {
        setElection(data.election);
        // Check if current wallet has voted
        if (address) {
          const voterRecord = data.election.voterEligibilities?.find(
            (v: any) => v.walletAddress?.toLowerCase() === address.toLowerCase()
          );
          if (voterRecord?.hasVoted) {
            setHasVotedLocal(true);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load election details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElection();
  }, [electionId, address]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-400 text-xs">
        Loading election smart contract state from Polygon Amoy...
      </div>
    );
  }

  if (!election) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Election Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested election ID does not exist or has not been deployed on-chain.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isEligible =
    !election.voterEligibilities || election.voterEligibilities.length === 0
      ? true
      : election.voterEligibilities.some(
          (v: any) => v.walletAddress?.toLowerCase() === address?.toLowerCase()
        );

  const handleVoteClick = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsVoteModalOpen(true);
  };

  const handleVoteSuccess = (txHash: string) => {
    setHasVotedLocal(true);
    setLastTxHash(txHash);
    fetchElection();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* BREADCRUMB & HEADER */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/dashboard" className="hover:text-blue-400">
            Elections
          </Link>
          <span>/</span>
          <span className="text-slate-200">{election.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  election.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : election.status === "FINALIZED"
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {election.status}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Blockchain ID: #{election.blockchainElectionId}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {election.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {election.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Audit via Mobile QR"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>Mobile QR</span>
            </button>
            <Link
              href={`/elections/${election.id}/results`}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Results</span>
            </Link>
            <Link
              href={`/audit/${election.id}`}
              className="px-3.5 py-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Public Audit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* VOTER STATUS & COUNTDOWN BANNER */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {election.status === "ACTIVE" ? (
          <ElectionCountdown endTime={election.endTime} onExpire={fetchElection} />
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Voting is currently closed for this election.</span>
          </div>
        )}

        {/* Voting Status State Badge */}
        {hasVotedLocal ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>✓ You Have Already Voted in this Election</span>
          </div>
        ) : !isConnected ? (
          <div className="text-xs text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Connect your wallet to participate in voting.</span>
          </div>
        ) : !isEligible ? (
          <div className="text-xs text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>This wallet is not in the eligible voter whitelist.</span>
          </div>
        ) : (
          <div className="text-xs text-blue-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Eligible to Cast 1 Ballot</span>
          </div>
        )}
      </div>

      {/* CANDIDATES BALLOT SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Official Candidates</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {election.candidates?.length || 0} Registered
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review platforms and select exactly one candidate to cast your vote.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {election.candidates?.map((cand: any) => (
            <div
              key={cand.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={cand.imageUrl}
                    alt={cand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/10">
                    Candidate #{cand.blockchainCandidateId}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {cand.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {cand.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <button
                  onClick={() => setManifestoCandidate(cand)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Platform & Manifesto</span>
                </button>

                <button
                  onClick={() => handleVoteClick(cand)}
                  disabled={
                    hasVotedLocal ||
                    !isConnected ||
                    !isEligible ||
                    election.status !== "ACTIVE"
                  }
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    hasVotedLocal
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : !isConnected
                      ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      : !isEligible
                      ? "bg-rose-950/40 text-rose-400 border border-rose-900/40 cursor-not-allowed"
                      : election.status !== "ACTIVE"
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30"
                  }`}
                >
                  <Vote className="w-4 h-4" />
                  <span>
                    {hasVotedLocal
                      ? "Already Voted"
                      : !isConnected
                      ? "Connect Wallet to Vote"
                      : !isEligible
                      ? "Not Whitelisted"
                      : election.status !== "ACTIVE"
                      ? "Voting Closed"
                      : `Vote for ${cand.name}`}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VERIFICATION STATUS COMPONENT */}
      <VerificationStatusBadge
        contractAddress={election.contractAddress}
        metadataHash={election.metadataHash}
      />

      {/* MODALS */}
      <VotingFlowModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        electionId={election.id}
        candidate={selectedCandidate}
        voterAddress={address || ""}
        onVoteSuccess={handleVoteSuccess}
      />

      <CandidateManifestoModal
        isOpen={!!manifestoCandidate}
        onClose={() => setManifestoCandidate(null)}
        candidate={manifestoCandidate}
      />

      <QRCodeAuditModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        auditUrl={typeof window !== "undefined" ? `${window.location.origin}/audit/${election.id}` : ""}
        electionTitle={election.title}
      />
    </div>
  );
}
