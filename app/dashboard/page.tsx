"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useAuth } from "@/components/providers/Web3Provider";
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Lock,
  Calendar,
  Users,
  Search,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { ElectionCountdown } from "@/components/elections/ElectionCountdown";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { isAuthenticated, signInWithEthereum } = useAuth();

  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED" | "VOTED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchElections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/elections");
      const data = await res.json();
      if (data.elections) {
        setElections(data.elections);
      }
    } catch (err) {
      console.error("Failed to load elections", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const userAddress = address?.toLowerCase();

  const filteredElections = elections.filter((el) => {
    const matchesSearch =
      el.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.description.toLowerCase().includes(searchQuery.toLowerCase());

    const hasUserVoted = el.voterEligibilities?.some(
      (v: any) => v.walletAddress?.toLowerCase() === userAddress && v.hasVoted
    );

    if (!matchesSearch) return false;
    if (filter === "ACTIVE") return el.status === "ACTIVE";
    if (filter === "COMPLETED") return el.status === "ENDED" || el.status === "FINALIZED";
    if (filter === "VOTED") return hasUserVoted;
    return true;
  });

  const activeCount = elections.filter((e) => e.status === "ACTIVE").length;
  const completedCount = elections.filter((e) => e.status === "ENDED" || e.status === "FINALIZED").length;
  const votedCount = elections.filter((e) =>
    e.voterEligibilities?.some((v: any) => v.walletAddress?.toLowerCase() === userAddress && v.hasVoted)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
            Voter Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white">Dashboard & Elections</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse active governance ballots, verify eligibility, and audit on-chain election records.
          </p>
        </div>

        {/* User Identity Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-xs min-w-0">
            <div className="text-slate-400 flex items-center gap-1.5">
              <span>Connected Wallet</span>
              {isAuthenticated ? (
                <span className="text-[10px] text-emerald-400 font-semibold">✓ SIWE Active</span>
              ) : (
                <span className="text-[10px] text-amber-400 font-semibold">Unsigned</span>
              )}
            </div>
            <p className="text-white font-mono font-medium truncate max-w-[180px]">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "No Wallet Connected"}
            </p>
          </div>
          {!isAuthenticated && isConnected && (
            <button
              onClick={() => signInWithEthereum()}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-medium text-slate-400">Total Elections</span>
          <p className="text-2xl font-bold text-white">{elections.length}</p>
          <span className="text-[10px] text-slate-500">Indexed on Polygon Amoy</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-medium text-emerald-400">Active Ballots</span>
          <p className="text-2xl font-bold text-white">{activeCount}</p>
          <span className="text-[10px] text-slate-500">Open for immediate voting</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-medium text-indigo-400">Completed Elections</span>
          <p className="text-2xl font-bold text-white">{completedCount}</p>
          <span className="text-[10px] text-slate-500">Results verified & finalized</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-medium text-blue-400">Elections You Voted In</span>
          <p className="text-2xl font-bold text-white">{votedCount}</p>
          <span className="text-[10px] text-slate-500">Linked to your address</span>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
          {[
            { id: "ALL", label: "All Elections" },
            { id: "ACTIVE", label: "Active" },
            { id: "COMPLETED", label: "Completed" },
            { id: "VOTED", label: "Voted In" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filter === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search elections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* ELECTION CARDS GRID */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs">Loading on-chain elections...</div>
      ) : filteredElections.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-8 space-y-3">
          <Vote className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No elections found</h3>
          <p className="text-xs text-slate-400">
            {filter === "VOTED"
              ? "You have not cast a ballot in any elections matching this criteria."
              : "No elections match the selected filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElections.map((election) => {
            const hasUserVoted = election.voterEligibilities?.some(
              (v: any) => v.walletAddress?.toLowerCase() === userAddress && v.hasVoted
            );

            return (
              <div
                key={election.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        election.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : election.status === "FINALIZED"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : election.status === "ENDED"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {election.status}
                    </span>

                    {hasUserVoted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Voted</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {election.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {election.description}
                    </p>
                  </div>

                  {/* Countdown Timer if active */}
                  {election.status === "ACTIVE" && (
                    <div className="pt-1">
                      <ElectionCountdown endTime={election.endTime} />
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500 block">Candidates</span>
                      <span className="text-white font-semibold">
                        {election.candidates?.length || 0} Registered
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Total Ballots</span>
                      <span className="text-white font-semibold">{election.totalVotes} Votes</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <Link
                    href={`/elections/${election.id}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{hasUserVoted ? "View Ballot" : "Vote Now"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/elections/${election.id}/results`}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors text-center"
                  >
                    Results
                  </Link>

                  <Link
                    href={`/audit/${election.id}`}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Audit Verification Trail"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
