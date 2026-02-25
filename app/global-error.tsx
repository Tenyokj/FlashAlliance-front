"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#050505", color: "#fff", fontFamily: "sans-serif" }}>
        <main style={{ maxWidth: "880px", margin: "60px auto", padding: "0 16px" }}>
          <h1 style={{ margin: 0 }}>Critical Error</h1>
          <p style={{ opacity: 0.85 }}>{error.message}</p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 12, borderRadius: 9999, border: "1px solid #ff7f00", background: "#ff7f00", color: "#1a0d00", padding: "10px 14px", cursor: "pointer" }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
