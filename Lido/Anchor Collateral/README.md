# Anchor Collateral Security Audit Report (merged)

###### tags: `LIDO`

## Introduction

### Project overview
Anchor Vault is a smart contract that allows to convert rebasing stETH token into a constant-balance bETH token and periodically send all accrued stETH rewards to the Terra blockchain through a bridge. The bETH token will be used as a collateral in the Terra Anchor protocol.

### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/lidofinance/anchor-collateral-steth/blob/2fed0a0c0ba4ce67c82d0ed49cf6872245f44d20/contracts/AnchorVault.vy
https://github.com/lidofinance/anchor-collateral-steth/blob/2fed0a0c0ba4ce67c82d0ed49cf6872245f44d20/contracts/AnchorVaultProxy.sol
https://github.com/lidofinance/anchor-collateral-steth/blob/2fed0a0c0ba4ce67c82d0ed49cf6872245f44d20/contracts/bEth.vy
https://github.com/lidofinance/anchor-collateral-steth/blob/2fed0a0c0ba4ce67c82d0ed49cf6872245f44d20/contracts/RewardsLiquidator.vy
https://github.com/lidofinance/anchor-collateral-steth/blob/2fed0a0c0ba4ce67c82d0ed49cf6872245f44d20/contracts/InsuranceConnector.vy
https://github.com/lidofinance/anchor-collateral-steth/blob/2fed0a0c0ba4ce67c82d0ed49cf6872245f44d20/contracts/BridgeConnectorWormhole.vy

The audited commit identifier is `2fed0a0c0ba4ce67c82d0ed49cf6872245f44d20`

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
Not found

### COMMENTS


## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| -
MAJOR   | -
WARNING | -
COMMENT | -

### Executive summary

The audited scope implements the RewardsLiquidator, InsuranceConnector and BridgeConnectorShuttle contracts installed as delegates to the AnchorVault contract. These contracts can be replaced by the vault admin. The BridgeConnectorShuttle contract is designed to interoperate with the Shuttle Ethereum-Terra bridge.

### Conclusion
Smart contracts have been audited and no issues were spotted in the code. The contracts are assumed as secure to use according to our security criteria.
Final commit identifier with all fixes: `-`