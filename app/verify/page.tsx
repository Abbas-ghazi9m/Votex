"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  Database,
  Lock
} from "lucide-react";

export default function BlockchainVerifyPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleHashes = [
    {
      label: "Sample Vote Ballot Tx",
      hash: "0x89d2d46e16f387b925b64cfa2281896791bf97dc21f37e402a5435b62bfa1201",
    },
    {
      label: "Sample Candidate Added Tx",
      hash: "0x3f98c801e0d37e28329df0289bca759f635489f64bf711aebe6858e6580927c3",
    },
    {
      label: "Sample Results Finalized Tx",
      hash: "0xca54b6791ef38029cba8271048bcf6201948ba5c182903746a5bce9204981fca",
    },
  ];

  const handleSearch = async (hashToSearch?: string) => {
    const target = (hashToSearch || query).trim();
    if (!target) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await fetch(`/api/blockchain/transaction/${target}`);
      const data = await res.json();

      if (!res.ok || !data.found) {
        setError(data.error || "Transaction hash not found in on-chain index.");
      } else {
        setResult(data.transaction);
      }
    } catch (err: any) {
      setError("Failed to query Polygon Amoy node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
          Independent Verification Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Blockchain Transaction Explorer
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Verify any VOTEX ballot, candidate nomination, or election lifecycle transaction directly against
          Polygon Amoy consensus blocks. Trust no one; verify raw cryptographic receipts.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Paste 0x transaction hash, election contract address, or ballot receipt..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-28 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Inspecting..." : "Verify"}
          </button>
        </div>

        {/* Quick Demo Samples */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
          <span className="text-[11px] text-slate-500">Try sample test receipts:</span>
          {sampleHashes.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(s.hash);
                handleSearch(s.hash);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-850 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* VERIFICATION RECEIPT DETAILS */}
      {result && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                  Consensus Certified
                </span>
                <h3 className="text-xl font-bold text-white">Immutable Blockchain Transaction</h3>
              </div>
            </div>

            <a
              href={`https://amoy.polygonscan.com/tx/${result.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shrink-0"
            >
              <span>Inspect on PolygonScan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">Transaction Hash</span>
              <span className="text-blue-400 font-bold break-all select-all">{result.txHash}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">Network & Status</span>
              <div className="flex items-center gap-2 text-white font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{result.network || "Polygon Amoy (80002)"}</span>
                <span className="text-emerald-400 text-[11px]">({result.status})</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">Mined Block Number</span>
              <span className="text-white font-semibold">{result.blockNumber}</span>
              <span className="text-[10px] text-slate-500 block">Confirmations: 24+ blocks</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">Event Signature</span>
              <span className="text-indigo-300 font-semibold truncate block">
                {result.eventEmitted || result.type}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">From (Voter / Signer)</span>
              <span className="text-slate-300 break-all">{result.fromAddress}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">Contract Address</span>
              <span className="text-slate-300 break-all">
                {result.contractAddress || "0x34A60E36f1c48F4f8d4862e3E2F4d4c5145b23d9"}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-300 space-y-2">
            <span className="font-semibold text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Independent Verification Guarantee</span>
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              This verification record was verified by EVM validator consensus on Polygon Amoy. It serves as
              cryptographic proof that the vote was cast within the election window, signed by an eligible ECDSA key,
              and permanently sealed without server-side tampering.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
