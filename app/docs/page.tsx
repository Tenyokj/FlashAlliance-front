import Link from "next/link";

const coreRepo = process.env.NEXT_PUBLIC_CORE_REPO_URL ?? "#";
const frontRepo = process.env.NEXT_PUBLIC_FRONT_REPO_URL ?? "#";

export default function DocsOverviewPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Documentation</p>
        <h1>FlashAlliance User Handbook</h1>
        <p>
          This section explains how FlashAlliance works in practice: what users should prepare before transactions, what FATK
          is responsible for, how states restrict actions, and why some flows fail when preconditions are not satisfied.
        </p>
      </section>

      <section id="navigation" className="docs-toc">
        <h2>Navigation</h2>
        <ul>
          <li><Link href="/docs/tokenomics">FATK and Economy</Link> for settlement logic and realistic token strategy.</li>
          <li><Link href="/docs/how-it-works">How It Works</Link> for lifecycle states and contract action gates.</li>
          <li><Link href="/docs/testing">Testing Guide</Link> for local bootstrap and repeatable QA workflow.</li>
          <li><Link href="/docs/rules">Rules of Use</Link> for reporting format and reward policy.</li>
          <li><Link href="/docs/faq">FAQ</Link> for common confusion points.</li>
          <li><Link href="/docs/risk">Risk Disclosure</Link> for user-facing constraints and warnings.</li>
        </ul>
      </section>

      <article className="docs-prose">
        <h2 id="what-is">1. What FlashAlliance is</h2>
        <p>
          FlashAlliance is a pooled NFT execution module. A fixed participant set funds an alliance, performs NFT acquisition,
          and later votes sale parameters. Ownership outcomes are split according to fixed shares configured on alliance
          creation. Every alliance is isolated and controlled by local contract state.
        </p>
        <p>
          The product is intentionally strict. Users cannot bypass state requirements in UI if contract preconditions are not
          met. This is why some errors look repetitive: the contract guards are working as intended.
        </p>

        <h2 id="quick-start">2. Quick start for new users</h2>
        <ol>
          <li>Open `dApp` and connect wallet.</li>
          <li>Verify current network and factory address.</li>
          <li>Open alliance page and check current state banner.</li>
          <li>If state is `Funding`, run `Approve` then `Deposit`.</li>
          <li>If state is `Acquired`, continue with voting and sale controls.</li>
          <li>If state is `Closed`, only allowed terminal actions remain.</li>
        </ol>

        <h2 id="official-links">3. Official resources</h2>
        <ul>
          <li><a href={coreRepo} target="_blank" rel="noreferrer">Core repository</a> for contracts and protocol rules.</li>
          <li><a href={frontRepo} target="_blank" rel="noreferrer">Frontend repository</a> for UI and integration logic.</li>
          <li><a href="mailto:av7794257@gmail.com">Security and issue reporting</a> for private bug reports.</li>
        </ul>
      </article>

      <section className="docs-callout plain">
        <h3>Important</h3>
        <p>
          Demo mode is active. Reports and useful fixes can be rewarded in FATK. This is not a default cash bug bounty unless
          explicitly announced.
        </p>
      </section>
    </div>
  );
}
