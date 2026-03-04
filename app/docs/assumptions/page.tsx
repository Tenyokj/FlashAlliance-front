export default function DocsAssumptionsPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Assumptions</p>
        <h1>Security model and practical limits</h1>
        <p>Clear boundary between what contracts guarantee and what still depends on user coordination.</p>
      </section>

      <article id="security-assumptions" className="docs-prose">
        <h2>1. Security assumptions</h2>
        <ul>
          <li>Participant funds are held by contract logic, not a single operator wallet.</li>
          <li>Acquisition and sale actions are gated by state and quorum checks.</li>
          <li>Proposal tuple checks prevent parameter drift between voting and execution.</li>
          <li>Transfer accounting rejects unsupported token mechanics that break invariants.</li>
          <li>Onchain events provide auditability for deposits, votes, and execution outcomes.</li>
        </ul>

        <h2>2. What contracts do not guarantee</h2>
        <ul>
          <li>OTC seller behavior offchain is not enforced by protocol until execution transaction.</li>
          <li>NFT approval and ownership can change before buy execution and cause revert.</li>
          <li>Testnet liquidity, price discovery, and external market depth are not guaranteed.</li>
          <li>Frontend forks or spoofed domains can mislead users if URLs are not verified.</li>
        </ul>
      </article>

      <article id="known-limitations" className="docs-prose">
        <h2>3. Known limitations</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Limitation</th>
              <th>Operational impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Faucet</td>
              <td>Per-wallet cooldown + finite faucet liquidity</td>
              <td>Users may need wait period or operator top-up</td>
            </tr>
            <tr>
              <td>Token support</td>
              <td>Fee/rebase or non-standard transfer tokens are rejected</td>
              <td>Only standard ERC20 behavior is accepted</td>
            </tr>
            <tr>
              <td>Pause behavior</td>
              <td>Most operational paths are pause-guarded</td>
              <td>Execution flow can be frozen by admin action</td>
            </tr>
            <tr>
              <td>Refund path</td>
              <td>`withdrawRefund` remains available after failed funding even during pause</td>
              <td>Participants can still exit failed fundraise safely</td>
            </tr>
            <tr>
              <td>NFT transfer preconditions</td>
              <td>Seller must still own token and approve transfer at execution time</td>
              <td>Acquisition may revert if preconditions changed</td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
  );
}
