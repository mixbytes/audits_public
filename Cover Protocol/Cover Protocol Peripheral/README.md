# Cover Peripheral Smart Contract Audit

###### tags: `Cover`

## Introduction

### General Provisions
Cover Protocol is a blockchain-based peer-to-peer coverage market for decentralized finance. The platform allows DeFi users to hedge against risks due to smart contracts' fallacies (especially useful when farming or staking).

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/Rollover.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/utils/Address.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/utils/Ownable.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/utils/ReentrancyGuard.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/utils/SafeERC20.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/utils/SafeMath.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/interfaces/IBFactory.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/interfaces/IBlacksmith.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/interfaces/IBPool.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/interfaces/ICover.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/interfaces/ICoverERC20.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/interfaces/ICoverRouter.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/interfaces/IERC20.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/interfaces/IProtocol.sol
https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/interfaces/IRollover.sol
  
The audited commit identifier is `d5b37e34d47abec3252cdabd46e55e34a72421d4`


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
* Checking the code compliance with customer requirements 
* Discussion of independent audit results
* Report preparation

## Report

### CRITICAL
Not found

  
### MAJOR

#### 1. It is possible to carry out attacks to manipulate pools within one transaction using a flash loan

##### Description
In contracts https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol and https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/Rollover.sol, any user can exchange tokens with a contract. Any user can add and remove liquidity. An attacker can take a flash loan and perform multiple liquidity manipulations within a single transaction. These manipulations can lead to a loss of funds for other users.

##### Recommendation
It is recommended to add protection against token manipulation with flash loans.
Here's some sample code:

```solidity
mapping(address => uint256) private _lastSwapBlock;

function some() external {
   _preventSameTxOrigin();
   ....
   some logic
   ...
 }

function _preventSameTxOrigin() private {
   require(block.number > _lastSwapBlock[tx.origin], "SAME_TX_ORIGIN");
   _lastSwapBlock[tx.origin] = block.number;
 }
```

##### Status
Fixed at https://github.com/CoverProtocol/cover-peripheral/commit/492741bc6a4179231f389505b13624535126ba20


#### 2. Possibility to steal tokens from the contract balance

##### Description
Method `addCoverAndCreatePools` defined at https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol#L128 accepts `_protocol` and `_collateral` addresses as arguments, then call `_addCover` that makes approve for `_protocol` an unlimited amount of `_collateral` tokens and call `_protocol.addCover`. There are no checks of `_protocol` and `_collateral` validity, so an attacker can pass malicious `_protocol` and get unlimited approval of `_collateral` tokens:
```solidity
if (_token.allowance(address(this), _spender) < _amount) {
  _token.approve(_spender, uint256(-1));
}
```

According to the contract logic in an optimistic flow a contract shouldn't have any tokens in balance, but this invariant not fully checked, e.g. if `_protocol.addCover` at https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/Rollover.sol#L75 fails and returns false, then the transaction will be executed successfully, but the user's funds will be left on the CoverRouter balance.

##### Recommendation
We recommend to not use unlimited approve and add particular checks to keep the zero balance invariant.

##### Status
Fixed at https://github.com/CoverProtocol/cover-peripheral/commit/492741bc6a4179231f389505b13624535126ba20


### WARNINGS

#### 1. No validation of the address parameter value in contract constructor
##### Description
The variable is assigned to the value of the constructor input parameter. But the parameter is not checked before this. If the value turns out to be zero, then it will be necessary to redeploy the contract since there is no other functionality to set this variable.

* At line https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol#L36 the `protocolFactory` variable is set to the value of the `_protocolFactory` input parameter.
* At line https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol#L37 the `bFactory` variable is set to the value of the `_bFactory` input parameter.

##### Recommendation
In all the cases, it is necessary to add a check of the input parameter to zero before initializing the variables.

##### Status
Fixed at https://github.com/CoverProtocol/cover-peripheral/commit/492741bc6a4179231f389505b13624535126ba20


#### 2. It is possible to use a Front-Running attack
##### Description
Since all transactions are visible in the mempool for a little while before being executed, the observers of the network can see and react to an action before it is included in a block. An example of how this can be exploited is with a decentralized exchange where a buy order transaction can be seen, and a second order can be broadcast and executed before the first transaction is included.

At line https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol#L64, any user can execute the `rolloverAndAddLiquidityForAccount()` function. This function calls other functions and exchanges tokens between the contract and the `_account` address. Due to the fact that another user completes the transaction earlier, a profitable position in the trade may be lost and the user will lose his profit. 

##### Recommendation
The best remediation is to remove the benefit of Front-Running in your application, mainly by removing the importance of transaction ordering or time. It will be possible to make use of the maximum or minimum acceptable price or amount range for the transaction, thereby limiting the price slippage.

##### Status
Acknowledged


#### 3. Need to check the remaining tokens 
##### Description
There is the `_transferRem` method in the contract. But in some cases, there are no
checks:
- https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol#L45 (`addCoverAndAddLiquidity`)
- https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol#L115 (`addLiquidity`)
- https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol#L158 (`createNewPool`)

##### Recommendation
We recommend checking all tokens and transfer remaining balance after every external method of the contract.

##### Status
Fixed at https://github.com/CoverProtocol/cover-peripheral/commit/492741bc6a4179231f389505b13624535126ba20


#### 4. Unlimited approval 
##### Description
At this line `_token.approve(_spender, uint256(-1)` located at https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/Rollover.sol#L64 we have an unlimited approval access from CoverRouter.

##### Recommendation
We recommend either to revoke the approval after the execution or to approve only the expected amount.

##### Status
Fixed at https://github.com/CoverProtocol/cover-peripheral/commit/492741bc6a4179231f389505b13624535126ba20


### COMMENTS

#### 1. No events for parameter changes

##### Description
Basic features for `onlyOwner` don't emit any events:
- https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol#L179 (`setSwapFee`)
- https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol#L185 (`setCovTokenWeights`)

##### Recommendation
We recommend to create events:`SwapFeeUpdate`, `CovTokenWeightUpdate`.

##### Status
Fixed at https://github.com/CoverProtocol/cover-peripheral/commit/492741bc6a4179231f389505b13624535126ba20


## CONCLUSION

Findings list

Level | Amount
--- | ---
CRITICAL | 0
MAJOR | 2
WARNING | 4
COMMENT | 1


Final commit identifier with all fixes: `cbf6f30cde5ca6830af0554f3fb5247ae3bdaf06`

### Executive summary
The audited contract represents an intermediate layer between Cover Protocol core contracts and end-users. The general purpose of the contract is routing requests to target pools, so contract provide a single place to interact with pools and create them (approach is very similar with the Uniswap router model).

### Conclusion
Smart contracts were audited and several suspicious places were spotted. Two issues were marked as major since they potentially can break desired contract behavior. The other issues were marked as warnings and comments. After working on the reported findings all issues were fixed by the client’s team or marked as acknowledged. So, the contracts are assumed as secure to use according to our security criteria.