"use client";

import React from "react";
import { X, ExternalLink, Award, FileText, CheckCircle2 } from "lucide-react";

interface CandidateManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    manifestoUrl?: string;
  } | null;
}

export function CandidateManifestoModal({
  isOpen,
  onClose,
  candidate,
}: CandidateManifestoModalProps) {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <img
            src={candidate.imageUrl}
            alt={candidate.name}
            className="w-16 h-16 rounded-xl object-cover border border-slate-700 shadow-md"
          />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
              Candidate #{candidate.id}
            </span>
            <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
            <p className="text-xs text-slate-400">Verified Ballot Nominee</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Platform Summary & Manifesto</span>
          </h4>
          <p className="leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300">
            {candidate.description}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Core Commitments
          </h4>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full governance transparency and quarterly open budget audits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct student/community feedback integration in policy decisions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Resource allocation prioritization for public infrastructure</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          {candidate.manifestoUrl ? (
            <a
              href={candidate.manifestoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              <span>Download Full Document (PDF)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-xs text-slate-500">Official On-Chain Filing</span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
