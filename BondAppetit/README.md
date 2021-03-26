# BondAppetit Security Audit Report (merged full)

###### tags: `BondAppetit`

## Introduction

### Project overview
[BondAppetit](https://bondappetit.io) The first DeFi protocol that connects real-world debt instruments with the Ethereum ecosystem.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/bondappetit/bondappetit-protocol/tree/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/depositary/AgregateDepositaryBalanceView.sol https://github.com/bondappetit/bondappetit-protocol/tree/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/depositary/StableTokenDepositaryBalanceView.sol
https://github.com/bondappetit/bondappetit-protocol/tree/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/utils/AccessControl.sol https://github.com/bondappetit/bondappetit-protocol/tree/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/utils/OwnablePausable.sol https://github.com/bondappetit/bondappetit-protocol/tree/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/CollateralMarket.sol https://github.com/bondappetit/bondappetit-protocol/tree/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/Issuer.sol https://github.com/bondappetit/bondappetit-protocol/tree/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/StableToken.sol https://github.com/bondappetit/bondappetit-protocol/tree/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/Staking.sol https://github.com/bondappetit/bondappetit-protocol/tree/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/Treasury.sol https://github.com/bondappetit/bondappetit-protocol/tree/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/Vesting.sol

https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/Market.sol
https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/Investment.sol
https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/VestingSplitter.sol
https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/Budget.sol
https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/ProfitSplitter.sol
https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/UniswapMarketMaker.sol
https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/Buyback.sol
https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/depositary/RealAssetDepositaryBalanceView.sol
https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/depositary/DepositorCollateral.sol


The audited commit identifiers are `88680691fe8d872c5fc26e9500d19cf7caaa9861`, `355180f0aca0b29d60d808f761052956b7a3a159`

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
#### 1. Potential `safeApprove` blocking
##### Description
At several places, e.g. https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/Investment.sol#L182 contract perform `safeApprove` before uniswap's function call, however in case if uniswap doesn't use full provided allowance that can lead to blocking next `safeApprove` call because `safeApprove` requires zero allowance.

Another lines with same issue:
- https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/Market.sol#L248
- https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/Buyback.sol#L125
- https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/ProfitSplitter.sol#L195
- https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/ProfitSplitter.sol#L204
- https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/UniswapMarketMaker.sol#L116
- https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/UniswapMarketMaker.sol#L124
- https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/UniswapMarketMaker.sol#L125
- https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/UniswapMarketMaker.sol#L151
- https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/UniswapMarketMaker.sol#L152
- https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/UniswapMarketMaker.sol#L181

##### Recommendation
We recommend to always reset allowance to zero by calling `safeApprove` with `0` amount.

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/6fbe358e35e3c14279b58dc510de9b3b3a18daae


#### 2. Wrongly calculated ETH amount to transfer
##### Description
At lines https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/ProfitSplitter.sol#L198-L205 contract swaps whole `splitterIncomingBalance` to ETH if `splitterIncomingBalance` insufficient to cover gap between `splitterEthBalance` and `amount`, in other words contract try to get as much as closer to `amount` ETH amount. However as we can see in this block of code contract assigns `amountsOut[1]` to `amount`, it's wrong because we need to assign `splitterEthBalance.add(amountsOut[1])`

##### Recommendation
We recommend to assign `splitterEthBalance.add(amountsOut[1])` to `amount` instead of `amountsOut[1]`

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/6fbe358e35e3c14279b58dc510de9b3b3a18daae


#### 3. Potential re-entrancy problem
##### Description
At the line https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/ProfitSplitter.sol#L227 contract transfers incoming tokens to `recipient`, however that place can be re-entered in case of callbacks from `incoming` contract.

##### Recommendation
We recommend to add re-entrancy guard

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/6fbe358e35e3c14279b58dc510de9b3b3a18daae


#### 4. Blocked LP tokens on contract
##### Description
At the line https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/UniswapMarketMaker.sol#L85 contract changes `incoming` token to another one, while transferring contract sends all remaining `incoming` tokens to `_recipient`, but contract never check remaining incoming <> support LP tokens on contract side. That tokens cannot be rescued anymore after changing incoming.

##### Recommendation
We recommend to remove all liquidity before changing `incoming` token

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/6fbe358e35e3c14279b58dc510de9b3b3a18daae


#### 5. Missed depositary check
##### Description
In function `buy` defined at https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/CollateralMarket.sol#L120 contract exchanges collateral tokens to stable tokens. But in case of wrong `depositary` that code will lead to collateralization disbalance, that is bad even you have manual `depositary` changing mechanism because `issuer` requires exact list of depositaries and transaction wont fail because `rebalance` call is fault tolerance.

##### Recommendation
We recommend check depositary

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/b57608a17549897d52ba1b66d45496a4f0c018a7


#### 6. Invalid depositary add/remove logic
##### Description
At lines https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/depositary/AgregateDepositaryBalanceView.sol#L49, https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/depositary/AgregateDepositaryBalanceView.sol#L62 are defined functions to add or remove depositaries, `depositariesIndex` map contains depositary indexes added to `depositaries` array. At line https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/depositary/AgregateDepositaryBalanceView.sol#L50 contract requires that `depositariesIndex[depositary] == 0`, that check allow to add already added depositary that have `0` index. Same error at line https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/depositary/AgregateDepositaryBalanceView.sol#L64 that don't allow to remove depositary that have index `0`

##### Recommendation
We recommend to remaster depositary existing check 

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/35a3f56dafe8dcaf5232786276e2d75e9eb92f56


#### 7. Wrongly used `safeApprove`
##### Description
At line https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/Treasury.sol#L51 contract call `safeApprove` method, however that method fails if account have remaining allowed tokens.

##### Recommendation
We suggest to reset approval calling
```soldity
ERC20(token).safeApprove(recipient, 0);
```
before setting new approval

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/b57608a17549897d52ba1b66d45496a4f0c018a7


#### 8. Budget payment blocking
##### Description
In `pay` function of `Budget.sol` contract defined at https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/Budget.sol#L109 contract sends ETH to recipients in loop using `transfer` method. As we know `transfer` method limited by 2300 gas, so any single recipient with payable fallback method can block whole `pay` function execution

##### Recommendation
We recommend to rework payment scheme to claimable model.

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/c131f5dacf02ff8b6008c4da7788b71d86b26427
##### Client's commentary
This contract is used for disposition of funds to oracles, according to the list, approved by community. The possibility of using the bug is minimal, however we re-wrote the contract so that takeoff is made by the oracles. 

### WARNINGS
#### 1. Potential integer overflow
##### Description
At the line https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/Investment.sol#L147 contract potentially can catch integer overflow in case if `cumulative.decimals() > 18`. Since `cumulative` token is not predefined contract we should check actual decimals amount

##### Recommendation
We recommend add check

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/6fbe358e35e3c14279b58dc510de9b3b3a18daae


#### 2. Potential div by zero error
##### Description
At the line https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/Market.sol#L189 contract can catch div by zero if `cumulativePrice` is zero.

##### Recommendation
We recommend add non-zero check

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/6fbe358e35e3c14279b58dc510de9b3b3a18daae


#### 3. Vesting account duplication
##### Description
At the line https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/VestingSplitter.sol#L92 contract change vesting account, however input `accounts` array can contain duplicated accounts.

##### Recommendation
We recommend to introduce duplication check

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/6fbe358e35e3c14279b58dc510de9b3b3a18daae


#### 4. Unchecked vesting contract address
##### Description
At the line https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/VestingSplitter.sol#L111 contract accepts vesting contract address, but there is no sanity checks, so anyone can easily ask this contract to call another contract

##### Recommendation
We recommend add sanity check for vesting contract address

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/6fbe358e35e3c14279b58dc510de9b3b3a18daae


#### 5. Wrong reward calculation of balance < 100
##### Description
At the line https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/VestingSplitter.sol#L126 contract calculate `reward` for account, however that calculation always return zero if `balance < 100`

##### Recommendation
We suggest to perform division after multiplication

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/6fbe358e35e3c14279b58dc510de9b3b3a18daae


#### 6. Missed zero share check
##### Description
At the line https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/ProfitSplitter.sol#L139 contract check that total shares sum including new share less or equal that 100, but never check that new share more that zero, so it's possible to add user with zero share.

##### Recommendation
We suggest to check that share more than 0.

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/6fbe358e35e3c14279b58dc510de9b3b3a18daae


#### 7. Potential custodial asset collateral incorrect signatures
##### Description
This warning is about absent signature correctness checks in Proof data structure in RealAssetDepositaryBalanceView in here: https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/depositary/RealAssetDepositaryBalanceView.sol#L88.

What kind of signatures are these? How do they get formed? Were they formed correctly and how to check that?

##### Recommendation
It is recommended to implement additional signature correctness checks, append comments about the nature of those signatures.

##### Status
No issue


#### 8. Mixed `msg.sender` and `_msgSender()`
##### Description
In some contracts used directly `msg.sender` instead of `_msgSender()`:
- https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/Staking.sol#L173
- https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/StableToken.sol#L12
- etc..

since OZ contract introduce Context based contract, all derived ones should use `_msgSender()`

##### Recommendation
We recommend to replace `msg.sender` to `_msgSender()` 

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/355180f0aca0b29d60d808f761052956b7a3a159


#### 9. Too flexible configuration
##### Description
Provided system have a list of contracts, some of them interact with each others. Contracts have too much implicit restrictions, e.g:
- [`CollateralMarket.sol`](https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/CollateralMarket.sol) requires that depositor should be listed in [`Issuer.sol`](https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/Issuer.sol)
- [`Issuer.sol`](https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/Issuer.sol) have methods to change list of depositors, so which means that in case of any changes depositor should be changes in [`CollateralMarket.sol`](https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/CollateralMarket.sol) at same time.
- Some contracts have flexible access list, that can lead to implicit wrong permissions

Too flexible and implicit configuration can lead to modules/contracts inconsistency. Moreover in some cases it could be fatal.

##### Recommendation
We suggest to strictly define possible invariants to reduce complexity.

##### Status
Acknowledged


#### 10. Potentially wrong-sized access control list
##### Description
This warning is about access list array being returned of a potentially wrong length in here: https://github.com/bondappetit/bondappetit-protocol/tree/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/utils/AccessControl.sol#L44.

It seems the actual purpose of this particular function is to provide a simple copy of the `allowed` array. It does not seem necessary to create a copy which length is bigger than the initial array.

##### Recommendation
It is recommended to provide a simple element-by-element array copy without implicit array size increase.

##### Status
Fixed at https://github.com/bondappetit/bondappetit-protocol/commit/b57608a17549897d52ba1b66d45496a4f0c018a7


### COMMENTS
#### 1. Probably missed input check
##### Description
In `transferETH` function of `Budget.sol` contract defined at https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/Budget.sol#L61 contract sends ETH to `recipient` passed via arguments, however it seems `recipient` should be in `recipients` set, so it seems contract should check that before transfer.

##### Recommendation
We suggest to add particular check 

##### Status
Acknowledged


#### 2. Unneeded calculations
##### Description
At the line https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/Market.sol#L187 contract calculates `product` tokens amount, but line below contract recalculates this variable if `address(productToken) != currency`, so consequently first calculation unneeded because `productDecimals` and `tokenDecimals` are same if `productToken == currency`

##### Recommendation
We suggest to replace calculation with assignment `product = payment`

##### Status
Acknowledged


#### 3. Total shares cache
##### Description
At the line https://github.com/bondappetit/bondappetit-protocol/blob/355180f0aca0b29d60d808f761052956b7a3a159/contracts/profit/ProfitSplitter.sol#L126 contract calculate total shares sum, that information used when we adding new account and can be easily cached to save gas.

##### Recommendation
We recommend to cache current shares sum.

##### Status
Acknowledged


#### 4. Potential collateralization imbalance
##### Description
In function `balance` defined at https://github.com/bondappetit/bondappetit-protocol/blob/88680691fe8d872c5fc26e9500d19cf7caaa9861/contracts/depositary/StableTokenDepositaryBalanceView.sol#L81 contract aggregates balances through different tokens, so function return sum of collateral assets. However, as we known price of some stable coins can be changed(especially algorithmic stable coins), so we can't simply calculate sum of tokens to get real assets value.

##### Recommendation
We recommend to use oracles to fetch real assets price

##### Status
No issue

##### Client's commentary
There's no vulnerability here as we accept definite stable coins within this contract and they are assimilated 1:1 to our tokens.


#### 5. Runtime-configured contract ownership
##### Description
This comment is about very implicit runtime-configured contract ownership instead of explicit `Ownable`-alike constructions. Such an architecture makes the ownership deploy configuration-dependent, which is being hard to check after the deployment in comparison to simple code check.

##### Recommendation
It is recommended to either switch to the explicit ownership with `Ownable`, or to explicitly describe deployment params and the way to check them for everyone.

##### Status
Acknowledged


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR | 8
WARNING | 10
COMMENT | 5

Final commit identifier with all fixes: `c131f5dacf02ff8b6008c4da7788b71d86b26427`

### Executive summary
Audited scope includes contract which are the part of protocol that issue stable coins collateralized by a different assets such as stable coins and real world assets. System can be separated to several modules:
- stable coin - module that operates with different collaterals and issues stable coins
- governance - module that provide governance mechanism managed by governance token
- "periphery" - meta-module that includes different helper contracts

### Conclusion
Smart contracts have been audited and several suspicious places were found. During audit 8 major issues were identified as they could lead to some undesired behavior also several issues were marked as warning and comments. After working on audit report all issues were fixed or acknowledged(if issue is not critical or major) by client.
