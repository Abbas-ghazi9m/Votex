"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  Trophy,
  ShieldCheck,
  CheckCircle2,
  Users,
  Percent,
  ExternalLink,
  Vote,
  Sparkles,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { VerificationStatusBadge } from "@/components/blockchain/VerificationStatusBadge";

const CHART_COLORS = ["#3b82f6", "#6366f1", "#06b6d4", "#a855f7", "#ec4899", "#10b981"];

export default function ElectionResultsPage() {
  const params = useParams();
  const electionId = params.id as string;

  const [election, setElection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/elections/${electionId}`);
        const data = await res.json();
        if (data.election) {
          setElection(data.election);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [electionId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-400 text-xs">
        Compiling on-chain election results from Polygon Amoy...
      </div>
    );
  }

  if (!election) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Election Not Found</h2>
        <Link href="/dashboard" className="px-4 py-2 bg-blue-600 rounded-xl text-xs text-white">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const candidates = election.candidates || [];
  const totalVotes = election.totalVotes || 0;
  const eligibleVoters = election.eligibleVoterCount || 1;
  const turnoutPercent = Math.min(100, Math.round((totalVotes / (eligibleVoters || 1)) * 100));

  // Determine winner
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  const winner = sortedCandidates.length > 0 ? sortedCandidates[0] : null;

  const barData = candidates.map((c: any) => ({
    name: c.name,
    votes: c.voteCount,
    percentage: totalVotes > 0 ? Math.round((c.voteCount / totalVotes) * 100) : 0,
  }));

  const pieData = candidates.map((c: any) => ({
    name: c.name,
    value: c.voteCount,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard" className="text-xs text-slate-400 hover:text-blue-400">
              Elections
            </Link>
            <span className="text-xs text-slate-600">/</span>
            <Link href={`/elections/${election.id}`} className="text-xs text-slate-400 hover:text-blue-400 truncate max-w-xs">
              {election.title}
            </Link>
            <span className="text-xs text-slate-600">/</span>
            <span className="text-xs text-blue-400 font-semibold">Certified Results</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Certified Election Results</h1>
          <p className="text-xs text-slate-400 mt-1">
            Independent tally aggregated from Polygon Amoy smart contract state events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/audit/${election.id}`}
            className="px-3.5 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Trail</span>
          </Link>
          <a
            href={`https://amoy.polygonscan.com/address/${election.contractAddress}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>PolygonScan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* WINNER CERTIFICATE / PROJECTION BANNER */}
      {winner && winner.voteCount > 0 && (
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-xl shrink-0 relative">
            <img src={winner.imageUrl} alt={winner.name} className="w-full h-full object-cover" />
            <div className="absolute top-1 right-1 p-1 rounded-full bg-amber-400 text-black">
              <Trophy className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/25">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                {election.status === "FINALIZED" ? "Officially Certified Winner" : "Leading Candidate"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{winner.name}</h2>
            <p className="text-xs text-slate-300 max-w-xl">{winner.description}</p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono">
              <span className="text-emerald-400 font-bold">
                {winner.voteCount} Ballots Received ({totalVotes > 0 ? Math.round((winner.voteCount / totalVotes) * 100) : 0}%)
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-300">Candidate ID #{winner.blockchainCandidateId}</span>
            </div>
          </div>
        </div>
      )}

      {/* PARTICIPATION STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Votes Cast</span>
          <p className="text-2xl font-bold text-white font-mono">{totalVotes}</p>
          <span className="text-[10px] text-slate-500">Recorded on EVM</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Eligible Electorate</span>
          <p className="text-2xl font-bold text-white font-mono">{eligibleVoters}</p>
          <span className="text-[10px] text-slate-500">Registered wallet addresses</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Turnout Percentage</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{turnoutPercent}%</p>
          <span className="text-[10px] text-slate-500">Participation rate</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Election Status</span>
          <p className="text-2xl font-bold text-blue-400">{election.status}</p>
          <span className="text-[10px] text-slate-500">Consensus verified</span>
        </div>
      </div>

      {/* RECHARTS ANALYTICS GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Votes Per Candidate</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }}
                  itemStyle={{ color: "#60a5fa" }}
                />
                <Bar dataKey="votes" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-indigo-400" />
            <span>Vote Share Percentage</span>
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            {totalVotes === 0 ? (
              <div className="text-xs text-slate-500">No ballots cast yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* CANDIDATE BREAKDOWN TABLE */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Full Candidate Vote Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Ballot ID</th>
                <th className="py-3 px-4">Votes Received</th>
                <th className="py-3 px-4">Share (%)</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedCandidates.map((c: any, idx: number) => {
                const share = totalVotes > 0 ? Math.round((c.voteCount / totalVotes) * 100) : 0;
                return (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={c.imageUrl} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <span className="font-semibold text-white block">{c.name}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{c.description}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">#{c.blockchainCandidateId}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">{c.voteCount}</td>
                    <td className="py-3 px-4 font-mono text-blue-400">{share}%</td>
                    <td className="py-3 px-4 text-right">
                      {idx === 0 && c.voteCount > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/25">
                          Winner
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono text-[10px]">Rank #{idx + 1}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VERIFICATION BADGE */}
      <VerificationStatusBadge
        contractAddress={election.contractAddress}
        metadataHash={election.metadataHash}
      />
    </div>
  );
}
