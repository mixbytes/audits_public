# Aggregation router V4 Interim Security Audit Report (merged)

###### tags: `1Inch`

## Introduction

### Project overview
1inch is a DeFi aggregator and a decentralized exchange with smart routing. The core protocol connects a large number of decentralized and centralized platforms in order to minimize price slippage and find the optimal trade for the users.

The smart contracts reviewed in this audit are designed to create a universal exchange for tokens. Now it includes functionality for the following routers: `Uniswap`, `Uniswap V3` and `Clipper`. All external functions of the smart contracts `UnoswapRouter`,` UnoswapV3Router` and `ClipperRouter` will be available after the deployment of the smart contract `AggregationRouterV4`. The `swap()` function is also in the `AggregationRouterV4` contract itself.
This fact is both good and bad. Good for advanced functionality and dangerous for different routers to interact with each other.

Below is the description of the purpose of the studied smart contracts:
- `ClipperRouter` is intended to interact with the Clipper exchanger. Clipper is the decentralized exchange built to give the self-made crypto trader the best possible prices on small trades (< $10k).
- `LimitOrderProtocolRFQ` is designed to work with Orders. Functions often use the `OrderRFQ` structure. This structure stores order data.
- `UnoswapRouter` is designed to interact with the Uniswap exchange version less than 3.
- `UnoswapV3Router` is designed to interact with the Uniswap version 3 exchange.
- `AggregationRouterV4` is the inheritor from all previous smart contracts and includes all their functionality.

- `ArgumentsDecoder` is a low-level library for converting `uint256` and `address` variables from a `byte` variable.
- `EthReceiver` is an abstract contract for verifying that `msg.sender != tx.origin`.
- `Permitable` is an auxiliary contract with one internal function `_permit()`. It is needed to issue permissions for managing tokens.
- `UniERC20` is a library to facilitate the work with tokens and ETH.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/AggregationRouterV4.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/ClipperRouter.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/LimitOrderProtocolRFQ.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapRouter.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol

- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/helpers/ArgumentsDecoder.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/helpers/EthReceiver.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/helpers/Permitable.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/helpers/UniERC20.sol

- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/interfaces/IAggregationExecutorExtended.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/interfaces/IChi.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/interfaces/IClipperExchangeInterface.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/interfaces/IDaiLikePermit.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/interfaces/IERC1271.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/interfaces/IUniswapV3Pool.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/interfaces/IUniswapV3SwapCallback.sol
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/interfaces/IWETH.sol

The audited commit identifier is `93868c483180cf74fc2551568f0396938b3eeaa8`


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

#### 1. Decrease in the amount of tokens during exchange due to arithmetic overflow of a variable 
##### Description
At the lines:
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L166 и 
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L175 
a number with the type `uint256` is converted to a number with the type` int256`. This number is passed in the function parameter and, after conversion, is sent to the `UniswapV3Pool` contract.
But, if the value of the number is greater than the maximum value for the type `int256`, an arithmetic overflow will occur.
This is demonstrated by the following example: https://gist.github.com/mixbytes-audit/b471cc82105f856d1546ba638de20f4e.
For example, if you take the number `57896044618658097711785492504343953926634992332820282019728792003956564819970`, then after the conversion you get the value`-5789604461865809771178549250434395392663499233282028206672879199039`
We see a decrease in modulus of the initial value of the variable.

##### Recommendation
Before lines 166 and 175, you need to check that the value of the number is less than the maximum value for the type `int256`.

##### Status
Fixed at https://github.com/1inch/1inch-contract/commit/0c89b19e78af194c3a85f74de5954cfc72fbe7b1




#### 2. Increase in the amount of tokens during exchange due to arithmetic overflow of a variable 
##### Description
At the lines:
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L170 и 
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L179 
the number with the type `int256` is converted to the number with the type` uint256`. The number is taken with a minus sign.
But before that, there is no check that the number is less than 0.
If we take a small positive value and apply the transformation `uint256(-amount)` to it, we get a very large value due to arithmetic overflow.
This is demonstrated by the following example https://gist.github.com/mixbytes-audit/b471cc82105f856d1546ba638de20f4e.
For example, if you take the number `1000`, then after conversion you get the value` 115792089237316195423570985008687907853269984665640564039457584007913129638936`.
We see an increase in the initial value of the variable.

##### Recommendation
Before lines 166 and 175, you need to check the value of the variable for being less than 0.
If the value of the variable is positive, then do not do the conversion.

##### Status
Fixed at https://github.com/1inch/1inch-contract/commit/0c89b19e78af194c3a85f74de5954cfc72fbe7b1



#### 3. No validation of the value of the variable `msg.value`
##### Description
At the lines https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/ClipperRouter.sol#L57-L68 
processing of the input data is done before the exchange procedure.
`ETH` is not required to work with `WETH` and regular tokens. But the user can inadvertently transfer it.
In this case, the user will lose these `ETH`.
To prevent this from happening, you need to add checks before lines 60 and 67:
```solidity=
 require(msg.value == 0, "CL1IN: wrong msg.value");
```

##### Recommendation
Additional checks need to be added.

##### Status
Fixed at https://github.com/1inch/1inch-contract/commit/c40696f8c8824f27bfd826dd65734d0a0c355225



### WARNINGS

#### 1. There is no processing of the value returned by the function
##### Description
When working with tokens according to the ERC-20 standard, it is necessary to check the values that return functions.
In some places it is not done. This can be seen on the following lines:
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/ClipperRouter.sol#L58
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/ClipperRouter.sol#L76
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/AggregationRouterV4.sol#L152
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/extensions/RouteWrapperExtension.sol#L36

##### Recommendation
It is recommended to add processing of the value returned by the function.

##### Status
Acknowledged
##### Client's commentary
- WETH always returns true
- uniTransfer already has those checks in place


#### 2. Accessing an interface using the `uint256` type
##### Description
At the lines:
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L163 и 
- https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L172 
the `IUniswapV3Pool` interface is called to call the `swap()` function.
To work through the interface, the value of the `pool` variable must be of type `address`.
But on the line https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L160 this variable is of type `uint256`.
Other types must be cast to type `address`.

##### Recommendation
The source code needs to be corrected.

##### Status
Acknowledged
##### Client's commentary
Type is uint256 as we used tight packing to pack additional flags to the same slot with pool address, like _ONE_FOR_ZERO, _WETH_WRAP and _WETH_UNWRAP.
And uint256 -> address casts are still allowed in solidity 0.7.6


#### 3. Zero-address checking
##### Files
https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/ClipperRouter.sol
##### Description
The `_clipperPool` are assignments in constructor, but not checks to zero-address before:
https://github.com/mixbytes/1inch.github.1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/ClipperRouter.sol#L25

##### Recommendation
It is recommended to check  
```solidity=
    require(clipperExchange.theExchange() != address(0));
```

##### Status
Acknowledged
##### Client's commentary
We'll skip this as it is unlikely that we'll pass some address with valid ClipperExchangeInterface ABI that will return invalid pool.


### COMMENTS

#### 1. Invalid function parameter
##### Description
At the lines https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/helpers/Permitable.sol#L16-L39 lines have a function for granting permissions to work with tokens from another address.
This function has an `amount` parameter, which is needed to transfer the number of tokens.
But on lines 22 and 25, permission is approved without using this parameter.
The number of tokens is also passed in the `permit` variable.
This logic can lead to errors when working with this function.

##### Recommendation
It is recommended to refactor your source code.

##### Status
Fixed at https://github.com/1inch/1inch-contract/commit/993fe1112e68d86f8940ba39895cc1f8889523da
##### Client's commentary
Amount was used to continue execution in case of permit failure but when there is enough allowance. But we decided to remove that optimisation in https://github.com/1inch/1inch-contract/pull/81


#### 2. The likelihood that anyone can use another approval
##### Description
All external functions of the smart contracts `UnoswapRouter`,` UnoswapV3Router` and `ClipperRouter` will be available after the deployment of the smart contract `AggregationRouterV4`.
There are functions that exchange tokens. Before this operation it is required that the user gives an approval to the address of the contract for the disposal of his tokens.
For example, we see it in this line: 
https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/ClipperRouter.sol#L67.
But there is some time between the `approve()` operation and the `swap()` operation. They are not done at the same time.
In between these events, an attacker can run the external function `uniswapV3SwapCallback()` located here:
https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L83-L158.
As a parameter `calldata`, he can specify the necessary data for transferring tokens to his wallet on lines
https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L148 and
https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L155.
Here `payer` will be the wallet address of the user who gave the `approve()`, but has not yet performed the data exchange.

##### Recommendation
It is recommended to restrict the call of this function only from the Uniswap V3 pool.

##### Status
Acknowledged
##### Client's commentary
It is already restricted. See https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L136


#### 3. The likelihood that anyone can withdraw tokens from the balance of the contract
##### Description
All external functions of the smart contracts `UnoswapRouter`,` UnoswapV3Router` and `ClipperRouter` will be available after the deployment of the smart contract `AggregationRouterV4`.
At the lines https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L151-L153 have a `rescueFunds()` function. It is needed for the owner of the contract so that he can withdraw any tokens from the balance of the contract.
Thus, it is assumed that there are tokens on the contract balance.
An attacker could run the external function `uniswapV3SwapCallback()` located here:
https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L83-L158.
As a parameter `calldata`, he can specify the necessary data for transferring tokens to his wallet on lines
https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L146 and
https://github.com/1inch/1inch-contract/blob/93868c483180cf74fc2551568f0396938b3eeaa8/contracts/UnoswapV3Router.sol#L153.

##### Recommendation
It is recommended to restrict the call of this function only from the Uniswap V3 pool.

##### Status
Acknowledged
##### Client's commentary
Same as above
Also it is not expected that tokens will appear on Router balance. So that `rescueFunds` is only here to rescue accidentally sent tokens.




## Results

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 3
WARNING | 3
COMMENT | 3


### Conclusion
Smart contracts have been audited and several suspicious places have been detected. During the audit no critical issues were found, several majors, warnings and comments were spotted. After working on the reported findings all of them were fixed by the client or acknowledged (if the problem was not critical).

Final commit identifier with all fixes: `0c89b19e78af194c3a85f74de5954cfc72fbe7b1`