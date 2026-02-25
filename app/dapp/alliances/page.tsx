"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAddress, type Address } from "viem";
import { allianceAbi, allianceFactoryAbi, ALLIANCE_FACTORY_ADDRESS } from "@/lib/dapp/contracts";
import { dappPublicClient } from "@/lib/dapp/client";
import { loadNftMedia } from "@/lib/dapp/nft";
import { ensureContractDeployed } from "@/lib/dapp/contractHealth";
import { fetchAlliancesFromSubgraph, SUBGRAPH_URL } from "@/lib/dapp/subgraph";

type AllianceSummary = {
  address: Address;
  state: bigint;
  targetPrice: bigint;
  totalDeposited: bigint;
  deadline: bigint;
  participantsCount: number;
  nftAddress: Address;
  tokenId: bigint;
  nftImage: string | null;
  nftName: string | null;
};

type Filter = "all" | "funding" | "acquired" | "closed";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function stateLabel(state: bigint) {
  if (state === 0n) return "Funding";
  if (state === 1n) return "Acquired";
  if (state === 2n) return "Closed";
  return "Unknown";
}

function fundingPct(target: bigint, deposited: bigint) {
  if (target === 0n) return "0.00";
  const scaled = (deposited * 10000n) / target;
  const whole = scaled / 100n;
  const frac = (scaled % 100n).toString().padStart(2, "0");
  return `${whole.toString()}.${frac}`;
}

export default function AlliancesFlowPage() {
  const [alliances, setAlliances] = useState<AllianceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const loadAlliancesViaSubgraph = useCallback(async () => {
    const result = await fetchAlliancesFromSubgraph(300);

    const summaries = await Promise.all(
      result.map(async (item) => {
        const parsedNftAddress = item.nftAddress ?? getAddress("0x0000000000000000000000000000000000000000");
        const parsedTokenId = item.nftTokenId ?? 0n;
        const media = item.nftAddress
          ? await loadNftMedia(dappPublicClient, parsedNftAddress, parsedTokenId)
          : { image: null, name: null };

        return {
          address: item.id,
          state: BigInt(item.state),
          targetPrice: item.targetPrice,
          totalDeposited: item.totalDepositedVolume,
          deadline: item.deadline,
          participantsCount: item.participantsCount,
          nftAddress: parsedNftAddress,
          tokenId: parsedTokenId,
          nftImage: media.image,
          nftName: media.name
        } satisfies AllianceSummary;
      })
    );

    setAlliances(summaries);
  }, []);

  const loadAlliancesViaRpc = useCallback(async () => {
    await ensureContractDeployed(ALLIANCE_FACTORY_ADDRESS, "AllianceFactory");
    const data = await dappPublicClient.readContract({
      address: ALLIANCE_FACTORY_ADDRESS,
      abi: allianceFactoryAbi,
      functionName: "getAllAlliances"
    });

    const addresses = (data as string[]).map((a) => getAddress(a));

    const summaries = await Promise.all(
      addresses.map(async (address) => {
        const [state, targetPrice, totalDeposited, deadline, participants, nftAddress, tokenId] = await Promise.all([
          dappPublicClient.readContract({ address, abi: allianceAbi, functionName: "state" }),
          dappPublicClient.readContract({ address, abi: allianceAbi, functionName: "targetPrice" }),
          dappPublicClient.readContract({ address, abi: allianceAbi, functionName: "totalDeposited" }),
          dappPublicClient.readContract({ address, abi: allianceAbi, functionName: "deadline" }),
          dappPublicClient.readContract({ address, abi: allianceAbi, functionName: "getParticipants" }),
          dappPublicClient.readContract({ address, abi: allianceAbi, functionName: "nftAddress" }),
          dappPublicClient.readContract({ address, abi: allianceAbi, functionName: "tokenId" })
        ]);

        const parsedNftAddress = getAddress(nftAddress as string);
        const parsedTokenId = tokenId as bigint;
        const media = await loadNftMedia(dappPublicClient, parsedNftAddress, parsedTokenId);

        return {
          address,
          state: state as bigint,
          targetPrice: targetPrice as bigint,
          totalDeposited: totalDeposited as bigint,
          deadline: deadline as bigint,
          participantsCount: (participants as string[]).length,
          nftAddress: parsedNftAddress,
          tokenId: parsedTokenId,
          nftImage: media.image,
          nftName: media.name
        } satisfies AllianceSummary;
      })
    );

    setAlliances(summaries);
  }, []);

  const loadAlliances = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (SUBGRAPH_URL) {
        await loadAlliancesViaSubgraph();
      } else {
        await loadAlliancesViaRpc();
      }
    } catch (e) {
      if (SUBGRAPH_URL) {
        try {
          await loadAlliancesViaRpc();
        } catch (rpcError) {
          setError(rpcError instanceof Error ? rpcError.message : "Failed to load alliance flow");
        }
      } else {
        setError(e instanceof Error ? e.message : "Failed to load alliance flow");
      }
    } finally {
      setLoading(false);
    }
  }, [loadAlliancesViaRpc, loadAlliancesViaSubgraph]);

  useEffect(() => {
    void loadAlliances();
  }, [loadAlliances]);

  const filtered = useMemo(() => {
    if (filter === "all") return alliances;
    if (filter === "funding") return alliances.filter((a) => a.state === 0n);
    if (filter === "acquired") return alliances.filter((a) => a.state === 1n);
    return alliances.filter((a) => a.state === 2n);
  }, [alliances, filter]);

  return (
    <main className="dapp-main">
      <section className="dapp-hero flow-hero">
        <p className="dapp-label pixel">Alliances Flow</p>
        <h1>Live Alliance Stream</h1>
        <p className="dapp-muted">Browse all deployed alliances as mini cards and jump into contract control pages.</p>
      </section>

      <section className="dapp-panel filter-bar">
        <div className="dapp-row">
          <button type="button" className={`dapp-btn ${filter === "all" ? "primary" : ""}`} onClick={() => setFilter("all")}>
            All
          </button>
          <button type="button" className={`dapp-btn ${filter === "funding" ? "primary" : ""}`} onClick={() => setFilter("funding")}>
            Funding
          </button>
          <button type="button" className={`dapp-btn ${filter === "acquired" ? "primary" : ""}`} onClick={() => setFilter("acquired")}>
            Acquired
          </button>
          <button type="button" className={`dapp-btn ${filter === "closed" ? "primary" : ""}`} onClick={() => setFilter("closed")}>
            Closed
          </button>
        </div>
      </section>

      {loading ? <p className="dapp-muted">Loading alliances...</p> : null}
      {error ? <p className="dapp-error">{error}</p> : null}

      <section className="mini-grid">
        {filtered.map((item, idx) => {
          const progress = Number(fundingPct(item.targetPrice, item.totalDeposited));

          return (
            <article key={item.address} className="mini-card">
              {item.nftImage ? (
                <img className="mini-cover-img" src={item.nftImage} alt={item.nftName ?? `NFT for ${item.address}`} loading="lazy" />
              ) : (
                <div className="mini-cover" />
              )}
              <div className="mini-overlay" />

              <div className="mini-content">
                <p className="dapp-label pixel">Alliance #{idx + 1}</p>
                <h4>{shortAddress(item.address)}</h4>
                <p className="dapp-muted">State: {stateLabel(item.state)}</p>
                <p className="dapp-muted">Participants: {item.participantsCount}</p>
                <p className="dapp-muted">Funding: {progress.toFixed(2)}%</p>
                <p className="dapp-muted">NFT: {item.nftName ?? "Not acquired yet"}</p>
                <div className="tile-progress">
                  <span style={{ width: `${Math.min(100, progress)}%` }} />
                </div>
                <p className="dapp-muted">Deadline: {new Date(Number(item.deadline) * 1000).toLocaleString()}</p>
                <div className="dapp-row" style={{ marginTop: "6px" }}>
                  <Link href={`/dapp/alliance/${item.address}`} className="dapp-link-btn">
                    Open Control Panel
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {!loading && !error && filtered.length === 0 ? <p className="dapp-muted">No alliances for current filter.</p> : null}
    </main>
  );
}
