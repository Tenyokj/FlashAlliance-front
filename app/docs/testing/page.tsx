export default function DocsTestingPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Testing Guide</p>
        <h1>Repeatable QA without manual setup fatigue</h1>
        <p>Use automated local bootstrap and fixed role wallets. Avoid ad-hoc manual deployment loops.</p>
      </section>

      <article className="docs-prose">
        <h2 id="baseline">1. Baseline workflow</h2>
        <ol>
          <li>Run local chain: <code>npx hardhat node</code>.</li>
          <li>Run bootstrap: <code>npx hardhat run scripts/deploy/bootstrap-local.ts --network localhost</code>.</li>
          <li>Restart Next dev server to reload <code>NEXT_PUBLIC_*</code> values.</li>
          <li>Open latest alliance from `/dapp/alliances`.</li>
        </ol>

        <h2 id="roles">2. Wallet role mapping (bootstrap defaults)</h2>
        <ul>
          <li>Deployer/owner: signer #0</li>
          <li>Participants: signer #1, #2, #3</li>
          <li>NFT seller: signer #4</li>
        </ul>

        <h2 id="matrix">3. Suggested test matrix</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Positive path</th>
              <th>Negative path</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Funding</td>
              <td>approve + deposit by participant</td>
              <td>wrong wallet, over target, post-deadline deposit</td>
            </tr>
            <tr>
              <td>NFT Buy</td>
              <td>seller owns token and approved alliance</td>
              <td>wrong seller, no approval, wrong token id</td>
            </tr>
            <tr>
              <td>Governance</td>
              <td>proposal vote and execute sale</td>
              <td>deadline mismatch, insufficient quorum</td>
            </tr>
            <tr>
              <td>Emergency</td>
              <td>vote and emergency withdrawal flow</td>
              <td>insufficient emergency quorum</td>
            </tr>
          </tbody>
        </table>

        <h2 id="restart-trap">4. Known local trap</h2>
        <p>
          Hardhat local chain resets on node restart. Any previously printed factory/token/alliance address becomes invalid and
          must be replaced by newly deployed values.
        </p>
      </article>

      <section className="docs-callout plain">
        <h3>Public testing notice text</h3>
        <p>
          Demo version. Community testing is active. Reports and useful fixes are rewarded in FATK. This is not a default cash
          bug bounty.
        </p>
      </section>
    </div>
  );
}
