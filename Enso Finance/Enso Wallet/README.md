# Enso Wallet Security Audit Report

###### tags: `Enso Wallet`

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


##### Stage goal 
Eliminate typical vulnerabilities (e.g. reentrancy, gas limit, flash loan attacks etc.).

#### 3. Checking the code for compliance with the desired security model:

* Detailed study of the project documentation.
* Examination of contracts tests.
* Examination of comments in code.
* Comparison of the desired model obtained during the study with the reversed view obtained during the blind audit.
* PoC development for possible exploits with the use of such programs as Brownie and Hardhat.

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


### 1.3 Project Overview

Enso Wallet is a smart wallet supporting native tokens, ERC20, ERC721, ERC1151, and signing messages by ERC1271 standart and arbitrary custom transaction. 

Smart wallet shares one common implementation for all smart wallets. Every account may have several wallets with different so-called "wallet labels."

`EnsoBeacon` is a contract to govern the wallet implementation and the wallet factory implementation.

**Centralization warning**: Until renounced, the project administration can replace the initial wallet implementation with an insecure/unaudited one.

`EnsoWallet` is a smart wallet implementation to allow arbitrary calls to external contracts.

`EnsoWalletFactory` is a factory contract to deploy smart wallet instances.

### 1.4 Project Dashboard

#### Project Summary

Title | Description
--- | ---
Client             | Enso Finance
Project name       | Enso Wallet
Timeline           | 21 Nov 2022 - 20 Feb 2023
Number of Auditors | 3

#### Project Log

 Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
21.11.2022 | 4902e55608f975f73772310955444110b1cfc4fc | Initial commit for Enso Wallet
21.11.2022 | 7770653e40bec8206337bd4e08b5e3e7ef72c0c3 | Previous audit of Enso Weiroll by MixBytes
21.11.2022 | 0d658b5a6432d849c92c1ef3bcb9710b0004292e | Initial commit (enso-weiroll)
12.12.2022 | 9f65d93f409034a95f3cbac8cf4cbf7108fd29b4 | Code with fixes for reaudit (enso-wallet)
12.12.2022 | ff226659bb3e04ebbf43e1043898180d424c9d63 | Code with fixes for reaudit (enso-weiroll)
13.12.2022 | 56836bf1127df19af81aca58b7220199c9288907 | Code with the final fixes (enso-wallet)
26.01.2023 | 951a4a247165f4209bceb6deb628a4970bf3f6da | Code with additional fixes and improvements (enso-wallet)
26.01.2023 | 900250114203727ff236d3f6313673c17c2d90dd | Code with additional fixes and improvements (enso-weiroll)
 
#### Project Scope
The audit covered the following files:

File name | Link
--- | ---
CommandBuilder.sol | https://github.com/EnsoFinance/enso-weiroll/blob/0d658b5a6432d849c92c1ef3bcb9710b0004292e/contracts/CommandBuilder.sol
VM.sol | https://github.com/EnsoFinance/enso-weiroll/blob/0d658b5a6432d849c92c1ef3bcb9710b0004292e/contracts/VM.sol
EnsoBeacon.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoBeacon.sol
EnsoWalletFactory.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoWalletFactory.sol
EnsoWallet.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoWallet.sol
AccessController.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/access/AccessController.sol
ACL.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/access/ACL.sol
Ownable.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/access/Ownable.sol
Roles.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/access/Roles.sol
EnsoShortcutsHelpers.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/helpers/EnsoShortcutsHelpers.sol
MathHelpers.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/helpers/MathHelpers.sol
SignedMathHelpers.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/helpers/SignedMathHelpers.sol
TupleHelpers.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/helpers/TupleHelpers.sol
BeaconClones.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/libraries/BeaconClones.sol
StorageAPI.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/libraries/StorageAPI.sol
UpgradeableProxy.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/proxy/UpgradeableProxy.sol
ERC1271.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/wallet/ERC1271.sol
MinimalWallet.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/wallet/MinimalWallet.sol
Timelock.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/1ece0b19f09793e334134d9aed13e3c7b600d830/contracts/access/Timelock.sol



#### Deployments

##### 1. EnsoBeacon
Address: https://etherscan.io/address/0x277D98D33b7F44921d4230697DeF8d1D56aBAa62

Verified file | Source file | Comments
--- | --- | ---
File 1 of 5: EnsoBeacon.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/EnsoBeacon.sol | audited
File 2 of 5: Timelock.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/access/Timelock.sol | audited
File 3 of 5: IBeacon.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/interfaces/IBeacon.sol | reviewed
File 4 of 5: IOwnable.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/interfaces/IOwnable.sol | reviewed
File 5 of 5: IUUPS.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/interfaces/IUUPS.sol | reviewed

##### 2. EnsoWallet
Address: https://etherscan.io/address/0xb6Bc9B50b4AC1397AB03d8a24d8fa529a5070ff0

Verified file | Source file | Comments
--- | --- | ---
File 1 of 29: CommandBuilder.sol | https://github.com/EnsoFinance/enso-weiroll/blob/900250114203727ff236d3f6313673c17c2d90dd/contracts/CommandBuilder.sol | audited
File 2 of 29: VM.sol | https://github.com/EnsoFinance/enso-weiroll/blob/900250114203727ff236d3f6313673c17c2d90dd/contracts/VM.sol | audited
File 3 of 29: IERC1155.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/token/ERC1155/IERC1155.sol | trusted as part of OpenZeppelin
File 4 of 29: IERC1155Receiver.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/token/ERC1155/IERC1155Receiver.sol | trusted as part of OpenZeppelin
File 5 of 29: ERC1155Holder.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/token/ERC1155/utils/ERC1155Holder.sol | trusted as part of OpenZeppelin
File 6 of 29: ERC1155Receiver.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/token/ERC1155/utils/ERC1155Receiver.sol | trusted as part of OpenZeppelin
File 7 of 29: IERC20.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/token/ERC20/IERC20.sol | trusted as part of OpenZeppelin
File 8 of 29: draft-IERC20Permit.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/token/ERC20/extensions/draft-IERC20Permit.sol | trusted as part of OpenZeppelin
File 9 of 29: SafeERC20.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/49c0e4370d0cc50ea6090709e3835a3091e33ee2/contracts/token/ERC20/utils/SafeERC20.sol | trusted as part of OpenZeppelin*
File 10 of 29: IERC721.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/49c0e4370d0cc50ea6090709e3835a3091e33ee2/contracts/token/ERC721/IERC721.sol | trusted as part of OpenZeppelin*
File 11 of 29: IERC721Receiver.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/token/ERC721/IERC721Receiver.sol | trusted as part of OpenZeppelin
File 12 of 29: ERC721Holder.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/token/ERC721/utils/ERC721Holder.sol | trusted as part of OpenZeppelin
File 13 of 29: Address.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/49c0e4370d0cc50ea6090709e3835a3091e33ee2/contracts/utils/Address.sol | trusted as part of OpenZeppelin*
File 14 of 29: Strings.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/49c0e4370d0cc50ea6090709e3835a3091e33ee2/contracts/utils/Strings.sol | trusted as part of OpenZeppelin*
File 15 of 29: ECDSA.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/49c0e4370d0cc50ea6090709e3835a3091e33ee2/contracts/utils/cryptography/ECDSA.sol | trusted as part of OpenZeppelin*
File 16 of 29: ERC165.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/utils/introspection/ERC165.sol | trusted as part of OpenZeppelin
File 17 of 29: IERC165.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/utils/introspection/IERC165.sol | trusted as part of OpenZeppelin
File 18 of 29: Math.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/49c0e4370d0cc50ea6090709e3835a3091e33ee2/contracts/utils/math/Math.sol | trusted as part of OpenZeppelin*
File 19 of 29: EnsoWallet.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/EnsoWallet.sol | audited
File 20 of 29: ACL.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/access/ACL.sol | audited
File 21 of 29: AccessController.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/access/AccessController.sol | audited
File 22 of 29: Roles.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/access/Roles.sol | audited
File 23 of 29: IERC1271.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/interfaces/IERC1271.sol | reviewed
File 24 of 29: IEnsoWallet.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/interfaces/IEnsoWallet.sol | reviewed
File 25 of 29: IModuleManager.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/interfaces/IModuleManager.sol | reviewed
File 26 of 29: StorageAPI.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/libraries/StorageAPI.sol | audited
File 27 of 29: ERC1271.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/wallet/ERC1271.sol | audited
File 28 of 29: MinimalWallet.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/wallet/MinimalWallet.sol | audited
File 29 of 29: ModuleManager.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/wallet/ModuleManager.sol | audited

Although OpenZeppelin version 4.7.3 is specified at the package.json file, some files marked with an asterisk are probably imported from version 4.8.0. 

##### 3. EnsoWalletFactory
Address: https://etherscan.io/address/0x66fc62c1748E45435b06cF8dD105B73E9855F93E

Verified file | Source file | Comments
--- | --- | ---
File 1 of 11: draft-IERC1822.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/interfaces/draft-IERC1822.sol | trusted as part of OpenZeppelin
File 2 of 11: ERC1967Upgrade.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/proxy/ERC1967/ERC1967Upgrade.sol | trusted as part of OpenZeppelin
File 3 of 11: IBeacon.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/proxy/beacon/IBeacon.sol | trusted as part of OpenZeppelin
File 4 of 11: UUPSUpgradeable.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/49c0e4370d0cc50ea6090709e3835a3091e33ee2/contracts/proxy/utils/UUPSUpgradeable.sol | trusted as part of OpenZeppelin*
File 5 of 11: Address.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/49c0e4370d0cc50ea6090709e3835a3091e33ee2/contracts/utils/Address.sol | trusted as part of OpenZeppelin*
File 6 of 11: StorageSlot.sol | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d/contracts/utils/StorageSlot.sol | trusted as part of OpenZeppelin
File 7 of 11: EnsoWalletFactory.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/EnsoWalletFactory.sol | audited
File 8 of 11: Ownable.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/access/Ownable.sol | audited
File 9 of 11: IEnsoWallet.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/interfaces/IEnsoWallet.sol | reviewed
File 10 of 11: BeaconClones.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/libraries/BeaconClones.sol | audited
File 11 of 11: StorageAPI.sol | https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/libraries/StorageAPI.sol | audited

Although OpenZeppelin version 4.7.3 is specified at the package.json file, some files marked with an asterisk are probably imported from version 4.8.0. 



### 1.5 Summary of findings

Severity | # of Findings
--- | ---
CRITICAL| 2
HIGH    | 0
MEDIUM  | 3
LOW | 8



### 1.6 Conclusion
We discovered 2 critical, 3 medium, and 8 low severity issues during the audit process. All findings except the LOW.8 were fixed by the developers. Finding LOW.8 is a code style recommendation and currently has no impact on the safety of the project.



## 2. FINDINGS REPORT

### 2.1 Critical

#### 1. Destruction of the EnsoWallet implementation contract
##### Status
Fixed in https://github.com/EnsoFinance/shortcuts-contracts/commit/a5a4045a88f5cfa15ba559ef220ffc570a1de6bb.
##### Description
An attacker can make a direct call (not via proxy) to [EnsoWallet.initialize()](https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoWallet.sol#L24) and execute the SELFDESTRUCT opcode or specify themself as EXECUTOR and gain the ability to execute SELFDESTRUCT later. Consequently, the current implementation contract will be destroyed, and all users' wallet functionality will be inaccessible until the core upgrade. The worst case occurs if an attack happens after EnsoBeacon.renounceAdministration(), and all users' funds will be frozen.
##### Recommendation
We recommend disallowing direct calls to EnsoWallet.initialize().



#### 2. Front-run attack on the deployment of EnsoWalletFactory
##### Status
Fixed in https://github.com/EnsoFinance/shortcuts-contracts/commit/f6c0a5a45cf02b8424543daef57d8ae33353437c.
##### Description
An attacker can place their transactions between the deployment of the EnsoWalletFactory implementation and [EnsoWalletFactory.initialize()](https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoWalletFactory.sol#L26) to specify themself as the contract owner and make an upgrade of the EnsoWalletFactory to the modified one. The modified factory contract may implement backdoor functionality to gain control of the deployed user wallets.

##### Recommendation
We recommend improving the code of the upgradeable proxy to disallow the gain of ownership by arbitrary accounts or at least improve the deployment process in order to implement deployment and initialization in a single transaction.



### 2.2 High
Not found



### 2.3 Medium

#### 1. EXECUTOR has a full write access to the wallet storage
##### Status
Fixed in commit [ff226659bb3e04ebbf43e1043898180d424c9d63](https://github.com/EnsoFinance/enso-weiroll/commit/ff226659bb3e04ebbf43e1043898180d424c9d63).
##### Description
EXECUTOR has a write access to any storage slots vie the executeShortcut function and delegatecall to a specially crafted library. This allows to trigger
transfer/renounce of the OWNER address and other unintended actions.
https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoWallet.sol#L57
##### Recommendation
We recommend implementing an access control for the DELEGATECALL, i.e. a whitelist of permitted libraries.



#### 2. Admin can bypass the upgrade delay by `setDelay`
##### Status
Fixed in https://github.com/EnsoFinance/shortcuts-contracts/commit/1ece0b19f09793e334134d9aed13e3c7b600d830. 
##### Description
The contract implements a special flow to upgrade the wallet core with delay, but the admin can force an immediate upgrade by reducing the delay using setDelay().
https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoBeacon.sol#L208

This will deprive users of the ability to check implementations before applying.

##### Recommendation
We recommend improving the upgrade delay flow.



#### 3. Admin can bypass the upgrade delay by `delegate` and `emergencyUpgrade`
##### Status
Fixed in https://github.com/EnsoFinance/shortcuts-contracts/commit/1ece0b19f09793e334134d9aed13e3c7b600d830.
##### Description
The admin can bypass the upgrade delay flow and immediately change the address of the wallet core by following the sequence:
- `transferDelegation` (to a new `delegate` account, controlled by the admin)
- `acceptDelegation` (from the `delegate` account)
- `upgradeFallback` (from the admin account)
- `emegrencyUpgrade` (from the `delegate` account)
##### Recommendation
We recommend improving the upgrade delay flow.



### 2.4 Low

#### 1. Conflicting flow of pending `upgradeFactory` and `setFactory` 
##### Status
Fixed in https://github.com/EnsoFinance/shortcuts-contracts/commit/60780568f0437350db97379bcf13148eb20cd694.
##### Description
Calling [`finalizeUpgrade`](https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoBeacon.sol#L74) after `setFactory` can cause unexpected behavior.
##### Recommendation
We recommend improving the upgrade delayflow.



#### 2. Insufficient event emitting
##### Status
Fixed in https://github.com/EnsoFinance/shortcuts-contracts/commit/70e778d2b3c2e050908f11271a25d12e7a5c6dcd.
##### Description
In some edge cases it may be not so easy to obtain the wallet owner address and address of the factory that created it.
##### Recommendation
We recommend adding the wallet owner and the factory address to the [`Deployed` event](https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoWalletFactory.sol#L90).



#### 3. Potential hash collisions for constants
##### Status
Fixed in https://github.com/EnsoFinance/shortcuts-contracts/commit/e348cc18fc9df1fd5b5cf6d255d1fd6ecb616245.
##### Description
[The constants for the access roles `OWNER_ROLE` and `EXECUTOR_ROLE`](https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/access/Roles.sol#L5)
are vulnerable to potential hash collisions.
##### Recommendation
Although, we currently can't find any attack vector for this issue, we recommend improving the security of the constants by decreasing it by `-1` just like it is [implemented here](https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/access/Ownable.sol#L11).



#### 4. Null checks
##### Status
Fixed in https://github.com/EnsoFinance/shortcuts-contracts/commit/2280305c34695c35ff421145a7e76f1b3ca98bd1.
##### Description
Some parameters have no null checks:
- https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoBeacon.sol#L201
- https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoBeacon.sol#L123
- https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/access/AccessController.sol#L21
##### Recommendation
We recommend adding a null check for `newFactory`, `newImplementation` and `account`.



#### 5. Using ```memory``` instead of ```calldata```
##### Status
Fixed in https://github.com/EnsoFinance/shortcuts-contracts/commit/5145c45a1782e65837b5ee587fdee5c60753ab58.
##### Description
Using ```memory``` instead of ```calldata``` for input arrays in external functions:
https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/wallet/MinimalWallet.sol#L45
https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/wallet/MinimalWallet.sol#L84
https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/wallet/MinimalWallet.sol#L101
https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/wallet/MinimalWallet.sol#L112
https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/wallet/MinimalWallet.sol#L121
https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/wallet/MinimalWallet.sol#L145
https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/wallet/MinimalWallet.sol#L155
https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/wallet/MinimalWallet.sol#L165
##### Recommendation
We recommend replacing ```memory``` by ```calldata```.



#### 6. Spelling mistakes
##### Status
Fixed in https://github.com/EnsoFinance/shortcuts-contracts/commit/814f0e5fbd72b90c33bd434c43ed6bd53bd6c2b8.
##### Description
Some texts have spelling mistakes:
1) `balanceAdderess` -> `balanceAddress`
   https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/helpers/EnsoShortcutsHelpers.sol#L14
2) `renounes` -> `renouns`
   https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoBeacon.sol#L147
3) `alway` -> `always`
   https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoBeacon.sol#L179
4) `indetify` -> `identify`
   https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoWalletFactory.sol#L43
   https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoWalletFactory.sol#L79
5) `implemenation` -> `implementation`
   https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoBeacon.sol#L67
##### Recommendation
We recommend correcting the mistakes.



#### 7. Unchecked timelock delay
##### Status
Fixed in https://github.com/EnsoFinance/shortcuts-contracts/commit/1ece0b19f09793e334134d9aed13e3c7b600d830. 
##### Description
The administrator can inadvertently (i.e. using millisecond timestamp notation) setup a timelock delay that is too long. This may cause an unacceptably long delay (i.e. a two-year delay instead of a seven-day delay).
##### Recommendation
We recommend disallowing unintended long delays by limiting the maximum delay of the timelock with some reasonable value.



#### 8. Passing the `return data` by the EVM state
##### Status
Acknowledged
##### Description
[`execTransactionFromModuleReturnData`](https://github.com/EnsoFinance/shortcuts-contracts/blob/951a4a247165f4209bceb6deb628a4970bf3f6da/contracts/wallet/ModuleManager.sol#L45) is using `returndatasize` and `returndatacopy` in the assumption that virtual function `_executeCall` is preserving the result of the corresponding external call at the EVM state. As for the audited commit, this assumption is correct. However, the implementation of the virtual `_executeCall` function may become more complex during a past codebase development, and this assumption may break the contract logic later.
##### Recommendation
It is recommended to avoid using the EVM state as a method of passing values outside of a single solidity function, especially if the values are passed between functions located in different source files.



### 2.5 Appendix

#### 1 Monitoring Recommendation

The project contains smart contracts that require monitoring. For these purposes, it is recommended to proceed with developing new monitoring events based on Forta (https://forta.org) with which you can track the following exemplary incidents:

* core upgrades and pending core and factory contract upgrades
* administration transfers



## 3. ABOUT MIXBYTES
MixBytes is a team of blockchain developers, auditors and analysts keen on decentralized systems. We build opensource solutions, smart contracts and blockchain protocols, perform security audits, work on benchmarking and software testing solutions, do research and tech consultancy.
