# FlashAlliance Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Network](https://img.shields.io/badge/Network-Sepolia-7c3aed)](https://sepolia.etherscan.io/)
[![License](https://img.shields.io/badge/License-MIT-22c55e)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Demo%20%2F%20Testnet-f97316)](#)
[![Frontend Repo](https://img.shields.io/badge/Repo-Frontend-111827?logo=github)](https://github.com/Tenyokj/FlashAlliance-front)
[![Core Repo](https://img.shields.io/badge/Repo-Core-0f172a?logo=github)](https://github.com/Tenyokj/FlashAlliance)

![FLA-logo](/public/flash-asset.png)

Frontend for FlashAlliance standalone dApp (Next.js App Router): collective NFT funding, acquisition governance, and deterministic split flows.

## Links
- Website: `https://flash-alliances.vercel.app` (replace with your production domain)
- Core contracts repo: https://github.com/Tenyokj/FlashAlliance
- Core contracts docs: https://github.com/Tenyokj/FlashAlliance/blob/main/docs/CONTRACTS.md

## Key Features
- Marketing + onboarding pages: `/`, `/faq`, `/sepolia-guide`
- dApp surfaces: `/dapp`, `/dapp/create`, `/dapp/alliances`, `/dapp/alliance/[address]`
- Docs system: deployments, assumptions, runbook, changelog, release readiness
- RPC fallback handling and readable wallet/RPC errors
- Live contract address visibility with copy controls and explorer links

## Tech Stack
- Next.js 16
- React 19
- TypeScript
- viem
- Optional subgraph (`graph/`) with RPC fallback behavior

## Quick Start
```bash
npm install
npm run dev
```

Production build:
```bash
npm run build
npm run start
```

## Environment Variables
Use `.env` locally and keep it out of git. Use `.env.example` as template.

```env
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_RPC_FALLBACK_URLS=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_CHAIN_NAME=
NEXT_PUBLIC_SUBGRAPH_URL=

NEXT_PUBLIC_FACTORY_ADDRESS=
NEXT_PUBLIC_TOKEN_ADDRESS=
NEXT_PUBLIC_FAUCET_ADDRESS=

NEXT_PUBLIC_TOKEN_SYMBOL=FATK
NEXT_PUBLIC_TOKEN_DECIMALS=18
NEXT_PUBLIC_PROTOCOL_ADMIN=
NEXT_PUBLIC_DEPLOYMENT_DATE=
NEXT_PUBLIC_CORE_VERSION=
NEXT_PUBLIC_RELEASE_DATE=

NEXT_PUBLIC_CORE_REPO_URL=
NEXT_PUBLIC_FRONT_REPO_URL=
NEXT_PUBLIC_CONTRACTS_URL=
NEXT_PUBLIC_REDDIT_URL=
NEXT_PUBLIC_CONTACT_URL=
```

Template: [.env.example](.env.example)

## Release & Publish Checklist
- `next build` succeeds
- Deployments page matches onchain addresses
- Docs pages updated in same release
- Critical QA flow passed: create -> deposit -> voteToAcquire -> buy -> sale/claim/refund
- Error UX checked: wrong network, wallet reject, stale addresses, RPC 429

Release docs:
- [app/docs/release/page.tsx](app/docs/release/page.tsx)
- [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)
- [OPEN_SOURCE_MANIFEST.md](OPEN_SOURCE_MANIFEST.md)

## Common Errors
- `AllianceFactory is not deployed ...`: stale env address or redeploy mismatch
- `unsupported token`: non-standard ERC20 transfer mechanics are rejected
- `quorum not reached`: insufficient vote weight
- `cooldown active`: faucet claim too early
- HTTP 429: RPC provider rate limit reached

## Policies
- [SECURITY.md](SECURITY.md)
- [REPORTING.md](REPORTING.md)
- [RULES_OF_USE.md](RULES_OF_USE.md)
- [Terms of Use](/terms-of-use)
- [Privacy Notice](/privacy-notice)

## License
MIT
