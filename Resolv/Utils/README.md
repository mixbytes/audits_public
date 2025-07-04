# Resolv Security Audit Report


###### tags: `Resolv`

## 1. INTRODUCTION

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 
    
### 1.2 Executive Summary

This audit covers two contracts: `Multicall` and `RlpUpOnlyPriceStorage`.

The `Multicall` contract implements role-based access to batch execution of external calls, along with helper functions for retrieving block data and ETH balances.

The `RlpUpOnlyPriceStorage` contract enforces a one-directional (up-only) pricing model — allowing updates only when the new price is greater than or equal to the previous one, and within a configured upper bound.

The audit was conducted over 1 day. The audit methodology included manual code review, static analysis, and validation against our internal checklist that covers access control, arithmetic safety, external integrations, and general Solidity security patterns.

No vulnerabilities were found. The code is clean, modular, and has limited external dependencies.

**Key Notes**:

* RlpUpOnlyPriceStorage stores the price of the RLP token. **While the token's market price may go down, the contract only keeps the latest maximum price observed.**
    * The `setLowerBoundPercentage()` function initializes a `lowerBoundPercentage` value, but this value is unused in `setPrice()` by design, since it's always meant to be zero.
    * The `setPrice()` function has **silent "up-only" behavior**: if the new price is lower than the previous one, it automatically falls back to the last valid (maximum) price without raising an error. It only reverts if the price exceeds the dynamic upper limit (last price + a certain percentage).

* Multicall `aggregate()` and `tryAggregate()` functions are restricted to the `SERVICE_ROLE`, as the contract is designed to perform synchronized updates of multiple price storages in a single transaction. This prevents state mismatches or race conditions.
    * When `_requireSuccess = false` in `tryAggregate()`, failed calls do not revert the entire batch — this is expected behavior and is useful in read/debug scenarios.

### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client Name | Resolv
Project Name | Utils
Type | Solidity
Platform | EVM
Timeline | 23.06.2025 – 01.07.2025
    
#### Scope of Audit

File | Link
--- | ---
contracts/oracles/RlpUpOnlyPriceStorage.sol | https://github.com/resolv-im/resolv-contracts/blob/8a55e6f4c76617616aa102e96d9593a1027c226f/contracts/oracles/RlpUpOnlyPriceStorage.sol
contracts/periphery/multicall/Multicall.sol | https://github.com/resolv-im/resolv-contracts/blob/dc52e74b6adb741beae455751e921c6e0bd413f7/contracts/periphery/multicall/Multicall.sol

#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
23.06.2025 | 8a55e6f4c76617616aa102e96d9593a1027c226f | RlpUpOnlyPriceStorage
23.06.2025 | dc52e74b6adb741beae455751e921c6e0bd413f7 | Multicall
01.07.2025 | 823db23b8370c43d0ee24890011bbd6e19bae769 | RlpUpOnlyPriceStorage update
    
#### Mainnet Deployments

File| Address | Blockchain
--- | --- | ---
RlpUpOnlyPriceStorage.sol | [0x40B988E4EE43351c679291B868Fa35dc4caA0580](https://etherscan.io/address/0x40B988E4EE43351c679291B868Fa35dc4caA0580) | Ethereum
ProxyAdmin.sol | [0xeA27A661f8D545189d1E2E16F7Bb487c29D35779](https://etherscan.io/address/0xeA27A661f8D545189d1E2E16F7Bb487c29D35779) | Ethereum
Multicall.sol | [0xbA610D8c8c93580C19fb8800FC406227De8dF947](https://etherscan.io/address/0xbA610D8c8c93580C19fb8800FC406227De8dF947) | Ethereum
TransparentUpgradeableProxy.sol | [0x093285C34515C01A55e15a25812BcF87E7ab0DC6](https://etherscan.io/address/0x093285C34515C01A55e15a25812BcF87E7ab0DC6) | Ethereum

    
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
| **Low**      | 0 |

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

Not found.

---
    
## 3. About MixBytes
    
MixBytes is a leading provider of smart contract audit and research services, helping blockchain projects enhance security and reliability. Since its inception, MixBytes has been committed to safeguarding the Web3 ecosystem by delivering rigorous security assessments and cutting-edge research tailored to DeFi projects.
    
Our team comprises highly skilled engineers, security experts, and blockchain researchers with deep expertise in formal verification, smart contract auditing, and protocol research. With proven experience in Web3, MixBytes combines in-depth technical knowledge with a proactive security-first approach.
    
#### Why MixBytes?
    
- **Proven Track Record:** Trusted by top-tier blockchain projects like Lido, Aave, Curve, and others, MixBytes has successfully audited and secured billions in digital assets.
- **Technical Expertise:** Our auditors and researchers hold advanced degrees in cryptography, cybersecurity, and distributed systems.
- **Innovative Research:** Our team actively contributes to blockchain security research, sharing knowledge with the community.
    
#### Our Services
- **Smart Contract Audits:** A meticulous security assessment of DeFi protocols to prevent vulnerabilities before deployment.
- **Blockchain Research:** In-depth technical research and security modeling for Web3 projects.
- **Custom Security Solutions:** Tailored security frameworks for complex decentralized applications and blockchain ecosystems.
    
MixBytes is dedicated to securing the future of blockchain technology by delivering unparalleled security expertise and research-driven solutions. Whether you are launching a DeFi protocol or developing an innovative dApp, we are your trusted security partner.


### Contact Information

- [**Website**](https://mixbytes.io/)  
- [**GitHub**](https://github.com/mixbytes/audits_public)  
- [**X**](https://x.com/MixBytes)  
- **Mail:** [hello@mixbytes.io](mailto:hello@mixbytes.io)  