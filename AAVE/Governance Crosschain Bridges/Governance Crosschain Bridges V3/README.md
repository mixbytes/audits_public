# Crosschain bridges Security Audit Report (merged)

###### tags: `Aave`

## Introduction

### Project overview
This scope of contracts contains the crosschain governance bridges to be used by the Aave Governance to control other Aave ecosystem deployments across different networks.

### Scope of the Audit

The scope of the audit includes the following smart contracts at:

- https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/BridgeExecutorBase.sol
- https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/PolygonBridgeExecutor.sol
- https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/interfaces/IBridgeExecutor.sol
- https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/interfaces/IFxMessageProcessor.sol
- https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/dependencies/utilities/SafeMath.sol

The audited commit identifier is `9fd0609a2e14d546885f76211961f251d2e15cb9`,
`0eb2a492e22199bb5746056b3dbf1e861fd7a86b`


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

#### 1. Extra parameter for the method
##### Description
At the line https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/PolygonBridgeExecutor.sol#L35, when calling the `processMessageFromRoot()` method, the `stateId` parameter is passed.
But then this variable is not used anywhere in the method.

##### Recommendation
It is recommended to remove the unused parameter.

##### Status
Acknowledged
##### Client's commentary
`processMessageFromRoot()` is called in the FxChild contract which we do not control, so we need to receive the parameter, even though we do not do anything with it.


#### 2. Missing zero address check in constructor
##### Description
At the line https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/BridgeExecutorBase.sol#L44
missing validation `_guardian` for zero address. It is important because contract has no tool to change `_guardian`.

##### Recommendation
It is recommended to add zero address validation.

##### Status
Acknowledged
##### Client's commentary
Acknowledge, but no action.


#### 3. Immutable variable in access modifier
##### Description
At the line https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/BridgeExecutorBase.sol#L22 used the `_guardian` variable in the access modifier. But it is initialized only once in the constructor and there is no other functionality to change. This can lead to unavailability to use `cancel()` method.

##### Recommendation
It is recommended to add tool to change `_guardian` variable.

##### Status
Acknowledged
##### Client's commentary
Acknowledge, but no action.



### COMMENTS

#### 1. No validation of the address variable during initialization
##### Description
At the lines 
https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/PolygonBridgeExecutor.sol#L61
and
https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/PolygonBridgeExecutor.sol#70
changes variables without validations on same addresses and zero address.

##### Recommendation
It is recommended to add validation on same addresses and zero addresses:

https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/PolygonBridgeExecutor.sol#L61
```solidity=
require((fxRootSender != _fxRootSender) && (fxRootSender != address(0x0)));
```
https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/PolygonBridgeExecutor.sol#L70
```solidity=
require((fxChild != _fxChild) && (fxChild != address(0x0)));
```

##### Status
Acknowledged
##### Client's commentary
Acknowledge, but no action.


#### 2. Inappropriate documentation for the `receiveFunds()` function
##### Description
At the line
https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/BridgeExecutorBase.sol#L122
documentation tag `@inheritdoc` references interface `IBridgeExecutor`, but the interface does not contain a function that is overridden by this function.

##### Recommendation
It is recommended to add data to `IBridgeExecutor`.

##### Status
Fixed at https://github.com/aave/governance-crosschain-bridges/commit/0eb2a492e22199bb5746056b3dbf1e861fd7a86b



#### 3. Bad use of a variable
##### Description
At the line https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/PolygonBridgeExecutor.sol#L39, when calling the `processMessageFromRoot()` method, the values of the `rootMessageSender` parameter and the private variable` _fxRootSender` are compared.
It would be logical to use this functionality if the value of the private variable `_fxRootSender` is unknown to anyone.
But due to the existence of the `getFxRootSender()` function, any user can read the value of the `_fxRootSender` variable.
This variable is not used anywhere else in the method. And it is not used in other functions either.
It can be assumed that this variable is only needed for additional validation when calling the `processMessageFromRoot ()` method.
But it is more correct to do this check before calling the `processMessageFromRoot()` method.

##### Recommendation
It is recommended to transfer the `fxRootSender` variable from the https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/PolygonBridgeExecutor.sol contract to the https://github.com/aave/governance-crosschain-bridges/blob/9fd0609a2e14d546885f76211961f251d2e15cb9/contracts/dependencies/polygonDependencies/fxportal/FxChild.sol contract.
In this case, the logic of using this variable will be clear.

##### Status
Acknowledged
##### Client's commentary
This functionality is specific to the Polygon bridge and the FxPortal. Because FxChild is part of the FxPortal contracts managed by polygon, the check cannot occur in this contract as it is already deployed.


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 0
WARNING | 3
COMMENT | 3


### Executive summary
The smart contracts, examined in this audit, are designed to operate on the Polygon blockchain. The functionality is designed to work with tasks for calling functions in other contracts. You can queue, execute, or cancel tasks. All tasks are saved in a smart contract.


### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical or major issues were found, several warnings and comments were spotted. After working on the reported findings all of them were fixed by the client or acknowledged (if the problem was not critical). So, the contracts are assumed as secure to use according to our security criteria.


Final commit identifier with all fixes: `0eb2a492e22199bb5746056b3dbf1e861fd7a86b`