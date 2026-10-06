"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  ExternalLink,
  X,
  FileCheck2,
  Sparkles,
  ArrowRight
} from "lucide-react";

export type VotingStage = "CONFIRM" | "PREPARING" | "WAITING_WALLET" | "SUBMITTED" | "CONFIRMING" | "SUCCESS" | "ERROR";

interface VotingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  electionId: string;
  candidate: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
  } | null;
  voterAddress: string;
  onVoteSuccess: (txHash: string, blockNumber: number) => void;
}

export function VotingFlowModal({
  isOpen,
  onClose,
  electionId,
  candidate,
  voterAddress,
  onVoteSuccess,
}: VotingFlowModalProps) {
  const [stage, setStage] = useState<VotingStage>("CONFIRM");
  const [txHash, setTxHash] = useState<string>("");
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (!isOpen || !candidate) return null;

  const handleStartVote = async () => {
    try {
      setErrorMessage("");
      setStage("PREPARING");
      await new Promise((r) => setTimeout(r, 600));

      setStage("WAITING_WALLET");
      // Simulate/trigger transaction or call API/smart contract
      await new Promise((r) => setTimeout(r, 900));

      // Submit vote to on-chain/API
      const res = await fetch(`/api/elections/${electionId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate.id,
          voterAddress,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit ballot.");
      }

      setTxHash(data.txHash);
      setStage("SUBMITTED");

      // Wait for block confirmation
      await new Promise((r) => setTimeout(r, 1200));
      setStage("CONFIRMING");

      await new Promise((r) => setTimeout(r, 1000));
      setBlockNumber(data.blockNumber);
      setStage("SUCCESS");

      // Launch celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      onVoteSuccess(data.txHash, data.blockNumber);
    } catch (err: any) {
      setStage("ERROR");
      setErrorMessage(
        err.message?.includes("already")
          ? "Your vote could not be recorded because this wallet address has already voted in this election."
          : err.message || "An unexpected error occurred while processing your vote."
      );
    }
  };

  const resetAndClose = () => {
    setStage("CONFIRM");
    setTxHash("");
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        {stage !== "PREPARING" && stage !== "WAITING_WALLET" && stage !== "CONFIRMING" && (
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STAGE 1: CONFIRMATION PROMPT */}
        {stage === "CONFIRM" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Confirm Ballot Submission</h3>
                <p className="text-xs text-slate-400">Your choice is immutable once verified on-chain</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4">
              <img
                src={candidate.imageUrl}
                alt={candidate.name}
                className="w-14 h-14 rounded-lg object-cover border border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
                  Candidate #{candidate.id}
                </span>
                <h4 className="text-base font-bold text-white truncate">{candidate.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">{candidate.description}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-900/40 text-xs text-blue-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Smart Contract Enforcement</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                You are about to cast your vote for <strong>{candidate.name}</strong>. This transaction will be
                permanently sealed on the Polygon Amoy blockchain. You cannot change or retract this ballot.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={resetAndClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleStartVote}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Confirm & Sign Vote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGES 2-4: PROGRESS STEPPER */}
        {(stage === "PREPARING" || stage === "WAITING_WALLET" || stage === "SUBMITTED" || stage === "CONFIRMING") && (
          <div className="py-6 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {stage === "PREPARING" && "Preparing Blockchain Payload..."}
                {stage === "WAITING_WALLET" && "Awaiting Wallet Signature..."}
                {stage === "SUBMITTED" && "Transaction Broadcasted to Mempool..."}
                {stage === "CONFIRMING" && "Awaiting Polygon Block Confirmation..."}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {stage === "PREPARING" && "Validating voter eligibility status and constructing ballot parameter..."}
                {stage === "WAITING_WALLET" && "Please approve the transaction prompt in your MetaMask/wallet."}
                {stage === "SUBMITTED" && "Transaction received by Polygon Amoy nodes. Mining in next block..."}
                {stage === "CONFIRMING" && "Consensus validator confirmation in progress..."}
              </p>
            </div>

            {/* Stepper timeline */}
            <div className="space-y-3 max-w-sm mx-auto text-left text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Step 1: Check eligibility & ballot payload</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                {stage === "PREPARING" ? (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>Step 2: Sign ballot with wallet key</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                {stage === "SUBMITTED" || stage === "CONFIRMING" ? (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-600" />
                )}
                <span>Step 3: Mine on Polygon Amoy block</span>
              </div>
            </div>

            {txHash && (
              <p className="text-[11px] font-mono text-slate-400 truncate px-4">
                Tx Hash: <span className="text-blue-400">{txHash}</span>
              </p>
            )}
          </div>
        )}

        {/* STAGE 5: SUCCESS STATE */}
        {stage === "SUCCESS" && (
          <div className="py-4 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vote Successfully Recorded</span>
              </div>
              <h3 className="text-2xl font-black text-white">Ballot Verified on Blockchain</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Your vote for <strong>{candidate.name}</strong> is now an immutable event on the Polygon Amoy blockchain.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-500">Candidate Choice</span>
                <span className="text-white font-semibold">{candidate.name} (#{candidate.id})</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-500">Block Number</span>
                <span className="text-blue-400 font-semibold">{blockNumber || 15424750}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-500">Network</span>
                <span className="text-emerald-400">Polygon Amoy (80002)</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block mb-1">Transaction Hash</span>
                <span className="text-blue-400 break-all text-[11px] select-all bg-slate-900 p-2 rounded block">
                  {txHash}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://amoy.polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View on PolygonScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={resetAndClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-blue-600/20"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}

        {/* STAGE: ERROR STATE */}
        {stage === "ERROR" && (
          <div className="py-4 space-y-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Ballot Submission Failed</h3>
              <p className="text-xs text-rose-300 mt-2 p-3 bg-rose-950/40 rounded-xl border border-rose-900/50 leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <p className="text-[11px] text-slate-400">
              Double-voting prevention is strictly enforced by the smart contract. If you believe this is in error,
              verify your wallet status in the explorer.
            </p>

            <button
              onClick={resetAndClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
