# C.R.E.A.M. Finance Compound Protocol Security Audit Report (merged)

###### tags: `C.R.E.A.M. Finance`

## Introduction

### Project overview
C.R.E.A.M. Finance is a project that allow users lending and borrowing via using special ERC-20 tokens named CToken. Each Ctoken generates it's own market which goverment by Comptroller smart contract. C.R.E.A.M. Finance is fork of well known Compound project. In the second version of C.R.E.A.M. Finance project developers added oppurtuninty to administrator of project to set supply and borrow caps for specific money market and for all markets in general.


### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20Delegate.sol
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CTokenInterfaces.sol
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/ComptrollerStorage.sol
The audited commit identifier is `23a4ae93adc70334553f5a83429a4e967c1eefaa`

## Security Assessment Methodology

2 security auditors and 1 tech lead are involved in the work on the audit who check the provided source code independently of each other in accordance with the methodology described below:

### 1. Blind audit.

* Manual code study.
* Reverse research and study of the architecture of the code based on the source code only.

```
Stage goals:
* Building an independent view of the project’s architecture.
* Finding logical flaws.
```

### 2. Checking the code against the checklist of known vulnerabilities.

* Manual code check for vulnerabilities from the company's internal checklist.
* The company's checklist is constantly updated based on the analysis of hacks, research and audit of the clients’ code.

```
Stage goal: 
Eliminate typical vulnerabilities (e.g. reentrancy, gas limit, flashloan attacks etc.)
```

### 3. Checking the logic, architecture of the security model for compliance with the desired model.

* Detailed study of the project documentation
* Examining contracts tests
* Examining comments in code
* Comparison of the desired model obtained during the study with the reversed view obtained during the blind audit

```
Stage goal: 
Detection of inconsistencies with the desired model
```


### 4. Consolidation of the reports from all auditors into one common interim report document:
* Cross check: each auditor reviews the reports of the others
* Discussion of the found issues by the auditors
* Formation of a general (merged) report

```
Stage goals: 
* Re-check all the problems for relevance and correctness of the threat level
* Provide the client with an interim report
```

### 5. Bug fixing & re-check.
* Client fixes or comments on every issue
* Upon completion of the bug fixing, the auditors double-check each fix and set the statuses with a link to the fix

```
Stage goal:
Preparation of the final code version with all the fixes
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
Not found

### MAJOR
Not found

### WARNINGS
#### 1. Incorrect first borrow for user
##### Description
In current version of smart contract if user wasn't registered before, but has balance of `CToken > 0`, then borrowing will always fail, until user is registered his collateral.
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L366

##### Recommendation
We recommend to invoke `registerCollateral` function after comptroller added user to market:
``` solidity=
Error err = addToMarketInternal(CToken(msg.sender), borrower);
if (err != Error.NO_ERROR) {
    return uint(err);
}
CCollateralCapErc20Interface(msg.sender).registerCollateral(borrower);
```

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


#### 2. Possible excess of gas limit
##### Description
In following function it is worth to add check of how much gas left.
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L1266

##### Recommendation
We recommend add following check in head of `for` loop:
```solidity=
if (gasleft < 40000) { return;}
```

##### Status
No issue


#### 3. Possible incorrect tokens redeeming
##### Description
In following function tx can fail if user try redeem incorrect amount of tokens:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L555

##### Recommendation
We recommend to add a simple check:
```solidity=
require(vars.redeemTokens <= accountTokens[redeemer], "insufficient amount of tokens");
```

##### Status
No issue

##### Client's commentary
We have a check on here: https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L625


#### 4. Possible flashloan attack
##### Description
Current version of flashloan function gives opportunity to any user to set `exchangeRate = 0`, which can be used in another protocols to steal assets:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L169

##### Recommendation
We recommend to transfer tokens to user directly without using `doTransferOut` function.

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/0d23116f370c362c7a85caf0671a81a5e8c4784e


#### 5. Incorrect tokens transfer
##### Description
Tx fail if user tries to send more tokens than he has:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L339

##### Recommendation
We recommend to add simple require to save gas for user and give him some information about why tx failed:
```solidity=
require(accountTokens[src] >= tokens, "Insufficient balance");
```

##### Status
No issue

##### Client's commentary
We have a check here: https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L380

#### 6. Allowed zero `mintFresh`
##### Description
Zero `mintFresh` doesn't change the state of supply and collateral tokens. It only consumes gas and emits an "empty" event
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L476

##### Recommendation
We recommend quitting `mintFresh` after checks https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L490
```solidity=
if (mintAmount == 0) {
    return (uint(Error.NO_ERROR), 0);
}
```

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


#### 7. Allowed zero `borrowFresh` and `repayBorrowFresh`
##### Description
Zero `borrowFresh` and `repayBorrowFresh` don't change the state of borrow balance. They only update borrower `borrowIndex`, consume gas and emit an "empty" event
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CToken.sol#L437
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CToken.sol#L541

##### Recommendation
We recommend quitting `borrowFresh` and `repayBorrowFresh`after checks https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CToken.sol#L453
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CToken.sol#L552
```solidity=
if (borrowAmount == 0) {
    accountBorrows[borrower].interestIndex = borrowIndex;
    return (uint(Error.NO_ERROR), 0);
}
```
```solidity=
if (repayAmount == 0) {
    accountBorrows[borrower].interestIndex = borrowIndex;
    return (uint(Error.NO_ERROR), 0);
}
```

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


#### 8. Allowed zero `redeemFresh`
##### Description
`redeemTokensIn` and `redeemAmountIn` may be both zero: https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L559

##### Recommendation
Add a check:
- append existing require
```solidity=
require(redeemTokensIn == 0 && redeemAmountIn > 0 ||
redeemAmountIn == 0 && redeemTokensIn > 0, "one of redeemTokensIn or redeemAmountIn must be zero");
```
- or quit function if both are zero
```solidity=
if (redeemTokensIn == 0 && redeemAmountIn == 0) {
    return uint(Error.NO_ERROR);
}
```

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


#### 9. Allowed zero `seizeInternal`
##### Description
Zero `seizeInternal` doesn't change the state of supply and collateral tokens. It only consumes gas and emits an "empty" event
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L654

##### Recommendation
We recommend quitting `seizeInternal` after checks https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L669
```solidity=
if (seizeTokens == 0) {
    return uint(Error.NO_ERROR);
}
```

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


#### 10. Allowed zero `flashLoan`
##### Description
Zero `flashLoan` doesn't earn fees. It only consumes gas and emits an "empty" event
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L160

##### Recommendation
We recommend adding a check in `flashLoan`
```solidity=
require(amount > 0, "flashLoan amount should be greater than zero");
```

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


### COMMENTS
#### 1. Possible gas saving
##### Description
In following function another variable can be used to save little gas and not to invoke `address` function.
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L183

##### Recommendation
Use variable `cTokenAddress`
```solidity=
Market storage marketToExit = markets[cTokenAddress];
```

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


#### 2. Remove unused functions
##### Description
In current version of smart contract there are some functions which are not currently used.
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L273
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L410
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L459
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L526
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L591
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L644

##### Recommendation
We recommend to remove these functions to save gas on deployment.

##### Status
Acknowledged

##### Client's commentary
We can’t remove the hook from comptroller since old CToken will still need to access this function. Moreover, the CEther (native token) can’t be upgraded so we can’t arbitrarily remove functions from comptroller.

#### 3. Gas saving in copying storage variable
##### Description
In following function simple check can be added to save gas:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L213

##### Recommendation
We recommend to add following check:
```solidity=
if (assetIndex != storedList.length - 1){
    storedList[assetIndex] = storedList[storedList.length - 1];
}
```
##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


#### 4. Possible gas saving
##### Description
In following function adding of return value can save some gas
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L1303

##### Recommendation
We recommend to change function as follows:
```solidity=
function _setCompSpeeds(address[] memory cTokens, uint[] memory speeds) public {
    ...
    uint res = 3;
    if (speeds[i] > 0) {
        res = _initCompState(cTokens[i]);
    }
    CToken cToken = CToken(cTokens[i]);
    Exp memory borrowIndex = Exp({mantissa: cToken.borrowIndex()});
    if (res == 3)
    {
        updateCompSupplyIndex(address(cToken));
        updateCompBorrowIndex(address(cToken), borrowIndex);
    }
    if (res == 1)
    {
        updateCompSupplyIndex(address(cToken));
    }
    if (res == 2)
    {
        updateCompBorrowIndex(address(cToken), borrowIndex);
    }
    ...
}
function _initCompState(address cToken) internal returns (uint) {
    uint res = 0;
    if (compSupplyState[cToken].index == 0 && compSupplyState[cToken].block == 0) {
        res = 1;
        compSupplyState[cToken] = CompMarketState({
            index: compInitialIndex,
            block: safe32(getBlockNumber(), "block number exceeds 32 bits")
        });
    }

    if (compBorrowState[cToken].index == 0 && compBorrowState[cToken].block == 0) {
        res = res + 2;
        compBorrowState[cToken] = CompMarketState({
            index: compInitialIndex,
            block: safe32(getBlockNumber(), "block number exceeds 32 bits")
        });
    }
    return res;
}
```

##### Status
Acknowledged

##### Client's commentary 
We don’t use COMP (CREAM) rewards anymore and these functions are admin functions.


#### 5. Pure function definition
##### Description
Following function can be marked `pure`:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L1350

##### Recommendation
We recommend to mark this function `pure` to save gas.

##### Status
No issue


#### 6. Unnecessary usage of safe calculations
##### Description
In the following function simple substraction can be used to save gas:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L353
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L594

##### Recommendation
We recommend using simple substraction:
```solidity=
collateralTokens = tokens - bufferTokens;
```

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


#### 7. Unnecessary calculation of variable
##### Description
In the following function calculation of `allowanceNew` can be moved inside `if` block to save gas:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L379

##### Recommendation
We recommend to move variable into `if` block:
```solidity=
if (startingAllowance != uint(-1)) {
    uint allowanceNew = sub_(startingAllowance, tokens);
    transferAllowances[src][spender] = allowanceNew;
}
```

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


#### 8. Move redeem hook
##### Description
In the following function security hook can be moved to save some gas for user:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L639

##### Recommendation
We recommend moved function like this:
```solidity=
function redeemFresh(address payable redeemer, uint redeemTokensIn, uint redeemAmountIn) internal returns (uint) {
    ...
    comptroller.redeemVerify(address(this), redeemer, vars.redeemAmount, vars.redeemTokens);
    
    uint bufferTokens = sub_(accountTokens[redeemer], accountCollateralTokens[redeemer]);
    ...
}
```

##### Status
Acknowledged

##### Client's commentary 
We don’t want to change the flow of `CToken` (at least not in this PR). Normally, every action (mint, borrow, transfer, redeem, repay) will have two comptroller hooks. One is allowance hook and the other one is verification hook. Verification is put at the rear of the function to act as a defense hook while most of the verification hooks are never used.


#### 9. Possible liquidity lost
##### Description
Random user can lose tokens if he invokes following function:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L127

##### Recommendation
We recommend to add following check:
```solidity=
require(msg.sender == admin, "only admin can add reserves");
```

##### Status
Acknowledged

##### Client's commentary 
This function is designed for everyone to add reserves.


#### 10. Necessary initialization
##### Description
If `closeFactorMantissa` not initialized then all borrow liquidation always fail:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L869

##### Recommendation
We recommend to initialize `closeFactorMantissa` in constructor.

##### Status
Acknowledged

##### Client's commentary 
The close factor has been set and only admin could adjust the value.


#### 11. Cap initialization
##### Description
If `collateralCap` is initialized after smart contract has accumulated assets >` collateralCap`, then users will not be able to increase their collateral for particular market:
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L135

##### Recommendation
We recommend to initialize `collateralCap` in `initialize` function.

##### Status
Acknowledged

##### Client's commentary
We don’t expect to put collateral cap on all markets. By default, collateral cap equals to 0 which means no cap. And yes, if the collateral cap is reached, it’s by design that no user could increase collateral anymore.


#### 12. Unreachable code in `getCTokenBalanceInternal`
##### Description
Affecting variable `accountTokens[account]` always makes `isCollateralTokenInit[account]` true, so `accountCollateralTokens[account]` will be returned. Otherwise balance is 0
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L408

##### Recommendation
We recommend to remove unreachable part

##### Status
No issue

##### Client's commentary
This one is a little bit tricky. Basically you are right about affecting variable `accountTokens[account]` always makes `isCollateralTokenInit[account]` `true`. However, every market has a function called `getAccountSnapshot` to show a specific user’s account snapashot. It contains the `CToken` balance of the given user. When a market is upgraded to the `CCollateralCap` version, a user might have `CToken` balance but not initialize its collateral token.
There is one function called `getHypotheticalAccountLiquidityInternal` in comptroller that will call function `getAccountSnapshot` When calculating the account liquidity, the comptroller will iterate every asset in `AccountAssets`to check `CToken` balance. Every market in `ccountAssets`is considered ‘entered’ by the user, so if the collateral token is not initialized, it should return `AccountTokens[account]`.


#### 13. Unlimited `liquidationIncentiveMantissa` and `closeFactorMantissa`
##### Description
There are max and min limits for `liquidationIncentiveMantissa` and `closeFactorMantissa` in `ComptrollerG1.sol` but not in `Comptroller.sol`
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/ComptrollerG1.sol#L83-L96

##### Recommendation
We recommend adding limits and checks
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L78
```solidity=
// closeFactorMantissa must be strictly greater than this value
uint constant closeFactorMinMantissa = 5e16; // 0.05

// closeFactorMantissa must not exceed this value
uint constant closeFactorMaxMantissa = 9e17; // 0.9

// liquidationIncentiveMantissa must be no less than this value
uint constant liquidationIncentiveMinMantissa = mantissaOne;

// liquidationIncentiveMantissa must be no greater than this value
uint constant liquidationIncentiveMaxMantissa = 15e17; // 1.5
```
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L930
```solidity=
Exp memory newLiquidationIncentive = Exp({mantissa: newLiquidationIncentiveMantissa});
Exp memory minLiquidationIncentive = Exp({mantissa: liquidationIncentiveMinMantissa});
if (lessThanExp(newLiquidationIncentive, minLiquidationIncentive)) {
    return fail(Error.INVALID_LIQUIDATION_INCENTIVE, FailureInfo.SET_LIQUIDATION_INCENTIVE_VALIDATION);
}

Exp memory maxLiquidationIncentive = Exp({mantissa: liquidationIncentiveMaxMantissa});
if (lessThanExp(maxLiquidationIncentive, newLiquidationIncentive)) {
    return fail(Error.INVALID_LIQUIDATION_INCENTIVE, FailureInfo.SET_LIQUIDATION_INCENTIVE_VALIDATION);
}
```
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L869
```solidity=
Exp memory newCloseFactorExp = Exp({mantissa: newCloseFactorMantissa});
Exp memory lowLimit = Exp({mantissa: closeFactorMinMantissa});
if (lessThanOrEqualExp(newCloseFactorExp, lowLimit)) {
    return fail(Error.INVALID_CLOSE_FACTOR, FailureInfo.SET_CLOSE_FACTOR_VALIDATION);
}

Exp memory highLimit = Exp({mantissa: closeFactorMaxMantissa});
if (lessThanExp(highLimit, newCloseFactorExp)) {
    return fail(Error.INVALID_CLOSE_FACTOR, FailureInfo.SET_CLOSE_FACTOR_VALIDATION);
}
```
##### Status
Acknowledged

##### Client's commentary
These functions are admin functions and we barely call them. We removed the check to decrease the contract size as it was too large to deploy.



#### 14. New market borrow or supply cap may block borrowing or minting
##### Description
If market borrow balance or supply already exceeds new cap when setting it may block borrowing or minting for market
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L1005
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L1025

##### Recommendation
We recommend adding comments about it in the code

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


#### 15. Unused values/statements in functions
##### Description
In `Comptroller.sol` at lines
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/Comptroller.sol#L239

https://github.com/CreamFi/compound-protocol/blob/8432602ff43052b7f316426c3880eb6ab086a92d/contracts/Comptroller.sol#L323
`minter`, `cToken` and `redeemer` values are unused
In `CCollateralCapErc20Delegate.sol` at line  https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20Delegate.sol#L22
the `data` value is initialized but never used
at line
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20Delegate.sol#L25
the `if` statement will never be executed

##### Recommendation
It is recommended to remove redundant code to avoid confusion and increase clarity and readability of the code 

##### Status
Acknowledged

##### Client's commentary
These unused values and statements are used to silence the compiler.


#### 16. Unused functions wrapped in commentaries
##### Description
In `Comptroller.sol` at line https://github.com/CreamFi/compound-protocol/blob/8432602ff43052b7f316426c3880eb6ab086a92d/contracts/Comptroller.sol#L323
`CCollateralCapErc20.sol` at lines  https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L398
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L689
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L536

functions are stated in commentaries, but unused

##### Recommendation
We recommend to remove these unnecessary commentaries to improve clarity and readability of the code

##### Status
No issue

##### Client's commentary
`xxxVerify` functions in comptroller are still used by some `CTokens`.


#### 17. Explicit statement of `uint256` values
##### Files
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol
https://github.com/CreamFi/compound-protocol/blob/8432602ff43052b7f316426c3880eb6ab086a92d/contracts/Comptroller.sol
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CTokenInterfaces.sol
https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/ComptrollerStorage.sol

##### Description

In `CCollateralCapErc20.sol`, `CTokenInterfaces.sol`, `Comptroller.sol`, `ComptrollerStorage.sol` all instances of `uint` values are not stated as `uint256` explicitly

##### Recommendation
We recommend to expicitly state `uint` values as `uint256` to increase clarity and readability of the code

##### Status
Acknowledged


#### 18. Unclear commentary
##### Description
At line https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L552 the `@param` comment states that only one of `redeemTokensIn` or `redeemAmountIn` values may be non-zero, however, it may be confusing to acknowledge

##### Recommendation
It is recommended to rewrite the comment to explicitly state that `redeemTokensIn` and`redeemAmountIn` can both be zero values at the same time

##### Status
Fixed at https://github.com/CreamFi/compound-protocol/commit/f634f8fc6332d4e7e5fcfbb651eb5d2e39b2f732


#### 19. Possible value truncation issues
##### Description
In `CCollateralCapErc20.sol` at line https://github.com/CreamFi/compound-protocol/blob/23a4ae93adc70334553f5a83429a4e967c1eefaa/contracts/CCollateralCapErc20.sol#L513 the `div_ScalarByExpTruncate()` may round the result down to the next nearest integer if it is calculated to be a non-integer number of cToken units, sufficiently small loans may be affected, however, the loss should never be more than one indivisible unit of a token used

##### Recommendation
This is a relatively unavoidable error which appears due to the EVM operation result. It should be acknowledged by suppliers with extremely small amount of tokens

##### Status
Acknowledged

##### Client's commentary
It’s a known issue that only effects extremely small amount of tokens.



## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR    | -
WARNING  | 10
COMMENT  | 19

### Executive summary
C.R.E.A.M. bridges liquidity across underserved assets by providing algorithmic money markets to these underserved assets. Users can supply any supported assets and use these supplied assets as collateral to borrow any other supported assets. C.R.E.A.M. has launched on Ethereum and Binance Smart Chain.

### Conclusion
Smart contract has been audited and several suspicious places were found. During audit no critical or major issues were identified. Several issues were marked as warnings and comments. After working on audit report all issues were fixed or acknowledged(if the issue is not critical) by client, so contracts assumed as secure to use according our security criteria.

Final commit identifier with all fixes: `566deba52a13dbc33e20395946b8e0c99932ab9f`