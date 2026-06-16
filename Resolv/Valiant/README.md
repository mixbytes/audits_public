# Resolv Valiant Security Audit Report

###### tags: `Resolv`, `Valiant`

## 1. Introduction

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 


### 1.2 Executive Summary
Valiant is a product-agnostic framework for issuing **permissioned, asset-backed ERC-20 tokens**. Each on-chain product (e.g. `primeUSD`) is a configured deployment of these contracts.

A product consists of a **share token** (the issued ERC-20, transfer-restricted to a whitelist), a **deposit token** (the backing collateral, e.g. USDC), and a **request manager** that mints shares against deposits and burns shares to release deposits, gated by an oracle-derived price and an off-chain completer.

The mint/burn flow is **asynchronous**: providers create requests on-chain; a privileged off-chain completer assigns the precise share/deposit amount within a configured deviation tolerance.

In scope are an upgradeable six-decimal ERC20 `PermissionedToken` whose transfers are gated by an `AddressesWhitelist`, minting constrained by an optional `MintGuard`, an admin-managed on-chain price feed `PriceStorage`, and an immutable `ExternalRequestsManager` that lets whitelisted providers asynchronously request mints and burns of deposit collateral against issued shares, with privileged off-chain completers finalizing requests against oracle prices within configurable deviation bounds.

The security review was conducted over 3 working days via manual code review and a proprietary AI-assisted analysis tool, followed by a re-audit of client remediations.

The review examined both the in-scope contract logic and how those components interact at runtime with configured ERC20 assets, the treasury, and the oracle interface. We also applied MixBytes' standard internal checklist covering access control, reentrancy, accounting and rounding, idempotency, pause semantics, and privileged configuration paths.

Off-chain trust roots — the price-setter service, mint/burn completer operators, and the treasury Safe/EOA — were out of scope. ERC20 implementations other than PermissionedToken configured as baseAsset or quoteAsset are external to the scoped source files and were not subject to line-by-line source review. Mainnet deployment verification did review the configured asset addresses and constructor/initializer arguments.

Key notes:

- In some cases the mint guard can allow minting up to two window limits — for example at the boundary of two consecutive windows (the window is discrete, not sliding), and when rotating via `PermissionedToken.setMintGuard()` (guard rotation resets rate limits). However, in the current implementation this is not critical, since an attack would bypass at most one full rate limit. For example, with a mint guard of 1% TVL per hour, if an attacker steals minter and burner keys to mint slightly above the fair amount within deviation and immediately burn slightly below, they could mint ~2.02% of TVL across two window boundaries. **This is intended;** limits should be configured to account for this nuance.
- In `preMint()`, `effectiveLimit` depends on `totalSupply`, but minting increases `totalSupply`, which expands `effectiveLimit`. For example, with `bpsLimit = 10%` and `totalSupply = 100M`, one bucket can mint ~11M rather than 10M. **This is intended:** this is a convergent series with a fixed ceiling. 
- **Escrowed shares trapped on provider de-whitelist or token pause**. If a provider opens a burn request and is later removed from the token transfer whitelist, `cancelBurn()` reverts. However, the token is permissioned, so this is not an issue.
- **PriceStorage update window vs staleness:** After each price publish at time `T`, the next `setPrice()` is allowed only once `block.timestamp >= T + minUpdateInterval`, while `isStale()` becomes true when `block.timestamp > T + maxStaleness`. The price setter must therefore land every refresh in the interval `(T + minUpdateInterval, T + maxStaleness]` (on-chain only requires `minUpdateInterval < maxStaleness`). If `maxStaleness - minUpdateInterval` is too tight relative to off-chain latency (bot interval, retries, step-bound rejections, idempotency key handling), the feed can go stale even with a diligent operator — blocking `completeMint()` / `completeBurn()` and `MintGuard.preMint()`. We recommend configuring `maxStaleness` with a comfortable margin above `minUpdateInterval` (and above the real-world update cadence), not the minimal gap that passes initialization checks.
- **`PermissionedToken` `MINTER_ROLE` and `BURNER_ROLE` should either be `ExternalRequestsManager` or an extremely well-guarded multisig/DAO:** In the standard deployment, both roles are granted to `ExternalRequestsManager` at initialization; alternate holders should only be considered in non-standard operational scenarios.
- `PermissionedToken.initialize` / `PriceStorage.initialize` can be frontrun in a non-atomic deployment process. **We recommend using atomic proxy deployment.**
- **`DEFAULT_ADMIN_ROLE` should be an extremely well-guarded multisig or DAO.** In case of compromise, it can drain all funds from the protocol.
- **`CONFIG_ROLE`/`ISSUANCE_CONFIG_ROLE` should be a well-guarded multisig or DAO.** Compromise of it (esp. together with `PRICE_SETTER_ROLE`) would allow bypassing issuance constraints.
- **`PRICE_SETTER_ROLE` should also be extremely well-guarded.**
- Although ERM `cancelBurn()` deliberately has no the `whenNotPaused` modifier, pausing the `PermissionedToken` will still block `cancelBurn()`, since the refund transfer goes through the token's `_update()` hook, which reverts while paused.
- **Oracle migration nuances.** `PriceStorage.getPrice()` never reverts, but if another oracle whose `getPrice()` can revert is used, `setOracle()` will may break. Also, when migrating to a new oracle while the old one's price is stale and far from the market, the new oracle must initially be seeded near the old price (within deviation) before moving to the new level. **This is intended.**
- **`completeMint()` / `completeBurn()` MEV risk:** Completion transactions are built off-chain, presumably against the oracle price the operator expects at broadcast time. If a `PriceStorage.setPrice()` update is visible in the public mempool, an attacker can bundle their own trade with the `setPrice()` transaction to execute close to when the off-chain server builds and submits the completion, which may allow the attacker to extract value from the protocol. **We recommend sending oracle price updates through a private mempool.**

### 1.3 Project Overview

#### Summary

| Title    | Description             |
| -------- | ----------------------- |
| Client   | Resolv                  |
| Category | RWA                     |
| Project  | Valiant                 |
| Type     | Solidity                |
| Platform | EVM                     |
| Timeline | 21.05.2026 - 15.06.2026 |

#### Scope of Audit

| File | Link |
| --- | --- |
| valiant/src/AddressesWhitelist.sol                  | [https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/AddressesWhitelist.sol](https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/AddressesWhitelist.sol)                                   |
| valiant/src/ExternalRequestsManager.sol             | [https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/ExternalRequestsManager.sol](https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/ExternalRequestsManager.sol)                         |
| valiant/src/MintGuard.sol                           | [https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/MintGuard.sol](https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/MintGuard.sol)                                                     |
| valiant/src/PermissionedToken.sol                   | [https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/PermissionedToken.sol](https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/PermissionedToken.sol)                                     |
| valiant/src/PriceStorage.sol                        | [https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/PriceStorage.sol](https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/PriceStorage.sol)                                               |
| valiant/src/interfaces/IAddressesWhitelist.sol      | [https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IAddressesWhitelist.sol](https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IAddressesWhitelist.sol)           |
| valiant/src/interfaces/IExternalRequestsManager.sol | [https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IExternalRequestsManager.sol](https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IExternalRequestsManager.sol) |
| valiant/src/interfaces/IMintGuard.sol               | [https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IMintGuard.sol](https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IMintGuard.sol)                             |
| valiant/src/interfaces/IOracle.sol                  | [https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IOracle.sol](https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IOracle.sol)                                   |
| valiant/src/interfaces/IPermissionedToken.sol       | [https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IPermissionedToken.sol](https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IPermissionedToken.sol)             |
| valiant/src/interfaces/IPriceStorage.sol            | [https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IPriceStorage.sol](https://github.com/resolv-im/resolv-contracts/blob/5cf7b0b8890c9015ba980f86635e5a4e3a10576f/valiant/src/interfaces/IPriceStorage.sol)                       |

#### Versions Log

| Date       | Commit Hash                              | Note           |
| ---------- | ---------------------------------------- | -------------- |
| 21.05.2026 | 5cf7b0b8890c9015ba980f86635e5a4e3a10576f | Initial Commit |
| 01.06.2026 | a7f20d7cb8bc8ea7668114539dcba25813e21da9 | Commit for re-audit |
| 10.06.2026 | 55773c99dd2c0e64be4378923c63672fd7a92250 | Commit for re-audit |

***
#### Mainnet Deployments

File | Address | Blockchain
--- | --- | ---
AddressesWhitelist.sol | [0xf436F5AD67D4dC60446420E83E22B7B5639A4f6c](https://etherscan.io/address/0xf436F5AD67D4dC60446420E83E22B7B5639A4f6c) | Ethereum
PermissionedToken.sol (proxy, primeUSD) | [0x7Ea76108975EC0998B9bc2db04B4ECa986400DD7](https://etherscan.io/address/0x7Ea76108975EC0998B9bc2db04B4ECa986400DD7) | Ethereum
PermissionedToken.sol (impl) | [0xb0b01a72b6d32142BB6794A7033769F0e2FCF493](https://etherscan.io/address/0xb0b01a72b6d32142BB6794A7033769F0e2FCF493) | Ethereum
ProxyAdmin.sol (Token) | [0x3257339553fff27B311eE1fEBD7FA6bB77385056](https://etherscan.io/address/0x3257339553fff27B311eE1fEBD7FA6bB77385056) | Ethereum
PriceStorage.sol (proxy) | [0x8CDa03E2004c35e07963fb792C6b7511DabEE369](https://etherscan.io/address/0x8CDa03E2004c35e07963fb792C6b7511DabEE369) | Ethereum
PriceStorage.sol (impl) | [0x03e0116B73F493A6aB6C1a5066F30A11350B9cFb](https://etherscan.io/address/0x03e0116B73F493A6aB6C1a5066F30A11350B9cFb) | Ethereum
ProxyAdmin.sol (Oracle) | [0x3FC12e4773b10B0d0D5e02De042261868e10852D](https://etherscan.io/address/0x3FC12e4773b10B0d0D5e02De042261868e10852D) | Ethereum
MintGuard.sol | [0x5501AA12F419B325a46ee8c7d6b2D89FD62da289](https://etherscan.io/address/0x5501AA12F419B325a46ee8c7d6b2D89FD62da289) | Ethereum
ExternalRequestsManager.sol | [0x8C14B6e8EC9968cd9c69EEdeA4A1295AEc5E5D6e](https://etherscan.io/address/0x8C14B6e8EC9968cd9c69EEdeA4A1295AEc5E5D6e) | Ethereum

The deployment was reviewed against https://github.com/resolv-im/resolv-contracts/commit/55773c99dd2c0e64be4378923c63672fd7a92250

Verified on-chain source for `AddressesWhitelist`, `PermissionedToken` (impl), `PriceStorage` (impl), `MintGuard`, and `ExternalRequestsManager` matches the local repository byte-for-byte (including OpenZeppelin dependencies). Proxy contracts (`PermissionedToken`, `PriceStorage`) and both `ProxyAdmin` instances are standard OpenZeppelin `TransparentUpgradeableProxy` / `ProxyAdmin` and also match the vendored OZ sources. ERC-1967 implementation slots resolve as expected: the primeUSD token proxy points to [`0xb0b01a72b6d32142BB6794A7033769F0e2FCF493`](https://etherscan.io/address/0xb0b01a72b6d32142BB6794A7033769F0e2FCF493) and the PriceStorage proxy points to [`0x03e0116B73F493A6aB6C1a5066F30A11350B9cFb`](https://etherscan.io/address/0x03e0116B73F493A6aB6C1a5066F30A11350B9cFb).

Configured asset wiring was verified on-chain. `PriceStorage` reports `baseAsset` = primeUSD proxy ([`0x7Ea76108975EC0998B9bc2db04B4ECa986400DD7`](https://etherscan.io/address/0x7Ea76108975EC0998B9bc2db04B4ECa986400DD7), symbol `primeUSD`, 6 decimals) and `quoteAsset` = Circle USDC ([`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48), `USDC`, 6 decimals), with `priceDecimals = 8`. `ExternalRequestsManager` resolves `issueToken` / `depositToken` to the same addresses via immutable constructor wiring from `oracle.baseAsset()` / `oracle.quoteAsset()`, with `oracle` pointing to the `PriceStorage` proxy. `MintGuard` references the same `token` and `oracle`. The `baseAsset` address is the audited `PermissionedToken` deployment; `quoteAsset` is the canonical Ethereum mainnet USDC contract.

Admin ownership is split across two Gnosis Safe proxies (singleton [`0x41675C099F32341bf84BFc5382aF534df5C7461a`](https://etherscan.io/address/0x41675C099F32341bf84BFc5382aF534df5C7461a), Safe v1.4.1). The valiant admin Safe ([`0x14d7d788f9C71A2cDB851DF884fB908050DFb222`](https://etherscan.io/address/0x14d7d788f9C71A2cDB851DF884fB908050DFb222)) owns the primeUSD proxy, PriceStorage proxy, both ProxyAdmins, `MintGuard`, and `ExternalRequestsManager`; it uses threshold `3` with `5` EOA owners. `AddressesWhitelist` is owned separately by Safe [`0x7bb70aa3762Bcfd5C6980A16b44627eF84f27916`](https://etherscan.io/address/0x7bb70aa3762Bcfd5C6980A16b44627eF84f27916) with threshold `2` and `4` EOA owners. All listed owners are EOAs; no nested Safes or controller contracts were observed on the ownership paths checked.

### 1.4 Security Assessment Methodology

#### Project Flow

| **Stage** | **Scope of Work** |
|-----------|------------------|
| **Stage 1: Interim Audit** | **Project Architecture Review:**<br>**Objective:** Understand the overall structure of the protocol and identify potential security risks, including primitives and abstractions implemented by the system, how they interact architecturally, and where design or integration weaknesses could be exploited.<br> - Understanding overall system design and contract interactions.<br> - Mapping responsibilities of each component and protocol workflows.<br> - Conducting a thorough line-by-line review of contracts and modules.<br> - Tracing execution paths and mapping state transitions.<br> - Identifying trust boundaries and external integrations.<br> - Forming an independent architectural understanding directly from code before validating documentation.<br> - Running the project test suite to observe implementation behavior and encoded invariants.<br> - Reviewing documentation, specifications, READMEs, and deployment guides and reconciling them with code. |
| **Stage 1: Interim Audit** | **Adversarial Code Review:**<br>**Objective:** Identify potential vulnerabilities specific to the protocol architecture, business logic, and economic mechanisms.<br> - Analyzing the codebase from an attacker's perspective, focusing on what can fail rather than only confirming intended behavior.<br> - Searching for overlooked edge cases, invalid assumptions, unexpected call sequences, and unsafe state transitions.<br> - Attempting to violate protocol invariants and identifying scenarios where system guarantees break.<br> - Analyzing economic attack surfaces including liquidation logic, oracle dependencies, vault accounting, and cross-contract interactions.<br> - Writing targeted tests, modelling adversarial scenarios, applying mutation testing and fuzzing, and developing proof-of-concept exploits.<br> - Conducting independent exploit path discovery by each auditor to reduce anchoring bias.<br> - Reviewing high-risk code collaboratively in pair-auditing sessions led by the Team Lead. |
| **Stage 1: Interim Audit** | **Systematic Vulnerability Analysis:**<br>**Objective:** Apply structured analysis and known attack patterns to ensure comprehensive coverage across the codebase.<br> - Reviewing code against an internally maintained vulnerability checklist derived from past exploits and research.<br> - Analyzing common DeFi attack classes such as reentrancy, accounting manipulation, oracle manipulation, privilege escalation, and state desynchronization.<br> - Using proprietary AI tooling to surface candidate issues across broader attack vectors.<br> - Manually validating and triaging AI-generated candidates. |
| **Stage 1: Interim Audit** | **Consolidation of Auditors' Reports:**<br>**Objective:** Merge interim inputs from all auditors into a coherent report with consistent severity levels and reproducible findings.<br> - Cross-checking findings across auditors.<br> - Consolidating and deduplicating issues.<br> - Resolving discrepancies in severity assessments.<br> - Using proprietary AI tooling to assist with report drafting and consistency checks.<br> - Manually reviewing and finalizing the report narrative.<br> - Preparing the interim audit report for client review. |
| **Stage 2: Re-audit & Mainnet Deployment Verification** | **Re-audit:**<br>**Objective:** Verify that client remediations are correctly implemented and that the updated code does not introduce new vulnerabilities.<br> - Confirming each remediation matches the original recommendation.<br> - Documenting rationale for any unresolved findings.<br> - Verifying modified logic and integration points remain secure.<br> - Executing the project's tests after remediation, including targeted coverage of fixed areas.<br> - Using proprietary AI tooling on the updated codebase to surface potential new issues. |
| **Stage 2: Re-audit & Mainnet Deployment Verification** | **Mainnet Deployment Verification:**<br>**Objective:** Perform final verification of deployed contracts and configuration before issuing the public audit report.<br> - Verifying deployed contract bytecode across all target networks matches the build produced from the audited commit using identical compiler version, settings, and project configuration.<br> - Reviewing constructor and initializer arguments used in deployment.<br> - Verifying proxy deployment order, initialization flow, and admin configuration.<br> - Ensuring implementations are not left uninitialized or exposed to initialization front-running.<br> - Publishing the final report after alignment between client and audit team. |

***
### 1.5 Risk Classification

#### Severity Level Matrix

| Severity               | Impact: High | Impact: Medium | Impact: Low |
| ---------------------- | ------------ | -------------- | ----------- |
| **Likelihood: High**   | Critical     | High           | Medium      |
| **Likelihood: Medium** | High         | Medium         | Low         |
| **Likelihood: Low**    | Medium       | Low            | Low         |

#### Impact

- **High** – Theft exceeding 0.5% of the protocol's TVL, partial or complete blocking of funds on the contract without the possibility of withdrawal (>0.5%), or loss of user funds exceeding 1% for users interacting with the protocol.
- **Medium** – Contract lock that can only be resolved through a contract upgrade, one-time theft of rewards or an amount up to 0.5% of the protocol's TVL, or funds lock where withdrawal is still possible by an administrator.
- **Low** – One-time contract lock that can be resolved by an administrator without requiring a contract upgrade.

#### Likelihood

- **High** – An event with an estimated 50–60% probability of occurring within a year, which can be triggered by any actor (e.g., due to a market condition that the actor cannot influence).
- **Medium** – An unlikely event (10–20% probability of occurring) that can be triggered by a trusted actor.
- **Low** – A highly unlikely event that can only be triggered by the contract owner.

#### Action Required

- **Critical** – Must be fixed as soon as possible.
- **High** – Strongly advised to be fixed in order to minimize potential risks.
- **Medium** – Recommended to be fixed to improve security and stability.
- **Low** – Recommended to be fixed to improve overall robustness and efficiency.

#### Finding Status

- **Fixed** – The recommended fixes have been implemented in the project code and the issue no longer impacts the security of the protocol.
- **Partially Fixed** – The recommended fixes have been partially implemented, reducing the impact of the finding, but the issue has not been fully resolved.
- **Acknowledged** – The recommended fixes have not been implemented, and the finding remains unresolved or has been accepted by the project team without code changes.

### 1.6 Summary of Findings

#### Findings Count

| Severity     | Count |
| ------------ | ----- |
| **Critical** | 0     |
| **High**     | 0     |
| **Medium**   | 0     |
| **Low**      | 9     |

## 2. Findings Report

### 2.1 Critical

Not found.

---

### 2.2 High

Not found.

---

### 2.3 Medium

Not found.

---

### 2.4 Low

#### 1. Inconsistent `PriceStorage` bounds can block all new price updates
##### Status
Fixed in https://github.com/resolv-im/resolv-contracts/commit/a7f20d7cb8bc8ea7668114539dcba25813e21da9

##### Description
`PriceStorage._setPrice()` applies two independent constraints on every new price: `minPrice <= x <= maxPrice` and `lowerBoundPercentage` / `upperBoundPercentage` derived from the last price.

`setMinPrice()` and `setMaxPrice()` are callable by `CONFIG_ROLE` and only require `minPrice < maxPrice`. They do not check that `minPrice <= lastPrice <= maxPrice`.

A privileged admin due to human error can configure, for example, `minPrice < maxPrice << lastPrice.value`. Every subsequent `setPrice()` must pick `_price <= maxPrice`, but the step-bound logic still anchors on how much the new price can be lowered; so the lowest new price may still be greater than `maxPrice`, making the new price unviable, and the oracle stale.

##### Recommendation
We recommend enforcing consistency with the last price in `setMinPrice()` / `setMaxPrice()`.

> **Client's Commentary:**
> Fixed. [`13fadf8`](https://github.com/resolv-im/resolv-contracts/commit/13fadf8) 
> `setMinPrice` and `setMaxPrice` now also revert if the new bound would put `lastPrice.value` outside `[minPrice, maxPrice]` (`MinPriceAboveLastPrice` / `MaxPriceBelowLastPrice`).

---

#### 2. Large mint requests can be uncompletable under `MintGuard` per-block cap
##### Status
Acknowledged

##### Description
`ExternalRequestsManager.requestMint()` accepts any deposit above `minMintRequestAmount` and does not check `MintGuard.mintLimitPerBlock`. When `completeMint()` runs, it calls `PermissionedToken.mint()`, which invokes `MintGuard.preMint(_sharesToMint, totalSupply())`. The guard requires `mintedPerBlock[block.number] + _amount <= mintLimitPerBlock` in a **single** transaction — there is no way to split one request across blocks.

If the oracle-implied share amount for the escrowed deposit (or the completer’s chosen `_sharesToMint` that still satisfies `priceDeviationBps` against `actualShares`) exceeds `mintLimitPerBlock`, every `completeMint()` attempt reverts with `MintRateLimitExceeded`. The request stays in `CREATED` with `depositToken` locked on the manager until the provider calls `cancelMint()` or parameters change. This is especially likely when `minExpectedAmount` or the fair mint size is above the per-block limit.

##### Recommendation
We recommend rejecting mint requests that exceed `mintLimitPerBlock`.

> **Client's Commentary:**
> Acknowledged
> Even if the user has already requested the mint, the operator may still get stuck at the completion step due to mint guard limits.
> Since mint completion is fully manual through the multisig and is not even quasi-instant, this flow could create unnecessary operational issues.

---

#### 3. Mint and burn requests have no on-chain expiry
##### Status
Acknowledged

##### Description
`requestMint()` and `requestBurn()` let the provider set `minExpectedAmount` (minimum shares to mint or minimum deposit to withdraw) but store **no deadline**. A request can remain in `CREATED` indefinitely with `depositToken` or `issueToken` escrowed on `ExternalRequestsManager`.

`completeMint()` / `completeBurn()` price the fill using the **current** oracle at completion time, not the price when the request was opened. If the oracle moves against the provider while the request is pending, the completer can still finalize within `priceDeviationBps` and `minExpectedAmount` — capturing positive slippage for the protocol/treasury (fewer shares minted per deposit, or less deposit returned per burn) while honoring the provider’s floor.

##### Recommendation
We recommend adding an on-chain expiry (e.g. `deadline` timestamp or max lifetime) after which only the provider can `cancelMint()` / `cancelBurn()`, or completion must use pricing rules tied to request creation time.

> **Client's Commentary:**
> Acknowledged
> Since the product is permissioned and completion is fully manual through the multisig (not quasi-instant), an on-chain deadline would create operational friction and degrade UX without adding meaningful protection. Providers retain their own settlement floor via `minExpectedAmount` and can `cancelMint` / `cancelBurn` at any time before completion.

---

#### 4. `ExternalRequestsManager.setPriceDeviationBps()` — upper bound of 100% allows settlement at `[0, 2×actual]`
##### Status
Acknowledged

##### Description
On completion, the completer chooses `_sharesToMint` / `_depositToReturn`. On-chain checks require that the chosen amount lies within `priceDeviationBps` of the oracle-derived `actualShares` / `actualDeposit` (`_assertWithinDeviation`).

`setPriceDeviationBps()` (`ISSUANCE_CONFIG_ROLE`) allows any value from `1` up to `10_000` bps (100%). At the maximum, the completer can pick an amount up to **twice** the oracle-derived figure (or near zero on the other side), subject only to `minExpectedAmount`. 

If `ISSUANCE_CONFIG_ROLE` or `MINT_COMPLETER_ROLE` / `BURN_COMPLETER_ROLE` is compromised, governance can widen deviation to 100% and maximize extractable spread versus a low provider floor.

##### Recommendation
We recommend adding an on-chain upper bound on `priceDeviationBps` well below 100% (e.g. tens of bps). Keep operational completer keys and `ISSUANCE_CONFIG_ROLE` on multisig; document that `minExpectedAmount` must reflect the intended worst-case fill.

> **Client's Commentary:**
> Acknowledged. The value will be set within reasonable bounds at deployment.

---

#### 5. `PriceStorage.initialize()` missing `minUpdateInterval < maxStaleness` cross-check
##### Status
Fixed in https://github.com/resolv-im/resolv-contracts/commit/a7f20d7cb8bc8ea7668114539dcba25813e21da9

##### Description
`PriceStorage`'s public setters enforce the coherence invariant `minUpdateInterval < maxStaleness`: `setMaxStaleness()` requires `minUpdateInterval < _newMaxStaleness`; `setMinUpdateInterval()` requires `_interval < maxStaleness`. `initialize()` does not enforce this cross-check between `p.minUpdateInterval` and `p.maxStaleness`.

With `maxStaleness = 60` and `minUpdateInterval = 3600` (each valid in isolation), `initialize()` succeeds. After 60 seconds, `isStale()` returns true, but the next price write is blocked until `block.timestamp >= lastPrice.timestamp + minUpdateInterval` (+3600s) — always after the stale deadline. Every `completeMint()`, `completeBurn()`, and `MintGuard.preMint()` then reverts with `OracleStale()`.

##### Recommendation
We recommend adding `require(p.minUpdateInterval < p.maxStaleness, InvalidParams())` in `PriceStorage.initialize()` immediately after `_setMaxStaleness` / `_setMinUpdateInterval`, mirroring the public setters, so a misconfigured deployment reverts at init rather than shipping a permanently stale oracle.

> **Client's Commentary:**
> Fixed — [`13fadf8`](https://github.com/resolv-im/resolv-contracts/commit/13fadf8)
> `initialize` now reverts with `MaxStalenessBelowMinUpdateInterval` if the invariant is violated, mirroring the existing runtime setters.

---

#### 6. `PriceStorage.initialize()` — `initialPrice == 0` permanently bricks subsequent `setPrice` via band collapse at zero
##### Status
Fixed in https://github.com/resolv-im/resolv-contracts/commit/a7f20d7cb8bc8ea7668114539dcba25813e21da9

##### Description
`PriceStorage.initialize()` enforces that `initialPrice` lies in `[minPrice, maxPrice]` but does not require `initialPrice != 0`. If the operator passes `minPrice == 0` and `initialPrice == 0`, initialization succeeds. Internal `_setPrice(bytes32(0), 0)` sets `lastPrice.value = 0`.

Later `setPrice()` calls compute the step band around `lastPrice.value` as `upperBound = prevPrice + (prevPrice * upperBoundPercentage) / BOUND_PERCENTAGE_DENOMINATOR` and `lowerBound = prevPrice - (prevPrice * lowerBoundPercentage) / BOUND_PERCENTAGE_DENOMINATOR`. With `prevPrice == 0`, both bounds are `0`, so any non-zero candidate reverts with `InvalidPriceRange`. There is no setter that resets `lastPrice` directly; recovery requires an implementation upgrade.

##### Recommendation
We recommend requiring `p.initialPrice != 0` and `p.minPrice != 0` in `initialize()`.

> **Client's Commentary:**
> Fixed — [`13fadf8`](https://github.com/resolv-im/resolv-contracts/commit/13fadf8)
> `_setMinPrice` rejects `0` (`InvalidMinPrice`), which transitively forces `initialPrice >= minPrice > 0` and eliminates the band-collapse-at-zero scenario.

---

#### 7. `ExternalRequestsManager.setOracle()` — rotation without probe bricks settlements until new oracle is seeded
##### Status
Fixed in https://github.com/resolv-im/resolv-contracts/commit/a7f20d7cb8bc8ea7668114539dcba25813e21da9

##### Description
`ExternalRequestsManager.setOracle(_newOracle)` enforces `baseAsset`, `quoteAsset`, and `shareScale` compatibility but does not call `!_newOracle.isStale()` or check that `_newOracle.getPrice() != 0`. Rotating to a structurally compatible but un-seeded oracle bricks all settlement paths until the new oracle is seeded.

##### Recommendation
We recommend requiring `!oracle.isStale()` and `oracle.getPrice() != 0` after the new pointer is written in `setOracle`.

> **Client's Commentary:**
> Fixed — [`2543fb2`](https://github.com/resolv-im/resolv-contracts/commit/2543fb2)
> Fixed in both `ExternalRequestsManager.setOracle` and `MintGuard.setOracle`: after the pointer is written, the new oracle must satisfy `!isStale()` and `getPrice() != 0`.

---

#### 8. Insufficient protection against compromised `MINT_COMPLETER_ROLE` / `BURN_COMPLETER_ROLE`
##### Status
Fixed in https://github.com/resolv-im/resolv-contracts/commit/a7f20d7cb8bc8ea7668114539dcba25813e21da9

##### Description
The current architecture does not sufficiently limit the damage in the event that operational roles responsible for completing mint and burn requests are compromised: `MINT_COMPLETER_ROLE` and `BURN_COMPLETER_ROLE`.

Both roles can choose the final execution value within `priceDeviationBps` of the oracle-derived price:

* `completeMint()` allows `MINT_COMPLETER_ROLE` to choose `_sharesToMint` at the upper edge of the allowed deviation band;
* `completeBurn()` allows `BURN_COMPLETER_ROLE` to choose `_depositToReturn` at the upper edge of the deviation band and pay funds out of the `treasury`.

As a result, if a completer key is compromised, especially if it is a hot key used by backend/server infrastructure, an attacker or a colluding whitelisted provider can repeatedly extract value from the allowed price deviation without compromising the oracle itself.

On the mint side, the damage is limited by `MintGuard.preMint()` through `mintLimitPerBlock`:

```solidity
mintedPerBlock[block.number] + _amount <= mintLimitPerBlock
```

However, this limit applies only per block. On Ethereum mainnet, blocks are roughly 12 seconds apart, so the attack can be repeated every block up to the configured block cap.

The approximate extract over the incident response window can be estimated as:

```text
numberOfBlocks × priceDeviationBps × mintLimitPerBlock
```

For example, if:

```text
priceDeviationBps = 1%
mintLimitPerBlock ≈ $2.5M
incident response time ≈ 1 hour ≈ 300 blocks
```

then the potential extract is:

```text
300 × 1% × $2.5M = $7.5M
```

If `priceDeviationBps = 10%`, the same scenario scales to approximately `$75M`.

`MintGuard.maxTotalSupply` is not a reliable incident cap. It checks:

```solidity
_currentSupply + _amount <= maxTotalSupply
```

where `_currentSupply` is the current `PermissionedToken.totalSupply()`.

In normal operation, `maxTotalSupply` is typically set above the current outstanding supply to avoid blocking protocol growth. Therefore, it does not define a tight upper bound on losses during a compromise. Moreover, after large burn operations, `totalSupply` may drop sharply while `maxTotalSupply` remains unchanged. The available mint headroom then becomes:

```text
maxTotalSupply - totalSupply
```

and can increase without any admin action. An attacker who can time mint operations around burn activity may obtain a larger available mint limit than before the burn.

The burn side is even less constrained on-chain. `completeBurn()` pays `_depositToReturn` from the `treasury` via:

```solidity
IERC20(depositToken).safeTransferFrom(treasury, provider, _depositToReturn)
```

Unlike mint completion, burn completion has no symmetric on-chain rate limit. The practical ceiling is the treasury balance and the ERC20 allowance granted to `ExternalRequestsManager`. If the allowance is unlimited or too large, a compromised `BURN_COMPLETER_ROLE` can extract value during the undetected compromise window up to:

```text
priceDeviationBps × processed burn volume
```

With sufficient burn volume and unlimited allowance, the exposure can approach:

```text
priceDeviationBps × totalSupply
```

which may correspond to 1–10% of TVL depending on the configured deviation.

The core issue is not a single missing limit, but that the protocol treats operational completer roles as if their compromise is unlikely or will be stopped immediately. Under a realistic incident model where a hot key may remain compromised for tens of minutes or around an hour, the current controls do not define a small, explicit, and governance-controlled loss budget. 

##### Recommendation
We recommend designing the mint/burn architecture under the assumption that `MINT_COMPLETER_ROLE` and `BURN_COMPLETER_ROLE` may be compromised, and that incident response may take a meaningful amount of time, for example around one hour.

For the mint side:

1. For small / hot mint flows, use a short rolling rate limit, such as an hourly mint limit, so that losses during a compromise window are bounded in advance.
2. Route large mint operations that cannot fit into hot-path limits through a separate flow requiring manual multisig approval, not an EOA running on servers.

For the burn side:

1. For small / hot burn flows, use a short rolling rate limit, such as an hourly burn limit, so that losses during a compromise window are bounded in advance.
2. Route large burn operations that cannot fit into hot-path limits through a separate flow requiring manual multisig approval, not an EOA running on servers.

Alternative approaches for the mint side:

1. Introduce a separate incident budget, such as `maxAvailableSharesToMint`, set by multisig rather than an operational EOA.
2. Decrease this budget on every successful mint.
3. Once the budget reaches zero, `preMint()` should revert until multisig explicitly restores the limit after verifying that monitoring does not indicate an ongoing attack.
4. Keep `maxTotalSupply` only as a long-term supply ceiling, not as the primary incident cap.

Alternative approaches for the burn side:

1. Use treasury allowance as an explicit incident throttle:
   * do not grant unlimited allowance;
   * keep the allowance from treasury to `ExternalRequestsManager` intentionally small;
   * allow exposure to decrease as burns are completed;
   * increase allowance only through multisig after checking monitoring.

2. Consider a separate `maxAvailableDepositToReturn`, decremented on each burn completion and restored only by multisig.

We also recommend configuring monitoring and alerts for completions near the upper edge of `priceDeviationBps`.

The objective is to ensure that compromise of a hot completer/burner roles does not become open access to `priceDeviationBps`-based extraction across the protocol’s available volume.

> **Client's Commentary:**
> Partially Fixed (mint) — [`8482b55`](https://github.com/resolv-im/resolv-contracts/commit/8482b55); Acknowledged (burn)
>`MintGuard` now enforces a rolling 1-hour window cap = `max(supply × mintLimitPerWindowBps / 10_000, mintLimitFloor)`. With suggested params (`bps=100`, `floor=$1M`, `window=1h`) the per-hour cycle extract on a $100M-supply product at 0.5% deviation drops from ~$14.85M to ~$10K — ~1500× reduction.
> Burn side: Sustained extraction via burn requires shares to burn, and minting them is now bound by `MintGuard`'s per-window cap — so the mint->burn cycle profit is bounded by the mint side. Pure burn drain is limited to the pre-existing balance of a colluding KYC'd provider (one-shot, not repeatable), further capped by the bounded treasury allowance to ERM which is refreshed only via multi-party approval. Net economic upside of attacking the burn path on top of `MintGuard` is negligible.

---

#### 9. Oracle rotation — no on-chain check that new price is within an acceptable band of the old oracle
##### Status
Fixed in https://github.com/resolv-im/resolv-contracts/commit/a7f20d7cb8bc8ea7668114539dcba25813e21da9

##### Description
`ExternalRequestsManager.setOracle()` and `MintGuard.setOracle()` validate structural compatibility but never compare the new oracle’s spot price to the price returned by the oracle being replaced.

##### Recommendation
We recommend checking that the new oracle's price is within an acceptable band of the old oracle's price.

> **Client's Commentary:**
> Fixed — [`2543fb2`](https://github.com/resolv-im/resolv-contracts/commit/2543fb2)
> `ERM.setOracle` reuses `priceDeviationBps` via `_assertWithinDeviation(newPrice, oldPrice)`. `MintGuard.setOracle` enforces an independently configurable `oracleRotationDeviationBps`

---

## 3. About MixBytes

**MixBytes** is a blockchain security firm specializing in the analysis of decentralized protocols and smart contract systems.

The company helps Web3 teams build resilient protocol architecture, smart contract logic, and economic mechanisms through a combination of AI-assisted analysis and senior human expertise.

Rather than focusing solely on one-time audits before deployment, MixBytes works with protocols across their entire lifecycle — from early architecture design to production audits and ongoing protocol evolution.

Our team consists of experienced security researchers, engineers, and protocol analysts with deep expertise in DeFi systems, adversarial protocol analysis, and smart contract security.

Over the years, MixBytes has worked with many of the most widely used protocols in the ecosystem, including **Lido**, **Aave**, **Curve**, **1inch**, **OKX**, **Mantle**, **Fluid**, **Gearbox**, **Resolv**, and others, helping teams identify vulnerabilities, strengthen protocol design, and improve the robustness of decentralized systems.

To enhance analysis efficiency and coverage, MixBytes also develops and uses internal AI-assisted tooling that helps surface potential risk signals during development and code review. These tools augment the work of senior auditors but do not replace expert analysis.

### Protocol Security Lifecycle

MixBytes supports protocols across the full lifecycle of their development and operation.
- **Design Review.** Independent assessment of protocol architecture and economic design before critical decisions are embedded in production code.
- **AI Tooling.** AI-assisted analysis integrated into development workflows to surface potential risk signals during protocol development.
- **Smart Contract Audit.** Comprehensive manual verification of smart contract logic and protocol invariants before production deployment.
- **Security Retainer.** Continuous expert support for protocol upgrades, integrations, governance changes, and evolving attack surfaces after launch.

### Contacts

- [**Website**](https://mixbytes.io/)
- [**GitHub**](https://github.com/mixbytes/audits_public)
- [**X**](https://x.com/MixBytes)
- **Mail:** [hello@mixbytes.io](mailto:hello@mixbytes.io)