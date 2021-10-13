# Yearn Vaults v.3 Security Audit Report (merged)

###### tags: `Yearn`

## Introduction

### Project overview
Yearn Vaults contracts are used to create a simple way to generate high risk-adjusted returns for depositors of various assets via best- in-class lending protocols, liquidity pools, and community-made yield farming strategies on Ethereum.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

- https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol
- https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/contracts/Registry.vy
- https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/contracts/yToken.sol

The audited commit identifier is `e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544`,
`faaefd55548a25ab9ef23e98cc09f9ebeb54428a`

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

Two auditors independently verified the code.

Stages of the audit were as follows:

* "Blind" manual check of the code and its model 
* "Guided" manual code review
* Checking the code compliance with customer requirements 
* Discussion of independent audit results
* Report preparation

## Report

### CRITICAL

Not found


### MAJOR

#### 1. Incorrect use of a library function
##### Description
At the lines 
- https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L117
- https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L198
use the `safeApprove()` function from the `SafeERC20` library.
But before giving permission for a certain amount of tokens, you first need to zero this value.
Now the `safeApprove()` function is called only once with a specific value.
After the first call, everything will work, but after the second call, the function will be blocked. 

##### Recommendation
It is necessary to make a correct call to the `safeApprove()` function:
```
  token.safeApprove(addressValue, 0);
  token.safeApprove(addressValue, amount);
``` 

##### Status
Fixed at https://github.com/yearn/yearn-vaults/commit/faaefd55548a25ab9ef23e98cc09f9ebeb54428a



#### 2. Outdated `_cachedVaults` after `registry` changing
##### Description
Each `registry` has own `vaults` variable. It is possible that new `registry` contains different set of Vaults. In `allVaults` function we always copy old `_cachedVaults` https://github.com/yearn/yearn-vaults/blob/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L71-73. 

The cache is updated with `allVaults` produce https://github.com/yearn/yearn-vaults/blob/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L148-149.

So we will never update `_cachedVaults` prefix part.

##### Recommendation
It is recommended to update all elements of the `_cachedVaults` array in the `setRegistry()` function.

##### Status
Acknowledged

##### Client's commentary
Even though `registry` is update-able by Yearn, the intended behavior is that any future upgrades to the registry will replay the version history so that this cached value does not get out of date.



### WARNINGS

#### 1. Gas overflow during iteration (DoS)
##### Description
Each iteration of the cycle requires a gas flow.
A moment may come when more gas is required than it is allocated to record one block. In this case, all iterations of the loop will fail.

At the lines 
https://github.com/yearn/yearn-vaults/blob/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/yToken.sol#L107
https://github.com/yearn/yearn-vaults/blob/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/yToken.sol#L154
https://github.com/yearn/yearn-vaults/blob/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L151

for the `vaults` address array is not checked for its length. In iterations, data is written to the blockchain, which requires gas consumption. The contract has logic for adding new elements to the `vaults` array, but no logic for removing them.

##### Recommendation
It is recommended adding a check for the maximum possible number of elements of the arrays.

##### Status
Acknowledged

##### Client's commentary
This loop will attempt to withdraw from each Vault in `allVaults` that `sender` is deposited in, up to `amount` tokens. The withdraw action can be >expensive, so it if there is a denial of service issue in withdrawing, the downstream usage of this wrapper contract must give an alternative method of >withdrawing using this function so that `amount` is less than the full amount requested to withdraw (e.g. "piece-wise withdrawals"), leading to less loop >iterations such that the DoS issue is mitigated (at a tradeoff of requiring more txns from the end user).


#### 2. No validation of the address parameter value in contract constructor 
##### Description
The variable is assigned the value of the constructor input parameter. But this parameter is not checked before this. If the value turns out to be zero, then it will be necessary redeploy the contract, since there is no other functionality to set this variable.

- At the line https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L45 the `token` variable is set to the value of the `_token` input parameter.

##### Recommendation
It is necessary to add a check of the input parameter to zero before initializing the variables.

##### Status
Acknowledged




#### 3. No response check after function call to transfer tokens 
##### Description
According to the ERC-20 standard, the token transfer functions return a boolean variable.
It is necessary to process the function response after the token transfer.
But now there is no such functionality on the following lines:
- https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L137
- https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L171

##### Recommendation
It is recommended to add a return value check after the token transfer.

##### Status
Acknowledged



#### 4. Check for a zero input value 
##### Description
At the line https://github.com/yearn/yearn-vaults/blob/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L50  there is no check for a zero input value in method `setRegistry()`.

##### Recommendation
It is necessary to add a check of the input parameter to zero before initializing the variables.

##### Status
Acknowledged




#### 5. An attack like `Reentrancy` is possible 
##### Description
At the line https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/yToken.sol#L186
the sending of the entire ETH that is on the balance sheet of the contract is made.
But the sender can be a smart contract in which the function for receiving ETH calls the function `withdrawETH()` in the contract.
In this case, the behavior of the contract will differ from what is expected.

##### Recommendation
When calling the `withdrawETH()` function, it is recommended to use the `nonReentrant` access modifier from the contract:
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol.

##### Status
Fixed at https://github.com/yearn/yearn-vaults/commit/faaefd55548a25ab9ef23e98cc09f9ebeb54428a




### COMMENTS

#### 1. Event is probably missing 
##### Description: 
At the line https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L50 in method `setRegistry()` should probably emit an event `SetRegistry`.
At the line https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L104 in method `_deposit()` should probably emit an event `Deposit`.
At the line https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L140 in method `_withdraw()` should probably emit an event `Withdraw`.
At the line https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/BaseWrapper.sol#L218 in method `_migrate()` should probably emit an event `Migrate`.

At the line https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/Registry.vy#L304 in method `setBanksy()` should probably emit an event `SetBanksy`.

At the line https://github.com/yearn/yearn-vaults/blob/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/yToken.sol#L171 in method `depositETH()` should probably emit an event `DepositETH`.
At the line https://github.com/yearn/yearn-vaults/blob/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/yToken.sol#L180 in method `withdrawETH` should probably emit an event `WithdrawETH`.


##### Recommendation
It is recommended to create new events.

##### Status
Acknowledged




#### 2. The name of the function does not correspond to the logic of work 
##### Description: 
At the line https://github.com/yearn/yearn-vaults/tree/e390c2a6b2ba6e2ecc8f3a72a1ea4adfabd17544/contracts/Registry.vy#L316 in method `setBanksy()` should probably emit an event `SetBanksy`.
Line 316 has a function called `tagVault()`. This is the name for the function for reading the value of a variable.
But in this function, a new value of the variable is being set.
The name of the function does not correspond to the logic of work.

##### Recommendation
It is recommended to name the function `setTagVault()`.

##### Status
Acknowledged



## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR | 2
WARNING | 5
COMMENT | 2


### Executive summary
The contracts studied during this audit are designed to collect data about the Vaults for tokens in one place. All Vaults are collected in the Register smart contract. Also, the logic has been developed for the case if several Volts will be created for the same tokens. With ERC-20's operations, values are processed in all Vaults for this token at once.


## Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical issues were found, two issues were marked as major because they could lead to some undesired behavior, also several warnings and comments were found and fixed by the client. After working on the reported findings all of them were resolved or acknowledged (if the problem was not critical). So, the contracts are assumed as secure to use according to our security criteria.


Final commit identifier with all fixes: `faaefd55548a25ab9ef23e98cc09f9ebeb54428a`