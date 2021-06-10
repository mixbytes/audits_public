# SpiritSwap-Core Security Audit Report (merged)

###### tags: `Yearn`

## Introduction

### Project overview
SpiritSwap is a decentralized exchange (DEX) on the Fantom Opera Chain. 
SpiritSwap’s design is based on the Uniswap constant-product automated market maker (AMM). In an AMM, liquidity providers simply deposit a pair of tokens and an algorithm automatically makes markets for the token pair. Traders can easily swap between tokens in the AMM and get guaranteed rates for the swaps. Each swap on SpiritSwap incurs a fee, which gets distributed to liquidity providers.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/Layer3Org/spiritswap-core/blob/a23463f87fd3c7633e97fab5e8124b4499e1519e/SPIRITMasterChef.sol
https://github.com/Layer3Org/spiritswap-core/blob/a23463f87fd3c7633e97fab5e8124b4499e1519e/SPIRITToken.sol
https://github.com/Layer3Org/spiritswap-core/blob/a23463f87fd3c7633e97fab5e8124b4499e1519e/SpiritFactory.sol
https://github.com/Layer3Org/spiritswap-core/blob/a23463f87fd3c7633e97fab5e8124b4499e1519e/SpiritMultiCall.sol
https://github.com/Layer3Org/spiritswap-core/blob/a23463f87fd3c7633e97fab5e8124b4499e1519e/SpiritRouter.sol

The audited commit identifier is `a23463f87fd3c7633e97fab5e8124b4499e1519e`

## Security Assessment Methodology

3 security auditors and 1 tech lead are involved in the work on the audit who check the provided source code independently of each other in accordance with the methodology described below:

### 1. Project architecture review.

* Reviewing project documentation.
* General code review.
* Reverse research and study of the architecture of the code based on the source code only.
* Mockup prototyping.

```
Stage goals:
* Building an independent view of the project's architecture and identifying logical flaws in the code.
```

### 2. Checking the code against the checklist of known vulnerabilities.

* Manual code check for vulnerabilities from the company's internal checklist.
* The company's checklist is constantly updated based on the analysis of hacks, research and audit of the clients’ code.
* Checking with static analyzers (i.e Slither, Mythril, etc).

```
Stage goal: 
Eliminate typical vulnerabilities (e.g. reentrancy, gas limit, flashloan attacks etc.)
```

### 3. Checking the code for compliance with the desired security model.

* Detailed study of the project documentation.
* Examining contracts tests.
* Examining comments in code.
* Comparison of the desired model obtained during the study with the reversed view obtained during the blind audit.
* Exploits PoC development using brownie.

```
Stage goal: 
Detection of inconsistencies with the desired model
```


### 4. Consolidation of interim auditor reports into general one.

* Cross check: each auditor reviews the reports of the others.
* Discussion of the found issues by the auditors.
* Formation of a general (merged) report.

```
Stage goals: 
* Re-check all the problems for relevance and correctness of the threat level
* Provide the client with an interim report
```

### 5. Bug fixing & re-check.
* Client fixes or comments on every issue.
* Upon completion of the bug fixing, the auditors double-check each fix and set the statuses with a link to the fix.

```
Stage goal:
Preparation of the final code version with all the fixes
```

### 6. Preparation of the final audit report and delivery to the customer.


## Findings Severity breakdown

### Classification of Issues

* CRITICAL: Bugs leading to assets theft, fund access locking, or any other loss funds to be transferred to any party. 
* MAJOR: Bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement.
* WARNINGS: Bugs that can break the intended contract logic or expose it to DoS attacks. 
* COMMENTS: Other issues and recommendations reported to/ acknowledged by the team.

Based on the feedback received from the Customer's team regarding the list of findings discovered by the Contractor, they are assigned the following statuses:

### Findings' breakdown status

* FIXED: Recommended fixes have been made to the project code and no longer affect its security.
* ACKNOWLEDGED: The project team is aware of this finding. Recommendations for this finding are planned to be resolved in the future. This finding does not affect the overall safety of the project.
* NO ISSUE: Finding does not affect the overall safety of the project and does not violate the logic of its work
* NEW: Waiting for project team's feedback on the finding discovered  


## Report

### CRITICAL
Not found

### MAJOR
Not found

### WARNINGS

#### 1. Useless/insecure pause functionality into SpiritFactory
##### Files 
https://github.com/Layer3Org/spiritswap-core/blob/a23463f87fd3c7633e97fab5e8124b4499e1519e/SpiritFactory.sol
##### Description
The SpiritFactory contains implementation to pause / to lock swap operations. https://github.com/Layer3Org/spiritswap-core/blob/a23463f87fd3c7633e97fab5e8124b4499e1519e/SpiritFactory.sol#L499 However, that lock status is ignored inside PancakePair and can be easyly avoided by an attacker.
##### Recommendation
Please note that PancakePair `swap()` function has unrestricted access. Any swap-related restrictions should be implemented inside the PancakePair instead of the other contracts. Depending on what is actually required, we recommend to move implementation of pause/lock into PancakePair or to remove it and save the gas.

##### Status
Acknowledged
##### Client's commentary
This was added as a feature to lock the swap function. We made this because there was a scammer who was scanning the transactions and doing swap against the pancake LPs before we launched. This will be removed as part of the AMM upgrade in future.


### COMMENTS

#### 1. Function getMultiplier() can be restricted to "pure"
##### Description
At the line
https://github.com/Layer3Org/spiritswap-core/blob/a23463f87fd3c7633e97fab5e8124b4499e1519e/SPIRITMasterChef.sol#L1251
the "view" modifier is used for function restriction, but when a function does not read any storage data, it's recommended to use "pure" modificator instead of "view".

##### Recommendation
Use "pure" modificator or inline function.
##### Status
Acknowledged
##### Client's commentary
This will be fixed as part of the AMM upgrade in future

#### 2. getReserves() contains unused function call
##### Description
This function 
https://github.com/Layer3Org/spiritswap-core/blob/a23463f87fd3c7633e97fab5e8124b4499e1519e/SpiritRouter.sol#L274
has unused pairFor() call
##### Recommendation
We recommend to remove line 274
##### Status
Acknowledged
##### Client's commentary
This will be removed as part of the AMM upgrade in future

#### 3. Unsafe fee recipient addresses transition
##### Description
The setter functions of fee and developer fee address https://github.com/Layer3Org/spiritswap-core/blob/a23463f87fd3c7633e97fab5e8124b4499e1519e/SPIRITMasterChef.sol#L1360 does not do any check on new address. If a wrong address is accidentally used, there is no way to fix it anymore.
##### Recommendation
We recommend to transfer ownership and fee addresses into two steps: approve by the old address and accept by a new address.
##### Status
Acknowledged
##### Client's commentary
This will be fixed as part of the AMM upgrade in future

#### 4. YAM protocol incompliance/useless operation for YAM protocol compliance
##### Files 
https://github.com/Layer3Org/spiritswap-core/blob/a23463f87fd3c7633e97fab5e8124b4499e1519e/SPIRITToken.sol
##### Description
The SPIRIT token contains some code pieces for YAM protocol implementation. However, implementation is incomplete, e.g. withdrawal doesn’t move delegation to the recipient.
##### Recommendation
We recommend to complete or to remove YAM compliance implementation depending on whether is YAM implementation actually planned or not.
##### Status
Acknowledged
##### Client's commentary
This will be fixed as part of the AMM upgrade in future

## Results
Level | Amount
--- | ---
CRITICAL | -
MAJOR    | -
WARNING  | 1
COMMENT  | 4

### Executive summary
In the scope of the audit there are several smart-contracts intended to add, remove and provide liquidity, implement swap of tokens and automatically issue of project token SPIRIT as a fee for liquidity participated in the swap operations.

### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical or major issues were found. One issue was marked as warning and several comments were found and discussed with the client. After working on the reported findings all of them were acknowledged (as the problems were not critical). So, the contracts are assumed as secure to use according to our security criteria.

 