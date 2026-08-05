# Lido TokenRateNotifier Security Audit Report

###### tags: `Lido`

## 1. Introduction

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 

    
### 1.2 Executive Summary
`TokenRateNotifier` is the L1 fan-out hub that is registered in `LidoLocator` as Lido's `postTokenRebaseReceiver`, so that Lido core (`Accounting`) invokes it exactly once per oracle report to broadcast the rebase event. It maintains a governance-curated registry of observers and forwards each rebase to them, isolating individual failures in a `try/catch` so one broken observer cannot block the report. This review covers an extension that introduces a second observer flavor: alongside the existing zero-argument `NoArgs` observers (L2 rate pushers that self-fetch `wstETH.stEthPerToken()`), a new `WithArgs` flavor receives the full per-rebase payload - most notably `sharesMintedAsFees` - enabling downstream consumers such as revenue/buyback engines to act on values that cannot be back-derived from a rate delta. Both flavors coexist in a single registry (capped at 32 entries), keyed by kind and validated at registration through ERC165.

The interim security review was conducted over 2 working days via manual code review and a proprietary AI-assisted analysis tool.

During the audit, our focus covered both the core notifier logic and its interactions with the surrounding integrations - the upstream trusted provider that drives `handlePostTokenRebase` and the downstream observer contracts invoked during fan-out. Beyond that, we worked through the standard internal checklist for this class of contract: access control, reentrancy, arithmetic and rounding behavior, storage packing correctness, and the revert-propagation semantics that determine whether a failing observer can halt the oracle report. The project-specific vectors examined during this engagement are enumerated below.

The `WithArgs` consumer `StakingRevenueSource`, as well as deploy/upgrade scripts and tests and mocks, were out of scope. Where the notifier's safety depends on the behavior of downstream observers, our assessment was limited to the integration assumptions visible from the in-scope code and the relevant interfaces, not a line-by-line audit of those components.

Below we set out our overall assessment, key assumptions, and main recommendations.
* **The [diff](https://github.com/lidofinance/core/pull/1843) is small and correct.** Storage packing is sound, the two interface IDs are distinct, swap-and-pop removal and payload forwarding are correct, and there are no memory-safety or access-control defects. Reentrancy is not reachable, since an observer can call neither `addObserver`/`removeObserver` (`onlyOwner`) nor `handlePostTokenRebase` (`onlyProvider`).
* **The one architectural concern is a pre-existing, accepted trade-off, not a bug in this [diff](https://github.com/lidofinance/core/pull/1843).** `Accounting` calls `handlePostTokenRebase` directly, with no `try/catch`. The notifier does `try/catch` each observer, but intentionally re-reverts on empty returndata (assumed out-of-gas), so such a failure escapes the inner catch, propagates through the unguarded outer call, and halts the oracle report. This mechanism predates the change; the diff only widens its exposure by routing a more complex `WithArgs` consumer onto that path. We recommend an explicit callback contract for `WithArgs` observers: `pushTokenRate(...)` must never empty-revert and must be gas-bounded.
* **The ownership recovery lever is flagged for attention, not as a finding.** `removeObserver` is the only on-chain remedy against a halting observer and is `onlyOwner`; via inherited OZ `Ownable`, renouncing ownership would freeze recovery permanently. We recommend overriding `renounceOwnership` to revert.
* **Payload forwarding is correct and pushes obligations onto the consumer.** The notifier forwards all seven values verbatim without validation, which is correct since they come from the trusted provider. The `WithArgs` consumer must therefore handle `_sharesMintedAsFees == 0` without empty-reverting. As the consumer keeps its own copy of `ITokenRatePusherWithArgs`, a CI check that the two signatures stay identical is advisable.
* **`WithArgs` raises worst-case fan-out gas while the observer cap is unchanged.** A `WithArgs` notification forwards seven `uint256` values (224 bytes) and typically drives heavier observer logic than the zero-argument `NoArgs` flavor, yet `MAX_OBSERVERS_COUNT` stays at 32. Since the report path has no gas cap, the safe headroom before a full fan-out risks out-of-gas is reduced relative to the `NoArgs`-only design. We recommend re-validating the worst-case gas of a full 32-observer `WithArgs` fan-out against the oracle report's gas budget, and considering a lower cap for the heavier flavor.
* **The fan-out has no per-observer gas isolation.** Each observer is called with all remaining gas, so a single observer that consumes nearly all of it can starve those that follow and, via the empty-data re-revert, take down the whole report. This is not exploitable under the DAO-curated trust model, but it is the structural root of the halting-report fragility above. We recommend considering a bounded per-observer gas stipend, weighed against the gas-estimation rationale in `_handlePushFailure`.
* **Each observer supports exactly one flavor.** An address is registered at most once: `addObserver` rejects a duplicate address regardless of `kind` (`_observerIndex` check), and `removeObserver` matches purely by address. The design therefore assumes an observer is either `NoArgs` or `WithArgs`, never both - registering one address under both flavors is not possible, and address-keyed removal would be ambiguous if it were. This assumption is sound as implemented.

### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client | Lido
Category| Liquid Staking
Project | TokenRateNotifier
Type| Solidity
Platform| EVM
Timeline| 07.07.2026 - 13.07.2026
    
#### Scope of Audit

File | Link
--- | ---
contracts/0.8.9/TokenRateNotifier.sol | https://github.com/lidofinance/core/blob/1572a1a4d9ff0efb9ff9aa2500facc67b7310dfc/contracts/0.8.9/TokenRateNotifier.sol
contracts/0.8.9/interfaces/ITokenRatePusherWithArgs.sol | https://github.com/lidofinance/core/blob/1572a1a4d9ff0efb9ff9aa2500facc67b7310dfc/contracts/0.8.9/interfaces/ITokenRatePusherWithArgs.sol
contracts/0.8.9/interfaces/ITokenRatePusher.sol | https://github.com/lidofinance/core/blob/1572a1a4d9ff0efb9ff9aa2500facc67b7310dfc/contracts/0.8.9/interfaces/ITokenRatePusher.sol
    
#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
07.07.2026 | 1572a1a4d9ff0efb9ff9aa2500facc67b7310dfc | Initial Commit
13.07.2026 | dc9066b6f9b5c6c3b65f4a4aac338427198f0e98 | Commit for Re-audit
    
#### Mainnet Deployments

File| Address | Blockchain
--- | --- | ---
TokenRateNotifier.sol | [0xbe05d12FD10919F1881125006523452F6aFf791b](https://etherscan.io/address/0xbe05d12fd10919f1881125006523452f6aff791b) | Ethereum

The deployment compiles byte-for-byte from the audit-scope source at commit `dc9066b6f9b5c6c3b65f4a4aac338427198f0e98`. Bytecode verification performed against on-chain state at block 25545333. Both the creation bytecode and the runtime bytecode match. The only deviations in the runtime code are the two `TOKEN_RATE_PROVIDER` immutable placeholders, both holding the expected value.

The contract was created by transaction [`0xa031ffa7509f7c253704915e3af973ae54057c53fb5086023792f961da52babc`](https://etherscan.io/tx/0xa031ffa7509f7c253704915e3af973ae54057c53fb5086023792f961da52babc) from the EOA `0xc0d0B847F3E0Cb87C68eD02208C01aA83b1800E2`. The appended constructor arguments decode to `initialOwner_ = 0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c` (Lido Aragon Agent) and `tokenRateProvider_ = 0x23ED611BE0E1a820978875C0122F92260804CDdf` (Lido `Accounting`). Both are correct: the `Accounting` instance reports `LIDO() = 0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84` (stETH) and `LIDO_LOCATOR() = 0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb` (canonical `LidoLocator`), and `LidoLocator.accounting()` resolves back to the same address, so `TOKEN_RATE_PROVIDER` is the genuine, single authorized caller of `handlePostTokenRebase`. The two `OwnershipTransferred` events in the creation transaction (`0x0 -> deployer -> Agent`) are the constructor's `_transferOwnership`; the deploying EOA retains no privilege over the contract.

On-chain state is the constructor baseline only. `owner()` is the Agent, `observersLength()` is `0`, and the constants read back as audited: `MAX_OBSERVERS_COUNT = 32`, `INDEX_NOT_FOUND = type(uint256).max`. The only events ever emitted by the contract are the two from the creation transaction - no `ObserverAdded` has been issued. Access control was exercised against live state: `handlePostTokenRebase` called from an arbitrary sender reverts with `ErrorNotAuthorizedRebaseCaller()`, and succeeds as a no-op when simulated from `Accounting`.

Two items require re-validation after the Lido DAO vote, since the deployment is staged but not yet live:

**The notifier is not yet wired into the protocol.** `LidoLocator.postTokenRebaseReceiver()` still resolves to the previous notifier [`0x25E35855783BEC3E49355A29e110F02Ed8b05bA9`](https://etherscan.io/address/0x25e35855783bec3e49355a29e110f02ed8b05ba9), which is the pre-audit `NoArgs`-only implementation.
**The observer registry is empty.** The old notifier carries one observer, `0xd54C1c6413CAAc3477AC14B2a80D5398e3C32ffE`, which declares support for `ITokenRatePusher` and not for `ITokenRatePusherWithArgs`, i.e. it is a `NoArgs` observer that must be re-registered on the new contract with `kind = NoArgs` to preserve current behavior. Re-validation will be required to confirm that each observer is registered under the flavor matching the interface it actually implements.

Ownership is exercised through Lido DAO governance rather than a multisig: the owner `0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c` is an Aragon `AppProxyUpgradeable`, so `addObserver`/`removeObserver` are reachable only via a passed DAO vote. Note that this owner is also the only on-chain remedy against a halting observer, and that the inherited OZ `renounceOwnership` remains callable by it.
    
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
| **Low**      | 1 |

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

#### 1. `ObserverAdded` / `ObserverRemoved` omit the observer `kind`

##### Status
Fixed in https://github.com/lidofinance/core/commit/dc9066b6f9b5c6c3b65f4a4aac338427198f0e98

##### Description

`ObserverAdded(address)` and `ObserverRemoved(address)` do not carry the observer flavor. Now that `kind` is a first-class dimension of the registry, off-chain indexers and monitors cannot reconstruct which observers are `WithArgs` without reading storage, which weakens monitoring of the exact observers that sit on the protocol-halting path.

##### Recommendation

Add `ObserverKind` (indexed) to `ObserverAdded`. Additionally, consider including the report timestamp in `PushTokenRateFailed` so a failed `WithArgs` push can be tied to a specific oracle report.

> **Client's Commentary:**
> `PushTokenRateFailed` fires inside the oracle-report tx, and `Lido.TokenRebased` in that same tx already carries `reportTimestamp`. Indexers can tie a failed push to its report by joining on the transaction, so we don't duplicate the value in the notifier event. `ObserverAdded/Removed` now carry the kind.

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