![](MixBytes.png)

# Curve Voting (Aragon Voting fork) Smart Contract Audit

## Introduction

### General Provisions
Curve Finance is a project that uses liquidity pools and bonding curves to provide high-efficiency stablecoin trading and low-risk returns for liquidity providers.
MixBytes was approached by Curve Finance (https://www.curve.fi/) to provide a security assessment of a part of their governance mechanism smart contracts.


### Scope of the Audit

The scope of the audit is a smart contract at 
https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol.

Audited commit is a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c.

The [fork base](https://github.com/aragon/aragon-apps/blob/12c30c6b76093d3c9007b1586fec7c51a9c3c936/apps/voting/contracts/Voting.sol) is considered secure and out of scope.

The specification of the contract is located at https://github.com/pengiundev/curve-aragon-voting/blob/e1d824768dca1a69d7dfc1570e72828d91466e05/SPECS.md.


## Security Assessment Principles

### Classification of Issues

* CRITICAL: Bugs leading to Ether or token theft, fund access locking or any other loss of Ether/tokens to be transferred to any party (for example, dividends). 

* MAJOR: Bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement. 

* WARNINGS: Bugs that can break the intended contract logic or expose it to DoS attacks. 

* COMMENTS: Other issues and recommendations reported to/ acknowledged by the team.


### Security Assessment Methodology

Two auditors independently verified the code.

Stages of the audit were as follows:

* "Blind" manual check of the code and its model 
* "Guided" manual code review
* Checking the code compliance to customer requirements 
* Discussion of independent audit results
* Report preparation


## Detected Issues

### CRITICAL
 
Not found

 
### MAJOR

1\. [Voting.sol#L254](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L254)

`canCreateNewVote` is not taken into account here, although it can block new vote creation. Which, in turn, will break proper forwarding in the Aragon UI. We suggest adding `&& canCreateNewVote()` here.

*Fixed at [757970c](https://github.com/pengiundev/curve-aragon-voting/commit/757970c87fd953d743dfbd55431a2181d7dedd53)*


### WARNINGS

1\. [Voting.sol#L60-L62](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L60-L62)

Global variables initialized in such a way won't work in aragon apps.
Explanation: https://hack.aragon.org/docs/aragonos-building#global-variables-in-apps.

We recommend setting them in `initialize` function like this
```
function initialize() .. {
	...
minBalanceLowerLimit = <value literal>;
minTimeLowerLimit = <value literal>;
minTimeUpperLimit = <value literal>;
...
}
```

*Fixed at [Voting.sol#L147-L149](https://github.com/pengiundev/curve-aragon-voting/blob/5e61f28198de469f307cb6c5789e02eeef9aadf8/contracts/Voting.sol#L147-L149)*

2\. [Voting.sol#L125-L126](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L125-L126)

The values are not checked against the limits. We suggest adding extra checks.

*Fixed at [a92bf07](https://github.com/pengiundev/curve-aragon-voting/commit/a92bf075406136c057409a7cfcf401ecffbd15ca)*

3\. [Voting.sol#L60](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L60)

Looks like it's assumed that the token's decimals are 18, which is not always the case. We suggest calculating this value dynamically taking into account `token.decimals`.

*Fixed at [757970c](https://github.com/pengiundev/curve-aragon-voting/commit/757970c87fd953d743dfbd55431a2181d7dedd53)*

4\. [Voting.sol#L162-L174](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L162-L174) 

We recommend adding Radspec documentation to the functions. Otherwise, users of Aragon UI will have troubles calling them.

*Fixed at [48da227](https://github.com/pengiundev/curve-aragon-voting/commit/48da227b85eebb9df346a2a218c0d2b494aebcff)*


### COMMENTS

1\. [Voting.sol#L20-L25](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L20-L25) 

Solidity constants are not optimized. They work like pure functions, executed upon each access. We suggest using the same pattern as here: [BalanceTimeForwarder.sol#L12](https://github.com/pengiundev/curve-dao-voting-forwarder/blob/031d29f6d71e92678bb24143b1b8517c91098714/contracts/BalanceTimeForwarder.sol#L12).

*Fixed at [bf14d4b](https://github.com/pengiundev/curve-aragon-voting/commit/bf14d4bd9d103ea35d53e5beeeb11ef71e282865)*

2\. [Voting.sol#L103](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L103)

We recommend adding docs on `_minTime` and `_minBalance` parameters.

*Fixed at [48da227](https://github.com/pengiundev/curve-aragon-voting/commit/48da227b85eebb9df346a2a218c0d2b494aebcff)*

3\. [Voting.sol#L88](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L88)
[Voting.sol#L94](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L94)
[Voting.sol#L163](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L163)
[Voting.sol#L170](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L170)

The comments and the error message might not be consistent with the actual constraint values.

*Fixed at [48da227](https://github.com/pengiundev/curve-aragon-voting/commit/48da227b85eebb9df346a2a218c0d2b494aebcff)*

4\. [Voting.sol#L279](https://github.com/pengiundev/curve-aragon-voting/blob/a988e7c9a0543b58f0f0adb93a7b06acd5b36c0c/contracts/Voting.sol#L279)

The function should be marked as `view`.

*Fixed at [48da227](https://github.com/pengiundev/curve-aragon-voting/commit/48da227b85eebb9df346a2a218c0d2b494aebcff)*


## CONCLUSION

We find the implemented incentivisation approach as a clever solution to the lingering voters problem.

Several troublesome issues were identified and properly addressed.

The [fixed contract](https://github.com/pengiundev/curve-aragon-voting/blob/757970c87fd953d743dfbd55431a2181d7dedd53/contracts/Voting.sol) doesn't have any vulnerabilities according to our analysis.
