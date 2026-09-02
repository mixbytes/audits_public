# Lido Easy Track factory for Deposit Reserve Target management Security Audit Report

###### tags: `Lido`, `Easy Track`

## 1. Introduction

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 
    
    
### 1.2 Executive Summary
Easy Track is Lido's optimistic governance system: instead of a full Aragon vote, a designated trusted committee opens a motion that executes automatically after a fixed window unless LDO holders object above a threshold. The audited factory, `SetDepositsReserveTarget`, lets the Curated Module Committee adjust Lido's deposits reserve target, the portion of buffered ether shielded from withdrawal consumption so that new validators can still be seeded during periods of heavy withdrawal demand. The factory is stateless and it only bounds the requested value against an immutable ceiling, rejects no-op changes, and emits the resulting script for `Lido.setDepositsReserveTarget`.

The interim security review was conducted over 1 working day via manual code review and a proprietary AI-assisted analysis tool.

The review concentrated on the factory's own validation logic. Alongside that, we worked through our standard internal checklist covering access control, input validation, encoding and decoding correctness, arithmetic safety, and state-dependent logic. The project-specific vectors examined during this engagement are listed below.

* **Motion state drift.** We checked whether the reserve target read at motion creation can go stale by enactment. Both guards are re-evaluated on fresh state, since `EasyTrack.enactMotion` re-runs `createEVMScript`.
* **Cap bypass and griefing.** We checked decoding edge cases against `MAX_DEPOSITS_RESERVE_TARGET` and whether a live motion can be bricked by moving the reserve target externally. The cap holds, and the only reachable revert applies to a motion whose end state has already been reached.
* **Constructor and deployment configuration.** We checked the immutable arguments and the deploy script for values that would silently weaken the factory, since neither `_lido` nor the cap is sanity-checked or changeable after deployment.

Below we set out our overall assessment, key assumptions, and main recommendations.

- **The contract is small, single-purpose, and correct.** All validation happens before the script is constructed, the trusted-caller gate is inherited from the established `TrustedCaller` base, and both guards are re-evaluated against fresh state when the motion is enacted.
- **The security model rests on layered constraints rather than on the factory alone.** Motion creation is restricted to the trusted caller, the value is capped by an immutable ceiling, the registry independently confirms that the script targets only the allowlisted `Lido.setDepositsReserveTarget` selector, and the objection window plus the DAO's ability to remove the factory remain as final controls.
- **Constructor arguments are the main residual risk, and they are not sanity-checked.** `_lido` is stored without a zero-address check even though several sibling factories in the same directory validate their equivalent argument, and `_maxDepositsReserveTarget` accepts any `uint256`: zero permanently bricks the factory, while `type(uint256).max` removes the cap while the contract still presents as capped. Both values are immutable with no setter, so a mistake requires redeployment and a new DAO vote. We recommend adding the zero-address check and enforcing a plausibility band on the maximum in the deployment script, whose current bounds check is a tautology for a `uint256`.

### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client | Lido
Category| Liquid Staking
Project | Easy Track
Type| Solidity
Platform| EVM
Timeline| 01.09.2026 - 01.09.2026
    
#### Scope of Audit

File | Link
--- | ---
contracts/EVMScriptFactories/SetDepositsReserveTarget.sol| https://github.com/lidofinance/easy-track/blob/99bd7322ed10cc81f82aa5904e0e62827ccadea5/contracts/EVMScriptFactories/SetDepositsReserveTarget.sol
    
#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
01.09.2026 | 99bd7322ed10cc81f82aa5904e0e62827ccadea5 | Initial Commit
    
#### Mainnet Deployments

File| Address | Blockchain
--- | --- | ---
SetDepositsReserveTarget.sol | [0x62E9Dc68BDCBC46362f40e0bb9c154C9a42E62b0](https://etherscan.io/address/0x62E9Dc68BDCBC46362f40e0bb9c154C9a42E62b0) | Ethereum

We verified the deployed factory against the audited commit `99bd7322ed10cc81f82aa5904e0e62827ccadea5`, and it matches. The contract was created in transaction with hash [`0xbbfbab914fd30eaf80ddab08474e1934a5fd85de7b5b0743d5f5ea66995080e1`](https://etherscan.io/tx/0xbbfbab914fd30eaf80ddab08474e1934a5fd85de7b5b0743d5f5ea66995080e1) at block `25888437` by the EOA [`0x2340c95432Ccd90621c7ef7adbD20a0bBc2fa33C`](https://etherscan.io/address/0x2340c95432ccd90621c7ef7adbd20a0bbc2fa33c), a plain `CREATE` with no proxy involved. 

Rebuilding from the audited commit with the project's own compiler settings (`solc 0.8.6`, EVM version `berlin`, optimizer disabled) yields runtime bytecode matching the deployed code.

The constructor arguments decode to `_trustedCaller = 0x2570e0b22AD904501dfB0d49575991ACB801dD91`, `_maxDepositsReserveTarget = 9600000000000000000000` (9600 ETH), and `_lido = 0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`, matching the intended configuration: the cap is the 9600 ETH figure from the proposal, `_lido` is the canonical stETH address, and the trusted caller is the Curated Module Committee Safe (5-of-9). We confirmed the same three values by reading them back from the deployed contract's getters.

Exercised against live mainnet state, the factory reverts with `CALLER_IS_FORBIDDEN` for a non-trusted caller, `DEPOSITS_RESERVE_TARGET_TOO_HIGH` one wei above the cap, and `SAME_DEPOSITS_RESERVE_TARGET` for the current target. At the time of verification the factory is not yet wired into Easy Track: `isEVMScriptFactory` returns `false` and no permissions are registered, so a DAO vote is still required.
    
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
| **Low**      | 0 |

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

NOT FOUND

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