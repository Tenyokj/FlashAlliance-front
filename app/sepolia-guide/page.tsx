import Link from "next/link";
import CopyIconButton from "@/app/components/CopyIconButton";
import SiteFooter from "@/app/components/SiteFooter";

type GuideStep = {
  id: string;
  title: string;
  goal: string;
  whatToCheck: string[];
  note: string;
  image: string;
};

const chainId = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111", 10);
const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS ?? "0x0000000000000000000000000000000000000000";
const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "0x0000000000000000000000000000000000000000";
const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS ?? "0x0000000000000000000000000000000000000000";
const tokenSymbol = process.env.NEXT_PUBLIC_TOKEN_SYMBOL ?? "FATK";
const tokenDecimals = Number.parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS ?? "18", 10);
const explorerBase = chainId === 11155111 ? "https://sepolia.etherscan.io/address/" : "https://etherscan.io/address/";

const steps: GuideStep[] = [
  {
    id: "eth",
    title: "Get Sepolia ETH",
    goal: "Fund wallet with Sepolia ETH to pay gas for all write transactions.",
    whatToCheck: [
      "Wallet network is set to Sepolia.",
      "Address copied correctly before faucet request.",
      "Transaction funding appears in wallet after faucet response."
    ],
    note: "If one faucet rate-limits, retry later or use an alternative faucet.",
    image: "/sepolia_faucet_guide.png"
  },
  {
    id: "token",
    title: `Add ${tokenSymbol} to MetaMask`,
    goal: "Import token contract manually so balances and transfers are visible.",
    whatToCheck: [
      "Token address pasted exactly.",
      `Token symbol set to ${tokenSymbol}.`,
      `Token decimals set to ${tokenDecimals}.`
    ],
    note: "If values look wrong, remove token from wallet list and re-import.",
    image: "/sepolia_fatk_guide.png"
  },
  {
    id: "action",
    title: "Run one real dApp transaction",
    goal: "Validate full path: connect wallet, sign transaction, confirm on explorer.",
    whatToCheck: [
      "Connected account is expected signer.",
      "MetaMask confirmation window shows Sepolia.",
      "Final tx hash resolves on Etherscan with success status."
    ],
    note: "For first test, use faucet claim or a low-risk dApp action.",
    image: "/sepolia_gas.png"
  }
];

export default function SepoliaGuidePage() {
  return (
    <main className="guide-shell">
      <div className="guide-ambient" aria-hidden="true" />
      <header className="guide-topbar">
        <Link href="/" className="guide-logo">
          FLASHALLIANCE
        </Link>

        <nav className="guide-nav" aria-label="Guide navigation">
          <Link href="/">Home</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/docs/deployments">Deployments</Link>
          <Link href="/dapp">Open dApp</Link>
        </nav>

        <div className="guide-actions">
          <Link href="/faq" className="btn ghost">
            Open FAQ
          </Link>
          <Link href="/dapp" className="btn fire">
            Launch App
          </Link>
        </div>
      </header>

      <section className="guide-hero single">
        <div>
          <p className="micro pixel">Sepolia onboarding</p>
          <h1>MetaMask + Gas + Token Setup</h1>
          <p>
            Practical onboarding for FlashAlliance on Sepolia. This page focuses on wallet wiring, gas expectations, and token import
            sanity checks before real testing.
          </p>
        </div>
      </section>

      <section className="guide-rules">
        <h2>Core Rules</h2>
        <div className="guide-rule-grid">
          <article>
            <strong>Network</strong>
            <p>
              Use chainId <code>{chainId}</code> (Sepolia).
            </p>
          </article>
          <article>
            <strong>Gas token</strong>
            <p>All write tx gas is paid in Sepolia ETH.</p>
          </article>
          <article>
            <strong>Protocol token</strong>
            <p>
              {tokenSymbol} is used by app mechanics, not as native gas.
            </p>
          </article>
          <article>
            <strong>Safety</strong>
            <p>Use test funds only and verify contract addresses before importing token.</p>
          </article>
        </div>
      </section>

      <section className="guide-contracts">
        <h2>Live Contracts</h2>
        <div className="live-net-grid">
          <article className="live-card">
            <p className="live-label pixel">Factory</p>
            <div className="address-row">
              <p className="live-address">{factoryAddress}</p>
              <CopyIconButton value={factoryAddress} />
            </div>
            <p>Creates new alliance instances.</p>
            <a href={`${explorerBase}${factoryAddress}`} target="_blank" rel="noreferrer" className="btn ghost">
              View on Etherscan
            </a>
          </article>
          <article className="live-card">
            <p className="live-label pixel">FATK Token</p>
            <div className="address-row">
              <p className="live-address">{tokenAddress}</p>
              <CopyIconButton value={tokenAddress} />
            </div>
            <p>Settlement and funding token.</p>
            <a href={`${explorerBase}${tokenAddress}`} target="_blank" rel="noreferrer" className="btn ghost">
              View on Etherscan
            </a>
          </article>
          <article className="live-card">
            <p className="live-label pixel">Faucet</p>
            <div className="address-row">
              <p className="live-address">{faucetAddress}</p>
              <CopyIconButton value={faucetAddress} />
            </div>
            <p>Test token distribution with cooldown.</p>
            <a href={`${explorerBase}${faucetAddress}`} target="_blank" rel="noreferrer" className="btn ghost">
              View on Etherscan
            </a>
          </article>
        </div>
      </section>

      <section className="guide-steps">
        {steps.map((step, index) => (
          <article key={step.id} className="guide-step">
            <div className="guide-step-head">
              <span>{`0${index + 1}`}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.goal}</p>
              </div>
            </div>

            <div className="guide-step-grid">
              <div className="guide-slot">
                <img src={step.image} alt={`${step.title} screenshot`} loading="lazy" />
              </div>
              <div className="guide-step-body under-image">
                <h4>Checklist</h4>
                <ul>
                  {step.whatToCheck.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className="guide-note">{step.note}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="guide-troubles">
        <h2>Quick Troubleshooting</h2>
        <div className="guide-troubles-grid">
          <article>
            <strong>RPC 429 / rate limit</strong>
            <p>Switch to fallback RPC endpoint and reduce aggressive polling.</p>
          </article>
          <article>
            <strong>Wrong network errors</strong>
            <p>Confirm wallet is on Sepolia and frontend chain config matches chainId.</p>
          </article>
          <article>
            <strong>User rejected request</strong>
            <p>MetaMask signature was denied. Re-open action and confirm transaction explicitly.</p>
          </article>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
