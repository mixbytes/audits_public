#  Easy Track Security Audit Report (merged)

###### tags: `LIDO`

## Introduction

### Project overview
Easy Track motion is a lightweight voting considered to have passed if the minimum objections threshold hasn’t been exceeded. As opposed to traditional Aragon votings, Easy Track motions are cheaper (no need to vote ‘pro’, token holders only have to vote ‘contra’ if they have objections) and easier to manage (no need to ask broad DAO community vote on proposals sparking no debate). Detailed specifications of Easy Track can be found [here](https://github.com/lidofinance/easy-track/blob/master/specification.md#abstract).
More in-depth feauture description and possible use cases can be found in the [official LIP-3 (WIP)](https://github.com/grstepanov/lido-improvement-proposals/blob/lip-003/LIPS/lip-3.md). Community discussion takes place on Lido research forum: [announcement post](https://research.lido.fi/t/lip-3-easy-track-motions-for-dao-routine-operations/680#sanity-and-security-11), [v2 post](https://research.lido.fi/t/lip-3-easy-track-motions-v2/794#proposed-implementation-2).

### Scope of the Audit
The scope of the audit includes the following smart contracts at:
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/ContractProxy.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/EVMScriptFactoriesRegistry.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/EasyTrack.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/EasyTrackStorage.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/EvmScriptExecutor.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/MotionSettings.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/RewardProgramsRegistry.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/TrustedCaller.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/EVMScriptFactories/AddRewardProgram.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/EVMScriptFactories/IncreaseNodeOperatorStakingLimit.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/EVMScriptFactories/RemoveRewardProgram.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/EVMScriptFactories/TopUpLegoProgram.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/EVMScriptFactories/TopUpRewardPrograms.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/libraries/BytesUtils.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/libraries/EVMScriptCreator.sol
https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/libraries/EVMScriptPermissions.sol


The audited commit identifier is `ec694adb872877db814da960d96ce767ccbdf462`, `7acdfe0cc9d0f2fc34b03e094c8225c0c9c659a3` 

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
Not found

### WARNINGS

#### 1. Duplicate voting functionality
##### Description
EVMScriptExecutor has permissions for EasyTrack and Voting contracts to make financial transactions (finance contract). It is possible to create voting in this contracts at the same time. EasyTrack has permissions only for TrustedCaller. In voting contract every token holder able to do it and create Voting with own purposes
at line https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/EvmScriptExecutor.sol#L71
##### Recommendation
We recommend to split up functionality between EasyTrack and Voting contacts
##### Status
Fixed at https://github.com/lidofinance/easy-track/commit/7acdfe0cc9d0f2fc34b03e094c8225c0c9c659a3


#### 2. Missing address validation
##### Description
A delegatecall on an callsScript address always returns true if callsScript is non-contract address.
At line https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/EvmScriptExecutor.sol#L80
##### Recommendation
We recommend making the callsScript address constant or add check that callsScript is contract address in constructor.
##### Status
Fixed at https://github.com/lidofinance/easy-track/commit/7acdfe0cc9d0f2fc34b03e094c8225c0c9c659a3


### COMMENTS
#### 1. No valid params
##### Description
There is some admin methods which don't check values:
* `setMotionDuration` - `_motionDuration` may be too large https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/MotionSettings.sol#L23
* `setMotionsCountLimit` — `_motionsCountLimit` may be zero https://github.com/lidofinance/easy-track/blob/ec694adb872877db814da960d96ce767ccbdf462/contracts/MotionSettings.sol#L40
This allows admin to make an incorrect configuration.
##### Recommendation
If necessary, we recommend to insert additional checks.
##### Status
No issue
##### Client's commentary
Acknowledged, we don't consider this a problem since motions are easy to object and also the complete Easy Track feature can be paused outright.
for _motionsCountLimit – design is intended, since setting limit to zero allows completing all the ongoing motions and prevents creating new ones.

## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| -
MAJOR   | -
WARNING | 2
COMMENT | 1

### Executive summary
Easy Track is strongly inspired by Aragon's Voting and based on Aragon's EVMScripts concept. Execution of EVMScripts is performed by standalone EVMScriptExecutor contract, which can be called only by EasyTrack and Aragon's Voting contracts. Implementation of EVMScriptExecutor used in EasyTrack contract delegates execution of EVMScripts to Aragon's CallsScript executor.

As opposed to Aragon's Voting, EasyTrack contract doesn't allow to pass EVMScripts directly, and uses standalone EVMScript factory contracts to create EVMScripts. EVMScript factory - is a special contract, which implements IEVMScriptFactory interface. Each EVMScript factory has to be registered in the EasyTrack contract before it can be used for motion creation. Registration of EVMScript factory contracts is allowed only to Admins of Easy Track.

Тo enhance the security of Easy Track, each EVMScript factory has its own Permissions set when a new EVMScript factory is being registered in the EasyTrack contract. Permissions is a list of tuples (address, bytes4) encoded into a bytes representation. Each tuple (address, bytes4) describes a method allowed to be called by EVMScript generated by the corresponding EVMScript factory. EasyTrack validates each EVMScript to satisfy permissions and reverts transaction if EVMScript tries to call a method not listed in its permissions.

### Conclusion
Smart contracts have been audited and several suspicious places were found. During the audit no critical or major issues were identified.  Several issues were marked as warnings and comments. After working on audit report all issues were fixed or acknowledged by the client (if the problem was not critical). Thus, contracts are assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `7acdfe0cc9d0f2fc34b03e094c8225c0c9c659a3`