"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  QrCode,
  FileCode,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Copy,
  Check,
  History
} from "lucide-react";
import { QRCodeAuditModal } from "@/components/blockchain/QRCodeAuditModal";
import { VerificationStatusBadge } from "@/components/blockchain/VerificationStatusBadge";
import { verifyMetadataIntegrity } from "@/lib/crypto/metadataHash";

export default function PublicAuditPage() {
  const params = useParams();
  const electionId = params.id as string;

  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Interactive hash tampering tester state
  const [editableJson, setEditableJson] = useState<string>("");
  const [customVerification, setCustomVerification] = useState<{
    isValid: boolean;
    calculatedHash: string;
  } | null>(null);

  useEffect(() => {
    async function loadAudit() {
      try {
        setLoading(true);
        const res = await fetch(`/api/elections/${electionId}/audit`);
        const data = await res.json();
        if (data.electionId) {
          setAuditData(data);
          const prettyJson = JSON.stringify(JSON.parse(data.canonicalJson), null, 2);
          setEditableJson(prettyJson);
          setCustomVerification({
            isValid: data.isHashVerified,
            calculatedHash: data.calculatedHash,
          });
        }
      } catch (err) {
        console.error("Failed to load audit bundle", err);
      } finally {
        setLoading(false);
      }
    }
    loadAudit();
  }, [electionId]);

  const handleRecalculate = () => {
    if (!auditData) return;
    try {
      const result = verifyMetadataIntegrity(editableJson, auditData.metadataHash);
      setCustomVerification({
        isValid: result.isValid,
        calculatedHash: result.calculatedHash,
      });
    } catch {
      setCustomVerification({
        isValid: false,
        calculatedHash: "Error: Invalid JSON syntax",
      });
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-400 text-xs">
        Loading cryptographic election audit trail from Polygon Amoy...
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Election Audit Not Available</h2>
        <Link href="/dashboard" className="px-4 py-2 bg-blue-600 rounded-xl text-xs text-white">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-blue-400">
              Elections
            </Link>
            <span>/</span>
            <Link href={`/elections/${auditData.electionId}`} className="hover:text-blue-400">
              {auditData.title}
            </Link>
            <span>/</span>
            <span className="text-blue-400 font-semibold">Public Audit</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white">Public Cryptographic Audit</h1>
          <p className="text-xs text-slate-400 mt-1">
            Independent verification layer: compare canonical SHA-256 metadata against Polygon Amoy blockchain records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-blue-400" />
            <span>Scan QR for Mobile Audit</span>
          </button>
          <a
            href={auditData.network.explorer}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Contract on Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* VERIFICATION BADGE STATUS */}
      <VerificationStatusBadge
        contractAddress={auditData.contractAddress}
        metadataHash={auditData.metadataHash}
        isHashVerified={customVerification?.isValid}
      />

      {/* METADATA INTEGRITY VERIFIER SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>Election Integrity Hash (SHA-256)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              The smart contract stores this hash immutable on-chain. Any alteration to rules or dates invalidates it.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyHash(auditData.metadataHash)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
            </button>
          </div>
        </div>

        {/* Hash Comparison Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block uppercase text-[10px]">On-Chain Stored Hash</span>
            <span className="text-blue-400 font-bold break-all select-all">{auditData.metadataHash}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block uppercase text-[10px]">Calculated Canonical Hash</span>
            <span
              className={`font-bold break-all select-all ${
                customVerification?.isValid ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {customVerification?.calculatedHash}
            </span>
          </div>
        </div>

        {/* Verification Alert Banner */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            customVerification?.isValid
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/25 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {customVerification?.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <strong>
                {customVerification?.isValid
                  ? "✓ Cryptographic Match Confirmed"
                  : "✗ Integrity Mismatch: Tampering Detected"}
              </strong>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {customVerification?.isValid
                  ? "The off-chain JSON representation exactly matches the on-chain SHA-256 commitment."
                  : "The JSON content has been modified. The calculated SHA-256 does not match the on-chain commitment."}
              </p>
            </div>
          </div>
          <button
            onClick={handleRecalculate}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-verify</span>
          </button>
        </div>

        {/* Interactive JSON Tester */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>Canonical JSON Metadata (Edit to test cryptographic tamper detection):</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Normalized & Sorted</span>
          </div>
          <textarea
            value={editableJson}
            onChange={(e) => {
              setEditableJson(e.target.value);
            }}
            rows={8}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* ON-CHAIN TIMELINE OF EVENTS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              <span>On-Chain Lifecycle & Ballot Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological ledger of confirmed smart contract events mined on Polygon Amoy.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {auditData.timelineEvents?.map((tx: any, idx: number) => (
            <div
              key={tx.id || idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-bold text-white uppercase tracking-wider font-mono">
                    {tx.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Block #{tx.blockNumber}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 truncate max-w-lg">
                  Tx: <span className="text-blue-400">{tx.txHash}</span>
                </p>
                {tx.details && (
                  <p className="text-[11px] text-slate-300">
                    Details: {JSON.stringify(tx.details)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(tx.timestamp).toLocaleString()}
                </span>
                <a
                  href={`https://amoy.polygonscan.com/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="View on PolygonScan"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <QRCodeAuditModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        auditUrl={typeof window !== "undefined" ? `${window.location.origin}/audit/${auditData.electionId}` : ""}
        electionTitle={auditData.title}
      />
    </div>
  );
}
