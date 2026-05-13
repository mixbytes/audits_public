# Shift DeFi Platform Security Audit Report

###### tags: `Shift`

## 1. Introduction

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 

    
### 1.2 Executive Summary

Shift DeFi platform is a cross-chain yield aggregator where users deposit a notion token into a share-based Vault to earn yield and receive shares upon deposit. Deposits and withdrawals are processed in batches across multiple containers. Each container allocates and redeems funds in different strategies, either on its local chain or across blockchains. Cross-chain messaging and token transfers are performed through LayerZero OApp, CCTP v2, and Across bridges. The platform also integrates swap adapters that interface with protocols such as Uniswap V3 and 1inch for token swaps.

The interim audit took 20 days and was carried out by 3 auditors using manual code review and static analysis. All re-audit stages are documented in detail in the Versions Log.

In this audit, we focused on attack scenarios targeting the core protocol logic as well as the project’s interactions with its integrations. In addition, we applied our internal checklist covering various attack vectors such as reentrancy, access control, integer overflows, rounding errors, and others.

Strategy implementations that are direct inheritors of `StrategyTemplate` were out of scope for this audit. We recommend that they be audited separately and that their compatibility with in-scope contracts be explicitly verified, including integration tests, access control assumptions, and handling of edge cases.

Below we set out our overall assessment, key assumptions, and main recommendations.

- **Overall Assessment.** The codebase is structured and the main deposit, withdrawal, and cross-chain flows are generally well implemented. A large share of the findings, however, relate to Repairing Mode and emergency or edge-case paths. We recommend revisiting the design of Repairing Mode and related recovery flows, tightening invariants and access control there, and adding tests and documentation for those scenarios. By the time of the reaudit, the Repairing Mode design had been revisited architecturally and the test suite had been improved.

- **Notion Token.** Accounting in the Vault assumes that the amount transferred equals the amount received. With fee-on-transfer or rebasing tokens, this invariant breaks. The protocol is intended to be used with standard ERC-20 notion tokens (no transfer hooks, fee-on-transfer, or rebasing).

- **Bridge Adapters.** The project integrates multiple bridge adapters. Several issues related to the bridge adapters were identified by the audit team. Besides fixing these issues, we strongly recommend that the development team ensure they are fully familiar with the logic of each bridge they integrate. A complete understanding of how each bridge works—message formats, attestation flow, finality, and edge cases—is essential to avoid integration bugs.

- **LayerZero DVNs.** The security of each production LayerZero route depends directly on the selected DVN configuration. We recommend using multiple independent DVNs per route, rather than relying on a single verifier or a tightly concentrated verifier set.

- **CustomPool.** `CustomPool` is a swap adapter that quotes at a protocol-set exchange rate when there is no liquid market on a chain. The pool must be pre-funded with the output token. It does not provide liquidity itself and only applies the configured rate to existing reserves. The exchange rate is set by TOKEN_MANAGER_ROLE with no on-chain bounds, so the token manager can set an arbitrary rate and drain the pre-funded balance. The audit assumes the token manager is trusted and that pre-funded amounts are acceptable given this trust model.

- **Bridge Adapter Refunds and retryBridge.** In adapters such as Across, failed bridge operations can result in refunds to the depositor. Because the adapter both receives and sends funds, unclaimed incoming balances can mix with refunds. A mistaken privileged `BridgeAdapter.retryBridge()` call can then irreversibly re-bridge unrelated funds. We recommend ensuring that `BridgeAdapter.retryBridge()` is only invoked when the adapter balance is unambiguous, or considering separation of refund and incoming flows to avoid this risk.

- **Repairing Mode.** Repairing Mode is currently associated with a large number of findings in this audit. We recommend that the team revisit the design and behavior of Repairing Mode: simplify the state transitions where possible, tighten access and invariants, and ensure that user recovery paths and operator responsibilities are clearly defined and tested. By the time of the reaudit, Repairing Mode had been revisited architecturally: the related logic had been removed from the codebase, and all findings in this report that depended on Repairing Mode had been fixed.

- **Asynchronous Share Minting.** The protocol mints user shares asynchronously: the user deposits funds but does not receive shares immediately and can only claim them after some time. During this interval the user does not hold shares yet and is exposed—if something goes wrong (e.g. protocol failure, bridge or container issue), they may incur significant losses. It may be worth considering an architecture where shares are minted synchronously at deposit time (e.g. using external oracles to determine share allocation immediately).

- **Roles and Access Control.** The project uses a role-based access control system. The operator role currently has broad decision-making power and can call many different functions across the protocol. We recommend considering a dedicated role for executing swaps on containers, so that swap-related permissions can be scoped and the operator’s blast radius is reduced. We also recommend paying close attention to whom each role is granted: carefully vet addresses before assigning roles and follow best practices such as using multisig for privileged roles to reduce single points of failure. A two-step (propose/accept) process for setting critical parameters can reduce both the risk of mistakes and malicious actions. A timelock for critical parameter changes may help mitigate the risks associated with centralization by giving users and the community time to react before changes take effect.

- **LayerZero EID–ChainId Mapping Integrity**. `ShiftOApp.setEidAndChainId()` does not validate whether a mapping for the given `EID` or chain ID already exists. If called twice with conflicting values for the same chain ID, the bidirectional mapping becomes inconsistent: `eidToChainId` retains the stale entry for the old `EID` while `chainIdToEid` is overwritten with the new one. As a result, `_validateEid()` will reject the old `EID`, causing `setSendLibrary` / `setReceiveLibrary` calls for that `EID` to revert. In practice this requires an operator misconfiguration, since LayerZero assigns each chain a single immutable `EID`. We recommend either preventing overwriting existing entries (requiring explicit removal first) or automatically clearing stale reverse-mapping entries on update.

- **Role Revocation Across Independently Deployed Contracts.** The same logical role names (`OPERATOR_ROLE`, `RESHUFFLING_EXECUTOR_ROLE`, and similar) appear on multiple contracts that are deployed separately, each with its own `AccessControl` / `AccessControlUpgradeable` storage. Revoking or rotating a role on one contract does not affect the others: an address removed from one deployment may still act on another. That is mainly an operational and governance risk, not a defect in any single contract’s access checks. We recommend maintaining a written procedure for role changes that lists every contract instance and requires synchronized `revokeRole` / `grantRole` updates, or, if stronger guarantees are desired, a centralized role source (registry or shared module) so policy is not split across unrelated deployments.

### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client | Shift
Category| Yield Aggregator
Project | DeFi Platform
Type| Solidity
Platform| EVM
Timeline| 12.01.2026 - 01.05.2026
    
#### Scope of Audit
File | Link
--- | ---
contracts/libraries/helpers/Errors.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/libraries/helpers/Errors.sol
contracts/libraries/helpers/EnumerableAddressSetExtended.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/libraries/helpers/EnumerableAddressSetExtended.sol
contracts/libraries/helpers/RingCacheLibrary.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/libraries/helpers/RingCacheLibrary.sol
contracts/libraries/helpers/Common.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/libraries/helpers/Common.sol
contracts/libraries/StrategyStateLib.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/libraries/StrategyStateLib.sol
contracts/libraries/Codec.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/libraries/Codec.sol
contracts/priceOracles/ChainlinkOracleWrapper.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/priceOracles/ChainlinkOracleWrapper.sol
contracts/priceOracles/CustomOracleWrapper.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/priceOracles/CustomOracleWrapper.sol
contracts/SwapRouter.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/SwapRouter.sol
contracts/ContainerLocal.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/ContainerLocal.sol
contracts/MessageRouter.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/MessageRouter.sol
contracts/Vault.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/Vault.sol
contracts/BridgeAdapter.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/BridgeAdapter.sol
contracts/StrategyContainer.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/StrategyContainer.sol
contracts/ReshufflingGateway.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/ReshufflingGateway.sol
contracts/ContainerPrincipal.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/ContainerPrincipal.sol
contracts/ContainerAgent.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/ContainerAgent.sol
contracts/PriceOracleAggregator.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/PriceOracleAggregator.sol
contracts/Container.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/Container.sol
contracts/StrategyTemplate.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/StrategyTemplate.sol
contracts/CrossChainContainer.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/97902065282e09e938698b88b601d1c0a04914db/contracts/CrossChainContainer.sol
contracts/UniswapV3Adapter.sol | https://github.com/ShiftDeFi/shift-defi-swap-adapters/blob/219071983405befbe221fe3f57e5c33ee29fc770/contracts/UniswapV3Adapter.sol
contracts/UniversalAdapter.sol | https://github.com/ShiftDeFi/shift-defi-swap-adapters/blob/219071983405befbe221fe3f57e5c33ee29fc770/contracts/UniversalAdapter.sol
contracts/CustomPool.sol | https://github.com/ShiftDeFi/shift-defi-swap-adapters/blob/219071983405befbe221fe3f57e5c33ee29fc770/contracts/CustomPool.sol
contracts/OneInchAdapter.sol | https://github.com/ShiftDeFi/shift-defi-swap-adapters/blob/219071983405befbe221fe3f57e5c33ee29fc770/contracts/OneInchAdapter.sol
contracts/ShiftOApp.sol | https://github.com/ShiftDeFi/shift-defi-message-adapter-lz-v2/blob/0606e3feab30b4d3973056ca35edbc35f43955c9/contracts/ShiftOApp.sol
contracts/CCTPv2BridgeAdapter.sol | https://github.com/ShiftDeFi/shift-defi-bridge-adapter-cctp-v2/blob/c3981ad0c9400c9abb8e11d0a418a87494ba643e/contracts/CCTPv2BridgeAdapter.sol
contracts/AcrossBridgeAdapter.sol | https://github.com/ShiftDeFi/shift-defi-bridge-adapter-across-v3/blob/f40ddaca4215dd4acf7006b72144c8b94a047b1f/contracts/AcrossBridgeAdapter.sol
contracts/libraries/Common.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/8392c1b37650ad2a8f64f046742573057e8d6002/contracts/libraries/Common.sol
contracts/libraries/EnumerableAddressSetExtended.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/8392c1b37650ad2a8f64f046742573057e8d6002/contracts/libraries/EnumerableAddressSetExtended.sol
contracts/libraries/Errors.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/8392c1b37650ad2a8f64f046742573057e8d6002/contracts/libraries/Errors.sol
contracts/libraries/RingCacheLib.sol | https://github.com/ShiftDeFi/shift-defi-platform/blob/8392c1b37650ad2a8f64f046742573057e8d6002/contracts/libraries/RingCacheLib.sol

#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
12.01.2026 | 97902065282e09e938698b88b601d1c0a04914db | Initial Commit (platform)
12.01.2026 | 219071983405befbe221fe3f57e5c33ee29fc770 | Initial Commit (swap-adapters)
12.01.2026 | 0606e3feab30b4d3973056ca35edbc35f43955c9 | Initial Commit (lz-v2)
12.01.2026 | c3981ad0c9400c9abb8e11d0a418a87494ba643e | Initial Commit (cctp-v2)
12.01.2026 | f40ddaca4215dd4acf7006b72144c8b94a047b1f | Initial Commit (across-v3)
26.03.2026 | 98f9ff21f9d2bf893ec47ddce148cfb0f3891ef2 | Commit for re-audit (lz-v2)
26.03.2026 | 85d41f98ac86322d3576c18a92b1a9176b5b67cb | Commit for re-audit (cctp-v2)
26.03.2026 | 59c80e131c023eb7c9dd6fef26e67622d46d3bba | Commit for re-audit (across-v3)
26.03.2026 | 3e47d624d1c8084544d16c40622e5dc6666c9e76 | Commit for re-audit (swap-adapters)
26.03.2026 | f3db81e97346ad5a6fb7846ed934e5fb03d8a105 | Commit for re-audit (platform)
03.04.2026 | 8392c1b37650ad2a8f64f046742573057e8d6002 | Commit for re-audit (platform)
17.04.2026 | 79ca6dc8623bbdd1a4aa9d616a1a4514f9799b72 | Commit for 2nd re-audit (platform)
17.04.2026 | fe689dbda59d9c8865cb719cd76ff72700881fcf | Commit for 2nd re-audit (lz-v2)
17.04.2026 | a9c4897463bd62763f562ea581cc3ebf903f34dc | Commit for 2nd re-audit (cctp-v2)
17.04.2026 | 241d66710ccd005fa7c11b0b3390f849f9b0bb5f | Commit for 2nd re-audit (across-v3)
01.05.2026 | c9d848e18ef820c3ae093e6b6af6b2cf220aac57 | Low-43 fix commit (platform) 

#### Mainnet Deployments

At this stage, the contracts have not yet been deployed. Verification that the deployed contracts correspond to the audited code will be conducted once the client provides the addresses of the deployed contracts.
    
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
| **Critical** | 1 |
| **High**     | 11 |
| **Medium**   | 6 |
| **Low**      | 43 |

## 2. Findings Report

### 2.1 Critical

#### 1. Reshuffling Gateway Assets Can Be Drained via Share Transfer

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002
##### Description  
The `RepairingMode` exit mechanism allows users to drain the `ReshufflingGateway` of recovered assets by repeatedly transferring their vault shares to new addresses and claiming.

In `Vault.claimReshufflingGateway()`, the contract checks if an address has already claimed using a simple mapping:

```solidity
require(!_hasClaimedReshufflingGateway[account], AlreadyClaimed());
_hasClaimedReshufflingGateway[account] = true;
IReshufflingGateway(reshufflingGateway).withdraw(account);
```

The `ReshufflingGateway.withdraw()` function calculates the amount of tokens to send based on the user's current vault share balance:

```solidity
uint256 shares = IERC20(vault).balanceOf(account);
uint256 totalShares = IERC20(vault).totalSupply();
// ...
uint256 amount = balance.mulDiv(shares, totalShares);
```

Crucially, vault shares are never burned or locked during this process. An attacker can:
1. Call `claimReshufflingGateway()` to receive their pro-rata share of the gateway's current assets.
2. Transfer their vault shares to a fresh address they control.
3. Call `claimReshufflingGateway()` from the new address to receive the pro-rata share again.
4. Repeat this process until the `ReshufflingGateway` is drained.

This issue is classified as **Critical** severity because it enables complete theft of assets held in the `ReshufflingGateway` with no possibility of recovery.

##### Recommendation
We recommend burning the user's vault shares within the `Vault.claimReshufflingGateway()` function after calling the gateway. 



---

### 2.2 High

#### 1. Strategy and Vault Can Be Bricked due to State Desync in Emergency Exit

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
A logic flaw in the interaction between `StrategyTemplate` and `StrategyContainer` during emergency situations can lead to a strategy being permanently locked in NAV resolution mode, rendering it unusable and its funds unreachable via normal operations.

The issue resides in the `StrategyTemplate.emergencyExit()` function:

```solidity
vars.isResolvingEmergency =
    IStrategyContainer(_strategyContainer).isResolvingEmergency();
...
if (!vars.isResolvingEmergency) {
    IStrategyContainer(_strategyContainer).startEmergencyResolution();
}
if (!_navResolutionMode) {
    _setNavResolutionMode(true);
}
```

The function only calls `startEmergencyResolution()` on the container if the container is not already in emergency mode. However, the container's `startEmergencyResolution()` is responsible for setting the specific strategy's bit in the `_strategyUnresolvedNavBitmask`.

**Example Scenario:**
1. Strategy A enters emergency mode. The Container sets `_isResolvingEmergency = true` and sets the bit for Strategy A in its `_strategyUnresolvedNavBitmask`.
2. Strategy B subsequently calls `emergencyExit()`.
3. Strategy B observes that `isResolvingEmergency()` is already `true` (due to Strategy A), so it skips the call to `container.startEmergencyResolution()`.
4. Strategy B sets its internal flag `_navResolutionMode = true`.
5. The Container now has `_isResolvingEmergency = true` but its `_strategyUnresolvedNavBitmask` only contains the bit for Strategy A.
6. The `Emergency Manager` resolves Strategy A. The `_strategyUnresolvedNavBitmask` in the container becomes 0.
7. The `Emergency Manager` calls `completeEmergencyResolution()`. Since the `_strategyUnresolvedNavBitmask` is 0, the function succeeds and sets `_isResolvingEmergency = false`.
8. The Container is back in normal mode, but Strategy B is still stuck with `_navResolutionMode = true`.

Any attempt to fix Strategy B via `acceptNav()` will fail. `acceptNav()` calls `container.resolveStrategyNav()`, which reverts if the strategy's bit is not set in the container's bitmask. Since the bit for Strategy B was never set, it can never be cleared, and `_navResolutionMode` will remain `true`, blocking `harvest()`, `enter()` and `exit()` operations.

The impact is not limited to the container and can escalate to a permanent deadlock of the entire Vault system. When a deposit batch starts, the Vault's status becomes `DepositBatchProcessingStarted`. It can only return to `Idle` via `resolveDepositBatch()`, which requires `isDepositReportComplete()`, meaning every registered container must call `reportDeposit()`. The bricked strategy prevents the container from ever reaching the `AllStrategiesEntered` status required to call `vault.reportDeposit()`. 

There is no escape mechanism:
- The Vault has no "emergency reset" function for a batch in progress.
- `removeContainer` or `setContainerWeights` (to remove the dead container) both require the Vault to be in `Idle` status.
- The Vault cannot reach `Idle` because the container is stuck.
- The container cannot be reset or have its strategy removed because it is not in `Idle` status.

This issue is classified as **High** severity because in the worst case the entire batch and Vault are deadlocked and protocol funds are blocked until admin recovery via contract upgrade, while in the best case only a single strategy is bricked and its funds remain locked.

##### Recommendation
We recommend removing the conditional check in `StrategyTemplate.emergencyExit()` and always calling `startEmergencyResolution()` to ensure every strategy that enters emergency mode is correctly registered in the container's bitmask.

```solidity
// StrategyTemplate.sol

// Remove: if (!vars.isResolvingEmergency) {
IStrategyContainer(_strategyContainer).startEmergencyResolution();
// }
```



---

#### 2. Unauthorized Claim on Behalf of Users Leads to Fund Loss in Repairing Mode

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
The `Vault.claimReshufflingGateway()` function allows any caller to trigger a claim on behalf of any other user. When the manager activates repairing mode, an attacker can immediately monitor the transaction and, before recovered funds are fully transferred to the `ReshufflingGateway`, call `claimReshufflingGateway(user_address)` for each shareholder. Since the gateway is empty or only partially funded at that moment, users receive 0 or a fraction of their funds, but their `_hasClaimedReshufflingGateway` flag is set to `true`, permanently blocking them from future recoveries.

```solidity
function claimReshufflingGateway(address account) external nonReentrant {
    require(isRepairing, NotInRepairingMode());
    require(!_hasClaimedReshufflingGateway[account], AlreadyClaimed());

    _hasClaimedReshufflingGateway[account] = true;

    IReshufflingGateway(reshufflingGateway).withdraw(account);
    emit ReshufflingGatewayClaimed(account);
}
```

This issue is classified as **High** severity because it can potentially block up to 100% of user funds from being claimed through the normal flow and can be triggered by any actor. The blocked funds remain on the gateway contract and they can be recovered only by upgrading the gateway contract and then distributing them to affected users via a separate claim or distribution mechanism.

##### Recommendation
We recommend restricting the `claimReshufflingGateway()` function so that users can only claim for themselves, and ensuring that the call reverts if no funds were actually transferred.



---

#### 3. Vault DoS When Container Is Added during Active Batch

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
The `Vault.addContainer()` function allows the `CONTAINER_MANAGER_ROLE` to add a new container to the protocol at any time, regardless of the current vault status. If a container is added while a deposit or withdrawal batch is in progress (i.e., status is not `Idle`), it leads to a denial of service for the vault.

The vault tracks batch completion using a bitmask-based approach in the `isDepositReportComplete()` and `isWithdrawReportComplete()` functions:

```solidity
function isDepositReportComplete() public view returns (bool) {
    return _depositReportBitmask == (1 << _containers.length()) - 1;
}

function isWithdrawReportComplete() public view returns (bool) {
    return _withdrawReportBitmask == (1 << _containers.length()) - 1;
}
```

**Example Scenario:**
1. If a container is added when `status != Idle`, the `_containers.length()` increases immediately.
2. The completion check functions now expect an additional bit in the bitmask corresponding to the new container.
3. However, the newly added container was not part of the active batch when the batch started (e.g., in `startDepositBatchProcessing` or `startWithdrawBatchProcessing`), so it will never be asked to report and thus will never update the bitmask.
4. The `resolveDepositBatch()` or `resolveWithdrawBatch()` functions will revert indefinitely because the report will never be "complete".
5. There is no way to reset the status to `Idle` once the vault is stuck:
    - `skipDepositBatch()` requires `status == Idle`.
    - `skipWithdrawBatch()` requires `status == DepositBatchProcessingFinished`.
    - `resolveDepositBatch()` and `resolveWithdrawBatch()` are the only functions that transition the state forward, but they are both blocked by the bitmask check.
6. To fix this, an administrator might try to remove the new container or change its weight using `setContainerWeights()`. However, `setContainerWeights()` also requires `status == VaultStatus.Idle`, which is impossible to reach since the current batch cannot be resolved.

This issue is classified as **High** severity because the vault is put under permanent DoS, funds on the contract are fully blocked from withdrawal through normal flow, and the only way for an admin to recover them is to upgrade the affected contracts.

##### Recommendation
We recommend adding a status check to the `addContainer()` function to ensure it can only be called when the vault is in the `Idle` state.



---

#### 4. Users Lose Rights to Future Recovered Assets After First Claim in Repairing Mode

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
The `RepairingMode` claiming mechanism prevents users from claiming their share of assets that arrive in the `ReshufflingGateway` after their first claim, leading to loss of funds.

The `Vault.claimReshufflingGateway()` function uses a one-time boolean flag per account:

```solidity
require(!_hasClaimedReshufflingGateway[account], AlreadyClaimed());
_hasClaimedReshufflingGateway[account] = true;
```

The admin first enables repairing mode and after that recovered funds start arriving at the `ReshufflingGateway`. When a user sees that they can claim their share, they may claim once (e.g., after the first batch has arrived) and assume they will be able to claim again when more funds arrive later. However, the flag is set to `true` on the first claim, so any later call to `claimReshufflingGateway()` will revert. That user thus loses the right to their share of funds that arrive after their first claim; those funds remain stuck for them.

This issue is classified as **High** severity because it causes a lock of user funds until admin recovery via contract upgrade, and recovery requires the admin to set up a complex token distribution mechanism for affected users.

##### Recommendation
We recommend reconsidering the repairing-mode flow at an architectural level, as it currently exhibits multiple design issues. For this specific finding, we recommend considering an approach where recovered funds first arrive at the gateway, then the admin explicitly approves or confirms that all expected funds have arrived, and only after that confirmation are users allowed to claim via `claimReshufflingGateway()`. That way users claim once against the full recovered amount and do not lose access to funds that would otherwise arrive later.



---

#### 5. Inconsistent Claim Logic between `claimDeposit()` and `claimReshufflingGateway()` Leads to Fund Loss

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
The interaction between `claimDeposit()` and `claimReshufflingGateway()` in `RepairingMode` creates an inconsistency that can lead to loss of user funds and locked assets in the `ReshufflingGateway`.

When a user has unclaimed deposits (`pendingBatchDeposits[batchId][user] > 0`) but calls `claimReshufflingGateway()` before `claimDeposit()`:
   - `ReshufflingGateway.withdraw()` calculates the user's share based on their current `balanceOf(user)` only.
   - This balance can be lower than the user's effective share ownership, because additional shares are still pending inside the Vault (not yet transferred to the user) until `claimDeposit()` is called.
   - As a result, the user claims from the gateway as if they own only the currently-held shares, while they may later receive additional shares from unclaimed deposits.
   - The flag `_hasClaimedReshufflingGateway[user] = true` is set, preventing future gateway claims.
   - The user can then call `claimDeposit()` to receive the remaining shares, but they cannot claim from the gateway again to receive the portion of gateway funds corresponding to these newly claimed shares.

**Example Scenario:**
1. User already has 100 shares on their wallet from previously claimed batches.
2. User also has an additional deposit that would mint 200 shares: either the shares are already on the Vault from a resolved batch and the user has not called `claimDeposit()` yet, or (more realistically) the batch is not yet processed and the user will be able to claim those shares once it is resolved.
3. User calls `claimReshufflingGateway()` first and gateway payout is calculated only for the 100 wallet shares, and `_hasClaimedReshufflingGateway[user]` is set to `true`.
4. User then calls `claimDeposit()` and receives the additional 200 shares on their wallet.
5. User cannot claim from the gateway again for the 200 shares, resulting in loss of the corresponding portion of gateway funds.

This issue is classified as **High** severity because it leads to loss of user funds, and the problem can only be resolved potentially by upgrading the contracts. 

##### Recommendation
We recommend reconsidering the RepairingMode flow at an architectural level, as it currently exhibits multiple design shortcomings. There is no trivial fix for this ordering issue because the final share balance is only known after the deposit batch is resolved and `Vault.claimDeposit()` is executed, while in RepairingMode a batch may never become claimable.

When addressing this issue, the team may consider one or a combination of the following approaches:

- Enforcing ordering only when possible: block `Vault.claimReshufflingGateway()` only while the user has unclaimed deposits in resolved batches, forcing `Vault.claimDeposit()` first.
- Making the gateway claim incremental: allow multiple `Vault.claimReshufflingGateway()` calls and pay only the delta attributable to newly minted shares, removing ordering dependence.
- Handling unresolved/stuck batches: do not block gateway claims due to deposits that are not yet claimable. In such cases, users should be able to claim based on their current share balance (and, if the batch later becomes claimable and mints additional shares, be able to claim the incremental amount under the chosen approach).



---

#### 6. Missing Binding between Burn and Receiver Messages Can Lock or Miscredit Funds

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-bridge-adapter-cctp-v2/commit/85d41f98ac86322d3576c18a92b1a9176b5b67cb

##### Description
`CCTPv2BridgeAdapter.claimCCTPBridge()` processes two independent CCTP messages by calling `MessageTransmitterV2.receiveMessage()` twice: first for the burn/mint message (`bridgeMessage`), then for the receiver/app message (`messageMessage`). The adapter computes `amountClaimed` solely as the change in its USDC balance after the first `MessageTransmitterV2.receiveMessage()` call and then uses transient storage to pass that value to the handler executed during the second `receiveMessage()` call.

However, `CCTPv2BridgeAdapter.claimCCTPBridge()` does not validate that `bridgeMessage` and `messageMessage` belong to the same original bridge operation (e.g., no shared nonce, hash commitment, or other linkage). There are two different scenarios which can be exploited due to the issue:

1. An attacker can submit a small burn/mint message (with `mintRecipient` = destination adapter) and a victim's receiver/app message in a single `claimCCTPBridge()` call. This consumes the victim receiver message nonce but only credits the victim with the attacker-controlled small `amountClaimed`. The victim's real burn/mint message can then no longer be paired with its receiver message, leaving the victim's bridged USDC locked.

2. When two containers each send a bridge (e.g. 10,000 USDC to receiver A, 50,000 USDC to receiver B), an attacker can call `claimCCTPBridge()` with one container's burn message and the other container's receiver message. One receiver is credited with the wrong amount (e.g. A gets 50,000 instead of 10,000, B gets nothing), the other container's receiver message may be consumed with the wrong amount or the other container's burn may remain unclaimable, and funds can end up stuck or miscredited.

This issue is classified as **High** severity, because it can lead to user funds being locked or miscredited and can be triggered by any actor able to obtain attestations and call `CCTPv2BridgeAdapter.claimCCTPBridge()`. Affected funds remain locked, the only way to resolve the situation is for the admin to upgrade the contracts.

##### Recommendation
We recommend either introducing a binding between the burn/mint message and the receiver message and validating this binding on the destination when handling received messages, or restricting `claimCCTPBridge()` to a dedicated role (e.g. relayer or bridge-claim role) so that only trusted callers can submit claims and mix-and-match is not permissionless.



---

#### 7. Buffered Deposits and Pending Withdrawals Locked in Repairing Mode

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
In `RepairingMode` there is no way to exit once activated. Two flows can trap user funds in the `Vault` with no in-protocol recovery and no inclusion in `ReshufflingGateway` pro-rata distribution (which is based on share balance).

Example 1 — Buffered deposits:
- 1.1. User deposits notion via `Vault.deposit()` before a batch is started. Notion is in `Vault`, recorded in `bufferedDeposits` and `pendingBatchDeposits`.
- 1.2. Emergency Manager activates `RepairingMode` before `startDepositBatchProcessing()` is called.
- 1.3. `startDepositBatchProcessing()` has `notInRepairingMode`, so the batch never starts. User never gets shares and cannot call `claimDeposit()` (batch never resolved). No refund function exists.
- 1.4. Notion stays locked in `Vault` indefinitely. User gets nothing from `ReshufflingGateway` because payout is by share balance and they have no shares.

Example 2 — Pending withdrawals:
- 2.1. User calls `Vault.withdraw()`: shares move from user to `Vault` and are recorded in `pendingBatchWithdrawals`. User wallet share balance drops.
- 2.2. Emergency Manager activates `RepairingMode`. Standard withdraw batch may never resolve. Emergency exit is via `ReshufflingGateway.withdraw(account)`, which uses `balanceOf(account)`.
- 2.3. User’s shares are in the `Vault`, not in their wallet, so `balanceOf(user)` is zero. Gateway pays them nothing. There is no `cancelWithdraw()` to return shares.
- 2.4. User is blocked from both the standard batch resolution and the emergency gateway exit. Funds are stuck in the `Vault`.

This issue is classified as **High** severity: in either flow, user funds (notion tokens or shares) can be blocked with no in-protocol way to recover and no participation in the emergency gateway distribution. Until the vault is upgraded by the admin, the blocked tokens or shares remain locked.

##### Recommendation
We recommend reconsidering the repairing-mode flow at an architectural level, as it currently exhibits multiple design issues. For this specific finding, the following functionality could be implemented:

- For buffered deposits: add an `emergencyRefundDeposit()` so notion recorded in `pendingBatchDeposits` can be recovered by users in `RepairingMode` when the batch will not be processed.
- For pending withdrawals: add `cancelWithdraw()` in `RepairingMode` so users can cancel their pending withdrawal request and receive back their shares from the Vault (the shares currently recorded in `pendingBatchWithdrawals` and not processable in the batch); that way users regain a non-zero share balance and can claim their pro-rata share from `ReshufflingGateway`.



---

#### 8. Inconsistent Bridge Return Amount Breaks Cross-Chain Claims

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-bridge-adapter-cctp-v2/commit/85d41f98ac86322d3576c18a92b1a9176b5b67cb
##### Description  
`CrossChainContainer._bridgeToken()` treats the return value of `IBridgeAdapter(bridgeAdapter).bridge(...)` as the amount that will be received on the destination chain and later claimed. This value is sent cross-chain and tracked as an expected amount. On the destination chain, the claim path enforces that the actual claimed amount is at least the expected amount:

```solidity
uint256 expectedAmount = _expectedTokenAmounts[token];
// ...
IBridgeAdapter(bridgeAdapter).claim(token);
uint256 amountReceived = IERC20(token).balanceOf(address(this)) - balanceBefore;
require(amountReceived >= expectedAmount,
        InsufficientBridgeAmount(expectedAmount, amountReceived));
```

However, bridge adapters do not consistently return the same semantic meaning (gross vs net) for `bridge()`:

- `AcrossBridgeAdapter` returns `minAmount = instruction.amount - acrossPayload.fee` (net amount expected to be received).
- `CCTPv2BridgeAdapter` returns `instruction.amount` (gross amount), while Circle CCTP Fast Transfers charge a fee, so the destination receives `amount - fee` (net). Documentation: https://developers.circle.com/cctp/concepts/fees.

This issue is classified as **High** severity because if fees are charged on the transfer and `CCTPv2BridgeAdapter` returns the gross amount, the destination chain will expect more than it can actually receive/claim, and `claim()` will revert. The container then cannot clear `claimCounter` and cannot progress to the `BridgeClaimed` / report stage. As a result, the container remains stuck: it never calls `reportDeposit()` or `reportWithdraw()` to the Vault, so the deposit or withdrawal batch that depends on this container never completes. Users' bridged funds remain in flight (stuck on the destination adapter or in an incomplete batch). Cross-chain deposit/withdraw processing is stalled. The only way to resolve this is to upgrade the contracts.

##### Recommendation
We recommend standardizing `IBridgeAdapter.bridge()` return semantics to always return a conservative net/claimable amount (i.e., a value guaranteed to be `<=` the amount that will be claimable on the destination chain).



---

#### 9. Withdrawal Batch BPS Truncation Causes Up to ~50% Loss for Withdrawers Near Basis-Point Boundaries

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description
`_calculateSharesPercent()` computes `shares.mulDiv(MAX_BPS, totalSupply())` which truncates to an integer number of basis points (0.01% granularity). This truncated value is passed to every container's `registerWithdrawRequest()`, which passes it to every strategy's `exit(share)`. The example of compound rounding chain:

1. **Vault:** `batchSharesPercent` truncated from, e.g., 1.999 BPS to 1 BPS (50% precision loss).
2. **Strategy (protocol exit):** `protocolBalance * share / BPS` rounds DOWN per strategy.
3. **Strategy (idle portion):** `idleBalance * share / BPS` rounds DOWN per strategy.

The worst case occurs when the exact BPS is just below an integer boundary. Example at 10M TVL: a withdrawer with 1,999 shares (exact 1.999 BPS) gets truncated to 1 BPS. Strategies exit 0.01% instead of 0.01999%. The withdrawer receives ~1,000 tokens instead of ~1,999 tokens — a ~50% loss. The lost value remains in the strategies, benefiting remaining shareholders.

Maximum loss per batch scales linearly with TVL: `totalSupply / MAX_BPS`. At 10M TVL, this is 1K tokens per batch, or up to 365K tokens/year with daily batches (3.65% of TVL).

##### Recommendation
We recommend using higher precision for the share calculation (e.g., 1e18 instead of 10,000 BPS). Propagate the full-precision share fraction to containers and strategies rather than truncating to an integer BPS. Alternatively, compute the exact token amounts to withdraw at the vault level and pass absolute amounts rather than percentages.



---

#### 10. Unclaimed Withdrawal Shares Corrupt `totalSupply`-Based Calculations

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/79ca6dc8623bbdd1a4aa9d616a1a4514f9799b72

##### Description  
When a withdrawal batch is resolved via `Vault.resolveWithdrawBatch()`, shares are NOT burned. They remain in `totalSupply()` as shares held by the Vault until users call `Vault.claimWithdraw()`, which triggers `_burn()`. These "zombie shares" have no NAV backing — their proportional strategy NAV was already exited — but they inflate `totalSupply()`.

In `Vault.resolveDepositBatch()`, the formula:

```solidity
vars.batchShares = vars.batchDeltaNav.mulDiv(vars.totalSupplyCached, vars.totalNav0);
```

uses the inflated `totalSupplyCached`, minting more shares than warranted. Similarly, `Vault._calculateSharesPercent()` computes a smaller exit fraction for the next withdrawal batch because of the inflated denominator.

**Example scenario.**
`totalSupply = 10_000`, NAV = 10_000 (1:1). 5 shareholders each hold 1_000 shares and submit `withdraw(100%)`. Their 5_000 shares transfer to the Vault. After `resolveWithdrawBatch()` those shares are NOT burned — `totalSupply` remains 10_000, but strategy NAV drops to 5_000 (half the positions were exited).

A new depositor now deposits 5_000 notion. Containers deploy it: `nav0 = 5_000`, `nav1 = 10_000`, `batchDeltaNav = 5_000`.

```
batchShares = 5_000 × 10_000 / 5_000 = 10_000 // minted
fair value:  5_000 × 5_000  / 5_000 =  5_000
```

The depositor receives 10,000 shares instead of the correct 5,000 — a 2× over-allocation. After `claimWithdraw()` burns the 5,000 zombie shares, the remaining 5 shareholders hold 5,000 shares (33.3% of NAV) while the new depositor holds 10,000 shares (66.7%).

The new depositor controls 66.7% of a 10_000 NAV vault despite contributing only 50% of the assets. Remaining shareholders lose **16.7 percentage points** of NAV ownership — a direct, quantifiable loss transferable to any depositor who times their deposit between `resolveWithdrawBatch()` and the subsequent `claimWithdraw()` calls.

This issue is classified as High severity, because a depositor can systematically extract value from existing shareholders in proportion to outstanding zombie shares and withdrawal batch size, with a direct, quantifiable redistribution of NAV ownership.

##### Recommendation
We recommend introducing a `pendingBurnShares` state variable that tracks shares pending burn and subtracting it from `totalSupply()` wherever share-based calculations occur:

```solidity
// In resolveWithdrawBatch():
pendingBurnShares += withdrawBatchTotalShares[previousBatchId];

// In resolveDepositBatch() and _calculateSharesPercent():
uint256 effectiveSupply = totalSupply() - pendingBurnShares;

// In claimWithdraw() (unchanged burn, just decrement counter):
pendingBurnShares -= vars.withdrawnShares;
_burn(address(this), vars.withdrawnShares);
```



---

#### 11. Share Price Inflation Attack


##### Status
Acknowledged

##### Description
The `Vault` is vulnerable to a share price inflation attack. The issue arises if an attacker becomes the sole depositor in the first batch by filling `maxDepositBatchSize` with their own funds. As the only initial shareholder, the attacker can withdraw almost all shares (leaving only 1 wei), then transfer assets directly to the strategy without minting new shares. This drastically reduces the share supply while increasing NAV, artificially inflating the share price. Consequently, subsequent depositors receive far fewer shares than expected, enabling the attacker to extract value via their remaining dust share position.

**Example Scenario:**

1. Let `maxDepositBatchSize` be 10,000 tokens. The attacker deposits 10,000 tokens, possibly in multiple sequential deposits, to fill the first batch exactly to `maxDepositBatchSize` and become the sole depositor.

2. The attacker receives 10,000 shares at the initial 1:1 ratio.

3. The attacker withdraws almost all shares using two consecutive withdrawals with carefully chosen percentages, leaving only 1 wei of shares in circulation.

4. The attacker transfers 10,001 tokens directly to the strategy contract, bypassing the normal deposit mechanism.

5. This inflates the share price to an extreme level, with 10,001 tokens backing only 1 wei of shares.

6. A later legitimate user deposits 20,000 tokens but receives only about 1 share instead of the expected ~2.

7. The user loses roughly 5,000 tokens of value, which accrues to the attacker’s remaining 1 wei share and can later be extracted.

This issue is classified as **High** severity because, in the worst case, it can lead to loss of funds for subsequent depositors. However, the likelihood of exploitation is constrained by the `maxDepositBatchSize` parameter and the timely detection of the attack.

##### Recommendation
We recommend using techniques such as dead shares, virtual shares, or an initial admin deposit to maintain a non-zero share supply and prevent share price inflation via supply reduction and direct donations.

> **Client's Commentary**
> **MixBytes:** The development team acknowledges the issue and will make an initial admin deposit at the time of vault initialization to significantly reduce the attack surface. The admin deposit must be performed in the same transaction as the vault initialization to eliminate any front-running window between deployment and the protective deposit.

---

### 2.3 Medium

#### 1. Missing `notInRepairingMode` Modifier in `withdraw()` Function

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
The `Vault.withdraw()` function lacks the `notInRepairingMode` modifier, which is present in `_deposit()`. In Repairing mode the protocol is in an emergency state and users are expected to exit only via claiming from the `ReshufflingGateway`. Allowing `withdraw()` in Repairing mode lets users submit withdrawal requests unaware of the emergency. Their shares are sent to the Vault (recorded in `pendingBatchWithdrawals`), and the withdraw batch may never complete (depending on vault status and operator actions). Users can end up with shares stuck in the vault and no gateway payout, or a reduced payout.

##### Recommendation
We recommend adding the `notInRepairingMode` modifier to the `withdraw()` function to prevent users from entering the withdrawal queue once the protocol has entered the emergency recovery state.



---

#### 2. Unsafe Token Approval Across Multiple Contracts

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002, https://github.com/ShiftDeFi/shift-defi-bridge-adapter-across-v3/commit/59c80e131c023eb7c9dd6fef26e67622d46d3bba
##### Description  
The codebase performs direct `approve()` calls in multiple locations instead of consistently using OpenZeppelin's `SafeERC20` helpers. As a result, interacting with non-standard ERC20 tokens (most notably USDT) can cause transactions to revert or behave unexpectedly. For example, some tokens do not return a boolean from `approve()`, and direct calls may revert when a return value is expected. Others require resetting a non-zero allowance to zero before setting a new value, otherwise `approve()` reverts. Some tokens may also return `false` instead of reverting, which can leave the contract in an inconsistent state.

The following locations in the codebase are affected:

1. **`Vault.addContainer()`** (line 254) and **`Vault.setContainerWeights()`** (line 277):
```solidity
// addContainer
notion.approve(container, type(uint256).max);

// setContainerWeights
notion.approve(containers[i], 0);
```

2. **`ContainerPrincipal.initialize()`** (line 35):
```solidity
IERC20(notion).approve(vault, type(uint256).max);
```

3. **`ContainerLocal.initialize()`** (line 27):
```solidity
IERC20(notion).approve(vault, type(uint256).max);
```

4. **`CrossChainContainer._approveTokenToBridgeAdapter()`** (line 187):
```solidity
IERC20(token).approve(bridgeAdapter, amount);
```

5. **`AcrossBridgeAdapter._bridge()`** (line 70, across-v3):
```solidity
IERC20(instruction.token).approve(spookyPool, instruction.amount);
```

This issue is classified as **Medium** severity, because the protocol will use USDT, and in that case it can cause a contract lock that prevents critical operations.
 
##### Recommendation
We recommend using `forceApprove()` from OpenZeppelin's `SafeERC20` library instead of direct `approve()` calls across all affected locations.


---

#### 3. Missing `handleReceiveUnfinalizedMessage()` Callback Can Cause Claim Reverts

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-bridge-adapter-cctp-v2/commit/85d41f98ac86322d3576c18a92b1a9176b5b67cb

##### Description  
Circle CCTP v2 supports two finality modes: `Fast` and `Standard`. Per Circle [docs](https://developers.circle.com/cctp/references/technical-guide#messages-and-finality), only two finality thresholds are supported. Any `minFinalityThreshold` value below 1000 is treated as 1000, and any value above 1000 is treated as 2000.

When a message is attested with `finalityThresholdExecuted < 2000`, `MessageTransmitterV2.receiveMessage()` dispatches it to `handleReceiveUnfinalizedMessage()` on the message recipient, otherwise it dispatches to `handleReceiveFinalizedMessage()`. However, the adapter implements only `CCTPv2BridgeAdapter.handleReceiveFinalizedMessage()` and does not implement `CCTPv2BridgeAdapter.handleReceiveUnfinalizedMessage()`. As a result, when a message is attested as Fast, the claim reverts because that callback is missing.

##### Recommendation
We recommend either implementing `CCTPv2BridgeAdapter.handleReceiveUnfinalizedMessage()` or using only Standard transfers.



---

#### 4. Withdrawal Batch Processing Can Be Indefinitely Stuck Due to `minWithdrawBatchRatio` Threshold

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002
##### Description
`startWithdrawBatchProcessing()` requires `batchSharesPercent >= minWithdrawBatchRatio`. If the total buffered withdrawal shares are below this threshold, the withdrawal batch cannot start. The `skipWithdrawBatch()` function can be used to skip, but this means those withdrawal requests are deferred to the next cycle. If the vault consistently has low withdrawal demand relative to TVL, withdrawals can be stuck indefinitely until either more users request withdrawals or the operator decreases `minWithdrawBatchRatio`.

With `minWithdrawBatchRatio = 1` (0.01%), at 10M TVL this means at least 1k tokens worth of shares must be queued. At 1B TVL, at least 100K tokens. Users with small positions may be unable to withdraw for extended periods.

##### Recommendation
We recommend increasing the ratio precision to 18 decimals and allowing withdrawals pending for more than N blocks, to be processed regardless of the ratio.



---

#### 5. `depositWithPermit()` Is Front-Runnable

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002
##### Description
`Vault.depositWithPermit()` first calls `permit` and then performs the deposit. An attacker can front‑run the user by submitting the same `permit` first, which consumes the nonce and makes the user’s original transaction revert, causing a denial‑of‑service for deposit flows that rely on permits.

##### Recommendation
We recommend wrapping `permit` in a try/catch and proceeding with the deposit if the allowance is already sufficient, so a front‑run does not break the flow.



---

#### 6. `lastResolvedDepositBatchBlock` and `lastResolvedWithdrawBatchBlock` Are Never Updated After Initialization

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/79ca6dc8623bbdd1a4aa9d616a1a4514f9799b72
##### Description  
`Vault.sol` tracks two state variables intended to record the block number of the last resolved batch cycle:

```solidity
uint256 public lastResolvedDepositBatchBlock;
uint256 public lastResolvedWithdrawBatchBlock;
```

Both are assigned once during initialization:

```solidity
lastResolvedDepositBatchBlock = block.number;
lastResolvedWithdrawBatchBlock = block.number;
```

However, neither `resolveDepositBatch()` nor `resolveWithdrawBatch()` ever updates these variables. As a result, `batchProcessingDelay` computed inside `skipDepositBatch()` and `skipWithdrawBatch()` grows monotonically from the deployment block rather than from the last resolved batch:

```solidity
uint256 batchProcessingDelay = block.number - lastResolvedDepositBatchBlock;
require(batchProcessingDelay < forcedBatchBlockLimit, CannotSkipForcedBatch());
```

Once `forcedBatchBlockLimit` blocks have elapsed since deployment, the check fails for any buffer at or above the forced threshold — regardless of how recently a batch was actually resolved. The timer is never reset.

The configurator (`CONFIGURATOR_ROLE`) can change `forcedBatchBlockLimit` via `setForcedBatchBlockLimit()`, so the problem is operationally solvable.

##### Recommendation
We recommend updating `lastResolvedDepositBatchBlock` at the end of `resolveDepositBatch()` and `lastResolvedWithdrawBatchBlock` at the end of `resolveWithdrawBatch()`.




---

### 2.4 Low

#### 1. `CustomPool.swap()` Transfers Tokens from `receiver` instead of `msg.sender`

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-swap-adapters/commit/3e47d624d1c8084544d16c40622e5dc6666c9e76

##### Description  
The `CustomPool.swap()` function transfers `tokenIn` from the `receiver` parameter instead of `msg.sender`. This is unsafe in general, because if any account has approved the `CustomPool` contract to spend its tokens, any third party can call `swap()` and cause the adapter to pull tokens from that account and send `tokenOut` to the same account.

Elsewhere in the protocol, swap adapters follow a single pattern: the caller is the one whose tokens are pulled.

In `CustomPool.swap()`, the code uses:
```solidity
IERC20(tokenIn).safeTransferFrom(receiver, address(this), amountIn);
```
whereas other adapters (`OneInchAdapter`, `UniswapV3Adapter`, `UniversalAdapter`) use:

```solidity
IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
```

The intended flow is that routers (or other callers) approve the adapter and call `swap()`. The adapter should pull from `msg.sender`. Pulling from `receiver` instead breaks this pattern and, as above, allows approved-but-unintended token debits when users or contracts approve the pool.

##### Recommendation
We recommend changing `CustomPool.swap()` to transfer `tokenIn` from `msg.sender` instead of `receiver`.



---

#### 2. Fee Cap Validation Uses Strict Inequality (`<`) Instead of Less Than or Equal (`<=`)

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-bridge-adapter-across-v3/commit/59c80e131c023eb7c9dd6fef26e67622d46d3bba

##### Description  
In the `AcrossBridgeAdapter` contract, the `_validatePayload()` function contains a check to ensure that the `acrossParams.fee` does not exceed the `feeCapPct`. The current implementation uses a strict less than (`<`) operator:

```solidity
require(acrossParams.fee * MAX_FEE_CAP_BPS < feeCapPct * instruction.amount,
        FeeTooHigh(acrossParams.fee));
```

However, the `IAcrossV3Receiver` interface's documentation for `setFeeCapPct()` explicitly states that `feeCapPct` defines the maximum fee percentage allowed:

```solidity
/**
 * @notice Sets the fee cap percentage
 * @dev Can only be called by addresses with the governance role. 
 * The fee cap is used to validate
 * that bridge fees do not exceed the configured maximum percentage 
 * of the bridged amount.
 */
```

If the calculated fee (`acrossParams.fee * MAX_FEE_CAP_BPS`) is exactly equal to the maximum allowed fee (`feeCapPct * instruction.amount`), the current `require` statement will cause the transaction to revert. This behavior is incorrect, as a fee that is precisely at the maximum allowed threshold should be considered valid and not "too high."

##### Recommendation
We recommend changing the fee cap check in `AcrossBridgeAdapter._validatePayload()` to use `<=` instead of `<`.



---

#### 3. Insufficient Cache Size for Bridge Retries

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
The `_cache` in the `BridgeAdapter` contract, utilized for authorizing `retryBridge()` operations, is initialized as a `RingCache` with a maximum size of 8 elements. This small size creates a very narrow window to retry failed bridge transactions. After 8 unique bridge instructions have been processed, older cache entries are evicted from the ring buffer. Consequently, if `retryBridge()` is called for an instruction whose entry has been evicted, the transaction will revert with a `DoesNotExists` error, regardless of the actual bridge status. This prevents legitimate retries for transactions that have fallen out of the cache window.

##### Recommendation
We recommend making the cache size configurable at initialization, similar to `MessageRouter.initialize()` which accepts a `maxCacheSize` parameter, and ensuring `maxCacheSize` is not set too small so that the window for retries remains adequate.



---

#### 4. `UniversalAdapter` Transfers Full Balance Instead of Swap Delta

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-swap-adapters/commit/3e47d624d1c8084544d16c40622e5dc6666c9e76

##### Description  
In `UniversalAdapter.swap()`, the contract correctly computes the output delta (`amountOutAfter - amountOutBefore`) to validate slippage against `minAmountOut`, but then transfers the entire post-swap `tokenOut` balance (`amountOutAfter`) to the receiver instead of only the delta. Any pre-existing `tokenOut` balance on the adapter (e.g. from a direct transfer, dust, or mistaken send) is therefore sent to the receiver together with the swap output. Any caller can perform a swap with `receiver = self` and receive the full `tokenOut` balance of the adapter (swap output plus any pre-existing balance), so tokens previously left on the adapter can be drained to that receiver.

The protocol does not design any flow that leaves `tokenOut` on the adapter, so the only at-risk amounts are dust or mistaken transfers. 

##### Recommendation
We recommend transferring only the swap output to the receiver, i.e. the delta `(amountOutAfter - amountOutBefore)`.



---

#### 5. Ambiguous Cache Key for Identical Bridge Transactions

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
In the `BridgeAdapter` contract, the cache key used for `retryBridge()` operations (derived from `instruction.token`, `instruction.chainTo`, `instruction.amount`, `receiver`) does not include any unique message or deposit identifier. If a container initiates two identical bridge transactions (same `token`, `chainTo`, `amount`, `receiver`), only one entry will be stored in the cache. This creates ambiguity: if one of these identical transactions fails and requires a retry, the `retryBridge()` function cannot differentiate which specific underlying deposit is being retried, potentially leading to confusion or unintended retries if the system expects unique authorization per message.

##### Recommendation
We recommend including a unique identifier in the cache key generation within `_cacheInstruction()` to ensure that each `bridge()` call creates a distinct, uniquely identifiable entry in the cache. This would allow `retryBridge()` to target specific failed transactions accurately, even if multiple identical transfers are initiated.



---

#### 6. Deprecated Chainlink `latestAnswer` Function

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
The `ChainlinkOracleWrapper` contract uses the `latestAnswer()` function to fetch price data from `Chainlink` price feeds:

```solidity
function getPrice() public view returns (uint256) {
    int256 price = IChainlinkPriceFeed(chainlinkFeed).latestAnswer();
    require(price > 0, Errors.IncorrectPrice(price));
    return uint256(price);
}
```

According to Chainlink documentation, the `latestAnswer()` function is deprecated. It does not return important metadata such as the timestamp of the update or the round ID, which are necessary to verify the freshness and validity of the price data. If the oracle stops updating or returns stale data, `latestAnswer()` will continue to return the last known value without any way for the caller to detect the issue.

##### Recommendation
We recommend replacing the call to `latestAnswer()` with `latestRoundData()` and implementing it with safety checks for price staleness.


---

#### 7. Unused Error Definitions

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
The `Errors` library defines several error types that are never used anywhere in the audit scope. These unused definitions add unnecessary code bloat and can lead to confusion for developers who might expect these errors to be thrown in certain scenarios.

The following errors are defined but never referenced anywhere in the audit scope:

1. `OnlyAgent()` — line 8, never used
2. `AlreadyInitialized()` — line 13, never used (note: `RingCacheLibrary` defines its own `AlreadyInitialized(bytes32 id)` with a parameter)
3. `EmergencyModeEnabled()` — line 15, never used
4. `NotFound()` — line 32, never used (note: other errors with similar names such as `ContainerNotFound`, `StateNotFound` are used elsewhere, but `Errors.NotFound()` is not)
5. `InvalidDataLength()` — line 27, never used (note: `Codec.sol` defines and uses its own local `InvalidDataLength()` error)

##### Recommendation
We recommend removing the unused error definitions from the library to reduce code bloat and improve code clarity. If these errors were intended for future use, they should be documented as such, or if they represent removed functionality, they should be cleaned up.



---

#### 8. Missing Support for LayerZero Token Fee Payments in `MessageRouter`

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-message-adapter-lz-v2/commit/98f9ff21f9d2bf893ec47ddce148cfb0f3891ef2

##### Description  
`ShiftOApp` uses the LZ token fee path. In the adapter:

- `estimateFee(..., payInLz)` returns `messagingFee.lzTokenFee` when `payInLz` is true
- `send()` passes `MessagingFee({ nativeFee, lzTokenFee: zroFee })` into `_lzSend()`

However, the adapter cannot actually receive LZ token fees. In the router:

- `MessageRouter.send()` only forwards `msg.value` to the adapter and does not supply or approve LZ tokens

As a result, the LayerZero token cannot be used as a fee token in the current flow, and the LZ fee references in `ShiftOApp` are unusable without documentation or support in `MessageRouter`.

##### Recommendation
We recommend either clearing the code and documenting the limitation, or adding support for LZ token fees.



---

#### 9. Incorrect Strict Inequality in Slippage Check Prevents Exact Match Success

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
The slippage check in the `StrategyTemplate._enter()` function uses a strict inequality (`>`) instead of a non-strict inequality (`>=`). This causes transactions to revert even when the resulting NAV increase exactly matches the provided `minNavDelta`.

```solidity
require(
    vars.stateToNavAfterEnter > vars.stateToNavBeforeEnter + minNavDelta,
    SlippageCheckFailed(
        vars.stateToNavBeforeEnter,
        vars.stateToNavAfterEnter,
        minNavDelta
    )
);
```

In standard slippage protection logic, the minimum value (`minNavDelta`) should be inclusive: if the NAV increase is exactly equal to `minNavDelta`, the transaction should succeed. The current implementation forces the caller to supply a `minNavDelta` that is at least 1 unit smaller than the actual minimum requirement to avoid unnecessary reverts, which is counter-intuitive and can lead to precision-related issues.

##### Recommendation
We recommend replacing the strict inequality `>` with `>=` to allow transactions to succeed when the NAV increase exactly matches the `minNavDelta`.



---

#### 10. Redundant Caching of Received Messages Reduces Retry Window

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
In `MessageRouter.receiveMessage()`, the contract caches every successfully received message in `_sendMessagesCache`:

```solidity
function receiveMessage(
    bytes memory rawMessageWithPathAndNonce
)
    external
    nonReentrant
{
    // ... validation and delivery ...
    _cacheMessage(pathData.chainId, rawMessageWithPathAndNonce);
    // ...
}
```

However, `_sendMessagesCache` is primarily used to authorize `retryCachedMessage()`, which is a sender-side recovery mechanism for re-sending previously sent messages. Caching incoming messages is redundant and consumes cache capacity, accelerating ring-buffer eviction.

As a result, frequent incoming message traffic can evict outgoing messages that may still require a retry, causing `retryCachedMessage()` to revert with `RingCacheLibrary.DoesNotExists` even though the message should remain retryable from an operational perspective.

##### Recommendation
We recommend removing caching of messages inside `receiveMessage()` (or using a separate cache for received messages), keeping `_sendMessagesCache` dedicated to outgoing messages that may need `retryCachedMessage()`.



---

#### 11. Protocol DoS via `skipDepositBatch` in Empty Vault

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002
##### Description  
A logic flaw in the `Vault` state machine allows an operator to lock the protocol if `skipDepositBatch()` is called before any shares have been minted (i.e., when `totalSupply() == 0`).

The vulnerability follows this sequence:
1. The vault is in the `Idle` state with `totalSupply() == 0`
2. The operator calls `skipDepositBatch()`.
3. To return the vault to the `Idle` state (allowing new deposits), the operator must call either `startWithdrawBatchProcessing()` or `skipWithdrawBatch()`.
4. Both of these functions call the internal function `_calculateSharesPercent()`:

```solidity
function _calculateSharesPercent(
    uint256 shares
)
    internal
    view
    returns (uint256)
{
    return shares.mulDiv(MAX_BPS, totalSupply());
}
```

Since `totalSupply()` is 0, this call will always revert due to a division by zero. As a result, the vault becomes stuck in the `DepositBatchProcessingFinished` state.

##### Recommendation
We recommend either forbidding `skipDepositBatch()` when the vault is empty (e.g. require `totalSupply() > 0` in `skipDepositBatch()`), or handling zero supply in `_calculateSharesPercent()` (e.g. return zero when `totalSupply() == 0`) so that `startWithdrawBatchProcessing()` and `skipWithdrawBatch()` can run and the vault can return to `Idle`.



---

#### 12. `ShiftOApp` Refund Address Uses `tx.origin`

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-message-adapter-lz-v2/commit/98f9ff21f9d2bf893ec47ddce148cfb0f3891ef2

##### Description  
In `ShiftOApp.send()`, the refund address passed to `_lzSend()` is `payable(tx.origin)`. LayerZero uses this address to refund overpaid native fees or to return value when a message fails on the source side.

In the current flow, the only callers that reach `MessageRouter.send()` (and thus the adapter’s `send()`) are `ContainerPrincipal.sendDepositRequest`, `ContainerPrincipal.sendWithdrawRequest`, `ContainerAgent.reportDeposit`, and `ContainerAgent.reportWithdrawal`. All four are `onlyRole(OPERATOR_ROLE)` and forward `msg.value` from the operator. So in practice `tx.origin` is the operator who initiated the transaction, the operator pays the fees, and refunds go back to the operator—behavior is correct today.

Using `tx.origin` remains poor practice: it ties refund attribution to the transaction origin instead of an explicit contract guarantee. If the operator is a multisig, the refund goes to the EOA that initiated the transaction, not to the multisig. If new call paths are added (e.g. another role or a relayer), refunds could be misdirected. Replacing it with an explicit refund address (e.g. passed from the router or set via transient storage) would make the intended recipient clear and robust to future changes.

##### Recommendation
We recommend passing the refund address explicitly instead of using `tx.origin`. For example, extend the adapter interface so that `MessageRouter.send()` passes the intended refund recipient as a parameter into the adapter’s `send()`, and have `ShiftOApp.send()` use that address in `_lzSend()`. 



---

#### 13. `RingCacheLibrary` Defines Unused `DEFAULT_CACHE_SIZE` Constant

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description  
In `RingCacheLibrary`, the constant `DEFAULT_CACHE_SIZE = 10` is defined but never used anywhere in the codebase. Callers of `RingCacheLibrary.initialize()` always pass an explicit cache size: `MessageRouter.initialize()` receives `maxCacheSize` as a parameter and passes it to `_sendMessagesCache.initialize(keccak256("SEND_CACHE"), maxCacheSize)`; `BridgeAdapter.__BridgeAdapter_init()` hardcodes the size in `_cache.initialize("BRIDGE_CACHE", 8)`.

##### Recommendation
We recommend either using `DEFAULT_CACHE_SIZE` where a default is appropriate (e.g. in `BridgeAdapter.__BridgeAdapter_init()` use `RingCacheLibrary.DEFAULT_CACHE_SIZE` instead of the hardcoded `8`, or add an overload of `initialize(RingCache, bytes32)` that calls `initialize(_cache, _id, DEFAULT_CACHE_SIZE)`), or removing the constant if no default is desired, to avoid dead code and clarify intent.



---

#### 14. Anyone Can Grief Container Deposit Reporting by Transferring Whitelisted Tokens

##### Status
Acknowledged

##### Description
Several container functions rely on `_validateWhitelistedTokensBeforeReport()`, which reverts if any whitelisted token balance exceeds its dust threshold. An attacker can transfer a small amount of any whitelisted token (dust) directly to the container, causing these functions to revert until the operator updates the dust threshold or removes the dust. Affected call sites include:
- `ContainerPrincipal.sendDepositRequest()`
- `ContainerAgent.reportDeposit()`
- `ContainerAgent.reportWithdrawal()`
- `ContainerLocal.reportDeposit()`
- `ContainerLocal.reportWithdraw()`
- `ContainerPrincipal.reportDeposit()`
- `ContainerPrincipal.reportWithdrawal()`

##### Recommendation
We recommend using a pull-based accounting model for expected tokens rather than relying on `balanceOf()` checks, or allow the operator to sweep unexpected token balances before reporting.

> **Client's Commentary:**
> At the moment, the current design is intentional and aligned with system constraints. Design choice mitigated by dust threshold configuration.

---

#### 15. Strategy Exit and Enter Uses Pull Pattern for Transferring Tokens, Reducing Composability

##### Status
Acknowledged

##### Description
`_exitStrategy()` uses `safeTransferFrom(strategy, container, amount)` for each token, requiring the strategy to have pre-approved the container. A push pattern (where the strategy transfers directly) would be simpler and more composable with strategies that manage approvals internally.

Similarly, when `_enterStrategy()` has a remainder after entering a strategy, it loops through all input tokens and calls `safeTransferFrom(strategy, container, remainingAmounts[i])` for each. This pull-based approach requires the strategy to maintain approvals. A simpler design would have the strategy push all remaining tokens back during `enter()`.

##### Recommendation
We recommend using a push-based pattern where the strategy pushes tokens to the container during `exit()` and `enter()`, reducing approval management complexity.

> **Client's Commentary:**
> At the moment, the current design is intentional and aligned with system constraints. Design choice mitigated by dust threshold configuration.

---

#### 16. CCTPv2 `blacklistDomain` Does Not Validate `domainId` Matches Stored Value and Leaks Stale Reverse Mappings

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-bridge-adapter-cctp-v2/commit/85d41f98ac86322d3576c18a92b1a9176b5b67cb

##### Description
`blacklistDomain(chainId, domainId)` does not verify that the provided `domainId` matches `_domainsByChainId[chainId].domainId`. A governance error could pass a wrong `domainId` and the function would still execute, emitting an incorrect `DomainBlacklisted` event. Additionally, `_chainIdByDomainId[domainId]` is never cleared during blacklisting, leaving stale reverse mappings. While the `handleReceiveFinalizedMessage` checks prevent exploitation (the `domainId == sourceDomain` check would fail for stale mappings), the state remains inconsistent.

##### Recommendation
We recommend adding `require(domain.domainId == domainId)` and clearing `_chainIdByDomainId[domainId] = 0` in `blacklistDomain`.



---

#### 17. AcrossBridgeAdapter Validates `fillDeadline` But Never Uses It in the Bridge Call

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-bridge-adapter-across-v3/commit/59c80e131c023eb7c9dd6fef26e67622d46d3bba

##### Description
`_validatePayload()` checks `acrossParams.fillDeadline >= block.timestamp`, but `fillDeadline` is never passed to `depositV3Now()`. Instead, the `fillDeadlineOffset` parameter uses `ISpookyPool(spookyPool).fillDeadlineBuffer()`. The validation is dead code — it validates a parameter that has no effect on the bridge operation. The operator has no real control over the fill deadline.

##### Recommendation
We recommend either passing `acrossParams.fillDeadline` to `depositV3Now()` as intended, or removing the dead validation to avoid confusion.



---

#### 18. UniswapV3Adapter `whitelistPath` Allows Zero-Hop Paths

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-swap-adapters/commit/3e47d624d1c8084544d16c40622e5dc6666c9e76

##### Description
Calling `whitelistPath([singleToken], [])` satisfies `tokens.length == fees.length + 1` (1 == 0 + 1). The resulting 20-byte path is not a valid Uniswap V3 path (requires at least 43 bytes: address + fee + address). The path would be whitelisted but any swap attempt would revert at the Uniswap router.

##### Recommendation
We recommend adding `require(fees.length > 0, "Path must have at least one hop")`.



---

#### 19. Naming and Error Message Clarity

##### Status
Acknowledged

##### Description
* In `Vault.sol`, `maxDepositBatchSize` and `minDepositBatchSize` indicate notion token amounts, not counts. Rename to `maxDepositBatchAmount` and `minDepositBatchAmount` for clarity.
* In `OneInchAdapter.sol`, replace `InvalidSrcReceiver(descs.srcReceiver)` error with `InvalidDstReceiver(descs.dstReceiver)` in the corresponding `require` for accuracy.

##### Recommendation
We recommend updating variable names and error references as described.

> **Client's Commentary:**
> 
> **MixBytes:** Only the error message in `OneInchAdapter.sol` was updated; the Vault batch size naming was not changed. 
> **Client:** Renaming variables in this case would require widespread changes across the codebase, including tests, without providing meaningful improvement in readability or maintainability.
Given the limited benefit and high refactoring cost, we consider the current naming acceptable.

---

#### 20. Redundant Unchecked Loop Increments

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description
The contracts target Solidity ^0.8.28, where the compiler already emits unchecked arithmetic for simple `for` loop counters (optimization introduced in 0.8.22 and enabled by default). In the following locations, the counter is manually incremented inside the loop body using `unchecked { ++i; }` with an empty increment clause in the `for` statement:

- `shift-defi-platform/contracts/StrategyTemplate.sol`:
  - `setInputTokens()`
  - `setOutputTokens()`
  - `emergencyExitMultiple()`
  - `_takeFundsFromAgent()`
  - `_prepareFundsAfterEnter()`
  - `_prepareFundsAfterExit()`
  - `_tokensAmountsDump()`
- `shift-defi-platform/contracts/libraries/helpers/RingCacheLibrary.sol`:
  - `all()`

For each of these loops, the counter is a local `uint256`, incremented only by `++i`, and not modified elsewhere in the loop body. This matches the compiler’s auto‑unchecked pattern for `for (...; ...; ++i)` in 0.8.28, so the manual `unchecked` is redundant and reduces readability without additional gas savings.

##### Recommendation
We recommend switching to a standard `for (...; ...; ++i)` loop and removing the manual `unchecked` increment, unless the loop is intentionally structured to bypass the compiler optimization or the counter is modified elsewhere (in which case, document the reason explicitly).



---

#### 21. Vault `claim*` Reverts When Nothing to Claim, Breaking Integrations

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description
`Vault.claimDeposit` and `Vault.claimWithdraw` revert with `NothingToClaim()` when the requested account has no pending amount (or calculated claim amount is zero). This makes the claim flow non‑idempotent for external integrations that expect a “safe” claim call to succeed even when there is nothing to claim. In practice, an integration might submit a claim transaction for a user (or as a batch step) and expect it to be a no‑op if the user already claimed; instead it reverts and can break the overall workflow.
This is visible in:
- `Vault.claimDeposit`: `require(vars.depositAmount > 0, NothingToClaim())` and later `require(vars.sharesToClaim > 0 || vars.notionToClaim > 0, NothingToClaim())`.
- `Vault.claimWithdraw`: `require(vars.notionToClaim > 0, NothingToClaim())`.

##### Recommendation
We recommend making `claimDeposit` / `claimWithdraw` idempotent by returning early (no‑op) when there is nothing to claim, instead of reverting. This improves integration reliability and allows safe repeated calls without breaking batch flows.



---

#### 22. Meaningless Balance-Delta Check After Bridging

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002
##### Description
In `CrossChainContainer._bridgeToken`, the check `balanceBefore - balanceAfter >= bridgedAmount` does not make sense because it only tests a scenario where the adapter spent fewer tokens than required, which is not a realistic failure mode for a correct adapter. As a result, the condition does not add safety but can still introduce confusing behavior.

##### Recommendation
We recommend removing this check or replacing it with a validation that matches the actual invariant for each adapter (if needed).



---

#### 23. Too Strict Slippage Check on `bridgedAmount`

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002
##### Description
In `CrossChainContainer._bridgeToken`, the condition `bridgedAmount > minTokenAmount` is too strict. When the adapter returns exactly `minTokenAmount` (a valid, boundary‑case outcome), the call reverts with `BridgeSlippageExceeded` even though slippage is within the user’s minimum.

##### Recommendation
We recommend using `>=` instead of `>` for the slippage comparison, or otherwise documenting that an exact match is considered a failure.



---

#### 24. Nonce Check Can Break Delivery on Message Reordering

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-message-adapter-lz-v2/commit/98f9ff21f9d2bf893ec47ddce148cfb0f3891ef2
##### Description
`MessageRouter.receiveMessage` enforces a monotonic nonce per path. If LayerZero delivers messages out of order, a later nonce can be accepted first and a valid earlier nonce will then revert as a replay, permanently blocking that message. In the current architecture this reordering is unlikely, but the failure mode still exists.

##### Recommendation
We recommend preventing reordering at the LayerZero level (enforce ordered delivery / block out‑of‑order messages) so that the nonce check cannot lock out valid messages.



---

#### 25. No Way to Remove Predefined Swaps

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description
`SwapRouter.setPredefinedSwapParameters` can only set (overwrite) parameters but provides no way to delete them. Once a predefined swap is set, it remains active unless replaced with another adapter/payload, which makes it impossible to intentionally remove a predefined swap for a pair.

##### Recommendation
We recommend adding an explicit removal mechanism (e.g., a function that clears the adapter to `address(0)` or deletes the mapping entry) to allow disabling a predefined swap when needed.



---

#### 26. Strict Inequalities in Deposit Limits

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002


##### Description
Both `Vault._setMaxDepositAmount` and `Vault._setMinDepositAmount` use strict comparisons, which reject the boundary case where `maxDepositAmount == minDepositAmount`. There is no safety benefit to excluding equality, and it unnecessarily prevents configurations where the min equals the max.

##### Recommendation
We recommend using non‑strict comparisons (`>=` / `<=`) to allow `minDepositAmount == maxDepositAmount`.



---

#### 27. `setContainerWeights()` Allows Duplicate Container Addresses

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description
`Vault.setContainerWeights()` accepts arrays with duplicate container addresses. This can cause the input parameters to be interpreted incorrectly, even though the invariant "sum of weights equals MAX_BPS" is preserved.

##### Recommendation
We recommend rejecting duplicate addresses in the input (e.g., enforce uniqueness) to avoid ambiguous or misleading configurations.



---

#### 28. `startDepositBatchProcessing` Can Revert on Zero Container Amount

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/8392c1b37650ad2a8f64f046742573057e8d6002

##### Description
`Vault.startDepositBatchProcessing` computes a per‑container amount and requires `containerAmount > 0`. In edge cases with low `totalBatchDepositAmount` and certain weight distributions, a container can receive `0`, which triggers `IncorrectContainerAmount` and reverts the batch start.

##### Recommendation
We recommend preventing rounding-to-zero allocations during deposit batch distribution by adding explicit validation at the configuration level (e.g., when calling `setContainerWeights` and/or setting `minDepositBatchSize`) to ensure that, for the minimum expected batch size, each non-zero-weight container receives a non-zero `containerAmount`. While a revert in `startDepositBatchProcessing()` can be mitigated operationally by adjusting weights via `Vault.setContainerWeights` (or by increasing `minDepositBatchSize` / waiting for a larger buffered batch), it is preferable to prevent such configurations upfront to avoid operator intervention and potential batch liveness issues.



---

#### 29. Single `EMERGENCY_PAUSER_ROLE` Controls Both `pause()` and `unpause()` With No Threshold Differentiation

##### Status
Acknowledged

##### Description  
Both `pause()` and `unpause()` are gated by the same `EMERGENCY_PAUSER_ROLE`:

```solidity
function pause() external whenNotPaused onlyRole(EMERGENCY_PAUSER_ROLE) {
    _pause();
}

function unpause() external whenPaused onlyRole(EMERGENCY_PAUSER_ROLE) {
    _unpause();
}
```

The role is assigned to a single address at initialization:

```solidity
_grantRole(EMERGENCY_PAUSER_ROLE, roleAddresses.emergencyPauser);
```

This means that whoever holds `EMERGENCY_PAUSER_ROLE` can both freeze all user funds instantly and unfreeze them with no additional oversight. The security properties of pause and unpause are fundamentally different:

- Pause is an emergency action — it must be executable immediately, by as few signers as possible, to respond quickly to an exploit.
- Unpause is a recovery action — it signals that the incident is resolved and normal operations are safe to resume. This requires higher confidence and should demand more approvals.

##### Recommendation
We recommend splitting pause and unpause into two separate roles.

> **Client's Commentary**
> The separation of roles for pause and unpause operations is intentional and reflects internal security and operational requirements

---

#### 30. Missing `setConfig()` Wrapper for Library Parameter Tuning

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-message-adapter-lz-v2/commit/fe689dbda59d9c8865cb719cd76ff72700881fcf
##### Description  
The `ShiftOApp` adapter does not implement a wrapper for the `setConfig()` function, which is used to configure library-specific parameters within the selected send/receive libraries. While the adapter functions correctly with default library parameters, this design choice limits operational flexibility for post-deployment adjustments to critical settings such as DVN requirements, executor parameters, and fee structures.

Currently, if the protocol needs to adjust library parameters (e.g., increase the number of required DVNs from 2 to 4 for enhanced security, or change executor settings), the owner would need to:
1. Call `OAppCore.setDelegate(ownerAddress)` to temporarily grant themselves delegate permissions
2. Call `EndpointV2.setConfig()` directly with library parameters
3. Optionally revert the delegate back to `address(this)` via `OAppCore.setDelegate(address(this))`

Without a `setConfig()` wrapper, the adapter forces a multi-step delegate workaround for what could be a single `onlyOwner` call on the OApp, which adds operational overhead and room for error (e.g., forgetting to restore the delegate).

##### Recommendation
We recommend adding a `setConfig()` wrapper function to `ShiftOApp`, allowing the owner to tune library-specific parameters without additional operational steps.



---

#### 31. Missing `_disableInitializers()`

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/79ca6dc8623bbdd1a4aa9d616a1a4514f9799b72, https://github.com/ShiftDeFi/shift-defi-bridge-adapter-cctp-v2/commit/a9c4897463bd62763f562ea581cc3ebf903f34dc, https://github.com/ShiftDeFi/shift-defi-bridge-adapter-across-v3/commit/241d66710ccd005fa7c11b0b3390f849f9b0bb5f
##### Description  
Several upgradeable implementations in scope omit the standard implementation-side guard: a constructor that calls `_disableInitializers()`. Examples include `CCTPv2BridgeAdapter`, `AcrossBridgeAdapter`, and `MessageRouter`.

OpenZeppelin’s upgradeable contract guidance recommends an empty constructor on the implementation contract:

```solidity
constructor() {
    _disableInitializers();
}
```

Without it, the logic contract remains directly initializable, so `initialize` can be called on the implementation address rather than only through the proxy—weak hardening for transparent/UUPS deployments and a footgun for tooling or operators that target the wrong contract.

##### Recommendation
We recommend adding a constructor that disables initializers on each upgradeable implementation.


---

#### 32. `blacklistDomain` Leaves Stale `domainId` in `Domain` Storage

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-bridge-adapter-cctp-v2/commit/a9c4897463bd62763f562ea581cc3ebf903f34dc

##### Description  
In `CCTPv2BridgeAdapter.blacklistDomain`, the contract sets `domain.isWhitelisted = false` and clears the reverse mapping `_chainIdByDomainId[domainId]`, but it does not reset `domain.domainId` on the `Domain` struct for that `chainId`.

As a result, storage remains internally inconsistent: the chain is no longer whitelisted (so `_validatePayload` correctly blocks new outbound burns via `isWhitelisted`), but `_domainsByChainId[chainId].domainId` still holds the previous Circle domain id.

The public view `getDomainId(uint256 chainId)` returns `domain.domainId` without checking `isWhitelisted`. After blacklisting, integrators, monitoring, or off-chain tooling that rely on `getDomainId` can still read a non-zero domain id and treat the chain as configured, even though bridging to that domain is disabled. 

Clearing `domain.domainId` on blacklist would align the forward and reverse mappings with the semantic “no active domain for this chain” and avoid stale reads.

##### Recommendation
We recommend resetting the stored domain identifier on blacklist so mappings and whitelist semantics stay aligned, and either documenting that `getDomainId` must be read together with the whitelist flag or changing `getDomainId` to return `0` when `!domain.isWhitelisted` so the view matches operational reality.



---

#### 33. `CustomOracleWrapper.getPrice()` — Returns Zero for Unset Tokens Without Reverting

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/79ca6dc8623bbdd1a4aa9d616a1a4514f9799b72
##### Description  
`CustomOracleWrapper.getPrice()` returns `(tokenToPrice[token], DEFAULT_PRICE_DECIMALS)` directly from the mapping. For tokens that have never had a price submitted via `submitPrice()`, the mapping defaults to 0, so the function returns `(0, 8)` without reverting. This contrasts with `ChainlinkOracleWrapper` which explicitly validates `require(price > 0, ZeroPrice(token))`. 

##### Recommendation
We recommend adding a zero-price check in `getPrice()` to revert with a descriptive error when no price has been submitted.



---

#### 34. `ChainlinkOracleWrapper` — Single Global Staleness Threshold for All Feeds

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/79ca6dc8623bbdd1a4aa9d616a1a4514f9799b72

##### Description  
`ChainlinkOracleWrapper` uses a single `priceFeedStalenessThreshold` applied to all token feeds in `_getAndValidateLatestRoundData()`. Chainlink documents a heartbeat per feed/asset, so staleness limits should be chosen per token to match that feed—not one global value for every asset.

##### Recommendation
We recommend implementing per-token staleness thresholds via a `mapping(address => uint256)` and setting the threshold alongside the feed in `setChainlinkFeed()`.



---

#### 35. `ChainlinkOracleWrapper` — No L2 Sequencer Uptime Check

##### Status
Acknowledged

##### Description
`ChainlinkOracleWrapper._getAndValidateLatestRoundData()` does not check the L2 sequencer uptime feed before using price data. On L2 chains, when the sequencer goes down and comes back up, Chainlink feeds may report stale pre-downtime prices that pass the staleness check because `updatedAt` is relative to L2 block time, which was frozen during downtime. Chainlink recommends checking the sequencer uptime feed on all L2 deployments to ensure that price data is not consumed immediately after a sequencer restart, before feeds have had time to update.

##### Recommendation
We recommend adding an L2 sequencer uptime feed check with a grace period, following Chainlink's recommended pattern: https://docs.chain.link/data-feeds/l2-sequencer-feeds

> **Client's Commentary**
> While monitoring the L2 sequencer status in addition to price staleness is a valid recommendation, we have assessed the risk as acceptable within our use case

---

#### 36. `PriceOracleAggregator` — Single Oracle per Token With No Fallback

##### Status
Acknowledged

##### Description  
The protocol routes each token through a single registered oracle: `PriceOracleAggregator.priceOracles` stores one implementation per token, and there is no secondary or fallback oracle. Both `fetchTokenPrice()` and `getRelativeValueUnified()` call `IPriceOracle.getPrice()` on that address with no `try`/`catch` and no alternate source.

If the configured oracle reverts (e.g. Chainlink feed stale, paused, or misconfigured), any call to `fetchTokenPrice()` or `getRelativeValueUnified()` fails, and every upstream function that depends on those entry points reverts with it. 

##### Recommendation
We recommend using a fallback oracle per token: register a secondary price source and, when the primary oracle’s `getPrice` reverts or returns unusable data, call the fallback instead. The same primary/fallback pattern should apply in both `fetchTokenPrice()` and `getRelativeValueUnified()`.

> **Client's Commentary**
> The absence of a fallback oracle is intentional and aligned with the protocol design.

---

#### 37. `Container`, `CrossChainContainer`, `StrategyTemplate` — Missing Storage Gaps (`__gap`) in Base Abstract Contracts

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/79ca6dc8623bbdd1a4aa9d616a1a4514f9799b72

##### Description  
The abstract base contracts `Container.sol`, `CrossChainContainer.sol`, and `StrategyTemplate.sol` are inherited by multiple upgradeable concrete contracts but do not declare `uint256[N] private __gap` storage reservations. While `StrategyContainer` and `BridgeAdapter` correctly have `__gap[50]`, the gap in `StrategyContainer` does NOT protect against additions in `Container` because Container's storage comes before StrategyContainer in the C3 linearization. If a future upgrade adds a state variable to `Container`, it will shift the storage layout of all derived contracts (`ContainerLocal`, `ContainerPrincipal`, `ContainerAgent`), corrupting their state (including critical fields like `vault`, `notion`, `_whitelistedTokens`). 

##### Recommendation
We recommend either adding `uint256[50] private __gap` at the end of `Container.sol`, `CrossChainContainer.sol`, and `StrategyTemplate.sol`, or adopting a namespaced storage layout (e.g. ERC-7201-style `keccak256` storage slots) so future layout changes cannot collide with derived contracts’ state.



---

#### 38. `CrossChainContainer.setBridgeAdapter()` and `ReshufflingGateway.blacklistBridgeAdapter()` — De-Listed Adapters Retain Token Approvals

##### Status
Acknowledged

##### Description  
Two contracts grant ERC-20 approvals to bridge adapters on a per-call basis but never revoke them when an adapter is removed:

- **`CrossChainContainer`** : `_approveTokenToBridgeAdapter()` calls `forceApprove(bridgeAdapter, amount)` before each bridge operation. When the adapter is de-supported via `setBridgeAdapter(adapter, false)`, the approval is not revoked.

- **`ReshufflingGateway`** : `bridgeTokens()` calls `safeIncreaseAllowance(bridgeAdapters[i], instructions[i].amount)` before each bridge call, so allowances accumulate across transactions. When the adapter is blacklisted via `blacklistBridgeAdapter()`, the accumulated approval is not revoked.

##### Recommendation
We recommend making adapter de-listing consistent across the protocol: some code paths may already revoke outstanding ERC-20 allowances when an adapter is removed, while `CrossChainContainer.setBridgeAdapter(adapter, false)` and `ReshufflingGateway.blacklistBridgeAdapter()` do not. The same explicit revoke step (e.g. `forceApprove(adapter, 0)` for every relevant token) should apply everywhere an adapter is disabled, so behaviour is uniform rather than mixed.

> **Client's Commentary**
> It is impossible to maintain entire list of whitelisted tokens on bridge adapter, since the list is subject to modification

---

#### 39. `StrategyContainer.isStrategyNavUnresolved()` — Incorrect Result for Non-Existent Strategies

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/79ca6dc8623bbdd1a4aa9d616a1a4514f9799b72
##### Description  
`StrategyContainer.isStrategyNavUnresolved()` discards the `found` boolean from `_strategies.indexOf(strategy)`. For non-existent strategies, `indexOf()` returns `(false, 0)`, and the function checks bit 0 of the bitmask — corresponding to a different strategy. All internal callers validate membership first, but the function is `public` and can return misleading results to external consumers. 

##### Recommendation
We recommend either adding a membership check (`if (!found) return false`) or changing visibility to `internal`.



---

#### 40. `Vault.claimWithdraw()` — Shares Permanently Locked When Notion Rounds to Zero

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/79ca6dc8623bbdd1a4aa9d616a1a4514f9799b72
##### Description
In `Vault.claimWithdraw()`, `notionToClaim` is computed via `mulDiv`:

```solidity
vars.notionToClaim = vars.withdrawnShares.mulDiv(
    withdrawBatchTotalNotion[batchId],
    withdrawBatchTotalShares[batchId]
);
if (vars.notionToClaim == 0) {
    return 0;
}
```

When `withdrawnShares` is very small relative to `withdrawBatchTotalShares`, the result rounds down to zero. The function returns early without clearing `pendingBatchWithdrawals[batchId][onBehalfOf]` and without calling `_burn()`. The user's shares remain on the Vault's balance permanently — repeated calls always return 0 since the same rounding applies, so there is no recovery path for the affected user.

##### Recommendation
We recommend separating the "no pending withdrawal" check (`withdrawnShares == 0`) from the "notion rounds to zero" case. When `withdrawnShares > 0`, always clear the record and burn the shares regardless of whether `notionToClaim` is zero. This way shares are always freed, even if the corresponding notion payout is dust.



---

#### 41. Empty `DepositRequest` Leaves `ContainerAgent` in Unrecoverable `DepositRequestReceived`

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/79ca6dc8623bbdd1a4aa9d616a1a4514f9799b72
##### Description  
A deposit request with `tokens.length == 0` leaves `claimCounter` at zero but still sets `DepositRequestReceived`. `claim()` then always reverts in `_claimExpectedToken` (`require(claimCounter > 0)`), so the agent cannot complete the deposit / Vault report flow. The live Principal stack cannot produce this payload, the gap is mainly defense in depth for future changes.

##### Recommendation  
We recommend ensuring `request.tokens.length > 0` before `DepositRequestReceived`.



---


#### 42. Strict Slippage Inequality in `_enterToState()` Reverts on Exact `minNavDelta` Match

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/79ca6dc8623bbdd1a4aa9d616a1a4514f9799b72

##### Description  
The private `StrategyTemplate._enterToState()` path (re-enter to a state) applies the same class of slippage check as the historical Low #9 issue in `_enter()`, but still uses a **strict** inequality.

After `_enterTarget()` / `_enterState(toStateId)`:

```solidity!
vars.stateToNavAfterEnter = stateNav(toStateId);

require(vars.stateToNavAfterEnter > vars.stateToNavBeforeEnter + minNavDelta);
```

In `_enter()`, the analogous check was corrected to **non-strict** `>=`, so an NAV increase exactly equal to `minNavDelta` succeeds there. In `_enterToState()`, an exact match still reverts. That is inconsistent between code paths and forces integrators to set `minNavDelta` slightly below the true floor to avoid spurious failures at the boundary.

##### Recommendation  
We recommend replacing `>` with `>=` in `_enterToState()` so `minNavDelta` is inclusive, matching `_enter()` and standard slippage semantics. If strictness is intentional for re-enters only, document it clearly at the API level.



---

#### 43. `defaultPriceFeedStalenessThreshold` Has No Post-Construction Setter in `ChainlinkOracleWrapper`

##### Status
Fixed in https://github.com/ShiftDeFi/shift-defi-platform/commit/c9d848e18ef820c3ae093e6b6af6b2cf220aac57

##### Description
The new `defaultPriceFeedStalenessThreshold` is set only in the constructor; no setter is exposed. Operators (`ORACLE_MANAGER_ROLE`) can override per-token via `setPriceFeedStalenessThreshold(token, threshold)`, but cannot retune the default. Because `ChainlinkOracleWrapper` is non-upgradable, the default is effectively immutable for the lifetime of the deployment — adjusting it requires a full redeploy and re-wire through `PriceOracleAggregator`.

##### Recommendation
We recommend adding a setter restricted to `ORACLE_MANAGER_ROLE`.



---

## 3. About MixBytes
**MixBytes** is a leading provider of smart contract auditing and blockchain security research, helping Web3 projects enhance their security and reliability.

Since its inception, MixBytes has been dedicated to safeguarding innovation in **DeFi** through rigorous audits and cutting-edge technical research.

Our team brings together experienced engineers, security auditors, and blockchain researchers with deep expertise in smart contract security and protocol design.

With years of proven experience in Web3, MixBytes combines in-depth technical excellence with a proactive, security-first approach.

###  Why MixBytes
- **Proven Track Record** — Trusted by leading blockchain protocols such as **Lido**, **Aave**, **Curve**, **1inch**, **Fluid**, **Gearbox**, **Resolv**, and others. MixBytes has successfully secured billions of dollars in digital assets.
- **Technical Expertise** — Our auditors and researchers hold advanced degrees in cryptography, cybersecurity, and distributed systems, backed by years of hands-on experience.
- **Innovative Research** — MixBytes actively contributes to blockchain security research and open-source tools, sharing insights with the global community.

###  Our Services
- **Smart Contract Audits** — Comprehensive security assessments of DeFi protocols to detect and mitigate vulnerabilities before deployment.
- **Blockchain Research** — In-depth technical studies, economic and protocol-level modeling for Web3 projects.
- **Custom Security Solutions** — Tailored frameworks and advisory for complex decentralized systems and blockchain ecosystems.

### Contact Information
- [**Website**](https://mixbytes.io/)
- [**GitHub**](https://github.com/mixbytes/audits_public)
- [**X**](https://x.com/MixBytes)
- **Mail:** [hello@mixbytes.io](mailto:hello@mixbytes.io)