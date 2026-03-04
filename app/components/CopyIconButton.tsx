"use client";

import { useState } from "react";

type Props = {
  value: string;
  label?: string;
};

export default function CopyIconButton({ value, label = "Copy address" }: Props) {
  const [copied, setCopied] = useState(false);
  const [bubble, setBubble] = useState<{ x: number; y: number; id: number } | null>(null);

  async function writeClipboard(text: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!ok) {
      throw new Error("copy failed");
    }
  }

  async function onCopy() {
    try {
      await writeClipboard(value);
      setCopied(true);
      const x = Math.floor(40 + Math.random() * Math.max(60, window.innerWidth - 140));
      const y = Math.floor(80 + Math.random() * Math.max(80, window.innerHeight - 220));
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setBubble({ x, y, id });
      window.setTimeout(() => setCopied(false), 1000);
      window.setTimeout(() => {
        setBubble((current) => (current?.id === id ? null : current));
      }, 1450);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button type="button" className={`copy-icon-btn ${copied ? "copied" : ""}`} onClick={onCopy} aria-label={label} title={label}>
        {copied ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 7 10 17l-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M5 15V5h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
      {bubble ? (
        <span className="copy-bubble pixel" style={{ left: `${bubble.x}px`, top: `${bubble.y}px` }}>
          copied
        </span>
      ) : null}
    </>
  );
}
