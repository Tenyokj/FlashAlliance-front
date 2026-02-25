export default function DocsRoadmapPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Roadmap</p>
        <h1>Planned product milestones</h1>
        <p>This roadmap describes the current direction and priorities for FlashAlliance.</p>
      </section>

      <article className="docs-prose">
        <h2 id="phase-a">Phase A: Core Stability</h2>
        <ul>
          <li>End-to-end alliance lifecycle validation and state guards.</li>
          <li>Reliable transaction pre-checks and clearer user errors.</li>
          <li>Community testing program with FATK rewards.</li>
        </ul>

        <h2 id="phase-b">Phase B: Integration Hardening</h2>
        <ul>
          <li>Richer settlement token strategy per network.</li>
          <li>Improved docs and troubleshooting coverage.</li>
          <li>Automation scripts for repeatable QA and smoke tests.</li>
        </ul>

        <h2 id="phase-c">Phase C: Production Readiness</h2>
        <ul>
          <li>Operational monitoring and incident process.</li>
          <li>Expanded audit and formal security practices.</li>
          <li>Partner onboarding and external integration support.</li>
        </ul>
      </article>
    </div>
  );
}
