# ParaSwap Adapter Security Audit Report (merged)

###### tags: `Aave`

## Introduction

### Project overview

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapAdapter.sol
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapSellAdapter.sol
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/ParaSwapLiquiditySwapAdapter.sol

The audited commit identifier is `14e2ab47d95f42ec5ee486f367067e78a7588878`

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

#### 1. You can perform a vulnerable code
##### Description
At the line
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/ParaSwapLiquiditySwapAdapter.sol#L87
any user can call the `swapAndDeposit ()` function. The parameters `augustus` and` swapCalldata` can be anything. These parameters are used to call the `_sellOnParaSwap ()` function.
At the line
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapSellAdapter.sol#L76 in the body of the function `_sellOnParaSwapSwap ()` call a smart contract `augustus`.
The user can call any external function for any other smart contract. This Smart Contract may contain a vulnerable code.


##### Recommendation
It is recommended to do the following:
- set the address of the smart contract `augustus` once in the storage variable and control the names of the called methods;
- or interact with `augustus` using the interface.

##### Status
**New**
##### Client's commentary
> no comment


#### 2. Reentry guard is not used.
##### Description
At the lines:
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapAdapter.sol#L79
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapSellAdapter.sol#L35
it would be robust to ensure that places which assumed to be called once, called once.

##### Recommendation
It is recommended to use reentry guard.

##### Status
**New**
##### Client's commentary
> no comment


#### 3. There is no processing of the value returned by the function
##### Description
According to the standard `ERC-20` after a successful execution operation, the function for working with tokens is returned to` true`.
You always need to check the value that returns the function after execution.
For this, there is even a special library `SafeERC20`.
But in the following lines it is not done:
 - at the line https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapAdapter.sol#L122

##### Recommendation
It is recommended for these operations to use the special library `SafeERC20`.

##### Status
**New**
##### Client's commentary
> no comment


#### 4. Ignored return value.
##### Description
At the line:
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapAdapter.sol#L102
the return value is ignored.
But inside implementation POOL can implement surprised fee charging or withdraw other amount in some specific case (as it is now).

##### Recommendation
It is recommended to add the check that the return value matches the expected.
For example add `minWithdrawAmount` argument and add `require(withdrawn >= minWithdrawAmount`.

##### Status
**New**
##### Client's commentary
> no comment


#### 5. Pontential overflow.
##### Description
At the line:
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapSellAdapter.sol#L53
It is very easy to do overflow, just create a fake token with 100 decimals.

##### Recommendation
It is recommended to use SafeMath everywhere.

##### Status
**New**
##### Client's commentary
> no comment


### COMMENTS

#### 1. Unclear low-level calls.
##### Description
At the lines:
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapSellAdapter.sol#L68-L74
some not really clear and intuitive low-level operations happen.

##### Recommendation
It is recommended to add comprehensive comments.

##### Status
**New**
##### Client's commentary
> no comment


#### 2. Using error constants
##### Description
At the line 
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapSellAdapter.sol#L57
is better off using error constants inside require.

##### Recommendation
It is recommended to use

```
library Errors {
  //common errors
  ...
  
  string public constant MIN_AMOUNT_EXCEEDS_MAX_SLIPPAGE = '1'; 
  ...
}
```
from the library: https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/protocol/libraries/helpers/Errors.sol#L22-L118.

##### Status
**New**
##### Client's commentary
> no comment


#### 3. Using constants in substraction
##### Descriptions
At the line
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapSellAdapter.sol#L55
is not optimized code 

##### Recomendation
It is recommended to use a constant variable containing the value of the expression:
`PercentageMath.PERCENTAGE_FACTOR - MAX_SLIPPAGE_PERCENT`. 

##### Status
**New**
##### Client's commentary
> no comment


#### 4. Function name is not suitable enough
##### Description
At the line
https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapAdapter.sol#L79
the `_pullAToken()` function, not only pull Atoken, but also withdraw reserve from the `LENDING_POOL`.

##### Recommendation
It is recommended to change the function name to a more appropriate one.
For example`_pullAtokenThenWithdraw()`.

##### Status
**New**
##### Client's commentary
> no comment

#### 5. Dangerous strict equality
##### Description
At the line
- https://github.com/ColonelJ/aave-protocol-v2/blob/14e2ab47d95f42ec5ee486f367067e78a7588878/contracts/adapters/BaseParaSwapSellAdapter.sol#L84
is a dangerous stric equality.

##### Recommendation
It is recommended to use delta expression.

##### Status
**New**
##### Client's commentary
> no comment


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 0
WARNING | 5
COMMENT | 5

### Executive summary
The smart contracts, examined in this audit, are designed to work with ParaSwap. ParaSwap is a liquidity aggregator from decentralized exchanges. Smart contracts are designed to implement the adapter between AAVE and ParaSwap.

### Conclusion
TBA

Final commit identifier with all fixes: `#`