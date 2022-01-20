# Aragon voting Interim Security Audit Report (merged)

###### tags: `LIDO`

## Introduction

### Project overview
LIDO protocol is a project for stacking Ether to use it in Beacon chain.  Users can deposit Ether to the Lido smart contract and receive stETH tokens in return. The stETH token balance corresponds to the amount of Beacon chain Ether that the holder could withdraw if state transitions were enabled right now in the Ethereum 2.0 network.
The Lido DAO is a Decentralized Autonomous Organization that manages the liquid staking protocol by deciding on key parameters (e.g., setting fees, assigning node operators and oracles, etc.) through the voting power of governance token (DPG) holders.
The Lido DAO is an Aragon organization. The protocol smart contracts extend AragonApp base contract and can be managed by the DAO.

A smart contract tested in this audit is intended for logic to manage user voting on the launch of some scripts. But here users do not just choose `yes` or `no`. Each voice has weight. To calculate the weight of each voice, the token `MiniMeToken` is used.

Below is the list the basic functions of a smart contract:
- `newVote()` -  creates a new Vote
- `vote()` - makes a vote for participants 
- `executeVote()` - executes a Vote
- `isForwarder()` - tells whether the Voting app is a forwarder or not
- `forward()` - creates a Vote to execute the desired action, and casts a support vote if possible
- `canForward()` - tells whether `_sender` can forward actions or not
- `canExecute()` - tells whether a Vote `_voteId` can be executed or not
- `canVote()` - tells whether `_sender` can participate in the Vote `_voteId` or not
- `getVote()` - returns all information for a Vote by its `_voteId`
- `getVoterState()` - returns the state of a voter for a given Vote by its `_voteId`
- `changeSupportRequiredPct()` - changes required support
- `changeMinAcceptQuorumPct()` - changes minimum acceptance quorum
- `unsafelyChangeVoteTime()` - changes Vote time


### Scope of the Audit
The scope of the audit includes the following smart contracts at:
- https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol

The audited commit identifier is `8c46da8704d0011c42ece2896dbf4aeee069b84a`


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
* Additional verification of the entire initial project scope and code base.

```
Stage goal:
Preparation of the final code version with all the fixes and additional re-check
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

#### 1. Changing the shared variable can affect previous votes
##### Description
At the lines 
https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L126-L133 in the `unsafelyChangeVoteTime()` method is a change in the common for all voting variable `voteTime`.
Changing this variable will extend or shorten the voting time on existing voting.
This will affect the voting results, because the process will not go as planned when creating a vote.
So this action is potentially dangerous and may bring the unexpected side effects.

##### Recommendation
It is recommended to save the value of the variable `voteTime` in the structure `Vote`. 
This will be done in the same way as for the `supportRequiredPct` and `minAcceptQuorumPct` variables.
##### Status
Acknowledged
##### Client's commentary
The issue is acknowledged. While changing voting duration by the code in question would affect all currently running votes, that's something which we may and will tackle with operations. The alternative would be to change the Aragon Voting smart contract code considerably, potentially introducing other issues to DAO government process.

The ops plan is outlined in Lido Improvement Proposal 4:
https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-4.md


### WARNINGS

#### 1. Incorrect condition
##### Description
At the lines 
https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L382-L384 in the function `_canExecute()` condition is made:
```solidity
        if (vote_.executed) {
            return false;
        }
```
At the lines 
https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L392-L394 in the function `_canExecute()` condition is made:
```solidity
        if (_isVoteOpen(vote_)) {
            return false;
        }
```
This is equivalent to this code:
```solidity
        if (getTimestamp64() < vote_.startDate.add(voteTime) && !vote_.executed) {
            return false;
        }
```
Thus, line 383 returns `false` for `vote_.executed`.
And on line 393 the value `false` is returned with `!vote_.executed`.

On Lines 271-272 values are written:
```solidity
        open = _isVoteOpen(vote_);
        executed = vote_.executed;
```
This is equivalent to this code:
```solidity
        open = getTimestamp64() < vote_.startDate.add(voteTime) && !vote_.executed;
        executed = vote_.executed;
```
So on line 271 the value `!vote_.executed` is written.
And on line 272 the value `vote_.executed` is written.

##### Recommendation
It is recommended to remove the `&&!vote_.executed` check in the `_isVoteOpen()` function.
##### Status
Acknowledged
##### Client's commentary
The check is redundant in `_canExecute` function, though it increases the readability of the method.

#### 2. No variable check in initialize function
##### Description
There is no check of the variable in the initialize function at the line
- https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L87.
The `token` variable is initialized in only one place.
If the value of the address variable `token` is equal to zero when the `initialize()` function is executed, then this smart contract will have to be reinstalled.

##### Recommendation
It is recommended to add a check.
##### Status
Acknowledged
##### Client's commentary
The Aragon Voting contract is already deployed, and the value of `token` variable is correctly set to `0x5a98fcbea516cf06857215779fd812ca3bef1b32`


#### 3. Function parameter not used
##### Description
At the line 
https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L211, the `canForward()` function has 2 parameters. But the second parameter has no name and is not used anywhere.
In the `IForwarder` interface, the second parameter is called `evmCallScript`.
Thus, in a function from the interface, control must be delegated to the `_sender` address to execute the script.
But in fact, in the `Voting` contract, this function does not modify the data, but only outputs a boolean value with the result of checking the rights to create new votes for the address.
The second variable is not needed in the `Voting` contract.

##### Recommendation
It is recommended to remove the second variable for the `canForward()` function.
##### Status
Acknowledged
##### Client's commentary
The parameter is required for the Voting contract to conform to the Aragon `IForwarder` interface, so the function shouldn't be changed.


#### 4. Possibility of gas overuse
##### Description
At the lines
 https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L331-L341
if `voter` previosly voted `yea` and now voting `yea` again `vote_.yea` calculates twice: first it decreases and then it increases.
And the same case occurs if `voter` previosly voted `nay` and now voting `nay`.

##### Recommendation
It is recommended to add checking if `voter` previosly vote equals his curent vote.
##### Status
Acknowledged
##### Client's commentary
The code has two side-effects, which should happen even if the vote isn't changing during the call: 
1) emitting `CastVote` event; 
2) executing the vote if it can be executed already and `_executesIfDecided` is `true`.


### COMMENTS

#### 1. Duplicate code
##### Description
At the lines
 https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L84-L85 and 88, the variables are checked and initialized in the `initialize()` function.
Lines https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L101-L103 do the same in the `changeSupportRequiredPct()` function.
This duplicate code can be moved into a separate internal function.

##### Recommendation
It is recommended to make refactoring of the source code.
##### Status
Acknowledged
##### Client's commentary
The error messages differ between the `initialize` and `changeSupportRequiredPct` functions, that makes the debugging easier. Having both checks in place arguably makes the code more explicit as well.


#### 2. The source code intended for deployment should not contain `TODO` comments
##### Description
At the line 
https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L369 contains a comment with `TODO`.
But the deployed code needs to be improved, since it cannot be changed. There is no point in such comments.
##### Recommendation
It is recommended to delete these comment.
##### Status
Acknowledged
##### Client's commentary
The comment was left as-is to have minimal diff with the current Voting contract.


#### 3. Using function without any logic
##### Description
At `Voting.sol` using empty useless function at
 https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L191.

##### Recommendation
It is recommended to comment it or delete.
##### Status
Acknowledged
##### Client's commentary
The function `isForwarder` is required for `IForwarder` interface conformance.


#### 4. Using unsuitable visibility modifier
##### Description
Visibility of a contract functions at:
- https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L200
- https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L224
- https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L234
- https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L252
- https://github.com/lidofinance/aragon-apps/blob/8c46da8704d0011c42ece2896dbf4aeee069b84a/apps/voting/contracts/Voting.sol#L288
which are not called internally from the same contract should be changed to `external` to save gas.

##### Recommendation
It is recommended to change `public` to `external`.
##### Status
Acknowledged
##### Client's commentary
Functions `canExecute`, `canVote`, `getVote`, `getVoterState` could be made `external`, but were decided to be left as-is to have minimal diff with the current Voting contract.
`forward` is `public` in `IForwarder` interface the Voting contract conforms to.
https://github.com/aragon/aragonOS/blob/v4.4.0/contracts/common/IForwarder.sol


## Results
Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 1
WARNING | 4
COMMENT | 4

### Conclusion
Smart contracts have been audited and several suspicious places have been detected. During the audit no critical issues were found, one major, several warnings and comments were spotted. After working on the reported findings all of them were acknowledged by the client.

Final commit identifier with all fixes: `8c46da8704d0011c42ece2896dbf4aeee069b84a`