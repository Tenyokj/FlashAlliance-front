export default function DocsHowItWorksPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">How It Works</p>
        <h1>Lifecycle, permissions, and execution rules</h1>
        <p>
          Every alliance follows a strict finite-state model. You cannot perform actions from the wrong state even if UI still
          shows inputs.
        </p>
      </section>

      <section id="states" className="docs-steps">
        <article>
          <h3>State: Funding</h3>
          <p>Participants deposit ERC20 until target is reached or deadline expires.</p>
          <ul>
            <li>Allowed: `deposit`, `cancelFunding`</li>
            <li>Blocked: sale voting and emergency withdrawal actions</li>
            <li>Key checks: participant role, allowance, remaining target, funding deadline</li>
          </ul>
        </article>

        <article>
          <h3>State: Acquired</h3>
          <p>Alliance holds NFT and governance actions are open.</p>
          <ul>
            <li>Allowed: `voteToSell`, `resetSaleProposal`, `executeSale`, `voteEmergencyWithdraw`, `emergencyWithdrawNFT`</li>
            <li>Blocked: `deposit`, `cancelFunding`</li>
            <li>Key checks: vote quorum, sale deadline, proposal consistency</li>
          </ul>
        </article>

        <article>
          <h3>State: Closed</h3>
          <p>Terminal state after sale execution, emergency withdrawal, or failed funding closure.</p>
          <ul>
            <li>Allowed conditionally: `withdrawRefund` only if funding failure path was activated</li>
            <li>No transition back to Funding</li>
          </ul>
        </article>
      </section>

      <article className="docs-prose">
        <h2 id="roles">Role model</h2>
        <ul>
          <li>Participant: funding and governance actions.</li>
          <li>Owner: pause/unpause administration.</li>
          <li>Non-participant: read-only access.</li>
        </ul>

        <h2 id="errors">Common action failures and meaning</h2>
        <ul>
          <li>`alliance is not in Funding state`: current state is Acquired or Closed.</li>
          <li>`amount exceeds remaining target`: target already reached.</li>
          <li>`only participant`: wallet is not in participant list.</li>
          <li>`seller not owner` or transfer failures: wrong seller/NFT approval context.</li>
        </ul>

        <h2 id="ops">Operational best practices</h2>
        <ol>
          <li>Always read state and remaining target before signing transactions.</li>
          <li>Use one test wallet per role during QA to avoid accidental cross-role confusion.</li>
          <li>Treat Hardhat restart as full chain reset and redeploy immediately.</li>
        </ol>
      </article>
    </div>
  );
}
