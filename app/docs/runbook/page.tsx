export default function DocsRunbookPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Runbook</p>
        <h1>Error decoding and operator actions</h1>
        <p>Fast map from common revert reason to concrete next action in dApp operations.</p>
      </section>

      <article id="common-reverts" className="docs-prose">
        <h2>1. Common reverts</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Message / Signature</th>
              <th>Meaning</th>
              <th>What to do</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>`Alliance: unsupported token`</td>
              <td>Transfer delta does not match expected amount</td>
              <td>Use standard ERC20 token without fee/rebase side effects</td>
            </tr>
            <tr>
              <td>`Alliance: quorum not reached`</td>
              <td>Current vote weight below threshold</td>
              <td>Collect additional participant votes or adjust proposal flow</td>
            </tr>
            <tr>
              <td>`Alliance: no acquisition proposal`</td>
              <td>Buy called before proposal init</td>
              <td>Run `voteToAcquire` first with valid tuple</td>
            </tr>
            <tr>
              <td>`Alliance: acquisition expired`</td>
              <td>Proposal deadline passed</td>
              <td>Call `resetAcquisitionProposal` then create new proposal</td>
            </tr>
            <tr>
              <td>`Faucet: cooldown active`</td>
              <td>Claim attempted before cooldown ended</td>
              <td>Wait for timer or switch to wallet that is ready</td>
            </tr>
            <tr>
              <td>`0xe450d38c`</td>
              <td>`ERC20InsufficientBalance` on faucet transfer</td>
              <td>Top up faucet liquidity from token owner wallet</td>
            </tr>
            <tr>
              <td>`User rejected` / `4001`</td>
              <td>Wallet signature denied by user</td>
              <td>Resubmit tx and confirm in wallet popup</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article id="ops-checklist" className="docs-prose">
        <h2>2. Operator checklist before public testing</h2>
        <ol>
          <li>Verify network, chainId, and deployed addresses in frontend env.</li>
          <li>Verify faucet token liquidity and cooldown configuration.</li>
          <li>Run full smoke path: create, deposit, acquire vote, buy, sale vote, execute.</li>
          <li>Check Etherscan links from docs and homepage status section.</li>
          <li>Publish changelog and migration notes with each core release.</li>
        </ol>
      </article>
    </div>
  );
}
