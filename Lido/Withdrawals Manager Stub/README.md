# Withdrawals-manager-stub Security Audit Report (merged)

###### tags: `LIDO`

## Introduction

### Project overview
LIDO protocol is a project for stacking Ether to use it in Beacon chain.  Users can deposit Ether to the Lido smart contract and receive stETH tokens in return. The stETH token balance corresponds to the amount of Beacon chain Ether that the holder could withdraw if state transitions were enabled right now in the Ethereum 2.0 network.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/lidofinance/withdrawals-manager-stub/blob/c41292ed9c3be765d06c4249b9f2ad4d427b84bf/contracts/WithdrawalsManagerProxy.sol
https://github.com/lidofinance/withdrawals-manager-stub/blob/c41292ed9c3be765d06c4249b9f2ad4d427b84bf/contracts/WithdrawalsManagerStub.sol

The audited commit identifier is `c41292ed9c3be765d06c4249b9f2ad4d427b84bf`, `214d4773648134f970509bfe37184aee3aff4d24`

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

#### 1. Unnecessary check in initialization
##### Description
Constructor of the proxy contains unnecessary check:
https://github.com/lidofinance/withdrawals-manager-stub/blob/c41292ed9c3be765d06c4249b9f2ad4d427b84bf/contracts/WithdrawalsManagerProxy.sol#L70
##### Recommendation
We recommend to delete this check.
##### Status
Fixed at https://github.com/lidofinance/withdrawals-manager-stub/commit/214d4773648134f970509bfe37184aee3aff4d24

 
## Results
Level | Amount
--- | ---
CRITICAL | -
MAJOR    | -
WARNING  | -
COMMENT  | 1

### Executive summary
Withdrawal manager project solves the following problem. Though the Beacon chain already supports setting withdrawal credentials pointing to a smart contract, the withdrawals specification is not yet final and might change before withdrawals are enabled in the Merge network. This means that Lido cannot deploy the final implementation of the withdrawals manager contract yet. At the same time, it's desirable to have withdrawal credentials pointing to a smart contract since this would avoid the need to migrate a lot of validators to new withdrawal credentials once withdrawals are enabled.
The WithdrawalsManagerProxy is proxy contract with a built in admin and upgrade the interface of the WithdrawalsManagerStub.The upgradeability mechanism is based of secure openZeppelin implementation based on ERC1967 proxy. In this scope the WithdrawalsManagerStub contract have very simple implementation and is inherently a stub. 

### Conclusion
Smart contract has been audited one suspicious place has been spotted. During the audit no critical or major issues were found, one issue was marked comment. After working on the reported finding it was fixed by the client. So, the contract is assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `214d4773648134f970509bfe37184aee3aff4d24`