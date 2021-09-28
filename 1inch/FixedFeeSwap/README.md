# FixedFeeSwap Security Audit Report (merged)

###### tags: `1Inch`

## Introduction

### Project overview
1inch is a DeFi aggregator and a decentralized exchange with smart routing. The core protocol connects a large number of decentralized and centralized platforms in order to minimize price slippage and find the optimal trade for the users.



### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/mixbytes/1inch.github.feeswap/blob/ac5dbd4a5e46f501e0a4a728f1725095b11f3fbd/contracts/FixedFeeSwap.sol

The audited commit identifier is `ac5dbd4a5e46f501e0a4a728f1725095b11f3fbd`, `60a36947261bfe8e2914684f74c1ca72060cf3e3`

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



### Security Assessment Methodology

A group of auditors independently verified the code.

Stages of the audit were as follows:

* Project architecture review 
* Checking the code against the checklist of known vulnerabilities
* Checking the code for compliance with the desired security model 
* Consolidation of interim auditor reports into general one
* Bug fixing & re-check
* Preparation of the final audit report

## Report

### CRITICAL
Not found

### MAJOR
Not found

### WARNINGS

#### 1. User can swap without FEE on small amounts
##### Files
https://github.com/mixbytes/1inch.github.feeswap/blob/ac5dbd4a5e46f501e0a4a728f1725095b11f3fbd/contracts/FixedFeeSwap.sol
##### Description
FixedFeeSwap has a method `_swap()` for exchanging tokens (https://github.com/mixbytes/1inch.github.feeswap/blob/ac5dbd4a5e46f501e0a4a728f1725095b11f3fbd/contracts/FixedFeeSwap.sol#L110-L115). `_swap()` takes a comission (https://github.com/mixbytes/1inch.github.feeswap/blob/ac5dbd4a5e46f501e0a4a728f1725095b11f3fbd/contracts/FixedFeeSwap.sol#L46-L48).

But there is another way to exchange tokens via `FFS` tokens. Flow:
```
// FixedFeeSwap has 1USDC, 1USDT

// 1. User deposits 1USDT token
await this.fixedFeeSwap.deposit(ether('0'), ether('1'), { from: userAddress });

// 2. User takes 1FFS tokens
// 3. User withdraw 1FFS
await this.fixedFeeSwap.withdraw(ether('1'), { from: userAddress });

// 4. User swapped part of USDT to USDC
// USDT: -0.666666666666666
// USDC: +0.333333333333334
```

Thus, the user is able to exchange tokens without commission.

##### Recommendation
If you think that these losses are significant for your business logic, we recommend rewriting the logic of `FixedFeeSwap`. 
##### Status
Acknowledged
##### Client's commentary
The `deposit()` function was block for users. 

#### 2. Avoid transfer fee
##### Files 
https://github.com/mixbytes/1inch.github.feeswap/blob/ac5dbd4a5e46f501e0a4a728f1725095b11f3fbd/contracts/FixedFeeSwap.sol
##### Description
Potentially, a token (for examle: USDT) can have a transfer fee. For example, there is ERC20 of USDT in `transfer`/`transferFrom`:
```
balances[_to] = balances[_to].add(sendAmount);
balances[owner] = balances[owner].add(fee);
balances[_from] = balances[_from].sub(_value);
```

Nowadays fee is zero for USDT. But this can change at any moment.

The `FixedFeeSwap` ignores this fee. For example, there is a next flow:
1. User call `deposit` and pass 1USDT. `safeTransferFrom` 'll be called by `FixedFeeSwap` (https://github.com/mixbytes/1inch.github.feeswap/blob/ac5dbd4a5e46f501e0a4a728f1725095b11f3fbd/contracts/FixedFeeSwap.sol#L66).
2. The contract'll get <1USDT (due to fee) but the user'll get 1FFS
3. 1FFS is more than transferred to contract

##### Recommendation
We recommend that you carefully approach the selection of tokens for `FixedFeeSwap`.
##### Status
Acknowledged




### COMMENTS

#### 1. Constants not used
##### Description:
At lines:
https://github.com/mixbytes/1inch.github.feeswap/blob/ac5dbd4a5e46f501e0a4a728f1725095b11f3fbd/contracts/FixedFeeSwap.sol#L19-L20
constants `_DIRECTION_MASK` and ` _AMOUNT_MASK` are not used in the logic of this contract.

##### Recommendation
We recommend removing them. 
##### Status
Fixed at https://github.com/1inch/fixed-fee-swap/blob/60a36947261bfe8e2914684f74c1ca72060cf3e3/contracts/FixedRateSwap.sol


#### 2. Check address is not `FixedFeeSwap`
##### Files
https://github.com/mixbytes/1inch.github.feeswap/blob/ac5dbd4a5e46f501e0a4a728f1725095b11f3fbd/contracts/FixedFeeSwap.sol
##### Description
In `withdrawFor` and `_swap` there aren't checks for `to` variable:
1. https://github.com/mixbytes/1inch.github.feeswap/blob/ac5dbd4a5e46f501e0a4a728f1725095b11f3fbd/contracts/FixedFeeSwap.sol#L110
2. https://github.com/mixbytes/1inch.github.feeswap/blob/ac5dbd4a5e46f501e0a4a728f1725095b11f3fbd/contracts/FixedFeeSwap.sol#L78

If the user mistakenly specifies the address of the contract, then the funds will be lost forever in the contract.

##### Recommendation

We recommend to add the next check in `withdrawFor()`, `_swap()`:
```
require(to != address(this), "to address cannot be FixedFeeSwap");
```
##### Status
Fixed at https://github.com/1inch/fixed-fee-swap/blob/60a36947261bfe8e2914684f74c1ca72060cf3e3/contracts/FixedRateSwap.sol



## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| -
MAJOR   | -
WARNING | 2
COMMENT | 2

### Executive summary

The audited scope implements the simple contract which stores the balances of two tokens and allows exchanges between them at a rate of 1: 1 with a commission dynamically depends on balances. 

### Conclusion
Smart contract has been audited and several suspicious places were found. During audit no critical and major issues were identified.  Several issues were marked as warnings and comments. After working on audit report all issues were fixed or acknowledged by client. Thus, contract is assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `60a36947261bfe8e2914684f74c1ca72060cf3e3`
