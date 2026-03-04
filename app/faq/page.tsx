"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SiteFooter from "@/app/components/SiteFooter";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSection = {
  id: string;
  title: string;
  summary: string;
  items: FaqItem[];
};

const sections: FaqSection[] = [
  {
    id: "intro",
    title: "Introduction",
    summary: "What FlashAlliance is and what problem it solves.",
    items: [
      {
        question: "What is FlashAlliance in one sentence?",
        answer:
          "FlashAlliance is a non-custodial dApp for pooled NFT buying where funds stay in contract escrow and key actions are executed by fixed onchain rules."
      },
      {
        question: "What real problem does it solve?",
        answer:
          "Group NFT purchases often fail because everyone sends money to one person and loses control. FlashAlliance removes that single-wallet trust bottleneck."
      },
      {
        question: "Is this a protocol or just an app?",
        answer:
          "Today it is best described as a standalone dApp with protocol-like contract rules. Calling it an early-stage protocol is fair if you are explicit about current scope and maturity."
      },
      {
        question: "Why not use a multisig for this?",
        answer:
          "Multisig handles custody, but FlashAlliance additionally packages alliance flow: funding conditions, acquisition governance, sale voting, deterministic split, and emergency/refund routes."
      },
      {
        question: "Who is this product for right now?",
        answer:
          "Small NFT groups, testnet communities, and builders who want transparent pooled execution without handing control to one coordinator wallet."
      },
      {
        question: "Can we call it production-ready today?",
        answer:
          "Treat it as demo/staging-grade until your full audit, monitoring, and incident runbooks are complete and validated through repeated drills."
      }
    ]
  },
  {
    id: "flow",
    title: "Flow",
    summary: "Funding, acquisition vote, buy execution, and exit logic.",
    items: [
      {
        question: "How does pooled funding work?",
        answer:
          "Participants deposit ERC20 into alliance escrow. Balances are tracked per member and used for voting/ownership logic under contract constraints."
      },
      {
        question: "Who can trigger NFT acquisition?",
        answer:
          "Acquisition now requires a dedicated governance proposal and voting step. `buyNFT()` executes only an approved tuple `(NFT, tokenId, seller, price, deadline)`."
      },
      {
        question: "What happens if proposal deadline passes?",
        answer:
          "Anyone can reset expired acquisition state via `resetAcquisitionProposal()`, so stale proposals do not lock the flow."
      },
      {
        question: "How are sale proceeds distributed?",
        answer:
          "After sale execution conditions are met, proceeds are split deterministically using fixed ownership shares defined by alliance rules."
      },
      {
        question: "Can one member unilaterally change acquisition terms?",
        answer:
          "No. Acquisition execution is bound to the approved tuple and cannot be swapped to a different NFT, seller, tokenId, or price at execution."
      },
      {
        question: "What if the seller never fulfills offchain coordination?",
        answer:
          "The contract cannot force offchain actors to cooperate. In that case, alliance participants should use reset/refund/emergency routes according to state."
      }
    ]
  },
  {
    id: "security",
    title: "Security",
    summary: "Assumptions, guarantees, and operational boundaries.",
    items: [
      {
        question: "What does the contract guarantee?",
        answer:
          "Escrow accounting, approved-governance execution for acquisition, deterministic split logic, and explicit failure paths like refunds under configured conditions."
      },
      {
        question: "What does it not guarantee?",
        answer:
          "OTC seller coordination is still offchain, and execution depends on external NFT approvals and valid market conditions at transaction time."
      },
      {
        question: "How are fee-on-transfer tokens handled?",
        answer:
          "Core now enforces strict balance-delta checks in deposit/sale/buy paths. Tokens with non-standard transfer effects are rejected as unsupported."
      },
      {
        question: "Can refunds be blocked by pause?",
        answer:
          "No. `withdrawRefund()` is no longer gated by `pause()`, so failed-funding refunds remain available."
      },
      {
        question: "What is the most critical trust assumption?",
        answer:
          "Key assumption is correct contract deployment/configuration and safe admin key operations. Escrow guarantees degrade if privileged keys are compromised."
      },
      {
        question: "Are there upgrade risks?",
        answer:
          "Yes. Any future upgrade path must be controlled by strict governance and verification. If implementation changes, users should review migration notes carefully."
      }
    ]
  },
  {
    id: "network",
    title: "Sepolia",
    summary: "Practical network and wallet setup details.",
    items: [
      {
        question: "Which network should I use?",
        answer:
          "Sepolia, chainId `11155111`, unless your deployment docs explicitly point to another network."
      },
      {
        question: "What token pays gas on Sepolia?",
        answer:
          "Sepolia ETH pays gas. FATK is a protocol token for dApp mechanics, not for network transaction fees."
      },
      {
        question: "Why do I sometimes see RPC rate-limit errors?",
        answer:
          "Public/free RPC endpoints can return HTTP 429 under heavy polling. Use fallback RPCs and reduce aggressive read frequency."
      },
      {
        question: "My write call says user rejected request. Is it a bug?",
        answer:
          "Usually not. It means wallet signature was denied in MetaMask. Re-open transaction and confirm with correct network/account."
      },
      {
        question: "Why does UI show deployed addresses but call fails?",
        answer:
          "Most often frontend env is stale after redeploy. Update `NEXT_PUBLIC_*` addresses and restart app so client bundle uses the new contracts."
      },
      {
        question: "Should I use one RPC provider only?",
        answer:
          "No. Production-like UX should configure primary + fallback RPC endpoints to reduce downtime and rate-limit errors."
      }
    ]
  },
  {
    id: "troubleshooting",
    title: "Runbook",
    summary: "Common revert reasons and fast recovery actions.",
    items: [
      {
        question: "I get `unsupported token` revert. What now?",
        answer:
          "Use a standard ERC20 for alliance funding. Non-standard transfer behavior (fee/rebase-like deltas) can violate accounting checks."
      },
      {
        question: "I see `quorum not reached` flow failures.",
        answer:
          "Collect enough voting weight first, then re-submit/execute within the active deadline window."
      },
      {
        question: "Why does faucet claim fail with cooldown active?",
        answer:
          "Cooldown means the same wallet claimed too recently. Wait for cooldown expiry and retry."
      },
      {
        question: "Error signature cannot be decoded from ABI.",
        answer:
          "Frontend ABI may be outdated. Rebuild ABI exports from latest core contracts and redeploy frontend with updated artifacts."
      },
      {
        question: "Transaction gas limit too high (cap exceeded).",
        answer:
          "Client or wallet suggested gas can be above RPC cap. Remove manual gas override and let wallet estimate, or reduce configured max gas in write call options."
      },
      {
        question: "AllianceFactory is not deployed at address.",
        answer:
          "This usually happens after local node restart or redeploy mismatch. Redeploy contracts on target network and sync frontend env addresses."
      }
    ]
  }
];

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [activeSectionId, setActiveSectionId] = useState(sections[0].id);
  const [openKey, setOpenKey] = useState(`${sections[0].id}-0`);

  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const visibleSections = useMemo(() => {
    if (!isSearching) {
      return sections.filter((section) => section.id === activeSectionId);
    }

    return sections
      .map((section) => {
        const items = section.items.filter((item) => {
          return (
            section.title.toLowerCase().includes(normalizedQuery) ||
            section.summary.toLowerCase().includes(normalizedQuery) ||
            item.question.toLowerCase().includes(normalizedQuery) ||
            item.answer.toLowerCase().includes(normalizedQuery)
          );
        });
        return { ...section, items };
      })
      .filter((section) => section.items.length > 0);
  }, [activeSectionId, isSearching, normalizedQuery]);

  return (
    <main className="faq-shell">
      <div className="faq-ambient" aria-hidden="true" />
      <header className="faq-topbar">
        <Link href="/" className="faq-logo">
          FLASHALLIANCE
        </Link>

        <nav className="faq-nav" aria-label="FAQ navigation">
          <Link href="/">Home</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/sepolia-guide">Sepolia Guide</Link>
          <Link href="/dapp">Open dApp</Link>
        </nav>

        <div className="faq-actions">
          <Link href="/docs/runbook" className="btn ghost">
            Onchain Runbook
          </Link>
          <Link href="/dapp" className="btn fire">
            Launch App
          </Link>
        </div>
      </header>

      <section className="faq-hero">
        <div>
          <p className="micro pixel">FlashAlliance Knowledge Base</p>
          <h1>FAQ</h1>
          <p className="faq-hero-lead">
            Operational answers for alliance funding, acquisition governance, Sepolia setup, and common revert recovery.
          </p>
        </div>
        <div className="faq-hero-visual">
          <div className="faq-illus" aria-hidden="true">
            <div className="faq-blob faq-blob-a" />
            <div className="faq-blob faq-blob-b" />
            <div className="faq-ring faq-ring-a" />
            <div className="faq-ring faq-ring-b" />
            <div className="faq-wave faq-wave-a" />
            <div className="faq-wave faq-wave-b" />
            <div className="faq-node faq-node-a" />
            <div className="faq-node faq-node-b" />
            <div className="faq-node faq-node-c" />
          </div>
          <div className="faq-chip chip-a">Escrow-first</div>
          <div className="faq-chip chip-b">Governance acquisition</div>
          <div className="faq-chip chip-c">Deterministic split</div>
        </div>
      </section>

      <section className="faq-controls">
        <label className="faq-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M11 3a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm6.7 10.3 3 3-1.4 1.4-3-3 1.4-1.4Z"
              fill="currentColor"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search all FAQ sections"
            aria-label="Search all FAQ sections"
          />
        </label>
      </section>

      <section className="faq-layout">
        <aside className="faq-sidebar" role="tablist" aria-label="FAQ categories">
          <p className="faq-sidebar-title">FAQ Sections</p>
          {sections.map((section) => {
            const active = section.id === activeSectionId && !isSearching;
            return (
              <button
                type="button"
                key={section.id}
                className={active ? "faq-nav-item active" : "faq-nav-item"}
                onClick={() => {
                  setActiveSectionId(section.id);
                  setOpenKey(`${section.id}-0`);
                }}
              >
                <span>{section.title}</span>
                <i aria-hidden="true" />
              </button>
            );
          })}
        </aside>

        <div className="faq-content">
          {visibleSections.length === 0 ? (
            <div className="faq-empty">No results for "{query}". Try another keyword.</div>
          ) : null}

          {visibleSections.map((section) => (
            <article key={section.id} className="faq-section">
              <h2>{section.title}</h2>

              <div className="faq-accordion">
                {section.items.map((item, idx) => {
                  const key = `${section.id}-${idx}`;
                  const isOpen = openKey === key;
                  return (
                    <div className="faq-item" key={item.question}>
                      <button
                        type="button"
                        className="faq-trigger"
                        onClick={() => setOpenKey(isOpen ? "" : key)}
                        aria-expanded={isOpen}
                      >
                        <span>{item.question}</span>
                        <b className={isOpen ? "open" : ""} aria-hidden="true">
                          +
                        </b>
                      </button>

                      <div className={isOpen ? "faq-panel open" : "faq-panel"}>
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
