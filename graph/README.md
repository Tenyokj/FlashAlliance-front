# FlashAlliance Subgraph

Subgraph for indexing:

- `AllianceFactory` (`AllianceCreated`)
- `Alliance` template events (`Deposit`, `FundingCancelled`, `NFTBought`, sale and emergency events)
- `FATKFaucet` (`Claimed`)

## Setup

```bash
cd graph
npm install
```

## Configure addresses

```bash
FACTORY_ADDRESS=0x... \
FAUCET_ADDRESS=0x... \
FACTORY_START_BLOCK=123 \
FAUCET_START_BLOCK=456 \
npm run set-addresses
```

## Build

```bash
npm run codegen
npm run build
```

## Deploy (Studio)

```bash
npm run auth -- <GRAPH_DEPLOY_KEY>
npm run deploy
```
