![](MixBytes.png)

# Akropolis Vesting Smart Contract Audit

## Introduction

### General Provisions

Akropolis team asked MixBytes to audit their vesting smart contracts. The code was located in the following github repository: https://github.com/akropolisio/akropolis-vesting.

### Audit scope

The scope of the audit is smart contracts at https://github.com/akropolisio/akropolis-vesting/tree/7f4f4543b08d3749b92839c85e1d77a33d917a37/contracts.
The audited commit is 7f4f4543b08d3749b92839c85e1d77a33d917a37.


## Security Assessment Principles

### Classification of Issues

* CRITICAL: Bugs leading to cryptocurrency or token theft, fund access locking or any other loss of cryptocurrency/tokens to be transferred to any party (for example, dividends). 

* MAJOR: Bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement. 

* WARNINGS: Bugs that can break the intended contract logic or expose it to DoS attacks. 

* COMMENTS: Other issues and recommendations reported to/ acknowledged by the team.


### Security Assessment Methodology

Three auditors independently verified the code.

Audit stages were as follows:

* “Blind” manual check of the code and its model 
* “Guided” manual code review
* Checking the code compliance with customer requirements 
* Automated security analysis using the internal solidity security checker
* Automated security analysis using public analyzers
* Manual checklist system inspection
* Discussion of independent audit results
* Report preparation


## Detected Issues

### CRITICAL

1.https://github.com/akropolisio/akropolis-vesting/blob/7f4f4543b08d3749b92839c85e1d77a33d917a37/contracts/openzeppelin/TokenTimelock.sol#L48

Public read-write access to the beneficiary is without any restrictions.
Solution:
We suggest making `TokenTimelock.changeBeneficiary` internal.

Fixed at 18474eabd96a6dda2abb39e90493d95e2cb5da9a

### MAJOR

1.https://github.com/akropolisio/akropolis-vesting/blob/7f4f4543b08d3749b92839c85e1d77a33d917a37/contracts/logics/AkropolisTimeLock.sol#L34

The `changeBeneficiary` method of `TokenTimelock.sol` was incorrectly overridden in `AkropolisTimeLock.sol` that results in an infinite recursive call.
Solution:
We recommend using `super.changeBeneficiary(_newBeneficiary);` or making a base method `internal` and call it this way: `_changeBeneficiary(_newBeneficiary);`.

Fixed at 18474eabd96a6dda2abb39e90493d95e2cb5da9a

2.https://github.com/akropolisio/akropolis-vesting/blob/7f4f4543b08d3749b92839c85e1d77a33d917a37/contracts/logics/AkropolisVesting.sol#L40

The contract tries to override a non-existing `changeBeneficiary` method of the parent `TokenVesting.sol` that results in an infinite recursive call.
Solution:
If the `changeBeneficiary` method is essential, we recommend trying out the solution described in Major issue #1 section.

Fixed at 18474eabd96a6dda2abb39e90493d95e2cb5da9a

3.https://github.com/akropolisio/akropolis-vesting/blob/7f4f4543b08d3749b92839c85e1d77a33d917a37/contracts/proxy/TimelockProxy.sol#L18 ,
https://github.com/akropolisio/akropolis-vesting/blob/7f4f4543b08d3749b92839c85e1d77a33d917a37/contracts/proxy/TokenVestingProxy.sol#L18

Upgradability operation is broken. Most contract methods are not upgradable because they are handled by the proxy itself. This was caused by the inclusion of `TokenVesting` and `TokenTimelock` into proxy contracts.

Solution:
We suggest rewriting upgradability. A proxy contract should not have any fields but contain methods related to proxy operation. Initialization of a proxy should be conducted using the second argument of the `UpgradabilityProxy` constructor.

Removed at 18474eabd96a6dda2abb39e90493d95e2cb5da9a


### WARNING

1.https://github.com/akropolisio/akropolis-vesting/blob/7f4f4543b08d3749b92839c85e1d77a33d917a37/contracts/logics/AkropolisVesting.sol#L33 ,
https://github.com/akropolisio/akropolis-vesting/blob/7f4f4543b08d3749b92839c85e1d77a33d917a37/contracts/logics/AkropolisTimeLock.sol#L27

Comment why index 1 was used: `changeBeneficiary(beneficiaries[1]);`. Make sure it is correct.
Solution:
Try using the first element (at index `0`) as an alternative.

Fixed at 18474eabd96a6dda2abb39e90493d95e2cb5da9a

2.https://github.com/akropolisio/akropolis-vesting/blob/7f4f4543b08d3749b92839c85e1d77a33d917a37/contracts/helpers/BeneficiaryOperations.sol#L141

Nested call logic is not working if there are two or more consistent nested calls.
Solution:
We recommend using a stack of calls.


### COMMENT

1. Proxy-ready versions of OpenZeppelin smart contracts with `initialize` method instead of `constructor` may be used:

https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/blob/master/contracts/token/ERC20/TokenTimelock.sol
https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/blob/master/contracts/drafts/TokenVesting.sol

Removed at 18474eabd96a6dda2abb39e90493d95e2cb5da9a

2.`BeneficiaryOperations.sol`
`bereficiarys` should be replaced with `bereficiaries`, the event name should be capitalized. `Ship` inside the event name and throughout the code should be decapitalized:

```
event beneficiaryShipTransferred(
    address[] previousbeneficiaries,
    uint howManyBeneficiariesDecide,
    address[] newBeneficiarys,
    uint newHowManybeneficiarysDecide
);
```

3.`BeneficiaryOperations.sol`

Since the smart contract is a slightly modified version of the [Multiownable smart contract](https://github.com/bitclave/Multiownable/blob/master/contracts/Multiownable.sol), some comments about logic changes could be added: https://www.diffchecker.com/KDsfgVmt. 

4.`BeneficiaryOperations.sol`

No need to implement `function beneficiaryIndices(address wallet) public view returns(uint256)`, since there is a public member `mapping(address => uint) public beneficiariesIndices;` which leads to automatic generation of such public getter by Solidity compiler.

Fixed at 18474eabd96a6dda2abb39e90493d95e2cb5da9a

5.`TokenVesting.sol`

OpenZeppelin-solidity TokenVesting can be imported from: https://www.diffchecker.com/aJPz04bc 
Please note that the developer might have forgotten to implement `changeBeneficiary`(see the major issue #2).

6.https://github.com/akropolisio/akropolis-vesting/blob/7f4f4543b08d3749b92839c85e1d77a33d917a37/contracts/helpers/BeneficiaryOperations.sol#L73

Multisig wallets with offchain signature aggregation or sidechain signature aggregation can be used instead of unoptimized logic of onlyManyBeneficiaries. Here is a good example: https://programtheblockchain.com/posts/2018/07/11/writing-a-trivial-multisig-wallet/.






### CONCLUSION

We recommend rewriting the upgradability initialization code and conduct a full-scale testing of smart contract logic. We also suggest working out regression tests for the issues described above. 

We recommend replacing the `TokenTimelock.sol` and `TokenVesting.sol` smart contracts with the ones implemented in the `openzeppelin-eth` library.

We suggest creating a separate multisig contract and making it the `owner` of the timelock and vesting contracts. The original `Multiownable` library better suits for the advanced multisig smart contracts development.

Major and critical issues are fixed at 18474eabd96a6dda2abb39e90493d95e2cb5da9a. This version is recommended to deploy at mainnet.
