"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Server,
  Lock,
  Database,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileKey,
  Cpu,
  RefreshCw
} from "lucide-react";

export function BlockchainComparison() {
  const [activeTab, setActiveTab] = useState<"traditional" | "votex">("votex");

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="text-center space-y-3 mb-10">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Architecture Contrast
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How Blockchain Protects Your Ballot
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Understand the mathematical difference between centralized database voting and cryptographic smart contract verification.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab("traditional")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "traditional"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Traditional Database (Single Point of Failure)</span>
          </button>
          <button
            onClick={() => setActiveTab("votex")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "votex"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-200" />
            <span>VOTEX Decentralized Architecture</span>
          </button>
        </div>
      </div>

      {/* Visual Workflow Cards */}
      {activeTab === "traditional" ? (
        <div className="bg-slate-900/60 border border-rose-900/30 rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-rose-900/30 pb-4">
            <div>
              <h3 className="text-lg font-bold text-rose-300 flex items-center gap-2">
                <span>Centralized SQL / NoSQL Database Flow</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Trust Bound to Sysadmin
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Votes are mutable rows in a private table. An administrator or intruder with credentials can alter numbers silently.
              </p>
            </div>
          </div>

          {/* Traditional Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center items-center">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                <FileKey className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-semibold text-white">Voter Submits</h4>
              <p className="text-[11px] text-slate-500">Sends HTTP POST to backend server</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-semibold text-white">Central Server</h4>
              <p className="text-[11px] text-slate-500">Server script parses request</p>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-lg bg-rose-900/30 flex items-center justify-center text-rose-400">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-semibold text-rose-300">Private DB Row</h4>
              <p className="text-[11px] text-rose-400 font-mono">UPDATE candidate SET votes = votes + 1</p>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-lg bg-rose-900/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-semibold text-rose-300">Opaque Result</h4>
              <p className="text-[11px] text-slate-400">Public cannot independently verify counts</p>
            </div>
          </div>

          {/* Vulnerability Warnings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/40 space-y-1">
              <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                Silent Alterations
              </span>
              <p className="text-slate-400">
                DB administrator can run direct SQL updates with no public trace or cryptographic proof.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/40 space-y-1">
              <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                Zero Independent Audit
              </span>
              <p className="text-slate-400">
                Voters must take the election authority’s word that their ballot was tallied faithfully.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/40 space-y-1">
              <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                Single Failure Point
              </span>
              <p className="text-slate-400">
                Compromised root database credentials completely invalidate the entire election outcome.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-blue-900/40 rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-blue-900/30 pb-4">
            <div>
              <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2">
                <span>VOTEX Smart Contract & Consensus Flow</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Trust Minimized (Consensus Bound)
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Every vote is signed by ECDSA key, evaluated by immutable EVM code, and permanently sealed on Polygon.
              </p>
            </div>
          </div>

          {/* VOTEX Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center items-center">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="w-9 h-9 mx-auto rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">Voter Wallet</h4>
              <p className="text-[10px] text-slate-400 font-mono">ECDSA Signature</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="w-9 h-9 mx-auto rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">Smart Contract</h4>
              <p className="text-[10px] text-indigo-300 font-mono">Checks-Effects Pattern</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="w-9 h-9 mx-auto rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Database className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">Polygon Amoy</h4>
              <p className="text-[10px] text-purple-300 font-mono">Consensus Nodes</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="w-9 h-9 mx-auto rounded-lg bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">Event Log</h4>
              <p className="text-[10px] text-cyan-300 font-mono">VoteCast Event</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
              <div className="w-9 h-9 mx-auto rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-emerald-300">Public Audit</h4>
              <p className="text-[10px] text-emerald-400 font-mono">Zero Trust Proof</p>
            </div>
          </div>

          {/* Technical Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-900/40 space-y-1">
              <span className="font-semibold text-blue-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                Immutable Rules
              </span>
              <p className="text-slate-400">
                Even the server owner cannot modify election state or vote tallies. The EVM bytecode is law.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-900/40 space-y-1">
              <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                1-Person-1-Vote Enforced
              </span>
              <p className="text-slate-400">
                Double voting reverts automatically on-chain with <code className="text-emerald-400 font-mono">AlreadyVoted()</code> error.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-900/40 space-y-1">
              <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                Independent Verification
              </span>
              <p className="text-slate-400">
                Anyone can inspect the raw blocks and replay event logs directly on PolygonScan or an RPC node.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
