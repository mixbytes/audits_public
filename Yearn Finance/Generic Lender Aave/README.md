# GenericAave SCA (merged)
###### tags: `Yearn`

## Introduction


### Project overview
Part of Yearn Strategy Mix.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/55b4d3b03845b7b71b24b50baa30823b3e42ebcf/contracts/GenericLender/GenericAave.sol

The audited commit identifier is `55b4d3b03845b7b71b24b50baa30823b3e42ebcf`, `7bd06e821732faa2b6d9f7da4b9d172f07649005`

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



### Security Assessment Methodology

Two auditors independently verified the code.

Stages of the audit were as follows:

* "Blind" manual check of the code and its model 
* "Guided" manual code review
* Checking the code compliance with customer requirements 
* Discussion of independent audit results
* Report preparation

## Report

### CRITICAL

Not found

### MAJOR

#### 1. Deposit will be unavailable if lending pool address will be updated by AAVE
##### Description
At line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/55b4d3b03845b7b71b24b50baa30823b3e42ebcf/contracts/GenericLender/GenericAave.sol#L132 the `deposit` function assumes recent approval of token transfer. However, the  `safeApprove()` is called once during contract initialization(https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/55b4d3b03845b7b71b24b50baa30823b3e42ebcf/contracts/GenericLender/GenericAave.sol#L49) and possible changes of lending pool address is not tracked properly. If lending pool address is updated by AAVE, the `deposit()` will be unavailable/reverted until contract replacement.

##### Recommendation
Call `safeApprove()` on demand before calling `deposit()` on lending pool.

##### Status
Fixed at https://github.com/Grandthrax/yearnV2-generic-lender-strat/pull/11/commits/7bd06e821732faa2b6d9f7da4b9d172f07649005



### WARNINGS

#### 1. The approval value obtained in the `_initialize()` function  may not be enough for the long term of the smart contract
##### Description
Smart contracts call `safeApprove()` function for different tokens. But in the process of work, the obtained value will only decrease. If this value decreases to zero, then the tokens will remain locked in the contract forever.
It is at the following lines:
- https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/55b4d3b03845b7b71b24b50baa30823b3e42ebcf/contracts/GenericLender/GenericAave.sol#L49
  
##### Recommendation
It is recommended to add a function to increase the value of approvals.

##### Status
Acknowledged


### COMMENTS
Not found


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR    | 1
WARNING  | 1
COMMENT  | 0

### Executive summary
The main purpose of the project is to give users ability to earning yield % with different lender schemes (GenericLender) managed by strategy. In our case the GenericAave scheme was scope.

### Conclusion
Smart contracts have been audited and several suspicious places were found. During audit no critical issues were found, one issue was marked major as it might lead to undesired behavior. One issue was marked as warning. After working on audit report all issues were fixed or acknowledged by client.

Final commit identifier with all fixes: `7bd06e821732faa2b6d9f7da4b9d172f07649005`, `7bd06e821732faa2b6d9f7da4b9d172f07649005`