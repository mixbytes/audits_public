![](MixBytes.png)

# Pickle.Finance Smart Contracts Audit (strategy-curve-scrv-v4_1)

## Introduction

### General Provisions
[Pickle.Finance](https://pickle.finance) is an experiment in using farming to 
bring stablecoins closer to their peg.

### Scope of the Audit

The scope of the audit includes following smart contract at: 
https://github.com/pickle-finance/protocol/blob/master/src/strategies/curve/strategy-curve-scrv-v4_1.sol.

The audited commit identifier is: 8d2a96ced740cb5dda4381e70d476760ce4b13e1

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
* Checking the code compliance to customer requirements 
* Discussion of independent audit results
* Report preparation

## Detected Issues

### CRITICAL

Not found

### MAJOR

Not found

### WARNINGS

#### 1. Harvesting Potential Front-Run

This particular issue is about `harvest()` function having no limitations on
caller identifier, not having "commit and reveal" scheme usage or any other 
mechanism preventing front-running in here: [strategy-curve-scrv-v4_1.sol#L153](https://github.com/pickle-finance/protocol/blob/master/src/strategies/curve/strategy-curve-scrv-v4_1.sol#L153)

Calling this particular function wrongly (implementing a displacement
front-running pattern) brings risks Alice would not being able to rely on 
transaction execution result in case Bob front-runs harvesting transaction with 
higher gas fee bid. 

This issue does not break the state, but it breaks the logic contract works 
from Alice's point of view.

This particular issue was classified as a warning because the author is clearly aware about it, from what we see from the comments.

Also, since there is no way to benefit from front-running this particular
function call, this issue makes no significant damage.

Since this function is a public function, the proof of concept would be a node 
mempool listener, which would transact with enormous gas amount right after
gets the transaction spotted.

*The issue was resolved with restricting the calling of this function to only EOAs and the strategist or governance addresses along with `onlyBenevolent` modifier being appended to the `harvest` function signature here. The `onlyBenevolent` modifier is defined here.*


#### 2. Potentially Null Swap Destination Address

This particular issue is about `_swapUniswap` function not being used carefully having 
a possibility to swap tokens with `UniswapRouterV2` to `address(0)` destination.
 in here: [strategy-base.sol#L214](https://github.com/pickle-finance/protocol/blob/a808366db95b07c0b8940e919ec72d80e2deaca7/src/strategies/strategy-base.sol#L214) 

Since this function is an internal one and the actual destination address is
still being checked later, this is not a major issue, but just a warning.

It is recommended to append `require(_to != address(0))` requirement right after
the function execution starts.

*This issue was resolved with the following PR: https://github.com/pickle-finance/protocol/pull/5.*

#### 3. Non-Null Addresses

[strategy-curve-scrv-v4_1.sol#L49](https://github.com/pickle-finance/protocol/blob/master/src/strategies/curve/strategy-curve-scrv-v4_1.sol#L49)

[strategy-base.sol#L44](https://github.com/pickle-finance/protocol/blob/a808366db95b07c0b8940e919ec72d80e2deaca7/src/strategies/strategy-base.sol#L44) 

Since all the operations with `address`-typed `StrategyCurveSCRVv4_1` and `StrategyBase` contract fields are being performed with `safeTransfer` or `_approve` functions, checking if an `address`-typed argument is not `0`, it is recommended to implement additional `require`s in contract constructor, checking if each of input arguments `!= address(0)`, to avoid potential issues in newcoming contract updates (according to
`harvest()` functions comment).

*This issue was resolved with the following PR: https://github.com/pickle-finance/protocol/pull/7.*

### COMMENTS

#### 1. Redundant memory allocation for asset index type

`getMostPremium()` function (in here: [strategy-curve-scrv-v4_1.sol#L81](https://github.com/pickle-finance/protocol/blob/master/src/strategies/curve/strategy-curve-scrv-v4_1.sol#L81)
returns tuple `(address, uint256)`, which
contains unnecessarily huge asset index type `uint256`. Since the function 
structure would require to update the contract anyway in case new stablecoins
would be added, there is no need in reserving index type sized for enormously 
huge amount of assets. 

Storing asset index in a type like `uint8` would be more appropriate for now.

*This issue was resolved with the following PR: https://github.com/pickle-finance/protocol/pull/6.*

## CONCLUSION

The smart contract was audited and no critical or major issues were found. 
Two suspicious places were spotted (marked as a warning), but, as it has been 
understood, the developer is already acknowledged about one of them. According to the 
implementation mostly consists of well-reviewed OpenZeppelin libraries (or 
modules implemented with following OpenZeppelin's manuals step by step) along 
with Uniswap interface modules, using extensive overflow prevention techniques 
with OpenZeppelin's `SafeMath` library, checking destination addresses along 
with message senders all the way, using reentrancy-safe implementation techniques,
the contract itself is mostly safe to use.