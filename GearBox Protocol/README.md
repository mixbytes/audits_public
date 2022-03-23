# Gearbox Protocol Security Audit Report (merged)

###### tags: `GearBox`

## Introduction

### Project overview
Gearbox is a generalized leverage protocol which allows both individual users and platforms to increase their capital efficiency. Open a Credit Account and connect to various DeFi protocols in a composable manner: margin trade on Uniswap, leverage farm on Yearn and Curve, and more.

Gearbox enables undercollateralized interactions with external DeFi protocols through margin lending in a composable manner. Instead of going for credit scoring, Gearbox introduces Credit Accounts - a DeFi primitive which allows users to execute financial orders without accessing funds on it, such as that account acts as collateral for different undercollateralized operations.


### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/CurveV1.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV2.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV3.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/YearnV2.sol

https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/ACLTrait.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/ACL.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountMining.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AddressProvider.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/ContractsRegister.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/DataCompressor.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/WETHGateway.sol

https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditAccount.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/LeverageActions.sol

https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/curve/ICurvePool.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/uniswap/BytesLib.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/uniswap/IQuoter.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/uniswap/IUniswapV2Migrator.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/uniswap/IUniswapV2Router01.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/uniswap/IUniswapV2Router02.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/uniswap/IUniswapV3SwapCallback.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/uniswap/IUniswapV3.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/yearn/IYVault.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/yearn/YearnPriceFeed.sol

https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/libraries/data/Types.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/libraries/helpers/Constants.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/libraries/helpers/Errors.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/libraries/math/PercentageMath.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/libraries/math/WadRayMath.sol

https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/oracles/PriceOracle.sol

https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/LinearInterestRateModel.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol

https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/DieselToken.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/GearNFT.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/GearToken.sol
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/Vesting.sol
The audited commit identifier is `0ac33ba87212ce056ac6b6357ad74161d417158a`



## Security Assessment Methodology

A group of auditors is involved in the work on the audit who check the provided source code independently of each other in accordance with the methodology described below:

### 1. Project architecture review.

* Reviewing project documentation.
* General code review.
* Reverse research and study of the architecture of the code based on the source code only.
* Mockup prototyping.

```
Stage goals:
* Building an independent view of the project's architecture and identifying logical flaws in the code.
```

### 2. Checking the code against the checklist of known vulnerabilities.

* Manual code check for vulnerabilities from the company's internal checklist.
* The company's checklist is constantly updated based on the analysis of hacks, research and audit of the clients’ code.
* Checking with static analyzers (i.e. Slither, Mythril, etc.).

```
Stage goal: 
Eliminate typical vulnerabilities (e.g. reentrancy, gas limit, flashloan attacks etc.)
```

### 3. Checking the code for compliance with the desired security model.

* Detailed study of the project documentation.
* Examining contracts tests.
* Examining comments in code.
* Comparison of the desired model obtained during the study with the reversed view obtained during the blind audit.
* Exploits PoC development using brownie.

```
Stage goal: 
Detection of inconsistencies with the desired model
```


### 4. Consolidation of interim auditor reports into general one.

* Cross-check: each auditor reviews the reports of the others.
* Discussion of the found issues by the auditors.
* Formation of a general (merged) report.

```
Stage goals: 
* Re-check all the problems for relevance and correctness of the threat level
* Provide the client with an interim report
```

### 5. Bug fixing & re-check.
* Client fixes or comments on every issue.
* Upon completion of the bug fixing, the auditors double-check each fix and set the statuses with a link to the fix.
* Additional verification of the entire initial project scope and code base.

```
Stage goal:
Preparation of the final code version with all the fixes and additional re-check
```

### 6. Preparation of the final audit report and delivery to the customer.


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


## Report

### CRITICAL
#### 1. Incorrect calculation of borrowed amount
##### Description
Total borrowed amount increases unequally, so total borrowed amount on credit accounts would be less than `totalBorrowed` on a `PoolService` which would lead to incorrect calcultaions for LP of a `PoolService`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L661
##### Recommendation
We recommend to change calculation of borrowed amount for credit accounts.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/fa3265e0c5217bf5cb86892b942b8fbd51801a51



### MAJOR
#### 1. Possible remove of necessary adapter
##### Description
In case 1 adapter is used for several contracts, then   next lines will break work of these contracts:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L190
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L217
##### Recommendation
We recommend adding a check, that removed adapter is not used in other contracts.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 2. Incorrect change of state
##### Description
Changing state to true is incorrect and must be done via `allowToken()`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L398
##### Recommendation
We recommend allowing changing state only to false.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 3. `creditManager` isn't checked
##### Description
It is possible to give unlimited approve to poisoned contract:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/LeverageActions.sol#L222
##### Recommendation
We recommend adding a check that `creditManager` is a system contract.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 4. Uncounted fees in USDT
##### Description
Contract can have less than `amountIn` because of fees in transferFrom function in USDT:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/LeverageActions.sol#L232
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/LeverageActions.sol#L324
##### Recommendation
We recommend to call `openCreditAccount` with current contract balance.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 5. Possible loss of assets by mistake
##### Description
If a liquidator calls this function by mistake with the next parameters: `to = address(0), force = true`, then he loses all assets:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L302
##### Recommendation
We recommend adding a check that `to != address(0)`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 6. Broken account must be deleted
##### Description
In case if some tokens cannot be transferred from the account, then this account must be deleted:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L451
##### Recommendation
We recommend to delete account in case some transfers are reverted.
##### Status
Acknowledged


#### 7. Possible transfer of bad account
##### Description
User can have bad account with Hf < 1 but not liquidated yet, and transfer it to another user:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L954
##### Recommendation
We recommend adding approve mechanic, so that account receiver does not receive account that he doesn't want.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 8. Unnecessary allowance
##### Description
Vault's withdraw function burns shares, so allowance is unnecessary:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/YearnV2.sol#L130
##### Recommendation
We recommend removing providing allowance.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 9. Incorrect usage of function returned value
##### Description
Vault's withdraw function returns amount of tokens which was transferred, not shares:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/YearnV2.sol#L145
##### Recommendation
We recommend to change function code.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 10. Incorrect taking out of `tail` account
##### Description
If `creditAccount == tail` then `tail` is not updated properly and this will break the list of accounts:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L260
##### Recommendation
We recommend updating `tail` if it was taken out.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 11. Incorrect minting
##### Description
Because of fees in transferFrom function in USDT, contract would have less than `amount`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L155
##### Recommendation
We recommend to use balance difference to mint Diesel tokens.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 12. Impossible liquidity removing
##### Description
In case all funds were borrowed (big part of funds), users can't return their assets (`amountSent > balanceOf(address(this))`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L182
##### Recommendation
We recommend adding a function for closing some account to return funds to LP.
##### Status
Acknowledged


#### 13. Calculation can be incorrect
##### Description
`expectedLiquidity` contains real balance + pseudo balance from borrowers interest:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L396
##### Recommendation
We recommend adding a function for forcing closing some accounts to pay all balance for LP.
##### Status
Acknowledged


#### 14. Impossible liquidation of broken account
##### Description
In case transfer was reverted, then specific token can't be accounted as collateral, and also liquidator must not pay the fee for this token:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L593-L594
##### Recommendation
We recommend not to accumulate `tv` and `tvw` in case transfer was reverted.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 15. Using tokens with whitelist function
##### Description
At line: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L584-L593

The Gearbox protocol is assumed to use some tokens which have whitelist function ( ex. USDC, USDT) like a collateral. If this token will be blocked off-chain the Liquidates credit account function member of the `CreditManager` contract (https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L300) will not work correctly because the internal function `_transferAssetsTo()` (https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L584-L591) returns incorrect return value `totalValue`.

*Example:*

```solidity
function _transferAssetsTo(
        address creditAccount,
        address to,
        bool force
    ) internal returns (uint256 totalValue, uint256 totalWeightedValue) {
        totalValue = 0;
        totalWeightedValue = 0;

        uint256 tokenMask;
        uint256 enabledTokens = creditFilter.enabledTokens(creditAccount);

        for (uint256 i = 0; i < creditFilter.allowedTokensCount(); i++) {
            tokenMask = 1 << i;
            if (enabledTokens & tokenMask > 0) {
                (
                    address token,
                    uint256 amount,
                    uint256 tv,
                    uint256 tvw
                ) = creditFilter.getCreditAccountTokenById(creditAccount, i);
                if (amount > 1) {
                    // The condition is met, but the transfer will not occur
                    // for blocked account
                    _safeTokenTransfer(
                        creditAccount,
                        token,
                        to,
                        amount.sub(1),
                        force
                    );
                    // In this case totalValue will not correct
                    totalValue += tv;
                    totalWeightedValue += tvw;
                }
            }
        }
```

##### Recommendation
Use solution where totalValue will not increase in case of unsuccessful transaction.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 16. Looping a linked list
##### Description
At the line: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L40
there's a linked list called `_nextCreditAccount`.
In this list, the account address refers to the address of the next account. Thus, a chain of addresses linked to each other is formed.
At the  lines contracts/core/AccountFactory.sol#L248-L263 there's a `takeOut ()` function. It takes the credit account address from anywhere on the list and attaches it to the credit manager.
At the  lines: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L186-L199

there's a function `returnCreditAccount ()`. It returns the credit account address in the tail of the `_nextCreditAccount` linked list.
In the `takeOut()` function there is no logic for checking and zeroing the link to the next account from the taken account address.
When the taken address is returned to the tail of the list, it will contain the old value of the address. Loop through the list may occur when the function `_countCreditAccountsInStock ()` is used for the line: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L352-L365.

##### Recommendation
It is necessary to zero the next item from the linked list after the https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L260 line:
```
 _nextCreditAccount[creditAccount] = address(0);
```
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/ae615112b23480029b54fb2980f5583f487b2b25


#### 17. No checking of element properties when returning it to the list
##### Description
At the lines: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L186-L199
there's a function `returnCreditAccount ()`. It returns the credit account address in the tail of the `_nextCreditAccount` linked list.
For the line: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L192,
the check is made that the value of `since ()` is not equal to `block.number`.
If the address has never been registered in an `AccountFactory` it will pass this check too.
But this address will not be added to the `creditAccounts` array and the logic of the entire contract will be violated.

##### Recommendation
It is necessary to make a code correction at the line contracts/core/AccountFactory.sol#L192:
```
ICreditAccount(usedAccount).since() != block.number &&
ICreditAccount(usedAccount).since() > 0,
```
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/5e6a5d72b851d37c1e055ba9a46250d1fbbb1cd5



### WARNINGS
#### 1. `priceFeeds` can't be changed
##### Description
`priceFeeds` can't be changed:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/oracles/PriceOracle.sol#L56
##### Recommendation
We recommend adding a function for changing `priceFeeds`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 2. Work with incorrect decimals
##### Description
Price feed can return price with not 18 decimals:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/oracles/PriceOracle.sol#L56
##### Recommendation
We recommend to check decimals of the `priceFeeds[token]`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 3. Unnecessary inheritance from `Proxy`
##### Description
All functions for `yVault` called from proxy wouldn't work because the storage is not the same:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/yearn/YearnPriceFeed.sol#L17
##### Recommendation
We recommend removing inheritance from `Proxy`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 4. Incorrect input parameters
##### Description
Input data is not checked for possible containing of zero addresses:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/integrations/yearn/YearnPriceFeed.sol#L24
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L113
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L597
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/LeverageActions.sol#L73
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L118
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/CurveV1.sol#L33
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV2.sol#L28
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV3.sol#L33
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/YearnV2.sol#L35
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/WETHGateway.sol#L85
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/WETHGateway.sol#L203
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L298
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountMining.sol#L27
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/ACLTrait.sol#L21
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/DataCompressor.sol#L58
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/ContractsRegister.sol#L36
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/ContractsRegister.sol#L66
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/GearToken.sol#L104
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/Vesting.sol#L43
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L102
##### Recommendation
We recommend adding a check that input data is not equal to zero address.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f

#### 5. Too many rights for configurator
##### Description
Configurator has too many rights and can steal all user's funds:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol
##### Recommendation
We recommend to use DAO for configurator.
##### Status
Acknowledged


#### 6. Length of input arrays not checked
##### Description
Length of input arrays is not checked:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L297
##### Recommendation
We recommend adding a check that lengths of arrays are equal.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 7. `path` length not checked
##### Description
`path` length is not checked:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/LeverageActions.sol#L107
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/LeverageActions.sol#L494
##### Recommendation
We recommend adding a check for `path` length.
##### Status
Acknowledged
##### Client's commentary
**AUDITORS' COMMENT**:  
Not fixed, path.length must be checked

#### 8. `wethGateway` can't be changed
##### Description
`wethGateway` can't be changed, so in case of redeploy, all contracts must be redeployed too:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L123
##### Recommendation
We recommend adding a function for updating `wethGateway`.
##### Status
Acknowledged


#### 9. Account can be opened for zero address
##### Description
`onBehalfOf` can be equal to zero address:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L180
##### Recommendation
We recommend adding a check that `onBehalfOf` is not equal to zero address.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f



#### 10. Malicious user can pay less to pool
##### Description
Malicious user can add poisoned pool to `paths[i]` to minimize profits and pay less to pool:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L260
##### Recommendation
We recommend checking the total value of user before transfers.
##### Status
Acknowledged
##### Client's commentary
**AUDITORS' COMMENT**:
Not fixed, we recommend to add a whitelist for tokens in path.

#### 11. Transfer to zero address
##### Description
`to` can be equal to zero address:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L338
##### Recommendation
We recommend adding a check that `to != address(0)`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 12. Possible transfer of 0 funds
##### Description
For liquidation `remainingFunds` can be equal to zero:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L434
##### Recommendation
We recommend adding a check that `remainingFunds != 0` before transfer.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 13. Usage of ERC777 token can block liquidation
##### Description
Malicious user can use ERC777 token callbacks for blocking liquidation:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L433
##### Recommendation
We recommend not to use ERC777 token as underlying token.
##### Status
Acknowledged


#### 14. Incorrect require
##### Description
The following check is incorrect, because after this function actual borrowed amount of user would be = `borrowedAmount.add(timeDiscountedAmount)`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L649
##### Recommendation
We recommend adding `timeDiscountedAmount` instead of `amount`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 15. Possible incorrect setting value for `maxLeverageFactor`
##### Description
`maxLeverageFactor` can be set to 0:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L722
##### Recommendation
We recommend adding a check that `_maxLeverageFactor > 0`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 16. User can approve any token
##### Description
User can approve any token:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L761
##### Recommendation
We recommend adding a check that user can only approve allowable tokens.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 17. Incorrect length of input data
##### Description
`paths.length` can be < `creditFilter.allowedTokensCount()`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L816
##### Recommendation
We recommend adding a check that arrays have equal lengths.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 18. `amount` must be > 1
##### Description
`amount` must be > 1:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L821
##### Recommendation
We recommend changing the check.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 19. `paths[i]` length not checked
##### Description
`paths[i]` length is not checked, so underflow can occur:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L828
##### Recommendation
We recommend checking `paths[i]` length.
##### Status
Acknowledged
##### Client's commentary
**AUDITORS' COMMENT** 
Not fixed

#### 20. Index not checked
##### Description
Index `i` must be less than `N_COINS`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/CurveV1.sol#L40
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/CurveV1.sol#L58
##### Recommendation
We recommend adding a check that `i < N_COINS`.
##### Status
Acknowledged


#### 21. Possible reentrancy
##### Description
In the following function reentrancy can occur:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/CurveV1.sol#L56
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV2.sol#L55
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV2.sol#L112
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV3.sol#L49
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV3.sol#L102
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV3.sol#L152
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV3.sol#L196
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/YearnV2.sol#L75
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/YearnV2.sol#L126
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/WETHGateway.sol#L107
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/WETHGateway.sol#L128
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/WETHGateway.sol#L159
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/WETHGateway.sol#L181
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L242
##### Recommendation
We recommend to add a `nonReentrant` modificator.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 22. Incorrect parameter passed
##### Description
Curve swap can return more than `min_dy`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/CurveV1.sol#L82
##### Recommendation
We recommend to use balance difference as a parameter for the function.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 23. Function doesn't exist
##### Description
Function doesn't exist in Curve pool:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/CurveV1.sol#L100
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/CurveV1.sol#L116
##### Recommendation
We recommend removing this function.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 24. Incorrect function name
##### Description
Incorrect function of Uniswap-V2 pool is called:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV2.sol#L387
##### Recommendation
We recommend changing the function name.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 25. `params.path` length not checked
##### Description
`params.path` length is not checked, so underflow can occur in `_extractTokens()` function:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV3.sol#L102
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV3.sol#L200
##### Recommendation
We recommend adding a check for the `params.path` length.
##### Status
Acknowledged


#### 26. Balance not checked
##### Description
Balance of `creditAccount` is not checked:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/YearnV2.sol#L83
##### Recommendation
We recommend adding a check that `balanceBefore > 0`.
##### Status
Acknowledged


#### 27. Possible assets loss
##### Description
If `repayAmount > amount`, this means that Gateway repays credit from its own assets:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/WETHGateway.sol#L191
##### Recommendation
We recommend to call revert in case `repayAmount > amount`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 28. `masterCreditAccount` remains uninitialized
##### Description
`masterCreditAccount` remains uninitialized, so anybody can initialize it:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L90
##### Recommendation
We recommend to initialize `masterCreditAccount`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 29. Account remains connected to previous credit manager
##### Description
After returning, credit account is still connected to previous credit manager:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L196
##### Recommendation
We recommend connecting account to factory after returning.
##### Status
Acknowledged

#### 30. Unnecessary list initialization
##### Description
Initialization of `_nextCreditAccount[tail]` if `tail == address(0)` is unnecessary:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L241
##### Recommendation
We recommend adding a check for this.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 31. `head` can't be taken out
##### Description
`prev` account for head doesn't exist:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L257
##### Recommendation
We recommend adding a special check for situation when `creditAccount == head`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 32. Incorrect update of list
##### Description
List isn't updated properly:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L260
##### Recommendation
We recommend to add `_nextCreditAccount[creditAccount] = address(0);`
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 33. Possible duplication of data
##### Description
If configurator calls function several times, then data duplication is possible:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L301
##### Recommendation
We recommend adding a check that only new data is pushed to array.
##### Status
Acknowledged


#### 34. `merkleProof` length not checked
##### Description
`merkleProof` length is not checked:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountMining.sol#L64
##### Recommendation
We recommend adding a check that `merkleProof.length > 0`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 35. Unable to remove pool or manager
##### Description
Pool or manager can't be removed:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/ContractsRegister.sol#L38
##### Recommendation
We recommend adding functions for removing pools and managers.
##### Status
Acknowledged


#### 36. `signatory` not checked
##### Description
`signatory` not checked:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/GearToken.sol#L330
##### Recommendation
We recommend adding a check that correct `signatory` was recovered.
##### Status
Acknowledged
##### Client's commentary
**AUDITORS' COMMENT**: 
Not fixed

#### 37. `delegatee` not checked
##### Description
It is possible that `currentDelegate == delegatee`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/GearToken.sol#L407
##### Recommendation
We recommend adding a check that `currentDelegate != delegatee`.
##### Status
Acknowledged


#### 38. `expectedLiquidityLimit` can be equal to zero
##### Description
`expectedLiquidityLimit` can be equal to zero:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L145
##### Recommendation
We recommend to set value to `expectedLiquidityLimit` in constructor.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 39. Possible overflow can occur
##### Description
Possible overflow can occur:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L145
##### Recommendation
We recommend using safeMath for `expectedLiquidity() + amount`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 40. Transfer of 0 funds
##### Description
If `withdrawFee == 0`, then here 0 amount of asset transferred:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L191
##### Recommendation
We recommend adding a check, so 0 funds wouldn't be transferred.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 41. `_timestampLU` can be equal to 0
##### Description
`_timestampLU` can be equal to 0, for example in constructor:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L209
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L334
##### Recommendation
We recommend checking it and use another calculation for this scenario.
##### Status
Acknowledged


#### 42. Forbidden manager never can use pool
##### Description
If a credit manager was forbidden, then he can't use the pool and nobody can change it:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L443
##### Recommendation
We recommend adding a function to allow usage of pool to forbidden managers.
##### Status
Acknowledged


#### 43. Address not checked
##### Description
`_interestRateModel` can be equal to zero address:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L453
##### Recommendation
We recommend adding necessary checks for model address.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 44. Possible overflow
##### Description
If overall amount of tokens on credit account is very big, then overflow can occur:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L593-L594
##### Recommendation
We recommend to use safeMath.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 45. User can't repay with force flag
##### Description
If some token was blocked on account, user can't close this account and must wait until account would be liquidated by someone:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L368
##### Recommendation
We recommend adding a parameter for the repay function, so that user can repay account with force flag.
##### Status
Acknowledged


#### 46. Add condition
##### Description
For the line: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L159
in the `allowToken ()` function, the existence of the `token` - `underlyingToken` pair is checked.
But it is better to immediately check if the value of this pair is greater than 0:
```
require(
IPriceOracle(priceOracle).getLastPrice(token, underlyingToken) > 0, 
Errors.CF_TOKEN_IS_NOT_ALLOWED
);
```
##### Recommendation
It is recommended to make corrections to the source code.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/5bfe544be7c996591c0d8ede45ceb870667aaefb


#### 47. Upgradeable `creditManager` params
##### Description
Upgrade of `creditManager` params may lead to `creditAccount`s liquidation or break dependent protocols logic.
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L705
##### Recommendation
We recommend restricting params changing.
##### Status
Acknowledged



### COMMENTS
#### 1. Unnecessary check
##### Description
This check is unnecessary if price is fetched from oracle:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L156
##### Recommendation
We recommend removing this check.
##### Status
Acknowledged


#### 2. Unnecessary update
##### Description
If `contractToAdapter[targetContract] == adapter` , update is unnecessary:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L192
##### Recommendation
We recommend adding additional check.
##### Status
Acknowledged


#### 3. Unnecessary initialization
##### Description
New `uint256` variables are equal to zero by default:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L297
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/DataCompressor.sol#L72
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/GearToken.sol#L107
##### Recommendation
We recommend removing initialization.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f



#### 4. Unnecessary print to console
##### Description
Print to console can't be used in blockchain:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L343
##### Recommendation
We recommend removing print to console.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f



#### 5. User can receive only ETH
##### Description
User can receive only ETH:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L626
##### Recommendation
We recommend adding a flag, so that users can choose asset for receiving (ETH or wETH).
##### Status
Acknowledged


#### 6. Tokens can be locked on account
##### Description
Some tokens can be locked on account (for example USDT):
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditAccount.sol
##### Recommendation
We recommend adding a function for transferring locked tokens to treasury, when account isn't used by manager.
##### Status
Acknowledged


#### 7. Print to console
##### Description
This code was used for testing:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/adapters/UniswapV3.sol#L230
##### Recommendation
We recommend removing these lines.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 8. Unnecessary library for user types
##### Description
Unnecessary library for user types:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/libraries/data/Types.sol
##### Recommendation
We recommend moving each struct to contract where it uses.
##### Status
Acknowledged


#### 9. `wethAddress` can be const
##### Description
`wethAddress` can be const because it isn't changing:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/WETHGateway.sol#L31
##### Recommendation
We recommend to set `wethAddress` as a constant.
##### Status
Acknowledged


#### 10. Unnecessary safeMath
##### Description
safeMath here is unnecessary:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/WETHGateway.sol#L192
##### Recommendation
We recommend not to use safeMath here.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 11. Incorrect comment
##### Description
Comment for this variable is incorrect:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L54
##### Recommendation
We recommend changing the comment.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f



#### 12. Similar functions are used
##### Description
Functions with similar logic are used:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/ACL.sol#L28
##### Recommendation
We recommend adding 1 function with bool parameter to set true/false.
##### Status
Acknowledged


#### 13. `merkleRoot` can't be updated
##### Description
`merkleRoot` can't be updated:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountMining.sol#L28
##### Recommendation
We recommend adding a function for updating `merkleRoot`.
##### Status
Acknowledged


#### 14. All functions can be merged
##### Description
All functions can be merged into one with `bytes32` parameter:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AddressProvider.sol
##### Recommendation
We recommend merging all functions into 1 with `bytes32` parameter.
##### Status
Acknowledged


#### 15. Visibility not set
##### Description
Visibility is not set:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/ContractsRegister.sol#L16
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/ContractsRegister.sol#L20
##### Recommendation
We recommend to set visibility.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f



#### 16. Event not emitting
##### Description
After manager update, event is not emitting:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/GearToken.sol#L115
##### Recommendation
We recommend to emit events after updating storage variables.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f
 

#### 17. Range for variables not set
##### Description
Range for variables is not set:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/Vesting.sol#L45
##### Recommendation
We recommend to add allowable range for variables
##### Status
Acknowledged


#### 18. Two variables can be merged
##### Description
`started` can be merged with `cliffDuration`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/Vesting.sol#L46
##### Recommendation
We recommend merging `started` with `cliffDuration` into one variable.
##### Status
Acknowledged


#### 19. Unnecessary setting on each mint
##### Description
Setting base URI on each mint is unnecessary:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/tokens/GearNFT.sol#L14
##### Recommendation
We recommend moving setting of base URI to constructor.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 20. Unnecessary usage of variable
##### Description
`withdrawFee = 100 - withdrawMultiplier`, so it is unnecessary to store this variable:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L191
##### Recommendation
We recommend removing `withdrawFee` and send `underlyingTokensAmount.sub(amountSent)`.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f



#### 21. Parameters not checked
##### Description
Input parameters values are not checked:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/LinearInterestRateModel.sol#L46
##### Recommendation
We recommend adding allowable range for each parameter.
##### Status
Fixed at https://github.com/Gearbox-protocol/gearbox-contracts/commit/0b825ffb2bc0f30fe47355df1bfa9719c9cf2d2f


#### 22. The technical default of liquidity pool
##### Files
https://github.com/Gearbox-protocol/gearbox-contracts/blob/master/contracts/credit/CreditAccount.sol
##### Description
In some cases, the liquidity providers can do a mass withdraw requests. It may happen on pending protocol changes and so on. However, liquidity can not be withdrawn while it is in use by a credit account. In such case, some liquidity providers may be unable to withdraw their liquidity until credit account releases the liquidity.
##### Recommendation
We recommend implementing a forced liquidation of credit accounts by withdraw request. Certainly, the liquidator should be fined and the borrower should be rewarded on such liquidation.
##### Status
Acknowledged


#### 23. Undesired side effects of address reusing
##### Files
https://github.com/Gearbox-protocol/gearbox-contracts/blob/master/contracts/credit/CreditAccount.sol
##### Description
A credit account is reusing the same ethereum address for different borrowers. If this address is punished for some reason during activity of one borrower, the other borrower may suffer undesired side effects like having bad debt in protocols like Compound and so on.
##### Recommendation
We recommend to abandon address reusing. One borrower - one ethereum address.
##### Status
Acknowledged



## Results
Level | Amount
--- | ---
CRITICAL | 1
MAJOR    | 17
WARNING  | 47
COMMENT  | 23


### Conclusion
Smart contracts have been audited and some suspicious places have been spotted. During the audit 1 critical issue was found and reported to the client. 17 issues were marked as major because they could lead to some undesired behavior, also some warnings and comments were found and discussed with the client. After working on the reported findings most of them were resolved or acknowledged (if the problem was not critical) by the client. 

Final commit identifier with all fixes: `7ceb7807af8585bff65387054fe5ded5e66bbfcf`
<br/>

**CONTRACT DEPLOYMENTS**
The following addresses contain deployed to the Ethereum mainnet and verified smart contracts code that matches audited scope:
- UniswapV3: [0x457Ef4713933689D1FF13412DAC2683E4E8bb0A8](https://etherscan.io/address/0x457Ef4713933689D1FF13412DAC2683E4E8bb0A8#code)
- UniswapV2: [0xEdBf8F73908c86a89f4D42344c8e01b82fE4Aaa6](https://etherscan.io/address/0xEdBf8F73908c86a89f4D42344c8e01b82fE4Aaa6#code)
- CurveV1: [0x49b34e58baB86B3cD23b0bE0aF4A152bE1056902](https://etherscan.io/address/0x49b34e58baB86B3cD23b0bE0aF4A152bE1056902#code)
- YearnV2: [0x403E98b110a4DC89da963394dC8518b5f0E2D5fB](https://etherscan.io/address/0x403E98b110a4DC89da963394dC8518b5f0E2D5fB#code)
- AccountFactory: [0x444cd42baeddeb707eed823f7177b9abcc779c04](https://etherscan.io/address/0x444cd42baeddeb707eed823f7177b9abcc779c04#code)
- AccountMining: [0x7B1AAF21AC0D420666B5966338FF9aEe763C29DF](https://etherscan.io/address/0x7B1AAF21AC0D420666B5966338FF9aEe763C29DF#code)
- ACL: [0x523da3a8961e4dd4f6206dbf7e6c749f51796bb3](https://etherscan.io/address/0x523da3a8961e4dd4f6206dbf7e6c749f51796bb3#code)
- AddressProvider: [0xcF64698AFF7E5f27A11dff868AF228653ba53be0](https://etherscan.io/address/0xcF64698AFF7E5f27A11dff868AF228653ba53be0#code)
- ContractsRegister: [0xA50d4E7D8946a7c90652339CDBd262c375d54D99](https://etherscan.io/address/0xA50d4E7D8946a7c90652339CDBd262c375d54D99#code)
- DataCompressor: [0x0050b1abd1dd2d9b01ce954e663ff3dbca9193b1](https://etherscan.io/address/0x0050b1abd1dd2d9b01ce954e663ff3dbca9193b1#code)
- WETHGateway: [0x4f952c4c5415b2609899abdc2f8f352f600d14d6](https://etherscan.io/address/0x4f952c4c5415b2609899abdc2f8f352f600d14d6#code)
- CreditAccount: [0x373a292b93ff9017d28e64154ef83b99d5c4e270](https://etherscan.io/address/0x373a292b93ff9017d28e64154ef83b99d5c4e270#code)
- CreditFilter: [0x948d33a9537cf13bcc656218b385d19e5b6693e8](https://etherscan.io/address/0x948d33a9537cf13bcc656218b385d19e5b6693e8#code)
- CreditManager: [0x777e23a2acb2fcbb35f6ccf98272d03c722ba6eb](https://etherscan.io/address/0x777e23a2acb2fcbb35f6ccf98272d03c722ba6eb#code)
- LeveragedActions: [0xe11ac30edcfb16d0fcc2540d2c8253051ac93d49](https://etherscan.io/address/0xe11ac30edcfb16d0fcc2540d2c8253051ac93d49#code)
- PriceOracle: [0x0e74a08443c5e39108520589176ac12ef65ab080](https://etherscan.io/address/0x0e74a08443c5e39108520589176ac12ef65ab080#code)
- YearnPriceFeed: [0x172971182351e00C2D700bA1e8c5586Ad2CFa38c](https://etherscan.io/address/0x172971182351e00C2D700bA1e8c5586Ad2CFa38c#code)
- LinearInterestRateModel: [0xf37d605f6428576529657e24dfb439803f602118](https://etherscan.io/address/0xf37d605f6428576529657e24dfb439803f602118#code)
- PoolService: [0x24946bcbbd028d5abb62ad9b635eb1b1a67af668](https://etherscan.io/address/0x24946bcbbd028d5abb62ad9b635eb1b1a67af668#code)
- DieselToken: [0x6cfaf95457d7688022fc53e7abe052ef8dfbbdba](https://etherscan.io/address/0x6cfaf95457d7688022fc53e7abe052ef8dfbbdba#code)
- GearToken: [0xba3335588d9403515223f109edc4eb7269a9ab5d](https://etherscan.io/address/0xba3335588d9403515223f109edc4eb7269a9ab5d#code)
- Vesting: [0xEF686707193AF7406f40CBd7A39ba309Da5aD4Ec](https://etherscan.io/address/0xEF686707193AF7406f40CBd7A39ba309Da5aD4Ec#code)

