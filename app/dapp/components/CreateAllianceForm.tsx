"use client";

import { useMemo, useState } from "react";
import { createWalletClient, custom, getAddress, isAddress } from "viem";
import { ALLIANCE_FACTORY_ADDRESS, TENYOKJ_TOKEN_ADDRESS, allianceFactoryAbi } from "@/lib/dapp/contracts";
import { dappPublicClient } from "@/lib/dapp/client";
import { useEvmWallet } from "../hooks/useEvmWallet";
import { ensureContractDeployed } from "@/lib/dapp/contractHealth";

type Props = {
  onCreated: () => Promise<void>;
};

function parseAddresses(raw: string) {
  return raw
    .split(/[\n,]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseUintList(raw: string) {
  return raw
    .split(/[\n,]/)
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => Number(v));
}

export default function CreateAllianceForm({ onCreated }: Props) {
  const { account, connect, isWrongNetwork, switchToHardhat } = useEvmWallet();

  const [targetPrice, setTargetPrice] = useState("");
  const [deadlineSeconds, setDeadlineSeconds] = useState("");
  const [tokenAddress, setTokenAddress] = useState(TENYOKJ_TOKEN_ADDRESS);
  const [participants, setParticipants] = useState("");
  const [shares, setShares] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validation = useMemo(() => {
    const p = parseAddresses(participants);
    const s = parseUintList(shares);

    if (!targetPrice || Number(targetPrice) <= 0) {
      return "Target price must be > 0";
    }

    if (!deadlineSeconds || Number(deadlineSeconds) <= 0) {
      return "Deadline seconds must be > 0";
    }

    if (!isAddress(tokenAddress)) {
      return "Token address is invalid";
    }

    if (p.length === 0) {
      return "Add at least one participant";
    }

    if (p.some((addr) => !isAddress(addr))) {
      return "Participants list contains invalid address";
    }

    if (p.length !== s.length) {
      return "Participants and shares length mismatch";
    }

    if (s.some((n) => !Number.isInteger(n) || n <= 0)) {
      return "Shares must be positive integers";
    }

    const sum = s.reduce((acc, v) => acc + v, 0);
    if (sum !== 100) {
      return "Shares sum must be 100";
    }

    return null;
  }, [deadlineSeconds, participants, shares, targetPrice, tokenAddress]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (validation) {
      setError(validation);
      return;
    }

    setError(null);
    setStatus(null);

    let activeAccount = account;

    if (!activeAccount) {
      activeAccount = await connect();
      if (!activeAccount) {
        setError("Connect wallet first");
        return;
      }
    }

    if (!activeAccount || !window.ethereum) {
      setError("Wallet client unavailable");
      return;
    }

    if (isWrongNetwork) {
      await switchToHardhat();
    }

    const wallet = createWalletClient({
      account: activeAccount,
      chain: {
        id: 31337,
        name: "Hardhat",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: { default: { http: ["http://127.0.0.1:8545"] }, public: { http: ["http://127.0.0.1:8545"] } }
      },
      transport: custom(window.ethereum)
    });

    setIsSubmitting(true);

    try {
      await ensureContractDeployed(ALLIANCE_FACTORY_ADDRESS, "AllianceFactory");
      setStatus("Sending transaction...");

      const p = parseAddresses(participants).map((v) => getAddress(v));
      const s = parseUintList(shares).map((v) => BigInt(v));

      const hash = await wallet.writeContract({
        address: ALLIANCE_FACTORY_ADDRESS,
        abi: allianceFactoryAbi,
        functionName: "createAlliance",
        args: [
          BigInt(targetPrice),
          BigInt(deadlineSeconds),
          p,
          s,
          getAddress(tokenAddress)
        ],
        account: activeAccount
      });

      setStatus("Waiting for confirmation...");
      await dappPublicClient.waitForTransactionReceipt({ hash });

      setStatus("Alliance created successfully");
      await onCreated();
    } catch (txError) {
      setError(txError instanceof Error ? txError.message : "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="dapp-panel" id="create">
      <div className="dapp-panel-head">
        <p className="dapp-label pixel">Factory action</p>
        <h3>Create Alliance</h3>
      </div>

      <form onSubmit={onSubmit} className="dapp-form">
        <label>
          Target Price (wei)
          <input value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} />
        </label>

        <label>
          Funding Deadline (seconds)
          <input value={deadlineSeconds} onChange={(e) => setDeadlineSeconds(e.target.value)} />
        </label>

        <label>
          ERC20 Token Address
          <input
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value as `0x${string}`)}
          />
        </label>

        <label>
          Participants (comma or newline separated)
          <textarea value={participants} onChange={(e) => setParticipants(e.target.value)} rows={3} />
        </label>

        <label>
          Shares (comma or newline, sum = 100)
          <textarea value={shares} onChange={(e) => setShares(e.target.value)} rows={2} />
        </label>

        <div className="dapp-row">
          <button type="submit" className="dapp-btn primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Alliance"}
          </button>
        </div>

        {validation ? <p className="dapp-warning">Validation: {validation}</p> : null}
        {status ? <p className="dapp-success">{status}</p> : null}
        {error ? <p className="dapp-error">{error}</p> : null}
      </form>
    </section>
  );
}
