# FlashAlliance Frontend Release Checklist

## 1. Contracts & Deployments
- [ ] `NEXT_PUBLIC_FACTORY_ADDRESS` matches deployed AllianceFactory.
- [ ] `NEXT_PUBLIC_TOKEN_ADDRESS` matches deployed FATK token.
- [ ] `NEXT_PUBLIC_FAUCET_ADDRESS` matches deployed faucet.
- [ ] `chainId` and network labels match deployment target.
- [ ] `/docs/deployments` updated with date/version/admin.

## 2. Frontend Build Gates
- [ ] `npm run build` passes.
- [ ] No TypeScript errors.
- [ ] No critical runtime errors on first load.
- [ ] No hydration mismatch warnings in key routes.

## 3. RPC & Data Reliability
- [ ] Primary RPC set in `.env`.
- [ ] Fallback RPC URLs configured.
- [ ] Subgraph optional path tested (enabled + disabled).
- [ ] Rate-limit (`429`) errors show user-friendly message.

## 4. Critical User Flows
- [ ] Connect wallet.
- [ ] Switch network.
- [ ] Create alliance.
- [ ] Approve + deposit.
- [ ] Vote to acquire.
- [ ] Execute buy.
- [ ] Vote sale + execute sale.
- [ ] Claim/refund paths.

## 5. Error UX
- [ ] Wallet reject (`4001`) handled clearly.
- [ ] Wrong network handled with guided switch.
- [ ] Stale address / not deployed errors are actionable.
- [ ] Faucet cooldown and liquidity errors are readable.

## 6. Documentation
- [ ] `/docs/changelog` updated for current release.
- [ ] `/docs/runbook` includes known reverts.
- [ ] `/docs/assumptions` reflects current risk boundaries.
- [ ] `/docs/release` reflects current go/no-go status.
- [ ] README env section matches actual code usage.

## 7. Open-Source Hygiene
- [ ] No private keys, secrets, or tokens committed.
- [ ] `.env` excluded from commit.
- [ ] `.env.example` complete and safe.
- [ ] Only required assets included.
- [ ] Manifest reviewed: `OPEN_SOURCE_MANIFEST.md`.

## 8. Legal/Policy Baseline
- [ ] `/terms-of-use` published.
- [ ] `/privacy-notice` published.
- [ ] Security/reporting policy links valid.
