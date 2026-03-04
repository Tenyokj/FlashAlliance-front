# FlashAlliance Frontend

Frontend for FlashAlliance standalone dApp (Next.js App Router).

## Stack
- Next.js 16
- React 19
- TypeScript
- viem
- Optional subgraph (`graph/`) with RPC fallback

## Core Routes
- `/` landing
- `/faq` marketing FAQ
- `/sepolia-guide` onboarding for Sepolia + MetaMask + faucet
- `/dapp` dashboard
- `/dapp/create` alliance creation
- `/dapp/alliances` alliance flow cards
- `/dapp/alliance/[address]` alliance control panel
- `/docs` technical docs
- `/docs/deployments` source-of-truth contract addresses
- `/docs/assumptions`, `/docs/runbook`, `/docs/changelog`, `/docs/release`

## Local Setup
```bash
npm install
npm run dev
```

Build production:
```bash
npm run build
npm run start
```

## Environment Variables
Use `.env` (local only, not for commit) with values from your deployment:

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

Reference template: [.env.example](.env.example)

## Release Requirements
- `next build` succeeds
- RPC fallback configured (not single provider only)
- Deployments page matches real onchain addresses
- Changelog + release docs updated in same PR
- QA flows passed: create, deposit, acquisition vote, buy, sale vote, claim/refund
- Error paths verified: wallet reject, wrong network, RPC 429, stale env addresses

Detailed gate list:
- [app/docs/release/page.tsx](app/docs/release/page.tsx)
- [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)

## Open-Source Publication
Use this repo manifest before publishing:
- [OPEN_SOURCE_MANIFEST.md](OPEN_SOURCE_MANIFEST.md)

## Common Errors
- `AllianceFactory is not deployed ...`: stale address or redeploy mismatch
- `unsupported token`: non-standard ERC20 transfer mechanics rejected by core
- `quorum not reached`: voting weight insufficient
- `cooldown active`: faucet claim too early
- HTTP 429: RPC rate-limit, retry with fallback provider

## Policies
- [SECURITY.md](SECURITY.md)
- [REPORTING.md](REPORTING.md)
- [RULES_OF_USE.md](RULES_OF_USE.md)

## License
MIT
