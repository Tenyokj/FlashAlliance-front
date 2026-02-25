import Link from "next/link";
import DocsSidebar from "./components/DocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell">
      <header className="docs-topbar">
        <Link href="/" className="docs-logo">
          FLASHALLIANCE
        </Link>
        <div className="docs-actions">
          <Link href="/dapp" className="docs-btn primary">
            Open dApp
          </Link>
        </div>
      </header>
      <div className="docs-frame">
        <DocsSidebar />
        <main className="docs-main">{children}</main>
      </div>
    </div>
  );
}
