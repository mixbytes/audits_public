# C.R.E.A.M. finance flashloan Security Review Report (merged)

###### tags: `Yearn`

## Introduction

### Project overview
C.R.E.A.M. Finance is a blockchain agnostic, decentralized peer to peer lending platform based on a fork of Compound Finance.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/CreamFi/compound-protocol/blob/e414160eb8a774140457c885bb099baae528df04/contracts/CCapableErc20.sol

The audited commit identifier is `e414160eb8a774140457c885bb099baae528df04`

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
#### 1. Excess reserve amount
##### Description
At lines https://github.com/CreamFi/compound-protocol/blob/e414160eb8a774140457c885bb099baae528df04/contracts/CCapableErc20.sol#L250-L252 contract increases `internalCash` and `totalReserves` values, but it's so strange that `internalCash` increased by `totalFee` and `totalReserves` increased by `reservesFee` so we totally increased assets amount by `reservesFee + totalFee` however user paid only `totalFee`. It seems there are some uncollateralized `reservesFee`. May be there `totalFee` paid by user should be splitted to `internalCash` and `totalReserves` ?

##### Recommendation
We recommend to double check that place 

##### Status
No issue 

##### Client's commentary
By CToken’s design, totalReserves is included in internalCash too.


### WARNINGS
#### 1. Suspicious manipulation of `totalReserves` and `internalCash`
##### Description
At the line https://github.com/CreamFi/compound-protocol/blob/e414160eb8a774140457c885bb099baae528df04/contracts/CCapableErc20.sol#L132 contract have `gulp` function that change `totalReserves` and `internalCash` variables. That function can be re-entered from while flashloan execution. For now, in `flashloan` contract captured affected variables and also `accrueInterest` depends on it, to be honest it's really precarious place.

##### Recommendation
We recommend to double check this and add re-entrancy guard to `gulp` function

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/9f4a9223c216bee40b2d8c45d10baed4993947ec




### COMMENTS
#### 1. Magic number used
##### Description
At the line https://github.com/CreamFi/compound-protocol/blob/e414160eb8a774140457c885bb099baae528df04/contracts/CCapableErc20.sol#L237 contract uses "magic number" `10000` to calculate `totalFee`.

##### Recommendation
We recommend to use constant instead or add comments

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/49ae515f9edb1338ec8eed8077ba6592c20a5570




## Results
### Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 1
WARNING | 1
COMMENT | 1

### Executive summary
The reviewed scope includes flashloan functionality implementation in `CCapableErc20` contract of C.R.E.A.M. finance project.


### Conclusion
Smart contracts have been audited and several suspicious places were found. During audit one major issue was identified as it could lead to some undesired behavior also two issues were marked as warning and comment. After working on audit report all issues were fixed or acknowledged(if issue is not critical) by client or concluded as not an issue.

Final commit identifier with all fixes: `49ae515f9edb1338ec8eed8077ba6592c20a5570`