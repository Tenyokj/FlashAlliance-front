import CopyIconButton from "@/app/components/CopyIconButton";

const chainId = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111", 10);
const chainLabel = chainId === 11155111 ? "Sepolia" : `Chain ${chainId}`;
const explorerBase = chainId === 11155111 ? "https://sepolia.etherscan.io/address/" : "https://etherscan.io/address/";
const deploymentDate = process.env.NEXT_PUBLIC_DEPLOYMENT_DATE ?? "2026-03-03";
const coreVersion = process.env.NEXT_PUBLIC_CORE_VERSION ?? "v1.0.0+patch-FLA-01-02-03";

const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS ?? "0x0000000000000000000000000000000000000000";
const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "0x0000000000000000000000000000000000000000";
const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS ?? "0x0000000000000000000000000000000000000000";
const protocolAdmin = process.env.NEXT_PUBLIC_PROTOCOL_ADMIN ?? "0x6eA54179ba3004bc35cfAf6A67ddd9C6e5A1c6cc";

export default function DocsDeploymentsPage() {
  return (
    <div className="docs-page">
      <section className="docs-hero plain">
        <p className="docs-kicker">Deployments</p>
        <h1>Live contracts and release metadata</h1>
        <p>Canonical addresses for frontend integration, monitoring, and user verification.</p>
      </section>

      <article id="live-sepolia" className="docs-prose">
        <h2>1. Live network</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Network</td>
              <td>{chainLabel}</td>
            </tr>
            <tr>
              <td>chainId</td>
              <td>{chainId}</td>
            </tr>
            <tr>
              <td>Deployment date</td>
              <td>{deploymentDate}</td>
            </tr>
            <tr>
              <td>Core version</td>
              <td>{coreVersion}</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article id="contracts-matrix" className="docs-prose">
        <h2>2. Contracts matrix</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Contract</th>
              <th>Address</th>
              <th>Role</th>
              <th>Owner/Admin</th>
              <th>Explorer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AllianceFactory</td>
              <td>
                <div className="address-row">
                  <span className="docs-address">{factoryAddress}</span>
                  <CopyIconButton value={factoryAddress} />
                </div>
              </td>
              <td>Creates alliance instances</td>
              <td>{protocolAdmin}</td>
              <td><a href={`${explorerBase}${factoryAddress}`} target="_blank" rel="noreferrer">View</a></td>
            </tr>
            <tr>
              <td>FATK</td>
              <td>
                <div className="address-row">
                  <span className="docs-address">{tokenAddress}</span>
                  <CopyIconButton value={tokenAddress} />
                </div>
              </td>
              <td>Funding and settlement ERC20</td>
              <td>{protocolAdmin}</td>
              <td><a href={`${explorerBase}${tokenAddress}`} target="_blank" rel="noreferrer">View</a></td>
            </tr>
            <tr>
              <td>FATKFaucet</td>
              <td>
                <div className="address-row">
                  <span className="docs-address">{faucetAddress}</span>
                  <CopyIconButton value={faucetAddress} />
                </div>
              </td>
              <td>Test token distribution</td>
              <td>{protocolAdmin}</td>
              <td><a href={`${explorerBase}${faucetAddress}`} target="_blank" rel="noreferrer">View</a></td>
            </tr>
          </tbody>
        </table>
      </article>

      <section id="release-meta" className="docs-callout plain">
        <h3>Operational note</h3>
        <p>
          Treat this page as source of truth for frontend env values. If any address changes, update this page and frontend
          runtime variables in the same release.
        </p>
      </section>
    </div>
  );
}
