# Aave protocol v2 audit by MixBytes

###### tags: `Aave`

![](MixBytes.png)

## Introduction

### General Provisions
Aave is a decentralized non-custodial money market protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion.

### Scope of audit
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/configuration/LendingPoolAddressesProvider.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/configuration/LendingPoolAddressesProviderRegistry.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/IAaveIncentivesController.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/IChainlinkAggregator.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/IERC20.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/IERC20Detailed.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/IExchangeAdapter.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/ILendingPool.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/ILendingPoolAddressesProvider.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/ILendingPoolAddressesProviderRegistry.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/ILendingRateOracle.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/IPriceOracle.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/IPriceOracleGetter.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/IReserveInterestRateStrategy.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/ISwapAdapter.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/interfaces/IUniswapExchange.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/lendingpool/DefaultReserveInterestRateStrategy.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/lendingpool/LendingPool.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/lendingpool/LendingPoolCollateralManager.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/lendingpool/LendingPoolConfigurator.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/lendingpool/LendingPoolStorage.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/configuration/ReserveConfiguration.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/configuration/UserConfiguration.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/logic/GenericLogic.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/logic/ReserveLogic.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/logic/ValidationLogic.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/helpers/Errors.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/helpers/Helpers.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/logic/GenericLogic.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/logic/ReserveLogic.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/logic/ValidationLogic.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/math/MathUtils.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/math/PercentageMath.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/misc/Context.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/misc/IERC20DetailedBytes.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/tokenization/AToken.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/tokenization/IncentivizedERC20.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/tokenization/StableDebtToken.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/tokenization/VariableDebtToken.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/tokenization/base/DebtTokenBase.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/tokenization/interfaces/IAToken.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/tokenization/interfaces/IScaledBalanceToken.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/tokenization/interfaces/IStableDebtToken.sol
https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/tokenization/interfaces/IVariableDebtToken.sol


## Security Assessment Principles

### Classification of Issues

* CRITICAL: Bugs leading to Ether or token theft, fund access locking or any other loss of Ether/tokens to be transferred to any party (for example, dividends). 

* MAJOR: Bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement. 

* WARNINGS: Bugs that can break the intended contract logic or expose it to DoS attacks. 

* COMMENTS: Other issues and recommendations reported to/ acknowledged by the team.

### Security Assessment Methodology

Two auditors independently verified the code.

Stages of the audit were as follows:

* "Blind" manual check of the code and its model 
* "Guided" manual code review
* Checking the code compliance with the customer requirements 
* Discussion of independent audit results
* Report preparation

## Report

### CRITICAL

Not found

### MAJOR

#### 1. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L18 

One leading `F` is missing in this mask.

```solidity
uint256 constant LIQUIDATION_BONUS_MASK = 0xFFFFFFF0000FFFFFFFF;
```

This fact results in the corruption of four bits in the reserve factor field during the operations on the liquidation bonus field. `getLiquidationBonus` is also affected.
We suggest fixing the mask. We also recommend adding tests for each `ReserveConfiguration` field which have other fields set to some values, perform some actions, restore the field to the original value and make sure that the entire mask is intact.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/5ddd98c52993cbe0093e4a32d14d2aec62939f00*

#### 2. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L46

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L63

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L84

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L106

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L128

Bit lengths of the provided values are not checked against bit lengths of the corresponding fields in the `data`.

For example, here

```solidity
function setLtv(ReserveConfiguration.Map memory self, uint256 ltv) internal pure {
    self.data = (self.data & LTV_MASK) | ltv;
```

providing a value greater than `65535` as `ltv` will result in a corruption of the liquidation threshold field. We recommend making sure that passed values fit in the corresponding fields.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b3cc9d1a62464998e512cf337c35a87ab459a360*


#### 3. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L68

It looks like `userBalance` is erroneously used instead of `amount`. This will result in overly strict restrictions on withdrawals. We suggest replacing the argument.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b4f8592775f41e9e52e0068b3c531a08d0b8750c*


#### 4. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L200

The `vars.availableLiquidity` field is not initialized before usage.

```solidity
//calculate the max available loan size in stable rate mode as a percentage of the
//available liquidity
uint256 maxLoanSizeStable = vars.availableLiquidity.percentMul(maxStableLoanPercent);
```

Proper initialization should be added.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/3f714b9dc848d28d1753fd8a673038fda4f024ed*


#### 5. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L533 

Changing the decimals here will not automatically change the decimals either in the aToken or in the debt tokens.

```solidity
function setReserveDecimals(address asset, uint256 decimals) external onlyAaveAdmin {
    ReserveConfiguration.Map memory currentConfig = pool.getConfiguration(asset);

    currentConfig.setDecimals(decimals);

    pool.setConfiguration(asset, currentConfig.data);
```

Additionally, the oracle must be updated simultaneously to consider the new value of the decimals. Otherwise, significant mispricing and liquidations may occur. We suggest removing this function. Alternatively, the change may be allowed only for inactive reserve and must be propagated to the tokens.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/bfa26634a61347391f5f1251e837c18e2d381c0e*


#### 6. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ReserveLogic.sol#L341-L347 

Value `vars.previousStableDebt` calculated this way is actually the current stable debt and always equals to `vars.currentStableDebt`.

```solidity
//calculate the stable debt until the last timestamp update
vars.cumulatedStableInterest = MathUtils.calculateCompoundedInterest(
  vars.avgStableRate,
  vars.stableSupplyUpdatedTimestamp
);

vars.previousStableDebt = vars.principalStableDebt.rayMul(vars.cumulatedStableInterest);
```

As a result, the stable debt difference is not taken into account. Moreover, the processed stable debt increment is not recorded in any way.

One possible solution is to treat `vars.principalStableDebt` as the previous stable debt and update `StableDebtToken`'s `_totalSupply` and `_totalSupplyTimestamp` after the operation.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/276dee4918d1b76b236195e674132fa7d4ba2324*


#### 7. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L582

```solidity
IERC20(asset).safeTransferFrom(receiverAddress, vars.aTokenAddress, vars.amountPlusPremium);

reserve.updateState();
reserve.cumulateToLiquidityIndex(IERC20(vars.aTokenAddress).totalSupply(), vars.premium);
reserve.updateInterestRates(asset, vars.aTokenAddress, vars.premium, 0);
```

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L521

```solidity
IERC20(toAsset).safeTransferFrom(
    receiverAddress,
    address(vars.toReserveAToken),
    vars.amountToReceive
);

if (vars.toReserveAToken.balanceOf(msg.sender) == 0) {
    _usersConfig[msg.sender].setUsingAsCollateral(toReserve.id, true);
}

vars.toReserveAToken.mint(msg.sender, vars.amountToReceive, toReserve.liquidityIndex);
toReserve.updateInterestRates(
    toAsset,
    address(vars.toReserveAToken),
    vars.amountToReceive,
    0
);
```

`updateInterestRates` needs to be called with `liquidityAdded` set to `0` since liquidity was already transferred to the pool's balance. Otherwise, overestimated liquidity would lead to too low debt interest rates.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/a2e2450bb351844086f749ee24c005df03bc0e4a*


#### 8. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L227-L232

```solidity
principalReserve.updateInterestRates(
  principal,
  principalReserve.aTokenAddress,
  vars.actualAmountToLiquidate,
  0
);

if (vars.userVariableDebt >= vars.actualAmountToLiquidate) {
  IVariableDebtToken(principalReserve.variableDebtTokenAddress).burn(
    user,
    vars.actualAmountToLiquidate,
    principalReserve.variableBorrowIndex
  );
} else {
  IVariableDebtToken(principalReserve.variableDebtTokenAddress).burn(
    user,
    vars.userVariableDebt,
    principalReserve.variableBorrowIndex
  );

  IStableDebtToken(principalReserve.stableDebtTokenAddress).burn(
    user,
    vars.actualAmountToLiquidate.sub(vars.userVariableDebt)
  );
}
```

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L409-L414

```solidity
debtReserve.updateInterestRates(
  principal,
  vars.principalAToken,
  vars.actualAmountToLiquidate,
  0
);
IERC20(principal).safeTransferFrom(receiver, vars.principalAToken, vars.actualAmountToLiquidate);

if (vars.userVariableDebt >= vars.actualAmountToLiquidate) {
  IVariableDebtToken(debtReserve.variableDebtTokenAddress).burn(
    user,
    vars.actualAmountToLiquidate,
    debtReserve.variableBorrowIndex
  );
} else {
  IVariableDebtToken(debtReserve.variableDebtTokenAddress).burn(
    user,
    vars.userVariableDebt,
    debtReserve.variableBorrowIndex
  );
  IStableDebtToken(debtReserve.stableDebtTokenAddress).burn(
    user,
    vars.actualAmountToLiquidate.sub(vars.userVariableDebt)
  );
}
```

Debt reserve interest rates are updated before debt burning takes place.

As a result, stale total debt values are used during interest rates calculation. We suggest switching `updateInterestRates` and the `if` statement.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/c5d7bb5e80e08a7c901cd7bb41b7bb839c2e0f0e*


#### 9. https://github.com/aave/protocol-v2/blob/56d25e81cb0fdfcac785d669d3577b1ef2d9286e/contracts/lendingpool/LendingPool.sol#L511

The `liquidityAdded` parameter of the `updateInterestRates` call seems to be incorrect as the flashloan body is yet to be transferred thus it will not be included in the interest rates calculation.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/584a567635ad4817c7ef105304d62f25158eb120*


### WARNINGS


#### 1. https://github.com/aave/protocol-v2/blob/23f99d30f0698b1a5b64fd000c99bbff83df5d76/contracts/configuration/LendingPoolAddressesProviderRegistry.sol#L38-L50

Unoptimized usage of storage-allocated list `addressesProvidersList`.

Reading of a single element of a list requires 2 `SLOAD`s (due to overflow checks), and loop bounds check requires 1 `SLOAD` (3*N `SLOAD`s total).

Caching `uint[] memory _addressesProvidersList = addressesProvidersList;` requires only N+1 `SLOAD`s.

We recommend to rewrite the function as

```solidity
function getAddressesProvidersList() external override view returns (address[] memory) {
    uint256 maxLength = addressesProvidersList.length;

    address[] memory _addressesProvidersList = addressesProvidersList;
    address[] memory activeProviders = new address[](_addressesProvidersList.length);

    for (uint256 i = 0; i < _addressesProvidersList.length; i++) {
    if (addressesProviders[_addressesProvidersList[i]] > 0) {
        activeProviders[i] = addressesProvidersList[i];
      }
    }

    return activeProviders;
}
```

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/8a82c8f1c0a0ccd4766d6d8fc067edbc932ea73a*


#### 2. https://github.com/aave/protocol-v2/blob/23f99d30f0698b1a5b64fd000c99bbff83df5d76/contracts/configuration/LendingPoolAddressesProviderRegistry.sol#L77-L81

```solidity
for (uint256 i = 0; i < addressesProvidersList.length; i++) {
  if (addressesProvidersList[i] == provider) {
    return;
  }
}
```

Unoptimized loop. `addressesProvidersList.length` provides multiple `SLOAD`s inside the loop. We recommend you to replace a storage allocated variable to a memory cached one.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/c14ea749c467fc8b65b580d5891291e780b935e8*



#### 3. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L953

```solidity
for (uint256 i = 0; i < _reservesList.length; i++)
if (_reservesList[i] == asset) {
    reserveAlreadyAdded = true;
}
if (!reserveAlreadyAdded) {
  _reserves[asset].id = uint8(_reservesList.length);
  _reservesList.push(asset);
}

```

Unoptimized `reserveAlreadyAdded` computation. It could be computed with the following expression with O(1) complexity:
```solidity
bool reserveAlreadyAdded = _reserves[asset].id != 0 || (_reservesList.length > 0 &&_reservesList[0]==asset);
```

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/232743c332f9db6b4ee0f0e95e459eb2bff75b02*


#### 4. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/math/MathUtils.sol#L27-L30

We recommend replacing computation with the following. Precision is better, gas cost is smaller. Also, the same types are used for time, as in `calculateCompoundedInterest`.

```solidity
return rate.mul(timeDifference).div(SECONDS_PER_YEAR).add(WadRayMath.ray());
```

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/e88d9dc81b009a5ce5f9ce4ef9dac06aa09b7ee1*


#### 5. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L23 

The mask is incorrect for a bit field manipulation.

```solidity
uint256 constant STABLE_BORROWING_MASK = 0xFFFF07FFFFFFFFFFFFFF;
```

It looks like it should be `0xFFFFF7FFFFFFFFFFFFFF`. However, the issue doesn't cause troubles at the moment since bits 60-63 are presently unused. If they are unused on purpose, we suggest explicitly stating it in the Map's comment.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/5ddd98c52993cbe0093e4a32d14d2aec62939f00*


#### 6. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/IncentivizedERC20.sol#L83 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/base/DebtTokenBase.sol#L29 

`msg.sender` is erroneously used instead of `_msgSender()`. Since the contracts inherit from `Context` they should use `_msgSender()` instead of `msg.sender` to properly support `Context`.

The issue comes up when some GSN-like solutions are used together with the tokens. The issue affects off-chain clients and DApps listening for the event. We suggest making an appropriate replacement. Also, we recommend getting rid of `msg.sender` mentions in the files altogether.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/87bbfb957144e5adec2b5af851435833eb8773ce*


#### 7. https://github.com/aave/protocol-v2/blob/4e4fbe65395540304251e9d81232c9921abc4453/contracts/lendingpool/LendingPool.sol#L919

Checking `reservesCount > 0` is important. Otherwise `reserveAlreadyAdded` is computed wrong if `asset` is zero and `_reservesList` is empty.

##### Status
Acknowledged


#### 8. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L113 

We suggest checking that `amount != 0`.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/ee1e20568b4d62c20ec3eb2cb083967d75e9f277*


#### 9. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/configuration/LendingPoolAddressesProvider.sol#L46-L49 

It is not tracked if a proxy is used for each particular address id. As a result, the transition from a non-proxied mode into a proxied one is impossible (`upgradeToAndCall` will fail [here](https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/configuration/LendingPoolAddressesProvider.sol#L167)). Also, an unintended transition from a proxied mode into a non-proxied one is possible. We suggest tracking the fact of proxy usage for each particular address id and making mode transition explicit.

##### Status
*Acknowledged*


#### 10. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/configuration/LendingPoolAddressesProviderRegistry.sol#L57 

Zero lending pool `id` is used as an indicator of an inactive/absent lending pool. Therefore, we suggest prohibiting passing `0` as an `id` parameter value.

```solidity
function registerAddressesProvider(address provider, uint256 id) external override onlyOwner {
  _addressesProviders[provider] = id;
```

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b3cc9d1a62464998e512cf337c35a87ab459a360*


#### 11. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/AToken.sol#L45 

`msg.sender` is erroneously used instead of `_msgSender()`. Since the contracts inherit from `Context` they should use `_msgSender()` instead of `msg.sender` to properly support `Context`. We suggest making an appropriate replacement.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b3cc9d1a62464998e512cf337c35a87ab459a360*


#### 12. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/AToken.sol#L111 

`msg.sender` is erroneously used instead of `user`. We suggest making an appropriate replacement.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/9fddcd0a20e9191ae18f58daa0651053f5f69629*


#### 13. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/IncentivizedERC20.sol#L126-L130 

During this call, an `Approval` event will be emitted. It is not obvious that an allowance decrease during a `transferFrom` operation should fire this event. Event listeners could mix this up with "regular" `Approval` events happening during `approve` and similar operations.

##### Status
*Acknowledged*


#### 14. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/AToken.sol#L153-L155 

A `Transfer` event is not emitted during `_transfer` and `super._transfer`. As a result, event listeners will not be able to track transfers of collateral during liquidations. We recommend emitting an appropriate event.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/727bc12d8007cb5075aef1342caa1532468f9090*


#### 15. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/StableDebtToken.sol#L121-L124 

An average stable rate calculated this way will not compound equivalently to a pair of individual debt positions as the time passes. The cause is the exponentiation during the debt calculation. A simple script illustrates the issue:

```python
SECONDS_PER_YEAR = 365 * 86400
delta_t = 2 * SECONDS_PER_YEAR

balanceOf = lambda principal, rate: principal * ((1. + rate / SECONDS_PER_YEAR) ** delta_t)

principal_A = 200
rate_A = 0.5
principal_B = 500
rate_B = 0.1

principal_sum = principal_A + principal_B
rate_avg = (principal_A * rate_A + principal_B * rate_B) / principal_sum

debt_separate = balanceOf(principal_A, rate_A) + balanceOf(principal_B, rate_B)
debt_unified = balanceOf(principal_sum, rate_avg)

print('Separate accounts total debt: {:.0f}'.format(debt_separate))
print('Avg rate of unified debt: {:.2f}'.format(rate_avg))
print('Total unified debt: {:.0f}'.format(debt_unified))
print('Debt calculation difference: {:.0f}%'.format(100 * (debt_separate - debt_unified) / debt_separate))
```

Which yields:

```
Separate accounts total debt: 1154
Avg rate of unified debt: 0.21
Total unified debt: 1075
Debt calculation difference: 7%
```

Make sure that this behavior is acceptable.

##### Status
*Acknowledged. See below.*


#### 16. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/StableDebtToken.sol#L134-L137 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/StableDebtToken.sol#L178-L181 

Due to the reason stated in the previous issue, it is incorrect to calculate `totalSupply` based on the average stable rate calculated this way. An important consequence is that `totalSupply` will not match the sum of all user debt balances. Moreover, as the time passes it may significantly drift away from the right value. At the moment it is impossible to accurately know on-chain the total stable debt of an asset. Underestimated debt, in its turn, affects the interest rates. Make sure that this risk is acceptable.

##### Status
*Acknowledged*

*Client: yes, not a problem. It's part of the issue that it's impossible to calculate an accurate avgStableRate onchain, because of the compounding on the interest. It will create an excess of interest generated by the borrowers that is not distributed to depositors (most likely to be handled when this version of the protocol will be dismissed). It will be up to the governance when we are in this situation to decide what to do with the excess.*


#### 17. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/StableDebtToken.sol#L142 

Accrued interest added to the principal (`balanceIncrease`) is not added to the `amount` during the `Transfer` event emission.

```solidity
_mint(user, amount.add(balanceIncrease), vars.previousSupply);

// transfer event to track balances
emit Transfer(address(0), user, amount);
```

As a result, event listeners will not be able to track the stable debt of the user without consulting the `balanceOf` function. Make sure that this is the desired behavior.

##### Status
*Acknowledged*

*The event is implemented this way for the sake of consistency between the debt and liquidity tokens.*


#### 18. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/StableDebtToken.sol#L202 

Accrued interest (`balanceIncrease`) is not taken into consideration during the `Transfer` event emission.

```solidity
if (balanceIncrease > amount) {
  _mint(user, balanceIncrease.sub(amount), previousSupply);
} else {
  _burn(user, amount.sub(balanceIncrease), previousSupply);
}

// transfer event to track balances
emit Transfer(user, address(0), amount);
```

As a result, event listeners will not be able to track the stable debt of the user without consulting the `balanceOf` function. In some cases the stable debt decreases and in some cases it increases. We suggest emitting the events in the branches of the `if` statement with the proper values.

##### Status
*Acknowledged*

*The event is implemented this way for the sake of consistency between the debt and liquidity tokens.*


#### 19. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L440 

A reserve increase as a result of a `swapLiquidity` operation is enabled for a reserve in the frozen state. Make sure that this is the desired behavior.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b7efa920ca21c4f5c67c471c3ea6e27921bfb013*


#### 20. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L59 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L366 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L554 

There are no checks that the reserve is active. As a result, `withdraw`, `rebalanceStableBorrowRate`, `flashLoan` operations are enabled for an inactive reserve. Make sure that this is the desired behavior.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/57ed9efd58260c11f133c61c684a441b2a4d2aed, https://github.com/aave/protocol-v2/commit/f87873a6dea9f94ae737536bdae82a51d5fc1edb*


#### 21. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L158 

In the case of a bank run on a reserve, there is a period when the reserve can not service all withdrawal requests. This liquidity deficit will last until high interest rates (caused by the high usage ratio) kick in. Potentially it may take a long time.

In an adverse edge case of the fast devaluation of an asset, debtors may prefer to keep the debt despite high interest rates, profiting from the short position. In this case, lenders are stuck in lossmaking long positions. One possible solution is to use exponential interest rates in the 98% - 100% usage ratio scenario instead of a linear slope in `DefaultReserveInterestRateStrategy`.

##### Status
*Acknowledged*

*Client: no action, consequence on the model and managed on the interest strategies.*


#### 22. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/GenericLogic.sol#L250 

During a health factor calculation, liquidation bonuses must be taken into account one way or another. Otherwise, the user's collateral would not have enough funds to repay the borrowed assets and liquidator's bonuses. The first possible solution is to include bonuses explicitly in the HF calculation. Another solution is to ensure that an asset liquidation threshold is lower than `1 / liquidationBonus` (although some extra margin should be included to tackle the price slippage).

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/43d64c4509b2a9dff8fc2fa9186f245e6c9fd76e*


#### 23. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L180-L181 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L194 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L278-L279 

These checks can be entirely bypassed as it is not enforced during deposits or other increases of the user's aToken balance.

Consider this sequence of operations:

* User deposits asset B
* User borrows asset A
* User deposits asset A
* User withdraws asset B

Eventually, the user will be able to have any amount of deposited funds in the same asset as long as it is bigger than the debt.

Moreover, since interest rate strategies do not work on a per-user basis, an attacker can employ multiple accounts to manipulate reserve rates and bypass these checks.

##### Status
*Acknowledged*

*Client: if you bypass the condition, you will end up with a higher stable rate.*


#### 24. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L253-L275 

There is no `userConfig.setUsingAsCollateral(collateralReserve.id, false)` call in the case of the total depletion of this kind of user's collateral. We suggest adding the call.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/a3ee5d2ce695f3fb668c9622c5e16facc3ca8424*


#### 25. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L301 

This requirement is not satisfied - the collateral may be completely liquidated, as it can be seen below:

```solidity
vars.maxPrincipalAmountToLiquidate = vars.userStableDebt.add(vars.userVariableDebt);
```

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b7efa920ca21c4f5c67c471c3ea6e27921bfb013*


#### 26. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L415 

There may be some amount of the principal left behind on the `receiver`'s balance because of a stale or time-averaged conversion price provided by the oracle or because of the liquidation bonus paid.
Also, if a position is liquidated by the owner, the owner unnecessary pays the liquidation bonus. Make sure that this is the desired behavior.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b7efa920ca21c4f5c67c471c3ea6e27921bfb013*


#### 27. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L309 

A liquidator does not get any bonus for calling `repayWithCollateral`. Make sure that this is the desired behavior.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b7efa920ca21c4f5c67c471c3ea6e27921bfb013*


#### 28. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L505 

There may be some dust of the `toAsset` on the balance of `receiverAddress` sent by a third party or funds of other users. `LendingPoolCollateralManager` would not have the approval to spend these funds, rendering any `swapLiquidity` operations via the `receiverAddress` impossible.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b7efa920ca21c4f5c67c471c3ea6e27921bfb013*


#### 29. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/openzeppelin-upgradeability/VersionedInitializable.sol#L19-L27 

We suggest using explicitly computed storage slots for any fields responsible for proxy mechanics since their location must be consistent across the code versions and any collisions with business fields must be prevented. A good example of the explicitly computing storage slots technique can be found [here](https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/openzeppelin-upgradeability/BaseUpgradeabilityProxy.sol#L20-L37).

As a possible issue example consider [`DebtTokenBase`](https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/base/DebtTokenBase.sol#L20). The field order is determined by the inheritance order, `VersionedInitializable` fields go after `IncentivizedERC20`. Any addition of new non-mapping fields in a new version of `IncentivizedERC20` would overwrite the `lastInitializedRevision` and `initializing` fields.

The issue proof of concept: https://github.com/Eenae/VersionedInitializable-issue-PoC

##### Status
*Acknowledged*

*Client: we will make sure the future implementations keep track of the proper chain of inheritance and storatge layout.*


#### 30. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L487

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L503

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L518

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L344-L345

We suggest specifying units of measurement for these parameters as well as acceptable value ranges in the comments. Parameter validation will be helpful as well. Incorrectly set `ltv` and `liquidationThreshold` lead to fund losses.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/92e2ecab5198dda4dd4fedd98e158af957918fd4*


#### 31. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol

`_reservesList` is fully loaded to memory on a huge set of user's actions. If `SLOAD` cost is increased up to 2100 at [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929), for 128-sized list length it will take 2100*(128+1)=270900 gas.

In most cases, it is enough to get information only about the reserve touched by the user at the transaction.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/7a0d201f006fd9667959c49f789dc8bb7e09dc08*


#### 32. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L506

When setting `threshold` to zero, some positions may instantly become undercollaterized and, what is more important, non-liquidatable. We suggest requiring `availableLiquidity == 0` in this case.

Another possible solution is to rewrite [the clause](https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L362-L363)

```solidity
    bool isCollateralEnabled = collateralReserve.configuration.getLiquidationThreshold() > 0 &&
      userConfig.isUsingAsCollateral(collateralReserve.id);
```

as

```solidity
    bool isCollateralEnabled = userConfig.isUsingAsCollateral(collateralReserve.id);
```

so that collateral could be liquidated if and only if the user allows it so. Plus, isUsingAsCollateral should be set to true by default only if `getLiquidationThreshold() > 0` and `setUserUseReserveAsCollateral(true)` should be allowed only if `getLiquidationThreshold() > 0`. Liquidation of collateral by itself won't be a problem if the user authorized it and if the oracle provides a fair price for the asset. That way you will be able to instantly switch off some collateral, a lot of positions may become liquidatable, but liquidations will be fair (except for some losses on liquidation bonuses). Graceful threshold decreases and public warnings are still recommended.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/948bd960be1bc345b2c54171271717039e0e076f*


#### 33. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L255

There is no `_usersConfig[msg.sender].setUsingAsCollateral(collateralReserve.id, true)` call in the case when the liquidator received an amount of collateral aToken for the first time. We suggest adding the call.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/3f070d67ecddfb3a66189fd998b4fe72d25ec937*


#### 34. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L415-L433

There is no `userConfig.setBorrowing(debtReserve.id, false);` call in the case of complete liquidation of the `user` debt. We suggest adding the call.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b7efa920ca21c4f5c67c471c3ea6e27921bfb013*


#### 35. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L593

```solidity
 //if the user didn't choose to return the funds, the system checks if there
 //is enough collateral and eventually open a position
  _executeBorrow(
    ExecuteBorrowParams(
      asset,
      msg.sender,
      msg.sender,
      vars.amountPlusPremium,
      mode,
      vars.aTokenAddress,
      referralCode,
      false
    )
  );
```

`vars.amountPlusPremium` is used as a loan principal instead of `amount`. It means that eventually the pool will be repaid extra `vars.premium` above the lender deposits. These extra funds are not accounted and distributed either to the treasury or to lenders. An extreme example can be described: suppose someone pulls the entire asset as a flashloan with the variable rate mode and then repays it in the same block. The procedure is repeated 100 times. At the end of the block the pool asset balance is 9% more than before the block. The liquidity and variable borrow indexes did not change since the beginning of the block, so the flashloans did not accrue any interest. The 9% will remain undistributed.

We suggest either using `amount` as a flashloan borrow principal or distributing the premium using `cumulateToLiquidityIndex` or eliminating flashloan borrows at all.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/a2e2450bb351844086f749ee24c005df03bc0e4a*


#### 36. Interest excess in case of a disabled stable rate

In the case of disabled stable rate borrowing, there will be some excess interest for the asset because borrowers pay a compounded interest and lenders receive a linear one. That interest won't be withdrawable in any way (only a code upgrade will help). Make sure that this is the desired behavior.

##### Status
*Acknowledged.*

*Client: it is intended, V1 is like that as well. The idea was that this would create a small cushion between what the borrowers are paying and what the depositors are receiving, so to account for potential rounding errors (at least it should ensure that there isn't liquidity missing for depositors withdrawal at the end, even if this means getting slightly underpaid). Conceptually I don't think the difference will be much higher, for two reasons: 1. The compounding on borrowing is approximated so the borrowers are already slightly undercharged. 2. The interest on the depositors' side is linear between actions, but it compounds on every action so with an activity like the one we are seeing in V1, the difference compared to a pure compounded interest is most likely negligible with the positive side effect of being less gas-intensive.*


#### 37. High stable borrowing rate rebalance threshold

If the utilization rate of an asset is below 95%, no rebalances happen. Suppose a lot of stable debt was borrowed cheaply, and then the liquidity rate goes over the stable borrowing rate of some position due to a market move. That would endanger the solvency of the asset pool.

##### Status
*Acknowledged.*

*Client conveyed that the ultimate solution in this rare case is a change of `REBALANCE_UP_USAGE_RATIO_THRESHOLD` via a code upgrade.*


#### 38. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/GenericLogic.sol#L99-L109

In all appearances, Loan To Value and Liquidation Threshold are initial margin and maintenance margin in classic terms. A user cannot borrow further if the weight-averaged Loan To Value is reached. However, they can withdraw collateral as long as the position is above the Liquidation Threshold. This way using transient collateral, obtained with a flashloan, perhaps, users can bypass the Loan To Value check rendering it ineffective. We suggest using Loan To Value while deciding on a balance decrease approval.

##### Status
*Acknowledged*

*Client: we had this discussion internally for quite a long time, and we were aware of the fact that LTV was a soft restriction and could be bypassed. The goal of the LTV is mainly to avoid having normal users opening a position and getting instantly liquidated, which would happen if we use the ltv for both borrowing power and maintenance margin.*


#### 39. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ReserveLogic.sol#L253

Real token balance could be manipulated by flashloans. We recommend to use virtual balances (not affected by flashloans) for available liquidity computations.

##### Status
Acknowledged


#### 40. https://github.com/aave/protocol-v2/blob/56d25e81cb0fdfcac785d669d3577b1ef2d9286e/contracts/lendingpool/LendingPoolConfigurator.sol#L376

The constraint seems to be incorrect as `liquidationBonus` is in inverse relation to `liquidationThreshold` - the lower the threshold the more excess collateral is available as a bonus.

```solidity
//we also need to require that the liq threshold is lower or equal than the liquidation bonus, to ensure that
//there is always enough margin for liquidators to receive the bonus.
require(liquidationThreshold.add(absoluteBonus) <= PercentageMath.PERCENTAGE_FACTOR, Errors.LPC_INVALID_CONFIGURATION);
```

Consider `liquidationThreshold = 1%` as an extreme example. The current constraint limits `liquidationBonus` to `199%` in this case. However, since liquidation happens when collateral * 0.01 < debt, the market value of the collateral can be up to one hundred times the value of the debt i.e., `liquidationBonus` can be up to 10 000%.

In fact, `liquidationThreshold * liquidationBonus` should be less or equal to `PERCENTAGE_FACTOR`.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/43d64c4509b2a9dff8fc2fa9186f245e6c9fd76e*


#### 41. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L194

The current stable debt of the user is not added to the `amount` in this comparison.

```solidity
require(
    !userConfig.isUsingAsCollateral(reserve.id) ||
      reserve.configuration.getLtv() == 0 ||
      amount > IERC20(reserve.aTokenAddress).balanceOf(userAddress),
    Errors.CALLATERAL_SAME_AS_BORROWING_CURRENCY
);
```

As a result, relatively small increments to the current stable debt will be prohibited. We suggest taking the current stable debt into consideration similarly to this check https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L278-L279 .

##### Status
*Acknowledged*


#### 42. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L200

This check may be bypassed by iterative small stable debt increases. We suggest adding the total stable debt to the `amount`.

```solidity
//calculate the max available loan size in stable rate mode as a percentage of the
//available liquidity
uint256 maxLoanSizeStable = vars.availableLiquidity.percentMul(maxStableLoanPercent);

require(amount <= maxLoanSizeStable, Errors.AMOUNT_BIGGER_THAN_MAX_LOAN_SIZE_STABLE);
```

Moreover, `MAX_STABLE_RATE_BORROW_SIZE_PERCENT` constraint is not checked during `swapBorrowRateMode`, `withdraw`, `swapLiquidity` operations, as well as liquidations. That may render the constraint ineffective.

##### Status
*Acknowledged*

*Client: if you bypass the condition, you will end up with a higher stable rate.*


#### 43. https://github.com/aave/protocol-v2/blob/56d25e81cb0fdfcac785d669d3577b1ef2d9286e/contracts/tokenization/DelegationAwareAToken.sol#L55-L63

A new `initialize` implementation shadows the base contract implementation. As a result, the `DOMAIN_SEPARATOR` field is uninitialized, resulting in broken `permit` functionality. We suggest removing the new implementation.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b2a871f8f780597b5c04026ee08ad4def75a215c*


#### 44. https://github.com/aave/protocol-v2/blob/750920303e33b66bc29862ea3b85206dda9ce786/contracts/protocol/lendingpool/LendingPoolCollateralManager.sol#L212-L225

Reentrancy in the liquidation process. The difficulty of the exploitation is high (see prerequisites), however, the impact is high as well.

Prerequisites:
- Token T is used as an asset with a non-zero liquidation threshold and loan to value.
- Token T issues a callback to the `receiver` on `transfer(receiver, amount)`.

Attack scenario:
1. An attacker has 100 T tokens as collateral.
2. Health factor of the attacker's position goes below 1 (position becomes liquidatable).
3. The attacker liquidates himself, selecting T as collateral to liquidate, opting not to `receiveAToken`, and providing such amount of `debtToCover` that `maxCollateralToLiquidate == userCollateralBalance`.
4. During the `vars.collateralAtoken.burn` call the attacker uses the reentrancy of T, 
    4.1. making a 1 000 000 T deposit as the `user`
    4.2. borrowing the maximum possible amount of other assets on behalf of the `user`.
5. The `userConfig.setUsingAsCollateral(collateralReserve.id, false);` line gets executed.
6. The attacker repays the initial debt of the liquidation.
7. Now the attacker ended up with the 1 000 000 T deposit which has the `isUsingAsCollateral` set to `false` and a huge debt.
8. The attacker now can withdraw 1 000 000 T collateral since `balanceDecreaseAllowed` returns `true` when `isUsingAsCollateral` is set to `false`.

The first remediation step is to look up the actual collateral balance here https://github.com/aave/protocol-v2/blob/750920303e33b66bc29862ea3b85206dda9ce786/contracts/protocol/lendingpool/LendingPoolCollateralManager.sol#L222. Additionally, any tokens making external calls in `transfer` and `transferFrom` should be avoided. Alternatively, a reentrancy guard can be used.

##### Status
*Acknowledged*

*Client: no [token] listing can be done without deep analysis of that aspect*


### COMMENTS


#### 1. https://github.com/aave/protocol-v2/blob/23f99d30f0698b1a5b64fd000c99bbff83df5d76/contracts/libraries/logic/ValidationLogic.sol#L53

```solidity
function validateWithdraw(
  address reserveAddress,
  address aTokenAddress,
  uint256 amount,
  uint256 userBalance,
  mapping(address => ReserveLogic.ReserveData) storage reservesData,
  UserConfiguration.Map storage userConfig,
  address[] calldata reserves,
  address oracle
) external view {
```

Check that variable `aTokenAddress` should be unused and comment it's name.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/2e30bb8b858bd33c00df00b74ca797947747cccb*


#### 2. https://github.com/aave/protocol-v2/blob/23f99d30f0698b1a5b64fd000c99bbff83df5d76/contracts/libraries/math/MathUtils.sol#L11

```solidity
uint256 internal constant SECONDS_PER_YEAR = 365 days;
```

This is not correct for leap years. We recommend you to add a comment that you ignore leap seconds or rename the variable.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/2fd3fe141a43fceb8309a6183ef5d1ce1fb10c43*

#### 3. https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/libraries/configuration/ReserveConfiguration.sol#L46

```solidity
self.data = (self.data & RESERVE_FACTOR_MASK) | reserveFactor << 64;
```
We recommend you to use the same code style for all bit mask selectors (put the right part into brackets or remove brackets to other places for the same cases).

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/d56a7a27797dedae3822e0ae914be469c2733eda*


#### 4. https://github.com/aave/protocol-v2/blob/12d97f9f13a3f04c206c6a72b93c23126b869572/contracts/lendingpool/LendingPool.sol#L67

`_whenNotPaused()` is used only as a modifier. We recommend to rewrite it as a modifier.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/3fc812e7fb4fdc383271c1ce34bfe5b58d7a1c83*

#### 5. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/IncentivizedERC20.sol#L184

```solidity
uint256 totalSupply = _totalSupply;
```
We recommend avoiding global variables shadowing.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/cb03bab6eaed0489353fe1c9602ac28fbc7a9f84*

#### 6. https://github.com/aave/protocol-v2/blob/a7861f8cbaa2049ec047b22713628b297d608831/contracts/lendingpool/LendingPool.sol#L896 

We recommend to move all bitfield-related optimizations to corresponding functions.

Here is the example for `setBorrowing`:

```solidity
function setBorrowing(
  UserConfiguration.Map storage self,
  uint256 reserveIndex,
  bool borrowing
) internal {
  uint _data = self.data;
  uint _data_new =(_data & ~(1 << (reserveIndex * 2))) |
  (uint256(borrowing ? 1 : 0) << (reserveIndex * 2));
  if (_data != _data_new) {
      self.data = _data_new;
  }
}
```

The same optimizations could be applied to ReserveConfiguration.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/386138cc9cf8f05ac64281bef0f6c16374665c1b*

#### 7. https://github.com/aave/protocol-v2/blob/a7861f8cbaa2049ec047b22713628b297d608831/contracts/libraries/helpers/Errors.sol

We recommend to use uint-typed codes here to reduce the size of the contract.

##### Status
*Acknowledged*


#### 8. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L55 

The mask application `& ~RESERVE_FACTOR_MASK` can be omitted because the other fields are shifted during the `>> 64` operation. We recommend removing excess code.

##### Status
*Acknowledged*

*Client: no action, to not need to change the logic if we add extra fields to the mask in the future.*


#### 9. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L155 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L173 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L191 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L215 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L236-L239 

The bit shift operations (`>> 56`, `>> 57`, etc.) can be omitted since they do not change the boolean outcome.  We recommend removing excess code.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/6cd18c4320dd072e9ac77bfb4528ef48bd345df1*


#### 10. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/configuration/LendingPoolAddressesProviderRegistry.sol#L23 

The return value is documented erroneously because a number is returned, not a boolean value. We suggest correcting the comment.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/a9a863fcb468ab757a94ab99ef44c0170b541727*


#### 11. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/configuration/LendingPoolAddressesProviderRegistry.sol#L36 

The resulting array is sparse (contains zeros for unregistered address providers), we suggest mentioning it in the documenting comment.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/a9a863fcb468ab757a94ab99ef44c0170b541727*


#### 12. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/configuration/LendingPoolAddressesProviderRegistry.sol#L88 

The return value is documented erroneously, because in the case of absent address provider `uint256(0)` is returned. We suggest correcting the comment.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/a9a863fcb468ab757a94ab99ef44c0170b541727*


#### 13. https://github.com/aave/protocol-v2/blob/614244272e0ee802f324f30bc93b9f0054d50f34/contracts/libraries/math/PercentageMath.sol

We recommend simplifying PercentageMath mul and div operations. Both rational mul and div reduce to computing res:=round(a * x / y), where (x, y) is the 2nd argument in rational form.

In solidity there is the following expression:
```solidity
res = (a * x + half_y)/y;
```
We should check the term for overflow. As we can see, it is a growing function over x and half_y. It means that not overflowing `a_max(x, half_y) = floor((MAX_u256 - half_y)/x)` exists.

In solidity it could be implemented as follows:
```solidity
require(a<=(MAX_U256 - half_y)/x);
```

This approach could be used at both WadRayMath and PercentageMath.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/47d00a0e3a17ebae3cefb1ebe20dfce12423d23e*

#### 14. https://github.com/aave/protocol-v2/blob/614244272e0ee802f324f30bc93b9f0054d50f34/contracts/lendingpool/LendingPool.sol#L888

We recommend cache `_reservesCount`. Then there will be 3 `SLOAD` less.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/a9c3a033ace0ad51268913074ac1f2ce5f464d7f*

#### 15. https://github.com/aave/protocol-v2/blob/232743c332f9db6b4ee0f0e95e459eb2bff75b02/contracts/lendingpool/LendingPool.sol#L925

We recommend replacing `_reservesCount++;` with `_reservesCount=reservesCount+1;`, it is 1 SLOAD less.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/ec600e56e71d16fa0dd08956679b1e581aea5d65*

#### 16. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/configuration/LendingPoolAddressesProvider.sol#L18 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/configuration/LendingPoolAddressesProvider.sol#L121 

Some addresses, namely the owner of the `LendingPoolAddressesProvider` contract and the Aave admin, have substantial power over a lending pool. We suggest using multisignature or DAO solutions to control these addresses.

##### Status
*Acknowledged*

*Client: it will be that way.*


#### 17. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/configuration/LendingPoolAddressesProvider.sol#L40 

We recommend splitting this function into two separate functions since they solve different tasks which are visible in the form of two `if` statement branches.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/c81047ca93bcd93e74ef768aa928e83d79ba87fb*


#### 18. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L88 

The function is documented incorrectly. We suggest updating the comment.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/643ed2f9bcfaee21a8c92e258aa8b0d3080b37ed*


#### 19. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L227-L230 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L252-L255 

We recommend naming the return values explicitly. That way they will be available as named properties in the JS API and in the ABI.

##### Status
*Acknowledged*

*Client: no named return by our style guidelines.*


#### 20. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/UserConfiguration.sol#L28 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/UserConfiguration.sol#L44 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/UserConfiguration.sol#L58 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/UserConfiguration.sol#L72 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/UserConfiguration.sol#L86 

Assertions can be added to ensure that `reserveIndex` does not exceed 127.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/6460dd9e034bf74b882f9f0e02a46ba1282a4d7e*


#### 21. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L29-L178 

Some lending pool configurator events have `asset` parameter `indexed` and some do not. Indexing allows searching for particular asset events in a block range. Make sure that no `indexed` attributes are forgotten.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/e4dc22e50ed2864787f06fd8154b1bc46483f571*


#### 22. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L373 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L387 

Stable rate borrowing setting manipulation is permitted for a reserve with disabled borrowing. This behavior does not cause any harm, however, may be counterintuitive and even dangerous.

##### Status
*Acknowledged*

*Client: no action, no risk*


#### 23. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L92 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#125 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#174 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#189 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#211 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#252 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#313 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#365 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#417 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#549 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#645 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#680 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#699 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#766 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#833 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#841 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#846 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#968 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#977 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#993 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L140-L141 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L310-L311 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L457-L458 

We recommend adding explicit checks that referenced assets exist. Stopping execution as soon as an error emerges is a good security practice and may prevent some complicated vulnerabilities.

##### Status
*Fixed at https://github.com/aave/protocol-v2/blob/56d25e81cb0fdfcac785d669d3577b1ef2d9286e/contracts/lendingpool/LendingPool.sol*


#### 24. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L337-L339 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L472 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L503 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L518 

We suggest checking that `ltv` is lower than `liquidationThreshold / liquidationBonus`. Otherwise, `ltv` would not serve its purpose.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/948bd960be1bc345b2c54171271717039e0e076f*


#### 25. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L193 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L277 

It looks like the `getLtv` function is used to check if a reserve can be used as collateral. However, `getLiquidationThreshold` is mostly used for this purpose. We recommend using a uniform approach throughout the code. Such an approach can be defined as a one expression function in `ReserveConfiguration`.

##### Status
*Acknowledged*


#### 26. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ReserveLogic.sol#L80 

Actually, one unit of income has been accrued. With the original unit that gives us 2*1e27.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/fed8c7988464a0febb711941392c6e32d07ae998*


#### 27. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ReserveLogic.sol#L207-L214 

It looks like at this execution point there is no way the reserve was initialized before.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/f125eeb0c5378e5d0da31bde9d01707b5ec62014*


#### 28. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L96 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L125 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L193 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L216 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L256 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L454 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L498 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L554 

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L617 

We suggest using a reentrancy guard for each public-facing function that transfers any funds. This may sound like a dull and limiting step. However, it is much safer to prevent any possible reentrancy rather than to keep in mind the exponential amount of possible attack vector combinations. [This article](https://medium.com/consensys-diligence/uniswap-audit-b90335ac007) gives a prominent example.

One possible reentrancy attack vector is re-entering `deposit` and `withdraw` if the asset allows external calls before the actual token transfer. However, this reentrancy affects only `updateInterestRates` with incorrect available liquidity. Moreover, this minor incorrectness will be corrected during the next `updateInterestRates` call.

##### Status
*Acknowledged*

*Client conveyed that the auditing of asset tokens, as well as the usage of the Checks-Effects-Interactions pattern, provide a sufficient level of security.*


#### 29. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L308-L319

`balanceDecreaseAllowed` consulted even in the case when the user wants to enable the reserve as collateral.

```solidity
require(
  GenericLogic.balanceDecreaseAllowed(
    reserveAddress,
    msg.sender,
    underlyingBalance,
    reservesData,
    userConfig,
    reserves,
    oracle
  ),
  Errors.DEPOSIT_ALREADY_IN_USE
);
```

Although, adding more collateral is not prohibited because of a check in `balanceDecreaseAllowed`. Still, we suggest calling `balanceDecreaseAllowed` only in the case of the balance decrease.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/0c8efc2261ef9c69524b99816f27c0f3bd1f53eb*


#### 30. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/AToken.sol#L304

The receiver does not have the `UsingAsCollateral` flag set by default. Make sure that this is the desired behavior.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/9e55ea12b67f20b7e762e027e8048cbb5f38e147*


#### 31. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L197

Borrow allowance is a subject to a double withdrawal (in this case - double borrow) attack. Plain `IERC20.approve` is subject to the same attack. More details and mitigation strategies can be found at https://blockchain-projects.readthedocs.io/multiple_withdrawal.html.

##### Status
*Acknowledged*


#### 32. https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/StableDebtToken.sol#L157

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/StableDebtToken.sol#L211

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/StableDebtToken.sol#L281

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/tokenization/VariableDebtToken.sol#L30

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L168

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L176

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L273

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L286

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/DefaultReserveInterestRateStrategy.sol#L115-L117

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L19

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/GenericLogic.sol#L146

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L441

There are some factual slips in the comments, mostly caused by copy-pasting. We suggest correcting them.

##### Status
*Fixed at https://github.com/aave/protocol-v2/blob/0431f0dcbc3604f5f0ac03b442c2c54eab773e21/contracts/*


#### 33. https://github.com/aave/protocol-v2/blob/cfc002dcd161e05029d0932b587cb20e370f097c/contracts/libraries/logic/ReserveLogic.sol#L169 and other 1<<128 to type(uint128).max replacings

`1<<128` is not equal to `type(uint128).max`. So, to ensure that `result` is `uint128`, non-strict checks are enough.

##### Status
*Acknowledged*


#### 34. https://github.com/aave/protocol-v2/blob/cfc002dcd161e05029d0932b587cb20e370f097c/contracts/lendingpool/LendingPool.sol#L401

Typo in description for 1st parameter.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/f98335cb68e95003b114d31b20218e903c1b5b58*


## Smart Contract Deployment Review

The following contracts were deployed as part of Aave protocol v2:

### [LendingPoolAddressesProvider](https://etherscan.io/address/0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5)

This contract is entry point of Aave protocol v2. The constructor was executed with `marketId` parameter `"Aave genesis market"`.

**Bytecode is verified**.

#### Related addresses

* Pool admin
    * [0xbd723fc4f1d737dcfc48a07fe7336766d34cad5f](https://etherscan.io/address/0xbd723fc4f1d737dcfc48a07fe7336766d34cad5f)
    * [0xbb94a575935772d7d8ba78cd33caa64d4fb61d6b](https://etherscan.io/address/0xbb94a575935772d7d8ba78cd33caa64d4fb61d6b)

* Emergency admin
    * [0xbd723fc4f1d737dcfc48a07fe7336766d34cad5f](https://etherscan.io/address/0xbd723fc4f1d737dcfc48a07fe7336766d34cad5f)

* `LendingPool`
    * [0x987115c38fd9fd2aa2c6f1718451d167c13a3186](https://etherscan.io/address/0x987115c38fd9fd2aa2c6f1718451d167c13a3186)

* `LendingPoolConfigurator`
    * [0x3a95ee42f080ff7289c8b4a14eb483a8644d7521](https://etherscan.io/address/0x3a95ee42f080ff7289c8b4a14eb483a8644d7521)

* Aave oracle: 
    * [0xa50ba011c48153de246e5192c8f9258a2ba79ca9](https://etherscan.io/address/0xa50ba011c48153de246e5192c8f9258a2ba79ca9)

* Lending rate oracle:
    * [0x8a32f49ffba88aba6eff96f45d8bd1d4b3f35c7d](https://etherscan.io/address/0x8a32f49ffba88aba6eff96f45d8bd1d4b3f35c7d)

* `LendingPoolCollateralManager`
    * [0xbd4765210d4167ce2a5b87280d9e8ee316d5ec7c](https://etherscan.io/address/0xbd4765210d4167ce2a5b87280d9e8ee316d5ec7c)

### [LendingPool](https://etherscan.io/address/0x987115c38fd9fd2aa2c6f1718451d167c13a3186)


**Bytecode is verified**.

#### Related addresses

* `ValidationLogic`
    * [0xdd6f15b39ca5147ae9b5e6046645d55b0e5baf0c](https://etherscan.io/address/0xdd6f15b39ca5147ae9b5e6046645d55b0e5baf0c)

* `ReserveLogic`
    * [0xdce33de861d200d8da88c751dc00c18eda3251f5](https://etherscan.io/address/0xdce33de861d200d8da88c751dc00c18eda3251f5)

* `GenericLogic`
    * [0x123fba7a76b29547df94dc59933332b751206fdf](https://etherscan.io/address/0x123fba7a76b29547df94dc59933332b751206fdf)


### [LendingPoolConfigurator](https://etherscan.io/address/0x3a95ee42f080ff7289c8b4a14eb483a8644d7521)

**Bytecode is verified**.


### [LendingPoolCollateralManager](https://etherscan.io/address/0xbd4765210d4167ce2a5b87280d9e8ee316d5ec7c)

**Bytecode is verified**.


### [ValidationLogic](https://etherscan.io/address/0xdd6f15b39ca5147ae9b5e6046645d55b0e5baf0c)

**Bytecode is verified**.

### [ReserveLogic](https://etherscan.io/address/0xdce33de861d200d8da88c751dc00c18eda3251f5)

**Bytecode is verified**.

### [GenericLogic](https://etherscan.io/address/0x123fba7a76b29547df94dc59933332b751206fdf)

**Bytecode is verified**.


### Summary

All contracts from the scope of the audit, deployed for Aave protocol v2, are corresponding to code freeze at https://github.com/aave/protocol-v2/tree/750920303e33b66bc29862ea3b85206dda9ce786 and https://gitlab.com/aave-tech/protocol-v2/-/tree/750920303e33b66bc29862ea3b85206dda9ce786.

## CONCLUSION

MixBytes was approached by Aave to provide a security assessment of the second version of the Aave protocol implementation. The whole audit process started on September 16 and ended on December 6, 2020. The audit effort was led by Alexey Makeev. MixBytes additionally engaged an independent highly professional contractor Igor Gulamov. The scope of the audit is listed above. Oracle, treasury, and governance implementations are out of the scope.

The protocol allows end-users to lend and borrow ERC 20 compatible tokens. Moreover, the protocol supports so-called flash loans. That, in its turn, enables several more sophisticated strategies including short selling. Key improvements introduced in the second version include debt tokenization, upgradeability of the protocol tokens, credit delegation, and gas optimizations. Lenders are rewarded with interest paid on their assets. Borrowers pay interest on their debts together with payments to the asset treasury that constitutes fund flow equilibrium for some particular assets. A particular asset in isolation, in essence, is a fractional reserve system managed by an interest rate strategy in an automated way. However, as a whole, the protocol strives to be overcollateralized. Of course, some parameters of reserves, such as liquidation thresholds, are configured externally and may require changes in accordance with the current market conditions for the protocol to stay overcollateralized.

The auditing process consisted of several stages, each of them containing several passes or checks. The scope was reviewed many times from different angles. One of the most time-consuming stages, the blind stage, took more than one month. Some local issues and slips were discovered early during this stage, e.g. bitmask manipulation issues. Crucial protocol properties were also formulated during this stage. Then, during the guided stage, the intended protocol behavior was compared with a reverse-engineered one. We rethought the protocol operations taking into consideration protocol properties. Fund flows were analyzed as well.

Subsequently, about two weeks were devoted to pattern analysis including automated checks and DeFi-specific attack vectors. Since the Aave team was providing fixes in a timely fashion, we checked the code changes shortly after providing an interim report. Although, it still took about two weeks since many checks described above were re-run to guard against newly introduced issues. That paid off a couple of times. Overall, we are impressed by the Aave team's dedication to safe code provision.

Findings list:

Level | Amount
--- | ---
CRITICAL | -
MAJOR | 9
WARNING | 44
COMMENT | 34

No critical issues were found as no way to steal funds was detected. Key areas of found issues can be summarized as follows:

* Bitmask manipulation and some other misses which most likely can be attributed to the work-in-progress state of the audited code revision.

* Several `updateInterestRates` invocation issues can be described as complications of concurrent state update. There was no obvious alternative to such an approach because the Checks-Effects-Interactions pattern was used.

* User flags handling attracted our attention as it is a typical dangerous setup caused by state duplication. A few issues were discovered there.

* Some excess gas usage issues were discovered and further improvement paths were given.

* We highlighted some potential fund flow issues which ultimately have to be mitigated by interest rate strategies and/or code upgrade.

* We suggested implementing as many as possible automated checks of reserve parameters to rule out the human factor.

We see tokenization which allows self-consistent balance updates as a key security factor in the protocol even in the face of reentrancy. Simplicity and limited attack surface contribute to the protocol security as well.

The audit started when the codebase was still undergoing some changes. However, during the last weeks of the audit, the client devoted significant effort to finalize the codebase to the production-ready state. Some challenges imposed by the EVM and the Solidity compiler were faced and solved, one way or another. Some notable practices were employed, e.g. `WadRayMath` library.

We consider the commit [`750920303e33b66bc29862ea3b85206dda9ce786`](https://github.com/aave/protocol-v2/tree/750920303e33b66bc29862ea3b85206dda9ce786) as a safe version from the informational security point of view.

