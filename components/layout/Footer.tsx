import React from "react";
import Link from "next/link";
import { ShieldAlert, ExternalLink, Terminal, FileText, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Educational / Hackathon Scope Notice */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">
              Academic & Demonstration Notice: Non-Government Platform
            </p>
            <p className="text-slate-400 leading-relaxed">
              VOTEX is engineered as an educational and hackathon platform to demonstrate how blockchain smart contracts,
              cryptographic hashing, and event logs guarantee vote integrity, tamper-evident records, and decentralized auditing.
              It does <strong>NOT</strong> claim absolute anonymity or government-election-grade secrecy. Public blockchain votes
              are auditable by design; see our{" "}
              <Link href="/audit/election-1" className="text-blue-400 underline hover:text-blue-300">
                Cryptographic Audit
              </Link>{" "}
              and Security documentation for complete cryptographic boundaries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white">VOTEX</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-mono">
                v1.0-amoy
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decentralized Secure Digital Voting Platform. Vote Once. Verify Everything. Trust No One.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Polygon Amoy Testnet (80002)
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
                  Voter Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-400 transition-colors">
                  Election Administration
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-blue-400 transition-colors">
                  Independent Verification
                </Link>
              </li>
              <li>
                <Link href="/audit/election-1" className="hover:text-blue-400 transition-colors">
                  Public Cryptographic Audit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Blockchain & Auditing
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://amoy.polygonscan.com/address/0x34A60E36f1c48F4f8d4862e3E2F4d4c5145b23d9"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-400 transition-colors"
                >
                  <span>PolygonScan Contract</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-slate-500 font-mono">SHA-256 Canonical Auditing</span>
              </li>
              <li>
                <span className="text-slate-500 font-mono">One-Person-One-Vote Rules</span>
              </li>
              <li>
                <span className="text-slate-500 font-mono">SIWE EIP-4361 Auth</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Technical Guarantees
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Non-repudiable Vote Records</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Database Authority on Counts</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Publicly Verifiable State Transitions</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 VOTEX Core Protocol. Open-Source Educational Web3 Architecture.</p>
          <p className="font-mono text-slate-400">
            Powered by Next.js 16 • viem • wagmi • Polygon Amoy
          </p>
        </div>
      </div>
    </footer>
  );
}
