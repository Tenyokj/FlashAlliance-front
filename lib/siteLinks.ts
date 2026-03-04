export const siteLinks = {
  product: [
    { label: "Open dApp", href: "/dapp" },
    { label: "Create Alliance", href: "/dapp/create" },
    { label: "FAQ", href: "/faq" },
    { label: "Sepolia Guide", href: "/sepolia-guide" },
    { label: "Docs", href: "/docs" },
    { label: "Roadmap", href: "/docs/roadmap" }
  ],
  ecosystem: [
    { label: "Protocol Repo", href: process.env.NEXT_PUBLIC_CORE_REPO_URL ?? "https://github.com/Tenyokj/FlashAlliance" },
    {
      label: "Contracts",
      href:
        process.env.NEXT_PUBLIC_CONTRACTS_URL ??
        "https://github.com/Tenyokj/FlashAlliance/blob/main/docs/CONTRACTS.md"
    },
    { label: "Status", href: "/docs/status" }
  ],
  community: [
    { label: "Reddit", href: process.env.NEXT_PUBLIC_REDDIT_URL ?? "https://www.reddit.com/user/PralineSeparate5261" },
    { label: "GitHub", href: "https://github.com/Tenyokj" },
    { label: "Contact", href: process.env.NEXT_PUBLIC_CONTACT_URL ?? "mailto:av7794257@gmail.com" },
    { label: "Privacy Notice", href: "/privacy-notice" },
    { label: "Terms of Use", href: "/terms-of-use" }
  ]
} as const;
