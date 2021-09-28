# CoverProtocol/cover-flashloan Security Audit Report (merged)

###### tags: `Yearn`

## Introduction

### Project overview
Cover Protocol provides peer to peer coverage with fungible tokens. It lets the market set coverage prices as opposed to a bonding curve.


### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol

https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/ERC20/IERC20.sol
https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/ERC20/IYERC20.sol
https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/ERC20/SafeERC20.sol

https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/interfaces/IBPool.sol
https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/interfaces/ICover.sol
https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/interfaces/IERC3156FlashBorrower.sol
https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/interfaces/IERC3156FlashLender.sol
https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/interfaces/IFlashBorrower.sol
https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/interfaces/IProtocol.sol

https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/utils/Address.sol
https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/utils/Context.sol
https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/utils/Ownable.sol

The audited commit identifier is `bea8cd444aa1791a97b2a81078dc887a835f7949`,
`4f6cbd2659ae02c1fcd9d79da994684fa5c94409`,
`b43bc15deae11db231af3fa4c0ea3843f9565db3`,
`0a31e67acf52fafdeed42f366e88dc70c1b5592e`,
`9cb6561f3d40f870252088d3c16c1eed24a93166`

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

#### 1. Error while calculating the value
##### Description
The `getPricePerFullShare()` function for a yDAI token contract returns the value multiplied by a factor of 1e18.
But it doesn't divided by 1e18:
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L90
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L155
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L182
  
##### Recommendation
It is recommended to fix the error.

##### Status
Fixed at https://github.com/CoverProtocol/cover-flashloan/commit/0a31e67acf52fafdeed42f366e88dc70c1b5592e.


#### 2. Wrongly used `safeApprove`
##### Description
At the line https://github.com/CoverProtocol/cover-flashloan/blob/9cb6561f3d40f870252088d3c16c1eed24a93166/contracts/CoverFlashBorrower.sol#L351 contract call `safeApprove` method, however that method fails if account have remaining allowed tokens.

##### Recommendation
We suggest to reset approval calling
```soldity
ERC20(token).safeApprove(recipient, 0);
```
before setting new approval

##### Status


##### Client's commentary
> No comment received from the team


### WARNINGS

#### 1. No processing of function execution results
##### Description
The https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol contract uses the `approve ()`, `transferFrom ()` and `transfer ()` functions to transfer tokens. According to the ERC20 standard, functions return boolean variables, but the result is not processed.
This can be seen in the following lines:
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L97
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L130
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L143
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L231
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L233
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L235
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L264
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L284
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L286
- https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L335

At the same time, the project has a library for safe work with tokens for the ERC20 standard. This library is located here: https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/ERC20/SafeERC20.sol.

##### Recommendation
For operations with tokens, use functions from the https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/ERC20/SafeERC20.sol library.

##### Status
Fixed at https://github.com/CoverProtocol/cover-flashloan/commit/9cb6561f3d40f870252088d3c16c1eed24a93166.



#### 2. Event is probably missing
##### Description: 
At the line https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L134-L137
`CoverFlashBorrower`'s method `setFlashLender()` should probably emit an event.

##### Recommendation
It is recommended to create event: `NewFlashLender`.

##### Status
Fixed at https://github.com/CoverProtocol/cover-flashloan/commit/9cb6561f3d40f870252088d3c16c1eed24a93166.



#### 3. There is no check for the available amount of tokens
##### Description
Before taking an flashloan, you need to make sure that there are enough tokens.
But now this check is not being done.
The lines: https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L98 and https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L131 need to be checked:

`require (amountDaiNeeded <= flashLender.maxFlashLoan (address (dai))," wrong amount of token ");`

Additional checks keep the source code clean.
Additional checks do not require gas consumption when making a transaction.

##### Recommendation
It is recommended to add checks for the available amount of tokens

##### Status
Fixed at https://github.com/CoverProtocol/cover-flashloan/commit/4f6cbd2659ae02c1fcd9d79da994684fa5c94409.



#### 4. Should return zero. But instead the transaction crashes
##### Description
Functions are used to calculate the number of tokens. But in some cases, an arithmetic overflow occurs and the transaction is reverted. This can be avoided by doing a check and returning zero.

- At the line https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L163 should be done like this:
>`if (amountDaiNeeded + flashFee < daiReceivedFromSwap) {`
>`            totalCost = 0;`
>`        } else {`
>`            totalCost =  amountDaiNeeded - daiReceivedFromSwap + flashFee;`
>`        }`

- At the line https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L186 should be done like this:
>`if (daiReceivedFromRedeem < amountDaiNeeded + flashFee) {`
>`            totalReturn = 0;`
>`        } else {`
>`            totalReturn =  daiReceivedFromRedeem - amountDaiNeeded - flashFee;`
>`        }`


##### Recommendation
It is recommended to fix the code

##### Status
Fixed at https://github.com/CoverProtocol/cover-flashloan/commit/b43bc15deae11db231af3fa4c0ea3843f9565db3.



### COMMENTS

#### 1. Using "magic" numbers.
##### Description
The use in the source code of some unknown where taken values impairs its understanding.
On line https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L185 the value is `10000`.

##### Recommendation
It is recommended that you create constants with meaningful names for using numeric values.

##### Status
Acknowledged

##### Client's commentary
> Comment is regarding the variable naming for a view function. We could redeploy, but it’s only a clarity issue, not functional.


#### 2. Hardcoded addresses.
##### Description
At the lines https://github.com/CoverProtocol/cover-flashloan/tree/bea8cd444aa1791a97b2a81078dc887a835f7949/contracts/CoverFlashBorrower.sol#L23-L24
the DAI and yDAI addresses is hardcoded. But if the contract deployed to some other testnet it must be different.

##### Recommendation
It is recommended to make these addresses as arguments to the initialization method.

##### Status
Fixed at https://github.com/CoverProtocol/cover-flashloan/commit/9cb6561f3d40f870252088d3c16c1eed24a93166.




## Results

### Executive summary
The functionality of this project will well expand the functionality of the Cover protocol. Users will now be able to use flashloans. Support for the DAI token accelerates the work of this project. The main logic is located in the CoverFlashBorrower contract. For compatibility with other applications, the project was developed according to the EIP-3156 standard.


### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical issues were found, two issues were marked as major because they could lead to some undesired behavior, also several warnings and comments were found and fixed by the client. After working on the reported findings all of them were resolved or acknowledged.


Findings list:

Level | Amount
--- | ---
CRITICAL | -
MAJOR    | 1
WARNING  | 4
COMMENT  | 2


Final commit identifier with all fixes: `9cb6561f3d40f870252088d3c16c1eed24a93166`