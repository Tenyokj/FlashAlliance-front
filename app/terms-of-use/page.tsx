import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <main className="docs-shell">
      <div className="docs-page">
        <section className="docs-hero plain">
          <p className="docs-kicker">Legal</p>
          <h1>Terms of Use</h1>
          <p>
            FlashAlliance frontend is provided for testnet and educational usage. By using this application, you accept
            responsibility for your own transactions and wallet security decisions.
          </p>
        </section>

        <article className="docs-prose">
          <h2>1. Scope</h2>
          <p>
            This interface is an access layer to blockchain contracts. Blockchain transactions are final and cannot be
            reversed by frontend operators.
          </p>

          <h2>2. User responsibilities</h2>
          <ul>
            <li>Verify network, contract addresses, and transaction details before signing.</li>
            <li>Use only wallets and keys you control securely.</li>
            <li>Do not rely on this testnet environment for production-value assets.</li>
          </ul>

          <h2>3. Risk disclosure</h2>
          <p>
            Smart-contract and network risks exist. Offchain coordination with NFT sellers is outside direct onchain
            enforcement until transaction execution.
          </p>

          <h2>4. No financial advice</h2>
          <p>All materials are informational and technical only, not legal, investment, or financial advice.</p>
        </article>

        <section className="docs-callout plain">
          <h3>Canonical references</h3>
          <p>
            Read <Link href="/docs/assumptions">Assumptions</Link>, <Link href="/docs/risk">Risk</Link>, and{" "}
            <Link href="/docs/runbook">Runbook</Link> before interacting with contracts.
          </p>
        </section>
      </div>
    </main>
  );
}
