import { Address, BigInt } from "@graphprotocol/graph-ts";
import { AllianceCreated } from "../generated/AllianceFactory/AllianceFactory";
import { Alliance as AllianceContract } from "../generated/AllianceFactory/Alliance";
import { Alliance as AllianceTemplate } from "../generated/templates";
import { Alliance, Protocol } from "../generated/schema";

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

function stateToHint(state: number): string {
  if (state == 0) return "Funding";
  if (state == 1) return "Acquired";
  if (state == 2) return "Closed";
  return "Unknown";
}

export function handleAllianceCreated(event: AllianceCreated): void {
  const protocol = getOrCreateProtocol();
  const allianceId = event.params.allianceAddress.toHexString();

  let alliance = Alliance.load(allianceId);
  if (alliance == null) {
    alliance = new Alliance(allianceId);
  }

  alliance.token = event.params.token;
  alliance.admin = event.params.admin;
  alliance.createdAt = event.block.timestamp;
  alliance.createdAtBlock = event.block.number;
  alliance.createdTxHash = event.transaction.hash;
  alliance.depositsCount = ZERO_BI;
  alliance.totalDepositedVolume = ZERO_BI;
  alliance.targetPrice = ZERO_BI;
  alliance.deadline = ZERO_BI;
  alliance.participantsCount = 0;
  alliance.fundingFailed = false;
  alliance.state = 0;
  alliance.stateHint = "Funding";

  const contract = AllianceContract.bind(event.params.allianceAddress);

  const targetPrice = contract.try_targetPrice();
  if (!targetPrice.reverted) {
    alliance.targetPrice = targetPrice.value;
  }

  const deadline = contract.try_deadline();
  if (!deadline.reverted) {
    alliance.deadline = deadline.value;
  }

  const participants = contract.try_getParticipants();
  if (!participants.reverted) {
    alliance.participantsCount = participants.value.length;
  }

  const state = contract.try_state();
  if (!state.reverted) {
    alliance.state = state.value; // просто присваиваем, state.value уже i32/number
    alliance.stateHint = stateToHint(alliance.state);
  }

  const nftAddress = contract.try_nftAddress();
  if (!nftAddress.reverted && nftAddress.value != ZERO_ADDRESS) {
    alliance.nftAddress = nftAddress.value;
  }

  const tokenId = contract.try_tokenId();
  if (!tokenId.reverted && tokenId.value.gt(ZERO_BI)) {
    alliance.nftTokenId = tokenId.value;
  }

  alliance.save();

  protocol.alliancesCreated = protocol.alliancesCreated.plus(BigInt.fromI32(1));
  protocol.save();

  AllianceTemplate.create(event.params.allianceAddress);
}
