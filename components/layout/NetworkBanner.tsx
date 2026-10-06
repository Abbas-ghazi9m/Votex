"use client";

import React from "react";
import { useAuth } from "../providers/Web3Provider";
import { AlertTriangle, ArrowRight } from "lucide-react";

export function NetworkBanner() {
  const { isWrongNetwork, switchToAmoy } = useAuth();

  if (!isWrongNetwork) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-300 px-4 py-2.5 text-sm flex items-center justify-between z-50">
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Wrong Network Detected:</strong> VOTEX operates on the{" "}
            <span className="font-semibold text-white">Polygon Amoy Testnet (Chain ID 80002)</span>.
          </span>
        </div>
        <button
          onClick={switchToAmoy}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
        >
          <span>Switch to Polygon Amoy</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
