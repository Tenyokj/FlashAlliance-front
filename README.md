[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![Build](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Ethereum Network](https://img.shields.io/badge/Network-Sepolia-purple)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-black)]()
[![React](https://img.shields.io/badge/React-19-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)]()

![banner](/flash-asset.png)

# FlashAlliance Frontend

> Frontend for FlashAlliance dApp (Next.js App Router).
> Manage alliances, track flows, and interact with your smart contracts directly via the web interface.

---

## 📦 Repository Contents

* **Landing page** and project overview routes
* **dApp routes**: alliance creation, flow view, alliance control panel
* **FATK faucet UI**
* **Documentation / help routes**
* **Subgraph integration** (The Graph) with RPC fallback

---

## ⚙️ Tech Stack

* Next.js 15
* React 19
* TypeScript
* viem
* The Graph (subgraph located under `graph/`)

---

## 🛣 Main Routes

| Route                      | Description                 |
| -------------------------- | --------------------------- |
| `/`                        | Home / Landing Page         |
| `/dapp`                    | dApp dashboard              |
| `/dapp/create`             | Create an alliance          |
| `/dapp/alliances`          | Alliances flow (mini cards) |
| `/dapp/alliance/[address]` | Alliance control panel      |
| `/docs`                    | User handbook               |

---

## 🌐 Environment Variables

Use `.env.local` (or `.env`) for frontend runtime values:

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

> If `NEXT_PUBLIC_SUBGRAPH_URL` is empty, dApp pages will read directly from contracts via RPC.

---

## 🏗 Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 📊 The Graph Integration

Subgraph source is located in `graph/`.

1. **Install dependencies**

```bash
cd graph
npm install
```

2. **Set deployed addresses and start blocks**

```bash
FACTORY_ADDRESS=0x... \
FAUCET_ADDRESS=0x... \
FACTORY_START_BLOCK=123456 \
FAUCET_START_BLOCK=123460 \
npm run set-addresses
```

3. **Build the subgraph**

```bash
npm run codegen
npm run build
```

4. **Deploy to Graph Studio**

```bash
npm run auth -- <GRAPH_DEPLOY_KEY>
npm run deploy
```

After deployment, copy the GraphQL endpoint and set in `.env`:

```env
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/.../flashalliance/version/latest
```

---

## ⚡ Data Source Behavior

* `app/dapp/alliances/page.tsx`: Uses subgraph first, falls back to direct onchain reads
* `app/dapp/page.tsx`: Uses subgraph protocol stats for counters, fallback to factory contract reads

---

## 📜 User Policies

* [Security Policy](SECURITY.md)
* [Reporting Format](REPORTING.md)
* [Usage Rules](RULES_OF_USE.md)

---

## 🛠 Troubleshooting

* `getAllAlliances` returns `0x`: Wrong factory address or node restarted
* Alliance not in Funding state: already Acquired/Closed
* Amount exceeds remaining target: deposit exceeds remaining capacity
* Faucet claim fails: cooldown active, wrong faucet address, or faucet has no FATK liquidity

---

## 📝 License

MIT © [Tenyokj](https://github.com/Tenyokj)

---

<p align="center">
  Made with ❤️ for the Ethereum community
</p>

