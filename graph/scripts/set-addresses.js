const fs = require("node:fs");
const path = require("node:path");

const subgraphPath = path.resolve(__dirname, "..", "subgraph.yaml");
let yaml = fs.readFileSync(subgraphPath, "utf8");

const ZERO = "0x0000000000000000000000000000000000000000";

const factoryAddress = (process.env.FACTORY_ADDRESS || ZERO).trim();
const faucetAddress = (process.env.FAUCET_ADDRESS || ZERO).trim();
const factoryStartBlock = String(process.env.FACTORY_START_BLOCK || "0").trim();
const faucetStartBlock = String(process.env.FAUCET_START_BLOCK || "0").trim();

function replaceSourceValue(sourceName, key, value) {
  const pattern = new RegExp(`(name:\\s+${sourceName}[\\s\\S]*?${key}:\\s+)([^\\n]+)`, "m");
  yaml = yaml.replace(pattern, `$1${value}`);
}

replaceSourceValue("AllianceFactory", "address", `"${factoryAddress}"`);
replaceSourceValue("FATKFaucet", "address", `"${faucetAddress}"`);
replaceSourceValue("AllianceFactory", "startBlock", factoryStartBlock);
replaceSourceValue("FATKFaucet", "startBlock", faucetStartBlock);

fs.writeFileSync(subgraphPath, yaml);

console.log("Updated subgraph.yaml");
console.log(`AllianceFactory: ${factoryAddress} @ block ${factoryStartBlock}`);
console.log(`FATKFaucet: ${faucetAddress} @ block ${faucetStartBlock}`);
