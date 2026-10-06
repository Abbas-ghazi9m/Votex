"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { WagmiProvider, useAccount, useSignMessage, useSwitchChain, useChainId } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig, POLYGON_AMOY_CHAIN_ID } from "@/lib/blockchain/config";

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  sessionAddress: string | null;
  signInWithEthereum: () => Promise<boolean>;
  signOut: () => Promise<void>;
  isWrongNetwork: boolean;
  switchToAmoy: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAuthenticating: false,
  authError: null,
  sessionAddress: null,
  signInWithEthereum: async () => false,
  signOut: async () => {},
  isWrongNetwork: false,
  switchToAmoy: () => {},
});

export const useAuth = () => useContext(AuthContext);

function AuthInnerProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionAddress, setSessionAddress] = useState<string | null>(null);

  const isWrongNetwork = isConnected && chainId !== POLYGON_AMOY_CHAIN_ID;

  const switchToAmoy = () => {
    try {
      switchChain({ chainId: POLYGON_AMOY_CHAIN_ID });
    } catch (e) {
      console.error("Failed to switch network", e);
    }
  };

  // Check existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setSessionAddress(data.user.address);
        } else {
          setIsAuthenticated(false);
          setSessionAddress(null);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkSession();
  }, []);

  // When wallet disconnects, auto sign out
  useEffect(() => {
    if (!isConnected) {
      setIsAuthenticated(false);
      setSessionAddress(null);
    }
  }, [isConnected]);

  const signInWithEthereum = async (): Promise<boolean> => {
    if (!address) {
      setAuthError("Please connect your wallet first.");
      return false;
    }

    try {
      setIsAuthenticating(true);
      setAuthError(null);

      // 1. Get challenge nonce and message
      const nonceRes = await fetch(`/api/auth/nonce?address=${address}`);
      const nonceData = await nonceRes.json();
      if (!nonceRes.ok || !nonceData.nonce) {
        throw new Error(nonceData.error || "Failed to retrieve authentication nonce.");
      }

      // 2. Request user to sign message via wallet
      const signature = await signMessageAsync({
        message: nonceData.message,
      });

      // 3. Verify signature on server
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          signature,
          message: nonceData.message,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || "Cryptographic verification failed.");
      }

      setIsAuthenticated(true);
      setSessionAddress(address);
      setIsAuthenticating(false);
      return true;
    } catch (err: any) {
      console.error("SIWE sign in error:", err);
      setAuthError(err.message || "User rejected signature request or network error.");
      setIsAuthenticating(false);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      setIsAuthenticated(false);
      setSessionAddress(null);
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
        authError,
        sessionAddress,
        signInWithEthereum,
        signOut,
        isWrongNetwork,
        switchToAmoy,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10_000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#3b82f6",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          <AuthInnerProvider>{children}</AuthInnerProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
