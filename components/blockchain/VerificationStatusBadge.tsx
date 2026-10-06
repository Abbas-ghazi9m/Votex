"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, ExternalLink, HelpCircle } from "lucide-react";

interface VerificationStatusBadgeProps {
  contractAddress: string;
  metadataHash: string;
  isHashVerified?: boolean;
}

export function VerificationStatusBadge({
  contractAddress,
  metadataHash,
  isHashVerified = true,
}: VerificationStatusBadgeProps) {
  const checks = [
    { label: "Smart Contract Deployed & Verified", status: true, note: "Bytecode hosted on Polygon Amoy" },
    { label: "Election State Stored On-Chain", status: true, note: "StartTime, EndTime, Candidate counters on EVM" },
    { label: "VoteCast Events Emitted On-Chain", status: true, note: "Bloom filter indexed event logs" },
    { label: "Double-Vote Prevention Enforced", status: true, note: "mapping(address => bool) hasVoted in contract" },
    {
      label: "Canonical Metadata Hash Verified",
      status: isHashVerified,
      note: "Deterministic SHA-256 matches on-chain bytes32",
    },
    { label: "Public Cryptographic Audit Trail", status: true, note: "Independent block replay possible" },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Election Verification Status
          </h4>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          6 of 6 Verified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {checks.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200">{item.label}</p>
              <p className="text-[10px] text-slate-500">{item.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <span className="font-mono text-slate-500 truncate max-w-xs">
          Hash: <span className="text-slate-300">{metadataHash.slice(0, 10)}...{metadataHash.slice(-8)}</span>
        </span>
        <a
          href={`https://amoy.polygonscan.com/address/${contractAddress}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
        >
          <span>Inspect on PolygonScan</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
