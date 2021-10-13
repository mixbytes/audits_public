# Incentives-proposal upd Security Audit Report (merged)

###### tags: `Aave`

## Introduction

### Project overview
The audited scope of contracts manages the incentives related with liquidity on the Aave Protocol.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/incentives/DistributionManager.sol
https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/incentives/StakedTokenIncentivesController.sol
https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/interfaces/IAaveDistributionManager.sol
https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/lib/DistributionTypes.sol
https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/lib/SafeMath.sol
https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/interfaces/IAaveIncentivesController.sol
https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/interfaces/IScaledBalanceToken.sol
https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/interfaces/IStakedTokenWithConfig.sol

The audited commit identifier is `f6712e33db79210a7ae8106f7cfa1ce2adea8d69`

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
Not found

### WARNINGS
Not found

### COMMENTS

#### 1. Zero values
##### Description
No check for zero values at constructor for parameters `stakeToken` https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/incentives/StakedTokenIncentivesController.sol#L45 and `emissionManager` https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/incentives/DistributionManager.sol#L37
##### Recommendation
We recommend to check for zero values
##### Status
Acknowledged


#### 2. Local variable shadowing
##### Description
At the line
- https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/incentives/DistributionManager.sol#L28
and the lines:
- https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/incentives/StakedTokenIncentivesController.sol#L57
- https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/incentives/StakedTokenIncentivesController.sol#L92
- https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/incentives/StakedTokenIncentivesController.sol#L113
- https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/incentives/StakedTokenIncentivesController.sol#L123
- https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/incentives/StakedTokenIncentivesController.sol#L134
- https://github.com/aave/incentives-proposal/blob/f6712e33db79210a7ae8106f7cfa1ce2adea8d69/contracts/incentives/StakedTokenIncentivesController.sol#L186

detection of shadowing using `assets` local variables.

##### Recommendation
We recommend renaming the local variables that shadow another component.

##### Status
Acknowledged
##### Client's commentary
Acknowledge, but no action at the moment.

## Results
Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 0
WARNING | 0
COMMENT | 2

### Executive summary
The two smart contracts tested in this audit are designed for the logic for managing user rewards. Every time a user does actions on the protocol, e.g. supplying liquidity or borrowing - the `handleAction()` function is triggered, which takes into account the reward for this user. 

### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical or major issues were found, two issues were marked as comments and discussed with the client. After working on the reported findings all of them were acknowledged (as the problems were not critical). So, the contracts are assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `-`