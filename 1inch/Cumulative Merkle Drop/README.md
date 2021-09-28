# Cumulative merkle drop Security Audit Report (merged)

###### tags: `1Inch`

## Introduction

### Project overview
1inch is a well known protocol which allows users to make the most profitable swaps between assets via using complex swaps in several protocols.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/interfaces/ICumulativeMerkleDrop.sol
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/interfaces/ICumulativeMerkleDrop128.sol
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/interfaces/ICumulativeMerkleDrop160.sol
The audited commit identifier is `96fb63d0cbfea73603e7500961c71e8ab1fb8c10`

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
#### 1. Shorted root hash can be brute forced
##### Description
Malicious user can brute force proof for case `leaf = _keccak128(abi.encodePacked(address(malicious_user), token.balanceOf(address(this))))` because root hash is shorted:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L95
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L95
##### Recommendation
We recommend to use only 256bit implementation of cumulative merkle drop, because it is a garauntee that hash collision wouldn't appear.
##### Status
Acknowledged
##### Client's commentary
We'll deprecate 128 and 160 bit versions

### MAJOR
Not found

### WARNINGS
#### 1. Possible incorrect initialization
##### Description
In `CumulativeMerkleDropXXX` constructor `token_` can be zero address:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L21
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L22
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L21
##### Recommendation
We recommend to add the following check:
```solidity=
require(token_ != address(0), "CMD: Incorrect address");
```
##### Status
Acknowledged
##### Client's commentary
Won't fix

#### 2. Owner can set unlimited amount
##### Description
Owner can set merkle root in which, for his account, allowed amount can be very big:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L24-L27
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L25-L28
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L24-L27
##### Recommendation
We recommend to use multisig wallet for `owner`.
##### Status
Acknowledged
##### Client's commentary
Noted

#### 3. Incorrect change of the root
##### Description
In the following function it is possible to update root with the same value:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L26
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L27
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L26
##### Recommendation
We recommend to add the following check:
```solidity=
require(merkleRoot_ != merkleRoot, "CMD: Same root");
```
##### Status
Acknowledged
##### Client's commentary
Won't fix

#### 4. Possible work with uninitialized `merkleRoot`
##### Description
In the following function it is possible to `merkleRoot == 0`:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L35
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L36
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L36
##### Recommendation
We recommend to add check, that `merkleRoot` was initialized.
##### Status
Acknowledged
##### Client's commentary
Won't fix

#### 5. `merkleProof` can has length == 0
##### Description
In the following function it is possible to `merkleProof.length == 0`:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L39
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L40
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L39
##### Recommendation
We recommend to add the check on length of proof (`merkleProof.length == precalculated_value`) and also add following check:
```solidity=
require(merkleProof.length > 0, "CMD: Incorrect proof");
```
##### Status
Acknowledged
##### Client's commentary
Won't fix

#### 6. Possible insufficient balance
##### Description
`token` balance of the contract can be less than `amount`:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L48
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L49
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L48
##### Recommendation
We recommend to add the following check:
```solidity=
require(IERC20(token).balanceOf(address(this)) >= amount, "CMD: Insufficient balance");
```
##### Status
No issue
##### Client's commentary
This is indirectly enforced by transfer function

### COMMENTS
#### 1. Unnecessary use of safeMath
##### Description
`cumulativeAmount` always greater than `preclaimed` because it is checked above:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L47
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L48
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L47
##### Recommendation
We recommend to use uncheked {} math to safe some gas.
##### Status
Fixed at https://github.com/1inch/cumulative-merkle-drop/commit/5d19a1afbb999c3e2a5b61e83ebb51ffd9c0c03b

#### 2. Not enough comments
##### Description
In the following function many assembly operations are used without comments about their functionality:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L74-L96
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L60-L83
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L74-L96
##### Recommendation
We recommend to add comments for each operation in assembly.
##### Status
No issue
##### Client's commentary
There is a simple solidity version of verify that is commented out, that is used as an explanation of what assembly code is doing.

#### 3. Unusable library
##### Description
MerkleProof library is not used in this contract:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L14
##### Recommendation
We recommend to remove this library from contract.
##### Status
Fixed at https://github.com/1inch/cumulative-merkle-drop/commit/1f8b2a6ed27d1b2d18cf8475e42eece60f41c896


#### 4. Incorrect comment
##### Description
Comment for `MerkelRootUpdated` event is copied from `Claimed` event:
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/interfaces/ICumulativeMerkleDrop160.sol#L7
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/interfaces/ICumulativeMerkleDrop128.sol#L7
https://github.com/1inch/cumulative-merkle-drop/tree/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/interfaces/ICumulativeMerkleDrop.sol#L7
##### Recommendation
We recommend to change the comment.
##### Status
Fixed at https://github.com/1inch/cumulative-merkle-drop/commit/da991f54ebe3cca344e024be787d5abcb961da9d


#### 5. Public access
##### Description
Next function can be internal:
https://github.com/1inch/cumulative-merkle-drop/blob/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L58
https://github.com/1inch/cumulative-merkle-drop/blob/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L72
https://github.com/1inch/cumulative-merkle-drop/blob/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L72
##### Recommendation
We recommend to mark this function as `internal` in every `CumulativeMerkleDropXXX.sol` contract.
##### Status
Fixed at https://github.com/1inch/cumulative-merkle-drop/commit/0ca41cde81e751d456ce85fcb9e4fa373399ea06


#### 6. Non-consistent number formatting
##### Description
In `verifyAsm` for 256 and 128 bit versions keccak argument is written in decimal format:
https://github.com/1inch/cumulative-merkle-drop/blob/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L78
https://github.com/1inch/cumulative-merkle-drop/blob/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L92
but in 160 bit - in hex format
https://github.com/1inch/cumulative-merkle-drop/blob/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L92
This fact may confuse readers of this code.
##### Recommendation
We recommend to use single format.
##### Status
No issue
##### Client's commentary
We'll remove 160 and 128 bit versions. So that will not be relevant.

#### 7. Possible gas savings
##### Description
Function `verifyAsm` costs a lot of gas, so it's meaningful to place checks before that function. We can place check for `preclaimed < cumulativeAmount`
https://github.com/1inch/cumulative-merkle-drop/blob/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop.sol#L44
https://github.com/1inch/cumulative-merkle-drop/blob/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop128.sol#L43
https://github.com/1inch/cumulative-merkle-drop/blob/96fb63d0cbfea73603e7500961c71e8ab1fb8c10/contracts/CumulativeMerkleDrop160.sol#L43
also `amount <= IERC20(token).balanceOf(address(this))`.
##### Recommendation
We recommend to place the following checks above `verifyAsm`:
```solidity=
require(preclaimed < cumulativeAmount, "CMD: Nothing to claim");
require(amount <= IERC20(token).balanceOf(address(this)), "CMD: Insufficient balance");

// Verify the merkle proof
bytes16 leaf = _keccak128(abi.encodePacked(account, cumulativeAmount));
require(verifyAsm(merkleProof, expectedMerkleRoot, leaf), "CMD: Invalid proof");
```
##### Status
Acknowledged
##### Client's commentary
Won't fix

## Results
Level | Amount
--- | ---
CRITICAL | 1
MAJOR    | 0
WARNING  | 6
COMMENT  | 7

### Executive summary
Cumulative merkle drop is a project from 1inch protocol, allowing users to withdraw some tokens from contract in case they have allowance to do it. Allowance to withdraw funds from contract is stored via merkle tree. As always, to save ETH for users 1inch implemented their own merkle tree proof verification function, which is more efficient than openzeppelin well known solution.

### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit one issue was marked critical, as it might lead to undesired behaviour. No major issues were spotted, several warnings and comments were found and discussed with the client. After working on the reported findings all of them were resolved or acknowledged. So, the contracts are assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `1f8b2a6ed27d1b2d18cf8475e42eece60f41c896`