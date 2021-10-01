# B-Cube Security Audit Report (merged)

###### tags: `B-Cube`

## Introduction

### Project overview
[B-Cube](https://b-cube.ai) is a marketplace of AI-driven crypto trading bots which allows traders connecting to their favorite exchanges and start trading on auto-pilot.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/BCubePrivateSale.sol
https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/Treasury.sol
https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/Staking.sol
https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/BCUBEToken.sol

The audited commit identifier is `451e249a7200ea094fdfa1baa1a50cb7b17233f2`

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

#### 1. Potentially unrestricted account withdrawals
##### Description
This warning is about any user potentially being able to withdraw advisor's
share in here: https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/Treasury.sol#L158 and private sale participant's share in here: https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/Treasury.sol#L308.

Some check if `msg.sender` is an advisor is being performed in here: https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/Treasury.sol#L163 along with a check if `msg.sender` is a private sale participant in here: https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/Treasury.sol#L163, but it could be done better.

##### Recommendation
It is recommended to introduce a more explicit advisor and private sale membership check with a function modifier just like it was done with OpenZeppelin's `onlyWhitelistAdmin`: https://docs.openzeppelin.com/contracts/2.x/api/access#WhitelistAdminRole-onlyWhitelistAdmin--.

##### Status
Fixed at
https://github.com/erwan-rouzel/b-cube-ico/commit/09efaa97fa92f6a4e31b10cd1d93b2b4e80eba31


#### 2. Potentially incorrect allowance amount
##### Description
This warning concerns the potentially incorrect computation of the allowance for advisors and private sale members in here: 
- https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/Treasury.sol#L165
- https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/Treasury.sol#L166
- https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/Treasury.sol#L167.

##### Recommendation
It is recommended to introduce `SafeMath` usage for calculating allowance `increase` values.

##### Status
Fixed at
https://github.com/erwan-rouzel/b-cube-ico/commit/09efaa97fa92f6a4e31b10cd1d93b2b4e80eba31


#### 3. Potentially incorrect price data
##### Description
This warning is about potentially incorrect price data being calculated from Chainlink oracle results in here: https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/BCubePrivateSale.sol#L112. Chainlink output can be of a little bit more complicated format than it is expected in the most trivial case (e.g. https://blog.chain.link/fetch-current-crypto-price-data-solidity/).
At the line https://github.com/erwan-rouzel/b-cube-ico/tree/451e249a7200ea094fdfa1baa1a50cb7b17233f2/contracts/BCubePrivateSale.sol#L120, arithmetic operations are performed on the query results without using the `SafeMath`.

##### Recommendation
It is recommended to pay attention to handling Chainlink output data format correctly (in case it is not yet) and handle all the arithmetic operations with it with `SafeMath` usage.

##### Status
Fixed at
https://github.com/erwan-rouzel/b-cube-ico/commit/09efaa97fa92f6a4e31b10cd1d93b2b4e80eba31


## Results

### Executive summary
The checked volume includes functionality that performs a private crowdsale of BCUBE tokens to private investors, accepting payments in $ETH and $USDT, using Chainlink's price feed to offer $BCUBE tokens to investors. In addition to private investors, the team and advisors will receive their share of allocated BCUBE tokens in a vested manner.

### Conclusion

Findings list:

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 0
WARNING | 3
COMMENT | 0


Final commit identifier with all fixes: `09efaa97fa92f6a4e31b10cd1d93b2b4e80eba31`