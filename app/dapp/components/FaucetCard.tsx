"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createWalletClient, custom, isAddressEqual, type Address } from "viem";
import { dappPublicClient } from "@/lib/dapp/client";
import { DAPP_CHAIN_ID, FAUCET_ADDRESS, faucetAbi } from "@/lib/dapp/contracts";
import { formatTokenAmount, loadTokenMeta } from "@/lib/dapp/token";
import { useEvmWallet } from "../hooks/useEvmWallet";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

const hardhatChain = {
  id: DAPP_CHAIN_ID,
  name: "Hardhat",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] }, public: { http: ["http://127.0.0.1:8545"] } }
} as const;

function formatSeconds(value: number) {
  if (value <= 0) return "Ready now";
  const hours = Math.floor(value / 3600);
  const mins = Math.floor((value % 3600) / 60);
  const secs = value % 60;
  return `${hours}h ${mins}m ${secs}s`;
}

export default function FaucetCard() {
  const { account, connect, isWrongNetwork, switchToHardhat } = useEvmWallet();

  const [claimAmount, setClaimAmount] = useState<bigint>(0n);
  const [cooldown, setCooldown] = useState<bigint>(0n);
  const [lastClaimAt, setLastClaimAt] = useState<bigint>(0n);
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [tokenSymbol, setTokenSymbol] = useState("FATK");
  const [nowTs, setNowTs] = useState(() => Math.floor(Date.now() / 1000));
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const faucetDisabled = useMemo(() => isAddressEqual(FAUCET_ADDRESS, ZERO_ADDRESS), []);

  const load = useCallback(async () => {
    if (faucetDisabled) return;

    try {
      const [amount, cd] = await Promise.all([
        dappPublicClient.readContract({
          address: FAUCET_ADDRESS,
          abi: faucetAbi,
          functionName: "claimAmount"
        }),
        dappPublicClient.readContract({
          address: FAUCET_ADDRESS,
          abi: faucetAbi,
          functionName: "claimCooldown"
        })
      ]);

      setClaimAmount(amount as bigint);
      setCooldown(cd as bigint);

      const tokenAddr = await dappPublicClient.readContract({
        address: FAUCET_ADDRESS,
        abi: faucetAbi,
        functionName: "token"
      });

      const meta = await loadTokenMeta(dappPublicClient, tokenAddr as Address);
      setTokenDecimals(meta.decimals);
      setTokenSymbol(meta.symbol);

      if (account) {
        const last = await dappPublicClient.readContract({
          address: FAUCET_ADDRESS,
          abi: faucetAbi,
          functionName: "lastClaimAt",
          args: [account]
        });
        setLastClaimAt(last as bigint);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load faucet state");
    }
  }, [account, faucetDisabled]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowTs(Math.floor(Date.now() / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const nextClaimAt = useMemo(() => Number(lastClaimAt + cooldown), [lastClaimAt, cooldown]);
  const remaining = useMemo(() => Math.max(0, nextClaimAt - nowTs), [nextClaimAt, nowTs]);

  const onClaim = useCallback(async () => {
    if (faucetDisabled) {
      setError("Faucet address is not configured");
      return;
    }

    setError(null);
    setStatus(null);

    let active = account;
    if (!active) {
      active = await connect();
      if (!active) {
        setError("Connect wallet first");
        return;
      }
    }

    if (remaining > 0) {
      setError(`Next claim available in ${formatSeconds(remaining)}`);
      return;
    }

    if (!window.ethereum) {
      setError("Wallet provider unavailable");
      return;
    }

    if (isWrongNetwork) {
      await switchToHardhat();
    }

    const wallet = createWalletClient({
      account: active,
      chain: hardhatChain,
      transport: custom(window.ethereum)
    });

    try {
      setBusy(true);
      setStatus("Sending claim transaction...");

      const hash = await wallet.writeContract({
        address: FAUCET_ADDRESS,
        abi: faucetAbi,
        functionName: "claim",
        args: []
      });

      setStatus("Waiting for confirmation...");
      await dappPublicClient.waitForTransactionReceipt({ hash });
      setStatus("Claim successful");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Claim failed");
    } finally {
      setBusy(false);
    }
  }, [account, connect, faucetDisabled, isWrongNetwork, load, remaining, switchToHardhat]);

  return (
    <article className="dapp-panel dashboard-card">
      <p className="dapp-label pixel">Faucet</p>
      <h3>Claim FATK</h3>
      <p className="dapp-muted">Fixed amount every 24 hours per wallet for demo/testing usage.</p>
      <p className="dapp-muted">Claim amount: {formatTokenAmount(claimAmount, tokenDecimals)} {tokenSymbol}</p>
      <p className="dapp-muted">Cooldown: {cooldown > 0n ? formatSeconds(Number(cooldown)) : "-"}</p>
      <p className="dapp-muted">Next claim: {formatSeconds(remaining)}</p>
      <button type="button" className="dapp-btn primary" onClick={() => void onClaim()} disabled={busy || faucetDisabled || remaining > 0}>
        {busy ? "Claiming..." : "Claim FATK"}
      </button>
      {faucetDisabled ? <p className="dapp-warning">Faucet is not configured for this environment.</p> : null}
      {status ? <p className="dapp-success">{status}</p> : null}
      {error ? <p className="dapp-error">{error}</p> : null}
    </article>
  );
}
