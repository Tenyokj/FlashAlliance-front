import Link from "next/link";

const releaseDate = process.env.NEXT_PUBLIC_RELEASE_DATE ?? "2026-03-04";
const coreVersion = process.env.NEXT_PUBLIC_CORE_VERSION ?? "v1.0.0";
const chainId = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111", 10);

export default function DocsReleasePage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Release</p>
        <h1>Release readiness and go-live gates</h1>
        <p>
          Single operational page to decide if FlashAlliance frontend is ready for public release, based on hard technical
          gates and rollout controls.
        </p>
      </section>

      <article id="release-readiness" className="docs-prose">
        <h2>1. Current release snapshot</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Release date</td>
              <td>{releaseDate}</td>
            </tr>
            <tr>
              <td>Core version</td>
              <td>{coreVersion}</td>
            </tr>
            <tr>
              <td>Target network</td>
              <td>Sepolia (chainId {chainId})</td>
            </tr>
            <tr>
              <td>Release mode</td>
              <td>Public demo / testnet production-like validation</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article id="qa-gates" className="docs-prose">
        <h2>2. QA and user-flow gates</h2>
        <ol>
          <li>Wallet connect and network switch verified on desktop + mobile wallet browser.</li>
          <li>Create alliance flow verified with valid and invalid participant/share payloads.</li>
          <li>Funding path verified: approve, deposit, progress indicators, remaining calculations.</li>
          <li>Acquisition governance path verified: `voteToAcquire` then `buyNFT` execution only after quorum.</li>
          <li>Sale flow verified: vote sale, execute sale, proceeds split/claim path.</li>
          <li>Refund path verified under failed funding, including pause interaction behavior.</li>
          <li>Error states verified: wrong network, wallet reject, RPC 429, stale address mismatch.</li>
        </ol>
      </article>

      <article id="quality-gates" className="docs-prose">
        <h2>3. Quality gates before publish</h2>
        <ul>
          <li>`next build` succeeds without type/runtime errors.</li>
          <li>ESLint passes for app and integration surfaces.</li>
          <li>Environment variables audited and synchronized with deployments page.</li>
          <li>Docs updated in same release (deployments, assumptions, runbook, changelog).</li>
          <li>RPC fallback URLs configured to reduce single-provider downtime risk.</li>
          <li>Explorer links from homepage and docs verified manually.</li>
        </ul>
      </article>

      <article id="security-legal" className="docs-prose">
        <h2>4. Security and policy gates</h2>
        <ul>
          <li>Trust assumptions are published clearly on homepage/docs.</li>
          <li>Known limitations are published (unsupported token mechanics, faucet cooldown, NFT approval preconditions).</li>
          <li>Rules of use, reporting path, and security contacts are published.</li>
          <li>No private keys, RPC secrets, or local-only values are committed in public repository.</li>
        </ul>
      </article>

      <section className="docs-callout plain">
        <h3>Go / No-Go rule</h3>
        <p>
          If any critical flow or quality gate fails, release status is <strong>No-Go</strong> until issue is fixed and
          re-validated with new build artifacts.
        </p>
        <p>
          Before publish, review repository root documents: <code>RELEASE_CHECKLIST.md</code> and{" "}
          <code>OPEN_SOURCE_MANIFEST.md</code>.
        </p>
        <p>
          For live deployment metadata, verify <Link href="/docs/deployments">Deployments</Link>.
        </p>
      </section>
    </div>
  );
}
