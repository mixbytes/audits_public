![](MixBytes.png)

# Open Enterprise Projects Smart Contract Audit Report

## Introduction

## General provisions

[Aragon](https://aragon.org) is software allowing to freely organize and collaborate without borders or intermediaries. Create global, bureaucracy-free organizations, companies, and communities.

[Autark](https://www.autark.xyz) is an Aragon Network organization building open source tools that serve digital cooperatives and aims to revolutionize work by leveraging the corresponding challenges.

With this in mind, [MixBytes](https://mixbytes.io/) team was willing to contribute to Aragon ecosystem development by providing security assessment of the [Open Enterprise Suite smart contracts](https://github.com/AutarkLabs/open-enterprise/tree/1508acf91ebfd31472cd3cb527ea3e8fa1330757/apps) created by Autark, as well as the StandardBounties and AragonApp smart contracts.

## Scope of the audit

Code written by: Autark

Audited commit: [Projects.sol version d6acd08](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol).


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

1\. [Projects.sol#L433](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L433)

`_tokenAmounts` - number of tokens the user will receive as a reward through `StandardBounties` -  is passed in the code of `reviewSubmission`. If the number of tokens is less than stated in `issue.bountySize`, the remaining tokens cannot be withdrawn:
the rest of the reward cannot be issued ([Projects.sol#L444](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L444))
or removed altogether, as withdrawal of the initial funds amount will fail ([Projects.sol#L914](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L914))

Before calling `acceptFulfillment`, make sure that the sum of all the values in the `_tokenAmounts` array equals `issue.bountySize`.

*Fixed at
[Projects.sol#L483](https://github.com/AutarkLabs/planning-suite/blob/59cfcc6e0df2b014db432a6ba67ec394376c223b/apps/projects/contracts/Projects.sol#L483)*

### WARNINGS

1\. [Projects.sol#L340](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L340) 

When a repository is deleted, funds in open bounties related to repository issues become (at least temporarily) blocked.
We recommend you keep score of open bounty repositories and prohibit deleting them if this entails a loss of funds.

*Fixed at
[59cfcc6](https://github.com/AutarkLabs/planning-suite/blob/59cfcc6e0df2b014db432a6ba67ec394376c223b/apps/projects/contracts/Projects.sol)*


2\. [Projects.sol#L447](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L447)

If this function is called for a non-existing issue, this will in fact be the `acceptFulfillment` function call for `_bountyId = 0`.
We suggest checking that the issue passed in call parameters really exists.

*Fixed at
[Projects.sol#L476](https://github.com/AutarkLabs/planning-suite/blob/59cfcc6e0df2b014db432a6ba67ec394376c223b/apps/projects/contracts/Projects.sol#L476)*


3\. [Projects.sol#L485](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L485)

If this function is called for a non-existing issue, this will in fact be the `changeData` and `changeDeadline` function calls for `_bountyId = 0`.
We suggest checking that the issue passed in call parameters really exists.

*Fixed at
[Projects.sol#L525-L526](https://github.com/AutarkLabs/planning-suite/blob/59cfcc6e0df2b014db432a6ba67ec394376c223b/apps/projects/contracts/Projects.sol#L525-L526)*


4\. [Projects.sol#L870](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L870)

Overwriting an arbitrary `Issue` is allowed if `_repoId` and `_issueNumber` point to an existing issue. In particular, that may lead to blocking of funds associated with the rewritten issue.
It’s highly recommended to verify that the `_repoId` repository exists, and the issue `_issueNumber` does not exist yet. We suggest assigning a number to a new issue automatically.

*Fixed at
[Projects.sol#L915-L916](https://github.com/AutarkLabs/planning-suite/blob/59cfcc6e0df2b014db432a6ba67ec394376c223b/apps/projects/contracts/Projects.sol#L915-L916)*


5\. [Projects.sol#L953](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L953)

There is no check that input data lookups do not go out of the string boundaries. Taking into account a lack of validation in `addBounties` and the fact that `addBounties` is `public` (input parameters are stored in memory), a description fragment or some other fragment of memory may return as a hash.
We recommend adding a check for exceeding the boundaries of the input string.

*Fixed at
[Projects.sol#L630](https://github.com/AutarkLabs/planning-suite/blob/59cfcc6e0df2b014db432a6ba67ec394376c223b/apps/projects/contracts/Projects.sol#L630)*


6\. [Projects.sol#L408](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L408)

The current value of `issue.assignee` is always replaced, regardless of  ` _approved`.
Make sure that this is the desired scenario.

*Fixed at
[Projects.sol#L440](https://github.com/AutarkLabs/planning-suite/blob/59cfcc6e0df2b014db432a6ba67ec394376c223b/apps/projects/contracts/Projects.sol#L440)*


7\. [Projects.sol#L421](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L421)

The `AssignmentApproved` event is always emitted, regardless of the` _approved`.
Make sure that this is the desired scenario.

*Fixed at
[Projects.sol#L442](https://github.com/AutarkLabs/planning-suite/blob/59cfcc6e0df2b014db432a6ba67ec394376c223b/apps/projects/contracts/Projects.sol#L442)*


8\. [Projects.sol#L194](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L194)

In fact, the `Bounties` contract address used by `Projects` is immutable. `settings.bountyAllocator` is mutable, but is not used by the contract.
At least, the given code comment is incorrect. Current behavior may differ from the planned one.

*Fixed at
[Projects.sol#L817](https://github.com/AutarkLabs/planning-suite/blob/59cfcc6e0df2b014db432a6ba67ec394376c223b/apps/projects/contracts/Projects.sol#L817)*


### COMMENTS

1\. [Projects.sol#L368](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L368)

[Projects.sol#L549](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L549)

[Projects.sol#L693](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L693)

We recommend checking that the passed `_repoId` and `_issueNumber` are present before proceeding. This will help prevent errors, including the user ones, at an early stage.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

2\. [Projects.sol#L397](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L397)

[Projects.sol#L433](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L433)

`issue.assignee` and `issue.assignmentRequests` are in no way associated with the `Bounties` contract and the reward payment. Make sure that this is the desired behavior.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

3\. [Projects.sol#L99](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L99)

`BountySettings` are not used in the contract but for read-write functions in the data structure. Make sure that this is the desired behavior.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

4\. [Projects.sol#L156](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L156)

The field value changes during contract operation but it is not used later on. Make sure that this is the desired behavior.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

5\. [Projects.sol#L102](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L102)

Hashes can be calculated in advance and values can be recorded as it is done  in AragonApp.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

6\. [Projects.sol#L203](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L203)

[Projects.sol#L209](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L209)

Re-calling `isContract(_bountiesAddr)` is not beneficial and gas-consuming. We recommend removing an extra call.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

7\. [Projects.sol#L269](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L269) 

We recommend using the current `bountySize` directly from `Bounties`. This step may be skipped if, after fixing major issue #1, `bountySize` will always be equal to the corresponding bounty balance in `Bounties`.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

8\. [Projects.sol#L572](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L572)

[Projects.sol#L622](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L622) 

Input array length validation is missing. We recommend adding a check that all input array lengths are equal.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

9\. [Projects.sol#L747](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L747)

Division of the `_bountyRegistry` code into segments is unnecessary. In addition, last bytes (3) of the last segment will not be captured due to truncation in the course of division [Projects.sol#L737](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L737).
We recommend calculating the `keccak256` value of the entire ` _bountyRegistry` code.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

10\. [Projects.sol#L815](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L815)

We suggest adding the `require(_tokenType == 20);` check.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

11\. [Projects.sol#L880](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L880)

Since `assignee` is set here, using `ETH` instead of `address(0)` is misleading. We recommend writing `address(0)` explicitly, or declaring the constant `NO_ASSIGNEE = address(0)`.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

12\. There is no way to withdraw or use contributions made directly through the `Bounties` contract.
One of the possible solutions is multiple `drainBounty` function calls. 

*Acknowledged*

13\. There is no way to get all issues for a given repository. Problems may arise while creating the issue list. 
One of the possible solutions is using a repository issue counter.

*Acknowledged*

14\. [Projects.sol#L705](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L705)

This comment is not accurate because the function does not return the id of the added repository, but the boolean flag of the repository presence in the index.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

15\. [Projects.sol#L150-L151](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L150-L151)

[Projects.sol#L157](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L157) 

[Projects.sol#L162](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L162)

The specified structure fields are not used. However, we assume this does not lead to excessive gas consumption.
We recommend removing the unused fields.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

16\. [Projects.sol#L679](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L679),

[Projects.sol#L509](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L509)

The specified formal function parameters are not used. If any interface requires them, we recommend leaving only their type in the function declaration to emphasize that they are input on purpose and are not currently used.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

17\. [Projects.sol#L572](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L572)
[Projects.sol#L622](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L622)

The common code (comprising 90% of the given functions) may be moved to a separate function to avoid mistakes in the future.
*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

18\. [Projects.sol#L205](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L205)

[Projects.sol#L302](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L302)

[Projects.sol#L312](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L312)

[Projects.sol#L584](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L584)

[Projects.sol#L752](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L752)

[Projects.sol#L882](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L882)

We recommend eliminating the commented code fragments. 

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*

19\. [Projects.sol#L244](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L244)

[Projects.sol#L286](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L286)

[Projects.sol#L328](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L328)
and so on

For the sake of uniformity, strings may be put into constants. Note that the use of constants slightly increases gas consumption.

*Acknowledged*

20\. [Projects.sol#L412](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L412)

[Projects.sol#L414](https://github.com/AutarkLabs/planning-suite/blob/d6acd0820939813c974625b634361156dfced360/apps/projects/contracts/Projects.sol#L414)

It is allowed to overwrite the `AssignmentRequest` status, for which` reviewApplication` has already been performed. Make sure that this is the desired scenario.

*Fixed at   [0d1835d](https://github.com/AutarkLabs/open-enterprise/commit/0d1835d5499af056fc24969e9d5d306e856b674d)*


## CONCLUSION

The [fixed contract](https://github.com/AutarkLabs/open-enterprise/blob/5175813ec9db5a5e5f1d37a5f3acf53459f0e08a/apps/projects/contracts/Projects.sol) doesn’t have any vulnerabilities according to our analysis.
