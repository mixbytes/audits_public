![](MixBytes.png)

# Empower the DAO Smart Contract Audit Report

## Introduction

## General provisions

Empower the DAO team is working on integrating Aragon with a number of well-known Ethereum-based projects and their communities, aiming to deliver real business value for end users.
With this in mind, [MixBytes](https://mixbytes.io) team is willing to contribute to Empower the DAO initiatives by providing security assessment of the Compound, Uniswap and ENS smart contracts and their dependencies.

## Scope of the audit

The scope of the audit included:

https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol  

https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/lib/AddressArrayUtils.sol  

https://github.com/empowerthedao/uniswap-aragon-app/blob/9b482ac5d59727f2e3c32a0d90307eec6c493af1/uniswap-aragon-app/contracts/Uniswap.sol  

https://github.com/empowerthedao/uniswap-aragon-app/blob/9b482ac5d59727f2e3c32a0d90307eec6c493af1/uniswap-aragon-app/contracts/lib/AddressArrayUtils.sol     

https://github.com/empowerthedao/ens-aragon-app/blob/15dc957769c028a5b1fbc7aa8b27cdbc896316c4/ens-aragon-app/contracts/EnsApp.sol


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

Not found


### MAJOR
Not found

### WARNINGS

##### 1. https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol#L131
https://github.com/empowerthedao/uniswap-aragon-app/blob/9b482ac5d59727f2e3c32a0d90307eec6c493af1/uniswap-aragon-app/contracts/Uniswap.sol#L143

It is possible to transfer more Ether to the `agent` balance than it was transferred via the `deposit` call (`msg.value`). Moreover, the access to this feature is not limited in any way. We recommend that you prohibit this behavior and require `_value == msg.value` in the case of `_token == ETH`.

*Fixed at https://github.com/empowerthedao/compound-aragon-app/blob/ebef91a42914cfaee8e64423306ce8c7d3157b3e/compound-aragon-app/contracts/Compound.sol and 
https://github.com/empowerthedao/uniswap-aragon-app/blob/0c097247cbed0aaaba666ef99df346b7b3cb3b7d/uniswap-aragon-app/contracts/Uniswap.sol*

##### 2. https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol#L87

After this call tokens that were minted using the previous `agent` will be unavailable. We suggest making sure that all the tokens minted using the previous `agent` were redeemed. 

*Fixed at https://github.com/empowerthedao/compound-aragon-app/blob/ebef91a42914cfaee8e64423306ce8c7d3157b3e/compound-aragon-app/contracts/Compound.sol*

##### 3. https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol#L112

After this call tokens that were minted using `_cErc20` will be unavailable. We advise verifying that all the token minted via the passed `_cErc20` were redeemed. 

*Fixed at https://github.com/empowerthedao/compound-aragon-app/blob/ebef91a42914cfaee8e64423306ce8c7d3157b3e/compound-aragon-app/contracts/Compound.sol*

##### 4. https://github.com/empowerthedao/uniswap-aragon-app/blob/9b482ac5d59727f2e3c32a0d90307eec6c493af1/uniswap-aragon-app/contracts/Uniswap.sol#L202

If the `tokenToEthSwapInput` call result is less than the `_minEthAmount` value, annule the token approval or roll back the transaction. Therefore, if the deal fails, the exchange contract will not be able to withdraw tokens afterwards. The Uniswap documentation does not state that the transaction will be rolled back in case of a failed deal.

*Fixed at https://github.com/empowerthedao/uniswap-aragon-app/blob/0c097247cbed0aaaba666ef99df346b7b3cb3b7d/uniswap-aragon-app/contracts/Uniswap.sol*

### COMMENTS

##### 1. https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol#L129

Supporting Ether transfer to the `agent` is irrelevant as working with `CEther` is not supported. 

##### 2. https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol#L68-L70
https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol#L97-L101 

General token validation code (and `Agent`, perhaps) should be moved to a separate internal method. 

##### 3. https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol#L166
https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol#L179

We suggest adding informative parameters to the events.

##### 4. General code

The `deposit`, `transfer`, and the `enabledTokens` array control functions can be moved to a `compound-aragon-app` and `uniswap-aragon-app` base contract.

##### 5. https://github.com/empowerthedao/ens-aragon-app/blob/15dc957769c028a5b1fbc7aa8b27cdbc896316c4/ens-aragon-app/contracts/EnsApp.sol#L76

The comment must have been copied from the `setAgent` function and should be corrected.

##### 6. https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol#L119
https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol#L213
https://github.com/empowerthedao/uniswap-aragon-app/blob/9b482ac5d59727f2e3c32a0d90307eec6c493af1/uniswap-aragon-app/contracts/Uniswap.sol#L131

We recommend adding the `isInitialized` modifier.

##### 7. https://github.com/empowerthedao/uniswap-aragon-app/blob/9b482ac5d59727f2e3c32a0d90307eec6c493af1/uniswap-aragon-app/contracts/Uniswap.sol#L68
https://github.com/empowerthedao/uniswap-aragon-app/blob/9b482ac5d59727f2e3c32a0d90307eec6c493af1/uniswap-aragon-app/contracts/Uniswap.sol#L69

The `ERROR_NOT_CONTRACT` revert reason is not informative enough as it is unclear to which address it is related. We suggest creating separate revert reasons for `Agent` and `UniswapFactoryInterface`.

##### 8. https://github.com/empowerthedao/uniswap-aragon-app/blob/9b482ac5d59727f2e3c32a0d90307eec6c493af1/uniswap-aragon-app/contracts/Uniswap.sol#L175
https://github.com/empowerthedao/uniswap-aragon-app/blob/9b482ac5d59727f2e3c32a0d90307eec6c493af1/uniswap-aragon-app/contracts/Uniswap.sol#L196

Exchange check should be moved to a modifier. 

##### 9. https://github.com/empowerthedao/uniswap-aragon-app/blob/9b482ac5d59727f2e3c32a0d90307eec6c493af1/uniswap-aragon-app/contracts/Uniswap.sol#L34
https://github.com/empowerthedao/compound-aragon-app/blob/b496ca40525a788bdc50f0dcc62bca48e86b6d36/compound-aragon-app/contracts/Compound.sol#L32 

The constant is not used and can be removed.


## CONCLUSION

Overall code quality is above average. Attention must be paid to excessive Ether transfer to the `Agent` and temporary access lock to the funds sent to Compound. Also, code support can be facilitated by moving the general code to a base contract.
The contracts

https://github.com/empowerthedao/compound-aragon-app/blob/ebef91a42914cfaee8e64423306ce8c7d3157b3e/compound-aragon-app/contracts/Compound.sol

https://github.com/empowerthedao/compound-aragon-app/blob/ebef91a42914cfaee8e64423306ce8c7d3157b3e/compound-aragon-app/contracts/lib/AddressArrayUtils.sol

https://github.com/empowerthedao/uniswap-aragon-app/blob/0c097247cbed0aaaba666ef99df346b7b3cb3b7d/uniswap-aragon-app/contracts/Uniswap.sol 

https://github.com/empowerthedao/uniswap-aragon-app/blob/0c097247cbed0aaaba666ef99df346b7b3cb3b7d/uniswap-aragon-app/contracts/lib/AddressArrayUtils.sol 

https://github.com/empowerthedao/ens-aragon-app/blob/cb28347db70c830485a4405fea2eaf2b10067780/ens-aragon-app/contracts/EnsApp.sol

don’t have any vulnerabilities according to our analysis.
