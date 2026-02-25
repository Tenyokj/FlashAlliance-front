import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { DAPP_RPC_URL } from "./contracts";

export const dappPublicClient = createPublicClient({
  chain: hardhat,
  transport: http(DAPP_RPC_URL)
});
