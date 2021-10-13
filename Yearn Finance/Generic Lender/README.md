# YearnV2-generic-lender-strat Smart Contracts Security Audit Report (merged)

###### tags: `Yearn`

## Introduction

### Project overview
The project is intended to provide users with tools for working with lending in DeFi. The project serves as an aggregator of all known blockchain projects for working with lending. It allows you to choose the optimal platform for the user.


### Scope of the Audit
The scope of the audit includes the following smart contracts at:
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol

 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/AlphaHomoLender.sol
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/EthCompound.sol
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/EthCream.sol
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCompound.sol
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCream.sol
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericDyDx.sol
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericLenderBase.sol
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/IGenericLender.sol
 

The audited commit identifier is `979ef2f0e5da39ca59a5907c37ba2064fcd6be82`,
`3ead812d7ac9844cc484a76545b3e222a9130852`


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


#### 1. It is possible to process a non-existing array element or skip an array element 
##### Description
At the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol#L424 is working with the elements of the `_newPositions` array in a loop.
For each element of the `lenders` array, there must be an element of the`_newPositions` array. But now the iteration of elements for the `_newPositions` array is not done correctly.
This will cause the `manualAllocation()` function to work incorrectly.

##### Recommendation
It is necessary to correct the index value for the `_newPositions` array:

`if (address(lenders[j]) == _newPositions[i].lender) {`


##### Status
Fixed at https://github.com/Grandthrax/yearnV2-generic-lender-strat/commit/3ead812d7ac9844cc484a76545b3e222a9130852.



#### 2. Ignore failure status for `CToken`
##### Description
There are many reasons for failure `CToken`, but Lenders contracts ignore it in the all places.
Interface methods of `CToken`:
For 
```
function mint(uint256 mintAmount) external returns (uint256);
```
- https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCompound.sol#L140
-  https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCream.sol#L119

For 
```
function redeemUnderlying(uint256 redeemAmount) external returns (uint256);
```
- https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCompound.sol#L85
- https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCompound.sol#L113
- https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCompound.sol#L116

-  https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCream.sol#L78
-  https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCream.sol#L106
-  https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCream.sol#L109


Return value (`uint256`) is enum of errors which may be:

```
enum Error {
    NO_ERROR,
    UNAUTHORIZED,
    COMPTROLLER_MISMATCH,
    INSUFFICIENT_SHORTFALL,
    INSUFFICIENT_LIQUIDITY,
    INVALID_CLOSE_FACTOR,
    INVALID_COLLATERAL_FACTOR,
    INVALID_LIQUIDATION_INCENTIVE,
    MARKET_NOT_ENTERED, // no longer possible
    MARKET_NOT_LISTED,
    MARKET_ALREADY_LISTED,
    MATH_ERROR,
    NONZERO_BORROW_BALANCE,
    PRICE_ERROR,
    REJECTION,
    SNAPSHOT_ERROR,
    TOO_MANY_ASSETS,
    TOO_MUCH_REPAY
}
```

##### Recommendation
We recommend to validate return of every method for `CToken`. If method returns no `NO_ERROR` — revert it.

##### Status
Acknowledged

##### Client's commentary
> adding in some requires where useful.



### WARNINGS


#### 1. Safe math library not used
##### Description
If you do not use the library for safe math, then an arithmetic overflow may occur, which will lead to incorrect operation of smart contracts.
In the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol on lines: 136, 155, 180, 206, 213, 287, 430, 464, 543, 547 calculations are without safe mathematics.

##### Recommendation
All arithmetic operations need to be redone using the Safe math library.

##### Status
Fixed at https://github.com/Grandthrax/yearnV2-generic-lender-strat/commit/3ead812d7ac9844cc484a76545b3e222a9130852.

##### Client's commentary
> fixed where appropriate.


#### 2. There is no processing of the value returned by the function
##### Description
In the https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/IGenericLender.sol  contract, line 21 has a function `withdrawAll()`. This function returns a value of type `bool`.
For the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol#L40, the variable `lenders` of type`IGenericLender[]`is initialized.
In the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol on lines 393 and 414 there is a call to the function `withdrawAll()`.
But the return value is not processed.

##### Recommendation
Add processing of the value returned by the function.

##### Status
Acknowledged


#### 3. The return value is not processed when transferring tokens
##### Description
According to the ERC-20 specification, the `transfer()` function returns a variable of the `bool` type.
At the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericLenderBase.sol#L56 there is a call to the `transfer()` function.
But the return value is not processed. This can lead to incorrect operation of the smart contract.

##### Recommendation
It is necessary to add handling of the value returned by the `transfer()` function.

##### Status
Fixed at https://github.com/Grandthrax/yearnV2-generic-lender-strat/commit/3ead812d7ac9844cc484a76545b3e222a9130852.

##### Client's commentary
> changed to use `safeErc20`.


#### 4. Gas overflow during iteration (DoS)
##### Description
Each iteration of the cycle requires a gas flow.
A moment may come when more gas is required than it is allocated to record one block. In this case, all iterations of the loop will fail.
Affected lines:
https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol#L413

##### Recommendation
It is recommended adding a check for the maximum possible number of elements of the arrays.

##### Status
No issue

##### Client's commentary
> disagree. we don't mind this risk as manualAllocation is privileged.


#### 5. Add additional check for `addLender`
##### Description
At the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol#L67 in method `addLender` there are no checks for `want`.

##### Recommendation
It is recommended to check that `want` token of Strategy equals `want` token of Lender.

##### Status
No issue

##### Client's commentary
> disagree. want is checked in lender constructor.


#### 6. Potential error `Index out of range`
##### Description
In methods:
- `estimateAdjustPosition` at the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol#L267:
`_potential = lenders[_highest].aprAfterDeposit(toAdd)` 

- `adjustPosition` at the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol#L399:
`lenders[highest].deposit()`

- `_withdrawSome` at the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol#L464:
 `amountWithdrawn += lenders[lowest].withdraw(_amount - amountWithdrawn)`

There are risks that `lenders` array may be empty.

##### Recommendation
It is recommended to add next code:
```
if (lenders.length == 0) {
    return;
}
```

##### Status
Fixed at https://github.com/Grandthrax/yearnV2-generic-lender-strat/commit/3ead812d7ac9844cc484a76545b3e222a9130852.



#### 7. Potential money remains on the strategy
##### Description
At the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol#L431:

`uint256 toSend = assets.mul(_newPositions[i].share).div(1000)`

Then the contract sends `toSend` amount to lender and deposits it immediately. 

For example imagine that `assets` equals 33 and `lenderRatio[]` equals [{address1, 500}, {address2, 500}]. Next logic:
0. want.balanceOf(address(this)) -> 33
1. toSend = (33 * 500) // 1000 = 16 -> deposit it to address1
2. toSend = (33 * 500) // 1000 = 16 -> deposit it to address2
3. require(share == 1000, "SHARE!=1000") -> true
4. want.balanceOf(address(this)) -> 1 // remain tokens

##### Recommendation
It is recommended to process remain tokens and deposit them too.

##### Status
Acknowledged


### COMMENTS
#### 1. Using magic numbers
##### Description
The use in the source code of some unknown where taken values impairs its understanding.

The value is `1000`:
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol on lines 45, 431, 436

The value is `1e18`:
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol#L543
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCompound.sol#L62
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericDyDx.sol on lines 177, 178
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCream.sol#L55
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/EthCream.sol#L53
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/EthCompound.sol on lines 59, 181, 189, 191

The value is `1`:
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/AlphaHomoLender.sol#L137
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/EthCompound.sol#L108
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/EthCream.sol#L102
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCompound.sol#L108
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCream.sol#L101
- in the contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericDyDx.sol#L106


##### Recommendation
It is recommended that you create constants with meaningful names for using numeric values.

##### Status
Fixed at https://github.com/Grandthrax/yearnV2-generic-lender-strat/commit/3ead812d7ac9844cc484a76545b3e222a9130852.

##### Client's commentary
> explained magic numbers where appropriate. Changed in tendTrigger.


#### 2. Function without logic
##### Description
At the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Interfaces/GenericLender/IGeneric.sol#L23 has an external function `enabled()`.
This function always returns true when executed. There is no other logic in this function.
This function is located in the following locations:
- at the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/AlphaHomoLender.sol#L177
- at the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/EthCompound.sol#L164
- at the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/EthCream.sol#L143
- at the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCompound.sol#L150
- at the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCream.sol#L129
- at the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericDyDx.sol#L160

##### Recommendation
It is recommended that you remove this function or add logic to the body of the function.

##### Status
Acknowledged


#### 3. The unchangeable value of the variable
##### Description
The contract https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol#L477 has an internal function `liquidatePosition()`.
One of the return variables for this function is called `_loss`.
The value of this variable is always `0`.
This can be seen on lines 482, 486, 488.

##### Recommendation
It is recommended to delete a variable whose value does not change.

##### Status
Acknowledged


#### 4. Maximum value in function `approve()` 
##### Description
Setting a maximum value for the amount of tokens that can be manipulated after calling the `approve()` function could cause an attacker to invoke his transaction for his profit.
Such calls are now in the following places:
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCream.sol#L39
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericLenderBase.sol#L45
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericCompound.sol#L46
 https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericDyDx.sol#L34

##### Recommendation
When calling the `approve()` function, set the actual value for the amount of tokens. 

##### Status:
Acknowledged


#### 5. Unresolved `TODO`
##### Description
Unresolved `TODO` was found in https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/GenericLender/GenericDyDx.sol#L29.

##### Recommendation
It is recommended to resolve it.

##### Status
Fixed at https://github.com/Grandthrax/yearnV2-generic-lender-strat/commit/3ead812d7ac9844cc484a76545b3e222a9130852.


#### 6. Add modifier for `emergencyExit` state
##### Description
Some functions of https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol don't check `emergencyExit` state. This allows to continue working with the contract after exit.

##### Recommendation
It is recommended fixing it with special modifier `emergencyExit`.

##### Status
Acknowledged


#### 7. Add event for`migrate`
##### Description
At the line https://github.com/Grandthrax/yearnV2-generic-lender-strat/blob/979ef2f0e5da39ca59a5907c37ba2064fcd6be82/contracts/Strategy.sol#L554 for the migration process there is only a `Transfer` event.

##### Recommendation
It is recommended to emit special event `Migrated` in order to keep users up to date.

##### Status
Acknowledged

##### Client's commentary
> This is a base strategy improvement suggestion, out of scope.



## CONCLUSION

Findings list:

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 2
WARNING | 7
COMMENT | 7


Final commit identifier with all fixes: `3ead812d7ac9844cc484a76545b3e222a9130852`

### Executive summary
The checked volume includes a set of smart contracts that are part of the project, which combines the functionality for working with lending. The developed functionality serves as an aggregator of all known platforms for working with lending. It allows you to choose the optimal platform for the user.


### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit, no critical issues were found, two issues were marked as major because it could lead to some undesired behavior, also several warnings and comments were found and discussed with the client. After working on the reported findings all of them were resolved or acknowledged (if the problem was not critical).