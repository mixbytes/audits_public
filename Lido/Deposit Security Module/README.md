# Deposit Security Module Security Audit Report 

###### tags: `LIDO`

## Introduction

### Project overview
LIDO protocol is a project for staking Ether to use it in Beacon chain.  Users can deposit Ether to the Lido smart contract and receive stETH tokens in return. The stETH token balance corresponds to the amount of Beacon chain Ether that the holder could withdraw if state transitions were enabled right now in the Ethereum 2.0 network.
The Lido DAO is a Decentralized Autonomous Organization that manages the liquid staking protocol by deciding on key parameters (e.g., setting fees, assigning node operators and oracles, etc.) through the voting power of governance token (DPG) holders.
The Lido DAO is an Aragon organization. The protocol smart contracts extend AragonApp base contract and can be managed by the DAO.

On Tuesday, Oct 5, the vulnerability allowing the malicious Node Operator to intercept the user funds on deposits to the Beacon chain in the Lido protocol was reported to Immunefi. The vulnerability could only be exploited by the Node Operator front-running the Lido.depositBufferedEther transaction with direct deposit to the DepositContract of no less than 1 ETH with the same validator public key & withdrawal credentials different from the Lido's ones, effectively getting control over 32 ETH from Lido. 

This scope contains contracts that are involved in mitigation after a vulnerability is found. 
Lido propose to establish the Deposit Security Committee dedicated to ensuring the safety of deposits on the Beacon chain:
- monitoring the history of deposits and the set of Lido keys available for the deposit, signing and disseminating messages allowing deposits;
- signing the special message allowing anyone to pause deposits once the malicious Node Operator pre-deposits are detected.
Each member must generate an EOA address to sign messages with their private key. The addresses of the committee members will be added to the smart contract.

Main interacting contracts:
`Lido` - The contract contains basic logic for accepting deposits from Ethereum 1.0 and transferring them to Beacon chain.
`NodeOperatorsRegistry` - This contract stores the data on deposits of all validators that will be registered by the protocol. Each deposit data record contains, among other things, the public key of the validator. 
`DepositSecurityModule` - This is a new contract created for committee members and the safe call of the `depositBufferedEther()` function in Lido's contact.
`deposit_contract` - This contract is required for Beacon chain deposits. Made according to the specification https://github.com/ethereum/eth2.0-specs. It hasn't been changed.
`ECDSA` -  A library for getting an address from encoded data. Imported from OpenZeppelin.
`MemUtils`, `Pausable`, `BytesLib` - These contracts contain various helper libraries.

### Scope of the Audit
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/interfaces/INodeOperatorsRegistry.sol
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/lib/MemUtils.sol
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/lib/Pausable.sol
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.6.11/deposit_contract.sol
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/lib/ECDSA.sol
- https://github.com/GNSPS/solidity-bytes-utils/blob/5d251ad816e804d55ac39fa146b4622f55708579/contracts/BytesLib.sol

The audited commit identifier is `5b449b740cddfbef5c107505677e6a576e2c2b69`

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



### Security Assessment Methodology

A group of auditors independently verified the code.

Stages of the audit were as follows:

* Project architecture review
* Checking the code against the checklist of known vulnerabilities
* Checking the code for compliance with the desired security model
* Consolidation of interim auditor reports into general one
* Bug fixing & re-check
* Preparation of the final audit report

## Report

### CRITICAL
Not found


### MAJOR

#### 1. Possible blocking of the contract
##### Description
At the line 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L123 
initializes the `owner` variable without checking the new value of the variable.
If the value of the variable is equal to zero, then the following functions will stop working:
`setOwner()`, `setNodeOperatorsRegistry()`, `setPauseIntentValidityPeriodBlocks()`, `setMaxDeposits()`,
`setMinDepositBlockDistance()`, `setGuardianQuorum()`, `addGuardian()`, `addGuardians()`, `removeGuardian()`, `unpauseDeposits()`.
##### Recommendation
It is necessary to add a check for the value of the `newValue` variable to zero before initializing the `owner` variable.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/dd9925530a704bfa081c32539a8dcb36221ef85d
##### Client's commentary
Resolved.
Sanity check for zero address was added in commit [dd9925530a704bfa081c32539a8dcb36221ef85d](https://github.com/lidofinance/lido-dao/commit/dd9925530a704bfa081c32539a8dcb36221ef85d)


#### 2. Fix gas cost ETH transfer
##### Description
ETH sending at this line 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L301 
uses 2300 gas amount, but gas price can be vary and it is possible that in future it may exceed gas limit.
##### Recommendation
We recommend sending ETH via call.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/cb13efd1506c6d17062ea6812290e15fd80e752e
##### Client's commentary
Resolved.
Transfer was replaced with call in commit [cb13efd1506c6d17062ea6812290e15fd80e752e](https://github.com/lidofinance/lido-dao/commit/cb13efd1506c6d17062ea6812290e15fd80e752e)

### WARNINGS

#### 1. It is required to redo the logic of working with quorum
##### Description
At the following lines there is the value of the `quorum` variable changed:
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L265  when adding one guardian
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L278  when adding multiple guardians
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L265  when removing one guardian

There may even be such a situation that the next such action will set the quorum value equal to `1`.
In this case, it is possible for the `depositBufferedEther()` function to work with the signature of only one guardian.
This disagrees with the documentation https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-5.md:
"To make a deposit, we propose to collect a quorum of 2/3 of the signatures of the committee members".
Currently, the value of the `quorum` variable is not associated with the value of the `guardians` variable.
We recommend doing the following:
- remove the ability to change the variable that affects the quorum when changing the number of guardians
- instead of the `quorum` variable, use the percentage of the number of elements in the `guardians` array
- add a lower bound for the percentage of quorum members and the minimum number of guardians
##### Recommendation
It is necessary to redo the logic of work with quorum counting.
##### Status
Acknowledged
##### Client's commentary
Acknowledged.
LIP 5 contains a proposal for setting the quorum value to 2/3, but it's not constant value and could be changed with DAO voting. All methods that could change quorum value are guarded by DAO voting.


#### 2. Gas overflow during iteration (DoS)
##### Description
Each iteration of the cycle requires a gas flow.
A moment may come when more gas is required than it is allocated to record one block. In this case, all iterations of the loop will fail.
Affected lines:
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L214-L221
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L616-L624
##### Recommendation
It is recommended to limit the number of loop iterations.
##### Status
Acknowledged
##### Client's commentary
Acknowledged.
Each iteration of the loop costs about 30k gas, so this method will fit in the gas limits of the block, even for a couple of hundreds of node operators. Such buffer of node operators amount will do for Lido for long terms.


#### 3. Unused keys trimming doesn't remove keys and signatures from storage
##### Description
This function 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L212 
leave keys data in storage. 
It may be dangerous.
##### Recommendation
We recommend to remove properly.
##### Status
Acknowledged
##### Client's commentary
Acknowledged.
`trimUnusedKeys()` sets the border of storage behind the last used key, so the new keys would rewrite the old ones, and reading not be performed for removed keys. Removing keys from storage is not necessary with the current approach. The actual removal of signing keys will require introducing an additional argument for the method, with the max amount of keys to remove, to fit within the gas limit of a block. It will complicate the process of removing all unused signing keys and will require multiple calls of this method to remove unused keys completely.


#### 4. Possible blocking of work with buffered ETH
##### Description
At the lines 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L252-L262 there's a function `addSigningKeysOperatorBH()`.
This function can be called from any address of operators `[_operator_id].rewardAddress`.
Calling this function increments the value of `KEYS_OP_INDEX_POSITION`. And the current value of `KEYS_OP_INDEX_POSITION` is used here:
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L413-L414.
Thus, any operator (and inactive too) can block the operation of `depositBufferedEther()`.
However, it is safe to do the same with the `addSigningKeys()` function, which can only be called by special users.
##### Recommendation
It is necessary to add a restriction on the call to the `addSigningKeysOperatorBH()` function or remove it from the source code altogether.
##### Status
Acknowledged
##### Client's commentary
Acknowledged.
Attack via `addSigningKeysOperatorBH()` will be really expensive for the malicious node operator, cause one transaction with a call of this method costs about 250k gas. In addition, we can change the reward address of the malicious node operator via the method `setNodeOperatorRewardAddress()` to make it impossible to call this method for the malicious node operator.


#### 5. Superfluous actions when the function is called again
##### Description
At the lines 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L336-L356 there's a call to the `pauseDeposits()` function to set the value of the `paused` variable to `true`.
Now this function will be executed if the value of the `paused` variable is already set to `true`.
Such actions will lead to unnecessary gas consumption.
##### Recommendation
It is necessary to roll back the transaction if the value of the `paused` variable is already set to `true`.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/ac96eb0a9c0c9b8f30ad3b49cf315ec4e9f8c6af
##### Client's commentary
Fixed in `ac96eb0a9c0c9b8f30ad3b49cf315ec4e9f8c6af`. Early return was added instead of reverting the transaction: otherwise, for consistency, all other mutating methods (e.g. setMaxDeposits) would need to be changed to use revert instead of doing nothing.

Also added a clarifying comment in the code. In the fix an attempt to pause already paused deposits is implemented as “no-op” instead of “revert” semantics as it was proposed.
In case of an emergency function pauseDeposits is supposed to be called by all guardians. Thus only the first call will do the actual change. But the other calls would be OK operations from the point of view of protocol’s logic. Thus we have preferred not to use “error” semantics which is implied by require.
  
https://github.com/lidofinance/lido-dao/pull/393. Final commit containing all changes `bcae4249a0d9cf1e92858f92cf9fe5154dff8c21`.  


#### 6. Unnecessary actions
##### Description
At the lines 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L141-L157 there's a call to the `setNodeOperatorActive()` function to set the value of the `operators[_id].active` variable to `_active`.
However, if the value of the variable does not change, you do not need to make a call to the `_increaseKeysOpIndex()` function and record the `NodeOperatorActiveSet` event.
Before line 145, add the following check:
```
    require(operators[_id].active != _active, "SAME_VALUE");
```
And it will be necessary to remove the use of the `if` operator on line 146.   

At the line  
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L166 you need to add a check like this:
```
    require(operators[_id].name != _name, "SAME_VALUE");
```

At the line 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L178 you need to add a check like this:
```
    require(operators[_id].rewardAddress != _rewardAddress, "SAME_VALUE");
```

At the line 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L189 you need to add a check like this:
```
    require(operators[_id].stakingLimit != _stakingLimit, "SAME_VALUE");
```

##### Recommendation
The source code needs to be changed.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/b9bbc48702cf24475c3f1e8cb8259e7175e86783
##### Client's commentary
Fixed in b9bbc48702cf24475c3f1e8cb8259e7175e86783.


#### 7. Guardian zero address check
##### Description
It is possible to add guardian with zero address 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L281.
##### Recommendation
It is recommended to add zero address check
```solidity
require(addr != address(0), "guardian zero address");
```
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/071851dd277308f5565b7b549881373ece98ee2f
##### Client's commentary
Fixed https://github.com/lidofinance/lido-dao/pull/393
Final commit containing all changes bcae4249a0d9cf1e92858f92cf9fe5154dff8c21


#### 8. Variable without visibility modifier
##### Description
Variable [`guardianIndicesOneBased` hasn't visibiltity modifier](https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L61). It is not clear which visibility modifier is default.
##### Recommendation
It is recommended to set visibility to `internal`
```solidity
    mapping(address => uint256) internal guardianIndicesOneBased; // 1-based
```
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/ddb2420a1131ad57eaa73c4fb7476c09625707e5
##### Client's commentary
Fixed in ddb2420a1131ad57eaa73c4fb7476c09625707e5


#### 9. Hardcoded `MAX_BPS`
##### Description
`MAX_BPS` is hardcoded here: 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L189, 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L582, 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L593, 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L599, 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L654, 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L681. 
It is not safe if it may be changed.
##### Recommendation
It is recommended to store `MAX_BPS` as variable.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/6dea01fd491c574a930b6ae22e94be63e5b26c74
##### Client's commentary
Fixed https://github.com/lidofinance/lido-dao/pull/393
Final commit containing all changes bcae4249a0d9cf1e92858f92cf9fe5154dff8c21


#### 10. Possible `uint256` overflow
##### Description
There may be `uint256` overflow 
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L287, 
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L311.
##### Recommendation
It is recommended to use SafeMath.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/0b1e52e15e33fce914c2cd0e235da5a77dde4743
##### Client's commentary
Fixed https://github.com/lidofinance/lido-dao/pull/393
Final commit containing all changes bcae4249a0d9cf1e92858f92cf9fe5154dff8c21


#### 11. Unnecessary staking limit decrease
##### Description
Is not clear why staking limit should be decreased to index 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L627 
If we remove key at index 0 then we will have all keys of this node operator to be used.
##### Recommendation
It is recommended to not decrease staking limit.
##### Status
Acknowledged
##### Client's commentary
We replace the key to be deleted with the latter. And we cut it off just in case, because if we delete the keys, then either the protocol has some serious problem, or this is a large planned operation, and it should include raising the limit.
In theory, it could just be reduced by 1, but the code would be more complicated, and there is little difference in practice.


#### 12. Using unchecked address
##### Description
At the lines:
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L77
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L78
address is not checked before using.
##### Recommendation
It is recommended to check address for zeros.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/bf3c2611f086c891ad8b02dcc21670abb2021533
##### Client's commentary
Fixed https://github.com/lidofinance/lido-dao/pull/393
Final commit containing all changes bcae4249a0d9cf1e92858f92cf9fe5154dff8c21


#### 13. An event is omitted
##### Description
There are omitted events at the lines:
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L425

- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L283
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L406
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L415
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L424
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L429
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L434
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L546
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L656
##### Recommendation
It is recommended to add events.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/0ce2dc2c8e9f7aea92edb6db8a5dccabbba4fb9b
##### Client's commentary
The first event (lastDepositBlock change) is not needed since Lido already emits an event on deposit and the block can be trivially obtained from that event. However, an accessor was added for lastDepositBlock in 7bdd51eeebaf0617be9b5de8dd2789a561a1a04d to provide an easy way to obtain this value onchain.
Further the 9 issues within WRN-13 are numbered in order.


### COMMENTS

#### 1. Can use the constant
##### Description
At the line
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L42 there's a constant `UINT64_MAX` defined.
At the line
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L554 can use this constant.
##### Recommendation
It is recommended to refactor your source code.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/3b11426286aa3605cb26acca1cb6e26e0f7e8fa6
##### Client's commentary
Fixed https://github.com/lidofinance/lido-dao/pull/393
Final commit containing all changes 3b11426286aa3605cb26acca1cb6e26e0f7e8fa6

#### 2. Extra code
##### Description
At the lines in regular methods: 
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L541 
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L566 
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L646
checks are made for the constant `PUBKEY_LENGTH`.

At the lines in regular methods: 
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L567 
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L647 
- https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L646
checks are made for the constant `SIGNATURE_LENGTH`.

It is correct to do these checks before initializing constants.
##### Recommendation
It is recommended to remove the extra code. This will save gas.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/a6d264aef7e2ee22441ec3ef0afb378babecfbf7
##### Client's commentary
Fixed https://github.com/lidofinance/lido-dao/pull/393
Final commit containing all changes a6d264aef7e2ee22441ec3ef0afb378babecfbf7


#### 3. Extra initialization
##### Description
At the lines in the constructor 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L98-L99 
initialization of variables is done.
But initially the variables already have these values.
##### Recommendation
It is recommended to remove the extra code.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/308b8999d51467c5e146e19f62872ff466815f0e.
##### Client's commentary
It's done purely for clarity to make reading the code easier.
Have reconsidered and fixed. 
https://github.com/lidofinance/lido-dao/pull/391
Final commit containing all changes 308b8999d51467c5e146e19f62872ff466815f0e


#### 4. Comment typo error
##### Description
This comment is probably incorrect 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L390. 
##### Recommendation
It is recommended to check for non-equal
```solidity
     *   6. blockhash(blockNumber) != blockHash
```
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/f9ab47ee5dbade5d2aac98961df340e56c290ed2
##### Client's commentary
Fixed in f9ab47ee5dbade5d2aac98961df340e56c290ed2.


#### 5. Storage assigning may be in if statement
##### Description
This assigning can be placed in if statement above 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L154.
##### Recommendation
It is recommended to place in if statement above.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/b9bbc48702cf24475c3f1e8cb8259e7175e86783
##### Client's commentary
Fixed https://github.com/lidofinance/lido-dao/pull/393
Final commit containing all changes b9bbc48702cf24475c3f1e8cb8259e7175e86783


#### 6. Naming variable mistake
##### Description
Because of `_totalRewardShares` not divides for validators but divides for `effectiveStakeTotal` should to rename `perValidatorReward` to `perStakeReward` at `NodeOperatorsRegistry.sol` at line:
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/nos/NodeOperatorsRegistry.sol#L441
##### Recommendation
It is recommended to rename `perValidatorReward` to `perStakeReward`.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/bcae4249a0d9cf1e92858f92cf9fe5154dff8c21
##### Client's commentary
Fixed. Naming of neighbouring variables was incorrect. We’ve replaced effectiveStake with activeValidators thus making naming of perValidatorReward correct.
The fix will be delivered in the next protocol upgrade.
https://github.com/lidofinance/lido-dao/pull/393
Final commit containing all changes bcae4249a0d9cf1e92858f92cf9fe5154dff8c21


#### 7. Omitted description
##### Description
There are no description at `Lido.sol` at `_setTreasury()` function at line:
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L427
At `_setInsuranceFund()` at line:
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L432
At `_distributeNodeOperatorsReward()` at line:
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L611
##### Recommendation
It is recommended to add description.
##### Status
Fixed at https://github.com/lidofinance/lido-dao/commit/d17b86d118206687bcf2a701ebc5a9f2ee85121e.   
##### Client's commentary
Fixed https://github.com/lidofinance/lido-dao/pull/393
Final commit containing all changes d17b86d118206687bcf2a701ebc5a9f2ee85121e

## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| 0
MAJOR   | 2
WARNING | 13
COMMENT | 7

### Conclusion
Smart contracts have been audited and several suspicious places have been detected. During the audit no critical issues were found, two majors, several warnings and comments were spotted. After working on the reported findings all of them were acknowledged or fixed by the client.
<br/>

Final commit identifier with all fixes: `816bf1d0995ba5cfdfc264de4acda34a7fe93eba`
<br/>

The following addresses contain deployed to the Ethereum mainnet and verified smart contracts code that matches audited scope:
<br/>

- Lido.sol : [0xc7b5af82b05eb3b64f12241b04b2cf14469e39f7](https://etherscan.io/address/0xc7b5af82b05eb3b64f12241b04b2cf14469e39f7#code)
- NodeOperatorsRegistry.sol:  [0xec3567ae258639a0ff5a02f7eaf4e4ae4416c5fe](https://etherscan.io/address/0xec3567ae258639a0ff5a02f7eaf4e4ae4416c5fe#code)
- deposit_contract.sol: [0x00000000219ab540356cbb839cbe05303d7705fa](https://etherscan.io/address/0x00000000219ab540356cbb839cbe05303d7705fa#code)
- DepositSecurityModule.sol:  [0xDb149235B6F40dC08810AA69869783Be101790e7](https://etherscan.io/address/0xDb149235B6F40dC08810AA69869783Be101790e7#code)
 