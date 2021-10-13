# Governance crosschain bridges Security Audit Report (merged)

###### tags: `Aave`

## Introduction

### Project overview
This scope of contracts contains the crosschain governance bridges used for the aave markets deployed across different networks.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
- https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/BridgeExecutorBase.sol
- https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/ArbitrumBridgeExecutor.sol
- https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/PolygonBridgeExecutor.sol
- https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/interfaces/IBridgeExecutor.sol
- https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/interfaces/IFxMessageProcessor.sol

The audited commit identifier is `7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d`,
`763ef5da8befff3a129443a3ff4ef7ca4d3bb446`


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

#### 1. No validation of the address parameter value in contract constructor
##### Description
The variable is assigned the value of the constructor input parameter. But this parameter is not checked before this. If the value turns out to be zero, then it will be necessary to redeploy the contract, since there is no other functionality to set this variable.

* At the line https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/BridgeExecutorBase.sol#L41 the `_guardian` variable is set to the value of the `guardian` input parameter.
* At the line https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/PolygonBridgeExecutor.sol#L21 the `_fxRootSender` variable is set to the value of the `fxRootSender` input parameter.
* At the line https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/PolygonBridgeExecutor.sol#L22 the `_fxChild` variable is set to the value of the `fxChild` input parameter.
* At the line https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/ArbitrumBridgeExecutor.sol#L18 the `_ethereumGovernanceExecutor` variable is set to the value of the `ethereumGovernanceExecutor` input parameter.

##### Recommendation
It is necessary to add a check of the input parameter to zero before initializing the variables.

##### Status
Acknowledged

##### Client's commentary
I think not validating against the 0 address is an acceptable risk. Worst case, you re-deploy. You can't check for all incorrect addresses.


#### 2. Missing validation on relation
##### Description
At the lines https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/BridgeExecutorBase.sol#L34-L39 are working with the variables `minimumDelay` and `maximumDelay`. But nowhere is there a comparison of these variables with each other.

##### Recommendation
It is recommended to add a check for comparing the values of variables between each other.

##### Status
Acknowledged

##### Client's commentary
While we do not directly compare the min and max delay values, we do compare the delay to both the min and the max. If the min and max did not have an appropriate relationship, there would be no delay value that would satisfy both of these lines 34 and 35 in the BaseBridgeExecutor.


#### 3. The value is assigned to a variable, but not used
##### Description
At the line https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/BridgeExecutorBase.sol#L202 sets the variable `_queuedActions[actionHash]` to `true` when tasks are queued.
At the line https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/BridgeExecutorBase.sol#L269 sets the variable `_queuedActions[actionHash]` to `false` to cancel the job.
But when executed on line https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/BridgeExecutorBase.sol#L235, no validation is made for the `_queuedActions[actionHash]` variable.

##### Recommendation
It is recommended to add a check for the value of the `_queuedActions[actionHash]` variable before executing `delegatecall` and` call`.

##### Status
Acknowledged

##### Client's commentary
We perform the action hash in-order to check that the action is not duplicated prior to queuing the action. This occurs in the isActionQueued check of _queue. On execution, if the entire ActionsSet is queued per the check in line 51, then all of it's actions are inherently queued in _queuedActions. therefore checking the _queuedActions mapping for each action prior to executing would never return false.


### COMMENTS

#### 1. Caching the value will improve the code
##### Description
At the lines https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/BridgeExecutorBase.sol#L176-L183
the calculation of the same value is used many times. But the value of `targets.length` is easier to calculate only once at the very beginning and store it in a variable.
Then work with this variable.

##### Recommendation
It is recommended to optimize the code to use the cached value of the variable.

##### Status
Acknowledged

##### Client's commentary
Agree, this would be marginally more optimal, but we are ok with how it is currently implemented. This also mirrors the implementation in Aave-Governance-v2 that is already deployed


#### 2. Confusing variable name
##### Description
At the line https://github.com/aave/governance-crosschain-bridges/blob/7f56e7ae63f30ba8dcd7ced6a11a34c2eb865a1d/contracts/BridgeExecutorBase.sol#L124, the function is called `getActionsSetState()`. But it is very difficult to understand when in one word there are two different concepts of `get` and` set` at once.
For example, the name `getCurrentState()` will be much clearer.

##### Recommendation
It is recommended to rename this variable.

##### Status
Fixed at https://github.com/aave/governance-crosschain-bridges/commit/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/




## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 0
WARNING | 3
COMMENT | 2


### Executive summary
The smart contracts, examined in this audit, are designed to operate on the Polygon and Arbitrum blockchains. The functionality is designed to work with tasks for calling functions in other contracts. You can queue, execute, or cancel tasks. All tasks are saved in a smart contract.


### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical or major issues were found, several warnings and comments were spotted. After working on the reported findings all of them were either fixed by the client or acknowledged (if the problem was not critical). So, the contracts are assumed as secure to use according to our security criteria.


Final commit identifier with all fixes: `763ef5da8befff3a129443a3ff4ef7ca4d3bb446`