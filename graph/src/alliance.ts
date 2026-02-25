import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Deposit as DepositEventLog,
  EmergencyVoted as EmergencyVotedEventLog,
  EmergencyWithdrawn as EmergencyWithdrawnEventLog,
  FundingCancelled as FundingCancelledEventLog,
  NFTBought as NFTBoughtEventLog,
  Refunded as RefundedEventLog,
  SaleExecuted as SaleExecutedEventLog,
  Voted as VotedEventLog
} from "../generated/templates/Alliance/Alliance";
import {
  Alliance,
  DepositEvent,
  EmergencyVoteEvent,
  EmergencyWithdrawEvent,
  NFTBuyEvent,
  ParticipantStats,
  Protocol,
  RefundEvent,
  SaleExecutionEvent,
  SaleVoteEvent
} from "../generated/schema";

const PROTOCOL_ID = "flashalliance";
const ZERO_BI = BigInt.fromI32(0);
const ZERO_ADDRESS = Address.fromString("0x0000000000000000000000000000000000000000");

function getOrCreateProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_ID);
  if (protocol == null) {
    protocol = new Protocol(PROTOCOL_ID);
    protocol.alliancesCreated = ZERO_BI;
    protocol.depositsCount = ZERO_BI;
    protocol.depositsVolume = ZERO_BI;
    protocol.salesExecuted = ZERO_BI;
    protocol.faucetClaims = ZERO_BI;
    protocol.faucetClaimedVolume = ZERO_BI;
    protocol.save();
  }
  return protocol as Protocol;
}

function stateToHint(state: i32): string {
  if (state == 0) return "Funding";
  if (state == 1) return "Acquired";
  if (state == 2) return "Closed";
  return "Unknown";
}

function getOrCreateAlliance(id: string): Alliance {
  let alliance = Alliance.load(id);

  if (alliance == null) {
    alliance = new Alliance(id);
    alliance.token = ZERO_ADDRESS;
    alliance.admin = ZERO_ADDRESS;
    alliance.createdAt = ZERO_BI;
    alliance.createdAtBlock = ZERO_BI;
    alliance.createdTxHash = ZERO_ADDRESS;
    alliance.targetPrice = ZERO_BI;
    alliance.deadline = ZERO_BI;
    alliance.participantsCount = 0;
    alliance.fundingFailed = false;
    alliance.state = 0;
    alliance.depositsCount = ZERO_BI;
    alliance.totalDepositedVolume = ZERO_BI;
    alliance.stateHint = stateToHint(0);
  }

  return alliance as Alliance;
}

function participantId(alliance: string, participant: Address): string {
  return alliance + "-" + participant.toHexString();
}

function getOrCreateParticipant(alliance: string, participant: Address): ParticipantStats {
  const id = participantId(alliance, participant);
  let stats = ParticipantStats.load(id);

  if (stats == null) {
    stats = new ParticipantStats(id);
    stats.alliance = alliance;
    stats.participant = participant;
    stats.deposited = ZERO_BI;
    stats.refunds = ZERO_BI;
    stats.votes = ZERO_BI;
    stats.emergencyVotes = ZERO_BI;
    stats.save();
  }

  return stats as ParticipantStats;
}

export function handleDeposit(event: DepositEventLog): void {
  const allianceId = event.address.toHexString();
  const alliance = getOrCreateAlliance(allianceId);
  const protocol = getOrCreateProtocol();
  const stats = getOrCreateParticipant(allianceId, event.params.user);

  const entity = new DepositEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  entity.alliance = allianceId;
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.txHash = event.transaction.hash;
  entity.save();

  alliance.depositsCount = alliance.depositsCount.plus(BigInt.fromI32(1));
  alliance.totalDepositedVolume = alliance.totalDepositedVolume.plus(event.params.amount);
  alliance.save();

  stats.deposited = stats.deposited.plus(event.params.amount);
  stats.save();

  protocol.depositsCount = protocol.depositsCount.plus(BigInt.fromI32(1));
  protocol.depositsVolume = protocol.depositsVolume.plus(event.params.amount);
  protocol.save();
}

export function handleFundingCancelled(event: FundingCancelledEventLog): void {
  const allianceId = event.address.toHexString();
  const alliance = getOrCreateAlliance(allianceId);
  alliance.state = 2;
  alliance.stateHint = stateToHint(2);
  alliance.fundingFailed = true;
  alliance.save();
}

export function handleRefunded(event: RefundedEventLog): void {
  const allianceId = event.address.toHexString();
  const stats = getOrCreateParticipant(allianceId, event.params.user);

  const entity = new RefundEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  entity.alliance = allianceId;
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.txHash = event.transaction.hash;
  entity.save();

  stats.refunds = stats.refunds.plus(event.params.amount);
  stats.save();
}

export function handleNFTBought(event: NFTBoughtEventLog): void {
  const allianceId = event.address.toHexString();
  const alliance = getOrCreateAlliance(allianceId);

  const entity = new NFTBuyEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  entity.alliance = allianceId;
  entity.nftAddress = event.params.nftAddress;
  entity.tokenId = event.params.tokenId;
  entity.price = event.params.price;
  entity.seller = event.params.seller;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.txHash = event.transaction.hash;
  entity.save();

  alliance.nftAddress = event.params.nftAddress;
  alliance.nftTokenId = event.params.tokenId;
  alliance.state = 1;
  alliance.stateHint = stateToHint(1);
  alliance.save();
}

export function handleVoted(event: VotedEventLog): void {
  const allianceId = event.address.toHexString();
  const stats = getOrCreateParticipant(allianceId, event.params.voter);

  const entity = new SaleVoteEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  entity.alliance = allianceId;
  entity.voter = event.params.voter;
  entity.weight = event.params.weight;
  entity.buyer = event.params.buyer;
  entity.price = event.params.price;
  entity.saleDeadline = event.params.saleDeadline;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.txHash = event.transaction.hash;
  entity.save();

  stats.votes = stats.votes.plus(BigInt.fromI32(1));
  stats.save();
}

export function handleSaleExecuted(event: SaleExecutedEventLog): void {
  const allianceId = event.address.toHexString();
  const alliance = getOrCreateAlliance(allianceId);
  const protocol = getOrCreateProtocol();

  const entity = new SaleExecutionEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  entity.alliance = allianceId;
  entity.buyer = event.params.buyer;
  entity.price = event.params.price;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.txHash = event.transaction.hash;
  entity.save();

  alliance.state = 2;
  alliance.stateHint = stateToHint(2);
  alliance.lastSalePrice = event.params.price;
  alliance.save();

  protocol.salesExecuted = protocol.salesExecuted.plus(BigInt.fromI32(1));
  protocol.save();
}

export function handleEmergencyVoted(event: EmergencyVotedEventLog): void {
  const allianceId = event.address.toHexString();
  const stats = getOrCreateParticipant(allianceId, event.params.voter);

  const entity = new EmergencyVoteEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  entity.alliance = allianceId;
  entity.voter = event.params.voter;
  entity.weight = event.params.weight;
  entity.recipient = event.params.recipient;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.txHash = event.transaction.hash;
  entity.save();

  stats.emergencyVotes = stats.emergencyVotes.plus(BigInt.fromI32(1));
  stats.save();
}

export function handleEmergencyWithdrawn(event: EmergencyWithdrawnEventLog): void {
  const allianceId = event.address.toHexString();
  const alliance = getOrCreateAlliance(allianceId);

  const entity = new EmergencyWithdrawEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  entity.alliance = allianceId;
  entity.recipient = event.params.recipient;
  entity.nftAddress = event.params.nftAddress;
  entity.tokenId = event.params.tokenId;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.txHash = event.transaction.hash;
  entity.save();

  alliance.state = 2;
  alliance.stateHint = stateToHint(2);
  alliance.nftAddress = event.params.nftAddress;
  alliance.nftTokenId = event.params.tokenId;
  alliance.save();
}
