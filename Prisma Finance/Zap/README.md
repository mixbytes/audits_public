# Prisma Finance Zap Security Audit Report

###### tags: `prisma`, `Zap`

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
`MigrateTroveZap` allows users to migrate their positions from one Trove to another. It is important to note that in the process of migration, the user's debt will have been increased by a Iflashloan fee. Flashloan is used to fully cover the user's debt in the first Trove.


### 1.4 Project Dashboard

#### Project Summary

Title | Description
--- | ---
Client             | Prisma Finance
Project name       | Zap
Timeline           | April 04 2024 - April 05 2024
Number of Auditors | 3

#### Project Log

Date | Commit Hash | Note
--- | --- | ---
04.04.2024 | d45c5b596b84601edad9383e986e9607590263da | Commit for the audit

#### Project Scope
The audit covered the following files:

File name | Link
--- | ---
contracts/zaps/BaseZap.sol | https://github.com/owsley3/prisma-contracts/blob/d45c5b596b84601edad9383e986e9607590263da/contracts/zaps/BaseZap.sol
contracts/zaps/MigrateTroveZap.sol | https://github.com/owsley3/prisma-contracts/blob/d45c5b596b84601edad9383e986e9607590263da/contracts/zaps/MigrateTroveZap.sol


#### Deployments
File name | Contract deployed on mainnet | Comment
--- | --- | ---
MigrateTroveZap | [0x5c15ceD59fD964fCFFF2d2F376b4a40b6D1Fce1c](https://etherscan.io/address/0x5c15ceD59fD964fCFFF2d2F376b4a40b6D1Fce1c) | 
MigrateTroveZap | [0x1371c1DAE7D3ad43BB79eccE1B882aD9754f9047](https://etherscan.io/address/0x1371c1DAE7D3ad43BB79eccE1B882aD9754f9047) |


### 1.5 Summary of findings

Severity | # of Findings
--- | ---
CRITICAL| 0
HIGH    | 0
MEDIUM  | 0
LOW | 0



### 1.6 Conclusion

During the audit process, no new findings have been spotted. The `MigrateTroveZap` contract had a CRITICAL vulnerability in the previous version. This vulnerability caused damage to the Prisma protocol around ~$11.6M. **This vulnerability was correctly fixed by the team in the new version** by verifying the originator of the request in the `onFlashLoan()` function.

Additionally, we reviewed the code against an internal checklist that covers aspects such as business logic issues, common ERC-20 issues, debt calculation problems, attack vectors related to interactions with external contracts, calculations overflow, reentrancy attacks, and access control. **No issues were found.**

The current scope is very well written regarding the ease of understanding and reading the code. All functions can be easily comprehended.


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