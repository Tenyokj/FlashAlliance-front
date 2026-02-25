"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getAddress } from "viem";
import WalletBar from "./components/WalletBar";
import FaucetCard from "./components/FaucetCard";
import { ALLIANCE_FACTORY_ADDRESS, allianceFactoryAbi } from "@/lib/dapp/contracts";
import { dappPublicClient } from "@/lib/dapp/client";
import { ensureContractDeployed } from "@/lib/dapp/contractHealth";
import { fetchProtocolFromSubgraph, SUBGRAPH_URL } from "@/lib/dapp/subgraph";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function DappDashboardPage() {
  const [allianceCount, setAllianceCount] = useState<number>(0);
  const [block, setBlock] = useState<string>("-");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const blockNumber = await dappPublicClient.getBlockNumber();
      setBlock(blockNumber.toString());

      if (SUBGRAPH_URL) {
        const protocol = await fetchProtocolFromSubgraph();
        if (protocol) {
          setAllianceCount(Number(protocol.alliancesCreated));
          return;
        }
      }

      await ensureContractDeployed(ALLIANCE_FACTORY_ADDRESS, "AllianceFactory");
      const alliances = await dappPublicClient.readContract({
        address: ALLIANCE_FACTORY_ADDRESS,
        abi: allianceFactoryAbi,
        functionName: "getAllAlliances"
      });

      setAllianceCount((alliances as string[]).map((a) => getAddress(a)).length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="dapp-main">
      <section className="dapp-hero-grid">
        <article className="dapp-hero dashboard-hero">
          <p className="dapp-label pixel">FlashAlliance Control Center</p>
          <h1>Alliance Dashboard</h1>
          <p className="dapp-muted">Open alliances flow, create new pools, and manage every deployed alliance contract.</p>

          <div className="dapp-row" style={{ marginTop: "12px" }}>
            <Link href="/dapp/alliances" className="dapp-link-btn">
              Open Alliances Flow
            </Link>
            <Link href="/dapp/create" className="dapp-btn">
              Create Alliance
            </Link>
          </div>
        </article>

        <article className="dapp-panel dashboard-stats">
          <div>
            <p className="dapp-label pixel">Factory</p>
            <h4>{shortAddress(ALLIANCE_FACTORY_ADDRESS)}</h4>
          </div>
          <div>
            <p className="dapp-label pixel">Alliances</p>
            <h4>{allianceCount}</h4>
          </div>
          <div>
            <p className="dapp-label pixel">Latest Block</p>
            <h4>{block}</h4>
          </div>
        </article>
      </section>

      <WalletBar />

      <section className="dashboard-grid">
        <article className="dapp-panel dashboard-card">
          <p className="dapp-label pixel">Flow</p>
          <h3>Alliances Stream</h3>
          <p className="dapp-muted">Mini cards with pool state, goals, funding progress, and quick open actions.</p>
          <Link href="/dapp/alliances" className="dapp-link-btn" style={{ marginTop: "10px" }}>
            Go to Flow
          </Link>
        </article>

        <article className="dapp-panel dashboard-card">
          <p className="dapp-label pixel">Factory</p>
          <h3>Deploy New Alliance</h3>
          <p className="dapp-muted">Guided builder with participants, fixed shares, and contract deployment tx.</p>
          <Link href="/dapp/create" className="dapp-link-btn" style={{ marginTop: "10px" }}>
            Open Builder
          </Link>
        </article>

        <article className="dapp-panel dashboard-card">
          <p className="dapp-label pixel">Control</p>
          <h3>Contract Admin</h3>
          <p className="dapp-muted">Open any alliance and run funding, voting, sale, emergency and pause controls.</p>
          <Link href="/dapp/alliances" className="dapp-link-btn" style={{ marginTop: "10px" }}>
            Select Alliance
          </Link>
        </article>

        <FaucetCard />
      </section>

      {error ? <p className="dapp-error">{error}</p> : null}
    </main>
  );
}
