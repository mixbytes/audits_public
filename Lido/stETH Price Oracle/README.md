# stETH price oracle Security Audit Report (merged)

###### tags: `LIDO`

## Introduction

### Project overview
The stETH price oracle is a set of smart contracts that allows you to store and update the stETH token price. The main feature of the project is the ability to extract variables for calculating the price from the block hash through the Merkle Patricia Proof Verifier. The stETH price oracle uses the well-known Curve stablecoin mechanic to calculate the price between tokens of the same value. In the new version of oracle, developers use the RLP library to optimize computation and reduce gas costs to update oracle state.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/StateProofVerifier.sol
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/StableSwapStateOracle.sol
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/StableSwapPriceHelper.vy
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/MerklePatriciaProofVerifier.sol
The audited commit identifier is `ae093b308999a564ed3f23d52c6c5dce946dbfa7`
https://github.com/hamdiallam/Solidity-RLP/blob/4fa53119e6dd7c4a950586e21b6068cd9520a649/contracts/RLPReader.sol
The audited commit identifier is `4fa53119e6dd7c4a950586e21b6068cd9520a649`

## Security Assessment Methodology

A group of auditors are involved in the work on the audit who check the provided source code independently of each other in accordance with the methodology described below:

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
* Checking with static analyzers (i.e Slither, Mythril, etc).

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

* Cross check: each auditor reviews the reports of the others.
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
##### Not found

### MAJOR
##### Not found

### WARNINGS
#### 1. Block header incorrect input
##### Description
In the function for extracting data from block header tx can fail without any information in case of incorrect input:
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/StateProofVerifier.sol#L65

##### Recommendation
We recommend to add following check:
```solidity=
require(headerFields.length > 11, "INCORRECT_HEADER");
```

##### Client's commentary
Solidity already provides array bounds checking so there is no way to supply an incorrect header in a way that would break the intended contract behavior, which is to fail the transaction in the case of any incorrect input.
That said, it’s a good idea to add an explicit require statement as advised, this would make debugging failed reports easier.

##### Status
FIXED at https://github.com/lidofinance/curve-merkle-oracle/commit/3d01ffac2efa4e8c3a93b3905f4063d79807e0d6

#### 2. Possible zero price for token
##### Description
In the new version of the oracle smart contract, the price for stETH = 0 until user calls the `submitState` function:
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/StableSwapStateOracle.sol#L268

##### Recommendation
We recommend to add following check:
```solidity=
require(stethPrice > 0, "PRICE_NOT_INITIALIZED");
```

##### Client's commentary
The contract for this function doesn’t assume it fails when the price hasn’t been reported yet: the function returns, among other values, the timestamp of the returned data, and this timestamp would be zero in the case the price is not set.

##### Status
ACKNOWLEDGED

### COMMENTS
#### 1. Require without message
##### Description
In the following functions if revert occurs then user won't receive any information:
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/StateProofVerifier.sol#L100
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/StableSwapStateOracle.sol#L466
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/StableSwapStateOracle.sol#L474

##### Recommendation
We recommend to add message to require.

##### Client's commentary
We’re not using messages in require calls to optimize the deployed bytecode size. The source code of the contract is verified on Etherscan so the exact location of any revert in a failed mainnet transaction can be inspected using free tools like Tenderly.

##### Status
NO ISSUE

#### 2. Bad comment for hash generation
##### Description
It is impossible to check constant hash via following comment:
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/StableSwapStateOracle.sol#L95

##### Recommendation
We recommend to add more detailed comment.

##### Client's commentary
The comment was changed to use actual Solidity code so one can check the value easier.

##### Status
FIXED at https://github.com/lidofinance/curve-merkle-oracle/commit/1fb349c0ef3a37c7bc60a97dc0859784d0b17ac1

#### 3. Gas saving in price calculation
##### Description
In the function for calculating price, you can save gas when calculating the variables `S_` and` c` in case if `i=1`, `j=0`, `N_COINS=2`:
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/StableSwapPriceHelper.vy#L63-L72

##### Recommendation
We recommendto calculate variables using following formula:
```vyper=
S_ = x
c = D * D / (x * N_COINS)
```

##### Client's commentary
We intentionally made as few modifications to the original Curve pool code as possible:

- To avoid unintentionally introducing any behavior differences.
- To make it as easy as possible for someone to manually check that the code does exactly the same calculations over the pool state as the original pool contract’s code.

##### Status
ACKNOWLEDGED

#### 4. Gas saving when copying memory
##### Description
In the function for copy memory when `len % WORD_SIZE == 0` it is possible to save some gas by adding simple check:
https://github.com/hamdiallam/Solidity-RLP/blob/4fa53119e6dd7c4a950586e21b6068cd9520a649/contracts/RLPReader.sol#L350-L355

##### Recommendation
We recommend to add following check:
```solidity=
if (len > 0)
{
    uint mask = 256 ** (WORD_SIZE - len) - 1;
    assembly {
        let srcpart := and(mload(src), not(mask)) // zero out src
        let destpart := and(mload(dest), mask) // retrieve the bytes
        mstore(dest, or(destpart, srcpart))
    }
}
```

##### Client's commentary
We’ve passed the comment to the library’s author and will connect you with him shortly.

##### Status
FIXED at https://github.com/hamdiallam/Solidity-RLP/commit/a2837797e4da79070701339947f32f5725e08b56, https://github.com/lidofinance/curve-merkle-oracle/commit/1033b3e84142317ffd8f366b52e489d5eb49c73f

#### 5. Unused variable
##### Description
Following smart contract contains unused variable:
https://github.com/lidofinance/curve-merkle-oracle/blob/ae093b308999a564ed3f23d52c6c5dce946dbfa7/contracts/MerklePatriciaProofVerifier.sol#L37
##### Recommendation
We recommend to remove unused variable.

##### Client's commentary
Fixed.

##### Status
FIXED at https://github.com/lidofinance/curve-merkle-oracle/commit/63cbc0e528a553c8b7368937c25a9188791cedeb

## Results

### Findings list

Level | Amount
--- | ---
CRITICAL | -
MAJOR    | -
WARNING  | 2
COMMENT  | 5

### Executive summary
A trustless oracle for the ETH/stETH Curve pool using Merkle Patricia proofs of Ethereum state.

The oracle currently assumes that the pool's fee and A (amplification coefficient) values don't change between the time of proof generation and submission.

This audit included an external contract https://github.com/hamdiallam/Solidity-RLP/blob/4fa53119e6dd7c4a950586e21b6068cd9520a649/contracts/RLPReader.sol, representing a solidity library for Ethereum's RLP decoding.

### Conclusion
Smart contract has been audited and several suspicious places were found. During audit no critical and major issues were identified. Several issues were marked as warnings and comments. After working on audit report all issues were fixed or acknowledged(if the issue is not critical or major) by client, so contracts assumed as secure to use according our security criteria. Pursuant to findings severity we also assume an initial commit `ae093b308999a564ed3f23d52c6c5dce946dbfa7` as secure. 
Final commit identifiers with all fixes: `1033b3e84142317ffd8f366b52e489d5eb49c73f`, `a2837797e4da79070701339947f32f5725e08b56`