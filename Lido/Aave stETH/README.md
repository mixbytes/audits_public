# Aave-stETH Security Audit Report 


###### tags: `LIDO`

## Introduction
### Project overview
LIDO protocol is a project for staking Ether to use it in Beacon chain.  Users can deposit Ether to the Lido smart contract and receive stETH tokens in return. The stETH token balance corresponds to the amount of Beacon chain Ether that the holder could withdraw if state transitions were enabled right now in the Ethereum 2.0 network.
The Lido DAO is a Decentralized Autonomous Organization that manages the liquid staking protocol by deciding on key parameters (e.g., setting fees, assigning node operators and oracles, etc.) through the voting power of governance token (DPG) holders.
The Lido DAO is an Aragon organization. The protocol smart contracts extend AragonApp base contract and can be managed by the DAO.

The goal is to provide the ability to deposit stETH into AAVE and allow to use it as collateral and for variable rate borrowing.
aToken uses underliyng stETH shares to store balances and implement rebase ability. Motivation behind this design is to encourage using
stETH as collateral rather than borrowing it. stETH is pegged steadily to ETH, so using it as collateral involves low liquidation risks.

Contracts
- `IncentivizedERC20.sol` - basic ERC20 implementation. When transferring tokens, the `handleAction()` method is called from `_incentivesController`. As `IncentivesController` address should be provided on deploy and couldn’t be upgraded, proxies addresses will be provided for both tokens. Lido DAO agent would be owner of both proxies to provide ability to upgrade it via the Lido DAO voting.
- `StableDebtToken.sol` - implements a stable debt token to track the borrowing positions of users at stable rate mode.
- `DebtTokenBase.sol` - base contract for different types of debt tokens, like `StableDebtToken` or `VariableDebtToken`.
- `AStETH.sol` - Rebaseable astETH token has an additional book-keeping layer on top of the existing aToken structure.
Generic aTokens have a private balance and public balance. The internal balance corresponds to the deposited balance without accrued interest.
The external balance corresponds to the deposited balance with interest.
- `StableDebtStETH.sol` - `StableDebtStETH` is inherited from `StableDebtToken`. There is only one difference between the prohibition of the `mint()` function.
- `VariableDebtStETH.sol` - implementation makes no functional changes to the generic implementation. When the debt tokens are mint and burn,
it performs additional operations to keep track of the amount of borrowed stETH in shares. This amount is stored as `_totalSharesBorrowed`.
The new `getBorrowData()` method returns the amount of borrowed shares and the total supply of the debtToken (is equal to the amount of borrowed stETH)
which are used for astETH math. The debtToken is non-rebasable token; the debt value is equal to the borrow + interest even after the rebasing of stETH.


AAVE protocol allows the use of incentives controllers in their `AToken`, `VariableDebtToken`, and `StableDebtToken` contracts
to distribute rewards on a token mint, burn or transfer. Lido’s integration in AAVE uses a custom implementation of `AToken` - `AStETH`.
Repo contains two types of incentives controller implementation that can be used with `AStETH` - `AaveIncentivesControllerStub`
and `AaveAStETHIncentivesController`. `AStETH` token doesn’t allow to change incentives controller after deployment.
To allow update implementation of incentives controller for `AStETH` both `AaveIncentivesControllerStub` and `AaveAStETHIncentivesController`
inherit `UUPSUpgradable` and `Ownable` contracts and would be deployed behind `ERC1967Proxy` contract, from the `OpenZeppelin` package.

Contracts
- `UnstructuredStorageVersionised.sol` - Encapsulates the logic for initializing and upgrades proxied contracts on a versioned basis by the dedicated owner
- `AaveIncentivesControllerStub.sol` - Contains logic with empty implementation of IAaveIncentivesController's `handleAction()` method. Inherits from `UnstructuredStorageVersionised.sol` contract.
- `AaveAStETHIncentivesController.sol` - Contains logic to the linear distribution of reward tokens across holders of AStETH, proportional to the number of tokens the user hold. Contract inherits from `UnstructuredStorageVersionised.sol` contract and implements Unstructured Storage pattern to simplify future updates of incentivization logic.
- `RewardsUtils.sol` - Provides structs and a library for convenient work with staking rewards distributed in a time-based manner.



### Scope of the Audit

- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/dependencies/uFragments/UInt256Lib.sol
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/interfaces/IAToken.sol
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/interfaces/ILendingPool.sol
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/libraries/math/MathUtils.sol
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/libraries/math/WadRayMath.sol
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/libraries/types/DataTypes.sol
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/IncentivizedERC20.sol
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/StableDebtToken.sol
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/base/DebtTokenBase.sol
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/AStETH.sol
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/StableDebtStETH.sol
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/VariableDebtStETH.sol

The audited commit identifier is `12c9111990c9699e84a36f30ba849486ef8f2a84`,
`2a42cb58d49c350d72c87614f0cf86819b29daa3`


- https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/incentives/AaveAStETHIncentivesController.sol
- https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/incentives/AaveIncentivesControllerStub.sol
- https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/utils/RewardsUtils.sol
- https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/versioning/UnstructuredStorageVersionised.sol

The audited commit identifier is `f9096e3a66ef96a59147a40f7cd045eb7e90e133`,
`3f7fab329403553df5a39449735c1d8e2debe403`


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

#### 1. Possible incorrect `scaledTotalSupply` calculation
##### Description
At the line
https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/AStETH.sol#L595
if the shares are below zero then value may overflow and scaled total supply calculation will be wrong.

##### Recommendation
Before converting a negative number to the `uint256` type, you must make it positive.
##### Status
Fixed at https://github.com/lidofinance/aave-protocol-v2/commit/23f16e68496029c62643a41a6de0707d1852a407
##### Client's commentary
After disabling the borrowing of stETH, the method with this issue was removed from the contract.
Commit with fix is https://github.com/lidofinance/aave-protocol-v2/commit/23f16e68496029c62643a41a6de0707d1852a407
Updated commit: https://github.com/lidofinance/aave-protocol-v2/commit/7cefeab33a2670f5d28ba42ffdc0d421cbf852e1


### WARNINGS

#### 1. No validation of the address parameter value in contract constructor
##### Description
The variable is assigned to the value of the constructor input parameter. But this parameter is not checked before this.
If the value turns out to be zero, then it will be necessary to redeploy the contract,
since there is no other functionality to set this variable.

* At the line https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/AStETH.sol#L81 the `POOL` variable is set to the value of the `pool` input parameter.
* At the line https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/AStETH.sol#L82 the `UNDERLYING_ASSET_ADDRESS` variable is set to the value of the `underlyingAssetAddress` input parameter.
* At the line https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/AStETH.sol#L83 the `RESERVE_TREASURY_ADDRESS` variable is set to the value of the `reserveTreasuryAddress` input parameter.

* At the line https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/IncentivizedERC20.sol#L37 the `_incentivesController` variable is set to the value of the `incentivesController` input parameter.

* At the line https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/protocol/tokenization/base/DebtTokenBase.sol#L47 the `POOL` variable is set to the value of the `pool` input parameter.
* At the line https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/base/DebtTokenBase.sol#L48 the `UNDERLYING_ASSET_ADDRESS` variable is set to the value of the `underlyingAssetAddress` input parameter.

* At the line https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/incentives/AaveAStETHIncentivesController.sol#L62 the `REWARD_TOKEN` variable is set to the value of the `_rewardToken` input parameter.
* At the line https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/incentives/AaveAStETHIncentivesController.sol#L63 the `STAKING_TOKEN` variable is set to the value of the `_stakingToken` input parameter.

##### Recommendation
In all the cases, it is necessary to add a check of the input parameter to zero before initializing the variables.
##### Status
Acknowledged
##### Client's commentary
No issue: All variables passed to the constructor will be double-checked before and after deployment. In case of wrong parameters passed, there is always an option to redeploy a contract with correct values.


#### 2. Unlimited rights for the owner of the contract
##### Description
There is nothing in the doc about the wallet of the contract owner.
At the line https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/incentives/AaveAStETHIncentivesController.sol#L120 is set to the value of the variable using the `_setRewardsDuration ()` function.
The value of this variable is used in the `notifyRewardAmount ()` function on lines 153, 157.
If the value of the variable is equal to zero, then the work of the `notifyRewardAmount()` function will be blocked.
The `notifyRewardAmount ()` function can only be called by RewardsDistributor, but it can be blocked from another wallet.
The single wallet of the contract owner can be compromised. Better to use multisignature.

Another fact in favor of using multisignature is that the owner of the contract calls the `recoverERC20 ()` function on lines
https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/incentives/AaveAStETHIncentivesController.sol#L172-L175. The owner can always withdraw all tokens.
##### Recommendation
It is recommended to use multisignature to call functions from the contract owner.
##### Status
Fixed at https://github.com/lidofinance/aave-asteth-incentives-controller/commit/9d4e96de07ce01e3ba2695cc798b1501f1db5934
##### Client's commentary
The owner of the contract will be set to Lido's Aragon Agent, and calls of admin methods of the contract might be possible only on behalf of the DAO. To restrict the rights of the Agent and exclude possible damage to AAVE's protocol, upgradability was removed from the`AaaveAStETHIncentivesController`, and updates of the `IncentivesController` might be done only by the AAVE governance via upgrading the implementation of the AStETH contract.
For rewards distributor will be used the standalone `RewardsManager` contract, used by Lido in many other integrations, which simplifies interaction with the incentives controller.
Fix was done in https://github.com/lidofinance/aave-asteth-incentives-controller/commit/9d4e96de07ce01e3ba2695cc798b1501f1db5934


#### 3. Extra condition
##### Description
If you update the compiler version from `0.6.12` to` 0.8.x`. Then you can remove the extra code.
At the line
https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/dependencies/openzeppelin/contracts/SignedSafeMath.sol#L29 an unnecessary check is performed..
If the value of the variable `a` is equal to `-1`, `-2`, `-3` and so on, the transaction will not be executed.
A similar superfluous condition on the line
https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/dependencies/openzeppelin/contracts/SignedSafeMath.sol#L51.
##### Recommendation
You need to update the compiler version and remove unused code.
##### Status
Acknowledged
##### Client's commentary
No issue: Such change will require massive refactoring in the AAVE protocol contracts. It is out of the scope of the integration.


#### 4. `claimReward()` may be external
##### Description
At the line
https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/incentives/AaveAStETHIncentivesController.sol#L124
`claimReward()` function may be external, there is no internal using.
##### Recommendation
It is recommended to make it external.
##### Status
Fixed at https://github.com/lidofinance/aave-asteth-incentives-controller/commit/5da7770484342f7ba6c34bba7112902f8548e5cb
##### Client's commentary
The visibility of the method was changed in https://github.com/lidofinance/aave-asteth-incentives-controller/commit/5da7770484342f7ba6c34bba7112902f8548e5cb


#### 5. `initialize()` should be private
##### Description
At the line
https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/incentives/AaveAStETHIncentivesController.sol#L74
`initalize()` function should be private because it is executed in the constructor once.
##### Recommendation
It is recommended to make it private.
##### Status
Fixed at https://github.com/lidofinance/aave-asteth-incentives-controller/commit/9d4e96de07ce01e3ba2695cc798b1501f1db5934
##### Client's commentary
After removing the upgradability from the contract, the initialize() method will not be used in the constructor but later by the owner to set the address of the staking token, so it should be public. Fix was done in https://github.com/lidofinance/aave-asteth-incentives-controller/commit/9d4e96de07ce01e3ba2695cc798b1501f1db5934


### COMMENTS

#### 1. Unknown data in comments
##### Description
* At the line https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/VariableDebtStETH.sol#L19 has an unused `_totalGonsBorrowed` variable.
* At the line https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/VariableDebtStETH.sol#L22 has an unused `fetchBorrowData()` variable.
* At the line https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/VariableDebtStETH.sol#L23 has an unused `fetchTotalSupply()` variable.
##### Recommendation
It is recommended to delete the description of unused data.
##### Status
Fixed at https://github.com/lidofinance/aave-protocol-v2/commit/23f16e68496029c62643a41a6de0707d1852a407
##### Client's commentary
Comments were deleted in the commit https://github.com/lidofinance/aave-protocol-v2/commit/23f16e68496029c62643a41a6de0707d1852a407
Updated commit: https://github.com/lidofinance/aave-protocol-v2/commit/7cefeab33a2670f5d28ba42ffdc0d421cbf852e1


#### 2. Reducing the source code
##### Description
At the line
https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/AStETH.sol#L564 describes the `extData` variable.
But the description of this variable can be done on the line
https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/AStETH.sol#L563 and remove line 564:
```solidity
  function _fetchExtData() internal view returns (ExtData memory extData) {
```
##### Recommendation
We recommend refactoring your source code.
##### Status
Fixed at https://github.com/lidofinance/aave-protocol-v2/commit/23f16e68496029c62643a41a6de0707d1852a407
##### Client's commentary
The code was refactored, and the whole method `_fetchExtData()` was removed.
The fix is in the commit https://github.com/lidofinance/aave-protocol-v2/commit/23f16e68496029c62643a41a6de0707d1852a407
Updated commit:
https://github.com/lidofinance/aave-protocol-v2/commit/7cefeab33a2670f5d28ba42ffdc0d421cbf852e1



#### 3. Internal function is not used anywhere
##### Description
At the lines
https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/tokenization/lido/VariableDebtStETH.sol#L174-L176 there's an internal function `fetchStETHTotalSupply ()`.
But in the current contract and in other contracts, it is not called anywhere.
##### Recommendation
Unused code must be removed.
##### Status
Fixed at https://github.com/lidofinance/aave-protocol-v2/commit/7cefeab33a2670f5d28ba42ffdc0d421cbf852e1
##### Client's commentary
The unused method was removed in the commit https://github.com/lidofinance/aave-protocol-v2/commit/23f16e68496029c62643a41a6de0707d1852a407
Updated commit: https://github.com/lidofinance/aave-protocol-v2/commit/7cefeab33a2670f5d28ba42ffdc0d421cbf852e1



#### 4. Code duplication
##### Description
At the library
- https://github.com/lidofinance/aave-protocol-v2/blob/12c9111990c9699e84a36f30ba849486ef8f2a84/contracts/protocol/libraries/math/WadRayMath.sol
there are four methods which can be reduced to two functions: `wadDiv()` and `rayDiv()` can be united to single function with addition param.
And `wadMul()` and `rayMul()` functions can be united too.
##### Recomendation
It is recommended to combine these methods.
##### Status
Acknowledged
##### Client's commentary
No issue: The above methods are used widely across the AAVE protocol contracts, and such refactoring will be hard to implement.


#### 5. Mistake in comment or in method
##### Description
At `notifyRewardAmount()` method of
https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/incentives/AaveAStETHIncentivesController.sol#L143
added comment `@param rewardHolder Address to retrieve reward tokens` that means that `rewardHolder` is the address which will receive `REWARD_TOKEN`.
But along method logic this address transfers `REWARD_TOKEN` to this contract at the line:
https://github.com/lidofinance/aave-asteth-incentives-controller/blob/f9096e3a66ef96a59147a40f7cd045eb7e90e133/contracts/incentives/AaveAStETHIncentivesController.sol#L148.
##### Recommendation
The comment needs to be corrected.
##### Status
Fixed at https://github.com/lidofinance/aave-asteth-incentives-controller/commit/e47d3918dd93d6cb740eddf7918a98942dcf2e38
##### Client's commentary
The comment was corrected in the commit https://github.com/lidofinance/aave-asteth-incentives-controller/commit/e47d3918dd93d6cb740eddf7918a98942dcf2e38


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| 0
MAJOR   | 1
WARNING | 5
COMMENT | 5

### Conclusion
Smart contracts have been audited and several suspicious places have been detected. During the audit, no critical problems were found, one major, several warnings, and comments were identified. After working on the reported results, they were all fixed or confirmed by the client.


Final commit identifier with all fixes:
`2a42cb58d49c350d72c87614f0cf86819b29daa3` for https://github.com/lidofinance/aave-protocol-v2/,
`3f7fab329403553df5a39449735c1d8e2debe403` for  https://github.com/lidofinance/aave-asteth-incentives-controller/
<br/>


**CONTRACTS DEPLOYMENT**
The following addresses contain deployed to the Ethereum mainnet and verified smart contracts code that matches audited scope:
<br/>

- AStETH.sol: [0xbd233D4ffdAA9B7d1d3E6b18CCcb8D091142893a](https://etherscan.io/address/0xbd233D4ffdAA9B7d1d3E6b18CCcb8D091142893a#code)
- StableDebtStETH.sol: [0x8180949ac41ef18e844ff8dafe604a195d86aea9](https://etherscan.io/address/0x8180949ac41ef18e844ff8dafe604a195d86aea9#code)
- VariableDebtStETH.sol: [0xde2c414b671d2db93617d1592f0490c13674de24](https://etherscan.io/address/0xde2c414b671d2db93617d1592f0490c13674de24#code)
<br/>

For all contracts, the `incentivesController` address is `0x0000000000000000000000000000000000000000`.