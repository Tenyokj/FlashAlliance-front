import Link from "next/link";
import HeroWebGL from "./components/HeroWebGL";
import { siteLinks } from "@/lib/siteLinks";

const tickerItems = [
  "ERC20 Funding",
  "Fixed Participants",
  "Fixed Ownership Shares",
  "Target NFT",
  "Sale Vote",
  "Proceeds Split",
  "Emergency Route"
];

const surfaceItems = [
  {
    title: "Funding status",
    info: "Track ERC20 pool progress and threshold readiness."
  },
  {
    title: "Acquisition trigger",
    info: "Execute target NFT buy when alliance conditions are met."
  },
  {
    title: "Sale voting",
    info: "Set exit parameters with participant vote signals."
  },
  {
    title: "Split engine",
    info: "Distribute proceeds by fixed ownership share mapping."
  },
  {
    title: "Local control",
    info: "Ownable admin scope per alliance, fully local and independent."
  }
];

const showcaseImages = [
  {
    title: "CryptoPunk #111",
    text: "Buy NFT exposure with fixed alliance shares.",
    src: "https://www.larvalabs.com/cryptopunks/cryptopunk111.png",
    href: "https://opensea.io/assets/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/111"
  },
  {
    title: "CryptoPunk #7804",
    text: "Group decisions with deterministic split logic.",
    src: "https://www.larvalabs.com/cryptopunks/cryptopunk7804.png",
    href: "https://opensea.io/assets/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/7804"
  },
  {
    title: "CryptoPunk #3100",
    text: "Coordinate fund, acquire, and exit as one module.",
    src: "https://www.larvalabs.com/cryptopunks/cryptopunk3100.png",
    href: "https://opensea.io/assets/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/3100"
  }
];

const statItems = [
  { value: "24/7", label: "Alliance signal stream" },
  { value: "3", label: "Main lifecycle states" },
  { value: "100%", label: "Fixed-share split model" },
  { value: "0", label: "Dependency on core DAO flow" }
];

const drawers = [
  {
    title: "Safety rail",
    content:
      "Each alliance keeps local Ownable boundaries with independent controls."
  },
  {
    title: "Fractional buy flow",
    content:
      "Members fund ERC20 together, execute one NFT mission, and hold outcomes via fixed ownership shares."
  },
  {
    title: "Exit coordination",
    content:
      "Sale params are voted in alliance context, then split engine distributes proceeds deterministically."
  },
  {
    title: "Emergency route",
    content:
      "If funding fails or mission breaks conditions, alliance can follow explicit refund and emergency paths."
  }
];

const coreRepoUrl = process.env.NEXT_PUBLIC_CORE_REPO_URL ?? "https://github.com/Tenyokj/FlashAlliance";
const frontRepoUrl = process.env.NEXT_PUBLIC_FRONT_REPO_URL ?? "#";

export default function HomePage() {
  return (
    <main className="home">
      <header className="nav" id="top">
        <a href="#top" className="logo" aria-label="FlashAlliance">
          FLASHALLIANCE
        </a>

        <nav className="menu" aria-label="Main navigation">
          <a href="#overview">Overview</a>
          <a href="#flow">Flow</a>
          <a href="#surface">Surface</a>
          <a href="#launch">Launch</a>
        </nav>

        <div className="menu-actions">
          <Link href="/docs" className="btn ghost">
            Docs
          </Link>
          <Link href="/dapp" className="btn fire">
            Open dApp
          </Link>
        </div>
      </header>

      <section className="hero" id="overview">
        <HeroWebGL />
        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="micro">Standalone collective NFT dApp</p>
          <h1>
            FLASH
            <br />
            ALLIANCE
            <br />
            CORE FLOW
          </h1>
          <p className="lead">Standalone module for pooled NFT funding and execution.</p>

          <div className="hero-actions">
            <Link href="/dapp/create" className="btn fire large">
              Create Alliance
            </Link>
            <a href="#flow" className="btn ghost large">
              View Mechanics
            </a>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Continuous ticker">
        <div className="ticker-track">
          <div className="ticker-row">
            {tickerItems.map((item) => (
              <span key={`a-${item}`}>{item}</span>
            ))}
          </div>
          <div className="ticker-row" aria-hidden="true">
            {tickerItems.map((item) => (
              <span key={`b-${item}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="flow" id="flow">
        <div className="flow-head">
          <p className="micro">Alliance lifecycle</p>
          <h2>Three states.</h2>
        </div>

        <div className="flow-grid">
          <article>
            <strong>01</strong>
            <h3>Fund</h3>
            <p>ERC20 pooled mission funding.</p>
          </article>
          <article>
            <strong>02</strong>
            <h3>Acquire</h3>
            <p>NFT target execution.</p>
          </article>
          <article>
            <strong>03</strong>
            <h3>Exit</h3>
            <p>Vote and deterministic split.</p>
          </article>
        </div>
      </section>

      <section className="fractional">
        <div className="fractional-head">
          <p className="micro pixel">Fractional NFT focus</p>
          <h2>Buy NFTs in shares. Trade as one team.</h2>
        </div>

        <div className="fractional-grid">
          {showcaseImages.map((item) => (
            <a key={item.title} className="photo-card" href={item.href} target="_blank" rel="noreferrer">
              <img src={item.src} alt={item.title} loading="lazy" />
              <div className="photo-overlay" />
              <div className="photo-copy">
                <p className="pixel">{item.title}</p>
                <span>{item.text}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="fire-stats">
        <div className="stats-head">
          <p className="micro pixel">Numbers</p>
          <h2>High-signal metrics.</h2>
        </div>
        <div className="stats-grid">
          {statItems.map((item) => (
            <article key={item.label}>
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pull-lab" id="pull-lab">
        <div className="pull-head">
          <p className="micro pixel">Pull to reveal</p>
          <h2>Pull tabs for deep info.</h2>
        </div>
        <div className="pull-grid">
          {drawers.map((item) => (
            <details key={item.title} className="pull-drawer">
              <summary>
                <span className="tab pixel">PULL</span>
                <span>{item.title}</span>
              </summary>
              <p>{item.content}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="surface" id="surface">
        <div className="surface-head">
          <p className="micro">Interactive surface</p>
          <h2>Control, preview, launch.</h2>
        </div>

        <div className="surface-grid">
          <div className="stage" role="img" aria-label="Preview stage">
            <div className="coming-wind" />
            <div className="coming-message">
              <p className="pixel">COMING SOON</p>
              <span>Interactive demo console is in active build.</span>
            </div>
          </div>

          <div className="modes">
            <button type="button" className="mode active">
              Fast Funding
            </button>
            <button type="button" className="mode">
              Group Entry
            </button>
            <button type="button" className="mode">
              Exit Guard
            </button>
            <button type="button" className="mode">
              Emergency Path
            </button>
          </div>
        </div>

        <div className="carousel-shell" role="region" aria-label="Feature carousel">
          <div className="carousel-track">
            {surfaceItems.concat(surfaceItems).map((item, idx) => (
              <article key={`${item.title}-${idx}`} className="carousel-item">
                <p className="pixel">{item.title}</p>
                <span>{item.info}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="status" id="launch">
        <p>FLASHALLIANCE = INDEPENDENT PRODUCT</p>
        <p>SEPARATE STANDALONE dApp</p>
      </section>

      <section className="demo-banner">
        <div className="demo-banner-grid">
          <div className="demo-banner-copy">
            <p className="micro pixel">Community Testing Program</p>
            <h3>Demo build. Help us break it and harden it.</h3>
            <p>
              This is <strong>not a cash bug bounty</strong>. Confirmed reports and practical fixes are rewarded in{" "}
              <strong>FATK</strong> for use inside the FlashAlliance ecosystem.
            </p>
            <div className="demo-banner-actions">
              <Link href="/dapp" className="btn fire">
                Test the dApp
              </Link>
              <a href="mailto:av7794257@gmail.com" className="btn ghost">
                Report Issue
              </a>
            </div>
            <div className="demo-banner-links">
              <a href={coreRepoUrl} target="_blank" rel="noreferrer" className="repo-link core">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 .6a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.3c-3.3.7-4-1.4-4-1.4a3.1 3.1 0 0 0-1.3-1.7c-1.1-.8.1-.8.1-.8a2.5 2.5 0 0 1 1.8 1.2 2.6 2.6 0 0 0 3.6 1 2.6 2.6 0 0 1 .8-1.6c-2.6-.3-5.3-1.3-5.3-5.7a4.5 4.5 0 0 1 1.2-3.1 4.2 4.2 0 0 1 .1-3s1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2a4.2 4.2 0 0 1 .1 3 4.5 4.5 0 0 1 1.2 3.1c0 4.4-2.7 5.4-5.3 5.7a2.9 2.9 0 0 1 .8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .6"
                    fill="currentColor"
                  />
                </svg>
                <span>Core Repo</span>
              </a>
              <a href={frontRepoUrl} target="_blank" rel="noreferrer" className="repo-link front">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 .6a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.3c-3.3.7-4-1.4-4-1.4a3.1 3.1 0 0 0-1.3-1.7c-1.1-.8.1-.8.1-.8a2.5 2.5 0 0 1 1.8 1.2 2.6 2.6 0 0 0 3.6 1 2.6 2.6 0 0 1 .8-1.6c-2.6-.3-5.3-1.3-5.3-5.7a4.5 4.5 0 0 1 1.2-3.1 4.2 4.2 0 0 1 .1-3s1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2a4.2 4.2 0 0 1 .1 3 4.5 4.5 0 0 1 1.2 3.1c0 4.4-2.7 5.4-5.3 5.7a2.9 2.9 0 0 1 .8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .6"
                    fill="currentColor"
                  />
                </svg>
                <span>Frontend Repo</span>
              </a>
            </div>
          </div>

          <div className="demo-banner-visual" aria-hidden="true">
            <div className="code-editor-bg">
              <span className="code-line l1" />
              <span className="code-line l2" />
              <span className="code-line l3" />
              <span className="code-line l4" />
              <span className="code-line l5" />
              <span className="code-line l6" />
              <span className="code-caret" />
            </div>
            <div className="report-glyph">
              <span className="glyph-dot d1" />
              <span className="glyph-dot d2" />
              <span className="glyph-dot d3" />
              <span className="glyph-dot d4" />
              <span className="glyph-dot d5" />
              <span className="glyph-dot d6" />
              <span className="glyph-dot d7" />
              <span className="glyph-dot d8" />
              <span className="glyph-dot d9" />
              <span className="glyph-dot d10" />
              <span className="glyph-dot d11" />
              <span className="glyph-dot d12" />
              <span className="glyph-line t" />
              <span className="glyph-line l" />
              <span className="glyph-line r" />
              <span className="glyph-line b" />
              <span className="glyph-line m" />
            </div>
            <div className="help-ribbon">community report stream</div>
          </div>
        </div>
      </section>

      <section className="launch-actions">
        <Link href="/dapp/create" className="btn fire large wide">
          Launch FlashAlliance
        </Link>
        <Link href="/docs" className="btn ghost large wide">
          Integration Docs
        </Link>
        <Link href="/dapp" className="btn ghost large wide">
          Open Sandbox
        </Link>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <h4>FlashAlliance</h4>
          <p>Collective NFT module for tokenized alliance trading.</p>
        </div>

        <div className="footer-col">
          <h5>Product</h5>
          {siteLinks.product.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h5>Ecosystem</h5>
          {siteLinks.ecosystem.map((item) => (
            <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="footer-col">
          <h5>Community</h5>
          {siteLinks.community.map((item) => (
            <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined}>
              {item.label}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
