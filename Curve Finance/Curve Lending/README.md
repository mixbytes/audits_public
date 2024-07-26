# Curve Lending Security Audit Report

###### tags: `Curve`, `lending`

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

Lending creates lending and borrowing markets. Users can borrow crvUSD against any token, or borrow any token against crvUSD in isolated mode.

Liquidity is provided in vaults, which are ERC4626 contracts.

***

### 1.4 Project Dashboard

#### Project Summary

Title | Description
--- | ---
Client             | Curve Finance
Project name       | Curve Lending
Timeline           | 06 February 2024 - 31 May 2024
Number of Auditors | 3

#### Project Log

 Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
30.05.2023 | c5169a7eb687a9878b989696a5c813dfc737e377 | Previous audit commit
06.02.2024 | c3f7040960627f023a2098232658c49e74400d03 | Commit for the audit
14.03.2024 | 9e20913fb46db6d3774c56b13ba17d6911cb2caa | Commit for the re-audit
10.05.2024 | c08a3ab8eb29d7622eddf432cb518eeec6f88b63 | Final commit
31.05.2024 | 25fb794f1acea1e1d498fab41f6cab9cbdc565e7 | Commit for the re-audit 2

#### Project Scope
The audit covered the following files:

File name | Link
--- | ---
AMM.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/AMM.vy
ControllerFactory.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/ControllerFactory.vy
Controller.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/Controller.vy
Stablecoin.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/Stablecoin.vy
Stableswap.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/Stableswap.vy
OneWayLendingFactory.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/lending/OneWayLendingFactory.vy
TwoWayLendingFactory.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/lending/TwoWayLendingFactory.vy
Vault.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/lending/Vault.vy
AggMonetaryPolicy2.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/mpolicies/AggMonetaryPolicy2.vy
AggMonetaryPolicy3.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/mpolicies/AggMonetaryPolicy3.vy
SemilogMonetaryPolicy.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/mpolicies/SemilogMonetaryPolicy.vy
AggregateStablePrice2.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/AggregateStablePrice2.vy
CryptoWithStablePrice.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/CryptoWithStablePrice.vy
CryptoFromPool.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/CryptoFromPool.vy
CryptoWithStablePriceFrxethN.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/CryptoWithStablePriceFrxethN.vy
CryptoWithStablePriceTBTC.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/CryptoWithStablePriceTBTC.vy
CryptoWithStablePriceWBTC.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/CryptoWithStablePriceWBTC.vy
CryptoWithStablePriceWstethN.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/CryptoWithStablePriceWstethN.vy
CryptoFromPoolVault.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/CryptoFromPoolVault.vy
OracleVaultWrapper.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/OracleVaultWrapper.vy
PegKeeper.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/stabilizer/PegKeeper.vy
OneWayLendingFactoryL2.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/lending/OneWayLendingFactoryL2.vy
CryptoFromPoolArbitrum.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/L2/CryptoFromPoolArbitrum.vy
CryptoFromPoolsRateArbitrum.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/L2/CryptoFromPoolsRateArbitrum.vy
CryptoFromPoolsRate.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/CryptoFromPoolsRate.vy
AggMonetaryPolicy.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/mpolicies/AggMonetaryPolicy.vy
SecondaryMonetaryPolicy.vy | https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/mpolicies/SecondaryMonetaryPolicy.vy

#### Deployments

**Ethereum:mainnet**
| File name | Contract | Comment |
|-|-|-|
OneWayLendingFactory.vy | [0xeA6876DDE9e3467564acBeE1Ed5bac88783205E0](https://etherscan.io/address/0xeA6876DDE9e3467564acBeE1Ed5bac88783205E0) | The Factory issues extra approvals to the AMM. This is safe
AMM.vy | [0xDf41E21dAe8Bf6Ae3eddb83337f8364Eb7FC1659](https://etherscan.io/address/0xDf41E21dAe8Bf6Ae3eddb83337f8364Eb7FC1659) | AMM implementation
Controller.vy | [0x4c5d4F542765B66154B2E789abd8E69ed4504112](https://etherscan.io/address/0x4c5d4F542765B66154B2E789abd8E69ed4504112) | Controller implementation. Minor changes from the latest commit
Vault.vy | [0xc014F34D5Ba10B6799d76b0F5ACdEEe577805085](https://etherscan.io/address/0xc014F34D5Ba10B6799d76b0F5ACdEEe577805085) | Vault implementation. Unnecessary functions were removed from the interface
SemilogMonetaryPolicy.vy | [0x4863c6dF17dD59311B7f67E694DD835ADC87f2d3](https://etherscan.io/address/0x4863c6dF17dD59311B7f67E694DD835ADC87f2d3) | Monetary policy implementation
CryptoFromPool.vy | [0xC455e6c7936C2382f04306D329ABc5d36444D3F8](https://etherscan.io/address/0xC455e6c7936C2382f04306D329ABc5d36444D3F8) | Oracle implementation
LiquidityGauge.vy | [0x79D584d2D49eC8CE8Ea379d69364b700bd35874D](https://etherscan.io/address/0x79D584d2D49eC8CE8Ea379d69364b700bd35874D) | Gauge implementation
**Market 0: wstETH/crvUSD** | |
AMM.vy | [0x847D7a5e4Aa4b380043B2908C29a92E2e5157E64](https://etherscan.io/address/0x847D7a5e4Aa4b380043B2908C29a92E2e5157E64) | Dynamic fees are not fully implemented. Fixed by setting high fees
Controller.vy | [0x1E0165DbD2019441aB7927C018701f3138114D71](https://etherscan.io/address/0x1E0165DbD2019441aB7927C018701f3138114D71) | Minor changes
Vault.vy | [0x8cf1DE26729cfB7137AF1A6B2a665e099EC319b5](https://etherscan.io/address/0x8cf1DE26729cfB7137AF1A6B2a665e099EC319b5) | Unnecessary functions were removed from the interface
SemilogMonetaryPolicy.vy | [0x112E37742015ECe4cEB4b576a9434940838eAf02](https://etherscan.io/address/0x112E37742015ECe4cEB4b576a9434940838eAf02) | wstETH Market
CryptoFromPool.vy | [0x5e2406D3D86F8c4a22baC9713F0A38804e9Ef181](https://etherscan.io/address/0x5e2406D3D86F8c4a22baC9713F0A38804e9Ef181) | wstETH Market
**Market 1: WETH/crvUSD** | |
AMM.vy | [0xb46aDcd1eA7E35C4EB801406C3E76E76e9a46EdF](https://etherscan.io/address/0xb46aDcd1eA7E35C4EB801406C3E76E76e9a46EdF) | Dynamic fees are not fully implemented. Fixed by setting high fees.
Controller.vy | [0xaade9230AA9161880E13a38C83400d3D1995267b](https://etherscan.io/address/0xaade9230AA9161880E13a38C83400d3D1995267b) | Minor changes.
Vault.vy | [0x5AE28c9197a4a6570216fC7e53E7e0221D7A0FEF](https://etherscan.io/address/0x5AE28c9197a4a6570216fC7e53E7e0221D7A0FEF) | Unnecessary functions were removed from the interface.
SemilogMonetaryPolicy.vy | [0xa6c73DC07E17Feda6925C2a4F44C166Fc18Fcf1F](https://etherscan.io/address/0xa6c73DC07E17Feda6925C2a4F44C166Fc18Fcf1F) | 
CryptoFromPool.vy | [0x6530B69479549BD3Cc806463964d58D69c285BD8](https://etherscan.io/address/0x6530B69479549BD3Cc806463964d58D69c285BD8) | 
**Market 2: tBTC/crvUSD** | |
AMM.vy | [0x5338B1bf469651a5951ef618Fb5DeFbffaed7BE9](https://etherscan.io/address/0x5338B1bf469651a5951ef618Fb5DeFbffaed7BE9) | Dynamic fees are not fully implemented. Fixed by setting high fees.
Controller.vy | [0x413FD2511BAD510947a91f5c6c79EBD8138C29Fc](https://etherscan.io/address/0x413FD2511BAD510947a91f5c6c79EBD8138C29Fc) | Minor changes.
Vault.vy | [0xb2b23C87a4B6d1b03Ba603F7C3EB9A81fDC0AAC9](https://etherscan.io/address/0xb2b23C87a4B6d1b03Ba603F7C3EB9A81fDC0AAC9) | Unnecessary functions were removed from the interface.
SemilogMonetaryPolicy.vy | [0xde31c340545c8031843Bff5Eb42640009961aeEF](https://etherscan.io/address/0xde31c340545c8031843Bff5Eb42640009961aeEF) | 
CryptoFromPool.vy | [0xeF42b6525454dAbA2d73441a5c749c82a942692B](https://etherscan.io/address/0xeF42b6525454dAbA2d73441a5c749c82a942692B) | 
**Market 3: CRV/crvUSD** | |
AMM.vy | [0xafca625321Df8D6A068bDD8F1585d489D2acF11b](https://etherscan.io/address/0xafca625321Df8D6A068bDD8F1585d489D2acF11b) | Dynamic fees are not fully implemented. Fixed by setting high fees.
Controller.vy | [0xEdA215b7666936DEd834f76f3fBC6F323295110A](https://etherscan.io/address/0xEdA215b7666936DEd834f76f3fBC6F323295110A) | Minor changes.
Vault.vy | [0xCeA18a8752bb7e7817F9AE7565328FE415C0f2cA](https://etherscan.io/address/0xCeA18a8752bb7e7817F9AE7565328FE415C0f2cA) | Unnecessary functions were removed from the interface.
SemilogMonetaryPolicy.vy | [0x8b6527063FbC9c30731D7E57F1DEf08edce57d07](https://etherscan.io/address/0x8b6527063FbC9c30731D7E57F1DEf08edce57d07) | 
CryptoFromPool.vy | [0xE0a4C53408f5ACf3246c83b9b8bD8d36D5ee38B8](https://etherscan.io/address/0xE0a4C53408f5ACf3246c83b9b8bD8d36D5ee38B8) | 
**Market 4: CRV/crvUSD** | |
AMM.vy | [0xe7B1c8cfC0Bc45957320895aA06884d516DAA8e6](https://etherscan.io/address/0xe7B1c8cfC0Bc45957320895aA06884d516DAA8e6) | Dynamic fees are not fully implemented. Fixed by setting high fees.
Controller.vy | [0xC510d73Ad34BeDECa8978B6914461aA7b50CF3Fc](https://etherscan.io/address/0xC510d73Ad34BeDECa8978B6914461aA7b50CF3Fc) | Minor changes.
Vault.vy | [0x4D2f44B0369f3C20c3d670D2C26b048985598450](https://etherscan.io/address/0x4D2f44B0369f3C20c3d670D2C26b048985598450) | Unnecessary functions were removed from the interface.
SemilogMonetaryPolicy.vy | [0x40A442F8CBFd125a762b55F76D9Dba66F84Dd6DD](https://etherscan.io/address/0x40A442F8CBFd125a762b55F76D9Dba66F84Dd6DD) | 
CryptoFromPool.vy | [0xD4Dc9D7567F76fAD2b5A90D3a1bdb3eE801435A8](https://etherscan.io/address/0xD4Dc9D7567F76fAD2b5A90D3a1bdb3eE801435A8) | 
**Market 5: WETH/crvUSD** | |
AMM.vy | [0x08Ba6D7c10d1A7850aE938543bfbEA7C0240F9Cf](https://etherscan.io/address/0x08Ba6D7c10d1A7850aE938543bfbEA7C0240F9Cf) | Dynamic fees are not fully implemented. Fixed by setting high fees.
Controller.vy | [0xa5D9137d2A1Ee912469d911A8E74B6c77503bac8](https://etherscan.io/address/0xa5D9137d2A1Ee912469d911A8E74B6c77503bac8) | Minor changes.
Vault.vy | [0x46196C004de85c7a75C8b1bB9d54Afb0f8654A45](https://etherscan.io/address/0x46196C004de85c7a75C8b1bB9d54Afb0f8654A45) | Unnecessary functions were removed from the interface.
SemilogMonetaryPolicy.vy | [0xbDb065458d34DB77d1fB2862D367edd8275f8352](https://etherscan.io/address/0xbDb065458d34DB77d1fB2862D367edd8275f8352) | 
CryptoFromPool.vy | [0x4f4B897871902d05cBa110B8e892498f12a20443](https://etherscan.io/address/0x4f4B897871902d05cBa110B8e892498f12a20443) | 
**Market 6: tBTC/crvUSD** | |
AMM.vy | [0xfcb53ED72dAB68091aA6a2aB68b5116639ED8805](https://etherscan.io/address/0xfcb53ED72dAB68091aA6a2aB68b5116639ED8805) | Dynamic fees are not fully implemented. Fixed by setting high fees.
Controller.vy | [0xe438658874b0acf4D81c24172E137F0eE00621b8](https://etherscan.io/address/0xe438658874b0acf4D81c24172E137F0eE00621b8) | Minor changes.
Vault.vy | [0x99Cff9Dc26A44dc2496B4448ebE415b5E894bd30](https://etherscan.io/address/0x99Cff9Dc26A44dc2496B4448ebE415b5E894bd30) | Unnecessary functions were removed from the interface.
SemilogMonetaryPolicy.vy | [0x62cD08caDABF473315D8953995DE0Dc0928b7D3C](https://etherscan.io/address/0x62cD08caDABF473315D8953995DE0Dc0928b7D3C) | 
CryptoFromPool.vy | [0x33A95b2121fd4eC89D9fA6C5FD21545270bC06a6](https://etherscan.io/address/0x33A95b2121fd4eC89D9fA6C5FD21545270bC06a6) | 
**Market 7: sUSDe/crvUSD** | |
AMM.vy | [0x9bBdb1b160B48C48efCe260aaEa4505b1aDE8f4B](https://etherscan.io/address/0x9bBdb1b160B48C48efCe260aaEa4505b1aDE8f4B) | Dynamic fees are not fully implemented. Fixed by setting high fees.
Controller.vy | [0x98Fc283d6636f6DCFf5a817A00Ac69A3ADd96907](https://etherscan.io/address/0x98Fc283d6636f6DCFf5a817A00Ac69A3ADd96907) | Minor changes.
Vault.vy | [0x52096539ed1391CB50C6b9e4Fd18aFd2438ED23b](https://etherscan.io/address/0x52096539ed1391CB50C6b9e4Fd18aFd2438ED23b) | Unnecessary functions were removed from the interface.
SemilogMonetaryPolicy.vy | [0xF82A5a3c69cA11601C9aD4A351A75857bDd1365F](https://etherscan.io/address/0xF82A5a3c69cA11601C9aD4A351A75857bDd1365F) | 
CryptoFromPool.vy | [0x50c39EA8f3D72310C8B56A56B333994266e9b477](https://etherscan.io/address/0x50c39EA8f3D72310C8B56A56B333994266e9b477) | 
**Market 8: UwU/crvUSD** | |
AMM.vy | [0x6BE658242b769500f27498Ba0637406E417507b1](https://etherscan.io/address/0x6BE658242b769500f27498Ba0637406E417507b1) | 
Controller.vy | [0x09dBDEB3b301A4753589Ac6dF8A178C7716ce16B](https://etherscan.io/address/0x09dBDEB3b301A4753589Ac6dF8A178C7716ce16B) | Old commit, minor changes
Vault.vy | [0x7586C58bf6292B3C9DeFC8333fc757d6c5dA0f7E](https://etherscan.io/address/0x7586C58bf6292B3C9DeFC8333fc757d6c5dA0f7E) | Unnecessary functions were removed from the interface.
SemilogMonetaryPolicy.vy | [0x9058237c94551770BbB58b710E23e5277b6837da](https://etherscan.io/address/0x9058237c94551770BbB58b710E23e5277b6837da) | 
CryptoFromPool.vy | [0xBcda2aCfE820c92B8E0b389733AaaAE4f930A9F1](https://etherscan.io/address/0xBcda2aCfE820c92B8E0b389733AaaAE4f930A9F1) | 
**Market 9: WBTC/crvUSD** | |
AMM.vy | [0x8eeDE294459EFaFf55d580bc95C98306Ab03F0C8](https://etherscan.io/address/0x8eeDE294459EFaFf55d580bc95C98306Ab03F0C8) | 
Controller.vy | [0xcaD85b7fe52B1939DCEebEe9bCf0b2a5Aa0cE617](https://etherscan.io/address/0xcaD85b7fe52B1939DCEebEe9bCf0b2a5Aa0cE617) | Old commit, minor changes
Vault.vy | [0xccd37EB6374Ae5b1f0b85ac97eFf14770e0D0063](https://etherscan.io/address/0xccd37EB6374Ae5b1f0b85ac97eFf14770e0D0063) | Unnecessary functions were removed from the interface.
SemilogMonetaryPolicy.vy | [0xE53C7e8857fAd35dF5a02a2899CaF5871A50bA95](https://etherscan.io/address/0xE53C7e8857fAd35dF5a02a2899CaF5871A50bA95) | 
CryptoFromPool.vy | [0xE3ee57D3fbdBAE9b506a92da79Ca8454AC288E2C](https://etherscan.io/address/0xE3ee57D3fbdBAE9b506a92da79Ca8454AC288E2C) | 
**Market 10: pufETH/crvUSD** | |
AMM.vy | [0xcd28cF8f7755f03967D27E128B38022B63919836](https://etherscan.io/address/0xcd28cF8f7755f03967D27E128B38022B63919836) | 
Controller.vy | [0x4f87158350c296955966059C50263F711cE0817C](https://etherscan.io/address/0x4f87158350c296955966059C50263F711cE0817C) | Old commit, minor changes
Vault.vy | [0xff467c6E827ebbEa64DA1ab0425021E6c89Fbe0d](https://etherscan.io/address/0xff467c6E827ebbEa64DA1ab0425021E6c89Fbe0d) | Unnecessary functions were removed from the interface.
SemilogMonetaryPolicy.vy | [0x2e478Df674e25b2724B1aC9BCABa644943dA359F](https://etherscan.io/address/0x2e478Df674e25b2724B1aC9BCABa644943dA359F) | 
CryptoFromPool.vy | [0xb08eB288C57a37bC82238168ad96e15975602cd9](https://etherscan.io/address/0xb08eB288C57a37bC82238168ad96e15975602cd9) | 

**Arbitrum:mainnet**
| File name | Contract | Comment |
|-|-|-|
OneWayLendingFactoryL2.vy | [0xcaEC110C784c9DF37240a8Ce096D352A75922DeA](https://arbiscan.io/address/0xcaEC110C784c9DF37240a8Ce096D352A75922DeA) | 
AMM.vy | [0xaA2377F39419F8f4CB98885076c41fE547C65a6A](https://arbiscan.io/address/0xaA2377F39419F8f4CB98885076c41fE547C65a6A) | AMM implementation
Controller.vy | [0xd5DCcBf65f0BC66934e1B2a7e515A35535f91B97](https://arbiscan.io/address/0xd5DCcBf65f0BC66934e1B2a7e515A35535f91B97) | Controller implementation.  Old commit. Minor changes
Vault.vy  | [0x104e15102E4Cf33e0e2cB7C304D406B523B04d7a](https://arbiscan.io/address/0x104e15102E4Cf33e0e2cB7C304D406B523B04d7a) | Vault implementation. Unnecessary functions were removed from the interface
CryptoFromPool.vy | [0x57390a776A2312eF8BFc25e8624483303Dd8DfF8](https://arbiscan.io/address/0x57390a776A2312eF8BFc25e8624483303Dd8DfF8) | Oracle implementation
SemilogMonetaryPolicy.vy | [0x0b3536245faDABCF091778C4289caEbDc2c8f5C1](https://arbiscan.io/address/0x0b3536245faDABCF091778C4289caEbDc2c8f5C1) | Monetary policy implementation
**Market 0: WETH/crvUSD**| | |
AMM.vy |  [0x38EB8Af29A75eAdf91A3E702B73244d0Eb1F2bF2](https://arbiscan.io/address/0x38EB8Af29A75eAdf91A3E702B73244d0Eb1F2bF2) | 
Controller.vy |[0xB5B6f0E69c283AA32425FA18220e64283B51F0A4](https://arbiscan.io/address/0xB5B6f0E69c283AA32425FA18220e64283B51F0A4) | Old commit. Minor changes
Vault.vy |  [0x49014A8eB1585cBee6A7a9A50C3b81017BF6Cc4d](https://arbiscan.io/address/0x49014A8eB1585cBee6A7a9A50C3b81017BF6Cc4d) | Unnecessary functions were removed from the interface
SemilogMonetaryPolicy.vy | [0xEB9c27A490eDE4f82c05d320FA741989048BD597](https://arbiscan.io/address/0xEB9c27A490eDE4f82c05d320FA741989048BD597) | 
CryptoFromPool.vy | [0x4B24b02d165157Fa5F5f4975499da97C83E4cd26](https://arbiscan.io/address/0x4B24b02d165157Fa5F5f4975499da97C83E4cd26) | 
**Market 1: WBTC/crvUSD**| | |
AMM.vy |  [0x12D1c9434aFC60f65EEe4431b185e01a11355Db0](https://arbiscan.io/address/0x12D1c9434aFC60f65EEe4431b185e01a11355Db0) | 
Controller.vy |[0x013be86e1cdb0f384dAF24Bd974FE75EdFfe6B68](https://arbiscan.io/address/0x013be86e1cdb0f384dAF24Bd974FE75EdFfe6B68) | Old commit. Minor changes
Vault.vy |  [0x60D38b12d22BF423F28082bf396ff8F28cC506B1](https://arbiscan.io/address/0x60D38b12d22BF423F28082bf396ff8F28cC506B1) | Unnecessary functions were removed from the interface
SemilogMonetaryPolicy.vy |  [0xEdbbD476893C7A938c14AAC27A05B0e98C8a68F7](https://arbiscan.io/address/0xEdbbD476893C7A938c14AAC27A05B0e98C8a68F7) | 
CryptoFromPool.vy |  [0x772dc33c94132864263a43bfb1ab14e68f716188](https://arbiscan.io/address/0x772dc33c94132864263a43bfb1ab14e68f716188) | 
**Market 2: WBTC/crvUSD**| | |
AMM.vy | [0x772B6Fb77aD572161Cc535661439184453Ee5c41](https://arbiscan.io/address/0x772B6Fb77aD572161Cc535661439184453Ee5c41) | 
Controller.vy | [0x28c20590de7539C316191F413686dcF794d8898E](https://arbiscan.io/address/0x28c20590de7539C316191F413686dcF794d8898E) | Old commit. Minor changes
Vault.vy |  [0xB50409Dd4D5B418042ab4DCee6a2FA7D1FE2fcf8](https://arbiscan.io/address/0xB50409Dd4D5B418042ab4DCee6a2FA7D1FE2fcf8) | Unnecessary functions were removed from the interface
SemilogMonetaryPolicy.vy | [0xBcAbDED2d23162d1e3351a9a713543E2CeE79559](https://arbiscan.io/address/0xBcAbDED2d23162d1e3351a9a713543E2CeE79559) | 
CryptoFromPool.vy | [0x9B053d1C660c73a22c1fE5d7F9189Cf7D8fa46bd](https://arbiscan.io/address/0x9B053d1C660c73a22c1fE5d7F9189Cf7D8fa46bd) | 
**Market 3: CRV/crvUSD**| | |
AMM.vy | [0x742089D51DD708dE2C728aA7F3172f28fe419424](https://arbiscan.io/address/0x742089D51DD708dE2C728aA7F3172f28fe419424) | 
Controller.vy | [0x88f88e937Db48bBfe8E3091718576430704e47Ab](https://arbiscan.io/address/0x88f88e937Db48bBfe8E3091718576430704e47Ab) | Old commit. Minor changes
Vault.vy | [0xeEaF2ccB73A01deb38Eca2947d963D64CfDe6A32](https://arbiscan.io/address/0xeEaF2ccB73A01deb38Eca2947d963D64CfDe6A32) | Unnecessary functions were removed from the interface
SemilogMonetaryPolicy.vy | [0x1F56Fb63e54F459a9b448D8feECd40AEf3D27B21](https://arbiscan.io/address/0x1F56Fb63e54F459a9b448D8feECd40AEf3D27B21) | 
CryptoFromPool.vy | [0x20ee737f3BBA55D3EEE64B226dF47c575B6538C9](https://arbiscan.io/address/0x20ee737f3BBA55D3EEE64B226dF47c575B6538C9) | 
**Market 4: ARB/crvUSD**| | |
AMM.vy | [0x33e5ea2f7E7f050d1c2e981d659e37B2445aEE09](https://arbiscan.io/address/0x33e5ea2f7E7f050d1c2e981d659e37B2445aEE09) | 
Controller.vy | [0x76709bC0dA299Ab0234EEC51385E900922AE98f5](https://arbiscan.io/address/0x76709bC0dA299Ab0234EEC51385E900922AE98f5) | Old commit. Minor changes
Vault.vy |  [0x65592b1F12c07D434e95c7BF87F4f2f464e950e4](https://arbiscan.io/address/0x65592b1F12c07D434e95c7BF87F4f2f464e950e4) | Unnecessary functions were removed from the interface
SemilogMonetaryPolicy.vy | [0xc4fFBf2CeCeEf36BaDA8aA5054d77f770341eCA0](https://arbiscan.io/address/0xc4fFBf2CeCeEf36BaDA8aA5054d77f770341eCA0) | 
CryptoFromPool.vy | [0x6341D0C2d96C73666ab4B491c41dbcFA6F9e696C](https://arbiscan.io/address/0x6341D0C2d96C73666ab4B491c41dbcFA6F9e696C) | 
**Market 5: FXN/crvUSD**| | |
AMM.vy | [0x27dd806476D0eff4fa0b7D3749E7bdB51D4Bf026](https://arbiscan.io/address/0x27dd806476D0eff4fa0b7D3749E7bdB51D4Bf026) | 
Controller.vy | [0xAe659CE8f2f23649E09e92D164244AA127A7a2c7](https://arbiscan.io/address/0xAe659CE8f2f23649E09e92D164244AA127A7a2c7) | Old commit. Minor changes
Vault.vy |  [0xb56369a6519F84C6fD92644D421273618B8d62B0](https://arbiscan.io/address/0xb56369a6519F84C6fD92644D421273618B8d62B0) | Unnecessary functions were removed from the interface
SemilogMonetaryPolicy.vy | [0x0914E7879473f26F7a5810d9B5865e8af4b7ACA7](https://arbiscan.io/address/0x0914E7879473f26F7a5810d9B5865e8af4b7ACA7) | 
CryptoFromPool.vy |  [0x6EFE6D76f0dAA3E01b690f667087d050F98e8835](https://arbiscan.io/address/0x6EFE6D76f0dAA3E01b690f667087d050F98e8835) | 
**Market 6: FXN/crvUSD**| | |
AMM.vy | [0xbEAC2f5661Bfd2905a506eC0DeFf2AeC3D627063](https://arbiscan.io/address/0xbEAC2f5661Bfd2905a506eC0DeFf2AeC3D627063) | 
Controller.vy | [0x7Adcc491f0B7f9BC12837B8F5Edf0e580d176F1f](https://arbiscan.io/address/0x7Adcc491f0B7f9BC12837B8F5Edf0e580d176F1f) | Old commit. Minor changes
Vault.vy |  [0xebA51f6472F4cE1C47668c2474ab8f84B32E1ae7](https://arbiscan.io/address/0xebA51f6472F4cE1C47668c2474ab8f84B32E1ae7) | Unnecessary functions were removed from the interface
SemilogMonetaryPolicy.vy | [0x1e4D74DC0b9821402991ab58aE67A7Ef9269c379](https://arbiscan.io/address/0x1e4D74DC0b9821402991ab58aE67A7Ef9269c379) | 
CryptoFromPool.vy |  [0xbB82bf9a0C6739c0bacFdFFbcE3D2Ec4AA97970E](https://arbiscan.io/address/0xbB82bf9a0C6739c0bacFdFFbcE3D2Ec4AA97970E) | 
**Market 7: AssetVaultUSDC/crvUSD**| | |
AMM.vy | [0x134477CD1B74F176D1303f2E825b7252b962BFD4](https://arbiscan.io/address/0x134477CD1B74F176D1303f2E825b7252b962BFD4) | 
Controller.vy | [0x4064Ed6Ae070F126F56c47c8a8CdD6B924668b5D](https://arbiscan.io/address/0x4064Ed6Ae070F126F56c47c8a8CdD6B924668b5D) |  Old commit. Minor changes
Vault.vy |  [0x2415747A063B55bFeb65e22f9a95a83e0151e4F8](https://arbiscan.io/address/0x2415747A063B55bFeb65e22f9a95a83e0151e4F8) | Unnecessary functions were removed from the interface
SemilogMonetaryPolicy.vy | [0x6a94FBc475b2A54237929115a8dA842370AfD23c](https://arbiscan.io/address/0x6a94FBc475b2A54237929115a8dA842370AfD23c) | 
CryptoFromPool.vy |  [0x9f48648316E6D90822B9C6f1E46b48c4DB6ea79B](https://arbiscan.io/address/0x9f48648316E6D90822B9C6f1E46b48c4DB6ea79B) | 

***

### 1.5 Summary of findings

Severity | # of Findings
--- | ---
CRITICAL| 1
HIGH    | 2
MEDIUM  | 5
LOW | 7

***

### 1.6 Conclusion

In this audit, we have examined various security and functionality aspects to ensure the robustness and reliability of the system. Our primary focus was on the lending features built on the existing codebase of the Curve stablecoin, particularly the interactions between vaults in the TwoWayLendingFactory and the broader implications of permissionless pool deployment. Based on our findings, we offer several suggestions to enhance the project's security posture and user experience.

**Key Audit Vectors:**

- **Reentrancy Attacks**: We checked for reentrancy attacks, especially when combining two pools within the TwoWayLendingFactory. Thanks to the implementation of `check_lock()` mechanisms and non-reentrant flags, we found no vulnerabilities in this area.
- **Vault Share Attacks and Inflation**: We analyzed potential attacks on vault shares, including inflation attacks and rounding errors, ensuring the integrity of asset valuation within the system.
- **Oracle Price Manipulation**: Our examination extended to potential manipulations of oracle prices, particularly the impact on share prices in two-way lending and issues arising from price volatility.
- **Interest Rate Accrual Accuracy**: We verified the correctness of interest rate accruals crucial for maintaining fair and predictable lending and borrowing conditions.
- **Factory Invariants and Common Issues**: Attempts were made to disrupt or exploit factory invariants, alongside a comprehensive check for common security issues prevalent in DeFi protocols.

**Recommendations:**

- **Enhanced Documentation for Users**: Given the permissionless nature of pool deployment, it is vital to improve documentation for users. Clarifications on the risks associated with the delay between the EMA Oracle and instant prices, especially in scenarios where a token's price might surge by 20% leading to potential pool insolvency, would be beneficial. Including simulation examples that detail these parameters and warnings against using unconventional tokens (e.g., tokens with fees, ERC-777, or rebaseable tokens) could significantly enhance user understanding and safety.
- **Code Comment Revisions**: Some code comments require updates for clarity, such as specifying that the `use_eth` parameter in Controller is now unused.

**Notes on Fixes**

The final commit includes two fixes aimed at addressing the issue of hard liquidations in cases of oracle manipulation.

To address the issue of manipulations through Inflation Attack for some oracles, a limit on the rate of price growth was introduced. It should be noted that such a limit will create a lag between the real and actual price of the asset. Therefore additional analysis is needed to ensure that this lag does not affect the delay in the PegKeeper's operation. If the PegKeeper is late in normalizing the price, some borrowers may face unfair liquidations.

To protect against two-block market manipulations, special dynamic fees were introduced, making the attack more costly. It should be noted that for some older AMMs, this feature was not implemented, so fees were manually increased as a hotfix. Dynamic and increased fees do not fully protect against manipulations but they significantly raise the cost of a two-block attack and make this vector even less realistic.

Another note concerns the incorrect operation of the `remove_price_pair()` function: since old contracts are not upgradeable, a workaround is expected to be used. One can remove several items from the end of the list and then add them back again without the one to be removed, all in a single transaction.

***

## 2. FINDINGS REPORT

### 2.1 Critical

#### 1. An inflation attack allows for hard liquidations
##### Status
Fixed in https://github.com/curvefi/curve-stablecoin/commit/9e20913fb46db6d3774c56b13ba17d6911cb2caa
##### Description
In `TwoWayLending`, the share price can easily inflate through a direct transfer of funds to the `Controller`. This can be used to trigger hard liquidations:
1. A hacker buys the victim's collateral shares in the `AMM` using `exchange()`.
2. The hacker inflates the collateral price per share (even a small increase of +1.1% may be sufficient).
3. The victim's health becomes negative, and the hacker can liquidate it for profit.

Multiple tests show that the attack have been forwarded to the client.

In order to understand why it works, we'll have to take two features of the protocol into consideration.

**Feature 1**: If the oracle price increases by N percent, then the price of the tick `p_current_down()` increases by ~3.3 times.

That is, for example, if the price in the oracle increased by 10%, then the price grid in the `AMM` shifted not by 10%, but on average somewhere around 33%.

**Feature 2**: The `AMM` uses the `limit_p_o()` function which limits price surges and increases fees when the oracle price fluctuates. 

For example, if the oracle price increases by 10% in a transaction (for example, from 1 to 1.1), then in the same transaction, `limit_p_o()` will return 1.1 (small fluctuations are not thresholded), and the dynamic fee will be high. 

Over time, approximately after 120 seconds, the dynamic fee will drop to its minimum value.

**Example**: Let's see what happens after these operations are performed:
1. A user creates a loan with `create_loan()`.
2. A hacker buys all collateral in the `AMM` with `exchange()`.
3. The oracle price inflates!

As soon as the oracle price increases, say by 10%, the price in ticks increases by 33%. However, if the hacker decides to buy back their stablecoins right after this, they will, surprisingly, spend more collateral than they initially bought. It's because of the dynamic commission returned by `limit_p_o()`. It's large and compensates for the tick price increase.

However, after 120 seconds the commission drops to the minimum, and after that the hacker can buy back their stablecoins not just at market price, but at a much more favorable price (because the tick price increases by 3.3 times compared to the oracle).

Herein lie two problems.

**Problem 1**: The `health()` function does not account for dynamic fees and, therefore, in this scenario, is negative. In reality, the user's position remains healthy, at least while the dynamic fees are high, because if the hacker makes the reverse trade, they would add even more collateral to the user than was initially present. The `get_x_down()` function does not take this into account.

In particular, because of this, a problem arises that we can now hard liquidate the user and extract profit. Whereas for the hard liquidation, we don't need to make the reverse trade and spend the dynamic fee.

**Problem 2**: As the tick price grows three times faster than the oracle, bad debt may accumulate. 

Suppose:
   - We brought 100 collateral and borrowed 88 stablecoins.
   - We buy back our collateral for 105 stablecoins.
   - Suppose then the price increases by 10%.
   - 120 seconds pass for the `limit_p_o()` fees to fall.

How much of the collateral can we sell back in the `AMM` to retrieve our stables? The collateral now costs 10% more on the market, but we can sell it at a price 33% higher in the `AMM`! That is, we buy back our 105 stablecoins for about 75 collateral.

But on the market, 75 collateral are worth 75*1.10 = 82 stablecoins?

Thus, it turns out we borrowed 88 stablecoins in the `AMM`, but then put back collateral that is worth 82 stablecoins, which is less.

**In conclusion**, the fact that the price in ticks changes by 3.3 times more than the oracle, combined with the user's health not accounting for dynamic fees, and the ability of a hacker to inflate the price of collateral (which are simply vault shares in the case of TwoWayLending), enables the hacker to profitably liquidate users whose positions should otherwise be considered healthy.

##### Recommendation

We recommend revisiting the logic of the `health()` function, not relying on `balanceOf()` while calculating `pricePerShare()` in vault's shares, and thinking of a way to make it impossible for a hacker to perform attacks such as `exchange(forth)+inflate+liquidate()` or `exchange(forth)+inflate+exchange(back)`, as the current implementation of the protocol, specifically the tick price rising three times higher than the oracle, is highly susceptible to such attacks.

##### Client's commentary
> 1) Added dynamic fee which fixes very related problem - 2-block attacks with ANY market in a similar fashion
> 2) Limited growth of pricePerShare to 1% a minute in 0c373156fb58ae89b6a8234d6ed3ff82eda82d4f
***

### 2.2 High

#### 1. An inflated fee in the AMM leads to a partial AMM DOS
##### Status
Fixed in https://github.com/curvefi/curve-stablecoin/commit/9e20913fb46db6d3774c56b13ba17d6911cb2caa
##### Description
The `admin_fees_x`  variable is not divided by `BORROWED_PRECISION` in AMM `withdraw()`:
```
# If withdrawal is the last one - transfer dust to admin fees
if new_shares == 0:
    if x > 0:
        self.admin_fees_x += x
    if y > 0:
        self.admin_fees_y += unsafe_div(y, COLLATERAL_PRECISION)
```
https://github.com/curvefi/curve-stablecoin/blob/c3f7040960627f023a2098232658c49e74400d03/contracts/AMM.vy#L794

If `borrowed_token` is WBTC (decimals=8), then the error in fee accrual will be on the order of 10 magnitudes. A hacker could perform an inflation attack on the nearest available tick to trigger this piece of code and inflate `admin_fees_x` to the total amount of the `borrowed_token` balance in the AMM, while losing 10 magnitudes less funds than the final inflation amount. If the hacker then calls `collect_fees()`, which is a public method, all borrowed tokens from the AMM will be sent to `FACTORY.fee_receiver()`.

This will lead to a partial DOS of the AMM, as users will lose the ability to withdraw borrowed tokens from ticks, as there simply won't be any funds in the AMM for this.

There are a few notes on this:
1. **This attack does not depend on `ADMIN_FEE`**; the code is always activated when there is dust in the tick. In order to execute the attack, the hacker needs to inflate the share price in the tick, causing the dust to have a large value.
2. AMM uses dead shares, but price inflation is still possible via the `exchange()` method or other means. It's just not profitable for the hacker.
3. Currently, `collect_fees()` reverts as `Vault` does not have a `fee_receiver()` method which is called by the `collect_fees()` method. Still, if the `collect_fees()` revert issue is addressed by introducing a `fee_receiver()` in the factory, then the fee inflation bug will arise.

##### Recommendation
We recommend adding the missing division by the `BORROWED_PRECISION`:
```
self.admin_fees_x += unsafe_div(x, BORROWED_PRECISION)
```

##### Client's commentary
> Fixed in 3336ed838f8ba90490155d7401c4c4eb96824b5c



#### 2. An incorrect `last_tvl` state after the price pair removal
##### Status
Acknowledged

##### Description

- https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/AggregateStablePrice2.vy#L108

The `AggregateStablePrice` contract doesn't remove the corresponding entry in the `last_tvl` array during the `remove_price_pair()` call.

This may result in inaccurate TVL calculations and incorrect price aggregations.

##### Recommendation

We recommend adjusting the `remove_price_pair()` function to remove the corresponding entry in the `last_tvl` array when a price pair is removed.

##### Client's commentary
> Old contracts are not upgradeable, thus, a workaround will be used: one can remove several items from the end of the list and then add them back again without the one to be removed, all in a single transaction.

***

### 2.3 Medium

#### 1. Breaking gauge creation in lending factories
##### Status
Acknowledged
##### Description
Lending factories have public `deploy_gauge()` to deploy a gauge for an chosen vault:
- https://github.com/curvefi/curve-stablecoin/blob/c3f7040960627f023a2098232658c49e74400d03/contracts/lending/OneWayLendingFactory.vy#L326-L343
- https://github.com/curvefi/curve-stablecoin/blob/c3f7040960627f023a2098232658c49e74400d03/contracts/lending/TwoWayLendingFactory.vy#L371-L388

There are two problems there:
1) One gauge per vault. Only the first `deploy_gauge()` caller can create a gauge for a vault.
2) The caller of `deploy_gauge()` receives rights in the created gauge. This caller as a `manager` can add 8 malicious reward tokens through `add_reward()`. 

These two things together will permanently block adding new valid reward tokens and creating the correct gauge (even if a manager role is reset).

##### Recommendation
Consider a few options:
1) Allow multiple gauges for every vault and not revert if a gauge for a vault already exists. It will allow ignoring malicious gauges.
2) Create a gauge for a vault right after vault deployment inside `_create()`.
3) Ensure that users can create vaults and deploy gauges atomically in one transaction. 

##### Client's commentary
> This is a known issue (or nonissue) in ALL the gauges. If ever is a problem - can create in a single tx

#### 2. The use of `tx.origin`
##### Status
Acknowledged
##### Description
Liquidity gauge `manager` is set as a `tx.origin` of the gauge deploy transaction.
- https://github.com/curvefi/curve-stablecoin/blob/c3f7040960627f023a2098232658c49e74400d03/contracts/lending/LiquidityGauge.vy#L176

It is not recommended to have `tx.origin` in access control logic.
Some DeFi users are Multisigs or Account Abstraction wallets. 
In such cases, `tx.origin` is not correct final user identification.

##### Recommendation
We recommend having `manager` as a customizable input for `factory.deploy_gauge()`.

##### Client's commentary
> This is a known issue (or nonissue) in ALL the gauges.

#### 3. `TwoWayLendingFactory.create_from_pool` does not work
##### Status
Fixed in https://github.com/curvefi/curve-stablecoin/commit/9e20913fb46db6d3774c56b13ba17d6911cb2caa
##### Description

- https://github.com/curvefi/curve-stablecoin/blob/c3f7040960627f023a2098232658c49e74400d03/contracts/lending/TwoWayLendingFactory.vy#L249

The `TwoWayLendingFactory.create_from_pool` method always returns an error with `CryptoFromPoolVault`. It happens so because `vault.borrowed_token()` was not initialised at the time of validation:
```
assert pool.coins(collateral_ix) == vault.borrowed_token()
```

- https://github.com/curvefi/curve-stablecoin/blob/c3f7040960627f023a2098232658c49e74400d03/contracts/price_oracles/CryptoFromPoolVault.vy#L37

##### Recommendation
We recommend passing an initialised Vault to the `CryptoFromPoolVault` or moving the check to Factory.

##### Client's commentary
> Indeed, and there is enough validation in the factory already regardless -> removing in 069b3886f90cb49903ab1bf0e1af80fd70ead710.

#### 4. TwoWayLendingFactory price manipulation
##### Status
Fixed in https://github.com/curvefi/curve-stablecoin/commit/9e20913fb46db6d3774c56b13ba17d6911cb2caa
##### Description

- https://github.com/curvefi/curve-stablecoin/blob/c3f7040960627f023a2098232658c49e74400d03/contracts/price_oracles/CryptoFromPoolVault.vy#L65
- https://github.com/curvefi/curve-stablecoin/blob/c3f7040960627f023a2098232658c49e74400d03/contracts/price_oracles/OracleVaultWrapper.vy#L39

These oracles are used in `TwoWayLendingFactory`. If you try to influence the price via `controller_long`/`controller_short`, there will be a `check_lock` check (https://github.com/curvefi/curve-stablecoin/blob/c3f7040960627f023a2098232658c49e74400d03/contracts/lending/Vault.vy#L266).

However, an attacker still has the ability to influence the price via a transfer to the controller. For example:
```
print(amm_short.price_oracle()) # 1000000000000000
borrowed_token.transfer(controller_long, amount)
print(amm_short.price_oracle()) # 1250000000000000
```

This can be advantageous if there are few funds in the `Controller` and it is very easy to influence the price.

##### Recommendation
We recommend using a more stable oracle to price the LP Vault.

##### Client's commentary
>  Limited growth of pricePerShare to 1% a minute in 0c373156fb58ae89b6a8234d6ed3ff82eda82d4f.


#### 5. `AggregateStablePrice` EMA can be manipulated
##### Status
Acknowledged

##### Description
- https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/AggregateStablePrice2.vy#L167-L168

If the `price_w()` function, which updates `last_timestamp`, is not called for a long time, the value of `alpha` decreases, leading to a risk of EMA manipulation by a hacker.

This occurs because the closer `alpha` gets to zero, the greater the influence of the new `totalSupply()` value, which can be manipulated within the current transaction:
```solidity
alpha: uint256 = 10**18
if last_timestamp < block.timestamp:
    alpha = self.exp(- convert((block.timestamp - last_timestamp) * 10**18 / TVL_MA_TIME, int256))

...
if alpha != 10**18:
    # alpha = 1.0 when dt = 0
    # alpha = 0.0 when dt = inf
    new_tvl: uint256 = self.price_pairs[i].pool.totalSupply()
    tvl = (new_tvl * (10**18 - alpha) + tvl * alpha) / 10**18
```

For example, after `10 * TVL_MA_TIME` seconds (which is about 5 days in the current implementation), if no one calls the function, alpha becomes 0.0000453999. Ultimately, if `alpha=0`, `new_tvl` will simply be equal to `totalSupply()`.

##### Recommendation

We recommend considering the possibility of manipulation with this aggregator and, for example, implementing monitoring to check if the `price_w()` function has not been called for a long time.

##### Client's commentary
> comment here

***

### 2.4 Low

#### 1. The delay between the EMA and instant price can accumulate bad debt
##### Status
Acknowledged
##### Description
The EMA does not follow the market instantly, resulting in a delay between the actual price and the oracle in Curve. Hypothetically, a situation could arise where the market price jumps so significantly that it becomes profitable to borrow this token at a lower price in the Curve lending and sell it at a higher price on the market. This can be done in a flash loan, instantly deleting the Vault and leaving the protocol with bad debt.

##### Recommendation
We recommend disallowing borrowing (using `create_loan()`) if the momentary price significantly differs from the EMA.

##### Client's commentary
> This is a design decision and fundamental to the algorithm.

#### 2. Additional Chainlink validation
##### Status
Acknowledged
##### Description
Chainlink feed data have edge cases that are recommended being covered. The current issues are:
- Stale thresholds are not implemented in some oracles (`CryptoWithStablePriceAndChainlink`, `CryptoWithStablePriceAndChainlinkFrxeth`);
- Stale threshold is 24 hours now. But the Chainlink price synchronizes for low volatile pairs like stETH/ETH can update with the stale threshold slightly above 24 hours. In this case, the feed is not stale;
- `updateTime != 0` is not checked (it means that the round is not complete);
- `answeredInRound >= roundId` is not checked (it can additionally indicate that the price is stale).

##### Recommendation
Consider the following improvements:
1) Implement stale price checks for `CryptoWithStablePriceAndChainlink` and `CryptoWithStablePriceAndChainlinkFrxeth`
2) Consider updating `CHAINLINK_STALE_THRESHOLD` to 24.5 hours in cases of low volatile feeds
3) Require that `updateTime != 0`
4) Require that `answeredInRound >= roundId`

##### Client's commentary
> That is absolutely true, however using chainlink introduce other issues, so we don't use it

#### 3. No way to modify oracle in the AMM
##### Status
Acknowledged
##### Description

- https://github.com/curvefi/curve-stablecoin/blob/c3f7040960627f023a2098232658c49e74400d03/contracts/AMM.vy#L127

There is currently no way to change `price_oracle` in the AMM.

```
price_oracle_contract: public(immutable(PriceOracle))
```

##### Recommendation
`AMM.price_oracle` is external, it may be worth keeping the ability to change it.

##### Client's commentary
> This is correct and design decision to not have the admin (even DAO) be able to rug everything


#### 4. EmaPriceOracle manipulation
##### Status
Acknowledged
##### Description

EMAPriceOracle is a wrapper that adds an Exponential Moving Average (EMA) to another price source.

When it is deployed or the protocol has not been used for some time, the EMA prefers new values from the price source over old ones:
```
alpha: uint256 = self.exp(- convert((block.timestamp - last_timestamp) * 10**18 / MA_EXP_TIME, int256))
return (current_price * (10**18 - alpha) + last_price * alpha) / 10**18
```
https://github.com/curvefi/curve-stablecoin/blob/c3f7040960627f023a2098232658c49e74400d03/contracts/price_oracles/EmaPriceOracle.vy#L113-L115

At such times, a hacker can shift the price from the source for just one second and record a new price value in EMAPriceOracle. Although the real price source will return to its original value immediately, the EMAPriceOracle will need about `4 * MA_EXP_TIME` seconds to catch up. Until then, it will give a deviated price, which could be used for arbitrage and creating bad debt.

##### Recommendation

We recommend preferring old values over new ones when calculating the EMA.

##### Client's commentary
> Wrapper is not to be used: now we use "native" EMA oracle in pools which is not affected by such manipulations.


#### 5. `TwoWayLendingFactory.exchange()` griefing
##### Status

Fixed in https://github.com/curvefi/curve-stablecoin/commit/c08a3ab8eb29d7622eddf432cb518eeec6f88b63

##### Description
* https://github.com/curvefi/curve-stablecoin/blob/9e20913fb46db6d3774c56b13ba17d6911cb2caa/contracts/lending/TwoWayLendingFactory.vy#L589
* https://github.com/curvefi/curve-stablecoin/blob/9e20913fb46db6d3774c56b13ba17d6911cb2caa/contracts/lending/TwoWayLendingFactory.vy#L612


It is possible to cause a temporary DOS in the `exhange()` and `exchange_dy()` functions in TwoWayLendingFactory by directly transferring tokens to the contract.

For example, the following line reverts if the right side of subtraction is higher:
```
dxy[0] = max_in - self.transfer_out(vault, other_vault, i, receiver)
```

**The attack scenario:**

Suppose a user calls the function:
`TwoWayLendingFactory.exchange_dy(vault_id, i=1, j=0, amount, max_in, receiver)`. 

Under normal operation, an amount of collateral tokens will be deducted from the user, converted into shares:
```
_max_in: uint256 = self.transfer_in(vault, other_vault, i=1, msg.sender, max_in)
|_        assert token.transferFrom(_from, self, amount, default_return_value=True)
  |        ...
  |            return other_vault.deposit(amount)
```

Then exchanged for borrowed token in favor of the receiver:
```
    dxy: uint256[2] = self.amms[vault_id].exchange_dy(i, j, _amount, _max_in, _receiver)
```

And, finally, all the remaining unspent collateral will be returned:
```
dxy[0] = max_in - self.transfer_out(vault, other_vault, i=1, receiver)
```

In our case, the `transfer_out()` function will return:
```
other_vault.redeem(other_vault.balanceOf(self), _to)
```

The exploiter sandwiches the transaction:

1. Before the user's transaction, they deposit an extra amount of shares into TwoWayLendingFactory.
2. Then the user's transaction is executed, but it reverts at this line because the contract's balance now contains not only the user's trade remainder but also the extra amount of shares deposited by the exploiter:
```
max_in - self.transfer_out(vault, other_vault, i=1, receiver)
```
3. Afterwards, the exploiter withdraws their funds using an empty trade with `max_in=infinity`.

Thus, the exploiter can always revert the trader's transaction. No one loses money (except for gas).

Also, there's another attack variant without sandwiching: the exploiter simply deposits different tokens into TwoWayLendingFactory, say, worth $1-100. This reverts all trades with a small slippage, until a trade with a big possible slippage occurs.

##### Recommendation
We recommend taking into account a scenario where funds are already available on the contract before any trades.

##### Client's commentary
> comment here

#### 6. Incorrect initialization of `USE_RATES` in `CryptoFromPoolsRate`
##### Status
Acknowledged
##### Description

- https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/CryptoFromPoolsRate.vy#L93-L97

Rates are excluded from future use if `stored_rates()` returns `10**18` during initialization:
```
u: bool = False
for r in stored_rates:
    if r != 10**18:
        u = True
use_rates.append(u)
```

This may be incorrect if `stored_rates()` changes over time.

##### Recommendation

We recommend using all rates, as they may deviate from `10**18` over time.
##### Client's commentary
> comment here


#### 7. `RATE_MAX_SPEED` in `CryptoFromPoolsRateArbitrum` may fail in case of sequencer downtime
##### Status
Acknowledged
##### Description

- https://github.com/curvefi/curve-stablecoin/blob/25fb794f1acea1e1d498fab41f6cab9cbdc565e7/contracts/price_oracles/L2/CryptoFromPoolsRateArbitrum.vy#L144-L150

If the sequencer is down and the difference `block.timestamp - self.cached_timestamp` gets too high, the protection against inflation attacks using `RATE_MAX_SPEED` may be broken.

##### Recommendation

We recommend taking into account the case of a non-functioning sequencer when using `RATE_MAX_SPEED`.

##### Client's commentary
> comment here


***

## 3. ABOUT MIXBYTES
MixBytes is a team of blockchain developers, auditors and analysts keen on decentralized systems. We build opensource solutions, smart contracts and blockchain protocols, perform security audits, work on benchmarking and software testing solutions, do research and tech consultancy.
