# FlashAlliance Frontend

Frontend for FlashAlliance dApp (Next.js App Router).  
This repo contains:

- Landing page and project overview routes
- dApp routes for alliance creation, flow view, and alliance control panel
- FATK faucet UI
- Docs/help routes
- Subgraph integration (The Graph) with RPC fallback

## Stack

- Next.js 15
- React 19
- TypeScript
- viem
- The Graph (subgraph source under `graph/`)

## Main Routes

- `/` - Home
- `/dapp` - dApp dashboard
- `/dapp/create` - Create alliance
- `/dapp/alliances` - Alliances flow (mini cards)
- `/dapp/alliance/[address]` - Alliance control panel
- `/docs` - User handbook

## Environment

Use `.env.local` (or `.env`) for frontend runtime values.

```env
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_SUBGRAPH_URL=
NEXT_PUBLIC_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_FAUCET_ADDRESS=0x...

NEXT_PUBLIC_CORE_REPO_URL=https://github.com/Tenyokj/FlashAlliance
NEXT_PUBLIC_FRONT_REPO_URL=https://github.com/Tenyokj/FlashAlliance-front
NEXT_PUBLIC_CONTRACTS_URL=https://github.com/Tenyokj/FlashAlliance/blob/main/docs/CONTRACTS.md
NEXT_PUBLIC_REDDIT_URL=https://www.reddit.com/r/FlashAlliance
NEXT_PUBLIC_CONTACT_URL=mailto:contact@flashalliance.xyz
```

If `NEXT_PUBLIC_SUBGRAPH_URL` is empty, dApp pages read directly from contracts via RPC.

## Local Run

```bash
npm install
npm run dev
```

## The Graph Integration

Subgraph source is in `graph/`.

### 1. Install graph dependencies

```bash
cd graph
npm install
```

### 2. Set deployed addresses and start blocks

```bash
FACTORY_ADDRESS=0x... \
FAUCET_ADDRESS=0x... \
FACTORY_START_BLOCK=123456 \
FAUCET_START_BLOCK=123460 \
npm run set-addresses
```

This updates `graph/subgraph.yaml`.

### 3. Build subgraph

```bash
npm run codegen
npm run build
```

### 4. Deploy to Graph Studio

```bash
npm run auth -- <GRAPH_DEPLOY_KEY>
npm run deploy
```

Then copy the GraphQL endpoint URL and set:

```env
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/.../flashalliance/version/latest
```

## Data Source Behavior

- `app/dapp/alliances/page.tsx`:
  - Uses subgraph first if configured
  - Falls back to direct onchain reads on failure
- `app/dapp/page.tsx`:
  - Uses subgraph protocol stats for counters if configured
  - Falls back to factory contract reads

## User Policies

- Security policy: `SECURITY.md`
- Reporting format: `REPORTING.md`
- Usage rules: `RULES_OF_USE.md`

## Troubleshooting

- `getAllAlliances returned 0x`:
  - Wrong factory address for current chain, or node restarted
- `alliance is not in Funding state`:
  - alliance already moved to `Acquired`/`Closed`
- `amount exceeds remaining target`:
  - deposit exceeds remaining capacity
- faucet claim fails:
  - cooldown active, wrong faucet address, or faucet has no FATK liquidity

