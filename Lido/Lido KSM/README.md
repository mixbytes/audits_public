# LIDO KSM Security Audit Report 


###### tags: `lido-dot-ksm`

## Introduction
### Project overview
Lido KSM is a Liquid staking protocol on the Kusama network (Polkadot) deployed in the Moonriver parachain network. Its purpose is to let users receive income from KSM (DOT) staking without restrictions imposed by the Kusama network, such as blocking liquidity for a long time. Lido is a set of EVM-compatible smart contracts operating in the Moonriver/Moonbeam environment and relay-chain (Kusama/Polkadot) XCMP messages.

`Lido.sol` contract is the core contract which acts as a liquid staking pool.
The contract is responsible for `xcKSM` deposits and withdrawals, minting and burning `stKSM`, delegating funds to node operators, applying fees, and accepting updates from the oracle contract. 

The smart contracts reviewed in this audit are designed wherein Lido also acts as an ERC20 token which represents staked `xcKSM`,`stKSM`. Tokens are minted upon deposit and burned when redeemed.`stKSM` tokens are pegged 1:1 to the `xcKSM` ones that are held by Lido. `stKSM` tokens balances are updated when the oracle reports change in total stake every era.


### Scope of the Audit

- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/AuthManager.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Controller.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Ledger.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/OracleMaster.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Oracle.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/stKSM.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/utils/LedgerUtils.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/utils/ReportUtils.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/interfaces/IAuthManager.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/interfaces/IController.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/interfaces/ILedger.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/interfaces/ILido.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/interfaces/IOracleMaster.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/interfaces/IOracle.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/interfaces/IRelayEncoder.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/interfaces/IXcmTransactor.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/interfaces/IxTokens.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/interfaces/Types.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/da1accb85e028b0d5e1e5ed1c10622e852d9b43b/contracts/LedgerFactory.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/da1accb85e028b0d5e1e5ed1c10622e852d9b43b/contracts/Withdrawal.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/da1accb85e028b0d5e1e5ed1c10622e852d9b43b/contracts/wstKSM.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/da1accb85e028b0d5e1e5ed1c10622e852d9b43b/contracts/proxy/LedgerBeacon.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/da1accb85e028b0d5e1e5ed1c10622e852d9b43b/contracts/proxy/LedgerProxy.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/da1accb85e028b0d5e1e5ed1c10622e852d9b43b/contracts/utils/WithdrawalQueue.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/da1accb85e028b0d5e1e5ed1c10622e852d9b43b/interfaces/IWithdrawal.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/da1accb85e028b0d5e1e5ed1c10622e852d9b43b/interfaces/ILedgerFactory.sol
- https://github.com/mixbytes/lido-dot-ksm/blob/da1accb85e028b0d5e1e5ed1c10622e852d9b43b/interfaces/IvKSM.sol

The audited commits identifiers are `76a10efa5f223c4c613f26794802b8fb9bb188e1`, `130bdc416933cb57ff5bf279e74d3f48decf224e`, `da1accb85e028b0d5e1e5ed1c10622e852d9b43b`

## Findings Severity breakdown

### Classification of Issues

* CRITICAL: Bugs leading to assets theft, fund access locking, or any other loss funds to be transferred to any party.
* MAJOR: Bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement.
* WARNINGS: Bugs that can break the intended contract logic or expose it to DoS attacks.
* COMMENTS: Other issues and recommendations reported to / acknowledged by the team.

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
#### 1. Possible underflow
##### Description
If a ledger's stake drammaticaly decreases due to rebalance and after that the ledger receives a huge slash, then underflow can occur: https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L608

##### Recommendation
We recommend distributing slashes across all the ledgers.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed

#### 2. Possible overflow on cast to uint
##### Description
If `newStake` is a negative number, then overflow can occur: https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L730

##### Recommendation
We recommend checking overall diff in order to exclude such scenarios.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed


### MAJOR
#### 1. Public access to all functions
##### Description
In contract `Controller` all functions have public access which can be exploited:
https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Controller.sol

##### Recommendation
We recommend adding access modificators.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed

#### 2. Controller can be initialized several times
##### Description
In contract `Controller` the `initialize` function can be called several times: https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Controller.sol#L140

##### Recommendation
We recommend adding the `initializer` modifier.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed

#### 3. Incorrect condition
##### Description
The condition is incorrect here that can lead to an infinite loop: https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L748

##### Recommendation
We recommend changing `||` into `&&`.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed

#### 4. Possible burn of zero shares
##### Description
Due to rounding errors a user can burn zero shares: https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L522

##### Recommendation
We recommend adding a check so that a user couldn't burn zero shares.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed

#### 5. Possible division by zero
##### Description
In some cases division by zero can take place here:
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L658
- https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L708

##### Recommendation
We recommend to set a stake to zero if the overall shares amount is equal to zero.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed

#### 5. Insufficient xcKSm balance on `Lido`
##### Description
It is possible that `Lido` can have less than `_readyToClaim` : https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L563

##### Recommendation
We recommend to add a requirement that `Lido` would have enough tokens to transfer.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed

#### 6. Possible zero balance on `Lido`
##### Description
It is possible that `Lido` can have zero balance on reward distribution: https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L588

##### Recommendation
We recommend to add a check for the case when `Lido` has zero balance on reward distribution.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed

#### 7. Possible underflow
##### Description
It is possible that free balance from the report can be less than free balance from the previous era: https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Ledger.sol#L297

##### Recommendation
We recommend to add a variable to control which amount should be bonded on the next era.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed


### WARNINGS
#### 1. Possible free tokens on Ledger
##### Description
If someone sends `xcKSM` to Ledger: https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Ledger.sol#L282

##### Recommendation
We recommend sendig excess in funds to treasury.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed

#### 2. Rewards can be lost
##### Description
If these addresses have been set to 0, then the rewards can be lost:
https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L218
https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L225
https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L318
https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L328

##### Recommendation
We recommend adding a zero address check.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed


### COMMENTS
#### 1. Unusable variable
##### Description
The variable is defined and initialized, but not used in the smart contract:
https://github.com/mixbytes/lido-dot-ksm/blob/76a10efa5f223c4c613f26794802b8fb9bb188e1/contracts/Lido.sol#L201

##### Recommendation
We recommend removing this variable.

##### Status
Fixed at https://github.com/mixbytes/lido-dot-ksm/commit/130bdc416933cb57ff5bf279e74d3f48decf224e

##### Client's commentary
Fixed

## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| 2
MAJOR   | 7
WARNING | 2
COMMENT | 1

### Conclusion
The smart contracts have been audited and several suspicious places were found. During the audit 2 critical and 7 major issues were identified.  Several issues were marked as warnings. Havig worked on the audit report, all issues were fixed by the client. Thus, the contracts are assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `2f2725faa0bc371e4d1ddfceacd8c45d8f0905f8`