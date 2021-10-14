# Crosschain bridges (2) Security Audit Report (merged)

###### tags: `Aave`

## Introduction

### Project overview

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

- https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/BridgeExecutorBase.sol
- https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/ArbitrumBridgeExecutor.sol
- https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/PolygonBridgeExecutor.sol
- https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/interfaces/IBridgeExecutor.sol
- https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/interfaces/IFxMessageProcessor.sol

The audited commit identifier is `763ef5da8befff3a129443a3ff4ef7ca4d3bb446`

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

#### 1. Invalid variable check
##### Description
The `_executeTransaction()` function in https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/BridgeExecutorBase.sol#L225 can be called several times from the `execute()` function in https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/BridgeExecutorBase.sol#L58.
Each time the line https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/BridgeExecutorBase.sol#L248 checks the `value` and `msg.value` variables.
But this is not correct, because it is necessary to compare the sum of all values of the array of `values[]` and `msg.value` in the `execute()` function. 

##### Recommendation
It is recommended to do the correct check of the variable.

##### Status
**New**
##### Client's commentary
> comment here


### WARNINGS

#### 1. Possible loss of assets
##### Description
At the line https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/BridgeExecutorBase.sol#L253, a call is made to the payable functions with the transfer of assets.
But it is not always possible to set the exact amount of an asset when making a transaction. Especially if the number has a lot of numbers after the decimal point.
It is convenient to transfer a value with a slightly larger amount of an asset during a transaction. But now there is no functionality in the contract to get the remaining asset back.
All additional assets will remain on the balance sheet of the contract. 

##### Recommendation
It is recommended to add functionality for the ability to withdraw assets from the contract balance.

##### Status
**New**
##### Client's commentary
> comment here


#### 2. No check for zero address
##### Description
At the line https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/BridgeExecutorBase.sol#L207 is assigned to the variable `targets` of type `address`.
But there is no check for the value of this variable. If this variable is equal to zero, the transaction will fail.

##### Recommendation
It is recommended to add a check for a zero address.

##### Status
**New**
##### Client's commentary
> comment here


#### 3. Extra field in the structure
##### Description
At the line https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/BridgeExecutorBase.sol#L206 is assigned to the variable `actionsSet.id` of type `uint256`.
But this variable is not used anywhere else. In addition, this variable is duplicated on line https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/BridgeExecutorBase.sol#L205.
We will not be able to get the value of the `_actionsSets` variable without knowing the value of `actionsSetId` and there is no need to additionally store the value of `actionsSetId` in a variable of the `ActionsSet` type.

##### Recommendation
It is recommended to remove the `id` field on the https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/interfaces/IBridgeExecutor.sol#L9 line from the `ActionsSet` structure.

##### Status
**New**
##### Client's commentary
> comment here


### COMMENTS

#### 1. It is desirable to make an access modifier
##### Description
At the line https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/ArbitrumBridgeExecutor.sol#L36 uses check: 
`require(msg.sender == _ethereumGovernanceExecutor, 'UNAUTHORIZED_EXECUTOR');`. 
But the code will be nicer if you use the access modifier:

```solidity
modifier onlyEthereumGovernanceExecutor() {
    require(msg.sender == _ethereumGovernanceExecutor, 'UNAUTHORIZED_EXECUTOR');
    _;
}
```  

At the line https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/PolygonBridgeExecutor.sol#L36 uses check: 
`require(msg.sender == _fxChild, 'UNAUTHORIZED_CHILD_ORIGIN');`. 
But the code will be nicer if you use the access modifier:

```solidity
modifier onlyFxChild() {
     require(msg.sender == _fxChild, 'UNAUTHORIZED_CHILD_ORIGIN');
    _;
}
```  

##### Recommendation
It is recommended to make access modifiers.

##### Status
**New**
##### Client's commentary
> comment here


#### 2. Redo the return value validation
##### Description
At the line https://github.com/aave/governance-crosschain-bridges/blob/763ef5da8befff3a129443a3ff4ef7ca4d3bb446/contracts/BridgeExecutorBase.sol#L256 checks the return value of the `success` variable after calling `call() `or `delegatecall()`.
But there is no check for the variable `resultData`.
Both variables are checked in the `Address` library at https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.1/contracts/utils/Address.sol#L171-L188.

##### Recommendation
It is recommended to modify the check of returned variables in accordance with the library from OpenZeppelin.

##### Status
**New**
##### Client's commentary
> comment here


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 1
WARNING | 3
COMMENT | 2

### Executive summary
The smart contracts, examined in this audit, are designed to operate on the Polygon and Arbitrum blockchains. The functionality is designed to work with tasks for calling functions in other contracts. You can queue, execute, or cancel tasks. All tasks are saved in a smart contract.

### Conclusion
TBA

Final commit identifier with all fixes: `#`