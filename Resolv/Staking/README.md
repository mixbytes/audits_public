# Resolv Staking Security Audit Report

###### tags: `Resolv`

## 1. INTRODUCTION

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 
    
### 1.2 Executive Summary

Resolv Staking allows users to stake RESOLV tokens and earn rewards over time. The protocol features a weighted average holding period (WAHP) mechanism that provides additional staking incentives based on the duration of staking, along with a withdrawal cooldown system to prevent rapid liquidity outflows.

The audit was conducted by 3 auditors over a period of 3 days, employing automatic and manual code review methods.

Key focus areas during the audit included effective balance calculation, reward distribution mechanics, withdrawal processes, and general access control. The scope excluded external dependencies and focused on the core staking and airdrop functionality.

The code is secure; a previously discovered vulnerability affecting withdrawals has been promptly fixed.

Key notes and recommendations:
- **No reward token removal**. The `ResolvStaking` contract allows adding reward tokens but lacks functionality to remove or disable them.
- **Incentivization of frequent user interaction with the protocol**. The boost is based on WAHP (Weighted Average Holding Period) and updates only when the user interacts with the protocol. If the user is inactive, the boost stays the same. This is a deliberate design choice to encourage regular engagement.
- The `withdraw(claim, receiver)` function reverts when `claim==true` and the global `claimEnabled==false`, due to a check in `checkpoint()`; while not a vulnerability, this may lead to unexpected behavior in integrations that always pass `claim = true`, unless they account for the paused state — one option to improve robustness is to skip the reward claim instead of reverting when `claimEnabled` is `false`.

***
### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client Name| Resolv
Project Name| Resolv Staking
Type| Solidity
Platform| EVM
Timeline| 08.04.2025 - 06.08.2025
    
#### Scope of Audit

File | Link
--- | ---
contracts/staking/ResolvStakingSilo.sol| https://github.com/resolv-im/resolv-contracts/blob/771e82ae7e487d1740a85d80ce96a6f764471419/contracts/staking/ResolvStakingSilo.sol
contracts/staking/ResolvStaking.sol| https://github.com/resolv-im/resolv-contracts/blob/771e82ae7e487d1740a85d80ce96a6f764471419/contracts/staking/ResolvStaking.sol
contracts/staking/libraries/ResolvStakingCheckpoints.sol| https://github.com/resolv-im/resolv-contracts/blob/771e82ae7e487d1740a85d80ce96a6f764471419/contracts/staking/libraries/ResolvStakingCheckpoints.sol
contracts/staking/libraries/ResolvStakingErrors.sol| https://github.com/resolv-im/resolv-contracts/blob/771e82ae7e487d1740a85d80ce96a6f764471419/contracts/staking/libraries/ResolvStakingErrors.sol
contracts/staking/libraries/ResolvStakingEvents.sol| https://github.com/resolv-im/resolv-contracts/blob/771e82ae7e487d1740a85d80ce96a6f764471419/contracts/staking/libraries/ResolvStakingEvents.sol
contracts/staking/libraries/ResolvStakingStructs.sol| https://github.com/resolv-im/resolv-contracts/blob/771e82ae7e487d1740a85d80ce96a6f764471419/contracts/staking/libraries/ResolvStakingStructs.sol
contracts/airdrop/StakedTokenDistributor.sol| https://github.com/resolv-im/resolv-contracts/blob/771e82ae7e487d1740a85d80ce96a6f764471419/contracts/airdrop/StakedTokenDistributor.sol
contracts/staking/ResolvStakingV2.sol | https://github.com/resolv-im/resolv-contracts/blob/f7d7fee7ca456a564fb24b2db5b3f740ef7fa525/contracts/staking/ResolvStakingV2.sol
contracts/ResolvToken.sol | https://github.com/resolv-im/resolv-contracts/blob/f7d7fee7ca456a564fb24b2db5b3f740ef7fa525/contracts/ResolvToken.sol
***
#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
08.04.2025 | 771e82ae7e487d1740a85d80ce96a6f764471419 | Commit for the audit
11.04.2025 | 8eac98d46a46f25303d4832f605e270081bc8322 | Commit for re-audit
29.04.2025 | f1d45d1835c9f61e279a50bae6953f58280dc343 | Commit for re-audit
14.05.2025 | 49969c0e55cdf40236c8530d6b4cbbfa4bf780c9 | Commit for re-audit
24.07.2025 | f7d7fee7ca456a564fb24b2db5b3f740ef7fa525 | Commit for re-audit
28.07.2025 | 2f71574f8d57d9ecac9cbf30dc38064394796f60 | Commit for re-audit


#### Mainnet Deployments

File  | Address | Blockchain
--- | --- | ---
TransparentUpgradeableProxy.sol | [0xFE4BCE4b3949c35fB17691D8b03c3caDBE2E5E23](https://etherscan.io/address/0xFE4BCE4b3949c35fB17691D8b03c3caDBE2E5E23) | Ethereum
ResolvStaking.sol | [0x1d2d1e12db390d5f6046102eee25dbf2cfd827e6](https://etherscan.io/address/0x1d2d1e12db390d5f6046102eee25dbf2cfd827e6) | Ethereum
ProxyAdmin.sol | [0x1400e080850C611920f12D19804e4d2427f85b4D](https://etherscan.io/address/0x1400e080850C611920f12D19804e4d2427f85b4D) | Ethereum
ResolvStakingCheckpoints.sol | [0x253C6e08dB15E2912Cf3aFE5a89F2a7a4d8F2784](https://etherscan.io/address/0x253C6e08dB15E2912Cf3aFE5a89F2a7a4d8F2784) | Ethereum
ResolvStakingSilo.sol | [0x502f9F85770437d102B767D6e311A4560eC88D4f](https://etherscan.io/address/0x502f9F85770437d102B767D6e311A4560eC88D4f) | Ethereum
ResolvStakingHelpers.sol | [0x948AdEd191e90B94fCB94E0e2Aa6775786f17970](https://etherscan.io/address/0x948AdEd191e90B94fCB94E0e2Aa6775786f17970) | Ethereum
ResolvStakingV2.sol | [0xD1062547981471b821755c13CaFa0F13D099705A](https://etherscan.io/address/0xD1062547981471b821755c13CaFa0F13D099705A) | Ethereum

### 1.4 Security Assessment Methodology
    
#### Project Flow

| **Stage** | **Scope of Work** |
|-----------|------------------|
| **Interim Audit** | **Project Architecture Review:**<br> - Review project documentation <br> - Conduct a general code review <br> - Perform reverse engineering to analyze the project’s architecture based solely on the source code <br> - Develop an independent perspective on the project’s architecture <br> - Identify any logical flaws in the design <br> **Objective:** Understand the overall structure of the project and identify potential security risks. |
| **Interim Audit** | **Core Review with a Hacker Mindset:**<br> - Each team member independently conducts a manual code review, focusing on identifying unique vulnerabilities. <br> - Perform collaborative audits (pair auditing) of the most complex code sections, supervised by the Team Lead. <br> - Develop Proof-of-Concepts (PoCs) and conduct fuzzing tests using tools like Foundry, Hardhat, and BOA to uncover intricate logical flaws. <br> - Review test cases and in-code comments to identify potential weaknesses. <br> **Objective:** Identify and eliminate the majority of vulnerabilities, including those unique to the industry. |
| **Interim Audit** | **Code Review with a Nerd Mindset:**<br> - Conduct a manual code review using an internally maintained checklist, regularly updated with insights from past hacks, research, and client audits. <br> - Utilize static analysis tools (e.g., Slither, Mythril) and vulnerability databases (e.g., Solodit) to uncover potential undetected attack vectors. <br> **Objective:** Ensure comprehensive coverage of all known attack vectors during the review process. |
| **Interim Audit** | **Consolidation of Auditors' Reports:**<br> - Cross-check findings among auditors <br> - Discuss identified issues <br> - Issue an interim audit report for client review <br> **Objective:** Combine interim reports from all auditors into a single comprehensive document. |
| **Re-Audit** | **Bug Fixing & Re-Audit:**<br> - The client addresses the identified issues and provides feedback. <br> - Auditors verify the fixes and update their statuses with supporting evidence. <br> - A re-audit report is generated and shared with the client. <br> **Objective:** Validate the fixes and reassess the code to ensure all vulnerabilities are resolved and no new vulnerabilities are added. |
| **Final Audit** | **Final Code Verification & Public Audit Report:**<br> - Verify the final code version against recommendations and their statuses. <br> - Check deployed contracts for correct initialization parameters. <br> - Confirm that the deployed code matches the audited version. <br> - Issue a public audit report, published on our official GitHub repository. <br> - Announce the successful audit on our official X account. <br> **Objective:** Perform a final review and issue a public report documenting the audit. |

### 1.5 Risk Classification

#### Severity Level Matrix

| Severity  | Impact: High | Impact: Medium | Impact: Low |
|-----------|-------------|---------------|-------------|
| **Likelihood: High**   | Critical   | High    | Medium  |
| **Likelihood: Medium** | High       | Medium  | Low     |
| **Likelihood: Low**    | Medium     | Low     | Low     |

#### Impact

- **High** – Theft from 0.5% OR partial/full blocking of funds (>0.5%) on the contract without the possibility of withdrawal OR loss of user funds (>1%) who interacted with the protocol.
- **Medium** – Contract lock that can only be fixed through a contract upgrade OR one-time theft of rewards or an amount up to 0.5% of the protocol's TVL OR funds lock with the possibility of withdrawal by an admin.
- **Low** – One-time contract lock that can be fixed by the administrator without a contract upgrade.

#### Likelihood

- **High** – The event has a 50-60% probability of occurring within a year and can be triggered by any actor (e.g., due to a likely market condition that the actor cannot influence).
- **Medium** – An unlikely event (10-20% probability of occurring) that can be triggered by a trusted actor.
- **Low** – A highly unlikely event that can only be triggered by the owner.

#### Action Required

- **Critical** – Must be fixed as soon as possible.
- **High** – Strongly advised to be fixed to minimize potential risks.
- **Medium** – Recommended to be fixed to enhance security and stability.
- **Low** – Recommended to be fixed to improve overall robustness and effectiveness.

#### Finding Status

- **Fixed** – The recommended fixes have been implemented in the project code and no longer impact its security.
- **Partially Fixed** – The recommended fixes have been partially implemented, reducing the impact of the finding, but it has not been fully resolved.
- **Acknowledged** – The recommended fixes have not yet been implemented, and the finding remains unresolved or does not require code changes.

### 1.6 Summary of Findings

#### Findings Count

| Severity  | Count |
|-----------|-------|
| **Critical** | 0 |
| **High**     | 2 |
| **Medium**   | 0 |
| **Low**      | 2 |

## 2. Findings Report

### 2.1 Critical
Not found.

---

### 2.2 High

#### 1. `checkpoint()` resets `totalEffectiveSupply`

##### Status
Fixed in https://github.com/resolv-im/resolv-contracts/commit/8eac98d46a46f25303d4832f605e270081bc8322

##### Description
When `ResolvStaking.checkpoint()` is called with the zero address as the user, the variable `totalEffectiveSupply` is reset to zero because the function `ResolvStakingCheckpoints.updateEffectiveBalance()` returns zero for the zero address.

- https://github.com/resolv-im/resolv-contracts/blob/530d997b010b803691abab53835ad70f780ac5db/contracts/staking/libraries/ResolvStakingCheckpoints.sol#L128

A hacker can pass the zero address to the `checkpoint()` function via `ResolvStaking.updateCheckpoint()`. Resetting `totalEffectiveSupply` to zero would prevent users from being able to withdraw funds from the contract due to an underflow at the following line:
```solidity
newTotalEffectiveSupply = 
    // (
    _params.totalEffectiveSupply // =0
    - oldEffectiveBalance // >0
    // )
    + newEffectiveBalance;
```
https://github.com/resolv-im/resolv-contracts/blob/530d997b010b803691abab53835ad70f780ac5db/contracts/staking/libraries/ResolvStakingCheckpoints.sol#L163
<br/>
##### Recommendation
1. In `ResolvStakingCheckpoints.updateEffectiveBalance()`, return the current `totalEffectiveSupply` when the user address is zero.
2. Change the order of operations when calculating `newTotalEffectiveSupply`, adding first, subtracting last:
   ```solidity
   newTotalEffectiveSupply = 
       (_params.totalEffectiveSupply + 
        newEffectiveBalance) 
        - oldEffectiveBalance;
   ```

> **Client's Commentary:**
> https://github.com/resolv-im/resolv-contracts/commit/56f2fe95f87a4e1f51221a366efb4fa697fdb2d0

---

#### 2. Self‑transfer inflates effective balance

##### Status
Fixed in https://github.com/resolv-im/resolv-contracts/commit/2f71574f8d57d9ecac9cbf30dc38064394796f60

##### Description

`ResolvStakingV2._update()` calls `checkpoint()` two times *before* the user balance is changed.

For a `transfer(user, user, v)` the first checkpoint sets effective balance to `balanceOf(user) - v`, while the second checkpoint updates the effective balance to `balanceOf(user) + v`. Note that the `balanceOf(user)` stays the same.

This is because both calls  to `updateEffectiveBalance()` use the real balance of the same user which isn't changed:
```
updateEffectiveBalance(
    ...
    userStakedBalance: balanceOf(_user)
    ...
);
```
https://github.com/resolv-im/resolv-contracts/blob/f7d7fee7ca456a564fb24b2db5b3f740ef7fa525/contracts/staking/ResolvStakingV2.sol#L403

The first call to `updateEffectiveBalance()` subtracts the transferred amount `delta` from the `userStakedBalance` (which is `balanceOf(user)`):
```
newStakedBalance = 
    _params.userStakedBalance 
    - SafeCast.toUint256(- _params.delta);
...
newEffectiveBalance = newStakedBalance 
    * boostFactor 
    / ResolvStakingStructs.BOOST_FIXED_POINT;
```
https://github.com/resolv-im/resolv-contracts/blob/f7d7fee7ca456a564fb24b2db5b3f740ef7fa525/contracts/staking/libraries/ResolvStakingCheckpoints.sol#L148-L149

The second call to `updateEffectiveBalance()` adds the transferred amount `delta` to the `userStakedBalance` (which is still `balanceOf(user)`):
```
newStakedBalance = 
    _params.userStakedBalance +      
    SafeCast.toUint256(_params.delta)
...
newEffectiveBalance = 
    newStakedBalance 
    * boostFactor 
    / ResolvStakingStructs.BOOST_FIXED_POINT;
```
https://github.com/resolv-im/resolv-contracts/blob/f7d7fee7ca456a564fb24b2db5b3f740ef7fa525/contracts/staking/libraries/ResolvStakingCheckpoints.sol#L147

This allows an attacker to double their effective balance by doing a self-to-self transfer.

**Example:**

*Case 1. Without attack:*

1. Attacker stakes 1 000 RESOLV → Effective Balance 1 000.
2. Others hold Effective Balance 9 000.
3. Total Effective Balance 10 000.
4. Distributor adds 10 000 Rewards.
5. Attacker share = 1 000 / 10 000 = 10 % → receives 1 000 Rewards.

*Case 2. With attack:*
1. Stake 1 000 RESOLV.
2. Call `transfer(msg.sender, msg.sender, 1_000)` → Effective Balance jumps to 2 000.
3. Distributor deposits 10 000 Rewards; attacker share = 2 000 / 11 000 ≈ 18 % ⇒ 1 800 Rewards.
4. Execute `claim()` to collect 1 800 Rewards.
5. Repeat step 2 before every new reward deposit to keep the boost.


##### Recommendation

We recommend skipping all logic when `_from == _to`.

> **Client's Commentary:**
> https://github.com/resolv-im/resolv-contracts/pull/383

---

### 2.3 Medium

Not found.

---

### 2.4 Low

#### 1. No restriction on emergency withdrawal of `RESOLV` staking tokens

##### Status
Acknowledged
##### Description

`ResolvStaking` and `ResolvStakingSilo` have a function `emergencyWithdrawERC20()`, which allows the admin to withdraw `RESOLV` tokens from the contract.
- https://github.com/resolv-im/resolv-contracts/blob/530d997b010b803691abab53835ad70f780ac5db/contracts/staking/ResolvStaking.sol#L212
- https://github.com/resolv-im/resolv-contracts/blob/530d997b010b803691abab53835ad70f780ac5db/contracts/staking/ResolvStakingSilo.sol#L33

The ability to withdraw `RESOLV` tokens (the main staking asset) via this function may present centralization concerns, as it could allow administrators to remove staked user funds.
<br/>
##### Recommendation
We recommend restricting the emergency withdrawal function from transferring out the main staking asset.

> **Client's Commentary:**
> Acknowledged

---


#### 2. Incomplete reward balance check

##### Status
Fixed in https://github.com/resolv-im/resolv-contracts/commit/8eac98d46a46f25303d4832f605e270081bc8322
##### Description
The condition
```solidity
reward.token.balanceOf(address(this)) > reward.rewardRate * duration
```
fails when the balance is exactly sufficient. Since the multiplication could be precise, `>=` should be used.

- https://github.com/resolv-im/resolv-contracts/blob/6dc09abb178de6173b92c7961396e409e131c355/contracts/staking/ResolvStaking.sol#L172

##### Recommendation
We recommend replacing `>` with `>=` to allow exact-match balances.

> **Client's Commentary:**
> https://github.com/resolv-im/resolv-contracts/commit/8eac98d46a46f25303d4832f605e270081bc8322

---

## 3. About MixBytes
    
MixBytes is a leading provider of smart contract audit and research services, helping blockchain projects enhance security and reliability. Since its inception, MixBytes has been committed to safeguarding the Web3 ecosystem by delivering rigorous security assessments and cutting-edge research tailored to DeFi projects.
    
Our team comprises highly skilled engineers, security experts, and blockchain researchers with deep expertise in formal verification, smart contract auditing, and protocol research. With proven experience in Web3, MixBytes combines in-depth technical knowledge with a proactive security-first approach.
    
#### Why MixBytes?
    
- **Proven Track Record:** Trusted by top-tier blockchain projects like Lido, Aave, Curve, and others, MixBytes has successfully audited and secured billions in digital assets.
- **Technical Expertise:** Our auditors and researchers hold advanced degrees in cryptography, cybersecurity, and distributed systems.
- **Innovative Research:** Our team actively contributes to blockchain security research, sharing knowledge with the community.
    
#### Our Services
- **Smart Contract Audits:** A meticulous security assessment of DeFi protocols to prevent vulnerabilities before deployment.
- **Blockchain Research:** In-depth technical research and security modeling for Web3 projects.
- **Custom Security Solutions:** Tailored security frameworks for complex decentralized applications and blockchain ecosystems.
    
MixBytes is dedicated to securing the future of blockchain technology by delivering unparalleled security expertise and research-driven solutions. Whether you are launching a DeFi protocol or developing an innovative dApp, we are your trusted security partner.


### Contact Information

- [**Website**](https://mixbytes.io/)  
- [**GitHub**](https://github.com/mixbytes/audits_public)  
- [**X**](https://x.com/MixBytes)  
- **Mail:** [hello@mixbytes.io](mailto:hello@mixbytes.io)  