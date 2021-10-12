# Yoracle.Link audit

###### tags: `Yearn`

## Introduction

### General Provisions
Yearn Finance is a decentralized investment aggregator that leverages composability and uses automated strategies to earn high yield on crypto assets.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol
https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol

The audited commit identifier: `faf1309cbe7a05f70b338351315039eb8e5b9c09`


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
* Checking the code compliance with the customer requirements 
* Discussion of independent audit results
* Report preparation

## Report

### CRITICAL

Not found
  
### MAJOR

Not found

### WARNINGS

#### 1. Safe math library isn't used

##### Description
At the lines 101, 108, 116, 151, 154, 156, 377, 387, 396, 621, 627, 641, 664, 667, 672, 675, 691, 696, 697, 701, 705, 706, 710, 770, 772 , 776, 778, 796 in https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol and at the lines 33, 40, 53, 55, 61, 64, 69, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124 , 126, 128, 131, 133, 135, 137, 139, 141, 143, 189, 196, 209, 211, 217, 220, 225, 246-284, 287, 289, 291, 293, 295, 297, 299 , 320, 323, 330-346, 350-354, 363, 365, 371, 374, 379, 393-398, 435, 438, 445, 450-461, 465-469, 478, 480, 486, 489, 494 , 508-513 in https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol if you do not use a library for safe math, then an arithmetic overflow may occur, which will lead to incorrect operation of smart contracts.

##### Recommendation
All arithmetic operations need to be redone using the safe math library. Moreover, this library is already in the contracts https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L176.

##### Status
Acknowledged

#### 2. The number of loop iterations should be limited

##### Description
In https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol there are internal arrays `_pairs` for addresses and an `observations` map for structures `Observation[]`. The number of elements of these arrays in the logic of smart contracts only increases, but there is no functionality to decrease. Theoretically, the number of their elements can be very large, since it is not limited anywhere in the program.
In loops, the number of elements of this array is used as the upper bound on the number of iterations. Any iteration in the loop uses gas. But the amount of gas in one block is limited. It means that a situation may arise when there is not enough gas to perform all the iterations of the cycle and the function will stop working.
There are such loops here:
line 575, 595, 662, 670, 696, 705,

##### Recommendation
It is necessary in loops to introduce a limit on the number of iterations or on the possible number of array elements in loops.

##### Status
Acknowledged

#### 3. Possible incorrect operation of the function

##### Description
At the line https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L626 the result of the `_valid` function depends on the value of `block.timestamp`. But the `block.timestamp` value is set by the miner. This may result in an incorrect result.  According to the specification https://github.com/ethereum/wiki/blob/c02254611f218f43cbb07517ca8e5d00fd6d6d75/Block-Protocol-2.0.md, the miner can shift `block.timestamp` up to 900 seconds. If the range is greater, then you are safe.

##### Recommendation
We recommend adding a restriction on the value of variable `age`. For the same reason, we do not recommend setting the value of the `periodSize` constant less than 900.

##### Status
Acknowledged

#### 4. It is possible to go beyond the boundaries of the array

##### Description
At the line https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L685 the `sample` function does not check for a valid `observations[pair]` array element number.
On lines 700, 701, 709, 710 there is a call to the array element with the `nextIndex` index. But there is nowhere a check that the `nextIndex` value is less than and equal to the value of the variable `length`.

##### Recommendation
We recommend to add such a check.

##### Status
Acknowledged

#### 5. There is no check of the ether balance on the contract before it is transferred

##### Description
At the line https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L479 before transferring ether from the contract, you need to check that its amount is greater than 0.

##### Recommendation
Add checking the ether balance on the contract before transferring it.

##### Status
Acknowledged

#### 6. Function calculation result is not processed

##### Description
Below there will be a case when the code does not process the result of calling `approve`.

https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L819

`approve` method may return `false`.

##### Recommendation
Check the return value of the function.

##### Status
Acknowledged

#### 7. Potential `Out of range` error

##### Description
Code line https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L638 may return an exception because `observations[pair]` cannot guarantee the length more than 1.

##### Recommendation
It is recommended to check it.

##### Status
Acknowledged

#### 8. Contract cannot be compiled

##### Description
The contact `Keep3rV1Volatility.sol` has the following syntax errors:
https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Volatility.sol#L157
https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Volatility.sol#L428

##### Recommendation
It is recommended to fix the errors above.

##### Status
Acknowledged


### COMMENTS

#### 1. We recommend changing the scope of functions

##### Files
https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol

##### Description
Changing the scope of functions will allow making transactions with a lower cost of gas.

##### Recommendation
https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol
On line 560, the `work` function can be changed from `public` to `external`.
On line 565, the `workForFree` function can be changed from `public` to `external`.
On line 574, function `_updateAll` can be changed from `internal` to `private`.
On line 603, the `_update` function can be changed from `internal` to `private`.
On line 626, the `_valid` function can be scoped from `"internal` to `private`.
On line 807, function `retBasedBlackScholesEstimate` can be changed from `public` to `external`.
On line 818, the `_swap` function can be changed from `internal` to `private`.

https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol
On line 26, the `floorLog2` function can be changed from `internal` to `private`.
On line 48, the `ln` function can be changed from `internal` to `private`.
On line 83, for the `optimalExp` function, the scope can be changed from `internal` to `private`.

These steps will save you some gas cost for transactions.

##### Status
Acknowledged

#### 2. We recommend moving the functions to a separate library

##### Description
In smart contract https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L751 there is the `sqrt` function and in smart contracts
https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol#L382 and https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol#L497 this function is again described.

##### Recommendation
We recommend that you describe it once in the library file.
We also recommend transferring the following functions to this library:
`floorLog2` located here https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol#L182
`ln` located here https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol#L204
`optimalExp` located here https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol#L239
`C` located here https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol#L328
The `C` function can be named more meaningfully and clearly.

It is possible that you can take other functions. But the main thing is that the mathematical functions are located in a separate library.
Then the source code will be easier to test and understand.

##### Status
Acknowledged

#### 3. Duplicate code

##### Description
The `quote` function is completely repeated here https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol#L148
and here https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol#L304
It needs to be described only once.

The `IERC20` interface is completely repeated here https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol#L10
and here https://github.com/iearn-finance/yoracle.link/faf1309cbe7a05f70b338351315039eb8e5b9c09/master/contracts/Keep3rV1Volatility.sol#L166
It needs to be described only once.

https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L486
On lines 486, 495, 560 the code is repeated:
`require (msg.sender == governance," setGovernance:! Gov ");`
It is necessary to transfer this code to a separate access modifier.

https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L468
On lines 468 and 474 the code is repeated:
`require (KP3R.isMinKeeper (msg.sender, minKeep, 0, 0)," :: isKeeper: keeper is not registered ");`
It is necessary to transfer this code to a separate access modifier.

https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L562
On lines 562 and 567 the code is repeated:
`require (worked," UniswapV2Oracle:! Work ");`
It is necessary to transfer this code to a separate access modifier.

https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L632
On lines 632 and 652 the code is repeated:
`require (_valid (pair, periodSize.mul (2))," UniswapV2Oracle :: quote: stale prices ");`
It is necessary to transfer this code to a separate access modifier.

##### Recommendation
Duplicate code is a very bad programming practice and is against the principles of SOLID (single responsibility, open–closed, Liskov substitution, interface segregation и dependency inversion). We recommend refactoring the source code.

##### Status
Acknowledged

#### 4. We recommend removing additional functionality from the access modifier

##### Description
At the line https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L472 the `upkeep` access modifier has additional functionality designed to calculate the amount of ETH and send it from the contract.
In accordance with the principles of SOLID (single responsibility, open–closed, Liskov substitution, interface segregation и dependency inversion) software development, each module is responsible for only one thing. An access modifier should only be responsible for access.

##### Recommendation
It is necessary to transfer all additional functionality from this modifier to a separate function.

##### Status
Acknowledged

#### 5. We recommend caching the variable

##### Description
At the line https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L411 in the `getAmountsIn` function, the length of the `path.length` array is calculated 3 times: on lines 412, 413, 415.

##### Recommendation
We recommend storing the value of the array length in a separate variable and referring to this variable.
This will slightly reduce the gas consumption.

##### Status
Acknowledged

#### 6. Mixed formatting

##### Description
`Tabs` are used instead of `Spaces`:
https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Volatility.sol#L443

##### Recommendation
Make corrections to the source code.

##### Status
Acknowledged

#### 7. Potential `Out of range` error

##### Description
At the lines https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L656, https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L690 in `observations[pair]` there is always more than 1 element (https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L557). 

##### Recommendation
However, it is recommended to check it.

##### Status
Acknowledged

#### 8. Lack of event

##### Description
https://github.com/iearn-finance/yoracle.link/blob/faf1309cbe7a05f70b338351315039eb8e5b9c09/contracts/Keep3rV1Oracle.sol#L479
Logging events while a smart contract is running is a good practice.

##### Recommendation
It is recommended to emit an event when ethers are transferred.

##### Status
Acknowledged



## CONCLUSION

Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 0
WARNING | 8
COMMENT | 8


Final commit identifier with fixes: `22a438fcce04ea08be383e1a3e757b49af765ed4`

Smart contracts were audited and several suspicious places were spotted. During the audit no critical and major issues were found, eight issues were marked as warnings and eight comments were found and discussed with the client. After working on the reported findings all of them were resolved or acknowledged. So, the contracts are assumed as secure to use according to our security criteria.

### Executive summary
The volume checked includes 2 smart contracts that are part of the oracle on-chain mechanism for UniswapV2 pairs. The project also uses other smart contracts. But the smart contracts we tested are among the main ones.