export default function DocsFaqPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">FAQ</p>
        <h1>Common questions and direct answers</h1>
        <p>This page resolves practical confusion points seen during onboarding and testing.</p>
      </section>

      <section id="faq-top" className="docs-faq">
        <article>
          <h3>Why does deposit fail if I have tokens?</h3>
          <p>
            Typical reasons: wallet is not participant, alliance is not in Funding state, allowance is below deposit amount, or
            remaining target is already zero.
          </p>
        </article>

        <article>
          <h3>Can I move alliance from Closed back to Funding?</h3>
          <p>No. Lifecycle is one-way by contract design.</p>
        </article>

        <article>
          <h3>Can I buy random internet NFT in local tests?</h3>
          <p>
            No. For local chain tests you need NFT contract deployed on the same network, correct owner address, and explicit
            approval for alliance contract.
          </p>
        </article>

        <article>
          <h3>Is FATK the same as gas token?</h3>
          <p>
            No. Gas is paid in native network token (for example SepoliaETH). FATK is ERC20 used by alliance economics and
            reward logic.
          </p>
        </article>

        <article>
          <h3>Why factory call returns no data after restart?</h3>
          <p>
            Local chain was reset. Redeploy contracts and refresh frontend env addresses before opening dApp pages again.
          </p>
        </article>
      </section>
    </div>
  );
}
