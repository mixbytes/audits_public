# Instadapp Fluid Liquidity Layer Security Audit Report

###### tags: `instadapp`, `Fluid`

## 1. INTRODUCTION

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 

    
### 1.2 Executive Summary

Instadapp Fluid Liquidity Layer is a core DeFi protocol that serves as the central liquidity hub for the Fluid ecosystem. The protocol combines sophisticated liquidity management, interest rate calculations, and multi-protocol integration capabilities, enabling seamless interaction between various DeFi protocols including lending (fTokens), vaults, flashloans, and DEX operations. The system utilizes advanced mathematical libraries for precise calculations and implements a modular architecture with separate admin and user modules, all built on top of the Instadapp Infinite proxy pattern.

The audit specifically examined changes made between commits `23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf` and `f5a07116967103946791dffd1fbafa71e0a60828` within the liquidity layer. The initial commit `f5a07116967103946791dffd1fbafa71e0a60828` wasn't audited by MixBytes. Vaults ZIRCUIT and ZtakingPool were out of scope.

Key changes and attack vectors:
* **New variables read/write correctness**: new storage variables were added: `usesConfigs2` in `_exchangePricesAndConfig`, `decayAmount` in `_userSupplyData`, `decayDurationCPs` in `_userSupplyData`, `maxUtilization` in `_configs2`: 
  - We verified that the maximum size of the variables does not exceed their allocated slot boundaries, and that the variables are correctly read and written back via respective bit operations.
  - Additionally, it was verified that new variable storage writes are not overwritten by subsequent function calls. For example, in `updateTokenConfigs()`, the `usesConfigs2` is updated in `_exchangePricesAndConfig` storage slot, and then the function `_updateExchangePricesAndRates()` is called, which also modifies `_exchangePricesAndConfig` and it is correctly does not nullify the `usesConfigs2` slot in the storage.
* **Reentrancy protection and DoS**: A new `safeTransferNative()` function was added with a gas limit of `20,000` for native token transfers. This amount should be sufficient for standard receive/fallback functions with event logging, but insufficient for heavy operations, providing partial protection against reentrancy attacks. This also means that integrations with the liquidity layer must avoid implementing complex logic in their receive/fallback functions, as this could lead to DoS where legitimate transfers fail due to gas exhaustion.
* **Negative borrow rate checks**: The `calcRateV1()` and `calcRateV2()` functions were modified to change the `slope_` variable from `uint256` to `int256`. However, negative `slope_` cases (negative borrow rates) are prevented by a specific check. All calculations are wrapped in `unchecked` blocks, which is safe due to the limited size of variables participating in the calculations. There are some `int(uint(x)-uint(y))` subtractions, which would work the same as `int(int(x)-int(y))` due to `unchecked{}` clause.
* **No storage collisions**: The new `maxUtilization` field in `TokenConfig` poses no risk, as the struct is not stored in contract storage, so no collisions can occur when the implementation is upgraded.
* **Token decimals and code validation**: New validation functions `_checkIsContract()` and `_checkTokenDecimalsRange()` were added to the admin module. We verified that these functions are properly utilized across all admin functions where contract address validation and token decimal range validation are required. Note that these validations are not present in `updateTokenConfigs()`, however, this function cannot be called for a token that hasn't had `updateRateDataV1s()` or `updateRateDataV2s()` called first, which do contain these validation checks. 
* **Utilization above 100%**: A new validation was added to `updateTokenConfigs()` in `adminModule` for the case `maxUtilization > FOUR_DECIMALS` (i.e., prohibition on maximum utilization above 100%). 
* **Bit function correctness**: The `leastSignificantBit()` function was added to the `bigMathMinified` library. We verified it reverts on zero input, correctly counts trailing zeros using binary search with shifts and masks, and returns the 1-based bit position (1–256). Edge cases were validated (e.g., 1→1, 2→2, 2^255→256).
* **User withdrawal limit validation**: The new `updateUserWithdrawalLimit()` function was tested for correct validation of arguments and  the new limit and input parameters.
* **Withdraw-decay mechanism:** verified arithmetic correctness, dust handling, linear decay across checkpoints (partial/full decay, off-by-one effect at boundaries), limit push-down on withdrawals (never exceeds remaining decay, correct handling of `notPushedDown` in max-expansion cases), addition of new decay on deposits (weighted duration blending, proper min/cap enforcement), edge cases (`before==0`, `withdrawLimitAfter==0`).

Key notes and recommendations:
* We recommend adding more tests for the new features — negative slopes in rate calculations, net transfers, etc.

### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client Name| Instadapp
Project Name| Fluid Liquidity Layer
Type| Solidity
Platform| EVM
Timeline| 09.09.2025 - 10.12.2025
    
#### Scope of Audit

File | Link
--- | ---
contracts/libraries/bigMathMinified.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/libraries/bigMathMinified.sol
contracts/libraries/liquidityCalcs.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/libraries/liquidityCalcs.sol
contracts/libraries/liquiditySlotsLink.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/libraries/liquiditySlotsLink.sol
contracts/libraries/safeTransfer.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/libraries/safeTransfer.sol
contracts/liquidity/adminModule/main.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/adminModule/main.sol
contracts/liquidity/adminModule/structs.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/adminModule/structs.sol
contracts/liquidity/adminModule/events.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/adminModule/events.sol
contracts/liquidity/common/variables.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/common/variables.sol
contracts/liquidity/common/helpers.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/common/helpers.sol
contracts/liquidity/userModule/main.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/userModule/main.sol
contracts/liquidity/userModule/events.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/userModule/events.sol
contracts/liquidity/errorTypes.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/errorTypes.sol
contracts/liquidity/proxy.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/proxy.sol
contracts/liquidity/dummyImpl.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/dummyImpl.sol
contracts/liquidity/error.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/error.sol
contracts/liquidity/interfaces/iLiquidity.sol | https://github.com/Instadapp/fluid-contracts/blob/23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf/contracts/liquidity/interfaces/iLiquidity.sol

***    
#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
09.09.2025 | 23692b02dc20aa87aa59f2bcd8bb8ec4ad9234bf | Initial Commit
09.12.2025 | 298c84e3daa9505457cf22265e5c4a8927d7e8c9 | Commit for re-audit
10.12.2025 | 5bd3d775f67d8f8d731c58a3852cdf044b86795b | Commit for re-audit
    
#### Mainnet Deployments

File| Address | Blockchain | Comment
--- | --- | --- | ---
(userModule) main.sol | [0xF1167F851509CA5Ef56f8521fB1EE07e4e5C92C8](https://etherscan.io/address/0xF1167F851509CA5Ef56f8521fB1EE07e4e5C92C8) | Ethereum Mainnet | L1 and L2 were introduced
(adminModule) main.sol | [0x53EFFA0e612d88f39Ab32eb5274F2fae478d261C](https://etherscan.io/address/0x53EFFA0e612d88f39Ab32eb5274F2fae478d261C) | Ethereum Mainnet | L1 and L2 were introduced

    
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

#### 1. Potential ETH Loss Risk due to `MAX_INPUT_AMOUNT_EXCESS` Increase to 1000% in the Liquidity Layer
##### Status
Acknowledged

##### Description
`MAX_INPUT_AMOUNT_EXCESS` in the liquidity layer was increased from 1% to 1000%, which creates a risk of ETH loss for the user:
- https://github.com/Instadapp/fluid-contracts/blob/298c84e3daa9505457cf22265e5c4a8927d7e8c9/contracts/liquidity/userModule/main.sol#L637

##### Recommendation
We recommend refunding excess ETH to the user.

> **Client's Commentary:**
> Indeed, but note that this only happens for DEX V2 net transfers, where DEX V2 handles the interaction so that excess shouldn’t be possible in the first place. Any excess from the user is sent back to the user at the DEX V2 protocol level.

---


#### 2. Missed `preTransferOut()`
##### Status
Fixed in https://github.com/Instadapp/fluid-contracts/commit/5bd3d775f67d8f8d731c58a3852cdf044b86795b

##### Description

The `preTransferOut()` hook was missed for two safe transfers:
- https://github.com/Instadapp/fluid-contracts/blob/298c84e3daa9505457cf22265e5c4a8927d7e8c9/contracts/liquidity/userModule/main.sol#L1092
- https://github.com/Instadapp/fluid-contracts/blob/298c84e3daa9505457cf22265e5c4a8927d7e8c9/contracts/liquidity/userModule/main.sol#L1115

##### Recommendation

We recommend calling the hook in the aforementioned cases.

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