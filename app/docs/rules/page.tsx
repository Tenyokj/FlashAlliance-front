export default function DocsRulesPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Rules of Use</p>
        <h1>FlashAlliance Usage Rules</h1>
        <p>
          These rules define how to use FlashAlliance demo environments, how to report issues correctly, and how FATK-based
          rewards are handled for community contributions.
        </p>
      </section>

      <article className="docs-prose">
        <h2 id="acceptance">1. Acceptance</h2>
        <p>
          By using the frontend or demo dApp routes, you agree that test deployments can be reset, addresses can change, and
          test balances can be invalidated at any time without notice.
        </p>

        <h2 id="user-obligations">2. User Obligations</h2>
        <ul>
          <li>Use only wallets intended for testing.</li>
          <li>Do not treat demo data as production financial advice.</li>
          <li>Validate contract addresses before sending approvals or transactions.</li>
          <li>Never share seed phrases or private keys with project team members.</li>
        </ul>

        <h2 id="reporting">3. Reporting Rules</h2>
        <p>
          Reports must include exact reproduction steps, expected behavior, actual behavior, network name, wallet address,
          alliance address, and transaction hash (if present). Incomplete reports can be rejected.
        </p>
        <p>
          For responsible disclosure and template format, use `SECURITY.md` and `REPORTING.md` in the frontend repository.
        </p>

        <h2 id="reward-policy">4. Reward Policy</h2>
        <p>
          Community rewards in current demo cycles are FATK-denominated unless explicitly announced otherwise. This is not an
          automatic fiat bug bounty program.
        </p>
        <p>
          Reward amount is discretionary and depends on impact, reproducibility, and quality of the proposed fix.
        </p>
      </article>
    </div>
  );
}
