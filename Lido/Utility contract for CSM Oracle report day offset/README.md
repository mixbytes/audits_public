
# Lido Utility contract for CSM Oracle report day offset Security Audit Report

###### tags: `LIDO`

## 1. Introduction

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 
    
    
### 1.2 Executive Summary
The TwoPhaseFrameConfigUpdate contract is a helper utility designed to safely shift the Lido CSM Oracle's reporting schedule by modifying the frame configuration in the underlying HashConsensus contract. It implements a two-phase update mechanism: the offset phase temporarily increases the frame duration and disables the fast lane, while the restore phase returns to the original frame size with the desired fast lane settings. This approach allows the oracle's reporting window to be shifted forward without disrupting ongoing report processing.

The audit was carried out over a period of 1.5 days by a team of 4 auditors, combining manual review with automated tooling

During the audit the following attack vectors were checked:

**Prevention of phase re-execution:** We confirmed that neither the offset nor restore phase can be executed multiple times. The contract enforces strict phase progression to prevent manipulation of frame configuration.

**Multiple MANAGE_FRAME_CONFIG_ROLE holders:** We verified that currently no one holds MANAGE_FRAME_CONFIG_ROLE in the deployed CSFeeOracle contract. This is crucial for access control integrity, as having multiple role holders could lead to conflicting configuration updates.

**Expiration slot calculation for bidirectional shifts:** We verified the correctness of expiration slot calculations for both increasing and decreasing epochsPerFrame.

**Role renunciation after completion:** We checked that renounceRole functions correctly after the two-phase update completes.

**Zero fastlane during offset phase:** We verified that the system handles the case when `fastLaneLengthSlots = 0` correctly during the offset phase.

**Frame duration modification without breaking reporting:** We verified that increasing the frame duration and then restoring it to the previous length doesn't disrupt the reporting logic.

The primary focus of this audit was the TwoPhaseFrameConfigUpdate contract and its two-phase frame configuration update mechanism. The CSFeeOracle contract was considered out of scope for this audit. Similarly, the off-chain module responsible for compiling and submitting reports to the CSM Module was not part of the audit scope.

Overall, the TwoPhaseFrameConfigUpdate contract demonstrates solid implementation quality with well-structured phase transitions and proper state management. One improvement area was identified regarding access control for the external functions defined in this contract. This is documented as a low-severity finding in the audit report and should be addressed.

### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client | Lido
Category| Liquid Staking
Project | Utility contract for CSM Oracle report day offset
Type| Solidity
Platform| EVM
Timeline| 24.12.2025 - 30.12.2025
    
#### Scope of Audit

File | Link
--- | ---
src/utils/TwoPhaseFrameConfigUpdate.sol | https://github.com/lidofinance/community-staking-module/blob/2981a28d5573266abe98097f44f9cdc086944c4b/src/utils/TwoPhaseFrameConfigUpdate.sol
    
#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
24.12.2025 | 2981a28d5573266abe98097f44f9cdc086944c4b | Initial Commit
    
#### Mainnet Deployments

File| Address | Blockchain
--- | --- | ---
TwoPhaseFrameConfigUpdate.sol | [0xb2B4DB1491cbe949ae85EfF01E0d3ee239f110C1](https://etherscan.io/address/0xb2B4DB1491cbe949ae85EfF01E0d3ee239f110C1) | Ethereum
    
### 1.4 Security Assessment Methodology
    
#### Project Flow

| **Stage** | **Scope of Work** |
|-----------|------------------|
| **Interim Audit** | **Project Architecture Review:**<br> - Review project documentation <br> - Conduct a general code review <br> - Perform reverse engineering to analyze the project’s architecture based solely on the source code <br> - Develop an independent perspective on the project’s architecture <br> - Identify any logical flaws in the design <br> **Objective:** Understand the overall structure of the project and identify potential security risks. |
| **Interim Audit** | **Core Review with a Hacker Mindset:**<br> - Each team member independently conducts a manual code review, focusing on identifying unique vulnerabilities. <br> - Perform collaborative audits (pair auditing) of the most complex code sections, supervised by the Team Lead. <br> - Develop Proof-of-Concepts (PoCs) and conduct fuzzing tests using tools like Foundry, Hardhat, and BOA to uncover intricate logical flaws. <br> - Review test cases and in-code comments to identify potential weaknesses. <br> **Objective:** Identify and eliminate the majority of vulnerabilities, including those unique to the industry. |
| **Interim Audit** | **Code Review with a Nerd Mindset:**<br> - Conduct a manual code review using an internally maintained checklist, regularly updated with insights from past hacks, research, and client audits. <br> - Utilize static analysis tools (e.g., Slither, Mythril) and vulnerability databases (e.g., Solodit) to uncover potential undetected attack vectors. <br> **Objective:** Ensure comprehensive coverage of all known attack vectors during the review process. |
| **Interim Audit** | **Consolidation of Auditors' Reports:**<br> - Cross-check findings among auditors <br> - Discuss identified issues <br> - Issue an interim audit report for client review <br> **Objective:** Combine interim reports from all auditors into a single comprehensive document. |
| **Re-Audit** | **Bug Fixing & Re-Audit:**<br> - The client addresses the identified issues and provides feedback. <br> - Auditors verify the fixes and update their statuses with supporting evidence. <br> - A re-audit report is generated and shared with the client. <br> **Objective:** Validate the fixes and reassess the code to ensure all vulnerabilities are resolved and no new vulnerabilities are added. |
| **Final Audit** | **Final Code Verification & Public Audit Report:**<br> - Verify the final code version against recommendations and their statuses. <br> - Check deployed contracts for correct initialization parameters. <br> - Confirm that the deployed code matches the audited version. <br> - Issue a public audit report, published on our official GitHub repository. <br> - Announce the successful audit on our official X account. <br> **Objective:** Perform a final review and issue a public report documenting the audit. |

### 1.5 Risk Classification

#### Severity Level Matrix

| Severity  | Impact: High | Impact: Medium | Impact: Low |
|-----------|-------------|---------------|-------------|
| **Likelihood: High**   | Critical   | High    | Medium  |
| **Likelihood: Medium** | High       | Medium  | Low     |
| **Likelihood: Low**    | Medium     | Low     | Low     |

#### Impact

- **High** – Theft from 0.5% OR partial/full blocking of funds (>0.5%) on the contract without the possibility of withdrawal OR loss of user funds (>1%) who interacted with the protocol.
- **Medium** – Contract lock that can only be fixed through a contract upgrade OR one-time theft of rewards or an amount up to 0.5% of the protocol's TVL OR funds lock with the possibility of withdrawal by an admin.
- **Low** – One-time contract lock that can be fixed by the administrator without a contract upgrade.

#### Likelihood

- **High** – The event has a 50-60% probability of occurring within a year and can be triggered by any actor (e.g., due to a likely market condition that the actor cannot influence).
- **Medium** – An unlikely event (10-20% probability of occurring) that can be triggered by a trusted actor.
- **Low** – A highly unlikely event that can only be triggered by the owner.

#### Action Required

- **Critical** – Must be fixed as soon as possible.
- **High** – Strongly advised to be fixed to minimize potential risks.
- **Medium** – Recommended to be fixed to enhance security and stability.
- **Low** – Recommended to be fixed to improve overall robustness and effectiveness.

#### Finding Status

- **Fixed** – The recommended fixes have been implemented in the project code and no longer impact its security.
- **Partially Fixed** – The recommended fixes have been partially implemented, reducing the impact of the finding, but it has not been fully resolved.
- **Acknowledged** – The recommended fixes have not yet been implemented, and the finding remains unresolved or does not require code changes.

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

#### 1. Unprotected External Functions Allow Public Execution of Phase Transitions

##### Status
Acknowledged

##### Description
The external functions `executeOffsetPhase`, `executeRestorePhase`, and `renounceRoleWhenExpired` lack access control modifiers and can be called by any address. While the internal validation logic (`_validate`) ensures these functions can only succeed when specific conditions are met, there is no technical reason to allow unrestricted public access. The functions modify critical oracle configuration by calling `HASH_CONSENSUS.setFrameConfig()` and renouncing the `MANAGE_FRAME_CONFIG_ROLE`, operations that are typically restricted to privileged actors. Although there are no exploitable vulnerabilities due to the existing validation checks, the current design deviates from the principle of least privilege.

##### Recommendation
We recommend adding role-based access control to these functions by introducing a new role. Only authorized addresses should be permitted to trigger phase transitions and role renunciation.


---
    
## 3. About MixBytes
**MixBytes** is a leading provider of smart contract auditing and blockchain security research, helping Web3 projects enhance their security and reliability.

Since its inception, MixBytes has been dedicated to safeguarding innovation in **DeFi** through rigorous audits and cutting-edge technical research.

Our team brings together experienced engineers, security auditors, and blockchain researchers with deep expertise in smart contract security and protocol design.

With years of proven experience in Web3, MixBytes combines in-depth technical excellence with a proactive, security-first approach.

###  Why MixBytes
- **Proven Track Record** — Trusted by leading blockchain protocols such as **Lido**, **Aave**, **Curve**, **1inch**, **Fluid**, **Gearbox**, **Resolv**, and others. MixBytes has successfully secured billions of dollars in digital assets.
- **Technical Expertise** — Our auditors and researchers hold advanced degrees in cryptography, cybersecurity, and distributed systems, backed by years of hands-on experience.
- **Innovative Research** — MixBytes actively contributes to blockchain security research and open-source tools, sharing insights with the global community.

###  Our Services
- **Smart Contract Audits** — Comprehensive security assessments of DeFi protocols to detect and mitigate vulnerabilities before deployment.
- **Blockchain Research** — In-depth technical studies, economic and protocol-level modeling for Web3 projects.
- **Custom Security Solutions** — Tailored frameworks and advisory for complex decentralized systems and blockchain ecosystems.

### Contact Information
- [**Website**](https://mixbytes.io/)
- [**GitHub**](https://github.com/mixbytes/audits_public)
- [**X**](https://x.com/MixBytes)
- **Mail:** [hello@mixbytes.io](mailto:hello@mixbytes.io)