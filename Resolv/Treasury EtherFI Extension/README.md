# Resolv Treasury EtherFI Extension Security Audit Report

###### tags: `Resolv`, `etherfi`, `treasury`

## 1. INTRODUCTION

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 
    
### 1.2 Executive Summary

Resolv is a protocol that issues USR, a USD-pegged stablecoin backed by ETH, using a combination of ETH collateral, short perpetual futures for hedging, and an insurance pool (RLP) to maintain stability. The Resolv treasury is an onchain contract used to manage part of the protocol's assets. Admins and managers can interact with external protocols through modular extensions.

In this audit, we reviewed the EtherFiTreasuryExtension, which allows the treasury to stake ETH into the EtherFi protocol and unstake it back to the treasury. We focused on ensuring correct access control and verifying the safety of ETH transfers to and from EtherFi, including behavior related to rebasing and rounding.

We also went through our detailed checklist, covering other aspects such as business logic, common ERC20/ERC4626 issues, interactions with external contracts, integer overflows, reentrancy, access control boundaries, typecast risks, rounding precision, and potential edge cases.

No significant vulnerabilities were found.

### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client Name| Resolv
Project Name| Treasury
Type| Solidity
Platform| EVM
Timeline| 28.05.2025-03.06.2025
    
#### Scope of Audit

File | Link
--- | ---
contracts/EtherFiTreasuryExtension.sol | https://github.com/resolv-im/resolv-contracts/blob/ae2b6873a369e3eaa107a269dbeb2e1eb63eb74b/contracts/EtherFiTreasuryExtension.sol 
    
#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
28.05.2025 | ae2b6873a369e3eaa107a269dbeb2e1eb63eb74b | Commit for the audit
03.06.2025 | 625ed9eef96efc6c0167f74497c0e3129d730f47 | Commit for the re-audit
    
#### Mainnet Deployments

File| Address | Blockchain
--- | --- | ---
EtherFiTreasuryExtension.sol | [0x0dbD4235fdAB88a8f646dc1678306aD9A0beF998](https://etherscan.io/address/0x0dbD4235fdAB88a8f646dc1678306aD9A0beF998) | Ethereum Mainnet

    
### 1.4 Security Assessment Methodology
    
#### Project Flow

| **Stage** | **Scope of Work** |
|-----------|------------------|
| **Interim Audit** | **Project Architecture Review:**<br> - Review project documentation <br> - Conduct a general code review <br> - Perform reverse engineering to analyze the project's architecture based solely on the source code <br> - Develop an independent perspective on the project's architecture <br> - Identify any logical flaws in the design <br> **Objective:** Understand the overall structure of the project and identify potential security risks. |
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
| **Low**      | 2 |

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

#### 1. `LIQUIDITY_POOL.amountForShare(1 wei)` may round down to zero

##### Status
Fixed in https://github.com/resolv-im/resolv-contracts/commit/625ed9eef96efc6c0167f74497c0e3129d730f47

##### Description

This issue has been identified within the `depositETHForEETH()` and `depositETHForWeETH()` functions of the `EtherFiTreasuryExtension`.

* https://github.com/resolv-im/resolv-contracts/blob/ae2b6873a369e3eaa107a269dbeb2e1eb63eb74b/contracts/EtherFiTreasuryExtension.sol#L46
* https://github.com/resolv-im/resolv-contracts/blob/ae2b6873a369e3eaa107a269dbeb2e1eb63eb74b/contracts/EtherFiTreasuryExtension.sol#L58

While the underlying `_deposit(...)` function of the `LIQUIDITY_POOL` ensures that zero shares are never minted (i.e., `share == 0` triggers a revert), the subsequent computation:
```solidity
uint256 eEthAmount = LIQUIDITY_POOL.amountForShare(eETHShares);
```
may still result in `eEthAmount == 0` even for `eETHShares > 0`.

This is due to the implementation of:
```solidity
function amountForShare(uint256 _share) public view returns (uint256) {
    uint256 totalShares = eETH.totalShares();
    if (totalShares == 0) {
        return 0;
    }
    return (_share * getTotalPooledEther()) / totalShares;
}
```

If the pool is in early stages or under unusual liquidity conditions (e.g., small `getTotalPooledEther()` or very high `totalShares`), this division may truncate to zero for `_share == 1`.

As a result:
* A non-zero share amount is minted.
* But zero tokens are transferred to the treasury.
* Emitted events (e.g. Deposited(...)) will indicate a completed operation, but the treasury received no assets.

This may result in inconsistent accounting, noisy events, or even broken assumptions downstream.
<br/>
##### Recommendation

We recommend adding an explicit check in `EtherFiTreasuryExtension` to ensure that `eEthAmount > 0` after calling `amountForShare(...)`:
```solidity
require(eEthAmount > 0, "Deposit too small to mint usable amount");
```

> **Client's Commentary:**
> https://github.com/resolv-im/resolv-contracts/pull/348

#### 2. Inconsistent inheritance pattern in EtherFiTreasuryExtension

##### Status
Fixed in https://github.com/resolv-im/resolv-contracts/commit/625ed9eef96efc6c0167f74497c0e3129d730f47

##### Description

The `EtherFiTreasuryExtension` contract inherits from both `ERC721HolderUpgradeable` and `AccessControlDefaultAdminRules`:
* https://github.com/resolv-im/resolv-contracts/blob/ae2b6873a369e3eaa107a269dbeb2e1eb63eb74b/contracts/EtherFiTreasuryExtension.sol#L16

This is inconsistent as one parent is upgradeable while the other is not.

The inheritance pattern should be consistent - either both parents should be upgradeable (using `AccessControlDefaultAdminRulesUpgradeable`) or both should be non-upgradeable (using `ERC721Holder`).

This inconsistency could potentially lead to initialization issues or unexpected behavior during upgrades.
<br/>
##### Recommendation

Choose one of the following approaches:

1. Use upgradeable versions of both contracts:
```solidity
ERC721HolderUpgradeable, AccessControlDefaultAdminRulesUpgradeable
```

2. Use non-upgradeable versions of both contracts:
```solidity
ERC721Holder, AccessControlDefaultAdminRules
```

> **Client's Commentary:**
> https://github.com/resolv-im/resolv-contracts/pull/347

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