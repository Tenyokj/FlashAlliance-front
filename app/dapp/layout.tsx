import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FlashAlliance dApp",
  description: "Create and manage FlashAlliance pools"
};

export default function DappLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dapp-shell">
      <header className="dapp-topbar">
        <Link href="/" className="dapp-logo">
          FLASHALLIANCE
        </Link>
        <nav className="dapp-nav">
          <Link href="/dapp">Dashboard</Link>
          <Link href="/dapp/alliances">Alliances</Link>
          <Link href="/dapp/create">Create</Link>
          <Link href="/docs">Docs</Link>
        </nav>
      </header>
      <section className="dapp-demo-strip" aria-label="Community testing notice">
        <p>
          Demo mode: community testing in progress. Not a cash bug bounty. Confirmed reports are rewarded in <strong>FATK</strong>.
        </p>
      </section>
      {children}
    </div>
  );
}
