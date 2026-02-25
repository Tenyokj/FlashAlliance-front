"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import CreateAllianceForm from "../components/CreateAllianceForm";
import WalletBar from "../components/WalletBar";

export default function DappCreatePage() {
  const router = useRouter();

  async function onCreated() {
    router.push("/dapp/alliances");
  }

  return (
    <main className="dapp-main">
      <section className="dapp-hero-grid">
        <article className="dapp-hero create-hero">
          <p className="dapp-label pixel">Factory Builder</p>
          <h1>Create New Alliance</h1>
          <p className="dapp-muted">Configure pool goal, deadline, participants and fixed share map.</p>

          <div className="dapp-row" style={{ marginTop: "10px" }}>
            <Link href="/dapp" className="dapp-btn">
              Back to Hub
            </Link>
          </div>
        </article>

        <article className="dapp-panel create-checklist">
          <div>
            <p className="dapp-label pixel">Step 01</p>
            <h4>Set target + deadline</h4>
            <p className="dapp-muted">Target price in wei and funding duration in seconds.</p>
          </div>
          <div>
            <p className="dapp-label pixel">Step 02</p>
            <h4>Add participants</h4>
            <p className="dapp-muted">Insert addresses list and matching share percentages.</p>
          </div>
          <div>
            <p className="dapp-label pixel">Step 03</p>
            <h4>Deploy through Factory</h4>
            <p className="dapp-muted">Submit transaction and wait for on-chain confirmation.</p>
          </div>
        </article>
      </section>

      <WalletBar />

      <section className="create-stage">
        <article className="dapp-panel create-side-art">
          <div className="create-art-block" />
          <div className="create-art-block small" />
          <p className="dapp-muted">Alliance instances are isolated pools with fixed ownership shares.</p>
        </article>

        <CreateAllianceForm onCreated={onCreated} />
      </section>
    </main>
  );
}
