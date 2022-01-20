# Yearn Strategy SSB Security Audit Report (merged)

###### tags: `Yearn`

## Introduction
### Project overview
`Yearn Finance` is a suite of products in Decentralized Finance (DeFi) that provides lending aggregation, yield generation, and insurance on the Ethereum blockchain. The protocol is maintained by various independent developers and is governed by YFI holders.

Tonkers Kuma Strategy SSB is `Yearn Finance` strategy for gaining fee and airdrop rewards for providing liquidity to the `Balancer` project. The project consists of a single smart contract `Strategy.sol`.

Most important functions are:
`prepareReturn` - called each time as the strategy `keeper` is executing `harvest` on the strategy. This function is collecting trading fees and sells any airdrops.

`adjustPosition` - called to (re)invest tokens

`liquidatePosition` - called to immediately release tokens to be available for the vault

### Scope of the Audit
https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol

The audited commit identifier is: `e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f`, `edbac164b49713a6c32fd7f318b5232c4a69d289`

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
Not found

### COMMENTS
#### 1. Unused "payable"
##### Description 
At line:
https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol#L133
##### Recommendation
We recommend removing "payable".
##### Status
Acknowledged
##### Client's commentary:
This is required due to balancer swap.
**AUDITOR'S COMMENT:**
Removing `receive()` will not affect interaction with `Balancer` because `ether` is not transferred.

#### 2. Unused "Address"
##### Description 
At line:
https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol#L21
##### Recommendation
We recommend removing "using Address for address".
##### Status
Fixed at https://github.com/tonkers-kuma/strategy-ssb/commit/edbac164b49713a6c32fd7f318b5232c4a69d289

#### 3. Unused internal constant `weth`
##### Description
The internal constant `weth` is unused in the contract and inaccessible outside of the contract. Probably it can be removed.

At line:
https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol#L24
##### Recommendation
We recommend to remove unused `weth`. 
##### Status
Fixed at https://github.com/tonkers-kuma/strategy-ssb/commit/edbac164b49713a6c32fd7f318b5232c4a69d289

#### 4. `sellRewards()` threshold values
##### Description
At lines
https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol#L295
https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol#L277 

The threshold values for selling reward tokens is probably unreasonably lower than gas amount required for token swap operation.

##### Recommendation
We recommend to use reasonable threshold for amount of reward tokens.
##### Status
Acknowledged
##### Client's commentary:
This is a decimal precision concern rather than gas. Gas considered is mitigated by doing infrequent harvests manually.

#### 5. Same value is calculated in every loop iteration
##### Description
Value of `decWant` is persistent during each iteration of loops at https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol#L276 and at https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol#L293 and therefore could be calculated outside the loop to save gas.
##### Recommendation
We recommend to calculate value of `decWant` outside of loops in methods `harvestTrigger()` and `sellRewards()`.
##### Status
Fixed at https://github.com/tonkers-kuma/strategy-ssb/commit/edbac164b49713a6c32fd7f318b5232c4a69d289

#### 6. Value of memory variable could be used instead of storage variable
##### Description
Value of `maxAmountsIn[tokenIndex]` was set to a value of a memory variable `amountIn` at https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol#L199. Therefore it's more gas-efficient to use value of a memory variable instead of storage varialbe.
##### Recommendation
We recommend to use value of `amountIn` to evaluate if condition.
##### Status
Fixed at https://github.com/tonkers-kuma/strategy-ssb/commit/edbac164b49713a6c32fd7f318b5232c4a69d289

#### 7. Malfunction on managed pools
##### Files
https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol
##### Description
Once initialized, the strategy will not proceed further changes in tokens set of balancer pool. However, [pool of managed type](https://docs.balancer.fi/products/balancer-pools/managed-pools) can change its set of tokens. It can lead to undesired behaviour of the strategy. 
##### Recommendation
We recommend to perform check that pool is not `managed type` during strategy initialization, or at least describe this requirement.
##### Status
Acknowledged
##### Client's commentary:
This strategy only applies to stable and metastable pools, which don't have the same managed functionality.

#### 8. Unused `receive()` function
##### Description
At line
https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol#L422

The contract implements function to receive ether, however, the contract's logic does not implement any further use of ether. Any ether transferred to the contract will be frozen (unaccessible).

##### Recommendation
We recommend to disable receiving of ether to the contract.
##### Status
Acknowledged
##### Client's commentary:
This function is required because `Balancer` swaps requires the receiving address to be payable.

**AUDITOR'S COMMENT:**
Removing `receive()` will not affect interaction with `Balancer` because `ether` is not transferred.

#### 9. Strategy's outstanding debt is not accounted in `adjustPosition()`
##### Description
Argument `_debtOutstanding` is unused in method `adjustPosition()` at https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol#L189. As a result, strategy joins pool with `amountIn` of want token that does not account strategy's outstanding debt.
##### Recommendation
We recommend to calculate `amountIn` as following:
```
uint256 amountIn = Math.min(maxSingleDeposit, balanceOfWant().sub(_debtOutstanding));
```
##### Status
Acknowledged
##### Client's commentary:
Since `adjustPosition()` does not exit any funds, `_debtOutstanding` is intentionally ignored here so that any idle funds can be utilized until the next harvest.

**AUDITOR'S COMMENT:**
We recommend to avoid any utilization of outstanding debt, because this debt is intended to be returned to the vault ASAP.

#### 10. `Balancer` LP token is not in `protected tokens` list
##### Description
`BaseStrategy` implements `sweep()` function that can rescue accidently transferred tokens from being locked at the strategy. Tokens used by the strategy should be protected from being `sweep()`-ed. Such tokens should be enumerated by `protected tokens`. However, `balancer` LP tokens `bpt` are not in the `protected tokens` list https://github.com/tonkers-kuma/strategy-ssb/blob/e49d07a64ea0eb4f5a199c2bf9ea4c8aee2b313f/contracts/Strategy.sol#L262
##### Recommendation
We recommend to add `bpt` token to the `protected tokens`
##### Status
Acknowledged
##### Client's commentary:
This is intentional. `protectedTokens()` is left empty so that during emergencies, governance can step in to rescue any positions
**AUDITOR'S COMMENT:**
We recommend to avoid using `sweep()` function for emergency rescue of strategy's tokens, because `sweep()` is intended for rescue of accidently transfered funds, not for emergencies. The `bpt` can be rescued by migration.

## Results
### Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 0
WARNING | 0
COMMENT | 10

### Conclusion
During the audit process, some comments were detected, 4 of them were FIXED by developer and 6 issues were ACKNOWLEDGED. Issues marked ACKNOWLEDGED make no significant impact on overall security of the project.

Final commit identifier with all fixes: `edbac164b49713a6c32fd7f318b5232c4a69d289`
<br/>

**CONTRACT DEPLOYMENT**
The following addresses contain deployed to the Ethereum mainnet and verified smart contracts code that matches audited scope:
- https://etherscan.io/address/0x9cfF0533972da48Ac05a00a375CC1a65e87Da7eC#code
- https://etherscan.io/address/0x3ef6Ec70D4D8fE69365C92086d470bb7D5fC92Eb#code
- https://etherscan.io/address/0x7A32aA9a16A59CB335ffdEe3dC94024b7F8A9a47#code
- https://etherscan.io/address/0x7c1612476D235c8054253c83B98f7Ca6f7F2E9D0#code