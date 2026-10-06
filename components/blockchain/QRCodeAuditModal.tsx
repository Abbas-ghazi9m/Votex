"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, X, ExternalLink, ShieldCheck, Copy, Check } from "lucide-react";

interface QRCodeAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditUrl: string;
  electionTitle: string;
}

export function QRCodeAuditModal({
  isOpen,
  onClose,
  auditUrl,
  electionTitle,
}: QRCodeAuditModalProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && auditUrl) {
      QRCode.toDataURL(auditUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: "#030712",
          light: "#ffffff",
        },
      })
        .then((url) => setDataUrl(url))
        .catch((err) => console.error("QR Code Error:", err));
    }
  }, [isOpen, auditUrl]);

  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(auditUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Scan to Audit on Mobile</h3>
          <p className="text-xs text-slate-400 line-clamp-1">{electionTitle}</p>
        </div>

        {/* QR Canvas Container */}
        <div className="p-3 bg-white rounded-2xl inline-block shadow-inner">
          {dataUrl ? (
            <img src={dataUrl} alt="Audit QR Code" className="w-56 h-56 mx-auto rounded-lg" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
              Generating QR...
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed px-2">
          Point your smartphone camera to immediately inspect the live smart contract, SHA-256 metadata hash, and block events.
        </p>

        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={copyLink}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy URL"}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
