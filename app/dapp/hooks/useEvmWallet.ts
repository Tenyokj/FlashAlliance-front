"use client";

import { useCallback, useEffect, useState } from "react";
import { type Address, type EIP1193Provider } from "viem";
import { DAPP_CHAIN_ID, DAPP_CHAIN_NAME, DAPP_RPC_URL } from "@/lib/dapp/contracts";
import { toWalletErrorMessage } from "@/lib/dapp/walletErrors";

declare global {
  interface Window {
    ethereum?: EIP1193Provider & {
      on?: (event: string, cb: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, cb: (...args: unknown[]) => void) => void;
    };
  }
}

const TARGET_CHAIN_ID = DAPP_CHAIN_ID;
const TARGET_CHAIN_HEX = `0x${TARGET_CHAIN_ID.toString(16)}`;

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
  const isWrongNetwork = chainId !== null && chainId !== TARGET_CHAIN_ID;

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
        params: [{ chainId: TARGET_CHAIN_HEX }]
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
                chainId: TARGET_CHAIN_HEX,
                chainName: DAPP_CHAIN_NAME,
                nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: [DAPP_RPC_URL]
              }
            ]
          });
          await refresh();
          return;
        } catch (addError) {
          setError(toWalletErrorMessage(addError, "Failed to add target chain"));
          return;
        }
      }

      setError(toWalletErrorMessage(switchError, "Network switch failed"));
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
    switchToHardhat,
    targetChainName: DAPP_CHAIN_NAME
  };
}
