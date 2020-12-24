# 1Inch Token Smart Contracts Audit

![](MixBytes.png)

###### tags: `1Inch`

## Introduction

### General Provisions
1inch is a DeFi aggregator and a decentralized exchange with smart routing. The core protocol connects a large number of decentralized and centralized platforms in order to minimize price slippage and find the optimal trade for the users. 1inch platform provides a variety of features in addition to swaps. Users can trade via limit orders, deposit funds into lending protocols, move coins between different liquidity pools, and this list expands constantly.

### Scope of the Audit

The scope of the audit includes the following smart contracts at:
- https://github.com/1inch-exchange/1inch-token/blob/99fd056f91005ca521a02a005f7bcd8f77e06afc/contracts/ERC20Permit.sol
- https://github.com/1inch-exchange/1inch-token/blob/99fd056f91005ca521a02a005f7bcd8f77e06afc/contracts/OneInch.sol
- https://github.com/1inch-exchange/1inch-token/blob/99fd056f91005ca521a02a005f7bcd8f77e06afc/contracts/ECDSA.sol
- https://github.com/1inch-exchange/1inch-token/blob/99fd056f91005ca521a02a005f7bcd8f77e06afc/contracts/EIP712.sol
- https://github.com/1inch-exchange/1inch-token/blob/99fd056f91005ca521a02a005f7bcd8f77e06afc/contracts/IERC20Permit.sol

The audited commit identifier: `99fd056f91005ca521a02a005f7bcd8f77e06afc`

### Executive summary
The audited contract is a standard ERC-20 token with an additional `permit` method that implements EIP-712. This improvement allows users to sign allowance for token spending without a transaction. In other words, a spender can issue a signed allowance and provide it by an off-chain to another spender or any other user, then this allowance can be applied without the participation of the original sender and it will not spend any gas from his account.

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

#### 1. Potential front running attack or losing of allowance

##### Description
At the line https://github.com/1inch-exchange/1inch-token/blob/99fd056f91005ca521a02a005f7bcd8f77e06afc/contracts/ERC20Permit.sol#L53 `_approve` method replaces the allowance, so there are two potential problems here:
1. If a signer wants to increase the allowance from `A` to `B`, a receiver may withdraw `A+B` using the front-running attack.
2. If a signer wants to send `A` and `B`, but a receiver forgot to withdraw `A`, the receiver will lose ability to withdraw `A`.

##### Recommendation
We suggest to add `permitIncrease`, `permitDecrease` methods and use it instead of the `permit`.

##### Status
Acknowledged


### COMMENTS

#### 1. Mismatch of argument name in `_PERMIT_TYPEHASH` and `permit` function

##### Description
At the line https://github.com/1inch-exchange/1inch-token/blob/99fd056f91005ca521a02a005f7bcd8f77e06afc/contracts/ERC20Permit.sol#L27 the `value` argument is used but at the line https://github.com/1inch-exchange/1inch-token/blob/99fd056f91005ca521a02a005f7bcd8f77e06afc/contracts/ERC20Permit.sol#L32 the argument name is `amount`.

##### Recommendation
We suggest to rename `amount` to `value` in the `permit` function.

##### Status
Fixed at https://github.com/1inch-exchange/1inch-token/commit/5332caa9b91403a022e74b49c9d0fc9c6d5419f4

##### Client's commentary
Created PR at OpenZeppelin's repo: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/2445

## CONCLUSION

The smart contract has been audited and no critical and major issues have been found. The contract massively uses libraries from a widely known OpenZeppelin set of contracts which are safe and of high quality. All spotted issues are minor and the contract itself assumed as safe to use according to our security criteria.

For the following files from the scope only consistency with their original copies from openzeppelin repository is checked (used commit: `ecc66719bd7681ed4eb8bf406f89a7408569ba9b`):
- https://github.com/1inch-exchange/1inch-token/blob/99fd056f91005ca521a02a005f7bcd8f77e06afc/contracts/ECDSA.sol
- https://github.com/1inch-exchange/1inch-token/blob/99fd056f91005ca521a02a005f7bcd8f77e06afc/contracts/EIP712.sol
- https://github.com/1inch-exchange/1inch-token/blob/99fd056f91005ca521a02a005f7bcd8f77e06afc/contracts/IERC20Permit.sol

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR | -
WARNING | 1
COMMENT | 1

Final commit identifier with all fixes: `5332caa9b91403a022e74b49c9d0fc9c6d5419f4`

