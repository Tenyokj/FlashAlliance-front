import { getAddress, type Address } from "viem";

export const SUBGRAPH_URL = (process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "").trim();

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export type SubgraphAlliance = {
  id: Address;
  state: number;
  stateHint: string;
  targetPrice: bigint;
  totalDepositedVolume: bigint;
  deadline: bigint;
  participantsCount: number;
  nftAddress: Address | null;
  nftTokenId: bigint | null;
};

export type SubgraphProtocol = {
  alliancesCreated: bigint;
  depositsCount: bigint;
  depositsVolume: bigint;
  salesExecuted: bigint;
  faucetClaims: bigint;
  faucetClaimedVolume: bigint;
};

type GraphResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

function toBigInt(value: string | null | undefined): bigint {
  if (!value) return 0n;
  try {
    return BigInt(value);
  } catch {
    return 0n;
  }
}

function toAddress(value: string | null | undefined): Address | null {
  if (!value) return null;
  try {
    const parsed = getAddress(value);
    if (parsed.toLowerCase() === ZERO_ADDRESS) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function requestGraph<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!SUBGRAPH_URL) {
    throw new Error("Subgraph URL is not configured");
  }

  const res = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ query, variables })
  });

  if (!res.ok) {
    throw new Error(`Subgraph HTTP ${res.status}`);
  }

  const json = (await res.json()) as GraphResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "Subgraph query failed");
  }

  if (!json.data) {
    throw new Error("Subgraph returned empty response");
  }

  return json.data;
}

export async function fetchAlliancesFromSubgraph(limit = 200): Promise<SubgraphAlliance[]> {
  const query = `
    query Alliances($limit: Int!) {
      alliances(first: $limit, orderBy: createdAt, orderDirection: desc) {
        id
        state
        stateHint
        targetPrice
        totalDepositedVolume
        deadline
        participantsCount
        nftAddress
        nftTokenId
      }
    }
  `;

  const data = await requestGraph<{ alliances: Array<Record<string, unknown>> }>(query, { limit });

  const alliances: SubgraphAlliance[] = [];

  for (const item of data.alliances) {
    const id = toAddress(String(item.id ?? ""));
    if (!id) continue; // сразу пропускаем null

    const rawState = Number(item.state ?? 0);
    const safeState = Number.isFinite(rawState) ? rawState : 0;

    const rawParticipants = Number(item.participantsCount ?? 0);
    const participantsCount = Number.isFinite(rawParticipants) ? rawParticipants : 0;

    alliances.push({
      id,
      state: safeState,
      stateHint: String(item.stateHint ?? "Unknown"),
      targetPrice: toBigInt(item.targetPrice as string | null | undefined),
      totalDepositedVolume: toBigInt(item.totalDepositedVolume as string | null | undefined),
      deadline: toBigInt(item.deadline as string | null | undefined),
      participantsCount,
      nftAddress: toAddress(item.nftAddress as string | null | undefined),
      nftTokenId: item.nftTokenId ? toBigInt(item.nftTokenId as string) : null
    });
  }

  return alliances;
}

export async function fetchProtocolFromSubgraph(): Promise<SubgraphProtocol | null> {
  const query = `
    query Protocol {
      protocol(id: "flashalliance") {
        alliancesCreated
        depositsCount
        depositsVolume
        salesExecuted
        faucetClaims
        faucetClaimedVolume
      }
    }
  `;

  const data = await requestGraph<{ protocol: Record<string, unknown> | null }>(query);
  if (!data.protocol) return null;

  return {
    alliancesCreated: toBigInt(data.protocol.alliancesCreated as string | null | undefined),
    depositsCount: toBigInt(data.protocol.depositsCount as string | null | undefined),
    depositsVolume: toBigInt(data.protocol.depositsVolume as string | null | undefined),
    salesExecuted: toBigInt(data.protocol.salesExecuted as string | null | undefined),
    faucetClaims: toBigInt(data.protocol.faucetClaims as string | null | undefined),
    faucetClaimedVolume: toBigInt(data.protocol.faucetClaimedVolume as string | null | undefined)
  };
}
