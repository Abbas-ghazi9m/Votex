"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useAuth } from "@/components/providers/Web3Provider";
import {
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  Play,
  Square,
  Award,
  Users,
  Vote,
  FileDown,
  Layers,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lock,
  ExternalLink,
  Trash2,
  UserPlus
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

const CHART_COLORS = ["#3b82f6", "#6366f1", "#06b6d4", "#a855f7", "#ec4899", "#10b981"];

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const { isAuthenticated, signInWithEthereum } = useAuth();

  const [elections, setElections] = useState<any[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Election Form
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStartTime, setNewStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [newEndTime, setNewEndTime] = useState(
    new Date(Date.now() + 7 * 86400 * 1000).toISOString().slice(0, 16)
  );

  // Add Candidate Form
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidateDesc, setCandidateDesc] = useState("");
  const [candidateImg, setCandidateImg] = useState("");
  const [candidateManifesto, setCandidateManifesto] = useState("");

  // Register Voter Form
  const [isRegisteringVoter, setIsRegisteringVoter] = useState(false);
  const [voterAddressInput, setVoterAddressInput] = useState("");

  const fetchElections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/elections");
      const data = await res.json();
      if (data.elections) {
        setElections(data.elections);
        if (data.elections.length > 0 && !selectedElectionId) {
          setSelectedElectionId(data.elections[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const currentElection = elections.find((e) => e.id === selectedElectionId) || elections[0];

  // Lifecycle state transition handler
  const handleStatusChange = async (newStatus: "ACTIVE" | "ENDED" | "FINALIZED") => {
    if (!currentElection) return;
    try {
      setActionMessage(null);
      const res = await fetch(`/api/elections/${currentElection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update election status");

      setActionMessage({ type: "success", text: `Election status updated to ${newStatus} on-chain.` });
      fetchElections();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message });
    }
  };

  // Create Election
  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionMessage(null);
      const res = await fetch("/api/elections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          startTime: new Date(newStartTime).toISOString(),
          endTime: new Date(newEndTime).toISOString(),
          adminAddress: address || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create election");

      setActionMessage({ type: "success", text: "New election created with canonical SHA-256 hash!" });
      setIsCreating(false);
      setNewTitle("");
      setNewDescription("");
      fetchElections();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message });
    }
  };

  // Add Candidate
  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentElection) return;
    try {
      setActionMessage(null);
      const res = await fetch(`/api/elections/${currentElection.id}/candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: candidateName,
          description: candidateDesc,
          imageUrl:
            candidateImg ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
          manifestoUrl: candidateManifesto || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add candidate");

      setActionMessage({ type: "success", text: `Candidate ${candidateName} registered!` });
      setIsAddingCandidate(false);
      setCandidateName("");
      setCandidateDesc("");
      setCandidateImg("");
      setCandidateManifesto("");
      fetchElections();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message });
    }
  };

  // Register Voter
  const handleRegisterVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentElection) return;
    try {
      setActionMessage(null);
      const res = await fetch(`/api/elections/${currentElection.id}/voters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          walletAddress: voterAddressInput.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register voter");

      setActionMessage({ type: "success", text: `Voter ${voterAddressInput} whitelisted on-chain!` });
      setIsRegisteringVoter(false);
      setVoterAddressInput("");
      fetchElections();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message });
    }
  };

  // Remove Voter
  const handleRemoveVoter = async (voterAddress: string) => {
    if (!currentElection) return;
    try {
      setActionMessage(null);
      const res = await fetch(`/api/elections/${currentElection.id}/voters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove",
          walletAddress: voterAddress,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove voter");

      setActionMessage({ type: "success", text: `Voter ${voterAddress} removed from whitelist.` });
      fetchElections();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message });
    }
  };

  // Export audit bundle
  const handleExportAudit = () => {
    if (!currentElection) return;
    const blob = new Blob([JSON.stringify(currentElection, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `votex-audit-${currentElection.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalElections = elections.length;
  const activeElections = elections.filter((e) => e.status === "ACTIVE").length;
  const totalVotesAcrossAll = elections.reduce((sum, e) => sum + (e.totalVotes || 0), 0);
  const totalVotersAcrossAll = elections.reduce((sum, e) => sum + (e.eligibleVoterCount || 0), 0);
  const participationRate =
    totalVotersAcrossAll > 0 ? Math.round((totalVotesAcrossAll / totalVotersAcrossAll) * 100) : 0;

  // Chart data for current election
  const candidateChartData = (currentElection?.candidates || []).map((c: any) => ({
    name: c.name,
    votes: c.voteCount,
  }));

  const timelineData = [
    { time: "09:00", votes: 2 },
    { time: "11:00", votes: 8 },
    { time: "13:00", votes: 15 },
    { time: "15:00", votes: 24 },
    { time: "17:00", votes: currentElection?.totalVotes || 34 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
            Administrative Console
          </span>
          <h1 className="text-3xl font-extrabold text-white">Election Administration & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create elections, manage candidate rosters, whitelist voter wallets, and execute lifecycle state transitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Election</span>
          </button>
          <button
            onClick={handleExportAudit}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Audit</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            actionMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* GLOBAL PLATFORM OVERVIEW KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Elections</span>
          <p className="text-2xl font-bold text-white font-mono">{totalElections}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-emerald-400 font-medium">Active Elections</span>
          <p className="text-2xl font-bold text-white font-mono">{activeElections}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-blue-400 font-medium">Total Votes Cast</span>
          <p className="text-2xl font-bold text-white font-mono">{totalVotesAcrossAll}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-indigo-400 font-medium">Registered Voters</span>
          <p className="text-2xl font-bold text-white font-mono">{totalVotersAcrossAll}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-purple-400 font-medium">Platform Turnout</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{participationRate}%</p>
        </div>
      </div>

      {/* ELECTION SELECTOR & LIFECYCLE CONTROLS */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Managing Election:</span>
            <select
              value={selectedElectionId}
              onChange={(e) => setSelectedElectionId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
            >
              {elections.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.title} ({el.status})
                </option>
              ))}
            </select>
          </div>

          {/* Lifecycle Action Buttons */}
          {currentElection && (
            <div className="flex items-center gap-2 flex-wrap">
              {currentElection.status === "CREATED" && (
                <button
                  onClick={() => handleStatusChange("ACTIVE")}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Election</span>
                </button>
              )}

              {currentElection.status === "ACTIVE" && (
                <button
                  onClick={() => handleStatusChange("ENDED")}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>End Election</span>
                </button>
              )}

              {currentElection.status === "ENDED" && (
                <button
                  onClick={() => handleStatusChange("FINALIZED")}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Finalize & Certify Results</span>
                </button>
              )}

              <Link
                href={`/audit/${currentElection.id}`}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1"
              >
                <span>Audit</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* ELECTION ANALYTICS CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Votes Per Candidate
            </h4>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candidateChartData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", fontSize: "11px" }}
                  />
                  <Bar dataKey="votes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Voting Activity Velocity (Hourly)
            </h4>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", fontSize: "11px" }}
                  />
                  <Line type="monotone" dataKey="votes" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CANDIDATE ROSTER & VOTER WHITELIST MANAGEMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          {/* Candidates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Candidates Roster</h4>
              <button
                onClick={() => setIsAddingCandidate(!isAddingCandidate)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                + Add Candidate
              </button>
            </div>

            {isAddingCandidate && (
              <form onSubmit={handleAddCandidate} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Platform / Description"
                  value={candidateDesc}
                  onChange={(e) => setCandidateDesc(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="url"
                  placeholder="Image URL or IPFS CID"
                  value={candidateImg}
                  onChange={(e) => setCandidateImg(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Confirm Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCandidate(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(currentElection?.candidates || []).map((cand: any) => (
                <div
                  key={cand.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={cand.imageUrl} alt={cand.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="truncate">
                      <p className="font-semibold text-white truncate">{cand.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Ballot #{cand.blockchainCandidateId}</p>
                    </div>
                  </div>
                  <span className="font-mono text-blue-400 font-bold">{cand.voteCount} votes</span>
                </div>
              ))}
            </div>
          </div>

          {/* Voter Whitelist */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Voter Eligibility Whitelist</h4>
              <button
                onClick={() => setIsRegisteringVoter(!isRegisteringVoter)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                + Register Voter
              </button>
            </div>

            {isRegisteringVoter && (
              <form onSubmit={handleRegisterVoter} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <input
                  type="text"
                  placeholder="0x wallet address (40 hex chars)"
                  value={voterAddressInput}
                  onChange={(e) => setVoterAddressInput(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Whitelist Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegisteringVoter(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(currentElection?.voterEligibilities || []).map((voter: any) => (
                <div
                  key={voter.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                >
                  <div className="truncate mr-2">
                    <span className="text-slate-300 truncate block">
                      {voter.walletAddress.slice(0, 10)}...{voter.walletAddress.slice(-8)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {voter.hasVoted ? "✓ Ballot Cast" : "Eligible (Unused)"}
                    </span>
                  </div>
                  {!voter.hasVoted && (
                    <button
                      onClick={() => handleRemoveVoter(voter.walletAddress)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Revoke Whitelist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE ELECTION MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">
            <h3 className="text-xl font-bold text-white">Create New Election Contract</h3>
            <p className="text-xs text-slate-400">
              Off-chain parameters will be canonicalized and sealed with a deterministic SHA-256 metadata hash.
            </p>

            <form onSubmit={handleCreateElection} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  placeholder="e.g. University Student Council 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Description</label>
                <textarea
                  placeholder="Purpose and governance scope of this election..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Start Time</label>
                  <input
                    type="datetime-local"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">End Time</label>
                  <input
                    type="datetime-local"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                >
                  Deploy Election
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
