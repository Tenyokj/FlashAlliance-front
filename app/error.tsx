"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="home" style={{ paddingTop: "40px" }}>
      <section className="dapp-panel">
        <p className="dapp-label">Application Error</p>
        <h2>Something went wrong.</h2>
        <p className="dapp-muted" style={{ marginTop: "10px" }}>
          {error.message}
        </p>
        <button type="button" className="dapp-btn primary" onClick={reset} style={{ marginTop: "16px" }}>
          Try again
        </button>
      </section>
    </main>
  );
}
