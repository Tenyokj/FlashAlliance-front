export function toWalletErrorMessage(error: unknown, fallback: string): string {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const code = (error as { code?: number | string } | null)?.code;

  if (code === 4001 || code === "ACTION_REJECTED") {
    return "Transaction rejected in wallet.";
  }

  const lowered = message.toLowerCase();
  if (lowered.includes("user rejected") || lowered.includes("user denied")) {
    return "Transaction rejected in wallet.";
  }

  if (lowered.includes("0xe450d38c")) {
    return "Faucet has insufficient FATK balance. Top up faucet liquidity, then retry.";
  }

  if (lowered.includes("0xfb8f41b2")) {
    return "Token allowance is insufficient for this operation.";
  }

  return message || fallback;
}

export function toRpcErrorMessage(error: unknown, fallback: string): string {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const lowered = message.toLowerCase();

  if (lowered.includes("status: 429") || lowered.includes("too many requests")) {
    return "RPC provider rate limit reached. Please retry in a few seconds.";
  }

  return message || fallback;
}
