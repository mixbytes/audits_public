# Fee Collector Security Audit Report (merged)

###### tags: `1Inch`

## Introduction

### Project overview
A contract that collects user rewards and exchanges it for 1inch tokens through an auction.
The auction has parameters maxValue and minValue, which indicate the maximum and minimum values of the number of 1inch tokens that the contract agrees to receive in exchange for the entire number of certain tokens.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/1inch/fee-collector/blob/3c2626763fd829500496f15476d5e98fbdf4f574/contracts/FeeCollector.sol
https://github.com/1inch/fee-collector/blob/3c2626763fd829500496f15476d5e98fbdf4f574/contracts/utils/BalanceAccounting.sol
https://github.com/1inch/fee-collector/blob/3c2626763fd829500496f15476d5e98fbdf4f574/contracts/interfaces/IFeeCollector.sol
https://github.com/1inch/fee-collector/blob/3c2626763fd829500496f15476d5e98fbdf4f574/contracts/interfaces/InteractiveMaker.sol
The audited commit identifier is `3c2626763fd829500496f15476d5e98fbdf4f574`, `62107c397b8e922afb63dc4c49595fb56db015e8`

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
#### 1. Transactions frontrunning 

##### Description 
The code in this line contains an error in calculation
in line: https://github.com/1inch/fee-collector/blob/3c2626763fd829500496f15476d5e98fbdf4f574/contracts/FeeCollector.sol#L360

`uint256 returnAmount = amount * tokenBalance / value(erc20);`
   
According to the formula, it is fixed price for the rest of  tokenBalance or whole amount, not the price for unit.

*Example:

Someone(something) makes updateReward for 10 WETH - user1
Let's assume now we have minimal price after a long period of time

Current price is 100 Inch for  10 WETH
user2 and user3 are atackers

User4 wants to make a full trade. He wants to buy 10 WETH for 100 1Inch. He wants make a transaction 

attacker puts the next transaction before User4
User2 updateReward with ~101010 WETH
the price is changed
User3 trades after User2 ~101010.mul(price) 
User2 executes trade
attacker has a profit equal ~1.4 WETH

User4 got ~8.6 WETH. 1.4 WETH less that expected*

*Example 2

Let's assume, now we have minimal price after a long period of time
Someone(something) makes updateReward for 10 WETH - user1
Current price is 100 Inch for  10 WETH

User2 and User3 want to make partial trade. They want to buy 5 WETH for 50 1Inch. They make a transaction at approximately the same time


User2 trades first and gets 5 WETH and spends ~50 1Inch. OK
User3 trades after User 2.5WETH  and spends ~50 Inch.  Not correct

User1 never gets his 1Inch because User3 or nobody wants to  make this incorrect transaction

In case User3 makes transaction for 5 WETH and ~spends 100 1Inch, User1 will receive ~2 times more 1Inch than excpected*

##### Recommendation
Implement correct returnAmount calculation
##### Status
Fixed at https://github.com/1inch/fee-collector/commit/62107c397b8e922afb63dc4c49595fb56db015e8


### MAJOR
Not found

### WARNINGS
#### 1. Not Possible to buy whole amount when the price is continuously changing
##### Files
https://github.com/1inch/fee-collector/blob/3c2626763fd829500496f15476d5e98fbdf4f574/contracts/FeeCollector.sol
##### Description
When the price is continuously changing it is not possible to set exact amount of token for buying the whole amount because the price is always decreasing and transation will be always reverted because we will have not enough rewarder tokens. 
In case you set perspective price, you will have the same situation described in №1 critical case.
##### Recommendation
We recommend to add functionality which allows us to set exact  `returnAmount` for rewarded token and set restriction for input tokens amount.
##### Status
Acknowledged
##### Client's commentary
It is possible via external contract that will call FeeCollector.value(erc20) beforehand.

### COMMENTS
#### 1. Missing natspec documentation
##### Files
https://github.com/1inch/fee-collector/blob/3c2626763fd829500496f15476d5e98fbdf4f574/contracts/FeeCollector.sol
##### Description
Solidity contracts can use a special form of comments to provide rich documentation for functions, return variables and more. This special form is named the Ethereum Natural Language Specification Format (NatSpec).
##### Recommendation
It is recommended to include natspec documentation and follow the doxygen style including @author, @title, @notice, @dev, @param, @return and make it easier to review and understand your smart contract.
##### Status
No issue


#### 2. Possible events are not emitting
##### Description
In the `trade()` function the state of smart contract is changed, but events are not emitted:
https://github.com/1inch/fee-collector/blob/3c2626763fd829500496f15476d5e98fbdf4f574/contracts/FeeCollector.sol#L344
##### Recommendation
We recommend to add emitting events for this function.
##### Status
Fixed at https://github.com/1inch/fee-collector/commit/62107c397b8e922afb63dc4c49595fb56db015e8


#### 3. Potentially re-entrancy weak code
##### Description
At the lines: https://github.com/1inch/fee-collector/blob/3c2626763fd829500496f15476d5e98fbdf4f574/contracts/FeeCollector.sol#L339-L342
the state changes inside `_updateReward` which happens AFTER:
- `erc20.safeTransferFrom()`
It makes the method potentially weak for re-entry attack.
##### Recommendation
We recommend to add  ReentrancyGuard modifier.
or
It is recommended to change the order of calls in a common-way, change-state first, then external-call.
##### Status
Fixed at https://github.com/1inch/fee-collector/commit/62107c397b8e922afb63dc4c49595fb56db015e8



## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| 1
MAJOR   | -
WARNING | 1
COMMENT | 3

### Executive summary
The audited scope implements Fee Collector  smart contracts that handles governance and referral fees from Liquidity Protocol and Aggregation Protocol.

### Conclusion
Smart contract has been audited and several suspicious places were found. During audit one critical issue was identified.  Several issues were marked as warnings and comments. After working on audit report all issues were fixed or acknowledged by the client. Thus, contract is assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `62107c397b8e922afb63dc4c49595fb56db015e8`
