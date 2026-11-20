# Gearbox Protocol Price Feeds and Signature Degen NFT Security Audit Report

###### tags: `Gearbox`

## 1. Introduction

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 

### 1.2 Executive Summary

The audited code extends Gearbox V3 in two areas: how collateral is priced and who may open a Credit Account. In oracles-v3, `FixedRateWindowPriceFeed` passes through the price of an underlying feed inside a window. The lower bound of the window grows over time at an annual rate set by the feed owner, and the upper bound is 2% above it. Prices above the window are capped, and prices below it revert. `MedianPriceFeed` combines one to three price feeds and returns the single price, the average of two, or the middle of three; it reverts when any source fails validation.

In permissionless, `SignatureDegenNFT` gates Credit Account opening with EIP-712 approvals from the market's opening signers. Each approval names an owner, a Credit Manager, a deadline and a nonce and is used once; the contract can also forward the opening to a further Degen NFT. In core-v3, a new `openCreditAccount` overload passes the approval to the Degen NFT in the opening transaction. Security depends on the gates admitting exactly the approved openings and on the feeds neither misvaluing collateral nor blocking liquidations for longer than operators can react.

The audit team reviewed the code from 16.11.2026 to 17.11.2026 and performed the re-audit on 19.11.2026. The scope covered the two new price feeds in oracles-v3, `SignatureDegenNFT` in permissionless, and the changes to `CreditFacadeV3` in core-v3. The review combined line-by-line inspection, threat modelling, tracing of opening and liquidation paths through Gearbox core and the market configuration, and proof-of-concept tests. Several independent reviewers, including AI-assisted ones, generated candidate issues, and every reported issue was validated manually.

#### Scope Limitations

The audit scope is limited to the files listed in the Scope of Audit. `CreditFacadeV3` was reviewed for its changes relative to the diff base rather than audited in full. Tests, deployment scripts and configuration, the rest of Gearbox core, permissionless and periphery, and external protocols were outside the audit scope, and were consulted only to establish whether in-scope behavior is reachable or harmful.

#### Review Coverage

In addition to the audit team's general smart-contract security checklist, the review covered the following questions specific to this codebase:

- Can a Credit Account be opened in a gated market without the required approvals, or on behalf of another owner, through either `openCreditAccount` overload?
- Are opening approvals bound to the signer set, owner, Credit Manager, deadline, nonce, contract and chain, and consumed exactly once?
- Can a third party invalidate, consume or front-run another owner's approval?
- Can `FixedRateWindowPriceFeed` report more than its underlying feed, or let its owner inflate the price by moving the window?
- Can one faulty or manipulated source move a `MedianPriceFeed` result outside the range of the honest sources?
- What happens to valuation, liquidation and the emergency levers while either feed reverts, including when one feed is nested in another?
- Do both feeds meet the price oracle's assumptions about decimals, staleness, skip-check flags and non-negative answers?

#### Additional Attack Hypotheses

In addition to the issues described in this report, the audit examined the following protocol-specific attack hypotheses.

- Whether an approval could be replayed on another `SignatureDegenNFT`, another chain or another Credit Manager, or counted twice through a duplicate or malleable signature. The EIP-712 domain, the signed fields and the strictly increasing signer order reject each of these.
- Whether a third party could open a Credit Account with another owner's approval. When a Degen NFT is set, the facade requires the caller to be the account owner, and the approval is consumed once.
- Whether the window owner could make `FixedRateWindowPriceFeed` report more than the underlying feed. The reported price never exceeds the underlying answer, and a new window is accepted only if the current answer lies inside it.
- Whether one bad source of a three-source median could push the result outside the two honest sources. Fuzz testing of the median found no such case.
- Whether switching a market from the 3_10 to the 3_11 credit facade loses the gate or stored approvals. Both survive the switch.

#### Additional Notes

- Both new feeds fail closed: `FixedRateWindowPriceFeed` reverts below its lower bound, which time alone reaches when the underlying grows more slowly than the configured rate, and `MedianPriceFeed` reverts when any source fails. The price oracle has no fallback, so while the main feed reverts no Credit Account holding the token can be liquidated, although borrowers can still repay. Forbidding the token or pausing the facade does not contain this, because any token holder can shield an account with a quota in the token by sending it 1 wei. The state ends when the window is moved or the feed is switched.
- `FixedRateWindowPriceFeed` caps the price at the upper bound, so an underlying that grows faster than the configured rate is reported too low until the window is moved. For a collateral token this makes liquidations earlier. For a pool underlying it understates debt, so accounts with other collateral look healthier than they are and are liquidated late.
- Despite its name, `SignatureDegenNFT` is not an NFT. It stores opening approvals instead of tokens and has none of the ERC-721 functions, so calls such as `balanceOf`, `ownerOf` or `transferFrom` revert and no `Transfer` events are emitted. Front ends, indexers and integrations that treat a market's Degen NFT as an ERC-721 token, as `DefaultDegenNFT` is, do not work with it.
- The emergency admin cancels an opening approval through `revokeOpening`, which also increments the approval nonce. This invalidates a bundle that the signers have already issued but nobody has recorded yet. Signers must therefore issue the next approval for the same owner and Credit Manager with a nonce above the revoked one.

Overall, the changes are compact and follow the existing conventions of Gearbox price feeds and Degen NFTs.

<div style="page-break-before: always"></div>

After the interim report, the client fixed all three Low-severity issues in `SignatureDegenNFT` in commits `391546a28c8b13ec134a6960b79e0e7bf09c00e4` and `9b74e7b8c483b8bca0b97813de899675d346006e`: the emergency admin now revokes approvals through a dedicated function, a zero signature threshold is rejected at deployment, and opening with signatures no longer fails when the same bundle has already been recorded. The price feeds and `CreditFacadeV3` did not change after the interim report. The audit team reviewed the changes; no new security issues were identified in the reviewed changes.

### 1.3 Project Overview

#### Summary

Title | Description
--- | ---
Client | Gearbox Protocol
Category | Lending
Project | Price Feeds and Signature Degen NFT
Type | Solidity
Platform | EVM
Timeline | 16.11.2026 – 19.11.2026

#### Scope of Audit

File | Link
--- | ---
contracts/oracles/FixedRateWindowPriceFeed.sol | [FixedRateWindowPriceFeed.sol](https://github.com/Gearbox-protocol/oracles-v3/blob/52ad93865669680f19360819c7390248308a15d2/contracts/oracles/FixedRateWindowPriceFeed.sol)
contracts/oracles/MedianPriceFeed.sol | [MedianPriceFeed.sol](https://github.com/Gearbox-protocol/oracles-v3/blob/52ad93865669680f19360819c7390248308a15d2/contracts/oracles/MedianPriceFeed.sol)
contracts/helpers/SignatureDegenNFT.sol | [SignatureDegenNFT.sol](https://github.com/Gearbox-protocol/permissionless/blob/9b74e7b8c483b8bca0b97813de899675d346006e/contracts/helpers/SignatureDegenNFT.sol)
contracts/credit/CreditFacadeV3.sol | [CreditFacadeV3.sol](https://github.com/Gearbox-protocol/core-v3/blob/934c2c8d187c3c25a11db201f0b6f795f3bcd921/contracts/credit/CreditFacadeV3.sol)


#### Versions Log

**oracles-v3**

Date | Commit Hash | Note
--- | --- | ---
16.11.2026 | 52ad93865669680f19360819c7390248308a15d2 | Initial Commit
17.11.2026 | 8a4cfff164e4648142c4b24f95f677c195500a8f | Final Commit (owner as a constructor parameter)

**permissionless**

Date | Commit Hash | Note
--- | --- | ---
16.11.2026 | 6fed941323c5e4a5b40a499bdf7428b4c8f9da60 | Initial Commit
17.11.2026 | d5f8d89b514b80009a4b1e4d021418252de017a3 | Contract type update
18.11.2026 | 391546a28c8b13ec134a6960b79e0e7bf09c00e4 | Re-audit Commit
19.11.2026 | 9b74e7b8c483b8bca0b97813de899675d346006e | Final Re-audit Commit (nonce increment on revocation)

**core-v3**

Date | Commit Hash | Note
--- | --- | ---
16.11.2026 | a53223a54f19a46a5cffd8104d622ac69f49c311 | Diff Base
16.11.2026 | 934c2c8d187c3c25a11db201f0b6f795f3bcd921 | Initial and Final Commit

#### Mainnet Deployments

Deployment verification will be conducted via https://bcr.gearbox.finance/

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

### 1.5 Risk Classification

#### Severity Level Matrix

| Severity  | Impact: High | Impact: Medium | Impact: Low |
|-----------|-------------|---------------|-------------|
| **Likelihood: High**   | Critical   | High    | Medium  |
| **Likelihood: Medium** | High       | Medium  | Low     |
| **Likelihood: Low**    | Medium     | Low     | Low     |

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

| Severity  | Count |
|-----------|-------|
| **Critical** | 0 |
| **High**     | 0 |
| **Medium**   | 0 |
| **Low**      | 3 |

## 2. Findings Report

### 2.1 Critical

NOT FOUND

---

### 2.2 High

NOT FOUND

---

### 2.3 Medium

NOT FOUND

---

### 2.4 Low

#### 1. Emergency admin passes the `burn` access check but cannot burn
##### Status
Fixed in https://github.com/Gearbox-protocol/permissionless/commit/9b74e7b8c483b8bca0b97813de899675d346006e

##### Description

`SignatureDegenNFT` stores opening approvals per account owner and Credit Manager ([`SignatureDegenNFT.sol:62`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L62)), and the access check of `burn` admits the market emergency admin, so that it can cancel an approval ([`SignatureDegenNFT.sol:207-211`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L207-L211)). However, `burn` receives only the owner. To find the Credit Manager, it calls `creditManager()` on its caller ([`SignatureDegenNFT.sol:117-118`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L117-L118), [`SignatureDegenNFT.sol:134`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L134)). A Credit Facade answers this call, but an emergency admin that is an EOA, a Safe or a `KillSwitchProxyCall` ([`KillSwitchProxy.sol:10-45`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/KillSwitchProxy.sol#L10-L45)) does not, so every `burn` call from the emergency admin reverts. As a result, the emergency admin cannot cancel an approval: an owner approved by mistake can still open a Credit Account until the approval's deadline.

##### Recommendation

We recommend adding a function for the emergency admin that takes the account owner and the Credit Manager as parameters, for example `revokeOpening(accountOwner, creditManager)`, and clears that approval and increments its nonce. With the Credit Manager passed explicitly, the contract no longer has to ask the caller for it, so the call works for any emergency admin. Both `burn` functions can then be left to Credit Facades.

#### 2. Zero `minSignaturesRequired` disables the signer gate
##### Status
Fixed in https://github.com/Gearbox-protocol/permissionless/commit/391546a28c8b13ec134a6960b79e0e7bf09c00e4
##### Description

The `SignatureDegenNFT` constructor accepts `minSignaturesRequired = 0` ([`SignatureDegenNFT.sol:99-107`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L99-L107)). `_approveOpening` counts only signatures from holders of `ROLE_OPENING_SIGNER` and reverts only when that count is below the threshold ([`SignatureDegenNFT.sol:195-198`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L195-L198)), so with a zero threshold a bundle signed by any key records an approval. Any user can then approve their own opening and open a Credit Account through `burn` with signatures ([`SignatureDegenNFT.sol:126-141`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L126-L141)) without a designated signer, and anyone can record an approval for any owner through `approveOpening` ([`SignatureDegenNFT.sol:145-147`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L145-L147)). A market meant to be gated by signer approvals becomes permissionless.

##### Recommendation

We recommend rejecting `minSignaturesRequired = 0` in the constructor.

#### 3. Opening with signatures can be front-run through `approveOpening`
##### Status
Fixed in https://github.com/Gearbox-protocol/permissionless/commit/391546a28c8b13ec134a6960b79e0e7bf09c00e4

##### Description

The 4-argument `openCreditAccount` passes the signed approval bundle to `SignatureDegenNFT.burn`, which records the approval and consumes it in the same call ([`CreditFacadeV3.sol:249-254`](https://github.com/Gearbox-protocol/core-v3/blob/934c2c8d187c3c25a11db201f0b6f795f3bcd921/contracts/credit/CreditFacadeV3.sol#L249-L254), [`SignatureDegenNFT.sol:126-141`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L126-L141)). Anyone can also record the same bundle through `approveOpening` ([`SignatureDegenNFT.sol:145-147`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L145-L147)), and a bundle is accepted only with the next nonce ([`SignatureDegenNFT.sol:182`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L182)). A third party who sees the owner's pending transaction can therefore copy the signatures and record them first. The nonce is then already used, and the owner's transaction reverts. The owner can still open through the 3-argument overload ([`CreditFacadeV3.sol:216-220`](https://github.com/Gearbox-protocol/core-v3/blob/934c2c8d187c3c25a11db201f0b6f795f3bcd921/contracts/credit/CreditFacadeV3.sol#L216-L220)), but only until the bundle's deadline; after it, the signers have to issue a new approval. `approveOpening` also accepts an expired bundle and overwrites a live approval ([`SignatureDegenNFT.sol:198-201`](https://github.com/Gearbox-protocol/permissionless/blob/d5f8d89b514b80009a4b1e4d021418252de017a3/contracts/helpers/SignatureDegenNFT.sol#L198-L201)), so a leaked bundle can make an approved opening fail later in the same way. Funds are not at risk.

##### Recommendation

We recommend not reverting in `_approveOpening` when a bundle is correctly signed but its nonce is already used; the function should then return without changing the stored approval. `burn` then consumes the approval that the front-runner recorded, and the owner's opening succeeds. `_approveOpening` should also reject expired bundles and refuse to replace an approval that is still live.

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
