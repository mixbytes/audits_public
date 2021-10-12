# Cover Protocol v2 Security Audit Report (merged)

###### tags: `Cover Protocol v2`

## Introduction

### Project overview
Cover Protocol provides peer to peer coverage with fungible tokens. It lets the market set coverage prices as opposed to a bonding curve.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/Cover.sol,
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/CoverPool.sol,
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/CoverPoolFactory.sol,
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/CoverERC20.sol,
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimManagement.sol,
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimConfig.sol,
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/proxy/BasicProxyLib.sol,
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/utils/StringHelper.sol

NOTE: For the following files from the scope only consistency with their original copies from openzeppelin repository is checked:
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ERC20/EIP712.sol
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ERC20/ERC20Permit.sol 
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ERC20/SafeERC20.sol 
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ERC20/ERC20.sol 
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/utils/Ownable.sol
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/utils/Address.sol 
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/utils/ReentrancyGuard.sol 
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/utils/Initializable.sol
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/utils/Create2.sol
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/proxy/Proxy.sol 
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/proxy/BaseUpgradeabilityProxy.sol 
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/proxy/BaseAdminUpgradeabilityProxy.sol 
https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/proxy/InitializableAdminUpgradeabilityProxy.sol

The audited commit identifier is `513f5e502a8e8a623729c2c3480fca4e80fdef39`

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

#### 1. Incorrect check of `timeWindow`

##### Description
At the line https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimConfig.sol#L50 there is incorrect check of `_newTimeWindow`

##### Recommendation
Change to `require(_newTimeWindow >= 3 days, "CC: window too short");`

##### Status
Fixed at https://github.com/CoverProtocol/cover-core-v2/commit/845e33cca83d05bd907dec902f6942fcaa59f030


#### 2. Lack of claim validation

##### Description
At lines:
- https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimManagement.sol#L112
- https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimManagement.sol#L145
- https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimManagement.sol#L176

the claim is taken by `_coverPool, _nonce, _index`, however caller may send incorrect indexes to the method.

At the line https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimManagement.sol#L114 even the flow with invalid claim will pass the require condition and go to 
```solidity
claim.state = ClaimState.Validated;
_resetCoverPoolClaimFee(_coverPool);
```
this is unexpected behavior and potentially can lead to the contract misfunctioning.

##### Recommendation
Add `require(_index < coverPoolClaims[_coverPool][_nonce].length, "bad indexes")`

##### Status
Fixed at https://github.com/CoverProtocol/cover-core-v2/commit/56123df73c626b252d676453e37027d355b15a13


### WARNINGS

#### 1. Lack of `onlyOwner` modifier in `Cover.deploy`

##### Description
At https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/Cover.sol#L239 anyone may call deploy. It's not a big thing now (at least in current implementation), but is rather an unexpected permission. Adding of `onlyOwner` modifier will make the code robust.

##### Recommendation
Add `onlyOwner` modifier.

##### Status
Acknowledged


#### 2. Too soft check in `addCover`

##### Description
At https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/CoverPool.sol#L123 it's not clear why do we require only `received>0` not `received==_amount`

##### Recommendation
Add `require(received==_amount)` or document and argue in code-comments and in the project's docs why it's so relaxed.

##### Status
Fixed at https://github.com/CoverProtocol/cover-core-v2/commit/56123df73c626b252d676453e37027d355b15a13


#### 3. Unnecessary getter method

##### Description
The method `getCVCList` at https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimConfig.sol#L91 is not needed because cvcMap is already defined as public attribute and has default getter.

##### Recommendation
Remove custom getter to save gas and use default one.

##### Status
Acknowledged


#### 4. Unused modifier

##### Description
`CoverPool`'s modifier `onlyGov` defined at line https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/CoverPool.sol#L67 is never used within the contract. In the same time there are methods having requires just within the methods:
```solidity
require(msg.sender == _factory().governance(), "CoverPool: caller not governance");
```

Seems like the methods should have used the modifier:
- https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/CoverPool.sol#L207
- https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/CoverPool.sol#L220

##### Recommendation
Use the modifier instead of the `require` above.

##### Status
Fixed at https://github.com/CoverProtocol/cover-core-v2/commit/56123df73c626b252d676453e37027d355b15a13


#### 5. Event is probably missing

##### Description
At line https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/CoverPoolFactory.sol#L89 `CoverPoolFactory`'s method `updateDeployGasMin` should probably emit an event as well as other methods for update (e.g. `updateCoverPoolImpl` or `updateCoverImpl`, etc.) do.

##### Recommendation
Create a suit event and emit the one in the method.

##### Status
Fixed at https://github.com/CoverProtocol/cover-core-v2/commit/56123df73c626b252d676453e37027d355b15a13, the event IntUpdated is used, however, it's more efficient by gas to create separate event class instead of setting a string to an event.


### COMMENTS

#### 1. Hard-coded DAI address

##### Description
At https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimConfig.sol#L14 the `DAI` address is hardcoded. But if the contract deployed to some other testnet it must be different.

##### Recommendation
Make the `DAI` address an argument to init method.

##### Status
Fixed at https://github.com/CoverProtocol/cover-core-v2/commit/56123df73c626b252d676453e37027d355b15a13


#### 2. Magic hard-coded constants

##### Description
There are some magic constants in the middle of the code:
- https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimConfig.sol#L50
- https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/Cover.sol#L218
- https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/Cover.sol#L282

##### Recommendation
Make them class-level named constants.

##### Status
Fixed at https://github.com/CoverProtocol/cover-core-v2/commit/56123df73c626b252d676453e37027d355b15a13


#### 3. Debateable gas usage

##### Description
In the method `removeCVCForPool` at https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimConfig.sol#L104 the new memory structure is created and then filled with all elements `!= _cvc`. However it's not clear if it is really cheaper than just do.
```solidity
function removeCVCForPool(address _coverPool, address _cvc, uint256 _cvt_index) public override onlyOwner {
  require(cvcMap[_coverPool][_cvt_index] == _cvc, "incorrect index");
  cvcMap[_coverPool][_cvt_index] = cvcMap[_coverPool][cvcMap[_coverPool].length-1];
  delete cvcMap[_coverPool][cvcMap[_coverPool].length--];
}
```

Also at https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/Cover.sol#L134 it's not clear if it is really cheaper than straight-forward approach.

##### Recommendation
Add gas performance tests or argue the optimal way as a comment in the code.

##### Status
Acknowledged


#### 4. Governance cannot be creator of the contract

##### Description
At the line https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimManagement.sol#L22 it's required that governance may not be creator of the contract. However it's not clear why.

##### Recommendation
Let the governance be creator of the contract or comment why it should not be like this.

##### Status
Fixed at https://github.com/CoverProtocol/cover-core-v2/commit/56123df73c626b252d676453e37027d355b15a13


#### 5. if-not-return statements used instead of require

##### Description
At https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/Cover.sol#L132 the check does nothing on fail, it just returns. 
This is not a regular way to do this kind of checks, usually people just write `require` statement. It seems that these if-not-return statements are used to allow multi transactional initialization. It's debateable if it's the best way to do it. And it's better to explicitly document it in the method's docstring and usage.

##### Recommendation
Add more comments.

##### Status
Acknowledged


#### 6. Unclear part of code which burns token after redeem

##### Description
It's not really clear what is the business logic behind the code-block at https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/Cover.sol#L166
as far as I understood it just burns unused tokens caused by the rest of division. 

This uncertainty and the fact that it's not obvious (at least for me) what does the block of code do, increases the chance of mistake and makes review harder.

##### Recommendation
Add more comments.

##### Status
Acknowledged


#### 7. Unclear business logic behind `_futureToken`,  `futureCovTokenMap`, `futureCovTokens`

##### Description
It's not really clear what is the business logic behind the usage of `_futureToken`, `futureCovTokenMap`, `futureCovTokens` and the code-block at https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/Cover.sol#L225 as far as I understood it switches to new claim tokens but it's not clear. Also there is no any explanation in the product docs.

This uncertainty and the fact that it's not obvious (at least for me) what does the block of code do, increases the chance of mistake and makes review harder.

##### Recommendation
Add more comments.

##### Status
Acknowledged


#### 8. Lack of `require(len>0)` in `_handleLatestFutureToken`

##### Description
At https://github.com/CoverProtocol/cover-core-v2/blob/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/Cover.sol#L292 nothing will happen if `futureCovTokens` is empty, it's not revert. However this is unexpected and may cause misfunctioning in callers methods.

##### Recommendation
Use `require(len>0)` instead of `if` condition

##### Status
Fixed at https://github.com/CoverProtocol/cover-core-v2/commit/845e33cca83d05bd907dec902f6942fcaa59f030


#### 9. Block timestamp type inconsistency

##### Description 
This comment is about multiple type shrinking of a `block.timestamp`'s `uint256`
to `uint48` cases e.g. in here: 
- https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimManagement.sol#L39
- https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimManagement.sol#L55 

or in here:
- https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimManagement.sol#L120
- https://github.com/CoverProtocol/cover-core-v2/tree/513f5e502a8e8a623729c2c3480fca4e80fdef39/contracts/ClaimManagement.sol#L171

Such a significant type shrink reduces the application's logic "time to live" duration.

##### Recommendation
It is recommended to keep the block timestamp being stored within the original
`uint256` type. Since such recommendation requires quite a significant
refactoring, this was made a comment, not a warning.

##### Status
Acknowledged


## Results
### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR | 2
WARNING | 5
COMMENT | 9

### Executive summary

The audited scope implements custom-token insurance protocol. The project have 3 logical modules: cover contract itself with statements to control insurance conditions, claim management for claims filed for cover pool, cover pool to manage covers for pool. Such project could be used as an insurance for funds.


### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical issues were found, two issues were marked as major because they could lead to some undesired behavior or some misunderstanding, also several warnings and comments were found and discussed with the client. After working on the reported findings all of them were resolved or acknowledged (if the problem was not critical).

Final commit identifier with all fixes: `845e33cca83d05bd907dec902f6942fcaa59f030`