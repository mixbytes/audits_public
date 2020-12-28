![](MixBytes.png)

# PieDAO VestedTokenMigration and Crust Smart Contracts Audit

## Introduction

### General Provisions
PieDAO is an asset allocation DAO for decentralized market-weighted portfolio allocations.

MixBytes was approached by PieDAO (https://piedao.org/) to provide a security assessment of a part of vested token migration and "Crust" token contracts.


### Scope of the Audit

The scope of the audit includes smart contracts at 

https://github.com/pie-dao/vested-token-migration-app/blob/916cb1a92374699eb868044d0119112baa5c15e5/contracts/

https://github.com/pie-dao/pie-crust/tree/e91bcd86007f0c3423a37ea63b730edd0bd800dc/contracts.


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
* Checking the code compliance to customer requirements 
* Discussion of independent audit results
* Report preparation


## Detected Issues

### CRITICAL

Not found


### MAJOR

1\. [VestedTokenMigration.sol#L91](https://github.com/pie-dao/vested-token-migration-app/blob/916cb1a92374699eb868044d0119112baa5c15e5/contracts/VestedTokenMigration.sol#L91)

The return value can incorrectly excess `_amount` that will result in redundant token migration (more than `_windowAmount`). The statement [VestedTokenMigration.sol#L72](https://github.com/pie-dao/vested-token-migration-app/blob/916cb1a92374699eb868044d0119112baa5c15e5/contracts/VestedTokenMigration.sol#L72) won’t help because it was applied too late - after subtracting `amountMigratedFromWindow[leaf]`. It means that several transactions of `_amount` less or equal to `_windowAmount` will succeed.

Proof of concept: https://gist.github.com/Eenae/dc83467d4adb6c8667c768af1bd0b0b4

The code simulates a moment  way ahead of  `windowVestingEnd`. After deployment of the Test contract in Remix we’ll be able to make several `migrateVested` calls with the `_amount` equal to 100 from the same account. Each call will emit a `Migrated` event with the `_migratedAmount` equal to 100, meaning that the migration was successful and the tokens were minted.
Also note that `amountMigratedFromWindow` will yield a value greater than 100 after the second migration.

The issue is not marked as critical since actual over-migration of tokens is unlikely thanks to  burning of existing tokens here [VestedTokenMigration.sol#L76](https://github.com/pie-dao/vested-token-migration-app/blob/916cb1a92374699eb868044d0119112baa5c15e5/contracts/VestedTokenMigration.sol#L76).

We suggest adding an `if (_time >= _vestingEnd) return _amount;` statement to the `calcVestedAmount` function. Also, the line [VestedTokenMigration.sol#L72](https://github.com/pie-dao/vested-token-migration-app/blob/916cb1a92374699eb868044d0119112baa5c15e5/contracts/VestedTokenMigration.sol#L72) will become obsolete.

*Fixed at [2ebb401](https://github.com/pie-dao/vested-token-migration-app/commit/2ebb4013ba4579dd79ac94d10912151135d916a8)*



### WARNINGS

1\. [Crust.sol#L67](https://github.com/pie-dao/pie-crust/blob/e91bcd86007f0c3423a37ea63b730edd0bd800dc/contracts/Crust.sol#L67) 
[Crust.sol#L87](https://github.com/pie-dao/pie-crust/blob/e91bcd86007f0c3423a37ea63b730edd0bd800dc/contracts/Crust.sol#L87) 

Differences in the `crumbs` decimals are not taken into account during summation. Moreover, `decimals` of the `Crust` can be arbitrary, that, in turn, can lead to the `crumbs` token domination over the entire `Crust`.

Take two tokens T1 and T2 as an example. Let `T1.decimals = 10`, `T2.decimals = 4` and `Crust.decimals = 10`. Addinging 1 full token of T1 to 1 full token of T2 will give `uint256: 10000010000` that is roughly equal to 1 full Crust token, i.e. T2 contribution was almost ignored. Please note that the current solution doesn't implement the stated objective "each token has the same weight", quite the opposite. Decimal field values are implementation details and should not influence the outcome.

To achieve the stated objectives and get the `crumbs` to the same scale, we suggest using linear normalization technique.

`Crust.decimals` should be computed as `max(Ti.decimals())` for each token `i` in the `crumbs`.

Any sum of balances should be calculated as `sum(Ti.balance * (uint256(10) ** (Crust.decimals() - Ti.decimals())))` for each token `i` in the `crumbs`.

After normalization, our example will result in `1e10 * 10**(10-10) + 1e4 * 10**(10-4) = 2e10`, i.e. 2 full Crust tokens.

*Fixed at [f2400b5](https://github.com/pie-dao/pie-crust/commit/f2400b5422e1ad4fb45253a6f0ff4ea9102cf0af)*

### COMMENTS

1\. [VestedTokenMigration.sol#L69](https://github.com/pie-dao/vested-token-migration-app/blob/916cb1a92374699eb868044d0119112baa5c15e5/contracts/VestedTokenMigration.sol#L69)

We suggest returning zero from the function as soon as `migrateAmount` equals zero.

*Fixed at [2ebb401](https://github.com/pie-dao/vested-token-migration-app/commit/2ebb4013ba4579dd79ac94d10912151135d916a8)*

2\. [VestedTokenMigration.sol#L74](https://github.com/pie-dao/vested-token-migration-app/blob/916cb1a92374699eb868044d0119112baa5c15e5/contracts/VestedTokenMigration.sol#L74)

An assertion `assert(amountMigratedFromWindow[leaf] <= _windowAmount);` could be added.

*Fixed at [2ebb401](https://github.com/pie-dao/vested-token-migration-app/commit/2ebb4013ba4579dd79ac94d10912151135d916a8)*

3\. [VestedTokenMigration.sol#L43](https://github.com/pie-dao/vested-token-migration-app/blob/916cb1a92374699eb868044d0119112baa5c15e5/contracts/VestedTokenMigration.sol#L43)

It’s allowed to change the already set merkle root. Make sure that this is desired behaviour.

*Acknowledged*

4\. [VestedTokenMigration.sol#L88](https://github.com/pie-dao/vested-token-migration-app/blob/916cb1a92374699eb868044d0119112baa5c15e5/contracts/VestedTokenMigration.sol#L88)

We recommend adding a strict check `_vestingStart < _vestingEnd` here to ensure that the function always works with the correct input that in turn will reduce the number of input data invariants.

*Fixed at [2ebb401](https://github.com/pie-dao/vested-token-migration-app/commit/2ebb4013ba4579dd79ac94d10912151135d916a8)*

5\. [VestedTokenMigration.sol#L30](https://github.com/pie-dao/vested-token-migration-app/blob/916cb1a92374699eb868044d0119112baa5c15e5/contracts/VestedTokenMigration.sol#L30)
[VestedTokenMigration.sol#L42](https://github.com/pie-dao/vested-token-migration-app/blob/916cb1a92374699eb868044d0119112baa5c15e5/contracts/VestedTokenMigration.sol#L42)
[Crust.sol#L18](https://github.com/pie-dao/pie-crust/blob/e91bcd86007f0c3423a37ea63b730edd0bd800dc/contracts/Crust.sol#L18) 

We recommend introducing a check to ensure the parameters are not equal to zero.

*Fixed at [cce403c](https://github.com/pie-dao/vested-token-migration-app/commit/cce403c8e9f7792c6ad8754b23b2346a784836b9)*


6\. [Crust.sol#L25-L47](https://github.com/pie-dao/pie-crust/blob/e91bcd86007f0c3423a37ea63b730edd0bd800dc/contracts/Crust.sol#L25-L47)

For each public state variable an automatic getter function is generated. This means getters for name, symbol and decimals may be removed. See https://solidity.readthedocs.io/en/v0.4.22/contracts.html#getter-functions for details

*Fixed at [c2fbe8f](https://github.com/pie-dao/pie-crust/commit/c2fbe8fefb8dbb0eedd552ec770851dcf78ea243)*


## CONCLUSION

Provided smart contracts were audited and several troublesome issues were identified:
 - no critical issues
 - 1 major issue
 - and also several recomendational comments

All issues were fixed and following commits don't have any vulnerabilities according to our analysis:
 - https://github.com/pie-dao/vested-token-migration-app/commit/779a9e1f7636df675323034a8196f430c5a91102
 - https://github.com/pie-dao/pie-crust/commit/f2400b5422e1ad4fb45253a6f0ff4ea9102cf0af