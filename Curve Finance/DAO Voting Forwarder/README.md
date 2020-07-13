![](MixBytes.png)

# Сurve-DAO-Voting-Forwarder Smart Contract Audit

## Introduction

### General Provisions
Curve Finance is a project that uses liquidity pools and bonding curves to provide high-efficiency stablecoin trading and low-risk returns for liquidity providers.
MixBytes was approached by Curve Finance (https://www.curve.fi/) to provide a security assessment of a part of their governance mechanism smart contracts.


### Scope of the Audit

The scope of the audit is smart contracts at 
https://github.com/pengiundev/curve-dao-voting-forwarder/blob/db6a2694bdc34d68bf39435ae956dea0791291d6/contracts/BalanceTimeForwarder.sol

Audited commit is db6a2694bdc34d68bf39435ae956dea0791291d6.

The specification of the contract is located at https://github.com/pengiundev/curve-dao-voting-forwarder/blob/5b116f454188fd6f12a5d44bbdec5cf64560f63a/SPECS.md


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

1.https://github.com/pengiundev/curve-dao-voting-forwarder/blob/db6a2694bdc34d68bf39435ae956dea0791291d6/contracts/BalanceTimeForwarder.sol#L93

`msg.sender` is erroneously used instead of `_sender`. The `canForward` function can be called by other contracts or a frontend to check if a user can forward an action. In case of these calls `msg.sender` wouldn't correspond to `_sender` yielding a logically incorrect result.
We suggest replacing `msg.sender` with `_sender` on this line.

*Fixed at https://github.com/pengiundev/curve-dao-voting-forwarder/commit/031d29f6d71e92678bb24143b1b8517c91098714*


### WARNINGS

1.https://github.com/pengiundev/curve-dao-voting-forwarder/blob/db6a2694bdc34d68bf39435ae956dea0791291d6/contracts/BalanceTimeForwarder.sol#L87

Possible reentrant call, since `lastVoteTimes` is modified after the call to `runScript`. We, therefore, suggest moving the state change before the `runScript` call.

For example: 
```
lastVoteTimes[msg.sender] = block.timestamp;
runScript(_evmScript, input, blackList);
```

*Fixed at https://github.com/pengiundev/curve-dao-voting-forwarder/commit/031d29f6d71e92678bb24143b1b8517c91098714*

2.https://github.com/pengiundev/curve-dao-voting-forwarder/blob/db6a2694bdc34d68bf39435ae956dea0791291d6/contracts/BalanceTimeForwarder.sol#L34

Input values `minTime`, `minBalance` are not checked in the `initialize` function.

We suggest adding checks in accordance to https://github.com/pengiundev/curve-dao-voting-forwarder/blob/5b116f454188fd6f12a5d44bbdec5cf64560f63a/SPECS.md:
```
require(minTime > 12 hours && minTime < 2 weeks);
require(minBalance > 10000 * 365 days);
```
They can be written as modifiers to avoid code duplication.

*Fixed at https://github.com/pengiundev/curve-dao-voting-forwarder/commit/031d29f6d71e92678bb24143b1b8517c91098714*

3.https://github.com/pengiundev/curve-dao-voting-forwarder/blob/db6a2694bdc34d68bf39435ae956dea0791291d6/contracts/BalanceTimeForwarder.sol#L53
https://github.com/pengiundev/curve-dao-voting-forwarder/blob/db6a2694bdc34d68bf39435ae956dea0791291d6/contracts/BalanceTimeForwarder.sol#L61

Integer literals representing time period are not accurate.
- 1 year: `60*60*24*365 == 31536000 `
- 2 weeks: `60*60*24*14 == 1209600 `

For accuracy we suggest using time units (https://solidity.readthedocs.io/en/v0.5.7/units-and-global-variables.html#time-units), like `365 days`, `14 days` or `2 weeks`.

*Fixed at https://github.com/pengiundev/curve-dao-voting-forwarder/commit/031d29f6d71e92678bb24143b1b8517c91098714*


### COMMENTS

1.https://github.com/pengiundev/curve-dao-voting-forwarder/blob/db6a2694bdc34d68bf39435ae956dea0791291d6/contracts/BalanceTimeForwarder.sol#L13-L15  

Solidity constants are not optimized. They work like pure functions, executed upon each access.

We suggest using the following snippet:

```solidity
bytes32 public constant SET_TOKEN_ROLE = 0x9b27b5f34c38cd0d691143dc6188f9aa90e75f5e87b428e9315e822224da1dd2; // keccak256(“SET_TOKEN_ROLE”)
// ...

constructor() public {
    assert(SET_TOKEN_ROLE == keccak256("SET_TOKEN_ROLE"));
    // ...
}
```

*Fixed at https://github.com/pengiundev/curve-dao-voting-forwarder/commit/031d29f6d71e92678bb24143b1b8517c91098714*

2.https://github.com/pengiundev/curve-dao-voting-forwarder/blob/5b116f454188fd6f12a5d44bbdec5cf64560f63a/contracts/BalanceTimeForwarder.sol#L5

Unused dependency.

*Fixed at https://github.com/pengiundev/curve-dao-voting-forwarder/commit/031d29f6d71e92678bb24143b1b8517c91098714*

3.https://github.com/pengiundev/curve-dao-voting-forwarder/blame/5b116f454188fd6f12a5d44bbdec5cf64560f63a/SPECS.md#L10

There is no voting power calculation directly in the `BalanceTimeForwarder` contract. We assume that it’s calculated by the token contract and returned by the `balanceOf` call.

*Client: Yes, that is calculated in the MiniMe-like token contract and balanceOf returns that time-weighted voting power*

4.https://github.com/pengiundev/curve-dao-voting-forwarder/blob/db6a2694bdc34d68bf39435ae956dea0791291d6/contracts/BalanceTimeForwarder.sol#L82-L85 

These lines are copied from the `TokenManager`. The second line of the comment is incorrect. Also, make sure that the blacklist is needed.

*Fixed at https://github.com/pengiundev/curve-dao-voting-forwarder/commit/031d29f6d71e92678bb24143b1b8517c91098714*


## CONCLUSION

Several troublesome issues were identified and properly addressed.

The [fixed contract](https://github.com/pengiundev/curve-dao-voting-forwarder/blob/4131ec9f177ae562c31aa2b440686ab3ec487170/contracts/BalanceTimeForwarder.sol) doesn’t have any vulnerabilities according to our analysis.
