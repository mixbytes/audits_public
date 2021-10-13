# Yearn-stablecoins-3pool Security Audit Report (merged)

###### tags: `Yearn`

## Introduction

### Project overview
Basic Solidity Smart Contract for creating your own Yearn Strategy.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol
https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol
https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol

The audited commit identifier is `adeb776933c6cb3b8306239cc3357d4c6239a88d`,
`3f772afc4f868cc2ec9112a86b0cb89a838a7ae8`,
`efbf10ec8d2c624dfcf4685cf905220989716f55`,
`e86260fa8f786bcf7f39503ec80250afd144366a`

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

#### 1. Withdrawal from an account exceeding availible assets
##### Description
The contractor discovered a code that is potentially susceptible to contract failure due to throw from another contract.
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L164
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L164

##### Recommendation
It is recommended to add validation which was done in the contract:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L163

##### Status
Fixed at 
https://github.com/orbxball/stablecoins-3pool/commit/3f772afc4f868cc2ec9112a86b0cb89a838a7ae8/ 

##### Client's commentary
> no comment


#### 2. Incorrect transfer of parameter values
##### Description
At the lines:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L222
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L224
the parameters are not passed correctly.


##### Recommendation
It is recommended to fixed it.

##### Status
Fixed at 
https://github.com/orbxball/stablecoins-3pool/commit/efbf10ec8d2c624dfcf4685cf905220989716f55/ 

##### Client's commentary
> no comment


### WARNINGS

#### 1. Forced deposit from an account exceeding available assets
##### Description
It is possible get an exception due to throw from another contract while depositing. 
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L207
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L207
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L209

##### Recommendation
It is recommended to add the following check:
```solidity
uint256 _amt = want.balanceOf(address(this));
if (_amount > _amt) _amount = _amt;
```
##### Status
Fixed at 
https://github.com/orbxball/stablecoins-3pool/commit/e86260fa8f786bcf7f39503ec80250afd144366a/

##### Client's commentary
> no comment


#### 2. Forced withdrawal from an account exceeding available assets
##### Description
Contract potentially can failure due to throw from another contract while withdrawal amount of tokens which exceed available assets.
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L217
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L217
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L219

##### Recommendation
A possible solution would be to add the following check:
```solidity
uint256 _bal = IERC20(y3crv).balanceOf(address(this));
if (_amt > _bal) _amt = _bal;
```
##### Status
Fixed at 
https://github.com/orbxball/stablecoins-3pool/commit/e86260fa8f786bcf7f39503ec80250afd144366a/

##### Client's commentary
> no comment


#### 3. There is no input parameter processing in the method
##### Description
At the lines:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L99
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L99
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L99
the `adjustPosition()` method has an input variable `_debtOutstanding`.
But there is no processing of this variable in the body of the function.
  
##### Recommendation
It is recommended to either add handling to the variable or remove this variable.

##### Status
Acknowledged

##### Client's commentary
> no comment


#### 4. The approval value obtained in the constructor may not be enough for the long term of the smart contract
##### Description
Smart contracts call `safeApprove()` functions for different tokens. But in the process of work, the obtained value will only decrease. If this value decreases to zero, then the tokens will remain locked in the contract forever.
It is at the following lines:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L39-L41
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L39-L41
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L39-L41
  
##### Recommendation
It is recommended to add a function to increase the value of approvals.

##### Status
Acknowledged

##### Client's commentary
> no comment


#### 5. Possible flashloan attacks
##### Description
In current contract some functions can be influenced by flashloan attacks.
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L71
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L71
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L71

##### Recommendation
It is recommended to check the return value for validity when calling the `balanceOfy3CRVinWant()` function.

##### Status
Acknowledged

##### Client's commentary
> We have a `maxDepositAmount`, which can limit the max deposit amount on this strategy. Also, from the vault side it controls the influx and efflux of big deposit/withdraw amount to avoid that amount directly interact with this strategy. and the third protection is the tight slippage.


#### 6. Correct migration
##### Description
In constructor, rights are granted to spend tokens, which should be canceled when migrating the strategy.
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L175
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L175
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L177

##### Recommendation
It is recommended to add in function `prepareMigration()`:
```solidity
want.safeTransfer(_newStrategy, want.balanceOf(address(this)));
want.safeApprove(_3pool, 0);
IERC20(_3crv).safeApprove(y3crv, 0);
IERC20(_3crv).safeApprove(_3pool, 0);
```
##### Status
Acknowledged

##### Client's commentary
> no comment



### COMMENTS

#### 1. Event is probably missing
##### Description: 
At the lines:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L205-L213
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L205-L213
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L207-L215
in method `forceD()` should probably emit an event `ForceDeposit`.

At the lines:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L215-L225
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L215-L225
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L217-L227
in method `forceW()` should probably emit an event `ForceWithdraw`.

At the lines:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L44-L50
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L44-L50
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L44-L50
the methods `setThreshold()` and `setSlip` should probably emit an events: `NewThreshold` and `NewSlip`.

At the lines:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L197-L203
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L197-L203
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L199-L205
in method `rebalance()` should probably emit an event `Rebalance`.

##### Recommendation
It is recommended to create new events.

##### Status
Acknowledged

##### Client's commentary
> no comment


#### 2. Not informative names of functions and variables
##### Description
For the function names `forceD ()` and `forceW ()`, it is not clear what these functions are used for.
It is at the following lines:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L205-L225
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L205-L225
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L207-L227

For the names of the variables `p` and` _p`, it is impossible to understand what these variables are used for.
It is on the following lines:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L84-L92
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L84-L92
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L84-L92

Correct names of functions and variables make programs easier to use.

##### Recommendation
It is recommended to give correct names to functions and variables.

##### Status
Acknowledged

##### Client's commentary
> no comment



## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR | 2
WARNING | 6
COMMENT | 2

### Executive summary
The audited scope includes three implementations of the BaseStrategy strategy for tokens: DAI, USDC, USDT. The strategies implemented profit management rules that the user will receive after depositing their tokens in vaults for each token. Interestingly, the strategy for each token depends on two other tokens to work.


### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical issues were found, two issues was marked as major because it could lead to some undesired behavior, also several warnings and comments were found and fixed by the client. After working on the reported findings all of them were resolved or acknowledged (if the problem was not critical). So, the contracts are assumed as secure to use according to our security criteria.


Final commit identifier with all fixes: `e86260fa8f786bcf7f39503ec80250afd144366a`