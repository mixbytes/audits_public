# RealityCards Security Audit Report (merged)

###### tags: `RealityCards`

## Introduction

### Project overview
Reality Cards is the world's first NFT-based prediction market, where instead of betting on an outcome, you own it. Concepts such as shares, bids, asks do not exist- even 'odds' are abstracted away, replaced by a 'daily rental price'.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCTreasury.sol

https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/nfthubs/RCNftHubXdai.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/nfthubs/RCNftHubMainnet.sol

https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol


https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/interfaces/IAlternateReceiverBridge.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/interfaces/IRCProxyMainnet.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/interfaces/IRCProxyXdai.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/interfaces/IRCNftHubXdai.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/interfaces/IRealitio.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/interfaces/IERC20Dai.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/interfaces/IERC721.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/interfaces/IRCMarket.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/interfaces/IFactory.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/interfaces/ITreasury.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/interfaces/IBridgeContract.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCTreasury.sol

https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/lib/EIP712Base.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/lib/NativeMetaTransaction.sol
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/lib/CloneFactory.sol

The audited commit identifier is `8c0b05b25a7deef25f98532ae2f8afd4f9a84360`

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

#### 1. Use msgSender instead of msg.sender in Event param
##### Description
Since the contract uses metatransactions everywhere (and uses NativeMetaTransaction), you should always use `msgSender()`
- https://github.com/RealityCards/RealityCards-Contracts/blob/fd3b713d1a15f92ebc329f85038b76563f1587b8/contracts/RCMarket.sol#L584

otherwise the event parameter maybe not correct

look at the logic at https://github.com/RealityCards/RealityCards-Contracts/blob/fd3b713d1a15f92ebc329f85038b76563f1587b8/contracts/lib/NativeMetaTransaction.sol#L105

But at https://github.com/RealityCards/RealityCards-Contracts/blob/fd3b713d1a15f92ebc329f85038b76563f1587b8/contracts/RCMarket.sol#L579 the `msgSender()`, so it is used what is not consistent.

##### Recommendation
It is recommended to use `msgSender()` in all of `msg.sender` usages (see also: https://medium.com/biconomy/biconomy-supports-native-meta-transactions-243ce52a2a2b).

##### Status
Acknowledged

##### Client's commentary
The instances of msg.sender left are in functions that are only for the market contract (doesn't use meta-Tx), or the sponsor function where the sponsor is expected to have funds and not use meta-Tx. But we've decided that yes we will do a blanket change to msgSender() everywhere, so this will be fixed.


### WARNINGS

#### 1. Check that the address is not zero
##### Description
The following lines use address variables. But if the value turns out to be zero, funds will be lost:
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCTreasury.sol#L163
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L70
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L75
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L80
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L85
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L90
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L100
- https://github.com/RealityCards/RealityCards-Contracts/blob/fd3b713d1a15f92ebc329f85038b76563f1587b8/contracts/bridgeproxies/RCProxyMainnet.sol#L104
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L95
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L100
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L105
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L110
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L120
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L142-L149
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L182
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/nfthubs/RCNftHubMainnet.sol#L29

##### Recommendation
It is recommended to add a check that address is valid.

##### Status
Fixed at 
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd



#### 2. Use general `safeTransferFrom`
##### Description
It is required to check success of transfer. So it is should be handled as in ERC20:
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/nfthubs/RCNftHubXdai.sol#L69

##### Recommendation
It is recommended to use the `safeTransferFrom()` method from the ERC20 safe library.

##### Status
No issue

##### Client's commentary
The intention is for the market to move the NFTs as and when the highest bidder changes, this means forcefully moving the NFTs without prior approval of the owner, which is why we are calling the internal function _transfer() and bypassing the usual ownership checks in transferFrom(), because of this it doesn't matter if the owner is a contract not implementing ERC721. If a non-implementer owns it during the event the market will forcefully move the NFT anyway, if they end up being the owner after the event has completed then it's assumed that was the intention of the winning bidder (the non-ERC721 contract creator) and the NFT is now locked. This will not be amended.



### COMMENTS

#### 1. Missing the check whether `_timestamps` has an appropriate length
##### Description
At the lines 
- https://github.com/RealityCards/RealityCards-Contracts/tree/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L312-L313
- https://github.com/RealityCards/RealityCards-Contracts/tree/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L317
- https://github.com/RealityCards/RealityCards-Contracts/tree/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L320
- https://github.com/RealityCards/RealityCards-Contracts/tree/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L352 
have operations with elements of the `_timestamps` array. It is possible that the number of transferred elements of the `_timestamps` array will be less than 3. In this case, a reference will be made to a nonexistent array element.
For clean code, it is better to avoid this situation and check the length of the array. 

##### Recommendation
It is recommended to check the number of array elements:
`require(_timestamps.length < 3, "Incorrect number of array elements");`

##### Status
Fixed at https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd




#### 2. Incorrect function name
##### Description
In some function `setSomeValue()` the value of boolean variable `someValue` is reversed. But by setting it means setting any value and the value may not even change. It would be more correct to call not "Set", but "Change". This can be seen on the following lines:

- https://github.com/RealityCards/RealityCards-Contracts/tree/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L187 
- https://github.com/RealityCards/RealityCards-Contracts/tree/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L197
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L216
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L226
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L232
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L237
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L242
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCTreasury.sol#L125
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCTreasury.sol#L130
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L137 

##### Recommendation
It is recommended to rename a `setSomeValue()` function to `changeSomeValue()`.

##### Status
Fixed at 
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd

##### Client's commentary
setMarketCreationGovernorsOnly to changeMarketCreationGovernorsOnly
setTrapCardsIfUnapproved to changeTrapCardsIfUnapproved
addOrRemoveGovernor to changeGovernorApproval
approveOrUnapproveMarket to changeMarketApproval
addOrRemoveArtist to changeArtistApproval
addOrRemoveAffiliate to changeAffiliateApproval
addOrRemoveCardAffiliate to changeCardAffiliateApproval
setGlobalPause to changeGlobalPause
setPauseMarket to changePauseMarket
enableOrDisableDeposits to changeDepositsEnabled



#### 3. Difficult calculation of uint max
##### Description
See these lines: 
- https://github.com/RealityCards/RealityCards-Contracts/tree/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L29 
- https://github.com/RealityCards/RealityCards-Contracts/tree/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L30
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L91

Both of this values are worked out by strange way. E.g. 2**256 for uint256 will get 0.
But there are simpler ways to calculate the maximum value. For example:
- `uint256 public constant MAX_UINT256 = uint256(-1);`
- `uint256 public constant MAX_UINT256 = type(uint256).max;`

##### Recommendation
It is recommended to make it clearer.

##### Status
Fixed at 
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd

##### Client's commentary
The recommended solution was not available in the project solidity version, after update the recommendations were applied.


#### 4. Self-explainable naming
##### Description

It's good if the name of the variable is absolutely self-explainable.
For primitive types (integers) it's good to know what exactly the variable is.
For mappings it's better to add key to the name (e.g. userDeposits not just deposits)

- key and value of struct is unclear
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L38 - mappingOfMarkets
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L49 - price

- add Percent postfix
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L46 - minimumPriceIncrease
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L62 - minimumPriceIncrease

- add DayDivisor postfix
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L64 - minRentalDivisor

- add weekDivisor postfix
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L66 - hotPotatoDivisor

- rentCollected postfix
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L51
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L53
https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L55

- deposit - https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCTreasury.sol#L23 what is the key?

- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L37 what is the key?

- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L38 what is the key?

- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L39 - must be upper-cased

- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L47 - what is the key?

- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L48 - what is the key?

- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L118 - change amicable to some common word

- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L50 - the purpose of the value is not clear from the name

##### Recommendation
It is recommended to rename variables.

##### Status
Fixed at
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd

##### Client's commentary
mappingOfMarkets not changed, variable unused for now, a better name will be chosen if it’s used otherwise it will be removed.
price to tokenPrice
minimumPriceIncrease to minimumPriceIncreasePercent
minRentalDivisor to minRentalDayDivisor
hotPotatoDivisor to hotPotatioWeekDivisor
collectedPerUser to rentCollectedPerUser
collectedPerToken to rentCollectedPerToken
totalCollected to totalRentCollected
deposit to userDeposit
isMarket not changed, where used it offers a simple readable name, also used in external bot
upgradedNfts to upgradedNftId
nft to NFT
deposits not changed, used in external bot
hasConfirmedDeposit not changed, used in external bot
setAmicableResolution not changed
floatSize, not changed, it is the size of the float.



#### 5. Not optimal data type
##### Description
At the line https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCFactory.sol#L42 uses an array. But with the use of structure, the code will become clearer.

##### Recommendation
It is recommended to make a structure.

##### Status
No issue

##### Client's commentary
Not changed, using an array offers easier integration with certain external services that already have an array as a data type.


### 6. Named constants or enum
##### Description
The following lines use variables and numbers:
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L34
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/nfthubs/RCNftHubXdai.sol#L80
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/nfthubs/RCNftHubXdai.sol#L87
This makes the code hard to read.

##### Recommendation
It is recommended to create constants or enum:
`MODE_CLASSIC`
`MODE_WINNER_TAKES_ALL`
`MODE_HOT_POTATO`

##### Status
Fixed at
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd

##### Client's commentary
Mode changed to enum
Market state checks have been updated.



#### 7. No magic numbers
##### Description
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L487 (fixed)
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L675
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L687
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L721 (fixed)
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L117 (what is `2` and `0`)
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L149 (what is `2` and `0`)
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L169 (what is `400000`) (fixed)
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L173 (what is `200000`) (fixed)
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L206 (what is `200000`) (fixed)

##### Recommendation
It is recommended to create named constants with required explanation about choicing the value

##### Status
Fixed at 
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd

##### Client's commentary
Changed to MIN_RENTAL_VALUE
100 is not considered a magic number here because alternatives such as “HUNDRED”, “PERCENT” or “CENTUM” wouldn’t clarify the basic arithmetic formula being performed.
As above
Issue derived from 6.a. 
Updated to REALITIO_TEMPLATE_ID and REALITIO_NONCE
As above
Updated to XDAI_BRIDGE_GAS_COST
Updated to MAINNET_BRIDGE_GAS_COST
As above



#### 8. The requirement will never work
##### Description
At the line https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L684 has the value for the requirement always False. 

##### Recommendation
It is recommended to make a variable or condition instead of False. Or remove this requirement.

##### Status
Fixed at 
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd

##### Client's commentary
Require statement amended and moved to a more appropriate place


#### 9. Save time cache values
##### Description
At the lines:
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCMarket.sol#L774-L777 
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCTreasury.sol#L176-L186

`msgSender()` is used in a lot of places. It is better to cache it to avoid multi calls.

##### Recommendation
It is recommended to cache the value.

##### Status
No issue

##### Client's commentary
msgSender() is now cached in several functions, although minimal benefit to be had when compiling with the optimizer.


#### 10. Explain tricky places
##### Description
Let's take a look at the following lines:
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCTreasury.sol#L73
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L215

It is not clear why 24*6 = 10 minutes.
It is not clear floatSize.

##### Recommendation
It is recommended to add explanations as comments.

##### Status
Fixed at 
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd

##### Client's commentary
Added explanation about min rental divisor
floatSize, not changed, it is the size of the float



#### 11. One value is always returned
##### Description
Here the function always returns True and never returns False:
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCTreasury.sol#L100
- https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyXdai.sol#L85

##### Recommendation
It is recommended to remove the return statement.

##### Status
Fixed at 
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd


##### Client's commentary
Removed the return value


#### 12. Do not hardcode addresses in constructor
##### Description
The address could be changed if deployed to testnet for example https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/bridgeproxies/RCProxyMainnet.sol#L52

##### Recommendation
It is recommended to set the address as an argument.

##### Status
Fixed at 
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd

##### Client's commentary
Address is now passed into the constructor


#### 13. Use msgSender instead of msg.sender
##### Description
Since the contract uses metatransactions everywhere (and uses NativeMetaTransaction), you should always use msgSender
- https://github.com/RealityCards/RealityCards-Contracts/blob/fd3b713d1a15f92ebc329f85038b76563f1587b8/contracts/RCMarket.sol#L332
- https://github.com/RealityCards/RealityCards-Contracts/blob/fd3b713d1a15f92ebc329f85038b76563f1587b8/contracts/RCTreasury.sol#L200
- https://github.com/RealityCards/RealityCards-Contracts/blob/fd3b713d1a15f92ebc329f85038b76563f1587b8/contracts/RCTreasury.sol#L211

look at the logic at https://github.com/RealityCards/RealityCards-Contracts/blob/fd3b713d1a15f92ebc329f85038b76563f1587b8/contracts/lib/NativeMetaTransaction.sol#L105

In above examples the code is correct but not robust, the method cannot be called via metaTransaction by the market contract. If the part of logic will be inaccurate copy-pasted to some other place it's easy to make a mistake forgetting about switching to `msgSender()`.

##### Recommendation
It is recommended to use `msgSender()` in all of `msg.sender` usages (see also: https://medium.com/biconomy/biconomy-supports-native-meta-transactions-243ce52a2a2b).

##### Status
Fixed at 
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd

##### Client's commentary
Changed all occurrences of msg.sender to msgSender.



#### 14. Use SafeMath
##### Description
The uint256 overflow is possible at https://github.com/RealityCards/RealityCards-Contracts/blob/8c0b05b25a7deef25f98532ae2f8afd4f9a84360/contracts/RCTreasury.sol#L84

##### Recommendation
It is recommended to use SafeMath.

##### Status
Fixed at 
https://github.com/RealityCards/RealityCards-Contracts/blob/a860b714944341eeda9b26a9e3d1f8f0747b6cbd





## Results

### Findings list:

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 1
WARNING | 2
COMMENT | 14

### Executive summary

The audited scope implements custom predictions market with a feature of renting tokens to claim reward instead of having them.
The project have several logical modules: proxies to xDai and ETH mainnet, NFT hubs to manage NFT, RCMarket to mange prediction market, RCFactory to create new RCMarkets, RCTreasury to store deposits and manage rewards.
Usage of xDai makes gas very cheap.
Such project could be used to create robust predictions markets.


### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical issues were spotted. One issue was marked major as it might cause the undesirable behavior. Several warnings and comments were found and discussed with the client. After working on the reported findings some of them were fixed or acknowledged (if the problem was not critical). So, the contracts are assumed as secure to use according to our security criteria.



Final commit identifier with all fixes: `a860b714944341eeda9b26a9e3d1f8f0747b6cbd`