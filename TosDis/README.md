# TosDis Smart Contract Audit (merged)
###### tags: `TosDis`

## Introduction

### Project overview

[TosDis](https://tosdis.finance) is a p2p lending platform that runs on Ethereum-based Smart Contracts to create a safe and efficient environment where borrowers worldwide have fast and convenient access to loans, and lenders can find high-yield investment opportunities.


### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/tosdis/TosDisFinance/tree/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/FeeToken.sol,
https://github.com/tosdis/TosDisFinance/tree/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/StakeMaster.sol,
https://github.com/tosdis/TosDisFinance/tree/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/StakingPool.sol,
https://github.com/tosdis/TosDisFinance/tree/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/ERC20Basic.sol.

The audited commit identifier is `be50dbf8a52a8f919694498bf30394d328d88fbb`

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


#### 1. Wrongly increased `participants` amount
##### Description
At line https://github.com/tosdis/TosDisFinance/blob/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/StakingPool.sol#L120 contract increases participants amount, that happens if `user.amount` is zero, however if user will provide zero `_amountToStake` `participants` also will increased. So somebody can increase `participants` infinitely by calling `stakeTokens` with zero stake.

##### Recommendation
We recommend increase `participants` only if `_amountToStake` not zero

##### Status
Fixed at https://github.com/tosdis/TosDisFinance/commit/2e4aad91a77318a1134fa1562031f9634b46e705




#### 2. Potentially differentiating message senders
##### Description
This warning is about inconsistent message sender address source (`msg.sender` and `_msgSender()`) usage in here: https://github.com/tosdis/TosDisFinance/tree/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/FeeToken.sol#L37, https://github.com/tosdis/TosDisFinance/tree/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/FeeToken.sol#L39, https://github.com/tosdis/TosDisFinance/tree/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/FeeToken.sol#L40.

This can lead to the incorrect message sender address choice in case, for example, particular function call was a relayed call or meta-transaction-related call.

##### Recommendation
It is recommended to switch to some particular message sender address retrieval method to avoid double-ownership (or misownership). In particular, using `AccessContolList` is better to choose `_mseSender()`.

##### Status
Fixed at https://github.com/tosdis/TosDisFinance/commit/2e4aad91a77318a1134fa1562031f9634b46e705




### WARNINGS

#### 1. Non-explicit multiplier computation checks
##### Description
This warning is about potentially faulty implicit checks in `getMultiplier`
function in here: https://github.com/tosdis/TosDisFinance/tree/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/StakingPool.sol#L66.

This function seems to suppose to always return some valid value (even if particular input arguments are not valid), and business logic implicitly supposes that as well. Unfortunately, `getMultiplier` function returns valid value `0` in case `_from` and `_to` arguments are incorrect in relation to `finishBlock` variable, but does not return any valid value in case `_from` and `_to` arguments are incorrect among themselves. This can lead to the business logic implicitly assuming `getMultiplier` functions always returns something valid failure, for example, in here: https://github.com/tosdis/TosDisFinance/tree/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/StakingPool.sol#L104.

##### Recommendation
It is recommended to either consider `getMultiplier` function returning valid values for every case (`0` for all the incorrect arguments cases for example), or refactor the application logic to support this function unwinding.

##### Status
Fixed at https://github.com/tosdis/TosDisFinance/commit/2e4aad91a77318a1134fa1562031f9634b46e705




#### 2. Keep invariant `burnPercent <= divider`
##### Description
According logic at line https://github.com/tosdis/TosDisFinance/blob/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/StakeMaster.sol#L75 `burnPercent` should be less or equal than `divider`, but in contract that invariant never checked

##### Recommendation
We recommend add particular check

##### Status
Fixed at https://github.com/tosdis/TosDisFinance/commit/2e4aad91a77318a1134fa1562031f9634b46e705




#### 3. Restrict deflationary tokens
##### Description
At line https://github.com/tosdis/TosDisFinance/blob/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/StakingPool.sol#L124 contract receives token by `safeTransferFrom`, and increases `user.amount` by `_amountToStake`, however that approach doesn't work with deflationary tokens because in that case real received amount will be less than requested. That will break the whole logic of contract if somebody creates pool with deflationary token.

##### Recommendation
We recommend to support such tokens or restrict contract usage with them

##### Status
Acknowledged

##### Client's commentary
We'll add notice to UI that deflationary and rebase tokens are not supported.


### COMMENTS

#### 1. Misleading docs
##### Description
This comment is about misleading documentation mentioning there is a
`PAUSER_ROLE` (and there is no such a role in this particular case) in here: https://github.com/tosdis/TosDisFinance/tree/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/FeeToken.sol#L27.

##### Recommendation
It is recommended to remove misleading description.

##### Status
Fixed at https://github.com/tosdis/TosDisFinance/commit/2e4aad91a77318a1134fa1562031f9634b46e705




#### 2. Unrestricted emergency withdrawal
##### Description
This comment is about unrestricted emergency withdrawal function in here: https://github.com/tosdis/TosDisFinance/tree/be50dbf8a52a8f919694498bf30394d328d88fbb/StakeMaster/contracts/StakingPool.sol#L170 being possible to be called anytime with burning all the rewards being earned. 

##### Recommendation
Since it seems to be fine to make user reponsible to choose, to call the function retrieving staked funds with or without rewards being taken care of, more appropriate solution seems to be to introduce a so-called "Emergency mode" (with introducing a function modifier to check if that emergency has happened), initiated by some governance members. Probably only in case of emergency such a reward-burning withdrawal should be available.

##### Status
Acknowledged




## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR | 2
WARNING | 3
COMMENT | 2

### Executive summary
The audited scope implements custom-token staking pools creation and management. Such staking pools are fixed-supply pools and distribute the reward according to the amount of time the particular participant had it's funds staked. Fees for pool management are being payed in deflationary token.

### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit two issues were marked as major because they could lead to some undesired behavior, also several warnings and comments were found and discussed with the client. After working on the reported findings all of them were resolved or acknowledged (if the problem was not critical). So, the contracts are assumed as secure to use according to our security criteria. Final commit identifier with all fixes: `2e4aad91a77318a1134fa1562031f9634b46e705`.