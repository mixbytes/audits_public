# Lido Protocol Security Audit Report 

###### tags: `LIDO`

## 1. INTRODUCTION

### 1.1 Disclaimer
The audit makes no statements or warranties about utility of the code, safety of the code, suitability of the business model, investment advice, endorsement of the platform or its products, regulatory regime for the business model, or any other statements about fitness of the contracts to purpose, or their bug free status. The audit documentation is for discussion purposes only. The information presented in this report is confidential and privileged. If you are reading this report, you agree to keep it confidential, not to copy, disclose or disseminate without the agreement of Lido. If you are not the intended recipient(s) of this document, please note that any disclosure, copying or dissemination of its content is strictly forbidden.


### 1.2 Security Assessment Methodology

A group of auditors are involved in the work on the audit. The security engineers check the provided source code independently of each other in accordance with the methodology described below:

#### 1. Project architecture review:

* Project documentation review.
* General code review.
* Reverse research and study of the project architecture on the source code alone.


##### Stage goals
* Build an independent view of the project's architecture.
* Identifying logical flaws.


#### 2. Checking the code in accordance with the vulnerabilities checklist:

* Manual code check for vulnerabilities listed on the Contractor's internal checklist. The Contractor's checklist is constantly updated based on the analysis of hacks, research, and audit of the cients' codes.
* Code check with the use of static analyzers (i.e Slither, Mythril, etc).

##### Stage goal 
Eliminate typical vulnerabilities (e.g. reentrancy, gas limit, flash loan attacks etc.).

#### 3. Checking the code for compliance with the desired security model:

* Detailed study of the project documentation.
* Examination of contracts tests.
* Examination of comments in code.
* Comparison of the desired model obtained during the study with the reversed view obtained during the blind audit.
* Exploits PoC development with the use of such programs as Brownie and Hardhat.

##### Stage goal
Detect inconsistencies with the desired model.



#### 4. Consolidation of the auditors' interim reports into one:
* Cross check: each auditor reviews the reports of the others.
* Discussion of the issues found by the auditors.
* Issuance of an interim audit report.

##### Stage goals
* Double-check all the found issues to make sure they are relevant and the determined threat level is correct.
* Provide the Customer with an interim report.


#### 5. Bug fixing & re-audit:
* The Customer either fixes the issues or provides comments on the issues found by the auditors. Feedback from the Customer must be received on every issue/bug so that the Contractor can assign them a status (either "fixed" or "acknowledged").
* Upon completion of the bug fixing, the auditors double-check each fix and assign it a specific status, providing a proof link to the fix.
* A re-audited report is issued. 

##### Stage goals
* Verify the fixed code version with all the recommendations and its statuses.
* Provide the Customer with a re-audited report.

#### 6. Final code verification and issuance of a public audit report: 
* The Customer deploys the re-audited source code on the mainnet.
* The Contractor verifies the deployed code with the re-audited version and checks them for compliance.
* If the versions of the code match, the Contractor issues a public audit report. 

##### Stage goals
* Verify the fixed code version with all the recommendations and its statuses.
* Provide the Customer with a re-audited report.


#### Finding Severity breakdown

All vulnerabilities discovered during the audit are classified based on their potential severity and have the following classification:

Severity | Description
--- | ---
Critical | Bugs leading to assets theft, fund access locking, or any other loss funds to be transferred to any party. 
High     | Bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement.
Medium   | Bugs that can break the intended contract logic or expose it to DoS attacks, but do not cause direct loss funds.
Low | Other non-essential issues and recommendations reported to/ acknowledged by the team.



Based on the feedback received from the Customer regarding the list of findings discovered by the Contractor, they are assigned the following statuses:

Status | Description
--- | ---
Fixed        | Recommended fixes have been made to the project code and no longer affect its security.
Acknowledged | The Customer is aware of the finding. Recommendations for the finding are planned to be resolved in the future.

### 1.3 Project Overview

LIDO protocol is a project for staking Ether to use it in the Beacon chain.  Users can deposit Ether to the Lido smart contract and receive stETH tokens in return. The stETH token balance corresponds to the amount of the Beacon chain Ether that the holder could withdraw if state transitions were enabled right now in the Ethereum 2.0 network.
The Lido DAO is a Decentralized Autonomous Organization that manages the liquid staking protocol by deciding on key parameters (e.g., setting fees, assigning node operators and oracles, etc.) through the voting power of governance token (LDO) holders.
The Lido DAO is an Aragon organization. The protocol smart contracts extend the AragonApp base contract and can be managed by the DAO.

This scope contains contracts that include the following logic: 

- [LIP-6: In-protocol coverage application mechanism](https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-6.md) 
- [LIP-7: Composite oracle beacon report receiver](https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-7.md) 
- [LIP-8: Increase keysOpIndex in assignNextSigningKeys](https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-8.md)
- [LIP-9: Add an explicit log for the stETH burn events](https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-9.md) 
- [LIP-10: Proxy initializations and LidoOracle upgrade](https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-10.md) 
- [LIP-11: Add a transfer shares function for stETH](https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-11.md) 
- [LIP-12: On-chain part of the rewards distribution after the Merge](https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-12.md) 
- [LIP-14: Protocol safeguards. Staking rate limiting](https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-14.md) 
- [LIP-15: Protocol safeguards. Resume role](https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-15.md) 

Main interacting contracts:
`Lido` - The contract contains the basic logic for accepting deposits from Ethereum 1.0 and transferring them to the Beacon chain.
`NodeOperatorsRegistry` - This contract stores the data on deposits of all validators that will be registered by the protocol. Each deposit data record contains, among other things, the public key of the validator. 
`DepositSecurityModule` - This is a contract created for committee members and the safe call of the `depositBufferedEther()` function in Lido's contract.

`deposit_contract` - This contract is required for the Beacon chain deposits and is made according to the specification https://github.com/ethereum/eth2.0-specs. It hasn't been changed.
`OrderedCallbacksArray` - This defines an ordered callbacks array supporting add/insert/remove ops.
`CompositePostRebaseBeaconReceiver` - This defines a composite post-rebase beacon receiver for the Lido oracle.
`SelfOwnedStETHBurner` - This is a dedicated contract for enacting stETH burning requests.
`StETH` - This contract implements the logic for the StETH token. StETH balances are dynamic and represent the holder's share in the total amount of Ether controlled by the protocol.
`WstETH` - This contract implements the logic for the WstETH token. This is a StETH token wrapper with static balances. WstETH token's balance only changes on transfers, unlike StETH that is also changed when oracles report staking rewards and penalties.
`LidoExecutionLayerRewardsVault.sol` - This is a vault for temporary storage of the execution layer rewards (MEV and transaction fees).
`ECDSA` - This is a library for getting an address from the encoded data. Imported from OpenZeppelin.
`StakeLimitUtils` - The helper library to implement stake rate limiting low-level calculations.
`MemUtils`, `Pausable`, `BytesLib`, `ReportUtils` - These contracts contain various helper libraries.


### 1.4 Project Dashboard

#### Project Summary

Title | Description
--- | ---
Client             | Lido
Project name       | Lido Protocol
Interim audit timeline (Core Protocol)           | January 31, 2022 - February 17, 2022
Interim audit timeline (Stake limit)| April 25, 2022 - April 27, 2022
Interim audit timeline (Merge-ready protocol code with final changes) | May 19, 2022 - May 23, 2022
Number of auditors | 4

#### Project Log

Date | Commit Hash | Note
--- | --- | --- 
31-01-2022       | 801d3e854efb33ff33a59fe51187e187047a6be2    | Initial audit. 
28-02-2022       | b1fd2dc424567f206ea690e1a708f4584fe5231f    | Reaudit based on the fixes provided.
25-04-2022       | 2c54f043c22cd8a23e8b8407ba7abff2c0f681ba    | Additional stake limit audit.
19-05-2022       | 08436ce13d67501fa723169c1dc69fe47b90cde4    | Merge-ready protocol code audit. The LidoMevTxFeeVault contract has been renamed to LidoExecutionLayerRewardsVault.

#### Project Scope
The audit covered the following files:

File name | Link
--- | ---
NodeOperatorsRegistry.sol | https://github.com/lidofinance/lido-dao/blob/08436ce13d67501fa723169c1dc69fe47b90cde4/contracts/0.4.24/nos/NodeOperatorsRegistry.sol
StETH.sol | https://github.com/lidofinance/lido-dao/blob/08436ce13d67501fa723169c1dc69fe47b90cde4/contracts/0.4.24/StETH.sol
Lido.sol | https://github.com/lidofinance/lido-dao/blob/08436ce13d67501fa723169c1dc69fe47b90cde4/contracts/0.4.24/Lido.sol
ReportUtils.sol | https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/oracle/ReportUtils.sol
LidoOracle.sol | https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/oracle/LidoOracle.sol
MemUtils.sol | https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/lib/MemUtils.sol
Pausable.sol | https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/lib/Pausable.sol
deposit_contract.sol | https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.6.11/deposit_contract.sol
WstETH.sol | https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.6.12/WstETH.sol
DepositSecurityModule.sol | https://github.com/lidofinance/lido-dao/blob/08436ce13d67501fa723169c1dc69fe47b90cde4/contracts/0.8.9/DepositSecurityModule.sol
ECDSA.sol | https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.8.9/lib/ECDSA.sol
CompositePostRebaseBeaconReceiver.sol | https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.8.9/CompositePostRebaseBeaconReceiver.sol
OrderedCallbacksArray.sol | https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.8.9/OrderedCallbacksArray.sol
SelfOwnedStETHBurner.sol | https://github.com/lidofinance/lido-dao/blob/08436ce13d67501fa723169c1dc69fe47b90cde4/contracts/0.8.9/SelfOwnedStETHBurner.sol
LidoExecutionLayerRewardsVault.sol | https://github.com/lidofinance/lido-dao/blob/08436ce13d67501fa723169c1dc69fe47b90cde4/contracts/0.8.9/LidoExecutionLayerRewardsVault.sol
StakeLimitUtils.sol | https://github.com/lidofinance/lido-dao/blob/08436ce13d67501fa723169c1dc69fe47b90cde4/contracts/0.4.24/lib/StakeLimitUtils.sol


### 1.5 Summary of findings

Severity | # of Findings
--- | ---
CRITICAL| 0
HIGH    | 1
MEDIUM  | 7
LOW     | 7

### 1.6 Conclusion


Smart contracts have been audited and several suspicious places have been detected. During the audit, no critical vulnerabilities were found. One high, seven medium, and seven low issues were identified. After working on the reported findings, all of them were confirmed and fixed by the client and two findings were acknowledged.

Final commit identifier with all fixes: `08436ce13d67501fa723169c1dc69fe47b90cde4`


File name | Contract deployed on mainnet
--- | ---
Lido.sol | https://etherscan.io/address/0x47EbaB13B806773ec2A2d16873e2dF770D130b50#code
WstETH.sol | https://etherscan.io/address/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0#code
LidoOracle.sol | https://etherscan.io/address/0x1430194905301504e8830ce4B0b0df7187E84AbD#code
NodeOperatorsRegistry.sol | https://etherscan.io/address/0x5d39ABaa161e622B99D45616afC8B837E9F19a25#code
LidoExecutionLayerRewardsVault.sol | https://etherscan.io/address/0x388C818CA8B9251b393131C08a736A67ccB19297#code
DepositSecurityModule.sol | https://etherscan.io/address/0x710B3303fB508a84F10793c1106e32bE873C24cd#code
CompositePostRebaseBeaconReceiver.sol | https://etherscan.io/address/0x55a7E1cbD678d9EbD50c7d69Dc75203B0dBdD431#code
SelfOwnedStETHBurner.sol | https://etherscan.io/address/0xB280E33812c0B09353180e92e27b8AD399B07f26#code
deposit_contract.sol | https://etherscan.io/address/0x00000000219ab540356cbb839cbe05303d7705fa#code

## 2. FINDINGS REPORT

### 2.1 Critical

Not found


### 2.2 High

#### 1. Opportunity to add bufferedETH without submitting to LIDO
##### Description
It is possible to send ETH to the `LidoMevTxFeeVault` contract and when the oracle reports contract sends ETH to LIDO, which will be used to rewards, it may fluctuate the price of lido shares.
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.8.9/LidoMevTxFeeVault.sol#L79
##### Recommendation
We recommend that the `LidoMevTxFreeVault` contract should receive ETH only from authorized addresses or the `withdrawRewards()` function should have limits.

##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/e3b84476d20c51d2ce95dfd9f289d34bd902c0f7/

### 2.3 Medium

#### 1. Extra function
##### Description
At lines
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/Lido.sol#L139-L142
and at lines
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/Lido.sol#L158-L165
similar actions are performed.
But in one case there is a change in the `TOTAL_MEV_TX_FEE_COLLECTED_POSITION` variable, and in the other case there is none.
One of these functions is redundant.
##### Recommendation
Need to remove the redundant feature.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/2f49e4b16eb5610f1397b6901dea15aa49e3fa86/


#### 2. No validation of the address parameter value in the contract constructor
##### Description
The variable is assigned the value of the constructor input parameter. But this parameter is not checked before this. If the value turns out to be zero, then it will be necessary to redeploy the contract, since there is no other functionality to set this variable.
At line 
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.8.9/LidoMevTxFeeVault.sol#L72 
the `TREASURY` variable is set to the value of the `_treasury` input parameter.
##### Recommendation
It is necessary to add a check of the input parameter to zero before initializing the variable.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/c8b065c1b8e8aa39164bd6edb594254d5ffa3a12/



#### 3. Max oracle members amount is actually lower
##### Description
Max members are 255 instead of 256 which may affect the quorum:
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/oracle/LidoOracle.sol#L432
##### Recommendation
The check needs to be corrected.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/2c592fe8a370db48f264c0dcca0aeace549905ef/


#### 4. There is no recovery option for ERC721
##### Description
The `transferToVault()` function doesn't support ERC721 tokens: 
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/Lido.sol#L356
##### Recommendation
It is necessary to add another function to recover ERC721.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/ea5e232231483f8b0cfa630036f05d347680402c/


#### 5. Incorrect event
##### Description
In case of cover, `stETH` doesn't burn 
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/StETH.sol#L461
##### Recommendation
It is necessary to exclude the `stETH` amount from the event.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/f8b4b96e734ef392945bf41a4f657df227828085/
##### Client's commentary


#### 6. There is no recovery for excess `stETH`
##### Description
It is possible to transfer `stETH` to `wstETH` so it will be frozen in the contract. 
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.6.12/WstETH.sol#L28-L118
##### Recommendation
It is necessary to add a function to recover excess `stETH` and keep the wrapped shares amount.
##### Status
Acknowledged
##### Client's commentary
It's hard to add the recovery function easily to the wstETH contract because it isn’t upgradable.
In case of emergency it’s possible to update the Lido contract with a specific workaround for wstETH recovering stETH from the wstETH contract.


#### 7. Callback verification 
##### Description
By mistake a callback which has no implementation of the`processLidoOracleReport()` method can be added at the line:
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.8.9/OrderedCallbacksArray.sol#L60
In case you set the `IBeaconReportReceiver`  address, the  execution of the following lines will be reverted.
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/oracle/LidoOracle.sol#L644
##### Recommendation
It is necessary to add verification of the existing `processLidoOracleReport()` method in callback or callbacks should be double-checked before adding.
See this standard: https://eips.ethereum.org/EIPS/eip-165.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/9babc852be219b711a8ff73b11cf6dcb7a9d6261/


### 2.4 Low

#### 1. No check before initialization
##### Description
At the lines
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/Lido.sol#L339-L340
If the value of variable `mevRewards` is equal to 0, then the initialization of variable `BUFFERED_ETHER_POSITION` will still be performed. This will also require gas consumption.
##### Recommendation
It is recommended to add a check before initialization.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/9985ffbf1199311295d6ac2555e9c23a9ca2971e/


#### 2. No comparison with previous value
##### Description
At line
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.8.9/DepositSecurityModule.sol#L204
the variable is initialized. But if the new value is equal to the old value, the excess gas will be wasted.
##### Recommendation
It is recommended to add a check before initializing the variable.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/fdd6b7a78dedd1312c734c434f9df8d97b1dabe6/


#### 3. A comment about the node operator count
##### Description
There is a comment about the node operator count but there is no functionality related to it at the line:
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L23
Only manual moderating is available.
##### Recommendation
It is recommended to add a check for the maximum number of operators when adding new ones.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/fb8bafe3ef9ae94b79c46162982aa35927aed81d/


#### 4. Not all params are there at the comment
##### Description
After line
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/Lido.sol#L97
a description of the two parameters `_treasury` and `_insuranceFund` must be added.
##### Recommendation
It is recommended to fix the code.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/6adfa826f00a5f09b48bf0353ccf441edab3a62f/


#### 5. Code inconsistency
##### Description
The address above is not cast to address 
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/Lido.sol#L111.
##### Recommendation
It is recommended to fix the code.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/c0ad70b3acb9d1d971cb6e7d911607d387252a8e/


#### 6. Typo mistake
##### Description
It should be `stored` 
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.4.24/oracle/LidoOracle.sol#L78
##### Recommendation
It is recommended to fix the code.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/66850e2f7cdbba155ef4ae2a1e86e7121f93291b/


#### 7. Using `transferShares()` is possible
##### Description
Transfer can be made via `transferShares()`: 
https://github.com/lidofinance/lido-dao/blob/801d3e854efb33ff33a59fe51187e187047a6be2/contracts/0.6.12/WstETH.sol#L73
##### Recommendation
It is recommended to fix the code.
##### Status
Acknowledged
##### Client's commentary
Acknowledged. 
We can’t upgrade wstETH in a straightforward way, so the cost of using the old function is less than the cost of re-integrating the new implementation from scratch.


## 3. ABOUT MIXBYTES
MixBytes is a team of blockchain developers, auditors and analysts keen on decentralized systems. We build opensource solutions, smart contracts and blockchain protocols, perform security audits, work on benchmarking and
software testing solutions, do research and tech consultancy.