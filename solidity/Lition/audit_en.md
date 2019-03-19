![](MixBytes.png)

# Audit of Lition Token Smart Contracts

## Introduction

### General Provisions

The Lition team asked [MixBytes](https://mixbytes.io) to audit their token and vesting smart contracts. The code was located in the following github repository: https://github.com/lition-blockchain/token.

### Scope of the Audit

The scope of the audit are token smart contract https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol and smart contracts at https://github.com/lition-blockchain/token/tree/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting. Audited commit is 7b03a57a51a8e5cc16112ebced31216ce486480e.

**Important note:** we will not be able to assess the correctness of the implementation of all Lition sale mechanics and features since the scope of the audit is limited by the client.


## Security Assessment Principles

### Classification of Issues

* CRITICAL: Bugs that enable theft of ether/tokens, lock access to funds without possibility to restore it, or lead to any other loss of ether/tokens to be transferred to any party (for example, dividends).

* MAJOR: Bugs that can trigger a contract failure, with further recovery only possible through manual modification of the contract state or contract replacement altogether.

* WARNINGS: Bugs that can break the intended contract logic or enable a DoS attack on the contract.

* COMMENTS: All other issues and recommendations.

### Security Assessment Methodology

The audit was performed with triple redundancy by three auditors.

Stages of the audit were as follows:

* “Blind” manual check of the code and model behind the code
* “Guided” manual check of the code
* Check of adherence of the code to requirements of the client
* Automated security analysis using internal solidity security checker
* Automated security analysis using public analysers
* Manual by-checklist inspection of the system
* Discussion and merge of independent audit results
* Report execution


## Detected Issues

### CRITICAL

1.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L199

In the first condition `bonusAmount` will always equal 0. Most likely, this conditional operator is used to provide the invariant `hodlPremiumMinted <= hodlPremiumCap`. However, due to an incorrect condition, this invariant may be broken and `hodlPremiumMinted` will exceed `hodlPremiumCap` when executing the `else` branch. As a result, tokens can be generated in excess of the `hodlPremiumCap` limit.
The `bonusAmount` should be calculated prior to `if` conditional. Alternatively, we recommend defining the `min` function and rewriting the code as follows:

```solidity
bonusAmount = min(hodlPremiumCap.sub(hodlPremiumMinted)
, bonusPeriod.mul(amount).div(maxBonusDuration).mul(25).div(100));
hodlPremiumMinted = hodlPremiumMinted.add(bonusAmount);
```

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*

2.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L168

Unlike `transfer`, in case of the `transferFrom` function, the bonus amount will be calculated without taking into account `hodlPremium`. This may result in a bonus bigger than the required amount. We recommend calculating `amountForBonusCalculation` and `bonus` as in lines 130, 131.

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*

3.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L174

The bonus will be awarded to the initiator of `transferFrom` (`msg.sender`), although it is likely to be sent to the address `_from`. It seems that the `transferFrom` function was created basing on `transfer`, and, as is often happens in such cases, important corrections were forgotten. We recommend refactoring the common code of these functions into a separate private function and make sure `msg.sender` is not used directly.

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*


### MAJOR

1.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L215

Most likely, `hodlPremium[beneficiary].tokens` should be used instead `hodlPremium[msg.sender].tokens` (as it is `hodlPremium[beneficiary].tokens` that is used in the conditional).

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*


### WARNING

1.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L87

The boolean `transferFrom` function call result, that serves as a token transfer success or failure indicator, is not processed. Most likely, in case of token transfer failure the transaction should be rolled back, i.e. call result should be wrapped with the `require` function. In case of failure many tokens usually roll back the transaction instead of returning `false`, however, we should not fully rely on that.

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*

2.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L180

This line and the one below handle `buybackRegistry[msg.sender]`, although we should rather work with `buybackRegistry[_from]` because it is the `_from` token balance that decreases during `transferFrom` function call.

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*

3.In lines 136 (https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L136) and line 174 https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L174 there is no check that new token emission amount won’t exceed the `maxTokenSupply` limit https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/MintableAndPausableToken.sol#L9. External measures might be taken to avoid such excess, however we recommend adding an explicit check.

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*

4.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L129

The following attack vector is possible:

The attacker receives a record of his tokens in `hodlPremium` in a standard way during the `sethodlPremium` function call initiated by the contract owner (for example, in the course of the sale). 

`hodlPremiumMinted` reaches the `hodlPremiumCap` limit before the attacker receives any bonuses.

The attacker withdraws his tokens by calling `transfer` (and, for example, selling). However, his record in `hodlPremium` remains since the conditional operator body in line 129 will not be executed.

For one reason or another, contract owners are raising `hodlPremiumCap`.

Over time, the attacker will be able to buy tokens, send them to his balance, and then immediately withdraw and sell. As a result, the code block in line 129 will be executed (since `hodlPremiumMinted` is now less than` hodlPremiumCap`), and the attacker will receive a bonus for HODL though, in fact, he did not own tokens for the required time, i.e. he will receive an undeserved 25% bonus of his tokens.

The similar issue is present here https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L167.
To prevent such kind of attacks, you should either prohibit the `hodlPremiumCap` increase or always update `hodlPremium` when the user withdraws tokens.

*Fixed in [55acfbb](https://github.com/lition-blockchain/token/commit/55acfbb00d6b5a07a45ab25019742872b65b981d)*

5.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/SeedPrivateAdvisorVesting.sol#L88

It is dangerous to assume by default that `_user` equals `User.Advisor`. In case of incorrect input values, for example, if the `user` value was not passed at all (and therefore equals 0), the code will ignore this error. On the contrary, the code will create a deliberately incorrect record in this case.
We recommend explicit checking `_user` for a match with` User.Advisor` as it was done in previous conditionals. And by default, i.e. for all other values, roll back the transaction using `revert ()`.

A similar issue is also present here
https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/Vesting.sol#L82 and here https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/Vesting.sol#L54.

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*

6.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/Vesting.sol#L74

If a second call of ` initializeVesting` with a different `user` value is made for the same `_beneficiary`, the `_beneficiary` tokens recorded during the first call will be hidden and  become unavailable in` claimTokens`.
We recommend disabling  `userCategory` changes or providing access to tokens in other categories.

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*

7.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/SeedPrivateAdvisorVesting.sol#L17

According to the site data, this value should be `176 * 0.16 = 28.16` million tokens.

*The code corresponds to the sale [update](https://medium.com/lition-blog/update-litions-token-sale-summarized-9e95fa8a6e58)*

8.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/SeedPrivateAdvisorVesting.sol#L19

According to the site data, this value should be `176 * 0.04 = 7.04` million tokens.

*The code corresponds to the sale [update](https://medium.com/lition-blog/update-litions-token-sale-summarized-9e95fa8a6e58)*

9.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/CommunityVesting.sol#L15

According to the site data, this value should be `176 * 0.08 = 14.08` million tokens.

*The code corresponds to the sale [update](https://medium.com/lition-blog/update-litions-token-sale-summarized-9e95fa8a6e58)*

10.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/EcosystemVesting.sol#L14

According to the site data, this value should be `176 * 0.31 = 54.56`  million tokens.

*The code corresponds to the sale [update](https://medium.com/lition-blog/update-litions-token-sale-summarized-9e95fa8a6e58)*

11.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/TeamVesting.sol#L15

According to the site data, this value should be `176 * 0.07 = 12.32`   million tokens.

*The code corresponds to the sale [update](https://medium.com/lition-blog/update-litions-token-sale-summarized-9e95fa8a6e58)*

12.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/CommunityVesting.sol#L57

And also here https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/CommunityVesting.sol#L59 the comments in the code do not match logic of the code since the release interval is 90 days. Likely, there are errors in the comments, although there could be an error in the code.

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*

13.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L74

Why are the methods `signUpForRefund` and `refund` located in the token smart contract even though they don't interact with the token balances?

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*

14.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L78

A user can claim any amount to refund here.

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*

15. Are values of `buybackRegistry` mapping nominated in DAI?

We see here https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L87 the value is interpreted as DAI, though here as tokens https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L150.

*Fixed as of [efcce93](https://github.com/lition-blockchain/token/tree/efcce939bf9aabade21394ac3a3bdd9bae6f84e7)*

16.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L8

Method `burn` is `onlyOwner`, however `burnFrom` inherited from `ERC20Burnable` is available to everyone.

*Fixed in [58f86d3](https://github.com/lition-blockchain/token/commit/58f86d3ee34d7e99b79cfb54046760a059cd39a7)*


### COMMENT

1.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L65 

We suggest checking that:
- `setRefundSignupDetails` can be successfully called once
- `_endTime` is more than `_startTime`
- `refundWindowStart` is more or equals to `signupWindowEnd`

2.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L30

We recommend using `IERC20` interface as a token pointer instead of a particular `ERC20`implementation, not to violate abstraction.

3.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L76
Hereinafter, we recommend using `require` instead of `assert` to control user inputs. Since ʻassert` is used with a special purpose - to control the code self-consistency - it should never be called in case of correct code operation. Also, unlike `require`, it consumes all the transaction gas.

4.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L116

Mind that when adding tokens to those already available in `hodlPremium`, their `contributionTime` remains the same. This might be pre-planned, but at least the `contributionTime` value of the `HodlPremiumSet` event in line 116 may be false. This happens because it is taken from the function parameter, whereas tokens will receive a `contributionTime` equal to the previously defined `hodlPremium [beneficiary] .contributionTime`.

5.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/SeedPrivateAdvisorVesting.sol#L101

When updating `holdings`, it is not checked that the `user` corresponds to `holdings[_beneficiary].user` (i.e. that the ` _beneficiary` status has not changed). We recommend adding this check to prevent potential errors.

6.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/Vesting.sol#L48

Here and further on, we advise that corresponding `enum` values are used ​​instead of numbers.

7.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/vesting/Vesting.sol#L20

We suggest enabling the contract owner to withdraw the excessive amount of tokens from the contract balance. The required number of tokens can be calculated by summing all the `_tokens` during the `initializeVesting` calls and subtracting all the `tokensToClaim` sent during the `claimTokens` calls. This feature is useful in case of an erroneous transfer of tokens to the `Vesting` contract balance. 

8.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L50 

We suggest using `mul` function which is a part of `SafeMath` library to prevent potential overflow.

9.https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L143 and https://github.com/lition-blockchain/token/blob/7b03a57a51a8e5cc16112ebced31216ce486480e/token/Token.sol#L179

The corresponding base contract methods are called differently in case of `transfer` and `transferFrom`: directly in the first case and via `super` in the second case. We suggest using `super` in both cases.

10.https://github.com/lition-blockchain/token/blob/e255447e543011df709c4fb3fc4a7ea6ce45588d/contracts/vesting/CommunityVesting.sol#L46

The `claimTokens` methods in this contract and some others employ complicated logic to calculate the token amounts. We suggest adding `assert`s to check self-consistency of the code, e.g. `assert(25 <= percentage && percentage <= 75);`.

11. We have not found unit tests in the code repository. We highly recommend performing thorough unit testing of the code especially the token code.

12. We see some parts of the code were copied and modified. The before-mentioned approach is a typical source of problems. We suggest employing base contracts or internal helper functions which generalize similar code fragments.


## CONCLUSION

We detected and suggested fixes to some problems of different severity. We recommended addressing them and performing thorough unit testing before the code deployment. External actions of the contract owner will mitigate some of the warnings. As of commit [58f86d3](https://github.com/lition-blockchain/token/commit/58f86d3ee34d7e99b79cfb54046760a059cd39a7), all major flaws were fixed.

