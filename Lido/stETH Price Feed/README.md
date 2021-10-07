# stETH-price-feed Security Audit Report (merged)

###### tags: `LIDO`

## Introduction

### Project overview
LIDO protocol is a project for stacking Ether to use it in Beacon chain.  Users can deposit Ether to the Lido smart contract and receive stETH tokens in return. The stETH token balance corresponds to the amount of Beacon chain Ether that the holder could withdraw if state transitions were enabled right now in the Ethereum 2.0 network.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/PriceFeedProxy.sol
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/StEthPriceFeed.vy

The audited commit identifier is `459495f07c97d04f6e3839e7a3b32acfcade22ad`, `4a5db9ad4b0c8d815388d087a023f2b390af351a`


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
#### 1. Possible assets loss
##### Description
In the current version of protocol, user can lose money if accidentally sends tx to proxy with `msg.value>0`:
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/PriceFeedProxy.sol
##### Recommendation
We know that in the future the smart contract under proxy possibly would have some logic with receiving/withdrawing assets but as now it is not supported we recommend to override `_beforeFallback` like this:
```solidity=
function _beforeFallback() internal override { 
    if (msg.value > 0) {
        require(IsReceivingAllowed, "Sending wei not allowed");
    }
}
```
##### Status
Acknowledged

##### Client's commentary
While the price oracle is permissionless, we expect it to be mostly called by "oracle operators" & pre-made oracle daemon apps. That means we don't expect any funds sent to the contract. In case that would happen, we could upgrade the implementation to add "return funds" methods for ETH and ERC20 tokens.

#### 2. Possible admin control loss
##### Description
In the current version of protocol, admin can set address of a new admin to zero, which means that nobody can call admin functions after that:
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/PriceFeedProxy.sol#L106
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/StEthPriceFeed.vy#L151
##### Recommendation
We recommend to add simple check:
```solidity=
require(newAdmin != 0, "Incorrect admin address");
```
##### Status
No issue 

##### Client's commentary
That's intended behavior, as we may want to have "immutable" price feed with admin set to the zero address. Check the test here: https://github.com/lidofinance/steth-price-feed/blob/main/tests/test_initialization.py#L50

#### 3. Incorrect input parameters
##### Description
In the function for calculating price, relative difference `old` argument can be zero:
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/StEthPriceFeed.vy#L58
##### Recommendation
We recommend to add simple check:
```python=
assert old > 0, "oracle price not init"
```
##### Status
No issue 

##### Client's commentary
Price in the Curve pool - thus in the Oracle - can't happen to be zero in production environment.

#### 4. Bad range for price change
##### Description
In the current version of feed smart contract, it is possible to set 100% (for assets with the same price it is very big range) allowed range for price change:
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/StEthPriceFeed.vy#L162
##### Recommendation
We recommend to change max allowed difference to `1000`.
##### Status
Fixed at https://github.com/lidofinance/steth-price-feed/commit/4a5db9ad4b0c8d815388d087a023f2b390af351a


### COMMENTS
#### 1. Unnecessary payable modificator
##### Description
In the current version proxy constructor can receive assets, but does not use it anywhere:
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/PriceFeedProxy.sol#L57
##### Recommendation
We recommend to remove `payable` modificator.
##### Status
No issue

##### Client's commentary
We've aimed to follow OpenZeppelin's ERC1967Proxy as close as possible here, leaving the modificator as-is.

#### 2. Unnecessary check in constructor
##### Description
In the current version, proxy constructor contains unnecessary check:
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/PriceFeedProxy.sol#L69
##### Recommendation
We recommend to remove this check.
##### Status
No issue
##### Client's commentary
That's a sanity check for the correctness of the slot initialization, which we plan to leave as-is


#### 3. Possible incorrect initialization
##### Description
In the current version of feed contract, `initialize` function can be invoked only once and it can be done by anybody:
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/StEthPriceFeed.vy#L31
##### Recommendation
We recommend to deploy feed and proxy contracts in adjacent tx.
##### Status
No issue
##### Client's commentary
Current deployment script deploys contracts one after another: https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/scripts/deploy.py#L25-L26

#### 4. Events not emitting
##### Description
In the current version of feed contract after change of some storage variables events not emitting:
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/StEthPriceFeed.vy#L117
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/StEthPriceFeed.vy#L144
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/StEthPriceFeed.vy#L155
##### Recommendation
We recommend to add events and emit them in functions `update_safe_price`, `set_admin` and `set_max_safe_price_difference`.
##### Status
Fixed at https://github.com/lidofinance/steth-price-feed/commit/4a5db9ad4b0c8d815388d087a023f2b390af351a
##### Client's commentary
`update_safe_price` creates an event; will update the other two methods to emit as well

#### 5. No checks timestamp in `_update_safe_price`
##### Files 
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/StEthPriceFeed.vy
##### Description
Currently `_update_safe_price` method (https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/StEthPriceFeed.vy#L100) ignores information about `self.safe_price_timestamp`. So the intruder may manipulate with `safe_price_value` in one transaction.
##### Recommendation
We recommend to add some minimum diff for `safe_price_timestamp`.
##### Status
No issue
##### Client's commentary
While it's possible to tamper with the pool state & safe price in single tx, the security guarantees price feed provides aren't breached there, as the safe price stays in the defined range.

#### 6. Storage collisions between implementation versions
##### Files 
https://github.com/lidofinance/steth-price-feed/blob/459495f07c97d04f6e3839e7a3b32acfcade22ad/contracts/StEthPriceFeed.vy
##### Description
In future, if a developer changes order or types of variables in a new logic contract, it may be broken. More information about Storage Collisions you can find [here](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#unstructured-storage-proxie).
##### Recommendation
We recommend to add comment in the code of a logic contract about this collisions. 
##### Status
Fixed at https://github.com/lidofinance/steth-price-feed/commit/4a5db9ad4b0c8d815388d087a023f2b390af351a
##### Client's commentary
Will add the comment about the possible collisions.


## Results
Level | Amount
--- | ---
CRITICAL | -
MAJOR    | -
WARNING  | 4
COMMENT  | 6

### Executive summary
The LIDO stETH-price-feed project allows users and smart contracts to access the aggregated stETH price. The price is aggregated from two sources: the first source is the curve.fi stETH/ETH pool, and the second source is the LIDO stETH price oracle, which uses block hash parsing to get the stETH price from older blocks, and thus provides protection against attack through a flashloan. Additionally this implementation uses safe price range checks where the amplitude of the price change considered "safe" by the price feed, that potentially adds a layer of security for the price feed data customers.

### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical or major issues were found, several warnings and comments were spotted. After working on the reported findings all of them were fixed by the client or acknowledged (if the problem was not critical). So, the contracts are assumed as secure to use according to our security criteria.


Final commit identifier with all fixes: `4a5db9ad4b0c8d815388d087a023f2b390af351a`