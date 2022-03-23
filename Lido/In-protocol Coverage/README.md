# In-protocol coverage Security Audit Report 


###### tags: `LIDO`

## Introduction
### Project overview
LIDO protocol is a project for staking Ether to use it in Beacon chain.  Users can deposit Ether to the Lido smart contract and receive stETH tokens in return. The stETH token balance corresponds to the amount of Beacon chain Ether that the holder could withdraw if state transitions were enabled right now in the Ethereum 2.0 network.
The Lido DAO is a Decentralized Autonomous Organization that manages the liquid staking protocol by deciding on key parameters (e.g., setting fees, assigning node operators and oracles, etc.) through the voting power of governance token (DPG) holders.
The Lido DAO is an Aragon organization. The protocol smart contracts extend AragonApp base contract and can be managed by the DAO.

Currently, Lido has no adopted and well-defined mechanism of applying coverage for stakeholders' losses due to validators penalties, slashing and other conditions.
The researched smart contracts solve this problem. The contract enacts pending burning requests as a part of the next oracle report by burning all associated stETH tokens from its own balance.
The proposed contracts are non-upgradable and non-ownable.

Contracts:
- `OrderedCallbacksArray` - is defining an ordered callbacks array supporting add/insert/remove ops.
- `CompositePostRebaseBeaconReceiver` - is defining a composite post-rebase beacon receiver for the Lido oracle.
- `SelfOwnedStETHBurner` - is dedicated contract for enacting stETH burning requests.

### Scope of the Audit

- https://github.com/lidofinance/lido-dao/blob/ee1991b3bbea2a24b042b0a4433be04301992656/contracts/0.8.9/CompositePostRebaseBeaconReceiver.sol
- https://github.com/lidofinance/lido-dao/blob/ee1991b3bbea2a24b042b0a4433be04301992656/contracts/0.8.9/OrderedCallbacksArray.sol
- https://github.com/lidofinance/lido-dao/blob/ee1991b3bbea2a24b042b0a4433be04301992656/contracts/0.8.9/SelfOwnedStETHBurner.sol
<br/>
The audited commit identifier is `ee1991b3bbea2a24b042b0a4433be04301992656`


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

#### 1. Possibility of taking burned shares
##### Description
With attack it is possible to take burned shares profit even without taking shares before `processLidoOracleReport()` execution.
https://github.com/lidofinance/lido-dao/blob/ee1991b3bbea2a24b042b0a4433be04301992656/contracts/0.8.9/SelfOwnedStETHBurner.sol#L252
This exploit shows how the attack is done:
https://gist.github.com/georgiypetrov/22c0649058a97102e2fd97a1c619a3b3
If this is a front-run attack, then it will be the most convenient for the attacker.
##### Recommendation
It is necessary to add a limit on the amount of burned tokens.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/3d6a3f527e27a87e33c97726cce7de1ae7262d9f
##### Client's commentary
Recommendation implemented, commits: 
https://github.com/lidofinance/lido-dao/pull/389/commits/6bed77d393c79eceb51eee6e69b8f41bd41ae151
https://github.com/lidofinance/lido-dao/pull/389/commits/b076c6cf0f43ec44ff08a868560528c2376fb9d5
https://github.com/lidofinance/lido-dao/pull/389/commits/f3d8950a3e52ea994015f7294d69462336c30399
Updated spec: https://github.com/lidofinance/lido-improvement-proposals/blob/lip-6/LIPS/lip-6.md


### MAJOR

Not found


### WARNINGS

#### 1. There is no processing of the value returned by the function
##### Description
At the line
https://github.com/lidofinance/lido-dao/blob/ee1991b3bbea2a24b042b0a4433be04301992656/contracts/0.8.9/SelfOwnedStETHBurner.sol#L228
the `transfer()` function returns a boolean variable. But this variable is not processed in any way.
Similarly for the line:
https://github.com/lidofinance/lido-dao/blob/ee1991b3bbea2a24b042b0a4433be04301992656/contracts/0.8.9/SelfOwnedStETHBurner.sol#L203.
##### Recommendation
It is necessary to add processing of the values returned by the function.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/pull/389/commits/90af185ecb7012ac0e5b806c8c99cdf61b379133
##### Client's commentary
Implemented with the following commit:
https://github.com/lidofinance/lido-dao/pull/389/commits/90af185ecb7012ac0e5b806c8c99cdf61b379133


### COMMENTS

#### 1. Extra operation
##### Description
At the line
https://github.com/lidofinance/lido-dao/blob/ee1991b3bbea2a24b042b0a4433be04301992656/contracts/0.8.9/SelfOwnedStETHBurner.sol#L223
checks the value of the `_token` variable. But if the value of the variable is zero, then the code on line 228 will not be executed.
Similarly for the line:
https://github.com/lidofinance/lido-dao/blob/ee1991b3bbea2a24b042b0a4433be04301992656/contracts/0.8.9/SelfOwnedStETHBurner.sol#L239
##### Recommendation
It is necessary to remove redundant operations.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/pull/389/commits/c39faa7f70cdf2038a9d065c077ff67c98fe69b4
##### Client's commentary
Implemented with the following commit:
https://github.com/lidofinance/lido-dao/pull/389/commits/c39faa7f70cdf2038a9d065c077ff67c98fe69b4



## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| 1
MAJOR   | 0
WARNING | 1
COMMENT | 1

### Conclusion
Smart contracts have been audited and several suspicious places have been found. The review found one critical issue, one warning, and one comment. After working on the reporting findings, all of them were confirmed and fixed by the client.
<br/>
Final commit identifier with all fixes: `3d6a3f527e27a87e33c97726cce7de1ae7262d9f`
<br/>

The following addresses contain deployed to the Ethereum mainnet and verified smart contracts code that matches audited scope:
<br/>

- SelfOwnedStETHBurner.sol: [0x1e0C8542A59c286e73c30c45612d9C3a674A6cbC](https://etherscan.io/address/0x1e0C8542A59c286e73c30c45612d9C3a674A6cbC#code)
- CompositePostRebaseBeaconReceiver.sol: [0xEdd972c22870726F30253efa88a08608F9748907](https://etherscan.io/address/0xEdd972c22870726F30253efa88a08608F9748907#code)
- OrderedCallbacksArray.sol: [0xEdd972c22870726F30253efa88a08608F9748907](https://etherscan.io/address/0xEdd972c22870726F30253efa88a08608F9748907#code)
