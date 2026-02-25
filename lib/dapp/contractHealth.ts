import type { Address } from "viem";
import { dappPublicClient } from "./client";

export async function ensureContractDeployed(address: Address, label: string) {
  const code = await dappPublicClient.getBytecode({ address });
  if (!code || code === "0x") {
    throw new Error(
      `${label} is not deployed at ${address}. If you restarted hardhat node, redeploy contracts and update NEXT_PUBLIC_* addresses.`
    );
  }
}

