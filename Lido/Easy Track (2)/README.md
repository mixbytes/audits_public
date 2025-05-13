
# Lido EasyTrack Security Audit Report

###### tags: `LIDO`, `EasyTrack`

## 1. INTRODUCTION

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 

    
### 1.2 Executive Summary
The contracts within the scope include EasyTrack EVM factories for the MEV Boost Relay Allowed List contract. The `AddMEVBoostRelays` contract generates calldata for the `EvmScriptExecutor`, which adds new relays while ensuring there are no duplicates and that all limits are respected. The `EditMEVBoostRelays` contract generates calldata to modify existing relays, and the `RemoveMEVBoostRelays` contract creates calldata to remove specified relays after validation. Utility functions in the `MEVBoostRelaysInputUtils` library assist with decoding and validating relay input data.

The audit required a total effort of 2 team-days.

Before the audit, the same team conducted a review of the EVM Script Factories for the MEV Boost Allowed List specification and highlighted a few code improvements, which were applied prior to the start of this audit. As a result, no new issues were discovered.

During the audit, we thoroughly examined the following potential attack vectors:

- It is not possible to provide **crafted** relay or URI **byte data** while bypassing the checks implemented in the factory contracts. Providing correctly formatted but still erroneous data will result in the motion execution being reverted.
- The `MEVBoostRelaysInputUtils` library is used correctly to ensure the **correctness of the provided data**.
- The relay editing process is correctly implemented and consists of **two sequential actions**: deleting and then adding the relayer. The relayer URI is used as the key for lookup, allowing the correct relayer to be found and its fields to be updated.
- The **method signatures** called on `MEVBoostRelayAllowedList.vy` are correct.
- There should be no issues interacting with the contract in Vyper, as its additional runtime checks on certain data types are supported by the `MEVBoostRelaysInputUtils` library, which ensures **type correctness**.
- There are **no functional limitations** resulting from transferring the `MEVBoostRelayAllowedList.vy` manager role from the Relay Maintenance Committee to the `EvmScriptExecutor` contract.
- Creating **two conflicting motions** (e.g., removing and then editing the same relayer) will pass all validation checks but will not lead to data corruption or denial of service, as the conflicting motion will revert during execution.
- The calldata passed to the `EVMScriptCreator` is **correctly encoded** and aligns with the `MEVBoostRelayAllowedList.vy` contract interface.

Overall, the code quality within the audit scope appears to be robust and well-structured. The implementation of validation checks ensures that inputs are properly managed. The contracts exhibit a strong adherence to best practices in smart contract design and development.

### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client  Name| Lido
Project Name| EasyTrack
Type| Solidity
Platform| EVM
Timeline| 24.03.2025 - 26.03.2025
    
#### Scope of Audit

File | Link
--- | ---
contracts/EVMScriptFactories/AddMEVBoostRelays.sol | https://github.com/lidofinance/easy-track/blob/96606b69371268e5e3db3175bd1004d55c033a31/contracts/EVMScriptFactories/AddMEVBoostRelays.sol
contracts/EVMScriptFactories/EditMEVBoostRelays.sol | https://github.com/lidofinance/easy-track/blob/96606b69371268e5e3db3175bd1004d55c033a31/contracts/EVMScriptFactories/EditMEVBoostRelays.sol
contracts/EVMScriptFactories/RemoveMEVBoostRelays.sol | https://github.com/lidofinance/easy-track/blob/96606b69371268e5e3db3175bd1004d55c033a31/contracts/EVMScriptFactories/RemoveMEVBoostRelays.sol
contracts/libraries/MEVBoostRelaysInputUtils.sol | https://github.com/lidofinance/easy-track/blob/96606b69371268e5e3db3175bd1004d55c033a31/contracts/libraries/MEVBoostRelaysInputUtils.sol
    
#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
24.03.2025 | 96606b69371268e5e3db3175bd1004d55c033a31 | Initial Commit

#### Mainnet Deployments

File| Address | Blockchain
--- | --- | ---
AddMEVBoostRelays.sol | [0x00A3D6260f70b1660c8646Ef25D0820EFFd7bE60](https://etherscan.io/address/0x00A3D6260f70b1660c8646Ef25D0820EFFd7bE60) | Ethereum Mainnet
RemoveMEVBoostRelays.sol | [0x9721c0f77E3Ea40eD592B9DCf3032DaF269c0306](https://etherscan.io/address/0x9721c0f77E3Ea40eD592B9DCf3032DaF269c0306) | Ethereum Mainnet
EditMEVBoostRelays.sol | [0x6b7863f2c7dEE99D3b744fDAEDbEB1aeCC025535](https://etherscan.io/address/0x6b7863f2c7dEE99D3b744fDAEDbEB1aeCC025535) | Ethereum Mainnet
    
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
| **High** | 0 |
| **Medium** | 0 |
| **Low** | 0 |


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