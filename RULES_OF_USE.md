# FlashAlliance Rules of Use

## 1. Scope

These rules apply to this frontend repository, demo dApp environments, and public testing cycles announced by the project.

## 2. Demo Environment

- Demo deployments can be reset at any time.
- Contract addresses can change after node restart or redeploy.
- Test balances and test NFTs are non-production assets.

## 3. Wallet and Key Safety

- Use test-only wallets for local/testnet usage.
- Never share seed phrases or private keys.
- Verify token/factory/alliance/faucet addresses before signing.

## 4. Transaction Responsibility

- Users are responsible for confirming:
  - selected network
  - contract addresses
  - token approvals and tx params
- Gas is paid in native testnet token even if settlement token is FATK.

## 5. Issue Reporting Requirements

A valid report must include:

- exact steps to reproduce
- expected result
- actual result
- network and wallet address
- alliance address (if relevant)
- transaction hash and console error (if available)

See `REPORTING.md` and `SECURITY.md` for channels and format.

## 6. Reward Model

- Community rewards are FATK-denominated unless explicitly announced otherwise.
- This is not a default fiat bug bounty program.
- Reward amount is discretionary and depends on impact and quality of report/fix.

## 7. Prohibited Behavior

- Attempting to access non-public infrastructure without permission
- Phishing or key-harvesting attempts
- Misrepresenting demo behavior as guaranteed production guarantees

## 8. No Warranty (Demo Phase)

Current dApp is in active testing. Features may change, break, or be removed without notice.
