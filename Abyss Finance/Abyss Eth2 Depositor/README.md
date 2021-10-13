# AbyssEth2Depositor Security Audit Report (merged)

###### tags: `Abyss`

## Introduction

### Project overview
Smart contract that allows convenient way to send 1 to 100 deposits in one transaction to Eth2 Deposit Contract.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/abyssfinance/abyss-eth2depositor/blob/a2d58dea4d79846dc682fe93ac3e0eca02323d11/contracts/AbyssEth2Depositor.sol

The audited commit identifier is `a2d58dea4d79846dc682fe93ac3e0eca02323d11`

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

#### 1. Absent ETH2 depositor BLS signature parameters check
##### Description
This warning is about the function `deposit` in here: https://github.com/abyssfinance/abyss-eth2depositor/blob/a2d58dea4d79846dc682fe93ac3e0eca02323d11/contracts/AbyssEth2Depositor.sol#L61 having inputs for a pretty complicated cryptographic primitive (BLS12-381 with switched G1 and G2 groups inside) with no checks for their correctness at all.

This can result in faulty signatures, public keys and withdrawal credentials to be submitted which will lead to the loss of withdrawal possibility later.

##### Recommendation
It is recommended to implement following checks (according to Ethereum usage of variant 2 of: https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-bls-signature-04#section-2.1):
* Signature length to be equal to 96 bytes.
* Public key length to be equal to 48 bytes.
* Withdrawal credentials, in case they are supposed to be aggregatable public
    keys, each of them should be equal to 32 bytes.

##### Status
Fixed at https://github.com/abyssfinance/abyss-eth2depositor/commit/a36365f6a9389f429965048fb50e3a7cb5f34005


#### 2. Reentrant ETH2 depositor function
##### Description
This warning is about the function `deposit` (https://github.com/abyssfinance/abyss-eth2depositor/blob/a2d58dea4d79846dc682fe93ac3e0eca02323d11/contracts/AbyssEth2Depositor.sol#L61) being possibly reentrant in here: https://github.com/abyssfinance/abyss-eth2depositor/blob/a2d58dea4d79846dc682fe93ac3e0eca02323d11/contracts/AbyssEth2Depositor.sol#L80.

This can lead to unpredictable deposits chain initially not supposed to be done by the application logic.

##### Recommendation
It is recommended to introduce `nonReentrant` modifier, bringing it from
(probably) OpenZeppelin's implementation in here: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/ReentrancyGuard.sol.

##### Status
Fixed at https://github.com/abyssfinance/abyss-eth2depositor/commit/a36365f6a9389f429965048fb50e3a7cb5f34005



### COMMENTS
#### 1. ETH2 depositor argument design consideration
##### Description
This comment is about absence of possibility to check the correctness of the SHA2-256 hash being passed as a parameter `deposit_data_roots` to the `deposit` function in here: https://github.com/abyssfinance/abyss-eth2depositor/blob/a2d58dea4d79846dc682fe93ac3e0eca02323d11/contracts/AbyssEth2Depositor.sol#L61.

##### Recommendation
Since the internal structure of data being hashed makes sense, it is better to use some ZK-proof (with Zookrates possibly?), which will bring the possibility to verify the correctness of the input data without having the actual data present.

##### Status
No issue

## Results

### Findings list
Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 0
WARNING | 2
COMMENT | 1

### Executive summary
The audited scope includes smart contract that allows users to stake their Ethereum assets to Ethereum v2 deposit contract.

### Conclusion
Smart contracts have been audited and no critical or major issues were found, several recommendations were marked as warning and comment. During work on audit report all issues were fixed or acknowledged by client, so contracts assumed as secure to use according our security criteria. Final commit identifier with all fixes: `179ff88f713885aca2aca5defb5e4e0a74ee02f1`. Deployed contract address: [0xFA5f9EAa65FFb2A75de092eB7f3fc84FC86B5b18](https://etherscan.io/address/0xFA5f9EAa65FFb2A75de092eB7f3fc84FC86B5b18).