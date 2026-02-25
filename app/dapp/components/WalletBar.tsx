"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { dappPublicClient } from "@/lib/dapp/client";
import { useEvmWallet } from "../hooks/useEvmWallet";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletBar() {
  const {
    account,
    chainId,
    hasProvider,
    isConnecting,
    isSwitching,
    isWrongNetwork,
    error,
    connect,
    switchToHardhat,
    refresh
  } = useEvmWallet();

  const [balance, setBalance] = useState<string>("-");

  useEffect(() => {
    let mounted = true;

    async function loadBalance() {
      if (!account) {
        if (mounted) setBalance("-");
        return;
      }

      try {
        const raw = await dappPublicClient.getBalance({ address: account });
        if (!mounted) return;
        const eth = Number(formatEther(raw));
        setBalance(`${eth.toFixed(4)} ETH`);
      } catch {
        if (mounted) setBalance("N/A");
      }
    }

    void loadBalance();

    return () => {
      mounted = false;
    };
  }, [account]);

  return (
    <section className="wallet-bar">
      <div>
        <p className="dapp-label pixel">Wallet</p>
        <h2>{account ? shortAddress(account) : "Not connected"}</h2>
        <p className="dapp-muted">Chain ID: {chainId ?? "-"}</p>
        <p className="dapp-muted">Balance: {balance}</p>
      </div>

      <div className="wallet-actions dapp-row">
        {!account ? (
          <button type="button" className="dapp-btn primary" disabled={!hasProvider || isConnecting} onClick={connect}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <button type="button" className="dapp-btn" onClick={refresh}>
            Refresh
          </button>
        )}

        {account && isWrongNetwork ? (
          <button type="button" className="dapp-btn primary" disabled={isSwitching} onClick={switchToHardhat}>
            {isSwitching ? "Switching..." : "Switch to Hardhat"}
          </button>
        ) : null}
      </div>

      {!hasProvider ? <p className="dapp-error">MetaMask not found.</p> : null}
      {error ? <p className="dapp-error">{error}</p> : null}
    </section>
  );
}
