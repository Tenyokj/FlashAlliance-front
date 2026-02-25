import { BigInt } from "@graphprotocol/graph-ts";
import { Claimed as ClaimedEventLog } from "../generated/FATKFaucet/FATKFaucet";
import { FaucetClaimEvent, Protocol } from "../generated/schema";

const PROTOCOL_ID = "flashalliance";
const ZERO_BI = BigInt.fromI32(0);

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

export function handleClaimed(event: ClaimedEventLog): void {
  const protocol = getOrCreateProtocol();

  const claim = new FaucetClaimEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  claim.user = event.params.user;
  claim.amount = event.params.amount;
  claim.timestamp = event.params.timestamp;
  claim.blockNumber = event.block.number;
  claim.txHash = event.transaction.hash;
  claim.save();

  protocol.faucetClaims = protocol.faucetClaims.plus(BigInt.fromI32(1));
  protocol.faucetClaimedVolume = protocol.faucetClaimedVolume.plus(event.params.amount);
  protocol.save();
}
