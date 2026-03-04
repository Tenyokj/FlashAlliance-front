const releaseDate = process.env.NEXT_PUBLIC_RELEASE_DATE ?? "2026-03-03";

export default function DocsChangelogPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Changelog</p>
        <h1>Core and frontend release notes</h1>
        <p>Canonical summary of protocol changes and required frontend migration actions.</p>
      </section>

      <article id="release-2026-03" className="docs-prose">
        <h2>Release {releaseDate}: acquisition-governance hardening</h2>
        <ul>
          <li>Added separate governance phase for NFT purchase (`voteToAcquire`).</li>
          <li>Bound acquisition to strict tuple: NFT, tokenId, seller, price, deadline.</li>
          <li>Added acquisition proposal reset flow (`resetAcquisitionProposal`).</li>
          <li>Updated `buyNFT()` to execution-only path after approved proposal.</li>
          <li>Made `withdrawRefund()` available without pause gate in failed funding closure.</li>
          <li>Added transfer-delta checks to protect against unsupported token mechanics.</li>
        </ul>
      </article>

      <article id="frontend-migration" className="docs-prose">
        <h2>Frontend migration notes</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Change</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ABI</td>
              <td>Added acquisition methods + updated `buyNFT()` signature</td>
              <td>Done</td>
            </tr>
            <tr>
              <td>Alliance page UI</td>
              <td>Replaced direct buy form with acquisition governance controls</td>
              <td>Done</td>
            </tr>
            <tr>
              <td>Network handling</td>
              <td>Switched wallet/client to env-driven chain config</td>
              <td>Done</td>
            </tr>
            <tr>
              <td>Faucet tx gas</td>
              <td>Added explicit gas estimation with cap</td>
              <td>Done</td>
            </tr>
            <tr>
              <td>Error UX</td>
              <td>Added human-readable mapping for wallet rejection and faucet liquidity errors</td>
              <td>Done</td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
  );
}
