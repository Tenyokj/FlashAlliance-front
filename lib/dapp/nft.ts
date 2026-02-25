import type { Address, PublicClient } from "viem";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const erc721MetadataAbi = [
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }]
  }
] as const;

export type NftMedia = {
  tokenUri: string | null;
  image: string | null;
  name: string | null;
  description: string | null;
};

function normalizeIpfs(uri: string) {
  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.slice("ipfs://".length)}`;
  }
  return uri;
}

function parseDataJsonUri(uri: string): unknown | null {
  if (!uri.startsWith("data:application/json")) {
    return null;
  }

  const idx = uri.indexOf(",");
  if (idx === -1) {
    return null;
  }

  const meta = uri.slice(0, idx);
  const payload = uri.slice(idx + 1);

  try {
    if (meta.includes(";base64")) {
      const decoded = atob(payload);
      return JSON.parse(decoded);
    }

    return JSON.parse(decodeURIComponent(payload));
  } catch {
    return null;
  }
}

async function fetchJson(tokenUri: string): Promise<Record<string, unknown> | null> {
  const inlined = parseDataJsonUri(tokenUri);
  if (inlined && typeof inlined === "object") {
    return inlined as Record<string, unknown>;
  }

  const url = normalizeIpfs(tokenUri);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asString(value: unknown) {
  return typeof value === "string" ? value : null;
}

export async function loadNftMedia(
  client: PublicClient,
  nftAddress: Address,
  tokenId: bigint
): Promise<NftMedia> {
  if (nftAddress.toLowerCase() === ZERO_ADDRESS || tokenId === 0n) {
    return { tokenUri: null, image: null, name: null, description: null };
  }

  try {
    const tokenUri = (await client.readContract({
      address: nftAddress,
      abi: erc721MetadataAbi,
      functionName: "tokenURI",
      args: [tokenId]
    })) as string;

    const metadata = await fetchJson(tokenUri);
    if (!metadata) {
      return { tokenUri, image: null, name: null, description: null };
    }

    const imageRaw = asString(metadata.image) ?? asString(metadata.image_url);
    const image = imageRaw ? normalizeIpfs(imageRaw) : null;
    const name = asString(metadata.name);
    const description = asString(metadata.description);

    return { tokenUri, image, name, description };
  } catch {
    return { tokenUri: null, image: null, name: null, description: null };
  }
}

