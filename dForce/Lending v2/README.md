# dForce Lending V2 Security Audit Report

###### tags: `dForce`

## 1. INTRODUCTION

### 1.1 Disclaimer
The audit makes no statements or warranties about utility of the code, safety of the code, suitability of the business model, investment advice, endorsement of the platform or its products, regulatory regime for the business model, or any other statements about fitness of the contracts to purpose, or their bug free status. The audit documentation is for discussion purposes only. The information presented in this report is confidential and privileged. If you are reading this report, you agree to keep it confidential, not to copy, disclose or disseminate without the agreement of the Client. If you are not the intended recipient(s) of this document, please note that any disclosure, copying or dissemination of its content is strictly forbidden.


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

* Manual code check for vulnerabilities listed on the Contractor's internal checklist. The Contractor's checklist is constantly updated based on the analysis of hacks, research, and audit of the clients' codes.
* Code check with the use of static analyzers (i.e Slither, Mythril, etc).

***

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
* Provide the Client with an interim report.


#### 5. Bug fixing & re-audit:
* The Client either fixes the issues or provides comments on the issues found by the auditors. Feedback from the Customer must be received on every issue/bug so that the Contractor can assign them a status (either "fixed" or "acknowledged").
* Upon completion of the bug fixing, the auditors double-check each fix and assign it a specific status, providing a proof link to the fix.
* A re-audited report is issued. 

***

##### Stage goals
* Verify the fixed code version with all the recommendations and its statuses.
* Provide the Client with a re-audited report.

#### 6. Final code verification and issuance of a public audit report: 
* The Customer deploys the re-audited source code on the mainnet.
* The Contractor verifies the deployed code with the re-audited version and checks them for compliance.
* If the versions of the code match, the Contractor issues a public audit report. 

##### Stage goals
* Conduct the final check of the code deployed on the mainnet.
* Provide the Customer with a public audit report.



#### Finding Severity breakdown

All vulnerabilities discovered during the audit are classified based on their potential severity and have the following classification:

Severity | Description
--- | ---
Critical | Bugs leading to assets theft, fund access locking, or any other loss of funds.
High     | Bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement.
Medium   | Bugs that can break the intended contract logic or expose it to DoS attacks, but do not cause direct loss funds.
Low | Bugs that do not have a significant immediate impact and could be easily fixed.



Based on the feedback received from the Customer regarding the list of findings discovered by the Contractor, they are assigned the following statuses:

Status | Description
--- | ---
Fixed        | Recommended fixes have been made to the project code and no longer affect its security.
Acknowledged | The Customer is aware of the finding. Recommendations for the finding are planned to be resolved in the future.


***

### 1.3 Project Overview
The dForce project is a decentralized lending protocol. Users can supply collateral, borrow assets and earn interest. The features of the dForce protocol are:
- SuperCharged mode - categorizing some assets by having corellated prices to allow less collaterization ratios;
- liquidation threshold - a buffer between the maximum borrowing power and insolvency
- Segregated mode - limit risks of collaterization by some assets;
- delay payment - timelock on transfer-outs if some conditions are met.

***

### 1.4 Project Dashboard

#### Project Summary

Title | Description
--- | ---
Client             | dForce
Project name       | Lending V2
Timeline           | 06.09.2023 - 17.06.2024
Number of Auditors | 3

#### Project Log

 Date | Commit Hash | Note
--- | --- | ---
06.09.2023 | 6f3a7b6946d8226b38e7f0d67a50e68a28fe5165 | Initial commit for the audit
14.11.2023 | abf7ef8d327a15a9e5e5f8bec6b444142d988f34 | Commit for the re-audit
29.11.2023 | 490a30f5a2e0e369f9ea52097b28254f11c5ada6 | Commit for the re-audit 2
13.06.2024 | 5d005d16a96499828a6703f41cda2b946887800e | Commit for the diff audit

#### Project Scope
The audit covered the following files:

File name | Link
--- | ---
| Controller.sol                   | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/Controller.sol                   |
| ControllerStorage.sol            | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerStorage.sol            |
| ControllerV2ExtraBase.sol        | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2ExtraBase.sol        |
| ControllerV2ExtraExplicit.sol    | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2ExtraExplicit.sol    |
| ControllerV2ExtraImplicit.sol    | (https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2ExtraImplicit.sol    |
| ControllerV2.sol                 | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2.sol                 |
| DefaultTimeLock.sol              | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/DefaultTimeLock.sol              |
| iETH.sol                         | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/iETH.sol                         |
| iETHV2.sol                       | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/iETHV2.sol                       |
| iToken.sol                       | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/iToken.sol                       |
| iTokenV2.sol                     | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/iTokenV2.sol                     |
| RewardDistributorSecondV3.sol    | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/RewardDistributorSecondV3.sol    |
| RewardDistributorV3.sol          | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/RewardDistributorV3.sol          |
| TimeLockStrategy.sol             | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TimeLockStrategy.sol             |
| TokenBase/Base.sol               | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TokenBase/Base.sol               |
| TokenBase/InterestUnit.sol       | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TokenBase/InterestUnit.sol       |
| TokenBase/TokenAdmin.sol         | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TokenBase/TokenAdmin.sol         |
| TokenBase/TokenERC20.sol         | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TokenBase/TokenERC20.sol         |
| TokenBase/TokenEvent.sol         | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TokenBase/TokenEvent.sol         |
| TokenBase/TokenStorage.sol       | https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TokenBase/TokenStorage.sol       |


***
#### Deployments

**Base:mainnet**

File name | Contract deployed | Comment
--- | --- | ---
Timelock.sol | [0xa4e5ebEdcD1129Ed30C77644a70F4dd3c2d482cc](https://basescan.org/address/0xa4e5ebEdcD1129Ed30C77644a70F4dd3c2d482cc) | 
TransparentUpgradeableProxy.sol | [0xBae8d153331129EB40E390A7Dd485363135fcE22](https://basescan.org/address/0xBae8d153331129EB40E390A7Dd485363135fcE22) | proxy for ControllerV2
ControllerV2.sol | [0xc7d598e4434d51273bbb0418a9e764b53ddc7d63](https://basescan.org/address/0xc7d598e4434d51273bbb0418a9e764b53ddc7d63) | implementation
ControllerV2ExtraImplicit.sol | [0x95c06b4b6902b0aE37dDFf281d2c785313C86691](https://basescan.org/address/0x95c06b4b6902b0aE37dDFf281d2c785313C86691) | 
ControllerV2ExtraExplicit.sol | [0xd556fb139a36F5EA809636B9858C5e3fe1613EA4](https://basescan.org/address/0xd556fb139a36F5EA809636B9858C5e3fe1613EA4) | 
TransparentUpgradeableProxy.sol | [0xD614E4a3C1152812Da43E824930376AA8b7D8B1d](https://basescan.org/address/0xD614E4a3C1152812Da43E824930376AA8b7D8B1d) | proxy for DefaultTimeLock
DefaultTimeLock.sol | [0x28bbd52b8e6b46210fcdf6d605e242a72240ef66](https://basescan.org/address/0x28bbd52b8e6b46210fcdf6d605e242a72240ef66) | implementation
TransparentUpgradeableProxy.sol | [0x4ca6A624808a7B248238c138558CA3047d9E2E3F](https://basescan.org/address/0x4ca6A624808a7B248238c138558CA3047d9E2E3F) | proxy for TimeLockStrategy
TimeLockStrategy.sol | [0xeae18e7d342d03a5fb0492060557f979b9e9a92f](https://basescan.org/address/0xeae18e7d342d03a5fb0492060557f979b9e9a92f) | implementation
TransparentUpgradeableProxy.sol | [0x76B5f31A3A6048A437AfD86be6E1a40888Dc8Bba](https://basescan.org/address/0x76B5f31A3A6048A437AfD86be6E1a40888Dc8Bba) | proxy for iETHV2
iETHV2.sol | [0x0d66fa17fac4b7d35240ff58d278ddd2f036451f](https://basescan.org/address/0x0d66fa17fac4b7d35240ff58d278ddd2f036451f) | implementation
TransparentUpgradeableProxy.sol | [0xf8fBD6202FBcfC607E31A99300e6c84C2645902f](https://basescan.org/address/0xf8fBD6202FBcfC607E31A99300e6c84C2645902f) | proxy for iTokenV2 iwstETH
TransparentUpgradeableProxy.sol | [0x6D9Ce334C2cc6b80a4cddf9aEA6D3F4683cf4a50](https://basescan.org/address/0x6D9Ce334C2cc6b80a4cddf9aEA6D3F4683cf4a50) | proxy for iTokenV2 icbETH
TransparentUpgradeableProxy.sol | [0xBb81632e9e1Fb675dB5e5a5ff66f16E822c9a2FD](https://basescan.org/address/0xBb81632e9e1Fb675dB5e5a5ff66f16E822c9a2FD) | proxy for iTokenV2 iUSDC
TransparentUpgradeableProxy.sol | [0x82AFc965E4E18009DD8d5AF05cfAa99bF0E605df](https://basescan.org/address/0x82AFc965E4E18009DD8d5AF05cfAa99bF0E605df) | proxy for iTokenV2 iUSX
iTokenV2.sol | [0x66d7c93c22935d436dfb1e85394ae52c0a2be001](https://basescan.org/address/0x66d7c93c22935d436dfb1e85394ae52c0a2be001) | implementation
TransparentUpgradeableProxy.sol | [0xE08020a6517c1AD321D47c45Efbe1d76F5035d75](https://basescan.org/address/0xE08020a6517c1AD321D47c45Efbe1d76F5035d75) | proxy for RewardDistributorSecondV3.sol
RewardDistributorSecondV3.sol | [0x251687dd69ceae80f9f2b384e7a7c6a58a4dff7d](https://basescan.org/address/0x251687dd69ceae80f9f2b384e7a7c6a58a4dff7d) | implementation

**Ethereum:mainnet**

File name | Contract deployed | Comment
--- | --- | ---
TimeLock.sol | [0x17e66B1e0260C930bfA567ff3ab5c71794279b94](https://etherscan.io/address/0x17e66B1e0260C930bfA567ff3ab5c71794279b94) | 
TransparentUpgradeableProxy.sol  | [0x8B53Ab2c0Df3230EA327017C91Eb909f815Ad113](https://etherscan.io/address/0x8B53Ab2c0Df3230EA327017C91Eb909f815Ad113) | Proxy for ControllerV2.sol
ControllerV2.sol  | [0xfAEA9955Aef61Cf5029fCbC88DF7369c1e7b1128](https://etherscan.io/address/0xfAEA9955Aef61Cf5029fCbC88DF7369c1e7b1128) | Implementation
ControllerV2ExtraExplicit.sol | [0x69E979A9695F0012B537827c57B182a544cfD832](https://etherscan.io/address/0x69E979A9695F0012B537827c57B182a544cfD832) | 
ControllerV2ExtraImplicit.sol | [0xDDcdf0F00d81A540eD9b7E6824FC1165b27fb397](https://etherscan.io/address/0xDDcdf0F00d81A540eD9b7E6824FC1165b27fb397) | 
TransparentUpgradeableProxy.sol                             | [0x5ACD75f21659a59fFaB9AEBAf350351a8bfaAbc0](https://etherscan.io/address/0x5ACD75f21659a59fFaB9AEBAf350351a8bfaAbc0) | Proxy for iETH
iETHV2.sol | [0xF4266178c2B1Fce48BEB9d648a806226FD945555](https://etherscan.io/address/0xF4266178c2B1Fce48BEB9d648a806226FD945555) | Implementation
TransparentUpgradeableProxy.sol | [0x8fAeF85e436a8dd85D8E636Ea22E3b90f1819564](https://etherscan.io/address/0x8fAeF85e436a8dd85D8E636Ea22E3b90f1819564) | Proxy for RewardDistributorSecondV3.sol
RewardDistributorSecondV3.sol | [0xE6b50f297a3af05Ee663CA24882D8D7F62a72bB9](https://etherscan.io/address/0xE6b50f297a3af05Ee663CA24882D8D7F62a72bB9) | Implementation
TransparentUpgradeableProxy.sol                            | [0x3e5CB932D7A1c0ca096b71Cc486b2aD7e0DC3D0e](https://etherscan.io/address/0x3e5CB932D7A1c0ca096b71Cc486b2aD7e0DC3D0e) | Proxy for iAAVE
TransparentUpgradeableProxy.sol                            | [0x24677e213DeC0Ea53a430404cF4A11a6dc889FCe](https://etherscan.io/address/0x24677e213DeC0Ea53a430404cF4A11a6dc889FCe) | Proxy for iBUSD
TransparentUpgradeableProxy.sol                             | [0xe39672DFa87C824BcB3b38aA480ef684687CBC09](https://etherscan.io/address/0xe39672DFa87C824BcB3b38aA480ef684687CBC09) | Proxy for iCRV
TransparentUpgradeableProxy.sol                             | [0x298f243aD592b6027d4717fBe9DeCda668E3c3A8](https://etherscan.io/address/0x298f243aD592b6027d4717fBe9DeCda668E3c3A8) | Proxy for iDAI
TransparentUpgradeableProxy.sol                              | [0xb3dc7425e63E1855Eb41107134D471DD34d7b239](https://etherscan.io/address/0xb3dc7425e63E1855Eb41107134D471DD34d7b239) | Proxy for iDF
TransparentUpgradeableProxy.sol                             | [0x44c324970e5CbC5D4C3F3B7604CbC6640C2dcFbF](https://etherscan.io/address/0x44c324970e5CbC5D4C3F3B7604CbC6640C2dcFbF) | Proxy for iEUX
TransparentUpgradeableProxy.sol                             | [0x47C19A2ab52DA26551A22e2b2aEED5d19eF4022F](https://etherscan.io/address/0x47C19A2ab52DA26551A22e2b2aEED5d19eF4022F) | Proxy for iFEI
TransparentUpgradeableProxy.sol                            | [0x71173e3c6999c2C72ccf363f4Ae7b67BCc7E8F63](https://etherscan.io/address/0x71173e3c6999c2C72ccf363f4Ae7b67BCc7E8F63) | Proxy for iFRAX
TransparentUpgradeableProxy.sol                           | [0x164315EA59169D46359baa4BcC6479bB421764b6](https://etherscan.io/address/0x164315EA59169D46359baa4BcC6479bB421764b6) | Proxy for iGOLDx
TransparentUpgradeableProxy.sol                            | [0x47566acD7af49D2a192132314826ed3c3c5f3698](https://etherscan.io/address/0x47566acD7af49D2a192132314826ed3c3c5f3698) | Proxy for iHBTC
TransparentUpgradeableProxy.sol                            | [0xA3068AA78611eD29d381E640bb2c02abcf3ca7DE](https://etherscan.io/address/0xA3068AA78611eD29d381E640bb2c02abcf3ca7DE) | Proxy for iLINK
TransparentUpgradeableProxy.sol                            | [0x591595Bfae3f5d51A820ECd20A1e3FBb6638f34B](https://etherscan.io/address/0x591595Bfae3f5d51A820ECd20A1e3FBb6638f34B) | Proxy for iMEUX
TransparentUpgradeableProxy.sol                             | [0x039E7Ef6a674f3EC1D88829B8215ED45385c24bc](https://etherscan.io/address/0x039E7Ef6a674f3EC1D88829B8215ED45385c24bc) | Proxy for iMKR
TransparentUpgradeableProxy.sol                            | [0xd1254d280e7504836e1B0E36535eBFf248483cEE](https://etherscan.io/address/0xd1254d280e7504836e1B0E36535eBFf248483cEE) | Proxy for iMUSX
TransparentUpgradeableProxy.sol                           | [0xfa2e831c674B61475C175B2206e81A5938B298Dd](https://etherscan.io/address/0xfa2e831c674B61475C175B2206e81A5938B298Dd) | Proxy for iMxBTC
TransparentUpgradeableProxy.sol                           | [0x028DB7A9d133301bD49f27b5E41F83F56aB0FaA6](https://etherscan.io/address/0x028DB7A9d133301bD49f27b5E41F83F56aB0FaA6) | Proxy for iMxETH
TransparentUpgradeableProxy.sol                            | [0x6E6a689a5964083dFf9FD7A0f788BAF620ea2DBe](https://etherscan.io/address/0x6E6a689a5964083dFf9FD7A0f788BAF620ea2DBe) | Proxy for iTUSD
TransparentUpgradeableProxy.sol                             | [0xbeC9A824D6dA8d0F923FD9fbec4FAA949d396320](https://etherscan.io/address/0xbeC9A824D6dA8d0F923FD9fbec4FAA949d396320) | Proxy for iUNI
TransparentUpgradeableProxy.sol                            | [0x2f956b2f801c6dad74E87E7f45c94f6283BF0f45](https://etherscan.io/address/0x2f956b2f801c6dad74E87E7f45c94f6283BF0f45) | Proxy for iUSDC
TransparentUpgradeableProxy.sol                            | [0x1180c114f7fAdCB6957670432a3Cf8Ef08Ab5354](https://etherscan.io/address/0x1180c114f7fAdCB6957670432a3Cf8Ef08Ab5354) | Proxy for iUSDT
TransparentUpgradeableProxy.sol                             | [0x1AdC34Af68e970a93062b67344269fD341979eb0](https://etherscan.io/address/0x1AdC34Af68e970a93062b67344269fD341979eb0) | Proxy for iUSX
TransparentUpgradeableProxy.sol                            | [0x5812fCF91adc502a765E5707eBB3F36a07f63c02](https://etherscan.io/address/0x5812fCF91adc502a765E5707eBB3F36a07f63c02) | Proxy for iWBTC
TransparentUpgradeableProxy.sol                           | [0x6D9Ce334C2cc6b80a4cddf9aEA6D3F4683cf4a50](https://etherscan.io/address/0x6D9Ce334C2cc6b80a4cddf9aEA6D3F4683cf4a50) | Proxy for icbBTC
TransparentUpgradeableProxy.sol                            | [0x33b5EdC15E05D3daC27fCCAd77cf550C5f3f02AA](https://etherscan.io/address/0x33b5EdC15E05D3daC27fCCAd77cf550C5f3f02AA) | Proxy for irETH
TransparentUpgradeableProxy.sol                          | [0x59055220e00da46C891283EA1d79363c769158b9](https://etherscan.io/address/0x59055220e00da46C891283EA1d79363c769158b9) | Proxy for irenFIL
TransparentUpgradeableProxy.sol                            | [0x5f02fb5f1203a502c701a12Fd409548993F795ba](https://etherscan.io/address/0x5f02fb5f1203a502c701a12Fd409548993F795ba) | Proxy for isDAI
TransparentUpgradeableProxy.sol                            | [0x041D2c9250dc0cA2962BE94cF7c4D05abB1d5820](https://etherscan.io/address/0x041D2c9250dc0cA2962BE94cF7c4D05abB1d5820) | Proxy for isUSX
TransparentUpgradeableProxy.sol                          | [0xbfd291da8a403daaf7e5e9dc1ec0aceacd4848b9](https://etherscan.io/address/0xbfd291da8a403daaf7e5e9dc1ec0aceacd4848b9) | Proxy for iwstETH
TransparentUpgradeableProxy.sol                            | [0x4013e6754634ca99aF31b5717Fa803714fA07B35](https://etherscan.io/address/0x4013e6754634ca99aF31b5717Fa803714fA07B35) | Proxy for ixBTC
TransparentUpgradeableProxy.sol                            | [0x237C69E082A94d37EBdc92a84b58455872e425d6](https://etherscan.io/address/0x237C69E082A94d37EBdc92a84b58455872e425d6) | Proxy for ixETH
iTokenV2.sol | [0x379418061Ebb8C9f7044E5ac1423076d33c00F68](https://etherscan.io/address/0x379418061Ebb8C9f7044E5ac1423076d33c00F68) | Implementation

**Arbitrum:mainnet**

File name | Contract deployed | Comment
--- | --- | ---
TimeLock.sol | [0x1E96e916A64199069CcEA2E6Cf4D63d30a61b93d](https://arbiscan.io/address/0x1E96e916A64199069CcEA2E6Cf4D63d30a61b93d) | 
TransparentUpgradeableProxy.sol  | [0x8E7e9eA9023B81457Ae7E6D2a51b003D421E5408](https://arbiscan.io/address/0x8E7e9eA9023B81457Ae7E6D2a51b003D421E5408) | Proxy for ControllerV2.sol
ControllerV2.sol  | [0xa32F91744C45A16B7e2dDE2589C4b85FDeA33403](https://arbiscan.io/address/0xa32F91744C45A16B7e2dDE2589C4b85FDeA33403) | Implementation
ControllerV2ExtraExplicit.sol | [0x9F924E5e3f27A46a41B856331d79318864668f68](https://arbiscan.io/address/0x9F924E5e3f27A46a41B856331d79318864668f68) | 
ControllerV2ExtraImplicit.sol | [0x9ad68dADc79980ae80aCFc25Ec6c31cD47C7078A](https://arbiscan.io/address/0x9ad68dADc79980ae80aCFc25Ec6c31cD47C7078A) | 
TransparentUpgradeableProxy.sol                             | [0xEe338313f022caee84034253174FA562495dcC15](https://arbiscan.io/address/0xEe338313f022caee84034253174FA562495dcC15) | Proxy for iETH
iETHV2.sol | [0xE68A13089ADd79728B70620043b7671e54688deC](https://arbiscan.io/address/0xE68A13089ADd79728B70620043b7671e54688deC) | Implementation
TransparentUpgradeableProxy.sol | [0xF45e2ae152384D50d4e9b08b8A1f65F0d96786C3](https://arbiscan.io/address/0xF45e2ae152384D50d4e9b08b8A1f65F0d96786C3) | Proxy for RewardDistributorSecondV3.sol
RewardDistributorSecondV3.sol  | [0x8C6Fff9B0DDCdE9429B1087De6E7F2fdcA3d0D25](https://arbiscan.io/address/0x8C6Fff9B0DDCdE9429B1087De6E7F2fdcA3d0D25) | Implementation
TransparentUpgradeableProxy.sol                            | [0x7702dC73e8f8D9aE95CF50933aDbEE68e9F1D725](https://arbiscan.io/address/0x7702dC73e8f8D9aE95CF50933aDbEE68e9F1D725) | Proxy for iAAVE
TransparentUpgradeableProxy.sol                             | [0xD037c36dbc81a8890728D850E080e38F6EeB95EF](https://arbiscan.io/address/0xD037c36dbc81a8890728D850E080e38F6EeB95EF) | Proxy for iARB
TransparentUpgradeableProxy.sol                             | [0x662da37F0B992F58eF0d9b482dA313a3AB639C0D](https://arbiscan.io/address/0x662da37F0B992F58eF0d9b482dA313a3AB639C0D) | Proxy for iCRV
TransparentUpgradeableProxy.sol                             | [0xf6995955e4B0E5b287693c221f456951D612b628](https://arbiscan.io/address/0xf6995955e4B0E5b287693c221f456951D612b628) | Proxy for iDAI
TransparentUpgradeableProxy.sol                              | [0xaEa8e2e7C97C5B7Cd545d3b152F669bAE29C4a63](https://arbiscan.io/address/0xaEa8e2e7C97C5B7Cd545d3b152F669bAE29C4a63) | Proxy for iDF
TransparentUpgradeableProxy.sol                             | [0x5675546Eb94c2c256e6d7c3F7DcAB59bEa3B0B8B](https://arbiscan.io/address/0x5675546Eb94c2c256e6d7c3F7DcAB59bEa3B0B8B) | Proxy for iEUX
TransparentUpgradeableProxy.sol                            | [0xb3ab7148cCCAf66686AD6C1bE24D83e58E6a504e](https://arbiscan.io/address/0xb3ab7148cCCAf66686AD6C1bE24D83e58E6a504e) | Proxy for iFRAX
TransparentUpgradeableProxy.sol                            | [0x013ee4934ecbFA5723933c4B08EA5E47449802C8](https://arbiscan.io/address/0x013ee4934ecbFA5723933c4B08EA5E47449802C8) | Proxy for iLINK
TransparentUpgradeableProxy.sol                            | [0x5BE49B2e04aC55A17c72aC37E3a85D9602322021](https://arbiscan.io/address/0x5BE49B2e04aC55A17c72aC37E3a85D9602322021) | Proxy for iMEUX
TransparentUpgradeableProxy.sol                            | [0xe8c85B60Cb3bA32369c699015621813fb2fEA56c](https://arbiscan.io/address/0xe8c85B60Cb3bA32369c699015621813fb2fEA56c) | Proxy for iMUSX
TransparentUpgradeableProxy.sol                             | [0x46Eca1482fffb61934C4abCA62AbEB0b12FEb17A](https://arbiscan.io/address/0x46Eca1482fffb61934C4abCA62AbEB0b12FEb17A) | Proxy for iUNI
TransparentUpgradeableProxy.sol                            | [0x8dc3312c68125a94916d62B97bb5D925f84d4aE0](https://arbiscan.io/address/0x8dc3312c68125a94916d62B97bb5D925f84d4aE0) | Proxy for iUSDC
TransparentUpgradeableProxy.sol                           | [0x70284c0C2dFa98a972c5c8cbE32a0b7f90b3B578](https://arbiscan.io/address/0x70284c0C2dFa98a972c5c8cbE32a0b7f90b3B578) | Proxy for iUSDCn
TransparentUpgradeableProxy.sol                            | [0xf52f079Af080C9FB5AFCA57DDE0f8B83d49692a9](https://arbiscan.io/address/0xf52f079Af080C9FB5AFCA57DDE0f8B83d49692a9) | Proxy for iUSDT
TransparentUpgradeableProxy.sol                             | [0x0385F851060c09A552F1A28Ea3f612660256cBAA](https://arbiscan.io/address/0x0385F851060c09A552F1A28Ea3f612660256cBAA) | Proxy for iUSX
TransparentUpgradeableProxy.sol                            | [0xD3204E4189BEcD9cD957046A8e4A643437eE0aCC](https://arbiscan.io/address/0xD3204E4189BEcD9cD957046A8e4A643437eE0aCC) | Proxy for iWBTC
TransparentUpgradeableProxy.sol                            | [0xFD7e2EACAB5Fd983a2189eB6A38c3ee2aD9F69Df](https://arbiscan.io/address/0xFD7e2EACAB5Fd983a2189eB6A38c3ee2aD9F69Df) | Proxy for irETH
TransparentUpgradeableProxy.sol                            | [0xB276FB21e29E8055044d31d093F8f1A4a88CA0BC](https://arbiscan.io/address/0xB276FB21e29E8055044d31d093F8f1A4a88CA0BC) | Proxy for isUSX
TransparentUpgradeableProxy.sol                          | [0xa8bAd6CE1937F8e047bcA239Cff1f2224B899b23](https://arbiscan.io/address/0xa8bAd6CE1937F8e047bcA239Cff1f2224B899b23) | Proxy for iwstETH
iTokenV2.sol | [0x7f5bB618633EEe2A09CCaaDeB527B9c56F718867](https://arbiscan.io/address/0x7f5bB618633EEe2A09CCaaDeB527B9c56F718867) | Implementation

**Optimism:mainnet**

File name | Contract deployed | Comment
--- | --- | ---
TimeLock.sol | [0x0D535ca4C27f0C25a20e2D474Ee3E99c1316BAfe](https://optimistic.etherscan.io/address/0x0D535ca4C27f0C25a20e2D474Ee3E99c1316BAfe) | 
TransparentUpgradeableProxy.sol | [0xA300A84D8970718Dac32f54F61Bd568142d8BCF4](https://optimistic.etherscan.io/address/0xA300A84D8970718Dac32f54F61Bd568142d8BCF4) | Proxy for ControllerV2.sol
ControllerV2.sol | [0xF4266178c2B1Fce48BEB9d648a806226FD945555](https://optimistic.etherscan.io/address/0xF4266178c2B1Fce48BEB9d648a806226FD945555) | Implementation
ControllerV2ExtraExplicit.sol | [0x379418061Ebb8C9f7044E5ac1423076d33c00F68](https://optimistic.etherscan.io/address/0x379418061Ebb8C9f7044E5ac1423076d33c00F68) | 
ControllerV2ExtraImplicit.sol | [0xE6b50f297a3af05Ee663CA24882D8D7F62a72bB9](https://optimistic.etherscan.io/address/0xE6b50f297a3af05Ee663CA24882D8D7F62a72bB9) | 
TransparentUpgradeableProxy.sol                             | [0xA7A084538DE04d808f20C785762934Dd5dA7b3B4](https://optimistic.etherscan.io/address/0xA7A084538DE04d808f20C785762934Dd5dA7b3B4) | Proxy for iETH
iETHV2.sol | [0x5A3aFF97C2F76C92d87049C3b66FEE12cC8B167D](https://optimistic.etherscan.io/address/0x5A3aFF97C2F76C92d87049C3b66FEE12cC8B167D) | Implementation
TransparentUpgradeableProxy.sol | [0x870ac6a76A30742800609F205c741E86Db9b71a2](https://optimistic.etherscan.io/address/0x870ac6a76A30742800609F205c741E86Db9b71a2) | Proxy for RewardDistributorSecondV3.sol
RewardDistributorSecondV3.sol | [0xEc71C5826CB12b22a4dB4AFEe2FC35e710E904f8](https://optimistic.etherscan.io/address/0xEc71C5826CB12b22a4dB4AFEe2FC35e710E904f8) | Implementation
TransparentUpgradeableProxy.sol                            | [0xD65a18dAE68C846297F3038C93deea0B181288d5](https://optimistic.etherscan.io/address/0xD65a18dAE68C846297F3038C93deea0B181288d5) | Proxy for iAAVE
TransparentUpgradeableProxy.sol                             | [0xED3c20d047D2c57C3C6DD862C9FDd1b353Aff36f](https://optimistic.etherscan.io/address/0xED3c20d047D2c57C3C6DD862C9FDd1b353Aff36f) | Proxy for iCRV
TransparentUpgradeableProxy.sol                             | [0x5bedE655e2386AbC49E2Cc8303Da6036bF78564c](https://optimistic.etherscan.io/address/0x5bedE655e2386AbC49E2Cc8303Da6036bF78564c) | Proxy for iDAI
TransparentUpgradeableProxy.sol                              | [0x6832364e9538Db15655FA84A497f2927F74A6cE6](https://optimistic.etherscan.io/address/0x6832364e9538Db15655FA84A497f2927F74A6cE6) | Proxy for iDF
TransparentUpgradeableProxy.sol                            | [0xDd40BBa0faD6810A7A09e8Ccca9bCe1E48B28Ece](https://optimistic.etherscan.io/address/0xDd40BBa0faD6810A7A09e8Ccca9bCe1E48B28Ece) | Proxy for iLINK
TransparentUpgradeableProxy.sol                            | [0x94a14Ba6E59f4BE36a77041Ef5590Fe24445876A](https://optimistic.etherscan.io/address/0x94a14Ba6E59f4BE36a77041Ef5590Fe24445876A) | Proxy for iMUSX
TransparentUpgradeableProxy.sol                              | [0x7702dC73e8f8D9aE95CF50933aDbEE68e9F1D725](https://optimistic.etherscan.io/address/0x7702dC73e8f8D9aE95CF50933aDbEE68e9F1D725) | Proxy for iOP
TransparentUpgradeableProxy.sol                            | [0xB344795f0e7cf65a55cB0DDe1E866D46041A2cc2](https://optimistic.etherscan.io/address/0xB344795f0e7cf65a55cB0DDe1E866D46041A2cc2) | Proxy for iUSDC
TransparentUpgradeableProxy.sol                           | [0x0fD11B5ED5B82Ef454BEe2516D1b23d1b07b6c46](https://optimistic.etherscan.io/address/0x0fD11B5ED5B82Ef454BEe2516D1b23d1b07b6c46) | Proxy for iUSDCn
TransparentUpgradeableProxy.sol                            | [0x5d05c14D71909F4Fe03E13d486CCA2011148FC44](https://optimistic.etherscan.io/address/0x5d05c14D71909F4Fe03E13d486CCA2011148FC44) | Proxy for iUSDT
TransparentUpgradeableProxy.sol                             | [0x7e7e1d8757b241Aa6791c089314604027544Ce43](https://optimistic.etherscan.io/address/0x7e7e1d8757b241Aa6791c089314604027544Ce43) | Proxy for iUSX
TransparentUpgradeableProxy.sol                            | [0x24d30216c07Df791750081c8D77C83cc8b06eB27](https://optimistic.etherscan.io/address/0x24d30216c07Df791750081c8D77C83cc8b06eB27) | Proxy for iWBTC
TransparentUpgradeableProxy.sol                            | [0x107d8661C2617B498941AfE8c2FbEa6b6976F71e](https://optimistic.etherscan.io/address/0x107d8661C2617B498941AfE8c2FbEa6b6976F71e) | Proxy for irETH
TransparentUpgradeableProxy.sol                            | [0x1f144cD63d7007945292EBCDE14a6Df8628e2Ed7](https://optimistic.etherscan.io/address/0x1f144cD63d7007945292EBCDE14a6Df8628e2Ed7) | Proxy for isUSD
TransparentUpgradeableProxy.sol                            | [0xc0BD38f08CDb278d0ff39E5c1996e4dc5062309C](https://optimistic.etherscan.io/address/0xc0BD38f08CDb278d0ff39E5c1996e4dc5062309C) | Proxy for isUSX
TransparentUpgradeableProxy.sol                          | [0x4B3488123649E8A671097071A02DA8537fE09A16](https://optimistic.etherscan.io/address/0x4B3488123649E8A671097071A02DA8537fE09A16) | Proxy for iwstETH
iTokenV2.sol | [0x2dcCE99fbd573Fabdbf3314aC885414B7051f9Cb](https://optimistic.etherscan.io/address/0x2dcCE99fbd573Fabdbf3314aC885414B7051f9Cb) | Implementation

**Polygon:mainnet**

File name | Contract deployed | Comment
--- | --- | ---
TimeLock.sol | [0x1C4d5eCFBf2AF57251f20a524D0f0c1b4f6ED1C9](https://polygonscan.com/address/0x1C4d5eCFBf2AF57251f20a524D0f0c1b4f6ED1C9) | 
TransparentUpgradeableProxy.sol | [0x52eaCd19E38D501D006D2023C813d7E37F025f37](https://polygonscan.com/address/0x52eaCd19E38D501D006D2023C813d7E37F025f37) | Proxy for ControllerV2.sol
ControllerV2.sol | [0x379418061Ebb8C9f7044E5ac1423076d33c00F68](https://polygonscan.com/address/0x379418061Ebb8C9f7044E5ac1423076d33c00F68) | Implementation
ControllerV2ExtraExplicit.sol | [0xE6b50f297a3af05Ee663CA24882D8D7F62a72bB9](https://polygonscan.com/address/0xE6b50f297a3af05Ee663CA24882D8D7F62a72bB9) | 
ControllerV2ExtraImplicit.sol | [0xfAEA9955Aef61Cf5029fCbC88DF7369c1e7b1128](https://polygonscan.com/address/0xfAEA9955Aef61Cf5029fCbC88DF7369c1e7b1128) | 
TransparentUpgradeableProxy.sol | [0x47C19A2ab52DA26551A22e2b2aEED5d19eF4022F](https://polygonscan.com/address/0x47C19A2ab52DA26551A22e2b2aEED5d19eF4022F) | Proxy for RewardDistributorSecondV3.sol
RewardDistributorSecondV3.sol | [0xF4266178c2B1Fce48BEB9d648a806226FD945555](https://polygonscan.com/address/0xF4266178c2B1Fce48BEB9d648a806226FD945555) | Implementation
TransparentUpgradeableProxy.sol                            | [0x38D0c498698A35fc52a6EB943E47e4A5471Cd6f9](https://polygonscan.com/address/0x38D0c498698A35fc52a6EB943E47e4A5471Cd6f9) | Proxy for iAAVE
TransparentUpgradeableProxy.sol                             | [0x7D86eE431fbAf60E86b5D3133233E478aF691B68](https://polygonscan.com/address/0x7D86eE431fbAf60E86b5D3133233E478aF691B68) | Proxy for iCRV
TransparentUpgradeableProxy.sol                             | [0xec85F77104Ffa35a5411750d70eDFf8f1496d95b](https://polygonscan.com/address/0xec85F77104Ffa35a5411750d70eDFf8f1496d95b) | Proxy for iDAI
TransparentUpgradeableProxy.sol                              | [0xcB5D9b6A9BA8eA6FA82660fAA9cC130586F939B2](https://polygonscan.com/address/0xcB5D9b6A9BA8eA6FA82660fAA9cC130586F939B2) | Proxy for iDF
TransparentUpgradeableProxy.sol                             | [0x15962427A9795005c640A6BF7f99c2BA1531aD6d](https://polygonscan.com/address/0x15962427A9795005c640A6BF7f99c2BA1531aD6d) | Proxy for iEUX
TransparentUpgradeableProxy.sol                           | [0x6A3fE5342a4Bd09efcd44AC5B9387475A0678c74](https://polygonscan.com/address/0x6A3fE5342a4Bd09efcd44AC5B9387475A0678c74) | Proxy for iMATIC
TransparentUpgradeableProxy.sol                            | [0x5268b3c4afb0860D365a093C184985FCFcb65234](https://polygonscan.com/address/0x5268b3c4afb0860D365a093C184985FCFcb65234) | Proxy for iUSDC
TransparentUpgradeableProxy.sol                            | [0xb3ab7148cCCAf66686AD6C1bE24D83e58E6a504e](https://polygonscan.com/address/0xb3ab7148cCCAf66686AD6C1bE24D83e58E6a504e) | Proxy for iUSDT
TransparentUpgradeableProxy.sol                             | [0xc171EBE1A2873F042F1dDdd9327D00527CA29882](https://polygonscan.com/address/0xc171EBE1A2873F042F1dDdd9327D00527CA29882) | Proxy for iUSX
TransparentUpgradeableProxy.sol                            | [0x94a14Ba6E59f4BE36a77041Ef5590Fe24445876A](https://polygonscan.com/address/0x94a14Ba6E59f4BE36a77041Ef5590Fe24445876A) | Proxy for iWBTC
TransparentUpgradeableProxy.sol                            | [0x0c92617dF0753Af1CaB2d9Cc6A56173970d81740](https://polygonscan.com/address/0x0c92617dF0753Af1CaB2d9Cc6A56173970d81740) | Proxy for iWETH
iTokenV2.sol | [0xEc71C5826CB12b22a4dB4AFEe2FC35e710E904f8](https://polygonscan.com/address/0xEc71C5826CB12b22a4dB4AFEe2FC35e710E904f8) | Implementation
iETHV2.sol | [0x2dcCE99fbd573Fabdbf3314aC885414B7051f9Cb](https://polygonscan.com/address/0x2dcCE99fbd573Fabdbf3314aC885414B7051f9Cb) | Implementation

**BSC:mainnet**

File name | Contract deployed | Comment
--- | --- | ---
TimeLock.sol | [0x8C3984Fb0F649c304D68DB69457DBF137D156D7a](https://bscscan.com/address/0x8C3984Fb0F649c304D68DB69457DBF137D156D7a) | 
TransparentUpgradeableProxy.sol | [0x0b53E608bD058Bb54748C35148484fD627E6dc0A](https://bscscan.com/address/0x0b53E608bD058Bb54748C35148484fD627E6dc0A) | Proxy for ControllerV2.sol
ControllerV2.sol | [0xF4266178c2B1Fce48BEB9d648a806226FD945555](https://bscscan.com/address/0xF4266178c2B1Fce48BEB9d648a806226FD945555) | Implementation
ControllerV2ExtraExplicit.sol | [0x379418061Ebb8C9f7044E5ac1423076d33c00F68](https://bscscan.com/address/0x379418061Ebb8C9f7044E5ac1423076d33c00F68) | 
ControllerV2ExtraImplicit.sol | [0xE6b50f297a3af05Ee663CA24882D8D7F62a72bB9](https://bscscan.com/address/0xE6b50f297a3af05Ee663CA24882D8D7F62a72bB9) | 
TransparentUpgradeableProxy.sol                             | [0x390bf37355e9dF6Ea2e16eEd5686886Da6F47669](https://bscscan.com/address/0x390bf37355e9dF6Ea2e16eEd5686886Da6F47669) | Proxy for iETH
iETHV2.sol | [0x5A3aFF97C2F76C92d87049C3b66FEE12cC8B167D](https://bscscan.com/address/0x5A3aFF97C2F76C92d87049C3b66FEE12cC8B167D) | Implementation
TransparentUpgradeableProxy.sol | [0x6fC21a5a767212E8d366B3325bAc2511bDeF0Ef4](https://bscscan.com/address/0x6fC21a5a767212E8d366B3325bAc2511bDeF0Ef4) | Proxy for RewardDistributorSecondV3.sol
RewardDistributorSecondV3.sol | [0xEc71C5826CB12b22a4dB4AFEe2FC35e710E904f8](https://bscscan.com/address/0xEc71C5826CB12b22a4dB4AFEe2FC35e710E904f8) | Implementation
TransparentUpgradeableProxy.sol                             | [0xFc5Bb1E8C29B100Ef8F12773f972477BCab68862](https://bscscan.com/address/0xFc5Bb1E8C29B100Ef8F12773f972477BCab68862) | Proxy for iADA
TransparentUpgradeableProxy.sol                            | [0x55012aD2f0A50195aEF44f403536DF2465009Ef7](https://bscscan.com/address/0x55012aD2f0A50195aEF44f403536DF2465009Ef7) | Proxy for iATOM
TransparentUpgradeableProxy.sol                             | [0x9747e26c5Ad01D3594eA49ccF00790F564193c15](https://bscscan.com/address/0x9747e26c5Ad01D3594eA49ccF00790F564193c15) | Proxy for iBCH
TransparentUpgradeableProxy.sol                             | [0xd57E1425837567F74A35d07669B23Bfb67aA4A93](https://bscscan.com/address/0xd57E1425837567F74A35d07669B23Bfb67aA4A93) | Proxy for iBNB
TransparentUpgradeableProxy.sol                             | [0x0b66A250Dadf3237DdB38d485082a7BfE400356e](https://bscscan.com/address/0x0b66A250Dadf3237DdB38d485082a7BfE400356e) | Proxy for iBTC
TransparentUpgradeableProxy.sol                            | [0x5511b64Ae77452C7130670C79298DEC978204a47](https://bscscan.com/address/0x5511b64Ae77452C7130670C79298DEC978204a47) | Proxy for iBUSD
TransparentUpgradeableProxy.sol                            | [0xeFae8F7AF4BaDa590d4E707D900258fc72194d73](https://bscscan.com/address/0xeFae8F7AF4BaDa590d4E707D900258fc72194d73) | Proxy for iCAKE
TransparentUpgradeableProxy.sol                             | [0xAD5Ec11426970c32dA48f58c92b1039bC50e5492](https://bscscan.com/address/0xAD5Ec11426970c32dA48f58c92b1039bC50e5492) | Proxy for iDAI
TransparentUpgradeableProxy.sol                              | [0xeC3FD540A2dEE6F479bE539D64da593a59e12D08](https://bscscan.com/address/0xeC3FD540A2dEE6F479bE539D64da593a59e12D08) | Proxy for iDF
TransparentUpgradeableProxy.sol                             | [0x9ab060ba568B86848bF19577226184db6192725b](https://bscscan.com/address/0x9ab060ba568B86848bF19577226184db6192725b) | Proxy for iDOT
TransparentUpgradeableProxy.sol                             | [0x983A727Aa3491AB251780A13acb5e876D3f2B1d8](https://bscscan.com/address/0x983A727Aa3491AB251780A13acb5e876D3f2B1d8) | Proxy for iEUX
TransparentUpgradeableProxy.sol                             | [0xD739A569Ec254d6a20eCF029F024816bE58Fb810](https://bscscan.com/address/0xD739A569Ec254d6a20eCF029F024816bE58Fb810) | Proxy for iFIL
TransparentUpgradeableProxy.sol                           | [0xc35ACAeEdB814F42B2214378d8950F8555B2D670](https://bscscan.com/address/0xc35ACAeEdB814F42B2214378d8950F8555B2D670) | Proxy for iGOLDx
TransparentUpgradeableProxy.sol                            | [0x50E894894809F642de1E11B4076451734c963087](https://bscscan.com/address/0x50E894894809F642de1E11B4076451734c963087) | Proxy for iLINK
TransparentUpgradeableProxy.sol                             | [0xd957bea67aadb8a72061ce94d033c631d1c1e6ac](https://bscscan.com/address/0xd957bea67aadb8a72061ce94d033c631d1c1e6ac) | Proxy for iLTC
TransparentUpgradeableProxy.sol                            | [0xb22eF996C0A2D262a19db2a66A256067f51511Eb](https://bscscan.com/address/0xb22eF996C0A2D262a19db2a66A256067f51511Eb) | Proxy for iMEUX
TransparentUpgradeableProxy.sol                            | [0x36f4C36D1F6e8418Ecb2402F896B2A8fEDdE0991](https://bscscan.com/address/0x36f4C36D1F6e8418Ecb2402F896B2A8fEDdE0991) | Proxy for iMUSX
TransparentUpgradeableProxy.sol                           | [0x6E42423e1bcB6A093A58E203b5eB6E8A8023b4e5](https://bscscan.com/address/0x6E42423e1bcB6A093A58E203b5eB6E8A8023b4e5) | Proxy for iMxBTC
TransparentUpgradeableProxy.sol                           | [0x6AC0a0B3959C1e5fcBd09b59b09AbF7C53C72346](https://bscscan.com/address/0x6AC0a0B3959C1e5fcBd09b59b09AbF7C53C72346) | Proxy for iMxETH
TransparentUpgradeableProxy.sol                             | [0xee9099C1318cf960651b3196747640EB84B8806b](https://bscscan.com/address/0xee9099C1318cf960651b3196747640EB84B8806b) | Proxy for iUNI
TransparentUpgradeableProxy.sol                            | [0xAF9c10b341f55465E8785F0F81DBB52a9Bfe005d](https://bscscan.com/address/0xAF9c10b341f55465E8785F0F81DBB52a9Bfe005d) | Proxy for iUSDC
TransparentUpgradeableProxy.sol                            | [0x0BF8C72d618B5d46b055165e21d661400008fa0F](https://bscscan.com/address/0x0BF8C72d618B5d46b055165e21d661400008fa0F) | Proxy for iUSDT
TransparentUpgradeableProxy.sol                             | [0x7B933e1c1F44bE9Fb111d87501bAADA7C8518aBe](https://bscscan.com/address/0x7B933e1c1F44bE9Fb111d87501bAADA7C8518aBe) | Proxy for iUSX
TransparentUpgradeableProxy.sol                             | [0x6D64eFfe3af8697336Fc57efD5A7517Ad526Dd6d](https://bscscan.com/address/0x6D64eFfe3af8697336Fc57efD5A7517Ad526Dd6d) | Proxy for iXRP
TransparentUpgradeableProxy.sol                             | [0x8be8cd81737b282C909F1911f3f0AdE630c335AA](https://bscscan.com/address/0x8be8cd81737b282C909F1911f3f0AdE630c335AA) | Proxy for iXTZ
TransparentUpgradeableProxy.sol                            | [0xc0bd38f08cdb278d0ff39e5c1996e4dc5062309c](https://bscscan.com/address/0xc0bd38f08cdb278d0ff39e5c1996e4dc5062309c) | Proxy for isUSX
TransparentUpgradeableProxy.sol                            | [0x219B850993Ade4F44E24E6cac403a9a40F1d3d2E](https://bscscan.com/address/0x219B850993Ade4F44E24E6cac403a9a40F1d3d2E) | Proxy for ixBTC
TransparentUpgradeableProxy.sol                            | [0xF649E651afE5F05ae5bA493fa34f44dFeadFE05d](https://bscscan.com/address/0xF649E651afE5F05ae5bA493fa34f44dFeadFE05d) | Proxy for ixETH
iTokenV2.sol | [0x2dcCE99fbd573Fabdbf3314aC885414B7051f9Cb](https://bscscan.com/address/0x2dcCE99fbd573Fabdbf3314aC885414B7051f9Cb) | Implementation

**Conflux**

File name | Contract deployed | Comment
--- | --- | ---
TimeLock.sol | [0x3f9E89ce069C3a5CAD749C9D953E9b57bEcCb236](https://evm.confluxscan.net/address/0x3f9E89ce069C3a5CAD749C9D953E9b57bEcCb236) | 
TransparentUpgradeableProxy.sol | [0xA377eCF53253275125D0a150aF195186271f6a56](https://evm.confluxscan.net/address/0xA377eCF53253275125D0a150aF195186271f6a56) | Proxy for ControllerV2.sol
ControllerV2.sol | [0x1e3c5C1D13Ec1d90432b1E859918bF861EAB2B58](https://evm.confluxscan.net/address/0x1e3c5C1D13Ec1d90432b1E859918bF861EAB2B58) | Implementation
ControllerV2ExtraExplicit.sol | [0xD9ae4E1a145e8b3FE875bdA137A49f01aF232E2b](https://evm.confluxscan.net/address/0xD9ae4E1a145e8b3FE875bdA137A49f01aF232E2b) | 
ControllerV2ExtraImplicit.sol | [0x09Ae43c2A4b9A74dfEFEa59d123b93b348dB96cD](https://evm.confluxscan.net/address/0x09Ae43c2A4b9A74dfEFEa59d123b93b348dB96cD) | 
TransparentUpgradeableProxy.sol                             | [0x620e8Ed48945d97CBea0B794F50E5e51950EbA24](https://evm.confluxscan.net/address/0x620e8Ed48945d97CBea0B794F50E5e51950EbA24) | Proxy for iETH
iETHV2.sol | [0x0a8e63A58f3ffcB387d8a2Ea0B02D83B686BDfA1](https://evm.confluxscan.net/address/0x0a8e63A58f3ffcB387d8a2Ea0B02D83B686BDfA1) | Implementation
TransparentUpgradeableProxy.sol | [0x3482f35B866E24D85AC29FfdbcD4A89EC65288c0](https://evm.confluxscan.net/address/0x3482f35B866E24D85AC29FfdbcD4A89EC65288c0) | Proxy for RewardDistributorSecondV3.sol
RewardDistributorSecondV3.sol | [0x7a2F91Ab4D5E97dE41c1df46d4A923D40CE224Dd](https://evm.confluxscan.net/address/0x7a2F91Ab4D5E97dE41c1df46d4A923D40CE224Dd) | Implementation
TransparentUpgradeableProxy.sol                             | [0x25CCd7E60550EF32266fA90441BcE2BA742d88bc](https://evm.confluxscan.net/address/0x25CCd7E60550EF32266fA90441BcE2BA742d88bc) | Proxy for iCFX
TransparentUpgradeableProxy.sol                            | [0xb88DC5AaE0C26903230ebc9a6fBAb8D511AF9897](https://evm.confluxscan.net/address/0xb88DC5AaE0C26903230ebc9a6fBAb8D511AF9897) | Proxy for iUSDC
TransparentUpgradeableProxy.sol                            | [0xC80aD49191113d31fe52427c01A197106ef5EB5b](https://evm.confluxscan.net/address/0xC80aD49191113d31fe52427c01A197106ef5EB5b) | Proxy for iUSDT
TransparentUpgradeableProxy.sol                             | [0x6f87b39a2e36F205706921d81a6861B655db6358](https://evm.confluxscan.net/address/0x6f87b39a2e36F205706921d81a6861B655db6358) | Proxy for iUSX
TransparentUpgradeableProxy.sol                            | [0xE08020a6517c1AD321D47c45Efbe1d76F5035d75](https://evm.confluxscan.net/address/0xE08020a6517c1AD321D47c45Efbe1d76F5035d75) | Proxy for iWBTC
iTokenV2.sol | [0x79E33374843c373F7feFA1a7E387244bab31AAE1](https://evm.confluxscan.net/address/0x79E33374843c373F7feFA1a7E387244bab31AAE1) | Implementation


***

### 1.5 Summary of findings

Severity | # of Findings
--- | ---
CRITICAL| 2
HIGH    | 5
MEDIUM  | 7
LOW | 11

***

### 1.6 Conclusion
The project encountered well-known issues such as inflation attack and proxy implementation self-destruction, which according to the developers were known to them and were supposed to be addressed through the correct deployment procedure. We recommend always resolving such issues through the code of smart contracts.

We also recommend enhancing the test coverage by better evaluating both positive and negative scenarios in the behavior of functions.

It is also important to remember that the user of the system can be not only an EOA (Externally Owned Account) but also a smart contract, which imposes certain limitations on the user's ability to interact with the system.

Dividing the Controller code into several smart contracts with non-trivial mutual calls complicates reading and analyzing the code. To enhance security, we recommend using simpler architectural solutions whenever possible.

During the audit, 2 critical, 5 high, 7 medium and 11 low severity issues have been discovered. All issues are confirmed by the developers and fixed or acknowledged.

***

## 2. FINDINGS REPORT

### 2.1 Critical

#### 1. Inflation attack on iToken
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/ebeee9639b8f4d039a642597fc72e6d8ee893a88.
##### Description
Until `iToken` has sufficient `totalSupply`, an attacker can manipulate the `underlying`/`iToken` exchange rate by directly transferring the underlying asset to the `iToken` smart contract. This leads to rounding issues in `mint` and `redeemUnderlying` causing a user to lose some amount of their underlying assets.

Due to the possibility of permanent loss of user assets, such issues have a critical severity rating.

Related code:
- rounding issues on mint
https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TokenBase/Base.sol#L199
- rounding issues on redeem underlying in iToken for native token
https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/iETH.sol#L140
- rounding issues on redeem underlying in iToken for ERC20 https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/iToken.sol#L126
##### Recommendation
Although this issue can be hotfixed through accurate deployment procedures and configuration settings, we recommend fixing it at the smart contract code level either by preventing the iToken from having a nonzero but small `totalSupply` or by ensuring accurate accounting of the underlying asset in the smart contract.

***

#### 2. A detached reward distributor can be drained
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/490a30f5a2e0e369f9ea52097b28254f11c5ada6.

##### Description
If admin decided to change the current reward distribution logic and set new one by using the [`_setRewardDistributor()`](https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/Controller.sol#L548) function,
 the prev version is supposed to distribute rewards for the prev period. 
After detaching the reward distribution contract from the controller, transfers don't track by the controller any more and by abusing this issue an attacker can drain rewards from the old distributor by using cycles charge balance then claim from different accounts or a flashloan attack.

##### Recommendation
We recommend following one of the two ways:
- allow tracking transfers by a few distributors at the same time,
- don't change the distributor address and use migration.

***

### 2.2 High

#### 1. The`ControllerV2` implementation can be destroyed by an attacker
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/bf28390f3a762f84ac39d3db18ce2b3ab6020937.
##### Description
The `ControllerV2` implementation code is vulnerable to a direct call of `initialize`. Since `initialize` executes `delegatecall` to an arbitrary address, an attacker can destroy the Controller's implementation contract, thus freezing the entire system until manual intervention by the proxy administrator occurs. This is accordingly rated as high in severity.

Related code - `delegatecall` to the arbitrary address: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2.sol#L57
##### Recommendation
Although this vulnerability can be hotfixed through an accurate deployment process, we recommend addressing it at the smart contract code level by preventing direct calls to `initialize` against the implementation address.

***

#### 2. Manipulation of global daily limits on `TimeLockStrategy`
##### Status
Acknowledged
##### Description
The global daily limits implemented in the audited code are susceptible to manipulation by an attacker, leading to inconvenience for legitimate users due to the time lock on any outgoing transfers. Since the system will remain in an undesired state until the smart contract owner intervenes, this issue is rated as high in severity.

Related code - procedure for accumulating daily statistics:
https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TimeLockStrategy.sol#L166
##### Recommendation
We recommend reworking the global limits to prevent manipulation.
##### Client's commentary
> We are aware of this, and working on a more sophisticated strategy to decide the delay of a outgoing transfer.

***

#### 3. Funds may freeze on the `TimeLock` if the beneficiary does not implement `claim()`
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/8ad82e8ef3dc4568d6bd4d8f06e13cec651d28d0.
##### Description
Assets from the `TimeLock` can only be claimed by their respective beneficiaries via calling the `claim` function. However, if the beneficiary is an immutable smart contract with no ability to invoke `claim` against the `TimeLock`, the locked assets become inaccessible to the beneficiary. Given that some accounts will be unable to access their assets until the manual intervention of the smart contract owner, this issue is rated as high in severity.

Related code - procedure of agreement execution:
https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/DefaultTimeLock.sol#L81
##### Recommendation
We recommend allowing any account to invoke the `claim`.

***

#### 4. Tokens in Segregated mode cannot be fully repaid by borrowers
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/820d9182f864ba50d425780d531df76f554804ce.
##### Description
Tokens that have the Segregated mode activated possess a designated `MarketV2.currentDebt` value. This value is prevented from surpassing the `debtCeiling` through borrow functions. Notably, the `ControllerV2ExtraExplicit.afterRepayBorrow` function employs the `SafeMath.sub` function to subtract the amount of repaid underlying assets from the `currentDebt` value. This function is designed to revert any underflow errors. However, the `currentDebt` value does not consider that the debt is increasing over time with `InterestRateModel`, associated with the `iToken`. Consequently, the repaid amount always exceeds the borrowed sum, causing borrowers unable to fully repay their debt until the contract's owner updates the `ControllerV2ExtraExplicit` implementation. 

This issue is labeled as `high`, since it imposes the potential to temporarily block specific `repayBorrow` transactions.

Related code - `beforeBorrow` for Segregated mode: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2ExtraExplicit.sol#L200
##### Recommendation
We recommend reseting the `currentDebt` value to `zero` in cases where `currentDebt` is less than `repayAmount`.

***

#### 5. Seizing assets as collateral without entering the market may result in incorrect value calculation
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/fa5cfaf13498eb8f29d90efa2c9c933b8de826e7.
##### Description
During liquidation, collateral may be seized even if the borrower has not entered the market with it. Sanity checks regarding the price oracle status for the seized asset will be skipped if the market has not been entered for this asset.

This issue is labeled as `high` since an outdated or inaccurate `iTokenCollateral` price could result in either excessive or insufficient payments to the liquidator.

Related code:
 - the `liquidateCalculateSeizeTokensV2` function: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2ExtraImplicit.sol#L477
 - `_liquidateBorrowInternal` https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/iTokenV2.sol#L76
 - `beforeLiquidateBorrow` https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2.sol#L346
##### Recommendation
We recommend prohibiting the seizure of assets that are not explicitly listed by the borrower as allowed collateral through `enterMarket`.

***

### 2.3 Medium

#### 1. `_exitMarket` always returns `true`, even on error
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/6315b9a2af1a1852c22f6be86930e3897457f7ba.
##### Description
The `_exitMarket` function, as per its specification, is designed to return `false` if the market isn't listed or not entered. However, in its current implementation, the function always returns `true`, leading to  inconsistency between the expected and actual outcomes.

Related code:
- function returns `true` even if the token is not listed https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/Controller.sol#L1401
- function returns `true` even if the market is not entered https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/Controller.sol#L1406
##### Recommendation
We recommend adjusting the `_exitMarket` function to return values in accordance with the expectations of both users and developers as well as the specification.

***

#### 2. Lack of speed-up functionality in the `TimeLock`
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/1df8a1da092065e6fe8f0c52840b0116bbe71ef2.
##### Description
Once created, an agreement in the `TimeLock` enforces a delay until the expiration time specified during the agreement's creation. If the delays are unintentionally long, the only remedy is to replace the `TimeLock` implementation.

Related code - procedure of agreement execution: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/DefaultTimeLock.sol#L83
##### Recommendation
We recommend implementing speed-up functionality in the `TimeLock` to address unintentionally prolonged delays.

***

#### 3. Potential desynchronization between asset transfer and agreement creation in the `TimeLock`
##### Status
Acknowledged
##### Description
In the audited code, asset transfer and agreement creation are treated as two separate processes.

- Assets can be transferred to the `TimeLock` without creating an agreement, leading to them being frozen.
- An agreement can be created without transferring assets and may be satisfied using assets intended for other agreements, rendering those agreements unsatisfiable.

Related code - agreement creation: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/DefaultTimeLock.sol#L47
##### Recommendation
Although the asset transfer and the agreement creation are currently synchronized (outside of the `TimeLock` smart contract), we recommend synchronizing them within the `TimeLock` smart contract itself to maintain the `TimeLock` state consistency.
##### Client's commentary
> Such solution is chosen as it simplifies the logic of `iToken`'s outgoing transfer and does not require additional `approve` to `TimeLock`.

***

#### 4. The lack of support of fee on transfer tokens in `DefaultTimeLock`
##### Status
Acknowledged
##### Description
The agreement creation precedes the token transfer. If a fee on transfer tokens is used, then the amount of tokens transferred may be reduced (due to transfer fees) and become less than the amount specified in the agreement for claiming.

This issue is labeled as `medium` since the resulted inconcistency can block the `claim` function until the `balance` of the timelock surpasses the quantity of tokens noted in the agreement.

Related code - agreement creation: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/DefaultTimeLock.sol#L47
##### Recommendation
We recommend reworking the `TimeLock` architecture to pull assets by `transferFrom` in the `createAgreement`. Additionally, it will help addressing previous finding.
##### Client's commentary
> We are aware of it and will carefully choose assets onboarding.

***

#### 5. Changing the `rewardToken` during distribution in `RewardDistributor` is dangerous
##### Status
Acknowledged
##### Description
Alterations to the `rewardToken` in the middle of distribution, especially without verifying the congruence of `decimals` between the previous and the new token and ensuring price consistency, can lead to potential risks of excessive or insufficient rewards to distribution recipients.

Related code - procedure of updating the reward token: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/RewardDistributorV3.sol#L105
##### Recommendation
We recommend disabling the `_setRewardToken` function if the current `rewardToken` is a non-zero address.
##### Client's commentary
> `_setRewardToken` will normally only be set once, we prefer to keep some flexibility here.

***

#### 6. Vulnerabilities to rug pull scenarios
##### Status
Acknowledged
##### Description
The contracts are `Ownable` with a possibility to change the contracts implementation to arbitrary code. Also, some contracts have functions to retreive the `ERC-20` tokens by the owner (e.g. `RewardDistributorV3.rescueTokens`, `iToken._withdrawReserves`).
##### Recommendation
To minimize the risk of a rug pull, we recommend utilizing the MultiSig and TimeLock techniques as the owner to ensure that no single entity has unilateral control. In the long run, consider transitioning to a DAO for governance functions.
##### Client's commentary
> Currently the ownership is ultimately controlled by a MultiSig and the governance process can be found on https://snapshot.org/#/dforcenet.eth.

***

#### 7. Assets may be unexpectedly seized
##### Status
Acknowledged
##### Description
During liquidation, collateral may be seized even if the borrower has not entered the market with it. Such behavior is likely unexpected for the borrower.

Related code:
 - the `liquidateCalculateSeizeTokensV2` function: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2ExtraImplicit.sol#L477
 - `_liquidateBorrowInternal` https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/iTokenV2.sol#L76
 - `beforeLiquidateBorrow` https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2.sol#L346
##### Recommendation
We recommend prohibiting the seizure of assets that are not explicitly listed by the borrower as allowed collateral through `enterMarket`.
##### Client's commentary
> It is a *feature* to ensure the protocol's solvency.

***

### 2.4 Low

#### 1. `isController` reports `true` on the implementation contract
##### Status
Acknowledged
##### Description
The `isController` view function is designed to prevent the accidental specification of an incorrect smart contract address as the controller address. However, the address of the `Controller` implementation incorrectly returns `true`, even though the valid controller address is intended to be a proxy address, not the implementation address.

Related code - `isController` view function: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/Controller.sol#L60
##### Recommendation
To enhance sanity checks, we recommend ensuring `isController` returns `false` when called against the implementation address.
##### Client's commentary
> We prefer to keep the proxy a pure proxy, and in some scenarios (mostly test cases), the controller are non-proxied.

***

#### 2. `extraImplicit` and `extraExplicit` are declared twice
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/27e7df6a41f74d2bb297f37eff8c2ea5644bc441.
##### Description
The storage variables `extraImplicit` and `extraExplicit` are declared twice in the code:
- [ControllerV2.sol L39-L43](https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2.sol#L39-L43)
- [ControllerStorage.sol L221-L225](https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerStorage.sol#L221-L225)
This could potentially lead to unexpected behavior.
##### Recommendation
We recommend removing the redundant declaration in `ControllerV2.sol`.

***

#### 3. A redundant `market` parameter  in `exitMarketFromiToken`
##### Status
Acknowledged
##### Description
The `exitMarketFromiToken` function is designed to let the `iToken` request an exit from the market for a specified account using the given `iToken`. However, by providing a market parameter different from `address(this)`, the iToken can be permitted to exit from a market other than its own.

Related code - exit from an arbitrary market: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2.sol#L512
##### Recommendation
We recommend eliminating the `market` parameter and utilizing `msg.sender` as a secure substitute.
##### Client's commentary
> `exitMarketFromiToken` is the conterpart of `enterMarketFromiToken`, which can be called from a `iTokenB` to collateralize `iTokenC` by a modified version(https://github.com/dforce-network/LendingContracts/blob/dfe35b5e7138f3c28dc11e52d841d962eb68a712/contracts/MiniPool/iMSDMiniPool.sol#L200C29-L200C29).
> We prefer to keep the interface consistant.

***

#### 4. A misleading function name `unfreezeAllAgreements`
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/dd99b2ab19f707992031baf901f21d93b526acdc.
##### Description
Despite its name, the `unfreezeAllAgreements` function does not actually unfreeze all agreements. It merely removes the global freeze flag that applies to all agreements, but an agreement will remain frozen if it was previously frozen by `freezeAgreements`.

Related code - procedure of agreement execution: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/DefaultTimeLock.sol#L86
##### Recommendation
We recommend changing the name of the `unfreezeAllAgreements` function to one that is more indicative of its actual functionality.

***

#### 5. The lack of verification of `timeLock.controller` in `_setTimeLock` setter
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/31d2a4607caf6c72053aa66df57f5b9eba4ab321
##### Description
The `_setTimeLock` setter does not perform verification whether `timeLock.controller` is equivalent to `address(this)` or not. This may lead to all the `transferOut` function for `iTokens` becoming inaccessible. 

Related code - `_setTimeLock`: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2ExtraImplicit.sol#L57
##### Recommendation
We recommend ensuring the equivalence of `timeLock.controller` and `address(this)` within the `_setTimeLock` function.

***

#### 6. Missing validations for non-zero `mintAmount`, `borrowAmount` and `repayAmount`
##### Status
Acknowledged
##### Description
In the current codebase, validations ensuring that `mintAmount`, `borrowAmount` and `repayAmount` are greater than zero are absent in the `iToken.mint`,`iToken.borrow`, `iToken.repayBorrow` functions respectively.

These missing checks can lead to unintended consequences, such as misleading event emissions or and registering empty collateral or borrow assets to users.

Related code:
- `mintInternal` https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TokenBase/Base.sol#L179
- `borrowInternal` https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TokenBase/Base.sol#L261
- `repayInternal` https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TokenBase/Base.sol#L299
##### Recommendation
We recommend inserting validation checks ensuring that the amounts are greater than zero to the following functions: `Base.borrowInternal`, `Base.repayInternal`, `Base.mintInternal`.
##### Client's commentary
> Prefer to keep it as it is.

***

#### 7. Permit logic doesn't follow the ERC-2612 specification
##### Status
Acknowledged
##### Description
The `iToken` uses a non-standard way to implement `permit`. It may cause compatibility issues when used in a third-party project.

Related code - implementation of `permit` in the `iToken`: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TokenBase/Base.sol#L524
##### Recommendation
We recommend using the way that OpenZeppelin recommends (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Permit.sol).
##### Client's commentary
> Prefer to keep it as it is.

***

#### 8. The Solidity version is not up to date
##### Status
Acknowledged
##### Description
The modern major version of the Solidity compiler is 0.8, but most of the codebase uses version 0.6.12.
##### Recommendation
We recommend using the up to date Solidity version.
##### Client's commentary
> Prefer to keep it as it is.

***

#### 9. Unintended ETH `receive` in the Controller
##### Status
Fixed in https://github.com/dforce-network/LendingContracts/commit/6845977f92994f8977097291584525d49be387c7.
##### Description
At line https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2.sol#L167
there is a receiver declared that isn't used anywhere.
##### Recommendation
We recommend removing the unused `receive()` function to prevent sending ETH to the contract.

***

#### 10. Using OpenZeppelin `__disableInitializers` in ControllerV2ExtraBase
##### Status
Acknowledged
##### Description
To avoid the ability to directly call the initialize() function at the implementation contract address, the constructor currently calls the initialize() function.

```
    constructor() public {
        __initialize();
    }

    function __initialize() internal initializer {
        __Ownable_init();
    }
```
OpenZeppelin provides a special function intended to disable initializers from the constructor.
##### Recommendation
We recommend using the OpenZeppelin `_disableInitializers` function.
##### Client's commentary
> We've chosen to maintain our current usage due to the absence of this implementation in OpenZeppelin version 3.3.0, ensuring consistency within the project.

***

#### 11. Using the OpenZeppelin `EnumerableSetUpgradeable.values()` function
##### Status
Acknowledged
##### Description
Currently, a loop is used to retrieve the values of the `EnumerableSetUpgradeable`. However, there is a special function intended to retrieve the values of the `EnumerableSetUpgradeable`.
##### Recommendation
We recommend using the `values` function to retreive the values of the `EnumerableSetUpgradeable`.
##### Client's commentary
> We've chosen to maintain our current usage due to the absence of this implementation in OpenZeppelin version 3.3.0, ensuring consistency within the project.

***

## 3. ABOUT MIXBYTES
MixBytes is a team of blockchain developers, auditors and analysts keen on decentralized systems. We build opensource solutions, smart contracts and blockchain protocols, perform security audits, work on benchmarking and software testing solutions, do research and tech consultancy.
