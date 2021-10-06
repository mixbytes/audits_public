# Mellow Finance Security Audit Report (merged)

###### tags: `Yearn`

## Introduction

### Project overview
Mellow protocol is UNI V3 liquidity providing optimization solution.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/LiquidityVault.sol

https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/StrategyManager.sol

https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/LpToken.sol

https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/VaultAccessControl.sol

https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/libraries/VaultMath.sol

https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/interfaces/ILiquidityVault.sol

https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/interfaces/IStrategyManager.sol

https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/interfaces/IToken.sol

The first audited commit identifier is 
`ec766bf844db0bce4b4adae63458fc08d02e21af`, re-audited commit identifiers are `702dc5a2a8a6dd70a3faf45838934321cacf4b49` and `a58075bb16ad05cfc766d65cf68f8f27b8739ff0`


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
#### 1. Balance drain with deposit/withdraw repeat

##### Description
The `deposit` and the `withdraw` are using different base value for conversion between vault shares into user deposits. The `withdraw` is based on [liquidity amount plus `free tokens`](https://github.com/mellow-finance/mellow-contracts/blob/702dc5a2a8a6dd70a3faf45838934321cacf4b49/contracts/LiquidityVault.sol#L198), however `deposit` is based on [liquidity amount only](https://github.com/mellow-finance/mellow-contracts/blob/702dc5a2a8a6dd70a3faf45838934321cacf4b49/contracts/LiquidityVault.sol#L126). The attacker can drain vault balance by making deposit/withdraw repeatedly. The exploit is provided.

##### Recommendation
It is recommended to make accounting of deposit/withdraw operation properly
##### Status
Fixed at https://github.com/mellow-finance/mellow-contracts/commit/a58075bb16ad05cfc766d65cf68f8f27b8739ff0

### MAJOR

#### 1. Possible withdraw unavailiability
##### Files 
https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/LiquidityVault.sol
##### Description
The amount of transferred out tokens are not accounted at the vault state while processing user withdrawals. This will cause attempt to withdraw incorrect (too large) amount and probable almost any withdrawals attempts will be reverted.
##### Recommendation
It is recommended to make accounting of deposit/withdraw operation properly
##### Status
Fixed at https://github.com/mellow-finance/mellow-contracts/commit/a58075bb16ad05cfc766d65cf68f8f27b8739ff0

### WARNINGS
#### 1. Reversed expression of require() at `commitStrategyParams()`
##### Files 
https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/LiquidityVault.sol
##### Description
This code is requiring to be called **before** specified deadline. However, it should require to be called **after** the deadline.
```solidity
require(
    (pendingStrategyParams[strategyId].unlockDate != 0) &&
        (pendingStrategyParams[strategyId].unlockDate > block.timestamp),
    "L"
);
```
##### Recommendation
It is recommended to fix expression
##### Status
FIXED at https://github.com/mellow-finance/mellow-contracts/commit/702dc5a2a8a6dd70a3faf45838934321cacf4b49

#### 2. Unability to withdraw profits from Position Manager
##### Files 
https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/LiquidityVault.sol
##### Description
The call parameters of positionManager.collect() prohibits collecting of profit. Only liquidity value will be collected.
##### Recommendation
It is recommended to not use undesired limitation of amount to be collected
##### Status
Fixed at https://github.com/mellow-finance/mellow-contracts/commit/a58075bb16ad05cfc766d65cf68f8f27b8739ff0

#### 3. collectExitFees, collectPerformanceFees don't check transfer result
##### Description
`freeTokens` value will be deceased even if token transfer fails

https://github.com/mellow-finance/mellow-contracts/blob/702dc5a2a8a6dd70a3faf45838934321cacf4b49/contracts/LiquidityVault.sol#L478
https://github.com/mellow-finance/mellow-contracts/blob/702dc5a2a8a6dd70a3faf45838934321cacf4b49/contracts/LiquidityVault.sol#L483
https://github.com/mellow-finance/mellow-contracts/blob/702dc5a2a8a6dd70a3faf45838934321cacf4b49/contracts/LiquidityVault.sol#L516
https://github.com/mellow-finance/mellow-contracts/blob/702dc5a2a8a6dd70a3faf45838934321cacf4b49/contracts/LiquidityVault.sol#L521
##### Recommendation
It is recommended to use `safeTransfer` instead of `transfer`
##### Status
Fixed at https://github.com/mellow-finance/mellow-contracts/commit/a58075bb16ad05cfc766d65cf68f8f27b8739ff0

#### 4. Inproper copy-paste in `rebalance()`
##### Description
amount1Min value is copy-pasted from previous live without proper modification
https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/LiquidityVault.sol#L433

```solidity
ClosePositionArgs({
    strategyId: args.strategyId,
    amount0Min: args.token0MinClose,
    amount1Min: args.token0MinClose,
    deadline: args.deadline
})
```
##### Recommendation
It is recommended to fix amount1Min value
##### Status
Fixed at https://github.com/mellow-finance/mellow-contracts/commit/702dc5a2a8a6dd70a3faf45838934321cacf4b49

### COMMENTS
#### 1. Unused variable
##### Files 
https://github.com/mellow-finance/mellow-contracts/blob/ec766bf844db0bce4b4adae63458fc08d02e21af/contracts/LiquidityVault.sol
##### Description
State variable `factory` of `LiquidityVault` is used only during initialization in constructor. It is never used anywhere else in the contract.
##### Recommendation
It is recommended to remove unused variable `factory` declaration and usage in constructor
##### Status
Fixed at https://github.com/mellow-finance/mellow-contracts/commit/a58075bb16ad05cfc766d65cf68f8f27b8739ff0

## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| 1
MAJOR   | 1
WARNING | 4
COMMENT | 1

### Executive summary
The audited scope of contracts arranges UNI V3 liquidity providing optimization solution.


### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit one critical issue was found and fixed by the client. One issue was marked as major because it could lead to undesired behavior, also several warnings and comments were found and discussed with the client. After working on the reported findings all of them were resolved. So, the contracts are assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `a58075bb16ad05cfc766d65cf68f8f27b8739ff0`
