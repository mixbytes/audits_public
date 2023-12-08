
# AAVE Voting Tokens Security Audit Report

###### tags: `aave`

## 1. INTRODUCTION

### 1.1 Disclaimer
The audit makes no statements or warranties about utility of the code, safety of the code, suitability of the business model, investment advice, endorsement of the platform or its products, regulatory regime for the business model, or any other statements about fitness of the contracts to purpose, or their bug free status. The audit documentation is for discussion purposes only. The information presented in this report is confidential and privileged. If you are reading this report, you agree to keep it confidential, not to copy, disclose or disseminate without the agreement of the Client. If you are not the intended recipient(s) of this document, please note that any disclosure, copying or dissemination of its content is strictly forbidden.


### 1.2 Security Assessment Methodology

A group of auditors are involved in the work on the audit. The security engineers check the provided source code independently of each other in accordance with the methodology described below:

#### 1. Project architecture review:

* Project documentation review.
* General code review.
* Reverse research and study of the project architecture on the source code alone.


##### Stage goals
* Build an independent view of the project's architecture.
* Identifying logical flaws.


#### 2. Checking the code in accordance with the vulnerabilities checklist:

* Manual code check for vulnerabilities listed on the Contractor's internal checklist. The Contractor's checklist is constantly updated based on the analysis of hacks, research, and audit of the clients' codes.
* Code check with the use of static analyzers (i.e Slither, Mythril, etc).


##### Stage goal 
Eliminate typical vulnerabilities (e.g. reentrancy, gas limit, flash loan attacks etc.).

#### 3. Checking the code for compliance with the desired security model:

* Detailed study of the project documentation.
* Examination of contracts tests.
* Examination of comments in code.
* Comparison of the desired model obtained during the study with the reversed view obtained during the blind audit.
* Exploits PoC development with the use of such programs as Brownie and Hardhat.

##### Stage goal
Detect inconsistencies with the desired model.


#### 4. Consolidation of the auditors' interim reports into one:
* Cross check: each auditor reviews the reports of the others.
* Discussion of the issues found by the auditors.
* Issuance of an interim audit report.

##### Stage goals
* Double-check all the found issues to make sure they are relevant and the determined threat level is correct.
* Provide the Client with an interim report.


#### 5. Bug fixing & re-audit:
* The Client either fixes the issues or provides comments on the issues found by the auditors. Feedback from the Customer must be received on every issue/bug so that the Contractor can assign them a status (either "fixed" or "acknowledged").
* Upon completion of the bug fixing, the auditors double-check each fix and assign it a specific status, providing a proof link to the fix.
* A re-audited report is issued. 


##### Stage goals
* Verify the fixed code version with all the recommendations and its statuses.
* Provide the Client with a re-audited report.

#### 6. Final code verification and issuance of a public audit report: 
* The Customer deploys the re-audited source code on the mainnet.
* The Contractor verifies the deployed code with the re-audited version and checks them for compliance.
* If the versions of the code match, the Contractor issues a public audit report. 

##### Stage goals
* Conduct the final check of the code deployed on the mainnet.
* Provide the Customer with a public audit report.


#### Finding Severity breakdown

All vulnerabilities discovered during the audit are classified based on their potential severity and have the following classification:

Severity | Description
--- | ---
Critical | Bugs leading to assets theft, fund access locking, or any other loss of funds.
High     | Bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement.
Medium   | Bugs that can break the intended contract logic or expose it to DoS attacks, but do not cause direct loss funds.
Low | Bugs that do not have a significant immediate impact and could be easily fixed.


Based on the feedback received from the Customer regarding the list of findings discovered by the Contractor, they are assigned the following statuses:


Status | Description
--- | ---
Fixed        | Recommended fixes have been made to the project code and no longer affect its security.
Acknowledged | The Customer is aware of the finding. Recommendations for the finding are planned to be resolved in the future.



### 1.3 Project Overview

$AAVE, $stkAAVE, and $aAAVE have voting/proposition delegation, which helps voting on Governance v3. It is possible by bridging the Ethereum block hash to other networks and using storage proofs.

### 1.4 Project Dashboard

#### Project Summary

Title | Description
--- | ---
Client             | Aave
Project name       | Voting Tokens
Timeline           | October 26 2023 - November 30 2023
Number of Auditors | 3

#### Project Log

Date | Commit Hash | Note
--- | --- | ---
26.10.2023 | ec80c6d41f7ef1e43f31dbcf4eca59e8c6bceb87  | Commit for the audit (aave-token-v3)
26.10.2023 | 0b3ff3bb98b18a418032d0541412daa8774a111d  | Commit for the audit (aave-stk-gov-v3)
26.10.2023 | 71e9c4ecf7bac1f3c4f42124e464786f498916cf  | Commit for the audit (aave-a-token-with-delegation)
30.11.2023 | 14e12d95c1833f4c5eb81c822f9e8fdf88e0252a  | Commit with fixes (aave-stk-gov-v3)


#### Project Scope
The audit covered the following files:

File name | Link
--- | ---
src/AaveTokenV3.sol | https://github.com/bgd-labs/aave-token-v3/blob/ec80c6d41f7ef1e43f31dbcf4eca59e8c6bceb87/src/AaveTokenV3.sol
src/BaseAaveToken.sol | https://github.com/bgd-labs/aave-token-v3/blob/ec80c6d41f7ef1e43f31dbcf4eca59e8c6bceb87/src/BaseAaveToken.sol
src/BaseAaveTokenV2.sol | https://github.com/bgd-labs/aave-token-v3/blob/ec80c6d41f7ef1e43f31dbcf4eca59e8c6bceb87/src/BaseAaveTokenV2.sol
src/BaseDelegation.sol | https://github.com/bgd-labs/aave-token-v3/blob/ec80c6d41f7ef1e43f31dbcf4eca59e8c6bceb87/src/BaseDelegation.sol
src/DelegationAwareBalance.sol | https://github.com/bgd-labs/aave-token-v3/blob/ec80c6d41f7ef1e43f31dbcf4eca59e8c6bceb87/src/DelegationAwareBalance.sol
src/utils/SafeCast72.sol | https://github.com/bgd-labs/aave-token-v3/blob/ec80c6d41f7ef1e43f31dbcf4eca59e8c6bceb87/src/utils/SafeCast72.sol
src/utils/EIP712.sol | https://github.com/bgd-labs/aave-token-v3/blob/ec80c6d41f7ef1e43f31dbcf4eca59e8c6bceb87/src/utils/EIP712.sol
src/contracts/BaseMintableAaveToken.sol | https://github.com/bgd-labs/aave-stk-gov-v3/blob/0b3ff3bb98b18a418032d0541412daa8774a111d/src/contracts/BaseMintableAaveToken.sol
src/contracts/StakedAaveV3.sol | https://github.com/bgd-labs/aave-stk-gov-v3/blob/0b3ff3bb98b18a418032d0541412daa8774a111d/src/contracts/StakedAaveV3.sol
src/contracts/StakedTokenV3.sol | https://github.com/bgd-labs/aave-stk-gov-v3/blob/0b3ff3bb98b18a418032d0541412daa8774a111d/src/contracts/StakedTokenV3.sol
src/contracts/StakedTokenV2.sol | https://github.com/bgd-labs/aave-stk-gov-v3/blob/0b3ff3bb98b18a418032d0541412daa8774a111d/src/contracts/StakedTokenV2.sol
src/contracts/dependencies/EIP712Base.sol | https://github.com/bgd-labs/aave-a-token-with-delegation/blob/71e9c4ecf7bac1f3c4f42124e464786f498916cf/src/contracts/dependencies/EIP712Base.sol
src/contracts/AToken.sol | https://github.com/bgd-labs/aave-a-token-with-delegation/blob/71e9c4ecf7bac1f3c4f42124e464786f498916cf/src/contracts/AToken.sol
src/contracts/ATokenWithDelegation.sol | https://github.com/bgd-labs/aave-a-token-with-delegation/blob/71e9c4ecf7bac1f3c4f42124e464786f498916cf/src/contracts/ATokenWithDelegation.sol


#### Deployments

File name | Contract deployed on mainnet | Comment
--- | --- | ---
AaveTokenV3.sol | [0x5D4Aa78B08Bc7C530e21bf7447988b1Be7991322](https://etherscan.io/address/0x5D4Aa78B08Bc7C530e21bf7447988b1Be7991322) |
StakedAaveV3.sol | [0x0fE58FE1CaA69951dC924A8c222bE19013B89476](https://etherscan.io/address/0x0fE58FE1CaA69951dC924A8c222bE19013B89476) |
ATokenWithDelegation.sol | [0x366ae337897223aea70e3ebe1862219386f20593](https://etherscan.io/address/0x366ae337897223aea70e3ebe1862219386f20593) |


### 1.5 Summary of findings

Severity | # of Findings
--- | ---
CRITICAL| 0
HIGH    | 0
MEDIUM  | 0
LOW | 0


### 1.6 Conclusion

During the audit no vulnerabilities have been found.

The current scope is very well written regarding the ease of understanding and reading the code. All functions can be easily comprehended.

We paid special attention to the following areas:
- new delegation logic, that no double voting is possible, all calculations are correct and work according to specs;
- that there will be no storage collisions after the update;
- that the previous logic for three tokens is not affected;
- current restrictions do not allow for an inflation attack on the `StakedTokenV3` contract;
- there aren't any issues with the accrual of rewards within the existing scope;
- power is calculated correctly for all BaseDelegation implementations;
- the new implementation of EIP712 is correct;
- our other hypotheses were also tested.


## 2. FINDINGS REPORT


### 2.1 Critical

Not found

### 2.2 High

Not found

### 2.3 Medium

Not found

### 2.4 Low

Not found


## 3. ABOUT MIXBYTES
MixBytes is a team of blockchain developers, auditors and analysts keen on decentralized systems. We build opensource solutions, smart contracts and blockchain protocols, perform security audits, work on benchmarking and software testing solutions, do research and tech consultancy.