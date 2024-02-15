# Threshold-USD BAMM Security Audit Report

###### tags: `thUSD`, `BAMM`

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
Threshold USD is a decentralized protocol that allows BTC and Ether holders to obtain maximum liquidity against their collateral without paying interest. After locking up BTC or ETH as collateral in a smart contract and creating an individual position called a "trove", the user can get instant liquidity by minting thUSD, a USD-pegged stablecoin. Each trove is required to be collateralized at a minimum of 110%. Any owner of thUSD can redeem their stablecoins for the underlying collateral at any time. The redemption mechanism along with algorithmically adjusted fees guarantee a minimum stablecoin value of USD 1.



### 1.4 Project Dashboard

#### Project Summary

Title | Description
--- | ---
Client             | Threshold Network
Project name       | B.Protocol
Timeline           | May 15 2023 - December 29 2023
Number of Auditors | 2

#### Project Log

 Date | Commit Hash | Note
--- | --- | ---
04.05.2023 | 800c6c19e44628dfda3cecaea6eedcb498bf0bf3 | Commit for the audit
08.06.2023 | d5e7a5202b4c28b5a825144f820d0b6e73ff1ceb | Commit for the re-audit
11.08.2023 | 2985371f6d1c0f12eaa262644002c0b0d96e76c4 | Commit for the re-audit 2
29.12.2023 | 08b06a9f2a4f5eb23dcf9dbbf8c0d493921dcfdb | Commit for the deployment check

#### Project Scope
The audit covered the following files:

File name | Link
--- | ---
BAMM.sol | https://github.com/Threshold-USD/dev/tree/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/B.Protocol/BAMM.sol
BLens.sol | https://github.com/Threshold-USD/dev/tree/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/B.Protocol/BLens.sol
CropJoinAdapter.sol | https://github.com/Threshold-USD/dev/tree/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/B.Protocol/CropJoinAdapter.sol
PriceFormula.sol | https://github.com/Threshold-USD/dev/tree/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/B.Protocol/PriceFormula.sol
YieldBoxRebase.sol | https://github.com/Threshold-USD/dev/tree/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/B.Protocol/YieldBoxRebase.sol



#### Deployments

Contract | Address | Comment
--- | --- | ---
THUSDToken | [0xCFC5bD99915aAa815401C5a41A927aB7a38d29cf](https://etherscan.io/address/0xCFC5bD99915aAa815401C5a41A927aB7a38d29cf#code)
StabilityPool.sol | [0xF6374AEfb1e69a21ee516ea4B803b2eA96d06f29](https://etherscan.io/address/0xF6374AEfb1e69a21ee516ea4B803b2eA96d06f29#code) | tBTC collateral
PCV.sol | [0x097f1ee62E63aCFC3Bf64c1a61d96B3771dd06cB](https://etherscan.io/address/0x097f1ee62E63aCFC3Bf64c1a61d96B3771dd06cB#code) | tBTC collateral
PriceFeed.sol | [0x83aE3931C5D03773755311372c0737F856657a43](https://etherscan.io/address/0x83aE3931C5D03773755311372c0737F856657a43#code) | tBTC collateral
BAMM.sol | [0x920623AcBa785ED9a70d33ACab53631e1e834675](https://etherscan.io/address/0x920623AcBa785ED9a70d33ACab53631e1e834675#code) | tBTC collateral
StabilityPool.sol | [0xA18Ab4Fa9a44A72c58e64bfB33D425Ec48475a9f](https://etherscan.io/address/0xA18Ab4Fa9a44A72c58e64bfB33D425Ec48475a9f#code) | ETH collateral
PCV.sol | [0x1a4739509F50E683927472b03e251e36d07DD872](https://etherscan.io/address/0x1a4739509F50E683927472b03e251e36d07DD872#code) | ETH collateral
PriceFeed.sol | [0x684645ccAB4d55863A149C52eC3176051Cdb732d](https://etherscan.io/address/0x684645ccAB4d55863A149C52eC3176051Cdb732d#code) | ETH collateral
BAMM.sol | [0x1f490764473eb1013461D6079F827DB95d8B4DC5](https://etherscan.io/address/0x1f490764473eb1013461D6079F827DB95d8B4DC5#code) | ETH collateral



### 1.5 Summary of findings

Severity | # of Findings
--- | ---
CRITICAL| 0
HIGH    | 0
MEDIUM  | 4
LOW | 3

### 1.6 Conclusion

During the audit process 4 MEDIUM, and 3 LOW severity findings were spotted. After working on the reported findings, all of them were acknowledged or fixed by the client.

## 2. FINDINGS REPORT

### 2.1 Critical
Not found

### 2.2 High
Not found

### 2.3 Medium
#### 1. The `swap` function doesn't check insufficient liquidity
##### Status
**Acknowledged**
##### Description
It's common practice to check that the protocol has enough amount of tokens to make a swap. The `minCollateralReturn` parameter has to be used only for preventing sandwich attacks (price manipulation) but in BAMM smart contract this parameter is also used as a liquidity check. 

Let's suppose that an attacker is the biggest depositor of the BAMM contract. The attacker can always front-run swap function calls and keep the given `minCollateralReturn` collateral amount on the contract. Calling the [`swap`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/B.Protocol/BAMM.sol#L250) function with `minCollateralReturn` is a way to lose money even if the price has not been changed. As a result, users will always get `minCollateralReturn` tokens.
##### Recommendation
We recommend adding a lack of liquidity check.
##### Client's commentary
> In some cases user would need specify value that lower than 99.5% (if he profit from an arbitrage). So such check would not allow to do that. Besides this interface already used on B.Protocol side.

#### 2. The `Trade` function doesn't use `minCollateralAmount`
##### Status
**Acknowledged**
##### Description
[`This function`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/B.Protocol/BAMM.sol#L268) can be used by mistake by someone and according to the M-1 it leads to losing money because the `minCollateralAmount` parameter is always zero.
##### Recommendation
We recommend adding a restriction that `trade` is called only by the Kyber protocol contracts.
##### Client's commentary
> This function is part of interface that planned to be used by bots

#### 3. The `Receive` function revert
##### Status
Fixed in https://github.com/Threshold-USD/dev/commit/cf9b0db2f4b6ea457ad04b359e017d5e3153780c
##### Description
The BAMM contract supports only one collateral token. If it is set to ERC20 tokens the [`receive`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/B.Protocol/BAMM.sol#L289) function has to revert all ETH transfers to the contract.
##### Recommendation
We recommend adding a check for the `collateralERC20` address and the sender's address.


#### 4. Insuffisient quality of the `_collateralERC20` check in BAMM
##### Status
Fixed in https://github.com/Threshold-USD/dev/commit/6399a825ec38de3f7958baf60981ff6d5d15ae89
##### Description
It is possible to provide the wrong address in the `_collateralERC20` parameter's value to the BAMM constructor:
- value that is different from StabilityPool,
- value that is not an ERC20 token,
- address of a token with the wrong decimals value (not 18)
##### Recommendation
We recommend adding a check of the `_collateralAddress` address parameter or removing this parameter from the constructor and getting it from the `StabilityPool` contract.


### 2.4 Low
#### 1. `Ownable` can be upgraded to `Ownable2Step`
##### Status
**Acknowledged**
##### Description
`BAMM` uses `Ownable`'s functionality:
https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/B.Protocol/BAMM.sol#L17.
The `Ownable` contract can be upgraded to OpenZeppelin's `Ownable2Step`:
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable2Step.sol.
`Ownable2Step` provides added safety due to its securely designed two-step process.
##### Recommendation
We recommend using `Ownable2Step`.
##### Client's commentary
>Owner will be DAO so everything related to this will be covered on governance side

#### 2. `maxDiscount` is not customizable
##### Status
**Acknowledged**
##### Description
`maxDiscount` doesn't have a setter to change the value.
- https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/B.Protocol/BAMM.sol#L34
##### Recommendation
We recommend adding a setter to manage this parameter similar to `setParams`.
##### Client's commentary
>This is part of B.Protocol so it will be set only once during deployment

#### 3. Ignoring the `updatedAt` param
##### Status
Fixed in https://github.com/Threshold-USD/dev/commit/43c31714bd5d0d5700b5035e6ae70b14eb88462d
##### Description
When `latestRoundData` is taken, the time of the last update is not checked. Thus, the Oracle's price may not be updated for a long time.
- https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/B.Protocol/BAMM.sol#L213
##### Recommendation
We recommend that you should not apply `compensateForTHUSDDeviation` if `Oracle` has not been updated for a long time.


## 3. ABOUT MIXBYTES
MixBytes is a team of blockchain developers, auditors and analysts keen on decentralized systems. We build opensource solutions, smart contracts and blockchain protocols, perform security audits, work on benchmarking and software testing solutions, do research and tech consultancy.