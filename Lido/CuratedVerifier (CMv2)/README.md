# Lido CuratedVerifier (CMv2) Security Audit Report

###### tags: `Lido`

## 1. Introduction

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 
    
    
### 1.2 Executive Summary
`CuratedVerifier` is the on-chain verifier for Lido's Curated Module v2 (CMv2): it checks SSZ Merkle proofs against beacon block roots exposed through EIP-4788 and reports validator slashings, balances and exits to the module. It is a copy of the existing `Verifier` with one functional change: the withdrawal-proof path is replaced by `processWithdrawnProof`, which reports a non-slashed validator as withdrawn once its proven validator record shows that `withdrawable_epoch` has been reached, without proving the withdrawal itself. The change is needed because CMv2 is introducing outgoing consolidations, and a consolidated source validator has its balance moved to the target validator instead of being swept to the Lido withdrawal vault, so there is no withdrawal to prove. As the actual exit amount is no longer known, the verifier reports the key's confirmed balance plus 32 ETH as its exit balance, so the module no longer charges an exit balance shortage to the operator's bond; the client accepts this for CMv2, relying on the Curated Module Committee's ability to lock the bond of an underperforming operator.

The interim security review was conducted over 1 working day via manual code review and a proprietary AI-assisted analysis tool.

As the client asked us to review the contract as a diff against [`Verifier.sol`](https://github.com/lidofinance/staking-modules/blob/88456343a59d4cd98d19b75e5fe74ea0fb684595/src/Verifier.sol), we looked both at the new withdrawn-proof logic itself and at how the Curated Module consumes the exit data it now reports. We also went through our standard internal checklist, which covers access control, reentrancy, integer overflows, rounding, proof and generalized index validation, and state-dependent logic. The vectors specific to this engagement are listed below.

* **Integrity of the withdrawn proof.** We checked whether `processWithdrawnProof` can be used to report a validator that does not belong to the module, is slashed, or has not reached its `withdrawable_epoch`. The header is anchored to an EIP-4788 root, the full validator record is proven against the header's state root, and the record is bound to the module key through the public key and the Lido withdrawal credentials. Each check removed together with the withdrawal proof is either replaced by the epoch condition or dropped as part of the trade-off the client accepted.
* **Finality of the regular withdrawn report.** We checked whether a key reported as withdrawn through the regular path can later turn out to be slashed. Under the consensus specification a validator can be slashed only while the current epoch is below its `withdrawable_epoch`, and the `slashed` flag is never cleared. A non-slashed record proven at or after that epoch is therefore final, and the regular and slashed reporting paths cannot both apply to the same key.
* **Separation of balance and withdrawn proofs.** We checked whether one beacon state can satisfy both the balance proof and the withdrawn proof, and whether a balance proof can observe a consolidation source after its balance has moved. The two checks are mutually exclusive on the proven epoch, and the consolidation transfer happens at the epoch transition into `withdrawable_epoch`, so a balance proof only ever sees the pre-transfer balance. A balance proof for an earlier state can still be submitted after that epoch, until the key is reported as withdrawn.
* **Reorgs and the EIP-4788 window.** We checked whether a report can be accepted on the basis of a non-canonical state. The verifier compares the supplied beacon header's hash with the root associated with `rootsTimestamp` in the EIP-4788 contract's history. This lookup may select an earlier retained root and uses the execution state of the chain processing the transaction. If a reorg removes the reporting transaction, any subsequent inclusion re-executes the check against the new chain's root history.
* **Committee reaction window.** The client's acceptance of the dropped shortage penalty relies on the Curated Module Committee locking an operator's bond, so we checked how much time the committee has to do that. The withdrawn proof is permissionless and releases the bond of the exited key at once: the operator can claim it with no delay, and a lock placed after the claim only creates debt. The earliest report comes at least 261 epochs (about 27.7 hours) after the exit or consolidation request is processed on the consensus layer, so the lock has to be placed within that window.
* **Consumers of the synthetic exit balance.** We traced every use of `exitBalance` in the module to confirm that reporting `32 ETH + keyConfirmedBalance` disables the exit balance shortage penalty, as intended. The same value also scales the exit penalties recorded for the key, which leads to the undercharged exit delay fee described in the Low-severity finding.
* **Switch-over from `Verifier`.** We checked how keys still unreported at the time of the switch are handled. The previous verifier rejected withdrawals below 99.5% of the expected balance, which kept the bond of such keys locked. The new path settles them without a shortage penalty, so we recommend reporting everything provable through `Verifier` beforehand and reviewing the remaining keys.
* **Stake accounting during intra-module consolidations.** We checked how the module's tracked stake follows a consolidation between two of its own validators. The source withdrawn report and the target balance proof are independent, so the tracked operator and module stake is understated or overstated until both are delivered. This matches the behaviour documented in the deposit allocator and resolves once the target proof is delivered.

The Curated Module contracts that `CuratedVerifier` reports into, namely the module itself together with `WithdrawnValidatorLib`, `Accounting` and `ExitPenalties`, which settle a reported exit, as well as the shared `SSZ` and `GIndex` proof libraries, were outside the audit scope. We followed them only as far as needed to trace how the values reported by the new verifier are consumed, and treated the EIP-4788 beacon roots contract as a trusted source of block roots.

Below we set out our overall assessment, key assumptions, and main recommendations.

- **The change is narrow and keeps the existing proof chain.** The diff against `Verifier` removes the withdrawal-proof path (`processWithdrawalProof`, `processHistoricalWithdrawalProof`, the withdrawal generalized indices and `MIN_WITHDRAWAL_RATIO`) and adds one function, `processWithdrawnProof`; the slashing and balance proof paths and the shared helpers are copied unchanged. The new function anchors the header to an EIP-4788 root, proves the validator record against that header's state root, and binds the record to the module's key through the public key, the Lido withdrawal credentials and the `slashed` flag, so a key can be reported only if it is withdrawable in the proven state.
- **A single proof against a recent state is a sound basis for the exit check.** Validator records remain in the beacon state registry after exit, and once the proven epoch has reached `withdrawable_epoch` the validator can no longer be slashed, so the `slashed` flag read from that state is final and a slashed validator cannot be settled through the regular path. The same check covers regular exits and outgoing consolidations, which removes the dependency on a withdrawal record.
- **The reported exit balance is synthetic, and it also drives fee scaling.** `processWithdrawnProof` reports `32 ETH + keyConfirmedBalance` as the exit balance. In `WithdrawnValidatorLib` this value suppresses the exit balance shortage penalty, as intended, but it also scales the exit delay fee, so the fee is undercharged whenever the confirmed balance lags behind the real one (see the Low-severity finding in Section 2.4). We recommend delivering balance proofs before withdrawn proofs, so that the confirmed balance is up to date when the fee is calculated.
- **Exit losses now depend on the Curated Module Committee acting in time.** Without a proven withdrawal amount, the module no longer confiscates a shortfall at exit, and the `MIN_WITHDRAWAL_RATIO` check (99.5% in the deployment configuration), which kept underfunded exits from being reported through `Verifier`, no longer applies. The client's position that the committee can lock the bond of an underperforming operator holds only if the lock is placed before the exit report releases the bond, so we recommend monitoring exits whose final balance falls below the confirmed balance and defining the committee's response in advance.
- **The client's tests exercise the verifier in isolation.** `test/unit/CuratedVerifier.t.sol` covers the happy paths and revert conditions of the new function against a module stub, so the way the module settles the reported exit, where the issue above arises, is not exercised. We recommend an integration test that runs `processWithdrawnProof` against the real module with nonzero exit penalties and a confirmed balance that lags behind the actual one.

### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client | Lido
Category| Liquid Staking
Project | CuratedVerifier (CMv2)
Type| Solidity
Platform| EVM
Timeline| 12.11.2026 - 13.11.2026
    
#### Scope of Audit

File | Link
--- | ---
src/CuratedVerifier.sol| https://github.com/lidofinance/staking-modules/blob/88456343a59d4cd98d19b75e5fe74ea0fb684595/src/CuratedVerifier.sol
    
#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
12.11.2026 | 88456343a59d4cd98d19b75e5fe74ea0fb684595 | Audited Commit
    
The contract was reviewed as a diff against [`src/Verifier.sol`](https://github.com/lidofinance/staking-modules/blob/88456343a59d4cd98d19b75e5fe74ea0fb684595/src/Verifier.sol) at the same commit.

#### Mainnet Deployments

File| Address | Blockchain
--- | --- | ---
CuratedVerifier.sol | [0x8c9C8c8C91D6de09D256264B33E7C54794feb033](https://etherscan.io/address/0x8c9C8c8C91D6de09D256264B33E7C54794feb033) | Ethereum

The deployment was verified against the audited commit [`88456343a59d4cd98d19b75e5fe74ea0fb684595`](https://github.com/lidofinance/staking-modules/commit/88456343a59d4cd98d19b75e5fe74ea0fb684595) at the finalized block [`26406732`](https://etherscan.io/block/26406732); all on-chain state described below was read at that block.

`CuratedVerifier` was created at block [`26405129`](https://etherscan.io/block/26405129) in transaction [`0x956b70906342f2bbd3ece44e52c1e6c5b71136ab29724f2eb63e061f0ab92fcc`](https://etherscan.io/tx/0x956b70906342f2bbd3ece44e52c1e6c5b71136ab29724f2eb63e061f0ab92fcc) by the EOA [`0x96Afa46bDD33b5560Ba82DBc29019a430A626c63`](https://etherscan.io/address/0x96Afa46bDD33b5560Ba82DBc29019a430A626c63), a plain `CREATE` with no proxy involved. The verified source published on Etherscan matches the audited commit byte-for-byte, including the OpenZeppelin Contracts 5.4.0 dependencies, and was compiled with the settings of the repository's Foundry configuration (solc `0.8.33`, optimizer enabled with 150 runs, EVM version `osaka`, `bytecodeHash` set to `none`). Rebuilding the contract from the audited commit with the same compiler and settings reproduces the creation bytecode of the deployment transaction exactly. The executable runtime bytecode matches once the twelve constructor-assigned immutables are masked, and the immutables were verified separately.

The constructor arguments were verified against the parameters in the client's deployment artifact [`deploy-mainnet.json`](https://github.com/lidofinance/staking-modules/blob/88456343a59d4cd98d19b75e5fe74ea0fb684595/artifacts/mainnet/curated/deploy-mainnet.json), the deployment script at the audited commit, and `LidoLocator.withdrawalVault()` at the verified block. The initial `admin` was the deployer, as specified by the deployment script. `WITHDRAWAL_ADDRESS` is the Lido WithdrawalVault [`0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f`](https://etherscan.io/address/0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f), and `MODULE` is the Curated Module [`0xDa5F930cE326EB5205085D66c72A4E79d60cB8C1`](https://etherscan.io/address/0xDa5F930cE326EB5205085D66c72A4E79d60cB8C1). `SLOTS_PER_EPOCH` is 32, and the generalized indices hold the Electra values for both the previous and the current fork; the state fields they refer to keep their positions in Fulu. `FIRST_SUPPORTED_SLOT` and `PIVOT_SLOT` are 11649024, the first slot of the Electra fork, and `CAPELLA_SLOT` is 6209536.

`DEFAULT_ADMIN_ROLE` is held only by the Lido Agent [`0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c`](https://etherscan.io/address/0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c). `PAUSE_ROLE` is held by the Lido `CircuitBreaker` [`0x6019CB557978296BA3C08a7B73225C0975DFB2F7`](https://etherscan.io/address/0x6019CB557978296BA3C08a7B73225C0975DFB2F7) and the Dual Governance `ResealManager` [`0x7914b5a1539b97Bd0bbd155757F25FD79A522d24`](https://etherscan.io/address/0x7914b5a1539b97Bd0bbd155757F25FD79A522d24), and `RESUME_ROLE` by the `ResealManager`. This is the same role set as on the previous `Verifier` [`0xC392F457960f1B13Ebaf1aa6C065479dD507E1E3`](https://etherscan.io/address/0xC392F457960f1B13Ebaf1aa6C065479dD507E1E3). The deployer granted these roles and revoked its own admin role within the deployment block, and it holds no role at the verified block. The verifier is not paused.

At the time of verification, the governance vote that activates `CuratedVerifier` has not taken place yet. In the Curated Module, `VERIFIER_ROLE` and `REPORT_REGULAR_WITHDRAWN_VALIDATORS_ROLE` are still held only by the previous `Verifier`, so the new contract cannot report to the module. The `CircuitBreaker` has no pauser registered for `CuratedVerifier`. The `ResealManager` can only extend an existing temporary pause, so neither contract can initiate a pause of the currently unpaused verifier under the configuration at the verified block. The Lido Agent can enable this by registering a `CircuitBreaker` pauser or granting `PAUSE_ROLE` to another address. According to the client's vote simulation at the audited commit, the vote revokes both module roles from the previous `Verifier`, grants them to `CuratedVerifier`, and registers the Curated Module Committee Safe [`0x2570e0b22AD904501dfB0d49575991ACB801dD91`](https://etherscan.io/address/0x2570e0b22AD904501dfB0d49575991ACB801dD91) (5-of-9) as its `CircuitBreaker` pauser. Until the vote is enacted, exits that can still be proven through the previous `Verifier` can be reported through it, as recommended in Section 1.2. The module roles and the pauser registration should be re-checked once the vote is enacted.
    
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

#### 1. Stale confirmed balances can cause exit delay fees to be undercharged

##### Status
Acknowledged

##### Description
This issue has been identified within the [`processWithdrawnProof()`](https://github.com/lidofinance/staking-modules/blob/88456343a59d4cd98d19b75e5fe74ea0fb684595/src/CuratedVerifier.sol#L169-L185) function of the `CuratedVerifier` contract.

The function reports `32 ether + keyConfirmedBalance` as the validator's `exitBalance` to disable balance shortage penalties. However, the [`_fulfillExitObligations()`](https://github.com/lidofinance/staking-modules/blob/88456343a59d4cd98d19b75e5fe74ea0fb684595/src/lib/WithdrawnValidatorLib.sol#L114-L127) function of the `WithdrawnValidatorLib` library also uses this value to scale the previously recorded `delayFee`, whose base value corresponds to a 32 ETH validator:

```text
expectedBalance = 32 ether + keyConfirmedBalance
balanceForScaling = min(max(exitBalance, expectedBalance), 2048 ether)
multiplier = balanceForScaling / 1 ether
scaledDelayFee = delayFee * multiplier / 32
```

All divisions use integer arithmetic. Unlike the original `Verifier`, which reports the proven withdrawal amount, `CuratedVerifier` therefore scales the exit delay fee exclusively by the previously confirmed balance. This balance can lag behind the actual balance: allocating a top-up increases `keyAllocatedBalance`, while updating `keyConfirmedBalance` requires a separate balance proof. Processing a withdrawn proof does not require this update first.

For example, a 32 ETH validator receives a 32 ETH top-up on the consensus layer, but no balance proof is submitted, leaving `keyConfirmedBalance` at zero. If a base exit delay fee of 0.005 ETH has been recorded, the original verifier would charge 0.01 ETH upon a regular full withdrawal of 64 ETH. The new verifier reports a synthetic exit balance of 32 ETH and charges only 0.005 ETH. With sufficient bond coverage, the difference remains in the operator's bond and becomes available after the corresponding collateral requirement is released.

The discrepancy occurs when the actual withdrawal exceeds `expectedBalance` sufficiently to increase the multiplier after rounding to whole ETH. The scaling multiplier can be understated by a factor of up to 64 when 32 ETH is used instead of 2048 ETH. Once the key is marked as withdrawn, subsequent balance reports revert and repeated withdrawn reports are skipped, so later proofs cannot automatically recover the undercharged fee. Recovery requires a separate General Delayed Penalty from the CMC, subject to available collateral.

The issue is classified as Low severity because it causes undercollection of exit delay fees without loss of the principal stake. The monetary impact requires a nonzero recorded `delayFee` and a stale confirmed balance that produces a lower scaling multiplier.

##### Recommendation
We recommend ensuring that balance proofs reflecting the updated validator balance, including credited top-ups, are processed on-chain before the validator reaches its `withdrawable_epoch`. For outgoing consolidations, the proven balance should reflect the source validator's balance before the consolidation transfer.

> **Client's Commentary:**
Acknowledged, accepted risk. Setting a validator’s exit epoch triggers a balance proof, and the time before its withdrawable epoch is enough to react if the provers fail. We use keyConfirmedBalance because the modules already use it as the reference when processing withdrawals. keyAllocatedBalance could overpenalize an operator whose top-up lands shortly before exit. We don’t expect exit requests, and therefore exit delays, before the next release, which removes exit delays entirely as exits move to EIP-7002.

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
