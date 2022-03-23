# Fixed rate swap Security Audit Report 


###### tags: `1Inch`

## Introduction
### Project overview
1inch is a DeFi aggregator and a decentralized exchange with smart routing. The core protocol connects a large number of decentralized and centralized platforms in order to minimize price slippage and find the optimal trade for the users.

In this scope, there is only one smart contract `FixedRateSwap` - this is AMM, which is intended for assets with a stable price for each other, for example, USDC and USDT.
A price curve with a constant sum x + y = const is used. The commission may vary, depending on the balance of tokens.
In most cases, the commission is 1 bip. But when the balance reaches its extreme limits, it either drops to 0 or increases to 20 bip.

The following external functions are used:
- `getReturn()` - estimates the return value of the swap
- `deposit()` - makes a deposit of both tokens to the AMM
- `depositFor()` - makes a deposit of both tokens to the AMM and transfers LP tokens to the specified address
- `withdraw()` - makes a proportional withdrawal of both tokens
- `withdrawFor()` - makes a proportional withdrawal of both tokens and transfers them to the specified address
- `withdrawWithRatio()` -  makes a withdrawal with custom ratio
- `withdrawForWithRatio()` - makes a withdrawal with custom ratio and transfers tokens to the specified address
- `swap0To1()` - swaps token0 for token1
- `swap1To0()` - swaps token1 for token0
- `swap0To1For()` - swaps token0 for token1 and transfers them to specified receiver address
- `swap1To0For()` - swaps token1 for token0 and transfers them to specified receiver address


### Scope of the Audit

- https://github.com/1inch/fixed-rate-swap/blob/0b5a75e9f56e7d21c290dd28c59dc140dcbcc1d5/contracts/FixedRateSwap.sol

The audited commit identifier is `0b5a75e9f56e7d21c290dd28c59dc140dcbcc1d5`

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

A group of auditors independently verified the code.

Stages of the audit were as follows:

* Project architecture review
* Checking the code against the checklist of known vulnerabilities
* Checking the code for compliance with the desired security model
* Consolidation of interim auditor reports into general one
* Bug fixing & re-check
* Preparation of the final audit report

## Report

### CRITICAL
Not found

### MAJOR
#### 1. Withdraw "with ratio" without fee via reentrancy
##### Description
Tokens with callback e.g. ERC-777 allow easy reentrancy. 
Users can exploit reentrancy to withdraw with non-equal proportions without fees when call `withdraw` 
after the first transfer of [`depositFor`](https://github.com/1inch/fixed-rate-swap/blob/0b5a75e9f56e7d21c290dd28c59dc140dcbcc1d5/contracts/FixedRateSwap.sol#L136) or [`_swap`](https://github.com/1inch/fixed-rate-swap/blob/0b5a75e9f56e7d21c290dd28c59dc140dcbcc1d5/contracts/FixedRateSwap.sol#L321)

##### Recommendation
We recommend adding nonReentrant modifier to all external functions.

##### Status
Acknowledged
##### Client's commentary
We'll take extra care to not support ERC-777 tokens.


### WARNINGS
#### 1. Token exchange blocking 
##### Description
There are two tokens on the balance of the contract.
The exchange of token 0 for token 1 is possible when there is token 1 on the contract balance.
You can block the exchange functionality if you constantly make a small balance of one of the tokens.
This check is on the line:
https://github.com/1inch/fixed-rate-swap/blob/0b5a75e9f56e7d21c290dd28c59dc140dcbcc1d5/contracts/FixedRateSwap.sol#L92   

##### Recommendation
We recommend adding an event so that you can record and correct such situations from the outside.
Or you can automatically transfer tokens from another contract.

##### Status
Acknowledged
##### Client's commentary
Won't fix.


### COMMENTS
#### 1. Duplicate code 
##### Description
Duplicate code, i.e. using the same code structures in several places. Combining these structures will improve your code. The use of duplicate code structures impairs the perception of the program logic and can easily lead to errors in subsequent code edits. Duplicate code violates SOLID (single responsibility, open–closed, Liskov substitution, interface segregation и dependency inversion) software development principles.
The duplicate code is on the following lines:
- https://github.com/1inch/fixed-rate-swap/blob/0b5a75e9f56e7d21c290dd28c59dc140dcbcc1d5/contracts/FixedRateSwap.sol#L171-L178
- https://github.com/1inch/fixed-rate-swap/blob/0b5a75e9f56e7d21c290dd28c59dc140dcbcc1d5/contracts/FixedRateSwap.sol#L212-L220

- https://github.com/1inch/fixed-rate-swap/blob/0b5a75e9f56e7d21c290dd28c59dc140dcbcc1d5/contracts/FixedRateSwap.sol#L346-L358
- https://github.com/1inch/fixed-rate-swap/blob/0b5a75e9f56e7d21c290dd28c59dc140dcbcc1d5/contracts/FixedRateSwap.sol#L388-L400

##### Recommendation
We recommend grouping duplicate parts of the source code in a private function.

##### Status
Fixed at https://github.com/1inch/fixed-rate-swap/commit/a35978f7df1c85fa99c28bd98ec7ad8535721ec5
##### Client's commentary
Binsearch deduplication is a bit harder, we'll leave it as is.


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| 0
MAJOR   | 1
WARNING | 1
COMMENT | 1

### Conclusion
Smart contract has been audited and several suspicious places have been detected. During the audit, no critical problems were found, one issue was marked major, several warnings and comments were identified. After working on the reported results, they all were fixed or confirmed by the client.

Final commit identifier with all fixes: `52552c22f88ba3e628479bcb34bca541e9812ab6`