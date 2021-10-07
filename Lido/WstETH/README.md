# WstETH Security Audit Report (merged)

###### tags: `LIDO`

## Introduction

### Project overview
LIDO protocol is a project for stacking Ether to use it in Beacon chain.  Users can deposit Ether to the Lido smart contract and receive stETH tokens in return. The stETH token balance corresponds to the amount of Beacon chain Ether that the holder could withdraw if state transitions were enabled right now in the Ethereum 2.0 network.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/lidofinance/lido-dao/tree/ea6fa222004b88e6a24b566a51e5b56b0079272d/contracts/0.6.12/WstETH.sol
https://github.com/lidofinance/lido-dao/tree/ea6fa222004b88e6a24b566a51e5b56b0079272d/contracts/0.6.12/interfaces/IStETH.sol
The audited commit identifier is `ea6fa222004b88e6a24b566a51e5b56b0079272d`

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
Not found

### MAJOR
Not found

### WARNINGS
#### 1. Possible incorrect initialization
##### Description
In the following function `_stETH` can be zero address:
https://github.com/lidofinance/lido-dao/tree/ea6fa222004b88e6a24b566a51e5b56b0079272d/contracts/0.6.12/WstETH.sol#L39
##### Recommendation
We recommend to add the following check:
```solidity=
address(_stETH) != address(0), "wstETH: incorrect address");
```
##### Status
Acknowledged
##### Client's commentary
We acknowledge the issue. The current WstETH instance (0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0) has the correct StETH contract address (0xae7ab96520de3a18e5e111b5eaab095312d7fe84).

#### 2. Working with values equal to zero
##### Description
`wstETHAmount` or `stETHAmount` potentially can be zero:
https://github.com/lidofinance/lido-dao/tree/ea6fa222004b88e6a24b566a51e5b56b0079272d/contracts/0.6.12/WstETH.sol#L56
https://github.com/lidofinance/lido-dao/tree/ea6fa222004b88e6a24b566a51e5b56b0079272d/contracts/0.6.12/WstETH.sol#L73
##### Recommendation
We recommend to add the following check:
```solidity=
require(wstETHAmount > 0, "wstETH: stETH return 0 shares");
```
##### Status
Acknowledged
##### Client's commentary
We acknowledge the issue. The case is possible for wrap calls with small values (e.g. several Weis) then `stEthPerToken` is greater than 1. Currently `stEthPerToken` is 1.04, and wrapping 1 stETH Wei will return 0 wstETH Weis. However, these losses are negligible compared to the gas cost for the transaction, and don't lead to violation of the token's mechanics. We would add this edge case to the documentation.

#### 3. `stETH` can be paused
##### Description
`stETH` can be paused, so all transfers would revert:
https://github.com/lidofinance/lido-dao/tree/ea6fa222004b88e6a24b566a51e5b56b0079272d/contracts/0.6.12/WstETH.sol#L57
https://github.com/lidofinance/lido-dao/tree/ea6fa222004b88e6a24b566a51e5b56b0079272d/contracts/0.6.12/WstETH.sol#L73
https://github.com/lidofinance/lido-dao/tree/ea6fa222004b88e6a24b566a51e5b56b0079272d/contracts/0.6.12/WstETH.sol#L81
##### Recommendation
We recommend to add the following check (for this check it is necessary to update interface):
```solidity=
require(!stETH.isStopped(), "wstETH: transfer stopped");
```
##### Status
No issue
##### Client's commentary
The proposed improvement will slightly increase the readability of the revert message by adding a small gas and contract size overhead. We believe that the current revert message (CONTRACT_IS_STOPPED) is an acceptable compromise in this situation.

#### 4. Unchecked returned value
##### Description
Returned value for `transfer`, `transferFrom` not checked:
https://github.com/lidofinance/lido-dao/tree/ea6fa222004b88e6a24b566a51e5b56b0079272d/contracts/0.6.12/WstETH.sol#L57
https://github.com/lidofinance/lido-dao/tree/ea6fa222004b88e6a24b566a51e5b56b0079272d/contracts/0.6.12/WstETH.sol#L73
##### Recommendation
We recommend to add a check like this:
```solidity=
require(stETH.transferFrom(msg.sender, address(this), _stETHAmount), "wstETH: transfer fails");
```
##### Status
No issue
##### Client's commentary
Since the StETH's `transfer` and `transferFrom` methods always revert instead of returning `false`, we are not checking them for gas-saving reasons. The improvement might slightly increase the readability of the error, but would add some overhead on contract size. Besides, StETH token already has good error descriptions like `TRANSFER_FROM_THE_ZERO_ADDRESS`, `TRANSFER_TO_THE_ZERO_ADDRESS`, and `TRANSFER_AMOUNT_EXCEEDS_BALANCE`.

#### 5. Incorrect burning of shares
##### Description
Burning of shares for `WstETH` contract from `stETH` contract can lead to block `unwrap` function for users:
https://github.com/lidofinance/lido-dao/tree/ea6fa222004b88e6a24b566a51e5b56b0079272d/contracts/0.6.12/WstETH.sol#L69-L75
##### Recommendation
We recommend to add a check to `Lido` contract, that Burner can't burn shares for `WstETH`.
##### Status
Acknowledged
##### Client's commentary
Any burning of the stETH token is an emergency that Lido DAO reserves to use against protocol hack or to recover from a failure mode. The burning of tokens for an arbitrary address shouldn’t happen during normal protocol operations. We acknowledge, that burning any number of stETHs on the WstETH contract balance will violate the wrapping/unwrapping mechanics, but this shouldn’t happen in a normal mode. However, this opportunity is very important for failure recovery: if there is an error in the current implementation of the WstETH token, then the DAO will be able to pause StETH, burn stETH from the WstETH contract’s balance, redeploy a new token, and recover balances by minting after that.

### COMMENTS
Not found

## Results
Level | Amount
--- | ---
CRITICAL | -
MAJOR    | -
WARNING  | 5
COMMENT  | -

### Executive summary
LIDO WstETH smart contract gives opportunity for users to use their stETH assets in various defi protocols, because wstETH balance for each user in stable and not changing through time unlike stETH balance.

### Conclusion
Smart contracts have been audited and several suspicious places have been spotted. During the audit no critical or major issues were found. Several findings were marked as warnings, after working on the reported issues all of them were acknowledged or agreed as no issues (if the problem was not critical). So, the contracts are assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `-`