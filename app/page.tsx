"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Vote,
  Lock,
  Cpu,
  Database,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  Code2,
  HelpCircle
} from "lucide-react";
import { BlockchainComparison } from "@/components/landing/BlockchainComparison";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Polygon Amoy Testnet • Next-Gen Digital Governance</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.1]">
            VOTEX
            <span className="block text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent mt-3">
              Vote Once. Verify Everything. Trust No One.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A blockchain-powered voting platform designed for transparent, tamper-evident,
            and independently verifiable elections. Enforcing mathematical one-person-one-vote rules
            without centralized database vulnerabilities.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>Explore Elections</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/elections/election-1"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Vote className="w-4 h-4 text-blue-400" />
              <span>Launch Live Demo</span>
            </Link>
            <Link
              href="/verify"
              className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Verify Blockchain</span>
            </Link>
          </div>
        </div>

        {/* HERO CRYPTOGRAPHIC PIPELINE VISUALIZATION */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl shadow-2xl max-w-5xl mx-auto">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-400 text-center mb-6">
            Cryptographic Integrity Pipeline
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white">1. Voter Wallet</h3>
              <p className="text-[10px] text-slate-400 font-mono">ECDSA Private Key</p>
            </div>

            <div className="hidden sm:flex justify-center text-slate-600">
              <ArrowRight className="w-5 h-5 animate-pulse text-blue-400" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white">2. Smart Contract</h3>
              <p className="text-[10px] text-indigo-300 font-mono">Check-Effects-Pattern</p>
            </div>

            <div className="hidden sm:flex justify-center text-slate-600">
              <ArrowRight className="w-5 h-5 animate-pulse text-indigo-400" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-emerald-300">3. Immutable Record</h3>
              <p className="text-[10px] text-emerald-400 font-mono">Polygon Block Proof</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE COMPARISON: TRADITIONAL DB vs VOTEX */}
      <section className="border-y border-slate-800/60 bg-slate-950/40">
        <BlockchainComparison />
      </section>

      {/* CORE VALUE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
            Guaranteed Properties
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Blockchain for Digital Voting?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Traditional servers require complete blind trust in systems administrators. VOTEX replaces blind trust with mathematical verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Tamper-Evident Records</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every vote cast emits an on-chain event signed with cryptographic proofs. No centralized database admin or root user can alter ballots or falsify tallies without breaking blockchain consensus.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Vote className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">One-Person-One-Vote Rule</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforced directly by EVM bytecode via immutable state mappings. Double voting transactions immediately revert on-chain with <code className="text-indigo-400 font-mono">AlreadyVoted()</code> custom errors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Publicly Verifiable Audits</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anyone can independently calculate the deterministic SHA-256 canonical hash of the off-chain election configuration and compare it against the on-chain metadataHash.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
            Voter Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How VOTEX Works</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            From connecting your wallet to verifying your sealed transaction on PolygonScan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Connect & SIWE",
              desc: "Connect your MetaMask or Web3 wallet and authenticate using cryptographically signed EIP-4361 nonces.",
            },
            {
              step: "02",
              title: "Check Eligibility",
              desc: "Smart contracts evaluate voter whitelisting status and ensure no previous ballot was recorded.",
            },
            {
              step: "03",
              title: "Cast Ballot",
              desc: "Review candidate manifestos and confirm ballot submission. Sign the transaction with your private key.",
            },
            {
              step: "04",
              title: "Verify on Explorer",
              desc: "Receive transaction hash and block confirmation. Inspect the immutable event record on PolygonScan.",
            },
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <span className="text-3xl font-black text-blue-500/40 font-mono">{item.step}</span>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
            Production Engineering
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Full-Stack Technology Stack</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { name: "Next.js 16 App Router", category: "Full-Stack Core" },
            { name: "Solidity ^0.8.24", category: "Smart Contracts" },
            { name: "Foundry / Forge", category: "Contract Testing" },
            { name: "Polygon Amoy", category: "Blockchain Network" },
            { name: "viem & wagmi", category: "Web3 Client Layer" },
            { name: "RainbowKit", category: "Wallet Connection" },
            { name: "Prisma & PostgreSQL", category: "Metadata Storage" },
            { name: "Recharts & Framer", category: "Analytics & Motion" },
          ].map((tech) => (
            <div key={tech.name} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <p className="text-xs font-bold text-white">{tech.name}</p>
              <p className="text-[10px] text-slate-500">{tech.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Honest cryptographic design boundaries</p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>Does VOTEX claim to be 100% anonymous?</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>No.</strong> We explicitly state that public blockchain transactions bind the voter wallet address to the ballot choice. VOTEX provides tamper-evidence, double-voting prevention, and transparent auditing for university and organizational elections. Full secrecy would require zero-knowledge nullifier schemes (e.g. Semaphore/Tornado-style zk-SNARKs), which are documented in our future architecture roadmap.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>Can the database administrator alter vote totals?</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>No.</strong> The database is strictly an indexer and metadata cache. The authoritative vote counts and hasVoted flags reside exclusively inside the EVM smart contract on Polygon Amoy. Any discrepancies between the database and the blockchain can be flagged immediately by the public audit tool.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>What is the SHA-256 Election Integrity Hash?</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Before an election is deployed, all off-chain rules, title, description, and timeline parameters are serialized into canonical JSON (alphabetically sorted keys, deterministic formatting). The SHA-256 hash is computed and stored permanently in the contract’s <code className="text-blue-400 font-mono">metadataHash</code> field.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-blue-950/40 to-slate-900/80 border border-blue-900/40 space-y-6">
          <h2 className="text-3xl font-black text-white">Experience Verifiable Digital Democracy</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Test the live election demo, inspect the cryptographic audit timeline, or run Foundry contract tests locally.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-600/30"
            >
              Open Voter Dashboard
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Election Admin Console
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
