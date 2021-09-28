# yveCRV-vault Security Audit Report (merged)

###### tags: `Yearn`

## Introduction

### Project overview
Part of Yearn Strategy Brownie Mix.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/andy8052/yveCRV-vault/blob/6706b9ad45e71ee9014454419f229adfa6409f1d/contracts/Strategy.sol

The audited commit identifier is `6706b9ad45e71ee9014454419f229adfa6409f1d`,
`bbecd326f2155e5160e5570d7b7270574ddf1dc8`

## Security Assessment Methodology

2 security auditors and 1 tech lead are involved in the work on the audit who check the provided source code independently of each other in accordance with the methodology described below:

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

#### 1. Correct migration
##### Description
In constructor, rights are granted to spend tokens, which should be canceled when migrating the strategy.
- https://github.com/andy8052/yveCRV-vault/blob/6706b9ad45e71ee9014454419f229adfa6409f1d/contracts/Strategy.sol#L171

##### Recommendation
It is recommended to add in function `prepareMigration()`:
```solidity
    IERC20(crv).safeApprove(address(want), 0);
    IERC20(usdc).safeApprove(sushiswap, 0);
    
    IyveCRV(address(want)).claim();
    want.safeTransfer(_newStrategy, want.balanceOf(address(this)));
    
    IERC20(usdc).safeTransfer(_newStrategy, IERC20(usdc).balanceOf(address(this)));
    
    want.safeApprove(vault, 0);
    vault.approve(rewards, 0);
```
##### Status
Fixed at https://github.com/andy8052/yveCRV-vault/commit/bbecd326f2155e5160e5570d7b7270574ddf1dc8




### WARNINGS

#### 1. Missed token
##### Description
At the line: https://github.com/andy8052/yveCRV-vault/blob/6706b9ad45e71ee9014454419f229adfa6409f1d/contracts/Strategy.sol#L266-L277
The function `protectedTokens()` is used for removing tokens from this Strategy that are not the type of tokens managed by this Strategy. This may be used in case of accidentally sending the wrong kind of token to this Strategy.This will  fail if an attempt is made to sweep `want`, or any tokens that are protected by this Strategy. But in this implementation the `yveCrv` token is not protected.

##### Recommendation
It is recommended to replace `want` token for  `yveCrv` in the `protected[]` array.

##### Status
Fixed at https://github.com/andy8052/yveCRV-vault/commit/bbecd326f2155e5160e5570d7b7270574ddf1dc8




#### 2. The approval value obtained in the constructor may not be enough for the long term of the smart contract
##### Description
Smart contracts call `safeApprove()` functions for different tokens. But in the process of work, the obtained value will only decrease. If this value decreases to zero, then the tokens will remain locked in the contract forever.
It is at the following lines:
- https://github.com/andy8052/yveCRV-vault/blob/6706b9ad45e71ee9014454419f229adfa6409f1d/contracts/Strategy.sol#L96-L97
  
##### Recommendation
It is recommended to add a function to increase the value of approvals.

##### Status
Fixed at https://github.com/andy8052/yveCRV-vault/commit/bbecd326f2155e5160e5570d7b7270574ddf1dc8




### COMMENTS

#### 1. There is no input parameter processing in the method
##### Description
At the lines:
- https://github.com/andy8052/yveCRV-vault/blob/6706b9ad45e71ee9014454419f229adfa6409f1d/contracts/Strategy.sol#L151
the `adjustPosition()` method has an input variable `_debtOutstanding`.
But there is no processing of this variable in the body of the function.
  
##### Recommendation
It is recommended to either add handling to the variable or remove this variable.

##### Status
Acknowledged




#### 2. Event is probably missing
##### Description: 
At the lines: https://github.com/andy8052/yveCRV-vault/blob/6706b9ad45e71ee9014454419f229adfa6409f1d/contracts/Strategy.sol#L259
in method `setBuffer` should probably emit an event `SetBuffer`.


##### Recommendation
It is recommended to create new event.

##### Status
Fixed at https://github.com/andy8052/yveCRV-vault/commit/bbecd326f2155e5160e5570d7b7270574ddf1dc8




## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 1
WARNING | 2
COMMENT | 2


### Executive summary
The contracts examined in this audit are for the work of the Strategy that is being used for the Vault. The Strategy is working with several tokens at once, which depend on each other. In some cases, some tokens are exchanged for others using the Sushiswap and Curve pools.


## Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical issues were found, one issue was marked as major because it could lead to some undesired behavior, also several warnings and comments were found and fixed by the client. After working on the reported findings all of them were resolved or acknowledged.


Final commit identifier with all fixes: `bbecd326f2155e5160e5570d7b7270574ddf1dc8`
