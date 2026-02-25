"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type TocItem = { href: string; label: string };

const routeToc: Record<string, TocItem[]> = {
  "/docs": [
    { href: "#navigation", label: "Navigation" },
    { href: "#what-is", label: "What FlashAlliance Is" },
    { href: "#quick-start", label: "Quick Start" },
    { href: "#official-links", label: "Official Links" }
  ],
  "/docs/tokenomics": [
    { href: "#fatk-usage", label: "FATK Usage" },
    { href: "#fatk-limits", label: "FATK Limits" },
    { href: "#settlement-confusion", label: "Settlement Logic" },
    { href: "#token-strategy", label: "Token Strategy" }
  ],
  "/docs/how-it-works": [
    { href: "#states", label: "States" },
    { href: "#roles", label: "Roles" },
    { href: "#errors", label: "Common Errors" },
    { href: "#ops", label: "Best Practices" }
  ],
  "/docs/testing": [
    { href: "#baseline", label: "Baseline Workflow" },
    { href: "#roles", label: "Wallet Roles" },
    { href: "#matrix", label: "Test Matrix" },
    { href: "#restart-trap", label: "Restart Trap" }
  ],
  "/docs/faq": [
    { href: "#faq-top", label: "Top Questions" }
  ],
  "/docs/risk": [
    { href: "#risk-smart-contract", label: "Contract Risk" },
    { href: "#risk-token-acceptance", label: "Token Acceptance" },
    { href: "#risk-network", label: "Network Limits" },
    { href: "#risk-frontend-copy", label: "Frontend Copy Risk" }
  ],
  "/docs/roadmap": [
    { href: "#phase-a", label: "Phase A" },
    { href: "#phase-b", label: "Phase B" },
    { href: "#phase-c", label: "Phase C" }
  ],
  "/docs/status": [
    { href: "#network-release", label: "Network Status" },
    { href: "#known-constraints", label: "Known Constraints" }
  ],
  "/docs/rules": [
    { href: "#acceptance", label: "Acceptance" },
    { href: "#user-obligations", label: "User Obligations" },
    { href: "#reporting", label: "Reporting Rules" },
    { href: "#reward-policy", label: "Reward Policy" }
  ]
};

export default function DocsSidebar() {
  const pathname = usePathname();
  const toc = routeToc[pathname] ?? [];

  return (
    <aside className="docs-sidebar">
      <p className="docs-sidebar-title">Sections</p>
      <nav className="docs-sidebar-nav" aria-label="On-page sections">
        {toc.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="docs-sidebar-links">
        <p className="docs-sidebar-title">Pages</p>
        <Link href="/docs">Overview</Link>
        <Link href="/docs/tokenomics">FATK & Economy</Link>
        <Link href="/docs/how-it-works">How It Works</Link>
        <Link href="/docs/testing">Testing</Link>
        <Link href="/docs/rules">Rules of Use</Link>
        <Link href="/docs/faq">FAQ</Link>
        <Link href="/docs/risk">Risk</Link>
      </div>
    </aside>
  );
}
