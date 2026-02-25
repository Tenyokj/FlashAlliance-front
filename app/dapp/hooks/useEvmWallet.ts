"use client";

import { useCallback, useEffect, useState } from "react";
import { type Address, type EIP1193Provider } from "viem";

declare global {
  interface Window {
    ethereum?: EIP1193Provider & {
      on?: (event: string, cb: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, cb: (...args: unknown[]) => void) => void;
    };
  }
}

const HARDHAT_CHAIN_ID = 31337;
const HARDHAT_HEX = "0x7a69";

function parseChainId(hex: string | null) {
  if (!hex) return null;
  return Number.parseInt(hex, 16);
}

export function useEvmWallet() {
  const [account, setAccount] = useState<Address | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const hasProvider = typeof window !== "undefined" && Boolean(window.ethereum);
  const isWrongNetwork = chainId !== null && chainId !== HARDHAT_CHAIN_ID;

  const refresh = useCallback(async () => {
    if (!window.ethereum) {
      setAccount(null);
      setChainId(null);
      return;
    }

    const [accounts, chainHex] = await Promise.all([
      window.ethereum.request({ method: "eth_accounts" }) as Promise<Address[]>,
      window.ethereum.request({ method: "eth_chainId" }) as Promise<string>
    ]);

    setAccount(accounts[0] ?? null);
    setChainId(parseChainId(chainHex));
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("Wallet provider not found. Install MetaMask.");
      return null;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const [accounts, chainHex] = await Promise.all([
        window.ethereum.request({ method: "eth_requestAccounts" }) as Promise<Address[]>,
        window.ethereum.request({ method: "eth_chainId" }) as Promise<string>
      ]);

      const connected = accounts[0] ?? null;
      setAccount(connected);
      setChainId(parseChainId(chainHex));
      return connected;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet connect failed");
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const switchToHardhat = useCallback(async () => {
    if (!window.ethereum) {
      setError("Wallet provider not found.");
      return;
    }

    try {
      setIsSwitching(true);
      setError(null);

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: HARDHAT_HEX }]
      });

      await refresh();
    } catch (switchError) {
      const code = (switchError as { code?: number })?.code;

      if (code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: HARDHAT_HEX,
                chainName: "Hardhat Local",
                nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: ["http://127.0.0.1:8545"]
              }
            ]
          });
          await refresh();
          return;
        } catch (addError) {
          setError(addError instanceof Error ? addError.message : "Failed to add local chain");
          return;
        }
      }

      setError(switchError instanceof Error ? switchError.message : "Network switch failed");
    } finally {
      setIsSwitching(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    void refresh();

    const onAccountsChanged = (accounts: unknown) => {
      const typed = Array.isArray(accounts) ? (accounts as Address[]) : [];
      setAccount(typed[0] ?? null);
    };

    const onChainChanged = (chainHex: unknown) => {
      if (typeof chainHex === "string") {
        setChainId(parseChainId(chainHex));
      }
    };

    window.ethereum.on?.("accountsChanged", onAccountsChanged);
    window.ethereum.on?.("chainChanged", onChainChanged);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", onAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged", onChainChanged);
    };
  }, [refresh]);

  return {
    account,
    chainId,
    error,
    isConnecting,
    isSwitching,
    isWrongNetwork,
    hasProvider,
    connect,
    refresh,
    switchToHardhat
  };
}
