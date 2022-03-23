# Anchor Collateral stETH Security Audit Report (merged)


###### tags: `LIDO`

## Introduction
### Project overview
LIDO protocol is a project for staking Ether to use it in Beacon chain.  Users can deposit Ether to the Lido smart
contract and receive stETH tokens in return. The stETH token balance corresponds to the amount of Beacon chain
Ether that the holder could withdraw if state transitions were enabled right now in the Ethereum 2.0 network.
The Lido DAO is a Decentralized Autonomous Organization that manages the liquid staking protocol by deciding on key
parameters (e.g., setting fees, assigning node operators and oracles, etc.) through the voting power of governance token (DPG) holders.
The Lido DAO is an Aragon organization. The protocol smart contracts extend AragonApp base contract and can be managed by the DAO.

Anchor Vault is a smart contract that allows to convert rebasing stETH token into a constant-balance bETH token and 
periodically send all accrued stETH rewards to the Terra blockchain through a bridge. The bETH token is used as a 
collateral in the Terra Anchor protocol.
`RewardsLiquidator`, `InsuranceConnector` and `BridgeConnectorWormhole` contracts are installed as delegates to the `AnchorVault` 
contract and are used by the latter for performing various tasks (see the description above). 
These contracts can be replaced by the vault admin.
The `BridgeConnectorWormhole` contract is designed to interoperate with the Wormhole Ethereum-Terra bridge.

Contracts:
- `AnchorVault` - the main vault contract
- `AnchorVaultProxy` - proxy contract for AnchorVault
- `bEth` - bETH token contract
- `RewardsLiquidator` - a contract for selling stETH rewards to UST
- `InsuranceConnector` - a contract for obtaining the total number of shares burnt for the purpose of insurance/cover application from the Lido protocol
- `BridgeConnectorWormhole` - an adapter contract for communicating with the Wormhole bridge


### Scope of the Audit

- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/AnchorVault.vy 
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/AnchorVaultProxy.sol 
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/bEth.vy
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/RewardsLiquidator.vy 
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/InsuranceConnector.vy 
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/BridgeConnectorWormhole.vy 

The audited commit identifier is `8d52ce72cb42d48dff1851222e3b624c941ddb30`


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

#### 1. Token Bridging doesn't work with Wormhole fees
##### Description
Line 
- https://github.com/certusone/wormhole/blob/9bc408ca1912e7000c5c2085215be9d44713028b/ethereum/contracts/bridge/Bridge.sol#L93
has a `transferTokens ()` function of type `payable`. In the body of this function, on line 133, a call to the internal 
function `logTransfer ()` is made and one of the parameters `msg.value` is passed.
At line  
- https://github.com/certusone/wormhole/blob/9bc408ca1912e7000c5c2085215be9d44713028b/ethereum/contracts/bridge/Bridge.sol#L151
from the `logTransfer()` function, the `publishMessage()` function is called.
The `publishMessage()` function of type `payable` on the line:
- https://github.com/certusone/wormhole/blob/9bc408ca1912e7000c5c2085215be9d44713028b/ethereum/contracts/Implementation.sol#L21
the condition for payment of the commission must be met.
```
   require(msg.value == messageFee(), "invalid fee");
```

In the checked contract, at line 
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/BridgeConnectorWormhole.vy#L49
a call to the `transferTokens()` function from the `_transfer_asset()` function is made. 
But there is no `@payable` modifier anywhere and no `msg.value` value handling.
Therefore, the `_transfer_asset()` function will not work.
As a result, the `submit ()` and `collect_rewards ()` functions will not work in the `AnchorVault.vy` contract, 
because there is no commission fee for the `Wormhole` system.
##### Recommendation
It is required to add a commission payment for the `Wormhole` system.
##### Status
Acknowledged
##### Client's commentary
The issue is acknowledged. The `messageFee` is currently set to 0 in bridge settings. The Wormhole team stated that “there is no plan or timeline at the moment” for changing the fee value from zero. The `BridgeConnectorWormhole` is changed to support non-zero fee. Note that to accomodate to non-zero fee in Wormhole changes to AnchorVault would be required as well.
<br/>

**AUDITOR'S COMMENTARY**
Commit `9dd1e3433dd3d0360b95cf9470dd8af29dfce9e9` has fixes for the BridgeConnectorWormhole contract. There are no changes in the AnchorVault contract yet.

### WARNINGS

#### 1. There is no processing of the value returned by the function.
##### Description
In the ERC-20 standard, when processing tokens, if successful, `true` is returned.
And this value should always be checked.
But in the audited code, checks are not done.
The following lines:
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/AnchorVault.vy#L381
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/AnchorVault.vy#L383
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/AnchorVault.vy#L414
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/AnchorVault.vy#L488
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/RewardsLiquidator.vy#L278 
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/RewardsLiquidator.vy#L321 
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/RewardsLiquidator.vy#L345 
- https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/BridgeConnectorWormhole.vy#L44 
##### Recommendation
It is recommended to add processing of the value returned by the function.
##### Status
Acknowledged
##### Client's commentary
The warning is considered no issue. `ERC20` calls in `AnchorVault`, `RewardsLiquidator` target `StETH`, `Wrapped UST` & `USDC` token contracts, which either returns `true` or revert. Check for returned value of `approve` call in `BridgeConnectorWormhole` is added.


#### 2. No checking value for zero
##### Description
There is a possible scenario where collected rewards may be sent to zero address if `rewards_distributor` is uninitialized 
https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/AnchorVault.vy#L491
##### Recommendation
It is recommended to check if `rewards_distributor` is uninitialized.
##### Status
Acknowledged
##### Client's commentary
The warning is considered no issue. The contract `AnchorVault` is deployed https://etherscan.io/address/0xA2F987A546D4CD1c607Ee8141276876C26b72Bdf & the `rewards_distributor` field is initialized.


#### 3. Adjusted stETH return transfer fee may be more expensive than dust amount
##### Description
`steth_amount - steth_amount_adj` value may be less than `transfer` fee cost. 
https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/AnchorVault.vy#L383
The same situation is there for the variable `steth_to_sell` at line:
https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/AnchorVault.vy#L488
##### Recommendation
It is recommended to calculate if there is a sufficient difference between the adjusted eth and original amount to return. 
You can add a check for the minimum value.
##### Status
Acknowledged
##### Client's commentary
The warning is considered no issue. The calculation would increase the gas costs of user operations for the `AnchorVault`, while not contributing to the safety or usability of the integration.


#### 4. An unfavorable exchange may occur
##### Description
At the lines: 
https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/RewardsLiquidator.vy#L306-L308 
and 
https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/RewardsLiquidator.vy#L329-L331 
if the initial USDC or UST balance + exchanged tokens are bigger than min required swap amount then an unfavorable swap may occur.
Actually, it is safe for the project.
##### Recommendation
It is recommended to calc swapped amount with difference balance from and balance after.
This is not a planned behavior that needs to be handled.
##### Status
Acknowledged
##### Client's commentary
The warning is considered no issue. If the exchange route would turn unfavorable for the integration, another implementation of the `RewardsLiquidator` could be developed & deployed.


### COMMENTS

#### 1. The function can be decomposed
##### Description
At the line
https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/RewardsLiquidator.vy#L262-L357
`liquidate()` function can be decomposed to three internal functions.
##### Recommendation
It is recommended to make three separate internal functions instead of one long function.
##### Status
Acknowledged
##### Client's commentary
The comment is considered no issue. Current implementation is optimized for lower gas consumption.


#### 2. An unnecessary comment
##### Description
At the line 
https://github.com/lidofinance/anchor-collateral-steth/blob/8d52ce72cb42d48dff1851222e3b624c941ddb30/contracts/AnchorVault.vy#L164
there is an unnecessary comment `# dev: unauthorized`.
##### Recommendation
It is recommended to delete this comment.
##### Status
Acknowledged
##### Client's commentary
The comment is considered no issue. The `AnchorVault` contract is deployed https://etherscan.io/address/0xA2F987A546D4CD1c607Ee8141276876C26b72Bdf, and the comment could be cleared out on the next implementation migration.


## Results



### Conclusion
Smart contracts have been audited and several suspicious places have been detected. During the audit no critical issues were found, one major, several warnings and comments were spotted. After working on the reported findings all of them were acknowledged by the client.

Final commit identifier with all fixes: `9dd1e3433dd3d0360b95cf9470dd8af29dfce9e9`
<br/>

**CONTRACTS DEPLOYMENT**
The following addresses contain deployed to the Ethereum mainnet and verified smart contracts code that matches audited scope:
<br/>

- AnchorVaultProxy: [0xa2f987a546d4cd1c607ee8141276876c26b72bdf](https://etherscan.io/address/0xa2f987a546d4cd1c607ee8141276876c26b72bdf#code)
- AnchorVault.vy: [0x0627054d17eae63ec23c6d8b07d8db7a66ffd45a](https://etherscan.io/address/0x0627054d17eae63ec23c6d8b07d8db7a66ffd45a#code)
- bEth.vy: [0x707f9118e33a9b8998bea41dd0d46f38bb963fc8](https://etherscan.io/address/0x707f9118e33a9b8998bea41dd0d46f38bb963fc8#code)
- RewardsLiquidator.vy: [0xe3c8a4de3b8a484ff890a38d6d7b5d278d697fb7](https://etherscan.io/address/0xe3c8a4de3b8a484ff890a38d6d7b5d278d697fb7#code)
- InsuranceConnector.vy: [0x2bdfd3de0ff23373b621cdad0ad3df1580efe701](https://etherscan.io/address/0x2bdfd3de0ff23373b621cdad0ad3df1580efe701#code)
- BrigdeConnectorWormhole: [0x2618e94a7F6118acED2E51e0a05da43D2e2eD40C](https://etherscan.io/address/0x2618e94a7F6118acED2E51e0a05da43D2e2eD40C#code)