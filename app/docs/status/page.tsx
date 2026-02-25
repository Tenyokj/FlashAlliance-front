export default function DocsStatusPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Status</p>
        <h1>Current operational status</h1>
        <p>FlashAlliance is in active demo/community testing mode.</p>
      </section>

      <article className="docs-prose">
        <h2 id="network-release">Network and release status</h2>
        <ul>
          <li>Local development: active and supported.</li>
          <li>Public test usage: active with community feedback loop.</li>
          <li>Main production rollout: planned after stability and review milestones.</li>
        </ul>

        <h2 id="known-constraints">Known constraints</h2>
        <ul>
          <li>Local chain reset requires redeploy and env refresh.</li>
          <li>Settlement token acceptance depends on seller agreement.</li>
          <li>Some routes are still optimized based on testing feedback.</li>
        </ul>
      </article>
    </div>
  );
}
