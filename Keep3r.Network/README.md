# Staking Rewards Security Audit Report (merged)

###### tags: `Yearn`

## Introduction

### Project overview
Keep3r Network is a decentralized keeper network for projects that need external devops and for external teams to find keeper jobs.

StakingRewardsV3 allows liquidity providers of the Uniswap V3 pools deposit their NFT (which represents active position in pool) via `deposit()` function. After that users can wait some time to accumulate rewards on their NFT and return token via `withdraw()` function. Accumulated rewards can be gotten from StakingRewardsV3 smart contract via `getRewards()` function. It is necessary to mention that when users deposit their NFT to contract, fees, accumulated on their NFT, go to contract owner. In exchange users can get special reward token from contract.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol
The audited commit identifier is `13ecc6966ae1a413f62224382bfd4d64b1a22351`

## Security Assessment Methodology

A group of auditors is involved in the work on the audit who check the provided source code independently of each other in accordance with the methodology described below:

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
* Checking with static analyzers (i.e. Slither, Mythril, etc.).

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
* Additional verification of the entire initial project scope and code base.

```
Stage goal:
Preparation of the final code version with all the fixes and additional re-check
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
#### 1. Impossible withdraw for smart contract
##### Description
If any smart contract deposits NFT to StakingRewardsV3 it must have `onERC721Received()` function or `withdraw()` will always revert:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L256
##### Recommendation
We recommend to use `transferFrom()` instead of `safeTransferFrom()`.
##### Status
Fixed at https://github.com/keep3r-network/StakingRewardsV3/commit/7ba64a6c537b83690785ee740ebc0beb4f154811


#### 2. Incorrect update of `totalLiquidity`
##### Description
If user calls `deposit()` -> `withdraw()` -> `getReward()` then contract will incorrectly calculate `totalLiquidity` which will lead to incorrect calculations of rewards for users:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L342
##### Recommendation
We recommend to change the logic of `update` modificator, so that`totalLiquidity` would update only if NFT is possessed to this contract.
##### Status
Fixed at https://github.com/keep3r-network/StakingRewardsV3/commit/7ba64a6c537b83690785ee740ebc0beb4f154811


### MAJOR
#### 1. Incorrect calculation of `rewardPerLiquidity`
##### Description
If the first user deposits NFT after some time from `notify()` call, then `(lastTimeRewardApplicable() - lastUpdateTime)` always will be less than `DURATION` which leads to freezing some funds on the contract:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L156
##### Recommendation
We recommend to change the calculation of `rewardPerLiquidity`.
##### Status
Acknowledged
##### Client's commentary
Acceptable as it only locks rewards, not user funds

#### 2. Possible ddos attack
##### Description
Malicious user can front run `withdraw()` function to change the current price in pool, so user can lost all his rewards:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L195
##### Recommendation
We recommend to get an average price for this check.
##### Status
Fixed at https://github.com/keep3r-network/StakingRewardsV3/commit/7ba64a6c537b83690785ee740ebc0beb4f154811


### WARNINGS
#### 1. Addresses not checked
##### Description
Input addresses are not checked:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L139
##### Recommendation
We recommend to add a check that input addresses are not equal to zero address.
##### Status
Acknowledged


#### 2. Impossible situation
##### Description
`_index >= _length` can't be `true`:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L236
##### Recommendation
We recommend to call `revert` if `_index >= _length` is equal to `true`.
##### Status
Acknowledged


#### 3. `_lastUpdateTime` can be equal to zero
##### Description
`_lastUpdateTime` can be equal to zero if user deposits NFT before the first call of `notify`:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L337
##### Recommendation
We recommend to add a check that user can't deposit before the first call of `notify`.
##### Status
Acknowledged


#### 4. Input parameters in `notify()` not checked
##### Description
`notify()` can be called with `amount` equal to zero:
https://github.com/keep3r-network/StakingRewardsV3/blob/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L299
##### Recommendation
It is recommended to add `require(amount > 0, "Incorrect input data")` in function `notify()`.
##### Status
Acknowledged


### COMMENTS
#### 1. Function not used
##### Description
Function `max()` is not used in the contract:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L9
##### Recommendation
We recommend to remove this function.
##### Status
Acknowledged


#### 2. Not enough comments
##### Description
All storage variables don't have comments, so it is harder to understand the code:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L99
##### Recommendation
We recommend to add comments for all storage variables.
##### Status
Acknowledged


#### 3. Visibility not set
##### Description
Visibility is not set explicitly for some storage variables:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L102
##### Recommendation
We recommend to explicitly set visibility for all storage variables.
##### Status
Acknowledged


#### 4. `nonReentrant` modificator not used
##### Description
All functions which can be called by user don't have `nonReentrant` modificator:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L208
##### Recommendation
We recommend to add the `nonReentrant` modificator for each function which can be called by user (`deposit()`, `withdraw()`, `getRewards()`) to increase security of the contract.
##### Status
Acknowledged


#### 5. `require` without message
##### Description
Here `require` does not use the message, so it is impossible to distinguish them:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L211
https://github.com/keep3r-network/StakingRewardsV3/blob/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L250
https://github.com/keep3r-network/StakingRewardsV3/blob/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L300
##### Recommendation
We recommend to add the message to `require`.
##### Status
Acknowledged


#### 6. Meaningless function
##### Description
Meaning of this function is unclear, because it only calls `notify()` with weird check of unused parameter:
https://github.com/keep3r-network/StakingRewardsV3/tree/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L294
##### Recommendation
We recommend to remove this function.
##### Status
No issue
##### Client's commentary
This function is added for compatibility with another already deployed contract, GaugeProxy

#### 7. Rewrite `withdraw()` for saving gas
##### Description
In `withdraw()` function each call of the `withdraw(_tokens[i])` would trigger call of the `update` modificator:
https://github.com/keep3r-network/StakingRewardsV3/blob/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L287
##### Recommendation
It is recommended to rewrite `withdraw()` function for saving some gas.
##### Status
Acknowledged


#### 8. Changing the contract owner is not possible
##### Description
The `owner` parameter has the modificator `immutable` that locks any modifications after `constructor()` is called.
https://github.com/keep3r-network/StakingRewardsV3/blob/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L116
##### Recommendation
It's not necessary, but we recommend to add the owner changing function.
##### Status
Fixed at https://github.com/keep3r-network/StakingRewardsV3/commit/7ba64a6c537b83690785ee740ebc0beb4f154811
##### Client's commentary
Switched to use setGov/acceptGov in latest commits

#### 9. Some gas save in `getRewards()` function
##### Description
Inside the loop of the `getRewards` call there is a call of the `getReward` function. This function has `update` modifier that updates state variables every time.
https://github.com/keep3r-network/StakingRewardsV3/blob/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L264
It's ok if we make single call `getReward(tokenId)` in transaction, but few calls in the loop will do the same things many times. Actually we need to run this code only once.
##### Recommendation
We recommend to refactor function `getRewards()` for getting away of unnecessary and repeatting state modification in the loop.
##### Status 
Acknowledged


#### 10. Get rewards on withdraw
##### Description
User has to make the second call of `getReward` before or after `withdraw(tokenId)`:
https://github.com/keep3r-network/StakingRewardsV3/blob/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L257
##### Recommendation
We recommend to add `getReward(tokenId)` inside `_withdraw(tokenId)`.
##### Status
No issue
##### Client's commentary
Withdraw excludes getReward in case a situation occurs where rewards can't be claimed.

#### 11. Batch processing in the `collect`
##### Description
The smart contract likely owns multiple `tokenIds` which should be `collect`-ed. We can batch that job to save transaction number and gas:
https://github.com/keep3r-network/StakingRewardsV3/blob/13ecc6966ae1a413f62224382bfd4d64b1a22351/contracts/StakingRewardsV3-1.sol#L159
##### Recommendation
We recommend implementing the `collect` function to take array of `tokenId` as an argument.
##### Status
Fixed at https://github.com/keep3r-network/StakingRewardsV3/commit/7ba64a6c537b83690785ee740ebc0beb4f154811
##### Client's commentary
Implemented in `7ba64a6c537b83690785ee740ebc0beb4f154811`

## Results
Level | Amount
--- | ---
CRITICAL | 2
MAJOR    | 2
WARNING  | 4
COMMENT  | 11

### Conclusion
Smart contract has been audited and several suspicious places have been spotted. During the audit 2 critical issues were found and reported to the client. Two issues were marked as major because they could lead to some undesired behavior, also several warnings and comments were found and discussed with the client. After working on the reported findings all of them were resolved or acknowledged (if the problem was not critical) by the client. 

Final commit identifier with all fixes: `7ba64a6c537b83690785ee740ebc0beb4f154811`