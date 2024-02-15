# Threshold-USD Security Audit Report

###### tags: `thUSD`

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

Threshold USD is a collateralized stablecoin. A restricted list of highly liquid ERC20 tokens can be used as collateral. For sustainability, the stablecoin implements liquidation and redeem mechanisms. These mechanisms provide stability in a limited range. It should be noted that with a significant market collapse (more than 50%), with insufficient replenishment of the pledge by new users, the risk of unpeg is high.


### 1.4 Project Dashboard

#### Project Summary

Title | Description
--- | ---
Client             | Threshold Network
Project name       | Threshold USD
Timeline           | April 10 2023 - December 29 2023
Number of Auditors | 2

#### Project Log

Date | Commit Hash | Note
--- | --- | ---
10.04.2023 | 800c6c19e44628dfda3cecaea6eedcb498bf0bf3 | Commit for the audit
08.06.2023 | d5e7a5202b4c28b5a825144f820d0b6e73ff1ceb | Commit for the re-audit
11.08.2023 | 2985371f6d1c0f12eaa262644002c0b0d96e76c4 | Commit for the re-audit 2
29.12.2023 | 08b06a9f2a4f5eb23dcf9dbbf8c0d493921dcfdb | Commit for the deployment check

#### Project Scope
The audit covered the following files:
File name | Link
--- | ---
ActivePool.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/ActivePool.sol
BorrowerOperations.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/BorrowerOperations.sol
CollSurplusPool.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/CollSurplusPool.sol
DefaultPool.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/DefaultPool.sol
GasPool.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/GasPool.sol
HintHelpers.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/HintHelpers.sol
Migrations.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/Migrations.sol
MultiTroveGetter.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/MultiTroveGetter.sol
PCV.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/PCV.sol
PriceFeed.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/PriceFeed.sol
SortedTroves.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/SortedTroves.sol
StabilityPool.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/StabilityPool.sol
THUSDToken.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/THUSDToken.sol
TroveManager.sol | https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/TroveManager.sol


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
HIGH    | 1
MEDIUM  | 3
LOW | 5



### 1.6 Conclusion
During the audit process 1 HIGH, 3 MEDIUM, and 5 LOW severity findings were spotted. After working on the reported findings, all of them were acknowledged or fixed by the client.

## 2. FINDINGS REPORT

### 2.1 Critical
Not found

### 2.2 High
#### 1. An attacker can steal the StabilityPool depositors profit 

##### Status
**Acknowledged**

##### Description
The liquidation flow of the protocol is supposed to be as follows:
- users open troves and join `StabilityPool`
- anyone calls the `liquidateTroves` function that iterates the given troves and liquidates them one by one
- `StabilityPool` depositors move collateral gains to their troves and increase the `StabilityPool` ThUSD balance by getting more ThUSD.

By using a flash loan any user can bypass the provision of liquidity to the protocol for a long time and steal some of the `StabilityPool` provider's profit taking the following steps:
1. Let's wait for liquidation opportunities. The following notions are to be introduced: Lsum is the total liquidatable amount of ThUSD and FLusd is the amount of ThUSD that can be accumulated after depositing flashloaned collateral to the protocol; FLfee is the fees the attacker should pay for opening a trove, SPusd is the total ThUSD amount in `StabilityPool`.
The conditions for an attack are:
 Lsum < SPusd + FLusd
 FLfee < Lsum * FLusd / SPusd
2. An attacker gets a flash loan and swaps the Lsum equivalent of the collateral token to ThUSD.
3. The attacker makes a deposit of all remaining collateral tokens to `StabilityPool`.
4. The attacker calls the [`TroveManager::liquidateTroves`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/TroveManager.sol#L464) function to liquidate the troves. If the CR system is lower than 150%, the amount of liqudated troves can be significantly bigger.
5. The attacker calls [`withdrawFromSP`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/StabilityPool.sol#L283) then ['withdrawCollateralGainToTrove'](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/StabilityPool.sol#L310) of `StabilityPool` to move collateral to the attacker's trove. The CR System here has to be more than 150%.
   The attacker's trove here contains the initial collateral and collateral gain.
6. The attacker closes the trove providing the rest of ThUSD plus the Lsum equivalent from step 1.
7. The attacker returns the flash loan.

The attack's impact:
- loss of profit from liquidations by `StabilityPool` providers
- decreased motivation to use the Stability Pool which may cause Threshold USD to unpeg

##### Recommendation
We recommend that you use the time factor to prevent flash loan attacks.

##### Client's commentary
> The protocol still collects the 0.5% fee on the amount borrowed against the flashloan + the protocol still receives its portion of the liquidation. 
There are no incentives on the stability pool so most likely its only the protocol loan that will be in there.

### 2.3 Medium

#### 1. An incorrect collateral value with decimals <> 18

##### Status
**Acknowledged**

##### Description
The [current code](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/PriceFeed.sol#L124) in `PriceFeed.sol` is not suitable for the `ERC20` tokens with `decimals`() not equal to 18. If the `decimals`() value is less than 18, the collateral value will be underestimated, which can result in a trove creation failure due to the [`MIN_NET_DEBT`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/BorrowerOperations.sol#L588) requirement. On the other hand, in the rare case where `decimals`() is greater than 18, the collateral value will be overestimated, which may allow minting of THUSD with an unreasonably low collateral value.

##### Recommendation
It is recommended that the `PriceFeed.sol` contract should rely on the actual `decimals`() value of the `ERC20` token to ensure correct calculations of the collateral value. If no `ERC20` tokens with `decimals`() other than 18 are planned to use, it is recommended to assert the `decimals`() of the `ERC20` token used in the contract is equal to 18.

##### Client's commentary
> thUSD will have two collaterals at the beginning: TBTC and ETH. Both of them are 18 decimals. In case we will consider to add another collateral with another decimals we will have to deploy new set of contracts anyway. And during this process we will adjust code to properly work with that.

#### 2. A cross-check of contract parameters

##### Status
Fixed in https://github.com/Threshold-USD/dev/commit/dfba99bc9d92f4f702a91058e063062daaf8ee83
##### Description
If contracts `ActivePool`, `CollSurplusPool`, `DefaultPool`, `StabilityPool` and `BorrowerOperations` are deployed with the misconfigured `_collateralAddress` parameter, they will be unable to withdraw the deposited collateral.

##### Recommendation
It is recommended to enforce equality of the `_collateralAddress` parameter in the system contracts:
- https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/ActivePool.sol#L43
- https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/BorrowerOperations.sol#L97
- https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/CollSurplusPool.sol#L49
- https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/DefaultPool.sol#L48
- https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/StabilityPool.sol#L206

#### 3. Privileges granted to accounts as `system contracts` cannot be revoked

##### Status
Fixed in https://github.com/Threshold-USD/dev/commit/c7b29908932a62140ec1384aebcebf88b9fd754d
##### Description
Accounts can be marked as [`isTroveManager`, `isBorrowerOperations` and `isStabilityPool`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/THUSDToken.sol#L58-L61). Such accounts have privileged access to some functionality: burn and arbitrary transfer between accounts. However, once granted, this privilege can't be revoked. If one of these accounts become compromised, there is no way to revoke its privileges.

##### Recommendation
It is recommended to introduce functions to pause (temporarily disable)`TroveManager`, `BorrowerOperations` and `StabilityPool` privileges for specified accounts.


### 2.4 Low

#### 1. Arbitrary transfer of `THUSD` by privileged accounts

##### Status
Fixed in https://github.com/Threshold-USD/dev/commit/e9d2176513560848cf3ed1d84376f25b943a35d9

##### Description
Accounts marked as [`StabilityPool`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/THUSDToken.sol#L59) have a permission to perform transfers of any amount of `THUSD` from an arbitrary account to an arbitrary account by the [`sendToPool`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/THUSDToken.sol#L214) function. Additionally, [`StabilityPool` and `TroveManager`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/THUSDToken.sol#L58-L59) can perform a similar arbitrary transfer by the [`returnFromPool`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/THUSDToken.sol#L219) function. This function is designed to manage tokens in pools, however, it can transfer tokens between arbitrary accounts. Such undesired access is relatively safe, but can be involved into more complex attack scenarios.

##### Recommendation
It is recommended to improve the access control by disallowing arbitrary transfers.


#### 2. MCP and CCR management

##### Status
**Acknowledged**

##### Description
`MCP` and `CCR` are constants:
https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/Dependencies/LiquityBase.sol#L21
Over time, the value and volatility of the collateral token may change. It will require to adapt `MCP` and `CCR` to new market behavior. 

##### Recommendation
We recommend that you add methods for changing `MCP` and `CCR` parameters.

##### Client's commentary
> Independent of the collateral volatility, the 110% MCR shouldn't be changed, considering this is precisely the threshold ratio that maintains the peg.
> The CCR should be maintained as well, because it just serves to keep the TCR above 150%, keeping the system healthy with a high quantity of troves not close to the MCR. 

#### 3. Mixed-up error messages in collateral assertions

##### Status
**Acknowledged**

##### Description
Assert messages in the `updateCollateralBalance` and `receive` functions are mixed-up (swapped).

```
require(collateralAddress != address(0),
    "ActivePool: collateral must be ETH");
```

```
require(collateralAddress == address(0),
    "ActivePool: collateral must be ERC20 token");
```

Although assertions are correct and generate revert() at proper conditions, the error messages are incorrect. It may cause an inaccurate diagnosis of the smart contract failures.

This issue appears at:
- [ActivePool](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/ActivePool.sol#L151-161)
- [CollSurplusPool](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/CollSurplusPool.sol#L117-125)
- [DefaultPool](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/DefaultPool.sol#L113-122).

##### Recommendation
It is recommended to use error messages corresponding to the actual error.

##### Client's commentary
> In case when assertion `collateralAddress != address(0)` is wrong, that means that ETH should be used as collateral and wrong method was used.

#### 4. A sanity check of the time interval

##### Status
Fixed in https://github.com/Threshold-USD/dev/commit/a32b2f34e583802d4a4dd63f60d3bdf31e5a0a49

##### Description
The [`governanceTimeDelay`](https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/THUSDToken.sol#L79) parameter value has no sanity check. The deployer can unintentionally use a milliseconds value instead of a seconds value and produce undesired delays before applying timelocked actions.

##### Recommendation
It is recommended to perform a sanity check to disallow an unreasonable large parameter value.


#### 5. Magic values

##### Status
Fixed in https://github.com/Threshold-USD/dev/commit/36c16ead600450a0c0da92975b430be6e06a870e

##### Description
Some code fragments use magic values to determine a trove status. It degrades the readability of the code:
- https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/BorrowerOperations.sol#L508
- https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/BorrowerOperations.sol#L513
- https://github.com/Threshold-USD/dev/blob/800c6c19e44628dfda3cecaea6eedcb498bf0bf3/packages/contracts/contracts/StabilityPool.sol#L651.

##### Recommendation
In favor of the code readability, it is recommended to use named constants instead of magic values.


## 3. ABOUT MIXBYTES
MixBytes is a team of blockchain developers, auditors and analysts keen on decentralized systems. We build opensource solutions, smart contracts and blockchain protocols, perform security audits, work on benchmarking and software testing solutions, do research and tech consultancy.