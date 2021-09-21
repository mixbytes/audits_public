# AbyssLockup Security Audit Report (merged)

###### tags: `Abyss`

## Introduction

### Project overview
Smart contract for ERC20 and LP tokens lockups with 1, 3, 6, 12 months delay after withdrawal request.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/abyssfinance/abyss-lockup/blob/8fe1a854a9b01dc1aa35272b82fd22655d4f42d1/contracts/AbyssLockup.sol
https://github.com/abyssfinance/abyss-lockup/blob/8fe1a854a9b01dc1aa35272b82fd22655d4f42d1/contracts/AbyssSafe1.sol
https://github.com/abyssfinance/abyss-lockup/blob/8fe1a854a9b01dc1aa35272b82fd22655d4f42d1/contracts/AbyssSafe3.sol
https://github.com/abyssfinance/abyss-lockup/blob/8fe1a854a9b01dc1aa35272b82fd22655d4f42d1/contracts/AbyssSafe6.sol
https://github.com/abyssfinance/abyss-lockup/blob/8fe1a854a9b01dc1aa35272b82fd22655d4f42d1/contracts/AbyssSafe12.sol
https://github.com/abyssfinance/abyss-lockup/blob/8fe1a854a9b01dc1aa35272b82fd22655d4f42d1/contracts/interfaces/IAbyssLockup.sol

The audited commit identifier is `8fe1a854a9b01dc1aa35272b82fd22655d4f42d1`

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
#### 1. Unfair withdrawn amount
##### Description
How to reproduce bug:
 - Deposit N tokens from Alice
 - Deposit N tokens from Bob
 - Deposit N tokens from Eve
 - Request and withdraw N tokens to Alice
 - Request and withdraw N tokens to Bob
 - Request and withdraw N tokens to Eve
 - At this point participant got different withdrawn amount(first lost more funds)

Detailed explanation:
 - Use particular deflationary token as depositing asset https://gist.github.com/algys/eb905ec8efa41f80cf1eab57a3b31649
 - After all withdrawals Alice lost more funds than Eve, that behavior is unfair because they deposited same amount and just lost funds depending on withdrawal order

##### Recommendation
It is recommended to refactor rebase logic and reduce amount of code duplication.

##### Status
Fixed at https://github.com/abyssfinance/abyss-lockup/commit/edd0cb4981c5ca988c59448cf3bb019422df59fd


#### 2. Potential withdrawal lock and invalid distribution
##### Description
How to reproduce bug:
 - Deposit N tokens from Alice
 - Deposit N tokens from Bob
 - Deposit N tokens from Eve
 - Send M (relatively huge amount) to Lockup contract directly (via transfer)
 - Request and withdraw N tokens to Alice
 - Request and withdraw N tokens to Bob
 - Request and withdraw N tokens to Eve
 - At this point participant got different withdrawn amount(first lost more funds), and depending on M amount sometimes contract can be failed on `request` call

Detailed explanation:
 - Use particular deflationary token as depositing asset https://gist.github.com/algys/eb905ec8efa41f80cf1eab57a3b31649
 - After all withdrawals Alice lost more funds than Eve, that behavior is unfair because they deposited same amount and just lost funds depending on withdrawal order

##### Recommendation
It is recommended to fix rebase logic related to lockup balance based calculation

##### Status
Fixed at https://github.com/abyssfinance/abyss-lockup/commit/77ce2ef196b8aee29874b7d8f1d4005a552d5c08


### MAJOR
Not found


### WARNINGS

#### 1. Potentially `approved` cache miss 
##### Description
At lines https://github.com/abyssfinance/abyss-lockup/blob/8fe1a854a9b01dc1aa35272b82fd22655d4f42d1/contracts/AbyssSafe3.sol#L202-L216 contract has approval caching mechanism, that works fine if token supports infinity approval, so in other cases cached approve might tell wrong info.

##### Recommendation
It is recommended to check approval permanently

##### Status
Fixed at https://github.com/abyssfinance/abyss-lockup/commit/816328e8dcbbee7aa466e832616ba15990f04219



### COMMENTS
#### 1. Use simplified syntax while working with libs
##### Description
In reviewed contracts e.g file https://github.com/abyssfinance/abyss-lockup/blob/8fe1a854a9b01dc1aa35272b82fd22655d4f42d1/contracts/AbyssSafe3.sol explicit syntax used everywhere while working with SafeMath lib:
```soldity
SafeMath.div(
  SafeMath.mul(
      _data[msg.sender][token].deposited,
      _tokens[token].divFactorDeposited
      ),
  _data[msg.sender][token].divFactorDeposited
  );
```

it's better to use simplified one:
```solidity 
_data[msg.sender][token].deposited.mul(_tokens[token].divFactorDeposited).div(_data[msg.sender][token].divFactorDeposited)
````

##### Recommendation
It is recommended to use simplified syntax

##### Status
Fixed at https://github.com/abyssfinance/abyss-lockup/commit/ad710b12deae3c3b87020b55452ebb7fc714b623


#### 2. Reduce copy-pasted code amount
##### Description
There are a lot of places when rebases' logic code is copy-pasted:
  - https://github.com/abyssfinance/abyss-lockup/blob/8fe1a854a9b01dc1aa35272b82fd22655d4f42d1/contracts/AbyssSafe3.sol#L223-L239
  - https://github.com/abyssfinance/abyss-lockup/blob/8fe1a854a9b01dc1aa35272b82fd22655d4f42d1/contracts/AbyssSafe3.sol#L330-L344
  - https://github.com/abyssfinance/abyss-lockup/blob/8fe1a854a9b01dc1aa35272b82fd22655d4f42d1/contracts/AbyssSafe3.sol#L472-L482

Code duplication highly increases probability to introducing bugs and makes code reading and reviewing process really hard that increase bug missing probability as well

##### Recommendation
It is recommended to incapsulate similar code to special function

##### Status
Fixed at https://github.com/abyssfinance/abyss-lockup/commit/d98756f669dbc4c8c575391f24f71c02af65b154


## Results

### Findings list
Level | Amount
--- | ---
CRITICAL | 2
MAJOR | 0
WARNING | 1
COMMENT | 2

### Executive summary
Audited scope includes contracts which are the part of multifunctional lockup mechanism. General purpose of contracts is allowing users to lockup any kind of ERC-20 tokens for already defined time, but e.g. contracts also can be used as staking reward distributor. 

### Conclusion
Smart contracts have been audited and several suspicious places were found. During audit 2 critical were identified as they could lead to wrong behavior related with user assets and several issues were marked as warning or comment. After working on audit report all issues were fixed or acknowledged by client and contracts assumed as secure to use according our security criteria. Final commit identifier with all fixes: `77ce2ef196b8aee29874b7d8f1d4005a552d5c08`.