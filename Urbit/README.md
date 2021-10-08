# Stardust Security Audit Report (merged)

###### tags: `Urbit`

## Introduction

### Project overview

Azimuth is a general-purpose PKI ("public key infrastructure") that Urbit uses as an identity system. This system is implemented as a suite of smart contracts on the Ethereum blockchain, and it determines which Ethereum addresses own which Urbit planets, stars, or galaxies. In Arvo, a single identity is called a "ship," whereas in Azimuth, a single identity is called a "point." 


### Scope of the Audit
The scope of the audit includes the following smart contracts at:

https://github.com/ransonhobbes/stardust/blob/c446b1f12f53fa75ea6c347daee1e15df562a81d/contracts/Treasury.sol
https://github.com/ransonhobbes/stardust/blob/c446b1f12f53fa75ea6c347daee1e15df562a81d/contracts/StarToken.sol
https://github.com/ransonhobbes/stardust/blob/c446b1f12f53fa75ea6c347daee1e15df562a81d/contracts/wrapper/AzimuthWrapper.sol
https://github.com/ransonhobbes/stardust/blob/c446b1f12f53fa75ea6c347daee1e15df562a81d/contracts/wrapper/ClaimsWrapper.sol
https://github.com/ransonhobbes/stardust/blob/c446b1f12f53fa75ea6c347daee1e15df562a81d/contracts/wrapper/EclipticWrapper.sol
https://github.com/ransonhobbes/stardust/blob/c446b1f12f53fa75ea6c347daee1e15df562a81d/contracts/wrapper/PollsWrapper.sol
https://github.com/ransonhobbes/stardust/blob/c446b1f12f53fa75ea6c347daee1e15df562a81d/contracts/interface/IAzimuth.sol
https://github.com/ransonhobbes/stardust/blob/c446b1f12f53fa75ea6c347daee1e15df562a81d/contracts/interface/IEcliptic.sol

The audited commit identifier is `c446b1f12f53fa75ea6c347daee1e15df562a81d`

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
#### 1. Use `external` instead of `public` modifier
##### Description
At line:
https://github.com/ransonhobbes/stardust/blob/c446b1f12f53fa75ea6c347daee1e15df562a81d/contracts/Treasury.sol#L79
https://github.com/ransonhobbes/stardust/blob/c446b1f12f53fa75ea6c347daee1e15df562a81d/contracts/Treasury.sol#L120
##### Recommendation
We recommend using `external` instead of `public` modifier for `deposit` and `redeem` functions because they are not called internally.
##### Status
Acknowledged




## Results

### Findings list

Level | Amount
--- | ---
CRITICAL| -
MAJOR   | -
WARNING | -
COMMENT | 1

### Executive summary

The audited scope implements the smart contracts which deposit/reedem user azimuth stars for star tokens. 

### Conclusion
Smart contract has been audited and no suspicious places have been spotted. During the audit no critical or major issues were found. One comment was marked and discussed with the client. After working on the reported finding it was acknowledged by the client, as the problem was not critical. So, the contract is assumed as secure to use according to our security criteria.

Final commit identifier with all fixes: `-`