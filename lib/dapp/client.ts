import { createPublicClient, defineChain, fallback, http } from "viem";
import { DAPP_CHAIN_ID, DAPP_CHAIN_NAME, DAPP_RPC_URL } from "./contracts";

export const dappChain = defineChain({
  id: DAPP_CHAIN_ID,
  name: DAPP_CHAIN_NAME,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [DAPP_RPC_URL] },
    public: { http: [DAPP_RPC_URL] }
  }
});

const rpcFallbackUrls = (process.env.NEXT_PUBLIC_RPC_FALLBACK_URLS ?? "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const transports = [
  http(DAPP_RPC_URL, { retryCount: 2, retryDelay: 200, timeout: 10_000 }),
  ...rpcFallbackUrls.map((url) => http(url, { retryCount: 2, retryDelay: 200, timeout: 10_000 }))
];

export const dappPublicClient = createPublicClient({
  chain: dappChain,
  transport: transports.length > 1 ? fallback(transports) : transports[0]
});
