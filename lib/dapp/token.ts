import type { Address, PublicClient } from "viem";
import { formatUnits } from "viem";

const erc20MetaAbi = [
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }]
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }]
  }
] as const;

export type TokenMeta = {
  symbol: string;
  decimals: number;
};

export async function loadTokenMeta(client: PublicClient, token: Address): Promise<TokenMeta> {
  try {
    const [symbol, decimals] = await Promise.all([
      client.readContract({ address: token, abi: erc20MetaAbi, functionName: "symbol" }),
      client.readContract({ address: token, abi: erc20MetaAbi, functionName: "decimals" })
    ]);

    return {
      symbol: (symbol as string) || "FATK",
      decimals: Number(decimals)
    };
  } catch {
    return { symbol: "FATK", decimals: 18 };
  }
}

export function formatTokenAmount(amount: bigint, decimals: number, precision = 4) {
  const raw = formatUnits(amount, decimals);
  const [w, f = ""] = raw.split(".");
  if (!f) return w;
  return `${w}.${f.slice(0, precision)}`;
}
