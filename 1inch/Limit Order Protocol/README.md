# Limit order protocol Security Audit Report (merged)

###### tags: `1Inch`

## Introduction

### Project overview
1inch is a DeFi aggregator and a decentralized exchange with smart routing. The core protocol connects a large number of decentralized and centralized platforms in order to minimize price slippage and find the optimal trade for the users.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/helpers/AmountCalculator.sol
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/helpers/ChainlinkCalculator.sol
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/helpers/ERC1155Proxy.sol
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/helpers/ERC20Proxy.sol
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/helpers/ERC721Proxy.sol
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/helpers/ImmutableOwner.sol
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/helpers/NonceManager.sol
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/helpers/PredicateHelper.sol
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/libraries/ArgumentsDecoder.sol
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/libraries/SilentECDSA.sol
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/libraries/UncheckedAddress.sol

The audited commit identifier is `a14bde6a260458de5083cee117d734221e1cbc05`

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
#### 1. Possible call for zero address
##### Description
Zero address don't checked in the following function:
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L145
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L349
##### Recommendation
We recommend to add the following check:
```solidity=
require(targets[i] != address(0), "LOP: incorrect address");
```
##### Status
Acknowledged
##### Client's commentary
First function always reverts. And second one will just do nothing on wrong address. So we don't see benefits in those requires.

#### 2. Cancel of already cancelled order
##### Description
User can cancel already filled order, so incorrect event would emit:
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L161
##### Recommendation
We recommend to add the following check:
```solidity=
require(_remaining[orderHash] != 1, "LOP: already filled");
```
##### Status
Fixed at https://github.com/1inch/limit-order-protocol/commit/56116071b5d29fe448d74ac1f0b1c085bec7b122


#### 3. Possible reentrancy
##### Description
In the following function reentrancy can occur:
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L280-L345
##### Recommendation
We recommend to add `nonReentrant` modificator.
##### Status
Acknowledged
##### Client's commentary
There's a problem with reentrancy only if reentrancy will under permit, and from this protection is built in. If reentrancy will be when token transfer this is no problem because all all state updates take place before transfers.

#### 4. Possible filling of already filled order
##### Description
User can try to fill already filled order by mistake:
https://github.com/1inch/limit-order-protocol/blob/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L294
##### Recommendation
We recommend to add the following check:
```solidity=
require(remainingMakerAmount > 0, "LOP: already filled");
```
##### Status
No issue
##### Client's commentary
It is enforced indirectly as we do not allow empty fills.

#### 5. Possible ddos attack
##### Description
Malicious maker can block bots for filling order if he calls unbounded operation (infinite loop) in `notifyFillOrder`:
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L338
##### Recommendation
We recommend to use gas limit for this function.
##### Status
Acknowledged
##### Client's commentary
This will lead to a single unfillable limit order which is fine.

#### 6. Incorrect signature can lead to incorrect call
##### Description
In the following function, if signature is incorrect and maker is a user, then this function would revert because of static call for user:
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L397
##### Recommendation
We recommend to change function like this:
```solidity=
if (signature.length != 65 && signature.length != 64) { ... }
else {require(SilentECDSA.recover(orderHash, signature) == maker), "LOP: incorrect signature")}
```
##### Status
No issue
##### Client's commentary
Static calls to EOA are allowed. isValidSignature call will just return 0 bytes which will then revert with LOP: bad signature.

#### 7. Unclear check
##### Description
If user passes incorrect amount to filling the order, then this function reverts because of static call with zero parameters:
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L441
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L452
##### Recommendation
We recommend to change the function like this:
```solidity=
require(order.getMakerAmount.length != 0, "LOP: incorrect amount");
```
##### Status
Fixed at https://github.com/1inch/limit-order-protocol/commit/4f9986a1b2dbc580f683f06a1519d9c554b72933


### COMMENTS
#### 1. Unclear field
##### Description
Meaning of bits in `info` field in `OrderRFQ` structure is unclear:
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L59
##### Recommendation
We recommend to add a comment like this:
```solidity=
uint256 info; // unused(128bit) expiration(64bit) slot(56bit) shift(8bit)
```
##### Status
Fixed at https://github.com/1inch/limit-order-protocol/commit/9d32dd53ebeb62d929a38854bbfd46dd5a567d4e


#### 2. `_MAX_SELECTOR` is too big
##### Description
Selector with maximum value which used in this contract = uint32(IERC20.transferFrom.selector) + 4:
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L88
##### Recommendation
We recommend to reduce `_MAX_SELECTOR`.
##### Status
No issue
##### Client's commentary
It is reserved for future token types.

#### 3. Syntax inconsistency
##### Description
RFQ order shift calculation is different:
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L167
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L211
##### Recommendation
We recommend to use the same calculation to increase readability ((orderInfo & 0xff) or (uint8(orderinfo)))
##### Status
Fixed at https://github.com/1inch/limit-order-protocol/commit/9617c70452e2c4d3abf95f6e4f9d7ada730aa1cf


#### 4. Incorrect message in require
##### Description
Message in require is incorrect:
https://github.com/1inch/limit-order-protocol/tree/a14bde6a260458de5083cee117d734221e1cbc05/contracts/helpers/ERC721Proxy.sol#L15
##### Recommendation
We recommend to change the message in require.
##### Status
Fixed at https://github.com/1inch/limit-order-protocol/commit/b170b3a64e9a8d38f75a7a296db230640c145b37


#### 5. Incorrect event field
##### Description
In `OrderFilled` event first field should be `taker` https://github.com/1inch/limit-order-protocol/blob/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L48
##### Recommendation
We recommend to rename `maker` to `taker`.
##### Status
No issue
##### Client's commentary
This is done so that makers can get collect their stats. takers can collect their stats directly from their transactions.

#### 6. Possibility of cancel non-existing orders
##### Description
User can cancel any order with `makerAssetData` containing his address at `FROM_INDEX` index https://github.com/1inch/limit-order-protocol/blob/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L157-L163
##### Recommendation
We recommend to check order existing.
##### Status
No issue
##### Client's commentary
This is by design. This is for orders that exists offchain but were not yet posted onchain.

#### 7. User can deccrease allowance
##### Description
User can decrease allowance before fillOrder will be executed
##### Recommendation
Add additional require for checking allowance for user before next lines.
https://github.com/1inch/limit-order-protocol/blob/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L206
https://github.com/1inch/limit-order-protocol/blob/a14bde6a260458de5083cee117d734221e1cbc05/contracts/LimitOrderProtocol.sol#L305
It saves some gas in this case. Also it possible to add this checking on user side before transaction executing.
##### Status
No issue
##### Client's commentary
It saves some gas on fails but it also add additional gas overhead for successful transactions. Considering the tradeoff we'll leave the contract unchanged.

## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| -
MAJOR   | -
WARNING | 7
COMMENT | 7

### Executive summary
The audited scope implements a protocol of limit orders with two types:
- orderRFQ is a simple limit order with gas optimized option;
- order is a limit order has complex option with significant configuration variability.
with supported tokens ERC20, EC721, ERC1155 with some new adds like: taker permit.

The code is written in a very gas-efficient manner for cheap usage by end-users.

### Conclusion
Smart contract has been audited and several suspicious places were found. During the audit no critical or major issues were spotted. Several issues were marked as warnings and comments. After working on audit report all issues were fixed or acknowledged by the client. Thus, contract is assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `4f9986a1b2dbc580f683f06a1519d9c554b72933`