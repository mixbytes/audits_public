**** FOR INTERNAL USE ONLY ****

---
# Aggregation Router V4-2 Interim Security Audit Report (merged)

###### tags: `1Inch`

## Introduction
### Project overview
1inch is a DeFi aggregator and a decentralized exchange with smart routing. The core protocol connects a large number of decentralized and centralized platforms in order to minimize price slippage and find the optimal trade for the users.

The smart contracts reviewed in this audit are designed to create a universal exchange for tokens. Now it includes functionality for the following routers: `Uniswap`, `Uniswap V3` and `Clipper`. All external functions of the smart contracts `UnoswapRouter`,` UnoswapV3Router` and `ClipperRouter` will be available after the deployment of the smart contract `AggregationRouterV4`. The `swap()` function is also in the `AggregationRouterV4` contract itself.
This fact is both good and bad. Good for advanced functionality and dangerous for different routers to interact with each other.

Below is the description of the purpose of the studied smart contracts:
- `ClipperRouter` is intended to interact with the Clipper exchanger. Clipper is the decentralized exchange built to give the self-made crypto trader the best possible prices on small trades (< $10k).
- `LimitOrderProtocolRFQ` is designed to work with Orders. Functions often use the `OrderRFQ` structure. This structure stores order data.
- `UnoswapRouter` is designed to interact with the Uniswap exchange version less than 3.
- `UnoswapV3Router` is designed to interact with the Uniswap version 3 exchange.
- `AggregationRouterV4` is the inheritor from all previous smart contracts and includes all their functionality.
- `AggregationExecutor` is a contract that contains functions for interacting with other contracts using the `call()` function. 

- `ECDSA` is a library from OpenZeppelin for recovering addresses from encoded data.
- `EthReceiver` is an abstract contract for verifying that `msg.sender != tx.origin`.
- `Permitable` is an auxiliary contract with one internal function `_permit()`. It is needed to issue permissions for managing tokens.
- `UniERC20` is a library to facilitate the work with tokens and ETH.


### Scope of the Audit

- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/AggregationRouterV4.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/ClipperRouter.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/LimitOrderProtocolRFQ.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/UnoswapRouter.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/UnoswapV3Router.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/AggregationExecutor.sol

- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/helpers/ECDSA.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/helpers/EthReceiver.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/helpers/Permitable.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/helpers/UniERC20.sol

- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/interfaces/IAggregationExecutorExtended.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/interfaces/IChi.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/interfaces/IClipperExchangeInterface.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/interfaces/IDaiLikePermit.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/interfaces/IERC1271.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/interfaces/IUniswapV3Pool.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/interfaces/IUniswapV3SwapCallback.sol
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/interfaces/IWETH.sol

The audited commit identifier is `68e10c5d0cd96c1a3e227d8b028b88184f0ac027`

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
Not found


### WARNINGS

#### 1. Using `transfer()` instead of `call()`
##### Description
The `transfer()` function, used at:
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/LimitOrderProtocolRFQ.sol#L150
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/helpers/UniERC20.sol#L32
has a fixed gas price, and it can consume all gaslimit if gasprice become too hight, so it's strong recommended to stop using it
##### Recommendation
It is recommended to send ETH via `call()`.
##### Status
**New**
##### Client's commentary
> comment here


#### 2. Unchecked address before immutable assignment
##### Description
Immutable variables which can't be changed other time, so shuold to check address before assignment at:
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/LimitOrderProtocolRFQ.sol#L47
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/ClipperRouter.sol#L27
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/UnoswapV3Router.sol#L34
##### Recommendation
It is recommended to check address for zeros.
##### Status
**New**
##### Client's commentary
> comment here


#### 3. Add variable check
##### Description
In the `swap ()` function, the `desc.srcReceiver` variable must be `caller`, otherwise the swap will fail.
https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/AggregationRouterV4.sol#L93
##### Recommendation
It is recommended to add check
```solidity
require(address(caller) == desc.srcReceiver, "Caller must be srcReceiver");
```
##### Status
**New**
##### Client's commentary
> comment here


#### 4. The function does not have to be `payable`
##### Description
Permit usually give ERC20 allowance, so this function shouldn't receive ETH 
https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/LimitOrderProtocolRFQ.sol#87
##### Recommendation
It is recommended to remove `payable` modifier
##### Status
**New**
##### Client's commentary
> comment here



### COMMENTS

#### 1. Using potentially indifferent variables  
##### Description
There are `amount` variables which went along whole function logic without any interaction at:
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/UnoswapRouter.sol#L34
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/AggregationRouterV4.sol#L118
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/ClipperRouter.sol#L39
- https://github.com/1inch/1inch-contract/blob/68e10c5d0cd96c1a3e227d8b028b88184f0ac027/contracts/UnoswapV3Router.sol#L46

A `permit` variable can contain a different amount, and it isn't checking before using `amount` in return

##### Recommendation
It is recommended to check if `amount` variable such as amount in `permit` 
##### Status
**New**
##### Client's commentary
> comment here


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| 0
MAJOR   | 0
WARNING | 4
COMMENT | 1

### Conclusion
TBA

Final commit identifier with all fixes: ` `
