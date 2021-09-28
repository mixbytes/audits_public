# Curve-voter-proxy Security Audit Report (merged)

###### tags: `Yearn`

## Introduction

### Project overview
This is a mock strategy. It shows the flow of how to implement customized functions after inheriting the CurveVoterProxy template.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/orbxball/curve-voter-proxy/blob/78c92e4ffc0f76651914565744a3607d0248d254/contracts/Strategy.sol

The audited commit identifier is `78c92e4ffc0f76651914565744a3607d0248d254`,`38dc4389981bee6aa7e40e22805157b21f38ac26`

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

Not found


### WARNINGS

#### 1. Variables used but not declared
##### Description
At this lines:
https://github.com/orbxball/curve-voter-proxy/blob/78c92e4ffc0f76651914565744a3607d0248d254/contracts/Strategy.sol#L226-L227
https://github.com/orbxball/curve-voter-proxy/blob/78c92e4ffc0f76651914565744a3607d0248d254/contracts/Strategy.sol#L230
https://github.com/orbxball/curve-voter-proxy/blob/78c92e4ffc0f76651914565744a3607d0248d254/contracts/Strategy.sol#L287
the Strategy using address type variables such as `curve`, `gauge`, `reward` and `target` but there is no initialization procedure of these variables. 

##### Recommendation
It is recommended to initialize your local variables at declaration. 

##### Status
Fixed at https://github.com/orbxball/curve-voter-proxy/tree/38dc4389981bee6aa7e40e22805157b21f38ac26




### COMMENTS

#### 1. Events are probably missing
##### Description: 
At the line https://github.com/orbxball/curve-voter-proxy/blob/78c92e4ffc0f76651914565744a3607d0248d254/contracts/Strategy.sol#L157 in method `setKeepCRV()` should probably emit an event `newKeepCRV`.
At the line https://github.com/orbxball/curve-voter-proxy/blob/78c92e4ffc0f76651914565744a3607d0248d254/contracts/Strategy.sol#L165 in method `switchDex()` should probably emit an event `newDex`.


##### Recommendation
It is recommended to create new events.

##### Status
Acknowledged




#### 2. Unobvious exchange on Uniswap
##### Description
At the lines:
- https://github.com/orbxball/curve-voter-proxy/blob/78c92e4ffc0f76651914565744a3607d0248d254/contracts/Strategy.sol#L263
- https://github.com/orbxball/curve-voter-proxy/blob/78c92e4ffc0f76651914565744a3607d0248d254/contracts/Strategy.sol#L278
are not clear why if `_crv > 0`, should be called `swapExactTokensForTokens` of `dex` (which can be address of UniSwap or SushiSwap), but when `_reward > 0`, the same call is made for `uniswap`.

##### Recommendation
If this is done on purpose, an explanation is needed. It is recommended to make an explanation.

##### Status
Acknowledged




#### 3. Code smell
##### Description
At the lines https://github.com/orbxball/curve-voter-proxy/blob/78c92e4ffc0f76651914565744a3607d0248d254/contracts/Strategy.sol#L239-L300

code has several problems at once.
- Too long function. The function takes 61 lines. It is difficult to understand.
- In one place collected various logic. It is recommended to split into separate methods. For example, lines from 249 to 264 is the function `checkCrv()`, and the lines from 268 to 279 are the `checkReward()` function.
- Duplication code. Lines 255-256, 270-271, 283-284, 289-290 can be combined to call one function with parameters.


##### Recommendation
It is recommended to make a refactoring source code.

##### Status
Fixed at https://github.com/orbxball/curve-voter-proxy/tree/38dc4389981bee6aa7e40e22805157b21f38ac26



## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR    | 0
WARNING  | 1
COMMENT  | 3


### Executive summary
The contracts examined in this audit are for the work of the Strategy that is being used for the Vault. The Strategy is working with several tokens at once, which depend on each other. In some cases, some tokens are exchanged for others using the Sushiswap/Uniswap and Curve pools.


## Conclusion
Smart contract has been audited and several suspicious places were found. During audit no critical and one major issues were identified. Several issues were marked as warning and comments. After working on audit report all issues were fixed or acknowledged(if issue is not critical or major) by client, so contracts assumed as secure to use according our security criteria.

Final commit identifier with all fixes: `38dc4389981bee6aa7e40e22805157b21f38ac26`