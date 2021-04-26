# Convex Platform Security Audit Report (merged)

###### tags: `Convex`

## Introduction

### Project overview
Convex Platform implies community based staking with boosting without the need for locking yourself.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/VoterProxy.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/BaseRewardPool.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/CrvDepositor.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Interfaces.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/StashFactory.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/DepositToken.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Cvx.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/ExtraRewardStashV2.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/ManagedRewardPool.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/RewardFactory.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/cCrv.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/DebugInterfaces.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/cCrvRewardPool.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/TokenFactory.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/ExtraRewardStashV1.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/cvxRewardPool.sol
https://github.com/convex-eth/platform/tree/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/VirtualBalanceRewardPool.sol


The audited commit identifier is `754d9e700693246275b613e895b4044b63ce9ed5`

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
#### 1. Anyone can perform any arbitrary calls on behalf of `VoterProxy`
##### Description
Function `deposit` in `VoterProxy` defined at https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/VoterProxy.sol#L60 accepts call from anyone with any `_token` and `_gauge`, so anyone can craft calldata and make call on behalf of `VoterProxy`. That could lead to undesired behavior, e.g user's funds locked in contract or authorization violation. Also deposit can be called for `_gauge` and `_token` which are not compatible.
Moreover for now anyone can allow spending tokens from contract balance for any third-party account by calling deposit for target token with evil gauge.

##### Recommendation
We strictly recommend to whitelist `_gauge` and `_token`. And also check that `_token` and `_gauge` are compatible(check that ```ICurveGauge(_gauge).withdraw(_amount)``` returns right `_token`)

##### Status
Fixed at https://github.com/convex-eth/platform/commit/ef433b1562595aef7a55675711e24a3ef8e330c1


### MAJOR
#### 1. Unstable gauge version check
##### Description
`ShashFactory` contract have gauge version check based on call probes defined at https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/StashFactory.sol#L51-L61, that approach is very dangerous in case of new version added to curve. E.g if curve will add new version of gauge that have `rewarded_token()` or `reward_tokens(uint256)` and with different behavior, then version checker will wrongly classify version and allow to create stash with invalid version. That can lead to broken logic.

##### Recommendation
We recommend to use another approach to check version, e.g whitelisting gauges. Curve have only around ~40 gauges.

##### Status
Fixed at https://github.com/convex-eth/platform/commit/1858521a92a3d13aed2611f035f7fd80569282bc


#### 2. Wrong logic in `withdrawAll`
##### Description
At the moment `withdrawAll` counts balance as: `balanceOfPool(_gauge)` (https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/VoterProxy.sol#L92)

Correct logic should be: `balanceOfPool(_gauge).add(IERC20(_token).balanceOf(address(this)))`.

The `withdrawAll` method is used by `shutdownSystem` so potentially some tokens could remain in the contract.

##### Recommendation
It is recommended to count amount of tokens as `balanceOfPool(_gauge).add(IERC20(_token).balanceOf(address(this)))`.

##### Status
Fixed at https://github.com/convex-eth/platform/commit/ef433b1562595aef7a55675711e24a3ef8e330c1


#### 3. Zero gauge could be added via `addPool`
##### Description
In `addPool` defined at https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L160 there is no check for `_gauge` variable. For example during this call
```soldity
booster.addPool(threeCrvSwap, "0x0000000000000000000000000000000000000000", 0)
```

Gauge will be found because `get_gauges` returns array like `[address1, address2, 0x0, 0x0, ...]`. Intruder can call some errors in `Booster` logic.

It's major because at the moment `StashFactory` call `address(0x0).call.value(0)(data)` (https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/StashFactory.sol#L53) and due to specific of EVM there is `true`.

##### Recommendation
We recommend to add some checks for `_gauge` variable.

##### Status
Fixed at https://github.com/convex-eth/platform/commit/1858521a92a3d13aed2611f035f7fd80569282bc


### WARNINGS
#### 1. Inconsistent minted and deposited LP tokens amount
##### Description
Function `deposit` in `Booster` defined at https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L275 allows to deposit curve pools LP token and mint wrapped convex tokens with 1:1 proportions. However minted tokens amount for user can be different from deposited LP tokens amount:
 - At line https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L278 contract accepts `_amount` LP tokens 
 - At line https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L265 contract deposit `bal` tokens to gauge
 - `bal != _amount` if before user deposit someone send LP token directly to `Booster` contract, so here we got that amount of deposited tokens to gauge not equal to LP tokens amount deposited to `Booster`

##### Recommendation
We recommend to pass actual deposited `_amount` to `sendTokensToGauge` function and use it as amount of tokens for depositing to gauge.

##### Status
Fixed at https://github.com/convex-eth/platform/commit/c1779fa77c4f890993e8b274b61bfa102d3b1b38


#### 2. `voteDelegate` can perform any arbitrary calls on behalf of `VoterProxy`
##### Description
Function `vote` in `VoterProxy` defined at https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/VoterProxy.sol#L130 accepts call from `voteDelegate` through `Booster` contract and can call any arbitrary contract on behalf of `VoterProxy`. Since `VoterProxy` is main contract that holds users money it's highly risked to allow arbitrary contracts calls.

##### Recommendation
We strictly recommend to whitelist `_votingAddress`

##### Status
Fixed at https://github.com/convex-eth/platform/commit/ffb814d7ec14467a0e9a36f5f55f4af3109c45fd


#### 3. Insecure privileges for `Owner`
##### Description
Owner can change factories in `setFactories` (https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L95):
```solidity
rewardFactory = _rfactory;
stashFactory = _sfactory;
tokenFactory = _tfactory;
```

Via front-running attack `owner` can change these addresses before calling `addPool`.

##### Recommendation
We recommend to construct this contracts in Booster and create mechanism of migrations directly in factories.

##### Status
Fixed at https://github.com/convex-eth/platform/commit/b0f9b09d13f69ebfa22d772c2c3bab74be9d0c4c


#### 4. Call `earmarkRewards` after shutdown
##### Description
Line is commented in method `earmarkRewards` defined at https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L434:
```solidity
// require(!isShutdown,"shutdown");
```

However if system is shutdowned the transaction would be reverted because stash has no access to `VoterProxy`.

##### Recommendation
It is recommended to uncomment this line. 

##### Status
Fixed at https://github.com/convex-eth/platform/commit/fb25f601ffed58d7e3bab594a6a70ce2e1cb3b68


#### 5. Missed `safeApprove`
##### Description
`Booster` uses `approve` method (https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L288):
```solidity
IERC20(token).approve(rewardContract, _amount);
```
It's better to use `safeApprove`.

##### Recommendation
It is recommended to use `safeApprove`.

##### Status
Fixed at https://github.com/convex-eth/platform/commit/19d5814305dc2183293b1981702e99876a9e2704, https://github.com/convex-eth/platform/commit/0c61de7461124d9124384574e1017e55c01607bf


### COMMENTS
#### 1. Cache `poolInfo` in memory to save gas
##### Description
In function `deposit` of `Booster` contract defined at https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L275 there are several reads of `poolInfo` struct fields, so it's better to cache `poolInfo` structure in memory to save some gas on reading.

##### Recommendation
We suggest to cache `poolInfo` in memory

##### Status
Fixed at https://github.com/convex-eth/platform/commit/7cd1773eb47c456269029a87799d648fe2d8f218, https://github.com/convex-eth/platform/commit/64b8c045bb27b7c96031391193e24175998ecf04


#### 2. Check user balance at beginning to save gas
##### Description
Function `_withdraw` defined at line https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L309 needs to burn wrapper tokens and back LP tokens to user, for now in case if user have to sufficient wrapped tokens ```ITokenMinter(token).burn(_from,_amount)``` at line https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L329 will revert transaction. In that case user will pay gas for whole operations before, so we recommend to check user's balance at the very beginning of the functions to save gas on negative scenario.

##### Recommendation
We recommend to check user's balance at beginning of the function

##### Status
Fixed at https://github.com/convex-eth/platform/commit/7cd1773eb47c456269029a87799d648fe2d8f218, https://github.com/convex-eth/platform/commit/64b8c045bb27b7c96031391193e24175998ecf04


#### 3. Remove unrelevant commentaries
##### Description
At lines:
 - https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L345
 - https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L441
 - https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L119
 - etc 

there are commentaries which are not really relevant

##### Recommendation
We recommend to remove unneeded comments

##### Status
Fixed at https://github.com/convex-eth/platform/commit/8d9e0eab5470de0698278205ec9863404f849c7a


#### 4. Reduce amount of code duplication
##### Description
Contracts:
 - https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/BaseRewardPool.sol
 - https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/ManagedRewardPool.sol
 - https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/VirtualBalanceRewardPool.sol
 - https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/cCrvRewardPool.sol
 - https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/cvxRewardPool.sol

have a lot of intersections in terms of code duplication, so it's bad practice because it makes easier to introduce bug and makes code more complex

##### Recommendation
We recommend to reduce duplication using contracts inheritance

##### Status
Fixed at https://github.com/convex-eth/platform/commit/072801591ad783963b395ef8b74ed02e03cd1347


#### 5. Confusing naming of subjects
##### Description
At several places there are confusing naming, e.g:
 - https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/VoterProxy.sol#L23 `operator` is `Booster`
 - https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L62 `staker` is `VoterProxy`
 - etc

it's always better to have strict, unambiguous and transparent naming, same things should have same names through whole project to make project more readable and simpler.

##### Recommendation
We recommend use unambiguous naming in whole project.

##### Status
Acknowledged


#### 6. Confusing interfaces
##### Description
There are a lot of interfaces in file https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Interfaces.sol, some of that interfaces used in project and sometimes it's not clear what interface is internal(interface of project contract) and what interface is external(e.g curve's one)

##### Recommendation
We recommend to separate external\internal interfaces. And also recommend to keep widely used structure and naming of interfaces: contract interface should have all public methods and should be name should be like I{contract name}.sol. And interfaces should be located at 'interface' directory.

##### Status
Acknowledged


#### 7. Saving gas while `platformFee` transferring
##### Description
If `platformFee` is zero then it will call empty `safeTransfer`.

At the moment there is only one condition at line https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L405:
```soldity
treasury != address(0) && treasury != address(this)
```

##### Recommendation
We recommend to add `platformFee > 0`.

##### Status
Fixed at https://github.com/convex-eth/platform/commit/07c6e0264cf97a1d4bb9977649efdbb2ffd9ab02


#### 8. Check if system shutdowned in `addPool`
##### Description
Method `addPool` defined at https://github.com/convex-eth/platform/blob/754d9e700693246275b613e895b4044b63ce9ed5/contracts/contracts/Booster.sol#L160 doesn't have checks for `isShutdown`.

##### Recommendation
We recommend to prevent `addPool` when system is shutdown.

##### Status
Fixed at https://github.com/convex-eth/platform/commit/f36d093e3b6548be460e718174048441ac82c35b



## Results

### Executive summary
Audited scope contains smart contract of convex platform project. The main project's goal is automation and boosting rewards from curve gauges. Users can deposit their curve LP tokens to convex pool, pool automatically locks it into gauges and get reward in crv token, crv also can be locked in curve to gain additional reward from curve booster. 

### Conclusion
Smart contract have been audited and several suspicious places have been spotted. During the audit 1 critical and 3 major issues were found, also several warnings and comments were found and included to report. After working on the reported findings all of them were resolved or acknowledged (if the problem was not critical). Final commit identifier with all fixes: `0c61de7461124d9124384574e1017e55c01607bf`