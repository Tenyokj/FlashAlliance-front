export default function DocsRepositoryPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Repository</p>
        <h1>Open-source publication scope</h1>
        <p>What should be included in public frontend repository and what must be excluded before publish.</p>
      </section>

      <article id="repo-include" className="docs-prose">
        <h2>1. Include in public repository</h2>
        <ul>
          <li>`app/` routes, components, and styles.</li>
          <li>`lib/` dApp integration helpers and contract bindings.</li>
          <li>`public/` required frontend assets.</li>
          <li>`README.md`, `RELEASE_CHECKLIST.md`, `OPEN_SOURCE_MANIFEST.md`.</li>
          <li>Policy docs: `SECURITY.md`, `REPORTING.md`, `RULES_OF_USE.md`.</li>
          <li>Build config: `package.json`, lockfile, TypeScript and Next config files.</li>
          <li>Safe template env: `.env.example`.</li>
        </ul>
      </article>

      <article id="repo-exclude" className="docs-prose">
        <h2>2. Exclude from public repository</h2>
        <ul>
          <li>`.env` and any environment file with secrets/tokens.</li>
          <li>Build outputs (`.next/`, coverage, local artifacts).</li>
          <li>`node_modules/` and temporary local files.</li>
          <li>Private deployment logs containing sensitive values.</li>
          <li>Local-only folders not intended for frontend repo scope.</li>
        </ul>
      </article>

      <section className="docs-callout plain">
        <h3>Publishing order</h3>
        <p>1) Verify env hygiene, 2) pass build gates, 3) update docs, 4) publish from clean branch.</p>
      </section>
    </div>
  );
}
