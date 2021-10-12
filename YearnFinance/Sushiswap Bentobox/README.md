# Sushiswap Bentobox Smart Contract Audit

###### tags: `Sushiswap`

## Introduction

### Project overview
BentoBox is a full fledged lending platform which features:
 - Isolated lending pairs. Anyone can create a pair, it’s up to users which pairs they find safe enough. Risk is isolated to just that pair.
 - Flexible oracles, both on-chain and off-chain.
 - Liquid interest rates based on a specific target utilization, such as 75%.
 - Contracts optimized for low gas.
 - The supplied assets can be used for flash loans, providing extra revenue for suppliers.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/BentoBox.sol
https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol
https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/ERC20.sol
https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/Ownable.sol

https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/swappers/SushiSwapSwapper.sol

https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/ChainlinkOracle.sol
https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/PeggedOracle.sol
https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/CompositeOracle.sol
https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/SimpleSLPTWAP0Oracle.sol
https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/CompoundOracle.sol
https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/SimpleSLPTWAP1Oracle.sol

https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/libraries/BoringMath.sol

The audited commits identifier is `c2e150b16b8764ebfe2e1e6e267ae14e10738065`, `2a67dd809af4f9206cfd5bd5018c67167d2f4262`.


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

#### 1. Incorrect events parameter
##### Description
At the lines below:
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L252
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L267
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L282
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L291
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L306
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L321
 
there are places where we have events which require an affected user address as a parameter, however in these cases `msg.sender` is wrongly used as a parameter. These functions accept special `user` parameter that should be used in events instead of `msg.sender`. The issue marked as major since it can fatally affect the user's side code that is based on events.

##### Recommendation
We suggest replacing `msg.sender` to `user`.

##### Status
Fixed at https://github.com/sushiswap/bentobox/commit/2a67dd809af4f9206cfd5bd5018c67167d2f4262.

##### Client's commentary
> Events and functions have changed a fair bit, review of every event and the parameters is now part of our internal audit checklist.

> [name=auditor] More parameters were added to events.



### WARNINGS

#### 1. No validation of the address parameter value in contract constructor
##### Description
The variable is assigned the value of the constructor input parameter. But this parameter is not checked before this. If the value turns out to be zero, then it will be necessary to redeploy the contract, since there is no other functionality to set this variable.

* At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/BentoBox.sol#L46 the `WETH` variable is set to the value of the `WETH_` input parameter.
* At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L123 the `bentoBox` variable is set to the value of the `bentoBox__` input parameter.
* At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/swappers/SushiSwapSwapper.sol#L17 the `bentoBox` variable is set to the value of the `bentoBox_` input parameter.
* At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/swappers/SushiSwapSwapper.sol#L18 the `factory` variable is set to the value of the `factory_` input parameter.

##### Recommendation
In all the cases, it is necessary to add a check of the input parameter to zero before initializing the variables.

##### Status
Acknowledged

##### Client's commentary
> This is by design. This check would only benefit the developer/deployer or anyone who clones this. We tend to only add checks that improve security but we are keen to discuss this practice.


#### 2. Loss of tokens is possible when sent to a zero address
##### Description
In smart contracts, tokens are transferred from one address to another and an approval is issued for such operations.
When sending tokens to a zero address, they will no longer be used and they will be lost.
Such actions are performed on the following lines:
In https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/ERC20.sol on lines 22, 31-33, 39.
In https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/BentoBox.sol on lines 107, 122, 126, 133, 161, 179.

##### Recommendation
Add address verification to zero.

##### Status
Fixed at https://github.com/sushiswap/bentobox/commit/2a67dd809af4f9206cfd5bd5018c67167d2f4262.

##### Client's commentary
> Agreed. We added these checks to Transfer and TransferFrom - while this may technically break from the ERC20 standard and we normally don't like lots of checks, sending tokens to 0 by accident is common enough to warrant the extra gas for the check.

> [name=auditor] Partialy fixed for ERC20 at https://github.com/sushiswap/bentobox/commit/2a67dd809af4f9206cfd5bd5018c67167d2f4262/.
The project uses [boringcrypto](https://github.com/boringcrypto/BoringSolidity/blob/master/contracts/ERC20.sol) where these checks exist (except approve where it's not an issue). There is still no check at [here](https://github.com/sushiswap/bentobox/blob/2a67dd809af4f9206cfd5bd5018c67167d2f4262/contracts/BentoBoxPlus.sol#L291).


#### 3. It is possible to process a non-existing array element or skip an array element
##### Description
* At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L467 we are working with the elements of the `borrowFractions` array in a loop.
For each element of the `users` array, there must be an element of the` borrowFractions` array.
But if an error is made when transferring data for these arrays, then it is possible to refer to a nonexistent element of the array, or vice versa, any element will not be processed.
This will cause the `liquidate()` function to work incorrectly.

* At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/BentoBox.sol#L122 we are working with the elements of the `amounts` array in a loop.
For each element of the `tos` array, there must be an element of the `amounts` array.
But if an error is made when transferring data for these arrays, then it is possible to refer to a nonexistent element of the array, or vice versa, any element will not be processed.
This will cause the `transferMultipleFrom()` function to work incorrectly.

##### Recommendation
Add a condition so that the length of the `users` array were equal to the length of the` borrowFractions` array.

##### Status
Acknowledged


##### Client's commentary
> This is by design, but we would love to discuss this and understand the best practices here and reasoning. In my testing Solidity throws an invalid opcode revert when you try to access elements that are out of bounds.

> [name=auditor] An error if the number of elements in the second array is greater than the number of elements in the first array will be unnoticed.
It is good programming practice to conduct checks.
Additional gas will not be consumed for this. 


#### 4. Division by zero is possible
##### Description
At the lines below division by zero is possible:
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L227, the variable `_totalBorrow.fraction` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L259 the variable `_totalAsset.amount` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L274 the variable `_totalBorrow.amount` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L300 the variable `_totalAsset.fraction` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L315 the variable `_totalBorrow.fraction` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L469 the variable `_totalBorrow.fraction` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/BentoHelper.sol#L67 the variable `info[i].totalAssetFraction` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/BentoHelper.sol#L70 the variable `info[i].totalBorrowFraction` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/ChainlinkOracle.sol#L29 the variable `priceC` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/ChainlinkOracle.sol#L29 the variable `decimals` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/CompoundOracle.sol#L49 the variable `division` and the value `_getPrice(collateralSymbol)` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/CompoundOracle.sol#L55 the variable `division` and the value `_peekPrice(collateralSymbol)` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/SimpleSLPTWAP0Oracle.sol#L62 the variable `timeElapsed` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/SimpleSLPTWAP0Oracle.sol#L83 the variable `timeElapsed` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/SimpleSLPTWAP1Oracle.sol#L61 the variable `timeElapsed` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/oracles/SimpleSLPTWAP1Oracle.sol#L82 the variable `timeElapsed` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/swappers/SushiSwapSwapper.sol#L25 the variable `denominator` can be equal to zero.
 - https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/swappers/SushiSwapSwapper.sol#L32 the variable `denominator` can be equal to zero.

##### Recommendation
We will redo the division operation using the SafeMath Library.

##### Status
Fixed at https://github.com/sushiswap/bentobox/commit/2a67dd809af4f9206cfd5bd5018c67167d2f4262.

##### Client's commentary
> [name=auditor] Not fixed everywhere. For example [here](https://github.com/sushiswap/bentobox/blob/2a67dd809af4f9206cfd5bd5018c67167d2f4262/contracts/swappers/SushiSwapSwapper.sol#L26) or [here](https://github.com/sushiswap/bentobox/blob/2a67dd809af4f9206cfd5bd5018c67167d2f4262/contracts/swappers/SushiSwapSwapper.sol#L33).


### COMMENTS

#### 1. Using "magic" numbers
##### Description
The use in the source code of some unknown where taken values impair its understanding:
 - At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/ERC20.sol#L55 the value is `\x19\x01`.
 - At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/ERC20.sol#L57 the value is `0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9`.
 - At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/BentoBox.sol#L171 the value is `0x23b872dd`.
 - At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/BentoBox.sol#L186 the value is `0xa9059cbb`.
 - At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L586 the value is `0xa9059cbb`.
 - At lines 178, 389, 398, 503, 546 https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol the value is `1e5`.
 - At lines 177, 195, 198, 203 https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol the value is `1e18`.
 - At lines 86, 89 https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol the value is `0x95d89b41`.
 - At lines 96, 99 https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol the value is `0x06fdde03`.
 - At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L106 the value is `0x313ce567`.
 - At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L471 the value is `1e23`.

##### Recommendation
It is recommended that you create constants with meaningful names to use numeric values.

##### Status
Fixed at https://github.com/sushiswap/bentobox/commit/2a67dd809af4f9206cfd5bd5018c67167d2f4262.

##### Client's commentary
> Our internal audit now includes an item to change any 'magic number' to a constant with a clear name and a comment if needed.


#### 2. The function returns a public variable
##### Description
For the https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L243 line, the `updateExchangeRate()` function returns a value.
Lines https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L155 and https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L457 call this function.
But the return value is not processed.
The `updateExchangeRate()` function changes the `exchangeRate` public variable. There is no need to return a public variable.

##### Recommendation
Change the logic of the `updateExchangeRate()` function so that it did not return a public variable.

##### Status
Fixed at https://github.com/sushiswap/bentobox/commit/2a67dd809af4f9206cfd5bd5018c67167d2f4262.

##### Client's commentary
> Nice find! That was just wasting gas, removed.


#### 3. The function returns a variable, but it is not processed
##### Description
At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/interfaces/ISwapper.sol#L12, the `swap()` function returns a variable of type `uint256`.
But after calling this function, there is no processing of the received value. It is found in the following places:
 - At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L428
 - At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L498
 - At line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L519.

##### Recommendation
Add return value handling or rewrite the function logic so that it did not return a variable.

##### Status
Acknowledged

##### Client's commentary
> This has changed in the current version.


#### 4. Define `symbol` and `name` methods as `external`
##### Description
At the line https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L85 and https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L95 methods `symbol` and `name` which is expected to be used as `external` define as `public`.

##### Recommendation
Define them as `external` to prevent internal usage.

##### Status
Fixed at https://github.com/sushiswap/bentobox/commit/2a67dd809af4f9206cfd5bd5018c67167d2f4262.

##### Client's commentary
> Yes! Reviewing visibility of every function/variable is part of our internal audit, going forward we should catch this.


#### 5. Remove unnecessary comment
##### Description
At https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L429 the comment
> // TODO: Reentrancy issue? Should we take a before and after balance?

it is not really needed because it seems there is no re-entrancy issue here.

##### Recommendation
Remove the comment or discuss the problem.

##### Status
Acknowledged

##### Client's commentary
> Checking for reentrancy is something we would love to learn more about.


#### 6. Forward success status
##### Description
At https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L236 the `success` variable is got, but not returned at https://github.com/sushiswap/bentobox/blob/c2e150b16b8764ebfe2e1e6e267ae14e10738065/contracts/LendingPair.sol#L243.

##### Recommendation
It may be useful for a caller to know if oracle value was really got or the old value was used, so `return success, exchangeRate`.

##### Status
Fixed at https://github.com/sushiswap/bentobox/commit/2a67dd809af4f9206cfd5bd5018c67167d2f4262.


## Results

Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 1
WARNING | 4
COMMENT | 6


Final commit identifier with all fixes: `2a67dd809af4f9206cfd5bd5018c67167d2f4262(most fixes done)`.


### Executive summary
The inspected volume includes a set of smart contracts that are part of a new platform that allows users to deposit assets as collateral and borrow other assets against it. The developed functionality differs from the  competitors' one. It adds new features for working with isolated credit pairs, flexible oracles and flash loans.


### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical issues were found, one issue was marked as major because it could lead to some undesired behavior, also several warnings and comments were found and discussed with the client. After working on the reported findings all of them were resolved or acknowledged (if the problem was not critical).