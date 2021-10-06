# Liquidity Mining Interim Security Audit Report (merged)

###### tags: `C.R.E.A.M. Finance`

## Introduction

### Executive summary
C.R.E.A.M. Finance is a decentralized lending protocol for individuals and protocols to access financial services. The protocol is permissionless, transparent, and non-custodial.

C.R.E.A.M. Finance's team modularized the liquidity mining reward feature into a separate contract and extend it to able handle multiple token reward for a market.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/CreamFi/liquidity-mining/blob/e7caa316e8a206b60996c199f26047b388b4ea31/contracts/LiquidityMiningLens.sol
https://github.com/CreamFi/liquidity-mining/blob/e7caa316e8a206b60996c199f26047b388b4ea31/contracts/LiquidityMiningStorage.sol
https://github.com/CreamFi/liquidity-mining/blob/e7caa316e8a206b60996c199f26047b388b4ea31/contracts/LiquidityMining.sol
https://github.com/CreamFi/liquidity-mining/blob/e7caa316e8a206b60996c199f26047b388b4ea31/contracts/interfaces/CTokenInterface.sol
https://github.com/CreamFi/liquidity-mining/blob/e7caa316e8a206b60996c199f26047b388b4ea31/contracts/interfaces/ComptrollerInterface.sol
https://github.com/CreamFi/liquidity-mining/blob/e7caa316e8a206b60996c199f26047b388b4ea31/contracts/interfaces/LiquidityMiningInterface.sol

The audited commit identifier is `e7caa316e8a206b60996c199f26047b388b4ea31`
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
* Additional verification of the entire initial project scope and code base.

```
Stage goal:
Preparation of the final code version with all the fixes and additional re-check
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

#### 1. No reporting on failed claimRewards attempt
##### Description
While a user is in debtors list, any attempt to claim rewards will be [silently ignored](https://github.com/CreamFi/liquidity-mining/blob/e7caa316e8a206b60996c199f26047b388b4ea31/contracts/LiquidityMining.sol#L469).
##### Recommendation
It is recommended to report the user that claim action has been failed because of bad debt.
##### Status
Fixed at https://github.com/CreamFi/liquidity-mining/blob/2e70f61fc7645442b9db66c03e1529d42d25a0af/contracts/LiquidityMining.sol

## Results
Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 0
WARNING | 0
COMMENT | 1


### Conclusion

During the audit no critical, major or warning issues were found, one comment were spotted. After working on the reported findings it was fixed by the client. So, the contracts are assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `2e70f61fc7645442b9db66c03e1529d42d25a0af`