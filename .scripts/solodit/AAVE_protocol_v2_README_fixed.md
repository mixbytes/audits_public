## Report

### CRITICAL

Not found

### MAJOR

#### Missing Leading 'F' in LIQUIDATION_BONUS_MASK in ReserveConfiguration.sol


##### Description

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L18 

One leading `F` is missing in this mask.

```solidity
uint256 constant LIQUIDATION_BONUS_MASK = 0xFFFFFFF0000FFFFFFFF;
```

This fact results in the corruption of four bits in the reserve factor field during the operations on the liquidation bonus field. `getLiquidationBonus` is also affected.

##### Recommendation

We suggest fixing the mask. We also recommend adding tests for each `ReserveConfiguration` field which have other fields set to some values, perform some actions, restore the field to the original value and make sure that the entire mask is intact.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/5ddd98c52993cbe0093e4a32d14d2aec62939f00*

#### Improper Bit-Length Validation in Reserve Configuration


##### Description

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/configuration/ReserveConfiguration.sol#L46

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

providing a value greater than `65535` as `ltv` will result in a corruption of the liquidation threshold field. 

##### Recommendation
We recommend making sure that passed values fit in the corresponding fields.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b3cc9d1a62464998e512cf337c35a87ab459a360*


#### Erroneous UserBalance Restriction in Withdrawal Validation

##### Description

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L68

It looks like `userBalance` is erroneously used instead of `amount`. This will result in overly strict restrictions on withdrawals. 

##### Recommendation
We suggest replacing the argument.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/b4f8592775f41e9e52e0068b3c531a08d0b8750c*


#### Uninitialized `availableLiquidity` in Loan Size Calculation.
##### Description

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ValidationLogic.sol#L200

The `vars.availableLiquidity` field is not initialized before usage.

```solidity
//calculate the max available loan size in stable rate mode as a percentage of the
//available liquidity
uint256 maxLoanSizeStable = vars.availableLiquidity.percentMul(maxStableLoanPercent);
```
##### Recommendation
Proper initialization should be added.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/3f714b9dc848d28d1753fd8a673038fda4f024ed*


#### Decimals Mismatch in Reserve Configuration Update
##### Description
https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolConfigurator.sol#L533 

Changing the decimals here will not automatically change the decimals either in the aToken or in the debt tokens.

```solidity
function setReserveDecimals(address asset, uint256 decimals) external onlyAaveAdmin {
    ReserveConfiguration.Map memory currentConfig = pool.getConfiguration(asset);

    currentConfig.setDecimals(decimals);

    pool.setConfiguration(asset, currentConfig.data);
```

Additionally, the oracle must be updated simultaneously to consider the new value of the decimals. Otherwise, significant mispricing and liquidations may occur. 
##### Recommendation
We suggest removing this function. Alternatively, the change may be allowed only for inactive reserve and must be propagated to the tokens.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/bfa26634a61347391f5f1251e837c18e2d381c0e*


#### Flawed Stable Debt Calculation Due to Timestamp Mismatch
##### Description
https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/libraries/logic/ReserveLogic.sol#L341-L347 

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
##### Recommendation
One possible solution is to treat `vars.principalStableDebt` as the previous stable debt and update `StableDebtToken`'s `_totalSupply` and `_totalSupplyTimestamp` after the operation.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/276dee4918d1b76b236195e674132fa7d4ba2324*


#### Overestimation of Liquidity in Interest Rate Update.
##### Description
https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPool.sol#L582

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

##### Recommendation

It is recommended to call `updateInterestRates` with `liquidityAdded` set to `0`.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/a2e2450bb351844086f749ee24c005df03bc0e4a*


#### Interest Rate Miscalculation Due to Stale Debt Values
##### Description

https://github.com/aave/protocol-v2/blob/f435b2fa0ac589852ca3dd6ae2b0fbfbc7079d54/contracts/lendingpool/LendingPoolCollateralManager.sol#L227-L232

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

As a result, stale total debt values are used during interest rates calculation. 

##### Recommendation
We suggest switching `updateInterestRates` and the `if` statement.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/c5d7bb5e80e08a7c901cd7bb41b7bb839c2e0f0e*


#### Inaccurate `liquidityAdded` Parameter Before Flashloan Transfer
##### Description

https://github.com/aave/protocol-v2/blob/56d25e81cb0fdfcac785d669d3577b1ef2d9286e/contracts/lendingpool/LendingPool.sol#L511

The `liquidityAdded` parameter of the `updateInterestRates` call seems to be incorrect as the flashloan body is yet to be transferred thus it will not be included in the interest rates calculation.

##### Recommendation

It is recommended to fix the `liquidityAdded` parameter.

##### Status
*Fixed at https://github.com/aave/protocol-v2/commit/584a567635ad4817c7ef105304d62f25158eb120*

