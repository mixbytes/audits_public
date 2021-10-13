# Liquity stability pool Security Audit Report (merged)

###### tags: `Yearn`

## Introduction
Yearn Finance is a decentralized investment aggregator that leverages composability and uses automated strategies to earn high yield on crypto assets.
Yearn vaults represent a user funds manager in 
Yearn ecosystem.
### Project overview
Smart contract is a strategy to earn WETH by borrowing LUSD and depositing it into the Liquity stability pool.
### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol
The audited commit identifier is `c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d`, `e14ddae794b3be8f6c5cb39b8cac4e168c366bb1`

## Security Assessment Methodology

3 security auditors and 1 tech lead are involved in the work on the audit who check the provided source code independently of each other in accordance with the methodology described below:

### 1. Blind audit.

* Manual code study.
* Reverse research and study of the architecture of the code based on the source code only.

```
Stage goals:
* Building an independent view of the project’s architecture.
* Finding logical flaws.
```

### 2. Checking the code against the checklist of known vulnerabilities.

* Manual code check for vulnerabilities from the company's internal checklist.
* The company's checklist is constantly updated based on the analysis of hacks, research and audit of the clients’ code.

```
Stage goal: 
Eliminate typical vulnerabilities (e.g. reentrancy, gas limit, flashloan attacks etc.)
```

### 3. Checking the logic, architecture of the security model for compliance with the desired model.

* Detailed study of the project documentation
* Examining contracts tests
* Examining comments in code
* Comparison of the desired model obtained during the study with the reversed view obtained during the blind audit

```
Stage goal: 
Detection of inconsistencies with the desired model
```


### 4. Consolidation of the reports from all auditors into one common interim report document:
* Cross check: each auditor reviews the reports of the others
* Discussion of the found issues by the auditors
* Formation of a general (merged) report

```
Stage goals: 
* Re-check all the problems for relevance and correctness of the threat level
* Provide the client with an interim report
```

### 5. Bug fixing & re-check.
* Client fixes or comments on every issue
* Upon completion of the bug fixing, the auditors double-check each fix and set the statuses with a link to the fix

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
##### Files
https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol

##### Description
The withdrawer from vault should incur the losses from liquidation caused by his own withdrawal. However, the [liquidatePosition()](https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol#L307) is ignoring possible trove liquidation. Currenly liquidation will cause revert, but even if not, currently strategy is ignoring the case of trove liquidation. This may lead to improper accounting of user balances and possible locking of vault withdrawals.

##### Recommendation
It is recommended to rewrite logic of `liquidatePosition()`  considering the liquidation.

##### Status
Fixed at https://github.com/orbxball/liquity-stability-pool/blob/e14ddae794b3be8f6c5cb39b8cac4e168c366bb1/contracts/Strategy.sol



#### 2. Malfunction of strategy and entire vault on unexpected trove status
##### Files 
https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol
##### Description
A *liquity trove* can be in one of several states: *nonExistent, active, closedByOwner, closedByLiquidation, closedByRedemption*. When the *trove* is in state different than *active*, any call to *ajdustTrove()* will fail. Unfortunately, the strategy does not implement proper handling of trove state. There is some scenarios that will cause trove to be in unexpected state: trove liquidation, full collaterial redemption and trove manual *[closing](https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol#L374)* by priveleged user.

The [*_deposit()*](https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol#L216) function is expected only two states: *zero* (which is *nonExistent*) and other (which is *active, closedByOwner, closedByLiquidation, closedByRedemption*). However, only *active* state is valid for *[adjustTrove](https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol#L237)*, other three states will cause revert.

The *[liquidatePosition()](https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol#L307)* function does not handle trove state. When trove is in any state except *active*, *liquidatePosition()* will revert on *[adjustTrove()](https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol#L322)* call. This will break harvest() and withdraw() functions so strategy will become broken and should be manually removed from the vault to prevent blocking of any withdrawal from it.

##### Recommendation 
It is recommended to handle state of the trove properly.

##### Status
Fixed at https://github.com/orbxball/liquity-stability-pool/blob/e14ddae794b3be8f6c5cb39b8cac4e168c366bb1/contracts/Strategy.sol




### WARNINGS

#### 1. There is no check on the result of the function
##### Description
According to the ERC20 standard, the `approve()` function returns a boolean value. But in the contract on lines https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol#L120-L123, after the call to the `_approveAll()` function, this values are not processed.     A situation may arise that a False will return. 

##### Recommendation
It is recommended to add a check of the return value.

##### Status
Acknowledged


#### 2. The approval value obtained in the constructor may not be enough for the long term of the smart contract
##### Description
At line: https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol#L115
the smart contract constructor call `_approveAll()` function for different tokens. But in the process of work, the obtained value will only decrease. If this value decreases to zero, then the tokens will remain locked in the contract forever.
  
##### Recommendation
It is recommended to add a function to increase the value of approvals.

##### Status
Fixed at https://github.com/orbxball/liquity-stability-pool/commit/e14ddae794b3be8f6c5cb39b8cac4e168c366bb1


#### 3. Overreportion of the losses
##### Files 
https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol
##### Description
In some rare conditions the liquidatePosition may report that all requested liquidity is lost even if no losses are actually suffered. Such liquidation may occur during harvest() and do a major overreporting to the vault and break its accounting. As no losses are suffered actually, this state can be fixed by migrating to a "fixing" strategy. However, the vault accounting will be invalid until manual interaction of the vault governance, and the vault shares will be underpriced.

##### Recommendation
To fix overreporting

##### Status
Acknowledged

##### Client's commentary
Reporting full loss to vault, under current logic it's not catastrophic. We concluded that we could avoid that with monitoring.

### COMMENTS

#### 1. Unused variable
##### Files 
https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol
##### Description
Variable [`_weth`](https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol#L386) is unused.
 ##### Recommendation
It is recommended to remove variable.

##### Status
Fixed at https://github.com/orbxball/liquity-stability-pool/commit/e14ddae794b3be8f6c5cb39b8cac4e168c366bb1


#### 2. Repeated `provideToSP`
##### Description

`spool.provideToSP` is executing in any condition https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol#L234-L238

##### Recommendation
Put [line](https://github.com/orbxball/liquity-stability-pool/blob/c3fa76af0a4e2d5fd7132b8e24361d5b7439a75d/contracts/Strategy.sol#L234) out of if-else statement.

##### Status
Fixed at https://github.com/orbxball/liquity-stability-pool/commit/e14ddae794b3be8f6c5cb39b8cac4e168c366bb1


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR    | 2
WARNING  | 3
COMMENT  | 2


### Executive summary
The main purpose of the project is to give users add additional ability to use the  protocol managed by strategy.

### Conclusion
Smart contract has been audited and several suspicious places have been spotted. During the audit no critical issues were found, two issues were marked as major because they could lead to some undesired behavior, also several warnings and comments were found and discussed with the client. After working on the reported findings all of them were resolved or acknowledged (if the problem was not critical). So, the contracts are assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `e14ddae794b3be8f6c5cb39b8cac4e168c366bb1`