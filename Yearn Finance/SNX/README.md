# SNX Security Audit Report (merged)

###### tags: `Yearn`

## Introduction
Yearn Finance is a decentralized investment aggregator that leverages composability and uses automated strategies to earn high yield on crypto assets.
Yearn vaults represent a user funds manager in Yearn ecosystem.
Smart contract itself is a base contract for strategies. It defines strategy interface and provides common functionality and restrictions for them.
The contract is designed to be overridden by particular strategy and allows to implement any custom logic and at same time one may not worry about interface compatibility.

### Project overview
Part of Yearn Strategy Mix.
### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol
The audited commit identifier is `91b839df4a350d80cb583795bccafe0836fdb732`

## Security Assessment Methodology

3 security auditors and 1 tech lead are involved in the work on the audit who check the provided source code independently of each other in accordance with the methodology described below:

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

#### 1. "Sandwich attack" on user withdrawal
##### Description
In some rare conditions, the strategy is using AMM DEX to [swap SNX to SUSD](https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L348) inside of the user-handled transaction. This is vulnerable to the "sandwich attack".

##### Recommendation
Although vulnerability conditions are rare and hard to exploit, it is recommended to protect AMM DEX swap operations with slippage technique.

##### Status
Acknowledged

##### Client's commentary
1. **Sandwich attack on user withdrawal**:
    The strategy is subject to this attack only when withdrawing 100% of want from it (unlocking 100% of collateral and repaying 100% of debt). And only in the rare condition of losses.
    When winding down, the strategy needs to repay full amount of debt to unlock collateral. This means that if debt is higher than cash (i.e. the vault in which we invested incurred in losses OR debt increased faster for any reason), the strategy will need to sell want to be able to repay full debt and unlock 100% of collateral. This means that it will incur in losses. This ONLY happens when 100% of want is withdrawed from the strategy (either migration, debtRatio == 0, or the last user withdrawal causing a 100% withdrawal from vault).

The attack is only possible if

1. debt > cash
2. 100%-of-want withdrawal
3. someone is watching for that to happen and sandwich attack us


The preferred solution is to implement a slippage protection, even if this situation is rare. However slippage protection should not be implemented in Strategy level but in something like the ySwaps (being already built by Yearn) , and all the strategies should use it. Not only for withdrawal but also for harvesting. This technique would be using a price oracle and revert if DEX price is different than price oracle.

The agreed upon way to act is:

* don't redeploy current debt-taker strategies until a ySwaps with slippage protection is deployed. once it is available, redeploy with new ySwaps as the way to swap
* for new debt-taker strategies: only implement prepareMigration if the debt is transferrable (e.g. Maker), otherwise, strategies should be revoked and a new strategy added the regular way
* If affected strategies need to be 100% liquidated in the meanwhile, act with caution. There are ways to mitigate even in the event of an attacker ready and waiting for us to wind down an strategy (which should not be the case)




### WARNINGS

#### 1. The approval value obtained in the constructor may not be enough for the long term of the smart contract
##### Description
At lines: https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L79-L85
the smart contract constructor call `safeApproveA()` functions for different tokens. But in the process of work, the obtained value will only decrease. If this value decreases to zero, then the tokens will remain locked in the contract forever.
  
##### Recommendation
It is recommended to add a function to increase the value of approvals.

##### Status
Acknowledged

##### Client's commentary
It is a super long term thing. Approvals are 2 ** 256 - 1 (10e77) and its use is triggered mainly by yearn.


#### 2. Default max_loss on underlying vault
##### Description
At line: https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L512  the `withdrawFromSUSDVault()` function is not specifying max_loss parameter. This can lead to unavailability of withdrawals.

##### Recommendation
To implement function to change max_loss parameter by strategist.

##### Status
Acknowledged

##### Client's commentary
In case yvSUSD is in losses, we will need to use migrateSusdVault to unlock invested sUSD.


#### 3. Handling losses from underlying vault
##### Files 
https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol
##### Description
The underlying SUSD vault may suffer a permanent loss. This will lead to a loss of corresponding SNX. However, such loss is not fairly distributed across vault users. On the first withdrawals no loss will be reported but on a later withdrawal attempts the strategy will report major losses to any users.

##### Recommendation
To implement some mechanics to fairly redistribute a losses.

##### Status
Acknowledged

##### Client's commentary
If the underlying sUSD vault incurs in losses, they are compensated with profits and not accounted as losses but considered not realised. This means that if a user is withdrawing 100% of strategy assets, they may have losses.


#### 4. Probably incorrect using of `safeApprove`
##### Description
At line https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L129 we see the single `safeApprove` without setting to zero. 

##### Recommendation
Set approvement to zero before new approving
```solidity
IERC20(susd).safeApprove(address(newSusdVault), 0);
```
##### Status
No issue

##### Client's commentary
SafeApprove requires starting from 0 allowance. As this method is only to migrate to new sUSD vaults, it should always be 0.


#### 5. Protected tokens
##### Description
At line: https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L470-L475 we can't see any protected tokens. 

##### Recommendation
We recommended to add protected tokens in the array.

##### Status
No issue

##### Client's commentary
This was intended. Since SNX rewards are staked for a year, we wanted to have options to move tokens if the strategy was decomissioned.


### COMMENTS

#### 1. Excessive  Gas usage 
##### Description
Second method `_unlockedWant()` call at line https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L260 is redundant and cost extra Gas. 
Also, every access to synthetix  invokes `resolver()` to get Synthetix router. This value is static and doesn't require
dynamic call. 

##### Recommendation
It is recommended to put second  `_unlockedWant` call under preceding `if` block after `reduceLockedCollateral` L255.

It is recomended to replace method `resolver` with variable (see [synthetix README](https://github.com/Synthetixio/synthetix/blob/develop/README.md)).
```
  constructor(IAddressResolver _snxResolver) public {
    synthetixResolver = _snxResolver;
  }
```
##### Status
Acknowledged

##### Client's commentary
Regarding _unlockedWant, impact is minor as _amountNeeded is 99% of times higher than unlockedWant. Regarding resolver, to be solved in a future iteration as it would save one SLOAD. We consider these a nice to have and will be fixed before a future redeployment.


#### 2. Require without message
##### Description
In the following function if revert occurs then user doesn't receive any information:
https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L100

##### Recommendation
We recommend to add message to require.

##### Status
Acknowledged

##### Client's commentary
Function is reserved for yearn team. Not to be used by any user. Saving gas on deployment.


#### 3. Possible gas saving
##### Description
Function `estimatedProfit` used only here https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L148, contains conversion [`sUSDToWant`](https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L566). Probably this conversion is redundant, it is possible to return `estimatedProfit` in `sUSD` and convert to want with `sUSD` balances at https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L149, in this case, we will save one call to `_exchangeRates`.
  
##### Recommendation
Rename `estimatedProfit` to `estimatedProfitInSusd` and return it in `sUSD` and move `estimatedProfit` into `sUSDToWant`.
```solidity
balanceOfWant().add(
    sUSDToWant(
        balanceOfSusdInVault().add(balanceOfSusd()).add(estimatedProfitInSusd())
    )
);
```
##### Status
Acknowledged

##### Client's commentary
We considered these a nice to have and will be fixed before a future redeployment.


#### 4. Unnecessary gas usage
##### Description
At line: https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L252 we see the row
`uint256 unlockedWant = _unlockedWant();` and the same at line https://github.com/jmonteer/yearnV2-strat-SNX-staking/blob/91b839df4a350d80cb583795bccafe0836fdb732/contracts/Strategy.sol#L260. It is redundant.

##### Recommendation
Move refresh unlockedWand value into previous if() block.

##### Status
Acknowledged

##### Client's commentary
We considered these a nice to have and will be fixed before a future redeployment.


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR    | 1
WARNING  | 5
COMMENT  | 4


### Executive summary
The main purpose of the project is to give users to add additional ability to use the Synthetix protocol managed by strategy.

### Conclusion
Smart contract has been audited and several suspicious places were found. During audit no critical issues were identified. One issue was marked major, as it might lead to unintended behavior. Several issues were marked as warnings and comments. After working on audit report all issues were acknowledged by client or declared as no issue, according to client's commentary. Thus contracts assumed as secure to use according to our security criteria.

