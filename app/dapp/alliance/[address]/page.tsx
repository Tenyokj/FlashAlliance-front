"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createWalletClient, custom, getAddress, isAddress, parseUnits, type Address } from "viem";
import { allianceAbi } from "@/lib/dapp/contracts";
import { dappChain, dappPublicClient } from "@/lib/dapp/client";
import { useEvmWallet } from "../../hooks/useEvmWallet";
import { loadNftMedia } from "@/lib/dapp/nft";
import { formatTokenAmount, loadTokenMeta } from "@/lib/dapp/token";
import { toRpcErrorMessage, toWalletErrorMessage } from "@/lib/dapp/walletErrors";

function formatDate(ts: bigint) {
  return new Date(Number(ts) * 1000).toLocaleString();
}

function stateLabel(state: bigint) {
  if (state === 0n) return "Funding";
  if (state === 1n) return "Acquired";
  if (state === 2n) return "Closed";
  return "Unknown";
}

function toBigInt(value: bigint | number | string) {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(value);
  return BigInt(value);
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function avatarTone(address: string) {
  let hash = 0;
  for (let i = 0; i < address.length; i += 1) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 36;
  return `linear-gradient(135deg, hsl(${hue}, 90%, 50%), hsl(${(hue + 28) % 360}, 88%, 42%))`;
}

const TX_GAS_CAP = 15_000_000n;
const GAS_PADDING_NUM = 120n;
const GAS_PADDING_DEN = 100n;
const ZERO_ADDRESS = getAddress("0x0000000000000000000000000000000000000000");
const RPC_RETRY_LIMIT = 2;
const RPC_CONCURRENCY = 4;
const RPC_BASE_DELAY_MS = 280;

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function isRateLimitedError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error ?? "").toLowerCase();
  return message.includes("status: 429") || message.includes("too many requests") || message.includes("rate limit");
}

async function withRpcRetry<T>(op: () => Promise<T>) {
  let attempt = 0;
  while (true) {
    try {
      return await op();
    } catch (error) {
      if (!isRateLimitedError(error) || attempt >= RPC_RETRY_LIMIT) {
        throw error;
      }
      const delay = RPC_BASE_DELAY_MS * 2 ** attempt;
      attempt += 1;
      await sleep(delay);
    }
  }
}

async function runWithConcurrency<T>(tasks: Array<() => Promise<T>>, concurrency: number) {
  const results = new Array<T>(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= tasks.length) return;
      results[current] = await tasks[current]();
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

const erc20Abi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  }
] as const;

export default function AllianceDetailPage() {
  const params = useParams<{ address: string }>();
  const { account, connect, isWrongNetwork, switchToHardhat } = useEvmWallet();

  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<bigint>(0n);
  const [owner, setOwner] = useState<Address | null>(null);
  const [token, setToken] = useState<Address | null>(null);
  const [targetPrice, setTargetPrice] = useState<bigint>(0n);
  const [totalDeposited, setTotalDeposited] = useState<bigint>(0n);
  const [deadline, setDeadline] = useState<bigint>(0n);
  const [fundingFailed, setFundingFailed] = useState(false);
  const [paused, setPaused] = useState(false);

  const [quorum, setQuorum] = useState<bigint>(0n);
  const [lossQuorum, setLossQuorum] = useState<bigint>(0n);
  const [minSalePrice, setMinSalePrice] = useState<bigint>(0n);
  const [yesVotesWeight, setYesVotesWeight] = useState<bigint>(0n);
  const [proposedPrice, setProposedPrice] = useState<bigint>(0n);
  const [proposedSaleDeadline, setProposedSaleDeadline] = useState<bigint>(0n);
  const [proposedBuyer, setProposedBuyer] = useState<Address | null>(null);

  const [emergencyVotesWeight, setEmergencyVotesWeight] = useState<bigint>(0n);
  const [emergencyRecipient, setEmergencyRecipient] = useState<Address | null>(null);
  const [acquisitionVotesWeight, setAcquisitionVotesWeight] = useState<bigint>(0n);
  const [proposedAcquisitionPrice, setProposedAcquisitionPrice] = useState<bigint>(0n);
  const [proposedAcquisitionDeadline, setProposedAcquisitionDeadline] = useState<bigint>(0n);
  const [proposedAcquisitionNft, setProposedAcquisitionNft] = useState<Address | null>(null);
  const [proposedAcquisitionTokenId, setProposedAcquisitionTokenId] = useState<bigint>(0n);
  const [proposedAcquisitionSeller, setProposedAcquisitionSeller] = useState<Address | null>(null);

  const [nftAddress, setNftAddress] = useState<Address | null>(null);
  const [tokenId, setTokenId] = useState<bigint>(0n);
  const [nftImage, setNftImage] = useState<string | null>(null);
  const [nftName, setNftName] = useState<string | null>(null);
  const [nftDescription, setNftDescription] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Address[]>([]);
  const [shares, setShares] = useState<Record<string, bigint>>({});
  const [contributed, setContributed] = useState<Record<string, bigint>>({});
  const [tokenSymbol, setTokenSymbol] = useState("FATK");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [isCurrentParticipant, setIsCurrentParticipant] = useState(false);
  const [hasCurrentVotedSale, setHasCurrentVotedSale] = useState(false);
  const [hasCurrentVotedEmergency, setHasCurrentVotedEmergency] = useState(false);
  const [hasCurrentVotedAcquisition, setHasCurrentVotedAcquisition] = useState(false);

  const [depositAmount, setDepositAmount] = useState("");
  const [acquireNftAddress, setAcquireNftAddress] = useState("");
  const [acquireTokenId, setAcquireTokenId] = useState("");
  const [acquireSeller, setAcquireSeller] = useState("");
  const [acquireDeadline, setAcquireDeadline] = useState("");

  const [voteBuyer, setVoteBuyer] = useState("");
  const [votePrice, setVotePrice] = useState("");
  const [voteDeadline, setVoteDeadline] = useState("");

  const [emergencyVoteRecipient, setEmergencyVoteRecipient] = useState("");

  const [txBusy, setTxBusy] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<bigint>(0n);
  const [allianceAllowance, setAllianceAllowance] = useState<bigint>(0n);

  const loadAlliance = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const raw = typeof params?.address === "string" ? params.address : "";
      if (!isAddress(raw)) {
        throw new Error("Invalid alliance address");
      }

      const allianceAddress = getAddress(raw);
      setAddress(allianceAddress);

      const readAlliance = (functionName: string, args?: readonly unknown[]) =>
        withRpcRetry(() =>
          dappPublicClient.readContract({
            address: allianceAddress,
            abi: allianceAbi,
            functionName: functionName as never,
            args: (args ?? []) as never
          })
        );

      const baseCalls: Array<() => Promise<unknown>> = [
        () => readAlliance("state"),
        () => readAlliance("owner"),
        () => readAlliance("token"),
        () => readAlliance("targetPrice"),
        () => readAlliance("totalDeposited"),
        () => readAlliance("deadline"),
        () => readAlliance("fundingFailed"),
        () => readAlliance("isPaused"),
        () => readAlliance("quorumPercent"),
        () => readAlliance("lossSaleQuorumPercent"),
        () => readAlliance("minSalePrice"),
        () => readAlliance("yesVotesWeight"),
        () => readAlliance("proposedPrice"),
        () => readAlliance("proposedSaleDeadline"),
        () => readAlliance("proposedBuyer"),
        () => readAlliance("emergencyVotesWeight"),
        () => readAlliance("emergencyRecipient"),
        () => readAlliance("acquisitionVotesWeight"),
        () => readAlliance("proposedAcquisitionPrice"),
        () => readAlliance("proposedAcquisitionDeadline"),
        () => readAlliance("proposedAcquisitionNft"),
        () => readAlliance("proposedAcquisitionTokenId"),
        () => readAlliance("proposedAcquisitionSeller"),
        () => readAlliance("nftAddress"),
        () => readAlliance("tokenId"),
        () => readAlliance("getParticipants")
      ];

      const [
        stateResp,
        ownerResp,
        tokenResp,
        targetResp,
        depositedResp,
        deadlineResp,
        fundingFailedResp,
        pausedResp,
        quorumResp,
        lossQuorumResp,
        minSaleResp,
        yesVotesResp,
        proposedPriceResp,
        proposedDeadlineResp,
        proposedBuyerResp,
        emergencyVotesResp,
        emergencyRecipientResp,
        acquisitionVotesResp,
        proposedAcquisitionPriceResp,
        proposedAcquisitionDeadlineResp,
        proposedAcquisitionNftResp,
        proposedAcquisitionTokenIdResp,
        proposedAcquisitionSellerResp,
        nftResp,
        tokenIdResp,
        participantsResp
      ] = await runWithConcurrency(baseCalls, RPC_CONCURRENCY);

      const parsedState = toBigInt(stateResp as bigint | number | string);
      const parsedToken = getAddress(tokenResp as string);
      const parsedParticipants = (participantsResp as string[]).map((p) => getAddress(p));
      const parsedNftAddress = getAddress(nftResp as string);
      const parsedTokenId = tokenIdResp as bigint;

      setState(parsedState);
      setOwner(getAddress(ownerResp as string));
      setToken(parsedToken);
      setTargetPrice(targetResp as bigint);
      setTotalDeposited(depositedResp as bigint);
      setDeadline(deadlineResp as bigint);
      setFundingFailed(Boolean(fundingFailedResp));
      setPaused(Boolean(pausedResp));
      setQuorum(quorumResp as bigint);
      setLossQuorum(lossQuorumResp as bigint);
      setMinSalePrice(minSaleResp as bigint);
      setYesVotesWeight(yesVotesResp as bigint);
      setProposedPrice(proposedPriceResp as bigint);
      setProposedSaleDeadline(proposedDeadlineResp as bigint);
      setProposedBuyer(getAddress(proposedBuyerResp as string));
      setEmergencyVotesWeight(emergencyVotesResp as bigint);
      setEmergencyRecipient(getAddress(emergencyRecipientResp as string));
      setAcquisitionVotesWeight(acquisitionVotesResp as bigint);
      setProposedAcquisitionPrice(proposedAcquisitionPriceResp as bigint);
      setProposedAcquisitionDeadline(proposedAcquisitionDeadlineResp as bigint);
      setProposedAcquisitionNft(getAddress(proposedAcquisitionNftResp as string));
      setProposedAcquisitionTokenId(proposedAcquisitionTokenIdResp as bigint);
      setProposedAcquisitionSeller(getAddress(proposedAcquisitionSellerResp as string));
      setNftAddress(parsedNftAddress);
      setTokenId(parsedTokenId);
      setParticipants(parsedParticipants);

      if (parsedState >= 1n && parsedNftAddress !== ZERO_ADDRESS) {
        const media = await loadNftMedia(dappPublicClient, parsedNftAddress, parsedTokenId);
        setNftImage(media.image);
        setNftName(media.name);
        setNftDescription(media.description);
      } else {
        setNftImage(null);
        setNftName(null);
        setNftDescription(null);
      }

      const tokenMeta = await loadTokenMeta(dappPublicClient, parsedToken);
      setTokenSymbol(tokenMeta.symbol);
      setTokenDecimals(tokenMeta.decimals);

      const participantEntries = await runWithConcurrency(
        parsedParticipants.map((participant) => async () => {
          const share = await readAlliance("sharePercent", [participant]);
          const amount = await readAlliance("contributed", [participant]);
          return [participant, share as bigint, amount as bigint] as const;
        }),
        RPC_CONCURRENCY
      );

      const sharesMap: Record<string, bigint> = {};
      const contribMap: Record<string, bigint> = {};
      for (const [participant, share, amount] of participantEntries) {
        sharesMap[participant] = share;
        contribMap[participant] = amount;
      }
      setShares(sharesMap);
      setContributed(contribMap);

      if (account) {
        const [participantResp, votedSaleResp, votedEmergencyResp, votedAcquisitionResp] = await runWithConcurrency(
          [
            () => readAlliance("isParticipant", [account]),
            () => readAlliance("hasVoted", [account]),
            () => readAlliance("hasVotedEmergency", [account]),
            () => readAlliance("hasVotedAcquisition", [account])
          ],
          RPC_CONCURRENCY
        );

        setIsCurrentParticipant(Boolean(participantResp));
        setHasCurrentVotedSale(Boolean(votedSaleResp));
        setHasCurrentVotedEmergency(Boolean(votedEmergencyResp));
        setHasCurrentVotedAcquisition(Boolean(votedAcquisitionResp));

        const [balanceResp, allowanceResp] = await runWithConcurrency(
          [
            () =>
              withRpcRetry(() =>
                dappPublicClient.readContract({
                  address: parsedToken,
                  abi: erc20Abi,
                  functionName: "balanceOf",
                  args: [account]
                })
              ),
            () =>
              withRpcRetry(() =>
                dappPublicClient.readContract({
                  address: parsedToken,
                  abi: erc20Abi,
                  functionName: "allowance",
                  args: [account, allianceAddress]
                })
              )
          ],
          RPC_CONCURRENCY
        );

        setWalletBalance(balanceResp as bigint);
        setAllianceAllowance(allowanceResp as bigint);
      } else {
        setIsCurrentParticipant(false);
        setHasCurrentVotedSale(false);
        setHasCurrentVotedEmergency(false);
        setHasCurrentVotedAcquisition(false);
        setWalletBalance(0n);
        setAllianceAllowance(0n);
      }
    } catch (e) {
      setError(toRpcErrorMessage(e, "Failed to load alliance"));
    } finally {
      setLoading(false);
    }
  }, [account, params]);

  useEffect(() => {
    void loadAlliance();
  }, [loadAlliance]);

  const fundingPercent = useMemo(() => {
    if (targetPrice === 0n) return 0;
    return Number((totalDeposited * 10000n) / targetPrice) / 100;
  }, [targetPrice, totalDeposited]);

  const remainingAmount = useMemo(() => {
    if (totalDeposited >= targetPrice) return 0n;
    return targetPrice - totalDeposited;
  }, [targetPrice, totalDeposited]);

  const accountIsOwner = useMemo(() => {
    if (!account || !owner) return false;
    return account.toLowerCase() === owner.toLowerCase();
  }, [account, owner]);

  const currentParticipantAddress = useMemo(() => {
    if (!account) return null;
    return participants.find((participant) => participant.toLowerCase() === account.toLowerCase()) ?? null;
  }, [account, participants]);

  const yourContribution = useMemo(() => {
    if (!currentParticipantAddress) return 0n;
    return contributed[currentParticipantAddress] ?? 0n;
  }, [contributed, currentParticipantAddress]);

  const yourShare = useMemo(() => {
    if (!currentParticipantAddress) return 0n;
    return shares[currentParticipantAddress] ?? 0n;
  }, [shares, currentParticipantAddress]);

  const sortedParticipants = useMemo(
    () =>
      [...participants].sort((a, b) => {
        const aa = contributed[a] ?? 0n;
        const bb = contributed[b] ?? 0n;
        if (aa > bb) return -1;
        if (aa < bb) return 1;
        return 0;
      }),
    [contributed, participants]
  );

  const activityFeed = useMemo(() => {
    const items: string[] = [];
    if (owner) items.push(`Owner ${shortAddress(owner)} initialized alliance controls.`);
    items.push(`Pool raised ${formatTokenAmount(totalDeposited, tokenDecimals)} / ${formatTokenAmount(targetPrice, tokenDecimals)} ${tokenSymbol}.`);
    items.push(`Funding window closes at ${formatDate(deadline)}.`);
    if (state >= 1n && nftAddress) items.push(`Target NFT linked: ${shortAddress(nftAddress)} #${tokenId.toString()}.`);
    if (proposedAcquisitionPrice > 0n) {
      items.push(`Acquisition proposal live for ${formatTokenAmount(proposedAcquisitionPrice, tokenDecimals)} ${tokenSymbol}.`);
    }
    if (proposedPrice > 0n) items.push(`Sale proposal live for ${formatTokenAmount(proposedPrice, tokenDecimals)} ${tokenSymbol}.`);
    if (paused) items.push("Contract is paused by owner.");
    if (fundingFailed) items.push("Funding has been marked as failed.");
    return items;
  }, [owner, totalDeposited, tokenDecimals, targetPrice, tokenSymbol, deadline, state, nftAddress, tokenId, proposedAcquisitionPrice, proposedPrice, paused, fundingFailed]);

  const runTx = useCallback(
    async (fn: string, args: unknown[] = []) => {
      if (!address) return;

      setTxError(null);
      setTxStatus(null);

      let active = account;
      if (!active) {
        active = await connect();
        if (!active) {
          setTxError("Connect wallet first");
          return;
        }
      }

      if (!window.ethereum || !active) {
        setTxError("Wallet provider unavailable");
        return;
      }

      if (isWrongNetwork) {
        await switchToHardhat();
      }

      const wallet = createWalletClient({
        account: active,
        chain: dappChain,
        transport: custom(window.ethereum)
      });

      try {
        setTxBusy(true);
        setTxStatus(`Sending ${fn} transaction...`);

        const estimatedGas = await dappPublicClient.estimateContractGas({
          address,
          abi: allianceAbi,
          functionName: fn,
          args,
          account: active
        } as never);
        const paddedGas = (estimatedGas * GAS_PADDING_NUM) / GAS_PADDING_DEN;
        const gas = paddedGas > TX_GAS_CAP ? TX_GAS_CAP : paddedGas;

        const hash = await wallet.writeContract({
          address,
          abi: allianceAbi,
          functionName: fn,
          args,
          gas
        } as never);

        setTxStatus("Waiting for confirmation...");
        await dappPublicClient.waitForTransactionReceipt({ hash });

        setTxStatus(`${fn} confirmed`);
        await loadAlliance();
      } catch (e) {
        setTxError(toWalletErrorMessage(e, `${fn} failed`));
      } finally {
        setTxBusy(false);
      }
    },
    [account, address, connect, isWrongNetwork, loadAlliance, switchToHardhat]
  );

  const parseAmountInput = useCallback(
    (raw: string) => {
      const normalized = raw.trim().replace(",", ".");
      if (!normalized) return null;
      try {
        return parseUnits(normalized, tokenDecimals);
      } catch {
        return null;
      }
    },
    [tokenDecimals]
  );

  const handleApprove = useCallback(async () => {
    if (!token || !address) return;

    const amount = parseAmountInput(depositAmount);
    if (amount === null || amount <= 0n) {
      setTxError(`Invalid amount. Use numeric value in ${tokenSymbol}, e.g. 10 or 10.5`);
      return;
    }

    let active = account;
    if (!active) {
      active = await connect();
      if (!active) {
        setTxError("Connect wallet first");
        return;
      }
    }

    if (!window.ethereum) {
      setTxError("Wallet provider unavailable");
      return;
    }

    if (isWrongNetwork) {
      await switchToHardhat();
    }

    const wallet = createWalletClient({
      account: active,
      chain: dappChain,
      transport: custom(window.ethereum)
    });

    try {
      setTxBusy(true);
      setTxError(null);
      setTxStatus("Sending approve transaction...");

      const estimatedGas = await dappPublicClient.estimateContractGas({
        address: token,
        abi: erc20Abi,
        functionName: "approve",
        args: [address, amount],
        account: active
      });
      const paddedGas = (estimatedGas * GAS_PADDING_NUM) / GAS_PADDING_DEN;
      const gas = paddedGas > TX_GAS_CAP ? TX_GAS_CAP : paddedGas;

      const hash = await wallet.writeContract({
        address: token,
        abi: erc20Abi,
        functionName: "approve",
        args: [address, amount],
        gas
      });

      setTxStatus("Waiting approve confirmation...");
      await dappPublicClient.waitForTransactionReceipt({ hash });
      setTxStatus("approve confirmed");
      await loadAlliance();
    } catch (e) {
      setTxError(toWalletErrorMessage(e, "approve failed"));
    } finally {
      setTxBusy(false);
    }
  }, [account, address, connect, depositAmount, isWrongNetwork, loadAlliance, parseAmountInput, switchToHardhat, token, tokenSymbol]);

  const validateDeposit = useCallback(
    async (amount: bigint) => {
      if (!address || !token) {
        setTxError("Alliance context is not loaded");
        return false;
      }

      if (!account) {
        setTxError("Connect wallet first");
        return false;
      }

      try {
        const [participantResp, stateResp, pausedResp, deadlineResp, targetResp, depositedResp, balanceResp, allowanceResp, now] = await Promise.all([
          dappPublicClient.readContract({
            address,
            abi: allianceAbi,
            functionName: "isParticipant",
            args: [account]
          }),
          dappPublicClient.readContract({
            address,
            abi: allianceAbi,
            functionName: "state"
          }),
          dappPublicClient.readContract({
            address,
            abi: allianceAbi,
            functionName: "isPaused"
          }),
          dappPublicClient.readContract({
            address,
            abi: allianceAbi,
            functionName: "deadline"
          }),
          dappPublicClient.readContract({
            address,
            abi: allianceAbi,
            functionName: "targetPrice"
          }),
          dappPublicClient.readContract({
            address,
            abi: allianceAbi,
            functionName: "totalDeposited"
          }),
          dappPublicClient.readContract({
            address: token,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [account]
          }),
          dappPublicClient.readContract({
            address: token,
            abi: erc20Abi,
            functionName: "allowance",
            args: [account, address]
          }),
          dappPublicClient.getBlock()
        ]);

        if (!participantResp) {
          setTxError("Deposit failed: connected wallet is not a participant of this alliance");
          return false;
        }
        const currentState = toBigInt(stateResp as bigint | number | string);
        if (currentState !== 0n) {
          setTxError("Deposit failed: alliance is not in Funding state");
          return false;
        }
        if (Boolean(pausedResp)) {
          setTxError("Deposit failed: alliance is paused");
          return false;
        }
        if (BigInt(now.timestamp) >= (deadlineResp as bigint)) {
          setTxError("Deposit failed: funding window is over");
          return false;
        }

        const remaining = (targetResp as bigint) - (depositedResp as bigint);
        if (amount > remaining) {
          setTxError(
            `Deposit failed: amount exceeds remaining target (${formatTokenAmount(remaining, tokenDecimals)} ${tokenSymbol})`
          );
          return false;
        }
        if ((balanceResp as bigint) < amount) {
          setTxError(
            `Deposit failed: insufficient ${tokenSymbol} balance (wallet: ${formatTokenAmount(balanceResp as bigint, tokenDecimals)} ${tokenSymbol})`
          );
          return false;
        }
        if ((allowanceResp as bigint) < amount) {
          setTxError(
            `Deposit failed: allowance is too low. Approve at least ${formatTokenAmount(amount, tokenDecimals)} ${tokenSymbol}`
          );
          return false;
        }

        return true;
      } catch (e) {
        setTxError(e instanceof Error ? e.message : "Failed to validate deposit preconditions");
        return false;
      }
    },
    [account, address, token, tokenDecimals, tokenSymbol]
  );

  const handleCopyAddress = useCallback(async () => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setTxStatus("Contract address copied");
    } catch {
      setTxError("Failed to copy address");
    }
  }, [address]);

  return (
    <main className="dapp-main alliance-page">
      <section className="dapp-panel alliance-header-panel">
        <div className="alliance-header-main">
          <p className="dapp-label pixel">FlashAlliance Control Panel</p>
          <h1>{address ? `FlashAlliance ${shortAddress(address)}` : "FlashAlliance"}</h1>
          <p className="dapp-muted">Status: {stateLabel(state)}{fundingFailed ? " • Funding Failed" : ""}</p>
        </div>

        <div className="dapp-row">
          <Link href="/dapp/alliances" className="dapp-link-btn">All Alliances</Link>
          <Link href="/dapp/create" className="dapp-btn">Create Alliance</Link>
          <button type="button" className="dapp-btn" onClick={() => void connect()}>{account ? shortAddress(account) : "Connect Wallet"}</button>
        </div>
      </section>

      {loading ? <p className="dapp-muted">Loading alliance data...</p> : null}
      {error ? <p className="dapp-error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <section className="alliance-main-grid">
            <article className="dapp-panel nft-profile-card">
              <div className="nft-profile-media">
                {nftImage ? <img src={nftImage} alt={nftName ?? "Alliance NFT"} className="nft-profile-image" /> : <div className="nft-profile-fallback" />}
              </div>

              <div className="nft-profile-info">
                <h3>{nftName ?? "Target NFT"}</h3>
                <p className="dapp-muted">Collection Contract: {nftAddress ? shortAddress(nftAddress) : "-"}</p>
                <p className="dapp-muted">Token ID: {tokenId.toString()}</p>
                <p className="dapp-muted">Target Price: {formatTokenAmount(targetPrice, tokenDecimals)} {tokenSymbol}</p>
                <p className="dapp-muted">Min Sale Price: {formatTokenAmount(minSalePrice, tokenDecimals)} {tokenSymbol}</p>
                {nftDescription ? <p className="dapp-muted">{nftDescription}</p> : null}
              </div>
            </article>

            <div className="alliance-right-stack">
              <article className="dapp-panel progress-panel">
                <div className="progress-head">
                  <h3>Funding Progress</h3>
                  <span>{fundingPercent.toFixed(2)}%</span>
                </div>

                <div className="tile-progress large">
                  <span style={{ width: `${Math.min(100, fundingPercent)}%` }} />
                </div>

                <div className="summary-lines">
                  <p><span>Total Raised</span><strong>{formatTokenAmount(totalDeposited, tokenDecimals)} {tokenSymbol}</strong></p>
                  <p><span>Remaining</span><strong>{formatTokenAmount(remainingAmount, tokenDecimals)} {tokenSymbol}</strong></p>
                  <p><span>Your Contribution</span><strong>{formatTokenAmount(yourContribution, tokenDecimals)} {tokenSymbol}</strong></p>
                  <p><span>Your Share</span><strong>{yourShare.toString()}%</strong></p>
                  <p><span>Your Wallet Balance</span><strong>{formatTokenAmount(walletBalance, tokenDecimals)} {tokenSymbol}</strong></p>
                  <p><span>Alliance Allowance</span><strong>{formatTokenAmount(allianceAllowance, tokenDecimals)} {tokenSymbol}</strong></p>
                  <p><span>Deadline</span><strong>{formatDate(deadline)}</strong></p>
                  <p className="contract-line">
                    <span>Contract</span>
                    <strong>{address ? shortAddress(address) : "-"}</strong>
                    <button type="button" className="copy-btn" onClick={handleCopyAddress}>Copy</button>
                  </p>
                </div>
              </article>

              <article className="dapp-panel participants-panel">
                <div className="dapp-panel-head">
                  <p className="dapp-label pixel">Alliance Participants</p>
                  <h3>{participants.length} members</h3>
                </div>

                <div className="participants-grid">
                  {sortedParticipants.map((participant) => {
                    const memberContribution = contributed[participant] ?? 0n;
                    const memberShare = shares[participant] ?? 0n;

                    return (
                      <div key={participant} className="participant-card">
                        <div className="participant-avatar" style={{ background: avatarTone(participant) }} />
                        <p className="participant-address">{shortAddress(participant)}</p>
                        <p className="dapp-muted">Contributed: {formatTokenAmount(memberContribution, tokenDecimals)} {tokenSymbol}</p>
                        <p className="dapp-muted">Share: {memberShare.toString()}%</p>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
          </section>

          <section className="alliance-action-grid">
            <div className="action-left-stack">
              <article className="dapp-panel action-card">
                <div className="dapp-panel-head">
                  <p className="dapp-label pixel">Sale Proposal</p>
                  <h3>Vote and execute exit</h3>
                </div>

                <div className="proposal-stats">
                  <p><span>Current Proposal</span><strong>{proposedPrice > 0n ? `${formatTokenAmount(proposedPrice, tokenDecimals)} ${tokenSymbol}` : "None"}</strong></p>
                  <p><span>Buyer</span><strong>{proposedBuyer ? shortAddress(proposedBuyer) : "-"}</strong></p>
                  <p><span>Voting Weight</span><strong>{yesVotesWeight.toString()}%</strong></p>
                  <p><span>Quorum</span><strong>{quorum.toString()}% (loss: {lossQuorum.toString()}%)</strong></p>
                  <p><span>Ends</span><strong>{proposedSaleDeadline > 0n ? formatDate(proposedSaleDeadline) : "-"}</strong></p>
                </div>

                <div className="compact-form-grid">
                  <input placeholder="Buyer address" value={voteBuyer} onChange={(e) => setVoteBuyer(e.target.value)} />
                  <input placeholder={`Price (${tokenSymbol} smallest units)`} value={votePrice} onChange={(e) => setVotePrice(e.target.value)} />
                  <input placeholder="Sale deadline (unix)" value={voteDeadline} onChange={(e) => setVoteDeadline(e.target.value)} />
                </div>

                <div className="dapp-row">
                  <button
                    type="button"
                    className="dapp-btn primary"
                    disabled={txBusy || !voteBuyer || !votePrice || !voteDeadline || hasCurrentVotedSale}
                    onClick={() => {
                      if (!isAddress(voteBuyer)) {
                        setTxError("Invalid buyer address");
                        return;
                      }
                      let parsedPrice: bigint;
                      let parsedDeadline: bigint;
                      try {
                        parsedPrice = BigInt(votePrice.trim());
                        parsedDeadline = BigInt(voteDeadline.trim());
                      } catch {
                        setTxError("Invalid proposal values. Price and deadline must be integer numbers.");
                        return;
                      }
                      void runTx("voteToSell", [getAddress(voteBuyer), parsedPrice, parsedDeadline]);
                    }}
                  >
                    {hasCurrentVotedSale ? "Already Voted" : "Vote / Propose"}
                  </button>
                  <button type="button" className="dapp-btn" disabled={txBusy} onClick={() => void runTx("resetSaleProposal")}>Reset</button>
                  <button type="button" className="dapp-btn" disabled={txBusy} onClick={() => void runTx("executeSale")}>Execute Sale</button>
                </div>
              </article>

              <article className="dapp-panel action-card">
                <div className="dapp-panel-head">
                  <p className="dapp-label pixel">Funding Controls</p>
                  <h3>Deposit and refunds</h3>
                </div>

                <div className="compact-form-grid single">
                  <input placeholder={`Deposit amount in ${tokenSymbol} (e.g. 10.5)`} value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                </div>

                <div className="dapp-row">
                  <button
                    type="button"
                    className="dapp-btn"
                    disabled={txBusy || !depositAmount}
                    onClick={() => void handleApprove()}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="dapp-btn primary"
                    disabled={txBusy || !depositAmount}
                    onClick={async () => {
                      const amount = parseAmountInput(depositAmount);
                      if (amount === null || amount <= 0n) {
                        setTxError(`Invalid amount. Use numeric value in ${tokenSymbol}, e.g. 10 or 10.5`);
                        return;
                      }
                      const valid = await validateDeposit(amount);
                      if (!valid) return;
                      void runTx("deposit", [amount]);
                    }}
                  >
                    Deposit
                  </button>
                  <button type="button" className="dapp-btn" disabled={txBusy} onClick={() => void runTx("cancelFunding")}>Cancel Funding</button>
                  <button type="button" className="dapp-btn" disabled={txBusy} onClick={() => void runTx("withdrawRefund")}>Withdraw Refund</button>
                </div>
              </article>
            </div>

            <div className="action-right-stack">
              <article className="dapp-panel emergency-card">
                <div className="dapp-panel-head">
                  <p className="dapp-label pixel">Emergency</p>
                  <h3>NFT Withdrawal Path</h3>
                </div>

                <p className="dapp-muted">Emergency votes: {emergencyVotesWeight.toString()}%</p>
                <p className="dapp-muted">Recipient: {emergencyRecipient ? shortAddress(emergencyRecipient) : "-"}</p>

                <input placeholder="Emergency recipient" value={emergencyVoteRecipient} onChange={(e) => setEmergencyVoteRecipient(e.target.value)} />

                <div className="dapp-row">
                  <button
                    type="button"
                    className="dapp-btn primary"
                    disabled={txBusy || !emergencyVoteRecipient || hasCurrentVotedEmergency}
                    onClick={() => {
                      if (!isAddress(emergencyVoteRecipient)) {
                        setTxError("Invalid emergency recipient");
                        return;
                      }
                      void runTx("voteEmergencyWithdraw", [getAddress(emergencyVoteRecipient)]);
                    }}
                  >
                    {hasCurrentVotedEmergency ? "Already Voted" : "Vote Emergency"}
                  </button>
                  <button type="button" className="dapp-btn" disabled={txBusy} onClick={() => void runTx("emergencyWithdrawNFT")}>Withdraw NFT</button>
                </div>
              </article>

              <article className="dapp-panel action-card">
                <div className="dapp-panel-head">
                  <p className="dapp-label pixel">Acquisition Governance</p>
                  <h3>Propose, vote, execute buy</h3>
                </div>

                <div className="proposal-stats">
                  <p><span>Current Proposal</span><strong>{proposedAcquisitionPrice > 0n ? `${formatTokenAmount(proposedAcquisitionPrice, tokenDecimals)} ${tokenSymbol}` : "None"}</strong></p>
                  <p><span>NFT</span><strong>{proposedAcquisitionNft ? shortAddress(proposedAcquisitionNft) : "-"}</strong></p>
                  <p><span>Token ID</span><strong>{proposedAcquisitionTokenId > 0n ? proposedAcquisitionTokenId.toString() : "-"}</strong></p>
                  <p><span>Seller</span><strong>{proposedAcquisitionSeller ? shortAddress(proposedAcquisitionSeller) : "-"}</strong></p>
                  <p><span>Voting Weight</span><strong>{acquisitionVotesWeight.toString()}%</strong></p>
                  <p><span>Quorum</span><strong>{quorum.toString()}%</strong></p>
                  <p><span>Ends</span><strong>{proposedAcquisitionDeadline > 0n ? formatDate(proposedAcquisitionDeadline) : "-"}</strong></p>
                </div>

                <div className="compact-form-grid">
                  <input placeholder="NFT address" value={acquireNftAddress} onChange={(e) => setAcquireNftAddress(e.target.value)} />
                  <input placeholder="Token ID" value={acquireTokenId} onChange={(e) => setAcquireTokenId(e.target.value)} />
                  <input placeholder="Seller address" value={acquireSeller} onChange={(e) => setAcquireSeller(e.target.value)} />
                  <input placeholder="Acquisition deadline (unix)" value={acquireDeadline} onChange={(e) => setAcquireDeadline(e.target.value)} />
                </div>

                <div className="dapp-row">
                  <button
                    type="button"
                    className="dapp-btn primary"
                    disabled={txBusy || !acquireNftAddress || !acquireTokenId || !acquireSeller || !acquireDeadline || hasCurrentVotedAcquisition}
                    onClick={() => {
                      if (!isAddress(acquireNftAddress) || !isAddress(acquireSeller)) {
                        setTxError("Invalid NFT/seller address");
                        return;
                      }
                      let parsedTokenId: bigint;
                      let parsedDeadline: bigint;
                      try {
                        parsedTokenId = BigInt(acquireTokenId.trim());
                        parsedDeadline = BigInt(acquireDeadline.trim());
                      } catch {
                        setTxError("Invalid acquisition values. Token ID and deadline must be integer numbers.");
                        return;
                      }
                      void runTx("voteToAcquire", [getAddress(acquireNftAddress), parsedTokenId, getAddress(acquireSeller), targetPrice, parsedDeadline]);
                    }}
                  >
                    {hasCurrentVotedAcquisition ? "Already Voted" : "Vote / Propose"}
                  </button>
                  <button type="button" className="dapp-btn" disabled={txBusy} onClick={() => void runTx("resetAcquisitionProposal")}>Reset</button>
                  <button type="button" className="dapp-btn" disabled={txBusy} onClick={() => void runTx("buyNFT")}>Buy NFT</button>
                </div>
              </article>

              <article className="dapp-panel action-card">
                <div className="dapp-panel-head">
                  <p className="dapp-label pixel">Owner Controls</p>
                  <h3>Pause module</h3>
                </div>

                <p className="dapp-muted">Owner: {owner ? shortAddress(owner) : "-"}</p>
                <p className="dapp-muted">Paused: {paused ? "Yes" : "No"}</p>
                <p className="dapp-muted">Participant: {isCurrentParticipant ? "Yes" : "No"}</p>

                <div className="dapp-row">
                  <button type="button" className="dapp-btn primary" disabled={txBusy || !accountIsOwner} onClick={() => void runTx("pause")}>Pause</button>
                  <button type="button" className="dapp-btn" disabled={txBusy || !accountIsOwner} onClick={() => void runTx("unpause")}>Unpause</button>
                </div>
              </article>
            </div>
          </section>

          <section className="dapp-panel activity-card">
            <div className="dapp-panel-head">
              <p className="dapp-label pixel">Activity Feed</p>
              <h3>Live alliance events</h3>
            </div>

            <div className="activity-list">
              {activityFeed.map((item, idx) => (
                <p key={`${item}-${idx}`}>✓ {item}</p>
              ))}
            </div>
            <p className="dapp-muted">Token: {token ? shortAddress(token) : "-"} ({tokenSymbol})</p>
          </section>

          {txStatus ? <p className="dapp-success">{txStatus}</p> : null}
          {txError ? <p className="dapp-error">{txError}</p> : null}
        </>
      ) : null}
    </main>
  );
}
