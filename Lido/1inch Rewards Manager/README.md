# Lido 1inch Rewards Manager Interim Security Audit Report (merged)

###### tags: `LIDO`

## Introduction

### Project overview

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
- https://github.com/lidofinance/1inch-rewards-manager/blob/c2cd9665666deda9452fa9e3461fbf3537413945/contracts/RewardsManager.vy

The audited commit identifier is `c2cd9665666deda9452fa9e3461fbf3537413945`

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

Not found

### MAJOR

Not found


### WARNINGS

#### 1. No check of the address parameter for zero
##### Description
At line https://github.com/lidofinance/1inch-rewards-manager/blob/c2cd9665666deda9452fa9e3461fbf3537413945/contracts/RewardsManager.vy#L66, the `owner` variable is assigned the value of the `_to` parameter. 
But, if by chance the value of the parameter turns out to be equal to zero, then the work of the following functions will be blocked:
`set_rewards_period_duration()`, `recover_erc20()`.

##### Recommendation
It is recommended to add a check for the variable `_to` for zero before line 66.

##### Status
Acknowledged
##### Client's commentary
> Acknowledged. Since the contract has already been deployed and is not supposed to be transferred to another owner, we consider this risk eliminated, with no changes planned.


#### 2. No logging of important events
##### Description
Logging important actions makes it easier to maintain the project.
But in this smart contract it is not done for some important events.
At lines https://github.com/lidofinance/1inch-rewards-manager/blob/c2cd9665666deda9452fa9e3461fbf3537413945/contracts/RewardsManager.vy#L100-L120 for the `start_next_rewards_period()` external function this event logging is lacking.
At lines https://github.com/lidofinance/1inch-rewards-manager/blob/c2cd9665666deda9452fa9e3461fbf3537413945/contracts/RewardsManager.vy#L124-L131 for the external function `set_rewards_period_duration()` this event is not logged.

##### Recommendation
It is recommended to add logging of important events.

##### Status
Acknowledged
##### Client's commentary
> Acknowledged. Since rewards manager is a minor utility contract we don't expect these events to be listened to, they are also covered in the FarmingRewards contract.


### COMMENTS

#### 1. No setter for the address of the interacting contract
##### Description
At line https://github.com/lidofinance/1inch-rewards-manager/blob/c2cd9665666deda9452fa9e3461fbf3537413945/contracts/RewardsManager.vy#L39 the `rewards_contract` variable is described.
This is the address of the `FarmingRewards` contract. Now there is no way to change its address. If new functionality is added to this contract, it will be necessary to reinstall the `RewardsManager` contract.

##### Recommendation
It is recommended to add a method to change the value of the variable `rewards_contract`.

##### Status
Acknowledged
##### Client's commentary
> We consider this to be no issue, the behavior described is expected. In case of any significant farming program changes, the rewards manager is supposed to be redeployed.


#### 2. Test scripts problem
##### Description
This problem is not in the audit scope.
The following two tests do not work correctly:
`test_owner_recovers_erc20_to_own_address` and `test_owner_recovers_erc20_zero_amount`.

##### Recommendation
It is recommended to fix the tests.

##### Status
Acknowledged
##### Client's commentary
> Acknowledged. The contract has been deployed already, no fix will be done for this issue.


## Results

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 0
WARNING | 2
COMMENT | 2

### Executive summary
The smart contract reviewed in this audit is designed to be a mediator contract between LIDO’s DAO voting and 1INCH reward farming facility. The main problem is that LIDO uses DAO votings to allocate tokens for rewards. Making a direct transfer from the DAO to the reward contract is not an option. The `RewardsManager` contract is used to calculate the time to start the voting in order to make it passed exactly by the end of the previous reward period. 

This smart contract has the following main functions:
- `start_next_rewards_period()` - starts the next rewards via calling `FarmingRewards.notifyRewardAmount()` and transferring `ldo_token.balanceOf(self)` tokens to `FarmingRewards`. The `FarmingRewards` contract handles all the rest on its own. The current rewards period must be finished by this time. First period could be started only by `self.rewards_initializer`. It can only be called by somebody.
- `recover_erc20()` - transfers the given _amount of the given ERC20 token from itself to the recipient. It can only be called by the owner.
- `transfer_ownership()` - changes the contract owner. It can only be called by the current owner.
- `set_rewards_period_duration()` - updates period duration. It can only be called by the owner.
- `period_finish()` - shows the end date of the voting period.
- `is_rewards_period_finished()` - shows whether the current rewards period has finished.


### Conclusion
During the audit no critical issues were found, several  warnings and comments were spotted. After working on the reported findings all of them were acknowledged.

Final commit identifier with all fixes: `c2cd9665666deda9452fa9e3461fbf3537413945`