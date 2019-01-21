![](MixBytes.png)

# Audit of Acropolis Token Sale Contracts

## Introduction

### General Provisions

The Acropolis team asked [MixBytes](https://mixbytes.io) to audit their token sale contracts. The code was located in the hidden github repository. 

### Scope of the Audit

The primary scope of the audit is smart contracts at https://github.com/akropolisio/AkropolisToken/tree/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts. The scope is limited to contracts which are used in migrations at https://github.com/akropolisio/AkropolisToken/tree/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/migrations. Audited commit is 3ad8eaa6f2849dceb125c8c614d5d61e90d465a2.


## Security Assessment Principles

### Classification of Issues

* CRITICAL: Bugs that enable theft of ether/tokens, lock access to funds without possibility to restore it, or lead to any other loss of ether/tokens to be transferred to any party (for example, dividends).

* MAJOR: Bugs that can trigger a contract failure, with further recovery only possible through manual modification of the contract state or contract replacement altogether.

* WARNINGS: Bugs that can break the intended contract logic or enable a DoS attack on the contract.

* COMMENTS: All other issues and recommendations.

### Security Assessment Methodology

The audit was performed with triple redundancy by three auditors.

Stages of the audit were as follows:



* “Blind” manual check of the code and model behind the code
* “Guided” manual check of the code
* Check of adherence of the code to requirements of the client
* Automated security analysis using internal solidity security checker
* Automated security analysis using public analysers
* Manual by-checklist inspection of the system
* Discussion and merge of independent audit results
* Report execution


## Detected Issues

### CRITICAL
 
None found
 
### MAJOR
 
##### 1. Collision of storage layouts of TokenProxy and AkropolisToken
 
The problem is illustrated by the `test/TestProxySlotCollision.js` (works for commit 3ad8eaa6f2849dceb125c8c614d5d61e90d465a2).
 
As can be shown, a collision is almost completely avoided because `paused` and `locked` flags were packed by the solidity compiler and don't collide with other fields, as well as the slot for whitelist not being used (because mappings are implemented in such way). But there is collision of `bool whitelisted` and `decimals` fields.
 
A simple solution is to use "unique" slot locations for each field (except shared base contract fields) derived via `keccak256`, for example: https://github.com/poanetwork/poa-network-consensus-contracts/blob/0c175cb98dac52201342f4e5e617f89a184dd467/contracts/KeysManager.sol#L185.
In this case we also recommend that the contract name into hash function invocation is included, and the use of `abi.encode` in place of `abi.encodePacked`, like this: `uintStorage[keccak256(abi.encode("TokenProxy", "decimals"))] = decimals`.
 
Fixed in [79565a3](https://github.com/akropolisio/AkropolisToken/commit/79565a351c74d7fc668ef96927a68876521e37df)
 
### WARNING
 
##### 1. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/helpers/Lockable.sol#L25
 
A variable is named inversely to its value, meaning “unlocked” is to be expected in this case. Normally variable names are not a critical issue, but in this case as a result of code modifications during maintenance, it may lead to logic reversal.
 
Fixed in [28a4153](https://github.com/akropolisio/AkropolisToken/commit/28a415392489a1a88073c3d0fd22b141f4d3170e)
 
##### 2. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/AkropolisToken.sol#L41
 
The result of a function call from the base contract is ignored and the result is always returned as `false`. Any users of the “AkropolisToken” contract (including other smart-contracts) who check the result of the function, will consider calls to have failed. Most likely, the following piece of code is missing `return super.approve(...)`.
 
Fixed in [7dee846](https://github.com/akropolisio/AkropolisToken/commit/7dee8462095656f0bc70617692568180bf2d8f47)
 
##### 3. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/AkropolisToken.sol#L75
 
The result of a function call from the base contract is ignored and the result is always returned as `false`. Any users of the “AkropolisToken” contract (including other smart-contracts) who check the result of the function will consider calls to have failed. Most likely, the following piece of code is missing `return super.transfer(...)`.
 
Fixed in [7dee846](https://github.com/akropolisio/AkropolisToken/commit/7dee8462095656f0bc70617692568180bf2d8f47)
 
##### 4. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/AkropolisToken.sol#L92

The result of a function call from the base contract is ignored and the result is always returned as `false`. Any users of the “AkropolisToken” contract (including other smart-contracts) who check the result of the function, will consider calls to have failed. It appears that the following piece of code is missing `return super.transferFrom(...)`.
 
Fixed in [7dee846](https://github.com/akropolisio/AkropolisToken/commit/7dee8462095656f0bc70617692568180bf2d8f47)
 
##### 5. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/AkropolisToken.sol#L11
 
The `approve` function is not disabled by default, contrary to what the comment claims. Moreover, there is a contradiction with [this commentary](https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/AkropolisToken.sol#L36) - the `approve` function is not blocked by a designated mechanism or a flag. It’s allowed by the common pause mechanism, also implemented for the following functions: `increaseApproval`, `decreaseApproval`, `transfer`, `transferFrom`. Modifier `whenUnlocked` is removed in the following commit
[434aab](https://github.com/akropolisio/AkropolisToken/commit/434aab02463cdf7a0a8a2b0f025186168d6c8549).
 
Fixed in [28a4153](https://github.com/akropolisio/AkropolisToken/commit/28a415392489a1a88073c3d0fd22b141f4d3170e)
 
### COMMENT
 
##### 1. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/upgradeability/DelayedUpgradeabilityProxy.sol#L17
 
We recommend declaring `UPGRADE_DELAY` as `constant`. This will prevent unintended modifications and save gas.
 
##### 2. Solidity 0.5
 
We recommend updating the compiler to version 0.5 or newer, as it includes error fixes and a lot of smaller tweaks and checks, facilitating safe code writing.
 


## CONCLUSION

The use of proxy-contracts mechanism in Solidity and EVM has its risks. We detected and suggested a fix to a problem that arose in connection with it. A number of minor issues were also addressed. The rest of the code is well-structured and written perfectly.
The version https://github.com/akropolisio/AkropolisToken/tree/c52f938296e37716432265655528175b748df174 (development branch) doesn’t have any vulnerabilities or weak spots according to our analysis.

