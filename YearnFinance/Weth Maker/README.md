# Weth Maker Security Audit Report (merged)

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
https://github.com/orbxball/weth-maker/blob/39cfbee59bcebfce19a5b9ac6f11fb84f3ab7b23/contracts/Strategy.sol

The audited commit identifier is `39cfbee59bcebfce19a5b9ac6f11fb84f3ab7b23`.

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
At line: https://github.com/orbxball/weth-maker/blob/39cfbee59bcebfce19a5b9ac6f11fb84f3ab7b23/contracts/Strategy.sol#L260 when strategy calls the `liquidatePosition()` function if at this point yvdai have losses we have three branches:

 - if `_amountNeeded` > real balance of strategy after all liquidations we got revert (it's not very good, because users can't withdraw their funds);
 - if `_amountNeeded` < real balance of strategy user will withdraw funds, but vault won't consider losses and all losses will be distributed across all users who left after first withdraw;
 - if `yvdai` have losses more than 0.01([default BPS](https://github.com/yearn/yearn-vaults/blob/v0.3.2/contracts/Vault.vy#L928)) `liquidatePosition()` will reverted while [yvdai.withdraw](https://github.com/orbxball/weth-maker/blob/39cfbee59bcebfce19a5b9ac6f11fb84f3ab7b23/contracts/Strategy.sol#L377) (so that means that if yvdai got losses of more than 0.01% any strategies depending on it will be blocked.


Fixes commentary:
* Fixed: 
  - Withdrawals from underlying DAI vault with losses can be approved.
  - Withdrawals on failed to liquidate will not be reverted.
* Problem remains: 
  - If the strategy suffer a loss from DAI vault, a bad debt will be formed. This debt is hidden until the vault is trying to liquidate it. So we have a bit unfair distribution of losses between vault users.

##### Recommendation
It is recommended to rewrite logic of `liquidatePosition()`  considering the losses.

##### Status
Partially fixed at https://github.com/orbxball/weth-maker/commit/3ed8174c550e1b8f23c0ea62151b05dfd70a566b


### WARNINGS

#### 1. The approval value obtained in the constructor may not be enough for the long term of the smart contract
##### Description
At line: https://github.com/orbxball/weth-maker/blob/39cfbee59bcebfce19a5b9ac6f11fb84f3ab7b23/contracts/Strategy.sol#L68 the smart contract constructor calls `_approveAll()` function for different tokens. But in the process of work, the obtained value will only decrease. If this value decreases to zero, then the tokens will remain locked in the contract forever.
  
##### Recommendation
It is recommended to add a function to increase the value of approvals.

##### Status
Fixed at https://github.com/orbxball/weth-maker/commit/3ed8174c550e1b8f23c0ea62151b05dfd70a566b


#### 2. There is no check on the result of the function
##### Description
According to the ERC20 standard, the `approve()` function returns a boolean value. But in the contract at lines https://github.com/orbxball/weth-maker/blob/39cfbee59bcebfce19a5b9ac6f11fb84f3ab7b23/contracts/Strategy.sol#L68-L75, after the call to the `_approveAll()` function, this values are not processed. A situation may arise that a False will return. 

##### Recommendation
It is recommended to add a check of the return value.

##### Status
Acknowledged


#### 3. Wrong comparison
##### Description
At line: https://github.com/orbxball/weth-maker/blob/39cfbee59bcebfce19a5b9ac6f11fb84f3ab7b23/contracts/Strategy.sol#L217 left operand has unit `1e+6` and the right operand has unit `1e+10`.
```solidity=
if (_current > DENOMINATOR.mul(c_safe).mul(1e2)) {//  1e6 > 10000 * 40000 * 1e2 
    _current = DENOMINATOR.mul(c_safe).mul(1e2);

```
In this implementation where `c_safe = 40000;` this code will be ignored.

##### Recommendation
It is recommended to change `c_safe` value after deploy.

##### Status
Acknowledged


### COMMENTS

#### 1. Using "magic" numbers
##### Description
At line https://github.com/orbxball/weth-maker/blob/39cfbee59bcebfce19a5b9ac6f11fb84f3ab7b23/contracts/Strategy.sol#L60-L61 use some of unknown variables  impairs its understanding.

##### Recommendation
It is recommended that you create variables  with meaningful names for using numeric values or add comments.

##### Status
Fixed at https://github.com/orbxball/weth-maker/commit/3ed8174c550e1b8f23c0ea62151b05dfd70a566b



#### 2. Use constants
##### Description
At lines https://github.com/orbxball/weth-maker/blob/39cfbee59bcebfce19a5b9ac6f11fb84f3ab7b23/contracts/Strategy.sol#L32-L41 you may add constants for save gas.

##### Recommendation
It is recommended to add constants to hardcoded address variables.

##### Status
Fixed at https://github.com/orbxball/weth-maker/commit/3ed8174c550e1b8f23c0ea62151b05dfd70a566b



### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR    | 1
WARNING  | 3
COMMENT  | 2


### Executive summary
The main purpose of the project is to allow users to add additional ability to use the Maker Protocol managed by the strategy. 

### Conclusion
Smart contract has been audited and several suspicious places were found. During audit no critical issues were found. One issue was marked major as it may lead to unintended behavior. Several issues were marked as warnings and comments. After working on audit report some issues were fixed by client, but the major issue about `Losses are not taken into account in the strategy` was partially fixed only. 
Final commit identifier with all fixes: `3ed8174c550e1b8f23c0ea62151b05dfd70a566b`