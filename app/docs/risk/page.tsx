export default function DocsRiskPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Risk Disclosure</p>
        <h1>Operational and user-level risk notes</h1>
        <p>These points should be communicated clearly to anyone interacting with demo or production instances.</p>
      </section>

      <article className="docs-prose">
        <h2 id="risk-smart-contract">1. Smart-contract execution risk</h2>
        <p>
          Contract logic is deterministic but user actions are irreversible once confirmed on-chain. Incorrect role, token,
          seller address, or state assumptions can lead to failed transactions and gas costs.
        </p>

        <h2 id="risk-token-acceptance">2. Token acceptance risk</h2>
        <p>
          Alliance settlement token is fixed per alliance. If seller does not accept that token, acquisition flow cannot be
          executed.
        </p>

        <h2 id="risk-network">3. Testnet and local network limitations</h2>
        <ul>
          <li>Local chain resets wipe all deployed contracts and balances.</li>
          <li>Testnet liquidity and NFT availability may not reflect production behavior.</li>
          <li>Market pricing on test assets can be unrealistic or stale.</li>
        </ul>

        <h2 id="risk-frontend-copy">4. Frontend copy risk</h2>
        <p>
          Frontend code can be forked by third parties. Users should verify official domain, official repository links, and
          contract addresses before signing transactions.
        </p>

        <h2>5. Demo mode notice</h2>
        <p>
          If demo mode is active, platform behavior may change quickly and some routes may be experimental. Always read latest
          docs and release notes.
        </p>
      </article>

      <section className="docs-callout plain">
        <h3>Minimum user warning text</h3>
        <p>
          Use only funds you can risk in testing. Verify state, token, and addresses before each signature. Demo rewards in FATK
          are ecosystem incentives, not guaranteed cash payouts.
        </p>
      </section>
    </div>
  );
}
