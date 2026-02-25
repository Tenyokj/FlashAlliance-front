export default function DocsTokenomicsPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">FATK and Economy</p>
        <h1>Token role, constraints, and practical settlement model</h1>
        <p>
          FATK is a project token with ecosystem utility. It can be used as alliance settlement token only if both sides of an
          OTC trade accept it.
        </p>
      </section>

      <article className="docs-prose">
        <h2 id="fatk-usage">1. What FATK is used for</h2>
        <ul>
          <li>Community testing rewards and contributor incentives.</li>
          <li>Internal campaigns and ecosystem utility flows.</li>
          <li>Alliance settlement only when seller accepts FATK terms.</li>
        </ul>

        <h2 id="fatk-limits">2. What FATK does not guarantee</h2>
        <ul>
          <li>Automatic acceptance by external NFT sellers.</li>
          <li>Automatic liquidity comparable to major stable assets.</li>
          <li>Cash payout semantics for community testing rewards.</li>
        </ul>

        <h2 id="settlement-confusion">3. Why confusion appears in NFT purchase flow</h2>
        <p>
          `buyNFT` in your contract pays seller using the alliance ERC20 token. If alliance token is FATK, seller receives FATK.
          This is contract-defined behavior, not UI convention. Therefore, the settlement token must be selected with seller
          agreement in mind.
        </p>

        <h2 id="token-strategy">4. Recommended strategy by environment</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Environment</th>
              <th>Recommended alliance token</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Local development</td>
              <td>FATK</td>
              <td>Fast bootstrap and deterministic tests.</td>
            </tr>
            <tr>
              <td>Sepolia testing</td>
              <td>Test stable ERC20 or commonly accepted test token</td>
              <td>Closer to realistic settlement expectations.</td>
            </tr>
            <tr>
              <td>Production</td>
              <td>Liquid settlement asset agreed by both parties</td>
              <td>Lower OTC friction and clearer pricing.</td>
            </tr>
          </tbody>
        </table>

        <h2>5. Product-level guidance</h2>
        <p>
          Keep FATK as ecosystem incentive token, but expose settlement token choice explicitly in create flow and documentation.
          This preserves utility while keeping real trading paths practical.
        </p>
      </article>

      <section className="docs-callout plain">
        <h3>Settlement reminder</h3>
        <p>
          In FlashAlliance, gas is paid in native chain token (for example SepoliaETH), but NFT trade settlement is paid in the
          alliance ERC20 token.
        </p>
      </section>
    </div>
  );
}
