# Yearn-stablecoins-ypool Security Audit Report (merged)

###### tags: `Yearn`

## Introduction

### Project overview
Basic Solidity Smart Contract for creating your own Yearn Strategy.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol
https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol
https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol
https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol

The audited commits identifier is `5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4`, `7a07367d3dc91ade10211dad328675a8b9793372`

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

Not found


### MAJOR

#### 1. No check `_amt` value under withdraw
##### Description
At the lines:
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol#L207
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol#L207
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol#L207
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol#L207
there are not valid available balance on the contract. This will lead to the fact that the `_WithDRAWSome()` function will not always work. 

At the lines:
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol#L265
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol#L265
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol#L265
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol#L265
the same in the `forceW()` function.

##### Recommendation
It is recommended to add additional check `_amt` value under withdraw operation:
```soldity
if (_amt > _before){ 
    _amt = _before;
}
```

##### Status
Fixed at 
https://github.com/orbxball/stablecoins-ypool/commit/7a07367d3dc91ade10211dad328675a8b9793372/



### WARNINGS

#### 1. There is no input parameter processing in the method
##### Description
At the lines:
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol#L112
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol#L112
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol#L112
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol#L112
the `adjustPosition()` method has an input variable `_debtOutstanding`.
But there is no processing of this variable in the body of the function.
  
##### Recommendation
It is recommended to either add handling to the variable or remove this variable.

##### Status
Acknowledged



#### 2. The approval value obtained in the constructor may not be enough for the long term of the smart contract
##### Description
Smart contracts call `safeApprove()` functions for different tokens. But in the process of work, the obtained value will only decrease. If this value decreases to zero, then the tokens will remain locked in the contract forever.
It is at the following lines:
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol#L48-L54
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol#L48-L54
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol#L48-L54
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol#L48-L54
  
##### Recommendation
It is recommended to add a function to increase the value of approvals.

##### Status
Acknowledged





### COMMENTS

#### 1. Not informative names of functions and variables
##### Description
For the function names `forceD ()` and `forceW ()`, it is not clear what these functions are used for.
It is at the following lines:
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol#L250 and https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol#L263
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol#L250 and https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol#L263 
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol#L250 and https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol#L263 
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol#L250 and https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol#L263 

For the names of the variables `p` and` _p`, it is impossible to understand what these variables are used for.
It is on the following lines:
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol#L40 and https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol#L98-L105
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol#L40 and https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol#L98-L105 
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol#L40 and https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol#L98-L105 
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol#L40 and https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol#L98-L105 

Correct names of functions and variables make programs easier to use.

##### Recommendation
It is recommended to give correct names to functions and variables.

##### Status
Acknowledged



#### 2. Event is probably missing
##### Description: 
At the lines:
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol#L250-L261
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol#L250-L261
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol#L250-L261
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol#L250-L261
in method `forceD()` should probably emit an event `ForceDeposit`.

At the lines:
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol#L263-L273
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol#L263-L273
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol#L263-L273
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol#L263-L273
in method `forceW()` should probably emit an event `ForceWithdraw`.

At the lines:
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyDAIypool.sol#L57-L63
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyTUSDypool.sol#L57-L63
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDCypool.sol#L57-L63
- https://github.com/orbxball/stablecoins-ypool/blob/5d80af7aeeff9f9b8f6d47d0334d36db3e97e5e4/contracts/StrategyUSDTypool.sol#L57-L63
the methods `setThreshold()` and `setSlip` should probably emit the events: `NewThreshold` and `NewSlip`.

##### Recommendation
It is recommended to create new events.

##### Status
Acknowledged





## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR | 1
WARNING | 2
COMMENT | 2

### Executive summary
The audited scope includes four implementations of the BaseStrategy strategy for tokens: DAI, USDC, USDT and TUSD. The strategies implemented profit management rules that the user will receive after depositing their tokens in vaults for each token. Interestingly, the strategy for each token depends on three other tokens to work.


### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical issues were found, one issue was marked as major because it could lead to some undesired behavior, also several warnings and comments were found and fixed by the client. After working on the reported findings all of them were resolved or acknowledged (if the problem was not critical). So, the contracts are assumed as secure to use according to our security criteria.


Final commit identifier with all fixes: `7a07367d3dc91ade10211dad328675a8b9793372`