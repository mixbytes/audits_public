![](MixBytes.png)

# Roobee Token Smart Contract Audit

## Introduction

### General Provisions

The Roobee team asked MixBytes team to audit their token smart contract. The code was located in the following github repository: https://github.com/roobee-platform.

### Scope of the Audit

The scope of the audit are smart contracts at https://github.com/roobee-platform/Roobee/tree/12ff7eb423aedf426c8e1389a686ace0eda2eddb/contracts.
Audited commit is 12ff7eb423aedf426c8e1389a686ace0eda2eddb.


## Security Assessment Principles

### Classification of Issues

* CRITICAL: Bugs leading to Ether or token theft, fund access locking or any other loss of Ether/tokens to be transferred to any party (for example, dividends). 

* MAJOR: Bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement. 

* WARNINGS: Bugs that can break the intended contract logic or expose it to DoS attacks. 

* COMMENTS: Other issues and recommendations reported to/ acknowledged by the team.


### Security Assessment Methodology

Three auditors independently verified the code.

Stages of the audit were as follows:

* “Blind” manual check of the code and its model 
* “Guided” manual code review
* Checking the code compliance to customer requirements 
* Automated security analysis using internal solidity security checker
* Automated security analysis using public analyzers
* Manual checklist system inspection
* Discussion of independent audit results
* Report preparation


## Detected Issues

### CRITICAL

None found.


### MAJOR

None found.


### WARNING

1.[Roobee.sol:336](https://github.com/roobee-platform/Roobee/blob/12ff7eb423aedf426c8e1389a686ace0eda2eddb/contracts/Roobee.sol#L336)

Here and further on: there is a minimal risk that the compiler optimizer will reject the entire string despite the presence of the side effect (revert), since the result is not used. The compiler is still young and under active development as evidenced by major version zero.
We do not recommend using this construction. Instead, it is better to explicitly write `require (getAvailableBalance (msg.sender)> = value)`.

*Fixed in
[16431b1](https://github.com/roobee-platform/Roobee/commit/16431b13ca376a8ad5375b49cacc2d71a1029040).*

2.[Roobee.sol:371](https://github.com/roobee-platform/Roobee/blob/12ff7eb423aedf426c8e1389a686ace0eda2eddb/contracts/Roobee.sol#L371)

After `approvalFallback` execution, the allowance that the` _spender` had before calling the `approveAndCall` function will not be returned to its original value. Potentially, this enables `_spender` not to spend tokens immediately and not to perform the operation requested in` _extraData`, but to write off the tokens later, using the remaining allowance.
We recommend returning the allowance for` _spender` to its original value before ending the `approveAndCall` function.

*Acknowledged.*

3.[Roobee.sol:268-269](https://github.com/roobee-platform/Roobee/blob/12ff7eb423aedf426c8e1389a686ace0eda2eddb/contracts/Roobee.sol#L268-L269)

Token `name` and` symbol` differ from those stated in the [documentation] (https://github.com/roobee-platform/Roobee/blob/12ff7eb423aedf426c8e1389a686ace0eda2eddb/README.md#roobee) by the case of characters.

* Fixed in
[5eb2b41](https://github.com/roobee-platform/Roobee/commit/5eb2b41159de6b2693cc97a50bf3bb9efba2d66b).*

4.[Roobee.sol:316](https://github.com/roobee-platform/Roobee/blob/12ff7eb423aedf426c8e1389a686ace0eda2eddb/contracts/Roobee.sol#L316)

We recommend adding a check that the `_unfreezeTimestamp` value does not exceed reasonable limits.

*Acknowledged.*


### COMMENT

1.[Roobee.sol:294](https://github.com/roobee-platform/Roobee/blob/12ff7eb423aedf426c8e1389a686ace0eda2eddb/contracts/Roobee.sol#L294)

In case the user executes `_subsequentUnlock`, then when the time reaches ` _unfreezeTimestamp`, all user tokens will still remain frozen for 30 days.

2.[Roobee.sol:357](https://github.com/roobee-platform/Roobee/blob/12ff7eb423aedf426c8e1389a686ace0eda2eddb/contracts/Roobee.sol#L357)

The previous allowance value of `_spender` will be reset at this point.

3.[Roobee.sol:280](https://github.com/roobee-platform/Roobee/blob/12ff7eb423aedf426c8e1389a686ace0eda2eddb/contracts/Roobee.sol#L280)

We recommend using `decimals` instead of duplicating` 1e18`.


## CONCLUSION

We haven’t identified any high risk vulnerabilities in the audited smart contracts. Overall code quality is on a high level. We suggested some corrections and code optimization solutions.
As of commit [16431b1](https://github.com/roobee-platform/Roobee/tree/16431b13ca376a8ad5375b49cacc2d71a1029040/contracts), no issues were identified in the smart contract code.
