# Yfi Maker Security Audit Report (merged)

###### tags: `Yearn`

## Introduction
Yearn Finance is a decentralized investment aggregator that leverages composability and uses automated strategies to earn high yield on crypto assets.
Yearn vaults represent a user funds manager in Yearn ecosystem.
Smart contract itself is a base contract for strategies. It defines strategy interface and provides common functionality and restrictions for them.
The contract is designed to be overridden by particular strategy and allows to implement any custom logic and at same time one may not worry about interface compatibility.

### Project overview
Part of Yearn Strategy Mix.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/orbxball/yfi-maker/blob/63af6fcfa536073f00d652f49befd18e429b5500/contracts/Strategy.sol

The audited commit identifier is `63af6fcfa536073f00d652f49befd18e429b5500`

## Security Assessment Methodology

A group of auditors are involved in the work on the audit who check the provided source code independently of each other in accordance with the methodology described below:

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
#### 1. Losses are not taken into account in the strategy
##### Description
At line: https://github.com/orbxball/yfi-maker/blob/63af6fcfa536073f00d652f49befd18e429b5500/contracts/Strategy.sol#L264-L277
the `liquidatePosition()` function does not take into account the value of the`_loss` variable accounting in `prepareReturn()` function. In this case the `liquidatePosition()` function will always return `_liquidatedAmount = _amountNeeded` excluding losses.
This implementation may lead to revert when the Vault call the function `withdraw` function (at line https://github.com/yearn/yearn-vaults/blob/952b767fcd597fac8aa2cf5d023532d150bb9236/contracts/BaseStrategy.sol#L681) by reason of the insufficient balance. 
  
Also the withdrawer from vault should incur the losses from liquidation caused by his own withdrawal. However, the [liquidatePosition()](https://github.com/orbxball/yfi-maker/blob/63af6fcfa536073f00d652f49befd18e429b5500/contracts/Strategy.sol#L264) is ignoring any losses from underlying DAI vault. This may lead to improper accounting of user balances and possible locking of vault withdrawals.  
  
##### Recommendation
It is recommended to rewrite logic of `liquidatePosition()`  considering the losses.

##### Status
Partially fixed at https://github.com/orbxball/yfi-maker/commit/cf9604bf26a8a68ce664b37d746e868cfd49a3c8

Fixes commentary:
* Fixed: 
  - Withdrawals from underlying DAI vault with losses can be approved.
  - Withdrawals on failed to liquidate will not be reverted.
* Problem remains: 
  - If the strategy suffer a loss from DAI vault, a bad debt will be formed. This debt is hidden until the vault is trying to liquidate it. So we have a bit unfair distribution of losses between vault users.
  - 



### WARNINGS

#### 1. The approval value obtained in the constructor may not be enough for the long term of the smart contract
##### Description
At line: https://github.com/orbxball/yfi-maker/blob/63af6fcfa536073f00d652f49befd18e429b5500/contracts/Strategy.sol#L69
the smart contract constructor call `_approveAll()` function for different tokens. But in the process of work, the obtained value will only decrease. If this value decreases to zero, then the tokens will remain locked in the contract forever.
  
##### Recommendation
It is recommended to add a function to increase the value of approvals.

##### Status
Fixed at https://github.com/orbxball/yfi-maker/commit/cf9604bf26a8a68ce664b37d746e868cfd49a3c8



#### 2. There is no check on the result of the function
##### Description
According to the ERC20 standard, the `approve()` function returns a boolean value. But in the contract on lines https://github.com/orbxball/yfi-maker/blob/63af6fcfa536073f00d652f49befd18e429b5500/contracts/Strategy.sol#L69-L76, after the call to the `_approveAll()` function, this values are not processed. A situation may arise that a False will return. 

##### Recommendation
It is recomended to add a check of the return value.

##### Status
Acknowledged


### COMMENTS

#### 1. Using "magic" numbers
##### Description
At line https://github.com/orbxball/yfi-maker/blob/63af6fcfa536073f00d652f49befd18e429b5500/contracts/Strategy.sol#L61-L62 use some of unknown variables  impairs its understanding.

##### Recommendation
It is recommended that you create variables  with meaningful names for using numeric values or add comments.

##### Status
Acknowledged


#### 2. Use constants
##### Description
At lines https://github.com/orbxball/yfi-maker/blob/63af6fcfa536073f00d652f49befd18e429b5500/contracts/Strategy.sol#L32-L37 you may add constants for save gas.

##### Recommendation
It is recommended to add constanst to hardcoded address variables.

##### Status
Fixed at https://github.com/orbxball/yfi-maker/commit/cf9604bf26a8a68ce664b37d746e868cfd49a3c8


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR    | 1
WARNING  | 2
COMMENT  | 2


### Executive summary
The main purpose of the project is to allow users to add additional ability to use the Maker Protocol managed by strategy. 

### Conclusion
Smart contract has been audited and several suspicious places were found. During the audit no critical issues were found.  One issue was marked major as it may lead to undesired behavior. Several issues were marked as warnings and comments. After working on audit report some issues were fixed by client, but the major issue about `Losses are not taken into account in the strategy` was partially fixed only.

Final commit identifier with all fixes: `cf9604bf26a8a68ce664b37d746e868cfd49a3c8`








