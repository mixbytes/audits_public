# ExperiPie Smart Contract Audit

![](MixBytes.png)

## Introduction

### General Provisions
ExperiPie (TPIE++) is a new pool design with unlimited possibilities. The ExperiPie is based on the Diamond standard, this standard ensures contracts can grow beyond their restricted size. In the current DeFi space there are lots of opportunities to participate in governance of various protocols. The ExperiPie uses a very flexible CallFacet which makes it possible to execute any call on behalf of the pool. The ExperiPie will be used to participate in governance protocols to benefit PieDao participants. Yield farm opportunities can show up any time, not everyone has the liquidity or attention to fulfill every opportunity. Using the ExperiPie everyone can pool their tokens. Through the flexible nature of the pool it is possible to use active governance to take any yield farm opportunity.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingLogicAave.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingLogicCompound.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingManager.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingRegistry.sol

https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/RSIManager.sol

https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Basket/BasketFacet.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Basket/LibBasketStorage.sol

https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Call/CallFacet.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Call/LibCallStorage.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/ERC20Facet.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/LibERC20.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/LibERC20Storage.sol

https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/shared/Access/CallProtection.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/shared/Reentry/LibReentryProtectionStorage.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/shared/Reentry/ReentryProtection.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/factories/PieFactoryContract.sol

https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/interfaces/IAaveLendingPool.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/interfaces/IAToken.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/interfaces/IBasketFacet.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/interfaces/ICallFacet.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/interfaces/ICToken.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/interfaces/IERC20Facet.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/interfaces/IExperiPie.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/interfaces/ILendingLogic.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/interfaces/IPriceReferenceFeed.sol
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/interfaces/ISynthetix.sol

https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/Imports.sol

The audited commit identifier is `facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5`



## Security Assessment Principles

### Classification of Issues

* CRITICAL: Bugs leading to Ether or token theft, fund access locking or any other loss of Ether/tokens to be transferred to any party (for example, dividends). 

* MAJOR: Bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement. 

* WARNINGS: Bugs that can break the intended contract logic or expose it to DoS attacks. 

* COMMENTS: Other issues and recommendations reported to/ acknowledged by the team.

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

#### 1. Invalid setter function

##### Description
* In the `setDefaultController()` function defined at line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/factories/PieFactoryContract.sol#L34, the new value is assigned to the `defaultController` variable. But it is not taken into account that earlier using the `bakePie()` function, the pool owner could be changed to address of `defaultController`. Thus, as a result of the work of the `setDefaultController()` function, the pool owner will remain the same, while it is expected that the pool will be managed from a different address.
* In the `setFeeBeneficiary()` function defined at line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Basket/BasketFacet.sol#L87 , the `LibBasketStorage.basketStorage().FeeBeneficiary` variable is assigned a new value. But it is not taken into account that earlier tokens could be issued to this address in the following places: https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Basket/BasketFacet.sol#L141, https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Basket/BasketFacet.sol#L175, https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Basket/BasketFacet.sol#L216.


##### Recommendation
It is necessary to carefully check the logic of these functions and make corrections if necessary.

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/063c9237d696683f37444054a91e99ec3805b50a

##### Client's commentary
* Setting the default controller will set the owner of newly deployed pools to that address. Older pools will keep their current controller.
* I'll charge the fee upon changing the fee beneficiary so any fees up to that point will go to the current `feeBeneficiary`.


#### 2. Incorrect logic when burning and minting tokens

##### Description
* The `mint()` function defined at the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/ERC20Facet.sol#L44 is for minting new tokens.
The amount of tokens is increased on the wallet with the address `_receiver`.
But the ERC-20 specification also uses the value of the `totalSupply` variable.
This variable is not incremented here.

* At line: https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/ERC20Facet.sol#L48. The `burn()` function is for burning tokens. The amount of tokens is reduced on the wallet with the address `_from`.
But the ERC-20 specification also uses the value of the `totalSupply` variable. The value of this variable is not decremented here.
At the same time, the value of the variable `totalSupply` is used 7 times for calculations in this smart contract: 
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Basket/BasketFacet.sol.

##### Recommendation
This problem needs to be corrected so that the calculations would be correct.

##### Status
No issue

##### Client's commentary
* The total supply is incremented when minting at https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/LibERC20.sol#L18 
* The total supply is decreased on burning at https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/LibERC20.sol#L26


#### 3. Approve / TransferFrom multiple withdrawal attack

##### Files
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/ERC20Facet.sol

##### Description
This known issue is documented here: https://github.com/ethereum/EIPs/issues/738.

Summary / example of the attack:
1.	Alice allows Bob to transfer N of Alice's tokens (N>0) by calling approve method on Token smart contract passing Bob's address and N as method arguments
2.	After some time, Alice decides to change from N to M (M>0) the number of Alice's tokens Bob is allowed to transfer, so she calls approve method again, this time passing Bob's address and M as method arguments
3.	Bob notices Alice's second transaction before it was mined and quickly sends another transaction that calls transferFrom method to transfer N Alice's tokens somewhere
4.	If Bob's transaction is be executed before Alice's transaction, then Bob will successfully transfer N Alice's tokens and will gain an ability to transfer another M tokens
5.	Before Alice noticed that something went wrong, Bob calls transferFrom method again, this time to transfer M Alice's tokens.

So, Alice's attempt to change Bob's allowance from N to M (N>0 and M>0) made it possible for Bob to transfer N+M of Alice's tokens, while Alice never wanted to allow so many of her tokens to be transferred by Bob.

##### Recommendation
We recommend adding additional sanity checks to the `approve()` function and using the `increaseAllowance()` / `decreaseAllowance ()`  workaround functions:
`require((_amount == 0) || (allowed[msg.sender][_spender] == 0));`

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/d05aa2667bba822ff02afd4d61b8c8232fc73c98

##### Client's commentary
Doing these checks in the normal approve methods causes behaviour which is unexpected for some DeFi protocols and not strictly part of the ERC20 standard. I'll add increaseAllowance and decreaseAllowance functions.


#### 4. Gas overflow during iteration (DoS)

##### Description
Each iteration of the cycle requires a gas flow.
A moment may come when more gas is required than it is allocated to record one block. In this case, all iterations of the loop will fail.
Affected lines:
* https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/factories/PieFactoryContract.sol#L72
* https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Call/CallFacet.sol#L43
* https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Call/CallFacet.sol#L67
* https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Call/CallFacet.sol#L81
* https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Basket/BasketFacet.sol on lines 45, 126, 158, 274, 296

##### Recommendation
We recommend adding a check for the maximum possible number of elements of the arrays.

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/d05aa2667bba822ff02afd4d61b8c8232fc73c98, https://github.com/pie-dao/ExperiPie/commit/09690d3475dba62f185d769c19752705140c5187

##### Client's commentary
We will add a max length for the targets. Since every call can have a widely varying gas cost, you cannot really make sensible assumptions on what the max number of calls should be.


#### 5. Global Protection of malicious backward calls in raw methods execution

##### Description
At the lines: https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/callManagers/LendingManager/LendingManager.sol#L44, https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/callManagers/LendingManager/LendingManager.sol#L70, https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/callManagers/LendingManager/LendingManager.sol#L102, https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/callManagers/LendingManager/LendingManager.sol#L114, https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/callManagers/RSIManager.sol#94, https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/callManagers/RSIManager.sol#131 anything can happen in target methods execution.

We expect one-way class methods execution-graph like:
```
A.method1 -> B.method2 -> C.method3
```
So it is better to ensure it.

##### Recommendation
With growing complexity and cross-dependency of SmartContracts such mistaken or malicious case can occure and it will not be easy to track. So it is better to place protection against unexpected calls, e.g. place a `totalCallsCount` class-level variable. Increase it every time, any class-method was called.
And do something like:

```
   totalCallsCountBefore = totalCallsCount;
   call(target, bytes)
   require(totalCallsCount == totalCallsCountBefore)
```

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/7b548e30c00407ce2bf8f936f573a680a7c294f0

##### Client's commentary
It’s a good catch. We’ll fix it.


### WARNINGS

#### 1. No validation of the address parameter value in contract constructor

##### Description
The variable is assigned the value of the constructor input parameter. But this parameter is not checked before this. If the value turns out to be zero, then it will be necessary redeploy the contract, since there is no other functionality to set this variable.

At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingLogicAave.sol#L16 the `lendingPool` variable is set to the value of the `_lendingPool` input parameter.

At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingLogicCompound.sol#L16 the `lendingRegistry` variable is set to the value of the `_lendingRegistry` input parameter.

At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingManager.sol#L24 the `lendingRegistry` variable is set to the value of the `_lendingRegistry` input parameter.

At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingManager.sol#L25 the variable `basket` is assigned the value of the input parameter` _basket`.

At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/RSIManager.sol#L31 values of the following variables are not checked: `_assetShort`,`_assetLong`, `_priceFeed`,`_basket`, `_synthetix`.

##### Recommendation
In all the cases, it is necessary to add a check of the input parameter to zero before initializing the variables.

##### Status
Fixed at
https://github.com/pie-dao/ExperiPie/commit/bd652b276a67c42c30eb9bb43f3e5269ad476ac7,
https://github.com/pie-dao/ExperiPie/commit/37e9bed55305fead16d8851fbbb837444ab8d1a1,
https://github.com/pie-dao/ExperiPie/commit/4fdbfd782f6308e4304b4437125bfd903f617bec,
https://github.com/pie-dao/ExperiPie/commit/f5bddc2e2895cb52e5974da0a47c3bc305c72a3f

##### Client's commentary
We'll add check if the a parameters are not zero.


#### 2. No validation of the address parameter value in function before using this parameter in access modifiers

##### Description
It is possible that parameter value will be equal to zero. Then the work of the smart contract will be blocked.

At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingRegistry.sol#L33 for the `_wrapped` variable in the`setWrappedToProtocol()` function.


At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingRegistry.sol#L43 for the variable `_underlying` in the`setWrappedToUnderlying ()` function.

At the linehttps://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingRegistry.sol#L53 for the `_logic` variable in the`setProtocolToLogic()` function.

At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingRegistry.sol#L64 for the variable `_underlying` and` _wrapped` in the `setUnderlyingToProtocolWrapped()` function.

At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/factories/PieFactoryContract.sol#L35 for the `_controller` variable in the`setDefaultController ()` function.

##### Recommendation
It is necessary to add a check of the parameter value to zero before initializing the variables.

##### Status
Acknowledged

##### Client's commentary
This is a feature. It effectively allows us to disable a specific token in the lending adapter. It also allows us to disable a token in the lending registry and to create pools which are finalized and cannot be changed after it.


#### 3. Possible loss of tokens

##### Description
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/LibERC20.sol#L17
If the value of the `_to` parameter is equal to zero, then the tokens will be lost, because they cannot be disposed of.
However, the value of the `es.totalSupply` variable will be incremented.

##### Recommendation
In the `mint` function, we recommend adding a check for the`_to` parameter for zero.
```solidity
require(_to != address(0), "mint to the zero address
```

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/e80418a82928f93bede0117f9395d2db87a7d359

##### Client's commentary
We'll add this check.


#### 4. Invalid deletion of an array element

##### Description
* First, for the `removeFacet()` function defined at https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/factories/PieFactoryContract.sol#L39, the value of the `_index` parameter is not checked. If its value turns out to be greater than the number of array elements, then an interrupt will occur due to going out of bounds of the array.

* Second, on line 41, the array element with the number `_index` is assigned to the value of the last array element. Then the last element is removed. Thus, the integrity of the array is violated, because the elements are shuffled and not in the order they were added to the array.

##### Recommendation
We recommend that you redo the logic of this function.
An example of the correct implementation can be found here:
https://ethereum.stackexchange.com/questions/1527/how-to-delete-an-element-at-a-certain-index-in-an-array 
But keep in mind that when implementing a cycle, you must set a limit on the maximum number of its iterations.

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/32df79575bba516c101f4b3cb9971b94d1cc0dfe

##### Client's commentary
* We'll check if the index is within the length of the array -1
* The order of the array is not important in this case. Removing the element like this is the most gas efficient way with the least amount of code complexity.


#### 5. The function should return a variable, but this is not done

##### Description
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/ERC20Facet.sol#L75
The `transferFrom()` function should return a boolean variable, but this is not in the source code.

##### Recommendation
We recommend adding the return value of this function.

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/5a5c9de98bbcdd02b1c21053f35b5ed4c717f7da

##### Client's commentary
It's a good catch, we'll return true.


#### 6. It is necessary to check the correctness of the variable value

##### Description
* At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/LibERC20.sol#L25 the `burn()` function decreases the value of the amount of `es.balances` tokens for the`_from` wallet. We recommend adding a check of the current value of the `_from` variable for zero:
```require(_from != address(0), "burn from the zero address");```
* At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/ERC20Facet.sol#L57 the `approve()` function gives a permission to dispose of own tokens for the `_spender` wallet. We recommend adding a check of the current value of the `_spender` variable to zero:
```require(_spender != address(0), "approve to the zero address");```
* At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/ERC20Facet.sol#L79 in the `transferFrom()` function, there is a decrease in the value of the amount tokens allowed to the sender`msg.sender` for the `_from` wallet. We recommend adding a check of the current value of the `_from` variable for zero:
```require(_from != address(0), "transfer from the zero address");```
* At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/ERC20Facet.sol#L115 in the `_transfer ()` function, the value of the amount of tokens for the `_from` wallet is decreasing. We recommend adding a check of the current value of the `_from` variable for zero: 
```require(_from != address(0), "transfer from the zero address");```

##### Recommendation
We recommend adding a the particular checks.

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/65868cceb93d754b06716989bd66c1e106089ede, https://github.com/pie-dao/ExperiPie/commit/32035cd18215aea0616195791fb70961b9e25161

##### Client's commentary
* This is a feature as it allows us to recover tokens by burning them from the zero address and then minting them to another address.
* Fixed
* Fixed
* Checked in above function.


#### 7. Possible incorrect operation of the function

##### Description
At the lines https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Basket/BasketFacet.sol#L200 and https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Basket/BasketFacet.sol#L209. The result of the function depends on the value of `block.timestamp`. But the value `block.timestamp` is set by the miner. This may result in an incorrect result. According to the specification https://github.com/ethereum/wiki/blob/c02254611f218f43cbb07517ca8e5d00fd6d6d75/Block-Protocol-2.0.md, the miner can shift `block.timestamp` up to 900 seconds. If the range is greater, then you are safe.

##### Recommendation
We recommend that you do not use `block.timestamp` or calculate the difference between the two values so that it is greater than 900.

##### Status
Acknowledged

##### Client's commentary
Blocks in ethereum always have an increasing block.timestamp and the possible shift of 900 seconds does not cause any unexpected behaviour.


#### 8. Too open rebalance method

##### Description
This is potentially dangerous because of potential manipulations on the market: https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/callManagers/RSIManager.sol#L50

##### Recommendation
We suggest adding some restrictions for the caller account.

##### Status
Acknowledged

##### Client's commentary
This specific manager uses synthetix which has its own frontrunning protection by settling trades after 3 minutes.


#### 9. `maxCap` can go under `totalSupply`

##### Description
If the supply is bigger than new `maxCap`: https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/facets/Basket/BasketFacet.sol#L242

##### Recommendation
We recommend to add `require(totalSupply <= _maxCap, '...')`.

##### Status
Acknowledged

##### Client's commentary
Setting the `maxCap` below the total supply allows us to only allow withdraws. This can be used when sunsetting an ExperiPie.


#### 10. ERC20Face initialize can be called several times

##### Description
It is not logical and potentially can cause misunderstanding and mistakes: https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/facets/ERC20/ERC20Facet.sol#L16

##### Recommendation
We suggest adding the following check:
```
require(!finalized, '...')
```

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/edeee96ad3e20b4626405fbf0895d31f7fdbdf94

##### Client's commentary
Although it can only be called by the contract owner which is assumed to be non-malicious, it’s a good recommendation to add this check.


#### 11. Require success in search over tokens using for-loop

##### Description
If a token was not found, it means that something unexpected happen, moreover in that case we also emit event that the token was removed, but it's not true: https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/facets/Basket/BasketFacet.sol#L52

##### Recommendation
We recommend to fail the call or not to emit a particular event.

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/d7eb866ed3eb52771ca0f20d1b95b66909084e60

##### Client's commentary
Good catch. Will revert on faillure.


#### 12. Exit pool potentially is impossible

##### Description
At the lines https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/facets/Basket/BasketFacet.sol#L163 and https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/facets/Basket/BasketFacet.sol#L179
Due to `require(tokenBalance.sub(tokenAmount) >= MIN_AMOUNT, "TOKEN_BALANCE_TOO_LOW");` it is impossible to leave the pool completely, so some funds will be locked in the pool forever.

It is not clear why there should be such unsolvable problems if you want just to "take all your tokens and leave".

##### Recommendation
Probably `MIN_AMOUNT` is not 0 because of the division by `totalSupply` in some places. At least this moment should be covered in source code somewhere.

##### Status
Acknowledged

##### Client's commentary
Token amounts going below the minimum amount might cause issues with the calculations during join and exit that’s why a minimum is enforced. In most cases it should not be an issue and if it is, the tokens can be salvaged through the `callFacet`.


### COMMENTS

#### 1. Duplicate code

##### Files
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Call/CallFacet.sol

##### Description
Duplicate code, i.e. using the same code structures in several places. Combining these structures will improve your code. The use of duplicate code structures impairs the perception of the program logic and can easily lead to errors in subsequent code edits. Duplicate code violates SOLID (single responsibility, open–closed, Liskov substitution, interface segregation и dependency inversion) software development principles.

##### Recommendation
At the lines 24, 36 in file https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Call/CallFacet.sol instead of this code: 
> `require(msg.sender == LibDiamond.diamondStorage().contractOwner, "NOT_ALLOWED");`
> 
we recommend making the access modifier
>`
modifier onlyContractOwner() {
    require(msg.sender == LibDiamond.diamondStorage().contractOwner, "NOT_ALLOWED");
    _;
}
`

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/a0403f51b39035e34d5bce900811a64851080342

##### Client's commentary
We'll convert the duplicate code to a modifier.


#### 2. There is no check of the amount of ether before calling the paid function

##### Description
At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Call/CallFacet.sol#L99 in the `_call` function, paid functions are called in other contracts. But on the balance of the contract there may not be enough ether to perform these functions and the `_call` function will not be executed.

##### Recommendation
We recommend adding such a check.

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/fbe217394788a5c83a89f2f5cdac8091a2ad5c6b

##### Client's commentary
We'll add the check.


#### 3. No event registration when changing the parameters of the contract

##### Description
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingLogicAave.sol#L20
We recommend adding the `Lend` event logging for the`lend()`function.

https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingLogicAave.sol#L42
We recommend adding logging of the `UnLend` event for the`unlend()`function.

https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingLogicCompound.sol#L19
We recommend adding the `Lend` event logging for the`lend()`function.
https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingLogicCompound.sol#L43
We recommend adding logging of the `UnLend` event for the`unlend()`function.

https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingManager.sol#L93
We recommend adding logging of the `RemoveToken` event to the`removeToken()` function.

https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/callManagers/LendingManager/LendingManager.sol#L105
We recommend adding logging of the `AddToken` event for the`addToken()` function.

##### Recommendation
We recommend adding logging.

##### Status
Acknowledged

##### Client's commentary
We'll add the events. These events are already emitted by either the lending manager or the experiPie itself.


#### 4. Incorrect function logic

##### Description
At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/ERC20/ERC20Facet.sol#L105 the `_transfer ()` function is designed to transfer tokens from one wallet to another wallet.
But here, for the situation, if the value of the sender's wallet turns out to be equal to zero, tokens are burned from `msg.sender` account instead of from `_from`.

##### Recommendation
We recommend that you redo the logic of this function so that only logic remains here,
responsible for the transfer of tokens, but not burning.

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/36e136c71bca191ef830200d2f59a4cbf8140f86

##### Client's commentary
It’s a good catch, we’ll remove the burning logic.


#### 5. We recommend adding an additional parameter when registering an event

##### Description
At the line https://github.com/pie-dao/ExperiPie/blob/facf3c246d9c43f5b1e0bad7dc2b0a9a2a2393c5/contracts/facets/Call/CallFacet.sol#L101 calling the `_call()` function performs any action with any contracts.
However, the `Call` event does not store who called the function.

##### Recommendation
We recommend adding one more parameter to save the value of `msg.sender`.

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/8a6dfb4fcc9ef3f90cd899f91e3a8c86f3d81c0d

##### Client's commentary
We'll add the event parameter.


#### 6. Unclear constants

##### Description
For example, it is absolutely unclear what `30 * 10**18` means. At the following lines: https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/callManagers/RSIManager.sol#L54, https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/callManagers/RSIManager.sol#L58, https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/callManagers/RSIManager.sol#L78, https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/facets/Basket/BasketFacet.sol#L97, https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/facets/Basket/BasketFacet.sol#L107, https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/facets/Basket/BasketFacet.sol#L124, https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/facets/Basket/BasketFacet.sol#L139

##### Recommendation
Constants should be described on the top of the class once and have descriptive names and comments if need.

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/05090894278025a1be6f03853f4a93129cec5061

##### Client's commentary
It’s a good catch. We’ll convert to clearly defined constants or variables assigned in the constructor.


#### 7. Use `totalSupply <= maxCap` instead of `<`

##### Description
It is more rational to use `<=` instead of `<` at the line https://github.com/pie-dao/ExperiPie/blob/0.0.2/contracts/facets/Basket/BasketFacet.sol#L122.

##### Recommendation
We suggest to replace operator to `<=` instead of `<`.

##### Status
Fixed at https://github.com/pie-dao/ExperiPie/commit/6468c4ed205e03580d120affe2ddaa6a8f17ce48

##### Client's commentary
It’s a good catch. We’ll incorporate the suggested check.



## CONCLUSION

Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 5
WARNING | 12
COMMENT | 7

Final commit identifier with fixes: `32df79575bba516c101f4b3cb9971b94d1cc0dfe`

Several problems have been identified and properly addressed. The client responded well to our comments. According to our analysis, fixed contracts are free of vulnerabilities.


## EXECUTIVE SUMMARY

The audited contract is a new pool design with unlimited possibilities. ExperiPie is based on the Diamond standard, this standard ensures that contracts can exceed their limited size. Due to the flexible nature of the pool, active management can be used. But these opportunities must be used with great care.
