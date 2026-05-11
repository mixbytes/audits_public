# CrossCurve CDP Security Audit Report

###### tags: `CrossCurve`, `CDP`, `Eywa`

## 1. INTRODUCTION

### 1.1 Disclaimer
The audit makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 
    
    
### 1.2 Executive Summary
CrossCurve CDP (Cross-Chain Data Protocol) is a messaging protocol designed for cross-chain data transfers, utilizing multiple projects like LayerZero, Axelar Bridge and Eywa Bridge. This security audit covers the latest updates to the protocol logic, including the integration of Router Protocol as an additional cross-chain messaging layer.

The audit was conducted by 3 auditors, involving an in-depth manual code review and automated analysis within the scope.

During the audit, in addition to verifying standard attack vectors and our internal checklist, we conducted an in-depth review of the following areas:

* **Cross-Chain Message Replay Protection.** We verified that cross-chain messages in the `Receiver` contract can be executed only once and no replay attacks are possible. The contract uses unique `requestIds` and maintains execution state to prevent duplicate message processing.

* **Cross-Chain Data Decoding Consistency.** We confirmed that `data` decoding in `RouterReceiver.iReceive()` function works consistently with other receiver contracts (`ReceiverLZ`, `ReceiverAxelar`) and no data corruption or cross-chain message breaks due to wrong decoding are possible. All receiver contracts follow the same data structure and decoding patterns.

* **Treasury Fund Protection.** We verified that funds from treasury cannot be stolen, only authorized callers can transfer funds from the contract. The treasury implements proper access controls and role-based permissions to prevent unauthorized withdrawals.

* **Bridge State Enforcement.** We verified that the `BridgeRouter` contract can send messages only when in the `active` state; there is no way to get around this restriction.

* **Threshold-Based Message Validation.** We confirmed that only senders with non-zero threshold can send messages through `GateKeeper.sendData()`. The contract validates threshold requirements before processing any cross-chain messages, preventing unauthorized message transmission.

* **Threshold and Validation Enforcement.** We verified that all cross-chain messages undergo proper threshold checks and validation through `Receiver` contracts before execution, preventing unauthorized or malicious message processing.

* **Multi-Bridge Priority System.** We verified that the bridge priority system in `GateKeeper` correctly selects and validates bridges before sending messages, ensuring proper fallback mechanisms and preventing message delivery failures.

* **State Consistency.** We confirmed that bridge state management is consistent across all operations and state changes are properly validated and enforced.

* **Request ID Uniqueness.** We confirmed that request ID generation and validation mechanisms prevent duplicate message processing and ensure proper message tracking.

* **Correctness of the integration with Router.** The main improvement in the project compared to the previously audited versions is the integration with the Router bridge. We verified whether the integration works correctly, including protection against relayer spoofing, sufficient authorization of the peer, and correctness of fee payments.

* **Verification of the fee compensation module.** Another improvement in the project was the introduction of a fee compensation module. We assessed how well this system is protected against manipulation, theft, and unjustified payouts, as well as the overall correctness of its implementation.

**Key Notes**
* **Integration security: sender validation in `receiveValidatedData`.** On the destination chain, `Receiver._execute` performs a `functionCall` on the executor address specified by the sender. Integrating contracts must properly validate `from`, `selector`, and `chainIdFrom` in their `receiveValidatedData` implementation, as this is the primary defense against unauthorized cross-chain calls. This requirement should be explicitly documented in the integration guide.

* **Test suite quality and coverage.** It's recommended to introduce code coverage tooling and systematically increase coverage by adding unit, integration, and end-to-end tests for critical paths. A stable, regularly executed test suite significantly reduces the risk of regressions and undetected vulnerabilities.

* **EywaDVN bridge configuration.** EywaDVN sends DVN confirmations through GateKeeper using the bridges configured in `bridgesByPriority`. If BridgeLZ (LayerZero) is included, DVN confirmations are sent as LZ messages, which may themselves require DVN verification—creating a circular dependency. End-user message delivery is not at risk (other DVNs will meet quorum), but EywaDVN may pay gas for `assignJob` without receiving validation fees if its confirmation does not reach the destination. It's recommended to configure EywaDVN to use non-LZ bridges for sending DVN confirmations.

In addition to the technical areas above, it's recommended to place special emphasis on sustaining and improving overall code quality. Specifically, the project should:

- Use automated tooling to catch errors, typos, and anti-patterns early (e.g., linters, static analysis, and AI-assisted code review agents).
- Subject changes to internal peer review by other developers to surface design concerns, ensure consistency, and share domain knowledge.
- Conduct thorough end-to-end testing on public and private testnets, including cross-chain message flows.
- Set up on-chain monitoring to detect anomalies, failed transactions, and unusual activity in real time.

During the diff re-audit we verified the fixes for L-11 through L-16 and identified new issues introduced by the changes — primarily around the `executeGasLimit` mechanism and the native ETH value forwarding feature added to `BridgeV3` and `Receiver`.

We also identified the following design limitations that warrant attention before production deployment:

* **Unclear economic model for validator-supplied `msg.value`.** In `BridgeV3.receiveV3`, the validator supplies `msg.value` which is forwarded to the execution target. It is not documented who bears this cost — the executor fee (`_payForExecute`) covers gas but does not account for value forwarding. We recommend defining and documenting the reimbursement model.

* **`receiveHash()` records confirmations before threshold configuration.** The threshold check was removed from `receiveHash()` as part of the L-15 fix because the function cannot unpack the `target` address for the new target-based lookup. Hash confirmations recorded before threshold setup silently count toward the threshold after later configuration. We recommend documenting this as a known limitation of the target-based threshold model.

Following a security incident with CrossCurve ([post-mortem](https://x.com/MixBytes/status/2018304206763892766)), the ReceiverAxelar contract logic has been updated and verified as part of the re-audit. The protocol is intended to work with multiple bridges and collect consensus between them for secure cross-chain message delivery. The security of this model relies on requiring multiple independent bridge confirmations before executing a message on the destination chain. Setting threshold = 1 reduces the protocol to a single-bridge mode, which significantly weakens security by removing the consensus requirement.

Given the size of the codebase, the current state of code quality, and the number of issues identified during the audit, we recommend a follow-up audit by an independent team to reduce oversight risk and strengthen security assurance.

The issues we identified during the audit are documented in the **Findings Report** section.

***

### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client Name| CrossCurve
Category| Cross Chain Bridge
Project Name| CDP
Type| Solidity
Platform| EVM
Timeline| 29.07.2025 - 13.04.2026
    
#### Scope of Audit

File | Link
--- | ---
contracts/bridge/DVN/EywaDVN.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/04dbad0012b2d47321670ba7af8a737cdf073145/contracts/bridge/DVN/EywaDVN.sol
contracts/bridge/receive/ReceiverRouter.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/04dbad0012b2d47321670ba7af8a737cdf073145/contracts/bridge/receive/ReceiverRouter.sol
contracts/bridge/send/BridgeRouter.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/04dbad0012b2d47321670ba7af8a737cdf073145/contracts/bridge/send/BridgeRouter.sol
contracts/bridge/ExecutorFeeManager.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/04dbad0012b2d47321670ba7af8a737cdf073145/contracts/bridge/ExecutorFeeManager.sol
contracts/bridge/GateKeeper.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/04dbad0012b2d47321670ba7af8a737cdf073145/contracts/bridge/GateKeeper.sol
contracts/bridge/Receiver.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/04dbad0012b2d47321670ba7af8a737cdf073145/contracts/bridge/Receiver.sol
contracts/bridge/NativeTreasury.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/04dbad0012b2d47321670ba7af8a737cdf073145/contracts/bridge/NativeTreasury.sol
contracts/bridge/oracles/ChainIdAdapter.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/bridge/oracles/ChainIdAdapter.sol
contracts/bridge/oracles/GasPriceOracle.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/bridge/oracles/GasPriceOracle.sol
contracts/bridge/oracles/LayerZeroOracle.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/bridge/oracles/LayerZeroOracle.sol
contracts/bridge/receive/ReceiverAxelar.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/bridge/receive/ReceiverAxelar.sol
contracts/bridge/receive/ReceiverLZ.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/bridge/receive/ReceiverLZ.sol
contracts/bridge/send/BridgeAxelar.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/bridge/send/BridgeAxelar.sol
contracts/bridge/send/BridgeLZ.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/bridge/send/BridgeLZ.sol
contracts/bridge/BridgeV3.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/bridge/BridgeV3.sol
contracts/bridge/EPOA.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/bridge/EPOA.sol
contracts/bridge/GovBridgeV2.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/bridge/GovBridgeV2.sol
contracts/bridge/NodeRegistryV2.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/bridge/NodeRegistryV2.sol
contracts/utils/Block.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/utils/Block.sol
contracts/utils/Bls.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/utils/Bls.sol
contracts/utils/Merkle.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/utils/Merkle.sol
contracts/utils/ModUtils.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/utils/ModUtils.sol
contracts/utils/RequestIdLib.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/utils/RequestIdLib.sol
contracts/utils/Typecast.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/utils/Typecast.sol
contracts/utils/Utils.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/utils/Utils.sol
contracts/utils/ZeroCopySource.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/9a497e2a7c4949371854fb2b53a8d206c07b4064/contracts/utils/ZeroCopySource.sol
contracts/bridge/oracles/EywaOracle.sol | https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/oracles/EywaOracle.sol

#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
29.07.2025 | 04dbad0012b2d47321670ba7af8a737cdf073145 | Initial commit
11.08.2025 | 2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b | Re-audit commit
29.09.2025 | 9a497e2a7c4949371854fb2b53a8d206c07b4064 | Second re-audit commit
20.10.2025 | 52720bf2d46914436f10053522181ff20d4af02d | Third re-audit commit
24.10.2025 | 3173d41cc28dc7f8b5b2dc23175ce4839b2afbc3 | Fourth re-audit commit
19.03.2026 | 3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee | Diff audit commit
08.04.2026 | f8b62aca0d358b09909e2a7eb33446c1d6fade72 | Diff re-audit commit
13.04.2026 | cb10b7ef6d920f725bbb293c2ba383bcdab4c8a5 | Second diff re-audit commit
13.04.2026 | 2e918faa73bccd46b89dd65051a59742580cb957 | L17-L19 fix re-audit commit

#### Mainnet Deployments
| File | Address | Blockchain |
| --- | --- | --- |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://arbiscan.io/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Arbitrum One |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://arbiscan.io/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Arbitrum One |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://arbiscan.io/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Arbitrum One |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://arbiscan.io/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Arbitrum One |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://arbiscan.io/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Arbitrum One |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://arbiscan.io/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Arbitrum One |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://arbiscan.io/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Arbitrum One |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://arbiscan.io/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Arbitrum One |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://arbiscan.io/address/0xD2bc3186655442e321eF00e82259005557015975) | Arbitrum One |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://arbiscan.io/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Arbitrum One |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://arbiscan.io/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Arbitrum One |
| EywaOracle.sol | [0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1](https://arbiscan.io/address/0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1) | Arbitrum One |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://arbiscan.io/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Arbitrum One |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://snowscan.xyz/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Avalanche C-Chain |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://snowscan.xyz/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Avalanche C-Chain |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://snowscan.xyz/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Avalanche C-Chain |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://snowscan.xyz/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Avalanche C-Chain |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://snowscan.xyz/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Avalanche C-Chain |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://snowscan.xyz/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Avalanche C-Chain |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://snowscan.xyz/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Avalanche C-Chain |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://snowscan.xyz/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Avalanche C-Chain |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://snowscan.xyz/address/0xD2bc3186655442e321eF00e82259005557015975) | Avalanche C-Chain |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://snowscan.xyz/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Avalanche C-Chain |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://snowscan.xyz/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Avalanche C-Chain |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://snowscan.xyz/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Avalanche C-Chain |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://explorer.aurora.dev/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Aurora |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://explorer.aurora.dev/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Aurora |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://explorer.aurora.dev/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Aurora |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://explorer.aurora.dev/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Aurora |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://explorer.aurora.dev/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Aurora |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://explorer.aurora.dev/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Aurora |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://explorer.aurora.dev/address/0xD2bc3186655442e321eF00e82259005557015975) | Aurora |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://explorer.aurora.dev/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Aurora |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://explorer.aurora.dev/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Aurora |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://explorer.aurora.dev/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Aurora |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://basescan.org/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Base |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://basescan.org/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Base |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://basescan.org/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Base |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://basescan.org/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Base |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://basescan.org/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Base |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://basescan.org/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Base |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://basescan.org/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Base |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://basescan.org/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Base |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://basescan.org/address/0xD2bc3186655442e321eF00e82259005557015975) | Base |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://basescan.org/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Base |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://basescan.org/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Base |
| EywaOracle.sol | [0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1](https://basescan.org/address/0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1) | Base |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://basescan.org/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Base |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://berascan.com/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Berachain |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://berascan.com/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Berachain |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://berascan.com/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Berachain |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://berascan.com/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Berachain |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://berascan.com/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Berachain |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://berascan.com/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Berachain |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://berascan.com/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Berachain |
| ChainIdAdapter.sol | [0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a](https://berascan.com/address/0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a) | Berachain |
| GasPriceOracle.sol | [0x2b47493C5bE229CB96319bD3939Ae652a6599ce7](https://berascan.com/address/0x2b47493C5bE229CB96319bD3939Ae652a6599ce7) | Berachain |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://berascan.com/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Berachain |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://berascan.com/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Berachain |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://blastscan.io/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Blast |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://blastscan.io/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Blast |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://blastscan.io/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Blast |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://blastscan.io/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Blast |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://blastscan.io/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Blast |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://blastscan.io/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Blast |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://blastscan.io/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Blast |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://blastscan.io/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Blast |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://blastscan.io/address/0xD2bc3186655442e321eF00e82259005557015975) | Blast |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://blastscan.io/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Blast |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://blastscan.io/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Blast |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://blastscan.io/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Blast |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://bscscan.com/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | BNB Chain |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://bscscan.com/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | BNB Chain |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://bscscan.com/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | BNB Chain |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://bscscan.com/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | BNB Chain |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://bscscan.com/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | BNB Chain |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://bscscan.com/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | BNB Chain |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://bscscan.com/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | BNB Chain |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://bscscan.com/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | BNB Chain |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://bscscan.com/address/0xD2bc3186655442e321eF00e82259005557015975) | BNB Chain |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://bscscan.com/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | BNB Chain |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://bscscan.com/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | BNB Chain |
| EywaOracle.sol | [0x8BD26a20C0bE52fCE863C0bb0Fd573151213cD58](https://bscscan.com/address/0x8BD26a20C0bE52fCE863C0bb0Fd573151213cD58) | BNB Chain |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://bscscan.com/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | BNB Chain |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://celoscan.io/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Celo |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://celoscan.io/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Celo |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://celoscan.io/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Celo |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://celoscan.io/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Celo |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://celoscan.io/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Celo |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://celoscan.io/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Celo |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://celoscan.io/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Celo |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://celoscan.io/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Celo |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://celoscan.io/address/0xD2bc3186655442e321eF00e82259005557015975) | Celo |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://celoscan.io/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Celo |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://celoscan.io/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Celo |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://celoscan.io/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Celo |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://scan.coredao.org/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Core DAO |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://scan.coredao.org/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Core DAO |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://scan.coredao.org/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Core DAO |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://scan.coredao.org/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Core DAO |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://scan.coredao.org/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Core DAO |
| ChainIdAdapter.sol | [0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a](https://scan.coredao.org/address/0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a) | Core DAO |
| GasPriceOracle.sol | [0x1FC7dB2Dc66Be96E3af4F4A6B6ECB27f62F69f52](https://scan.coredao.org/address/0x1FC7dB2Dc66Be96E3af4F4A6B6ECB27f62F69f52) | Core DAO |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://scan.coredao.org/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Core DAO |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://scan.coredao.org/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Core DAO |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://explorer.cronos.org/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Cronos |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://explorer.cronos.org/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Cronos |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://explorer.cronos.org/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Cronos |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://explorer.cronos.org/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Cronos |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://explorer.cronos.org/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Cronos |
| ChainIdAdapter.sol | [0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a](https://explorer.cronos.org/address/0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a) | Cronos |
| GasPriceOracle.sol | [0xB53ab6BC23f02C85Cc27e098E3CaE3D834184426](https://explorer.cronos.org/address/0xB53ab6BC23f02C85Cc27e098E3CaE3D834184426) | Cronos |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://explorer.cronos.org/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Cronos |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://explorer.cronos.org/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Cronos |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://xfiscan.com/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | CrossFi |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://xfiscan.com/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | CrossFi |
| ExecutorFeeManager.sol | [0x2CB8e6c04B00925D28d7df5d1BBA35057958b4D5](https://xfiscan.com/address/0x2CB8e6c04B00925D28d7df5d1BBA35057958b4D5) | CrossFi |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://xfiscan.com/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | CrossFi |
| ChainIdAdapter.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://xfiscan.com/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | CrossFi |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://xfiscan.com/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | CrossFi |
| EywaOracle.sol | [0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1](https://xfiscan.com/address/0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1) | CrossFi |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://xfiscan.com/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | CrossFi |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://etherscan.io/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Ethereum |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://etherscan.io/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Ethereum |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://etherscan.io/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Ethereum |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://etherscan.io/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Ethereum |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://etherscan.io/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Ethereum |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://etherscan.io/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Ethereum |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://etherscan.io/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Ethereum |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://etherscan.io/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Ethereum |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://etherscan.io/address/0xD2bc3186655442e321eF00e82259005557015975) | Ethereum |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://etherscan.io/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Ethereum |
| LayerZeroOracle.sol | [0xA71CE928934CD996907589FcDd4083124509E8fb](https://etherscan.io/address/0xA71CE928934CD996907589FcDd4083124509E8fb) | Ethereum |
| EywaOracle.sol | [0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1](https://etherscan.io/address/0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1) | Ethereum |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://etherscan.io/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Ethereum |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://www.oklink.com/fantom/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Fantom |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://www.oklink.com/fantom/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Fantom |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://www.oklink.com/fantom/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Fantom |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://www.oklink.com/fantom/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Fantom |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://www.oklink.com/fantom/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Fantom |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://www.oklink.com/fantom/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Fantom |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://www.oklink.com/fantom/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Fantom |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://www.oklink.com/fantom/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Fantom |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://www.oklink.com/fantom/address/0xD2bc3186655442e321eF00e82259005557015975) | Fantom |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://www.oklink.com/fantom/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Fantom |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://www.oklink.com/fantom/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Fantom |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://www.oklink.com/fantom/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Fantom |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://fraxscan.com/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Fraxtal |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://fraxscan.com/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Fraxtal |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://fraxscan.com/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Fraxtal |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://fraxscan.com/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Fraxtal |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://fraxscan.com/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Fraxtal |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://fraxscan.com/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Fraxtal |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://fraxscan.com/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Fraxtal |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://fraxscan.com/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Fraxtal |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://fraxscan.com/address/0xD2bc3186655442e321eF00e82259005557015975) | Fraxtal |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://fraxscan.com/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Fraxtal |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://fraxscan.com/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Fraxtal |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://fraxscan.com/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Fraxtal |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://gnosisscan.io/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Gnosis |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://gnosisscan.io/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Gnosis |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://gnosisscan.io/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Gnosis |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://gnosisscan.io/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Gnosis |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://gnosisscan.io/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Gnosis |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://gnosisscan.io/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Gnosis |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://gnosisscan.io/address/0xD2bc3186655442e321eF00e82259005557015975) | Gnosis |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://gnosisscan.io/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Gnosis |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://gnosisscan.io/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Gnosis |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://gnosisscan.io/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Gnosis |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://haust-network-blockscout.eu-north-2.gateway.fm/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Haust |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://haust-network-blockscout.eu-north-2.gateway.fm/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Haust |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://haust-network-blockscout.eu-north-2.gateway.fm/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Haust |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://haust-network-blockscout.eu-north-2.gateway.fm/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Haust |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://haust-network-blockscout.eu-north-2.gateway.fm/address/0xD2bc3186655442e321eF00e82259005557015975) | Haust |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://haust-network-blockscout.eu-north-2.gateway.fm/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Haust |
| EywaOracle.sol | [0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1](https://haust-network-blockscout.eu-north-2.gateway.fm/address/0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1) | Haust |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://kavascan.com/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Kava EVM |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://kavascan.com/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Kava EVM |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://kavascan.com/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Kava EVM |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://kavascan.com/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Kava EVM |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://kavascan.com/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Kava EVM |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://kavascan.com/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Kava EVM |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://kavascan.com/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Kava EVM |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://kavascan.com/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Kava EVM |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://kavascan.com/address/0xD2bc3186655442e321eF00e82259005557015975) | Kava EVM |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://kavascan.com/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Kava EVM |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://kavascan.com/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Kava EVM |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://kavascan.com/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Kava EVM |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://lineascan.build/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Linea |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://lineascan.build/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Linea |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://lineascan.build/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Linea |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://lineascan.build/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Linea |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://lineascan.build/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Linea |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://lineascan.build/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Linea |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://lineascan.build/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Linea |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://lineascan.build/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Linea |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://lineascan.build/address/0xD2bc3186655442e321eF00e82259005557015975) | Linea |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://lineascan.build/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Linea |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://lineascan.build/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Linea |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://lineascan.build/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Linea |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://pacific-explorer.manta.network/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Manta Pacific |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://pacific-explorer.manta.network/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Manta Pacific |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://pacific-explorer.manta.network/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Manta Pacific |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://pacific-explorer.manta.network/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Manta Pacific |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://pacific-explorer.manta.network/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Manta Pacific |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://pacific-explorer.manta.network/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Manta Pacific |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://pacific-explorer.manta.network/address/0xD2bc3186655442e321eF00e82259005557015975) | Manta Pacific |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://pacific-explorer.manta.network/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Manta Pacific |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://pacific-explorer.manta.network/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Manta Pacific |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://pacific-explorer.manta.network/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Manta Pacific |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://mantlescan.xyz/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Mantle |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://mantlescan.xyz/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Mantle |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://mantlescan.xyz/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Mantle |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://mantlescan.xyz/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Mantle |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://mantlescan.xyz/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Mantle |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://mantlescan.xyz/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Mantle |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://mantlescan.xyz/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Mantle |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://mantlescan.xyz/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Mantle |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://mantlescan.xyz/address/0xD2bc3186655442e321eF00e82259005557015975) | Mantle |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://mantlescan.xyz/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Mantle |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://mantlescan.xyz/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Mantle |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://mantlescan.xyz/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Mantle |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://explorer.metis.io/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Metis Andromeda |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://explorer.metis.io/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Metis Andromeda |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://explorer.metis.io/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Metis Andromeda |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://explorer.metis.io/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Metis Andromeda |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://explorer.metis.io/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Metis Andromeda |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://explorer.metis.io/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Metis Andromeda |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://explorer.metis.io/address/0xD2bc3186655442e321eF00e82259005557015975) | Metis Andromeda |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://explorer.metis.io/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Metis Andromeda |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://explorer.metis.io/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Metis Andromeda |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://explorer.metis.io/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Metis Andromeda |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://explorer.mode.network/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Mode |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://explorer.mode.network/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Mode |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://explorer.mode.network/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Mode |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://explorer.mode.network/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Mode |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://explorer.mode.network/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Mode |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://explorer.mode.network/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Mode |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://explorer.mode.network/address/0xD2bc3186655442e321eF00e82259005557015975) | Mode |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://explorer.mode.network/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Mode |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://explorer.mode.network/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Mode |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://explorer.mode.network/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Mode |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://moonbeam.moonscan.io/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Moonbeam |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://moonbeam.moonscan.io/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Moonbeam |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://moonbeam.moonscan.io/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Moonbeam |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://moonbeam.moonscan.io/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Moonbeam |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://moonbeam.moonscan.io/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Moonbeam |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://moonbeam.moonscan.io/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Moonbeam |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://moonbeam.moonscan.io/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Moonbeam |
| ChainIdAdapter.sol | [0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a](https://moonbeam.moonscan.io/address/0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a) | Moonbeam |
| GasPriceOracle.sol | [0x15de7D6DadDFe8ee5aEf86D9e2A698Ab4C71eF9b](https://moonbeam.moonscan.io/address/0x15de7D6DadDFe8ee5aEf86D9e2A698Ab4C71eF9b) | Moonbeam |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://moonbeam.moonscan.io/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Moonbeam |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://moonbeam.moonscan.io/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Moonbeam |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://optimistic.etherscan.io/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Optimism |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://optimistic.etherscan.io/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Optimism |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://optimistic.etherscan.io/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Optimism |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://optimistic.etherscan.io/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Optimism |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://optimistic.etherscan.io/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Optimism |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://optimistic.etherscan.io/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Optimism |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://optimistic.etherscan.io/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Optimism |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://optimistic.etherscan.io/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Optimism |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://optimistic.etherscan.io/address/0xD2bc3186655442e321eF00e82259005557015975) | Optimism |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://optimistic.etherscan.io/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Optimism |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://optimistic.etherscan.io/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Optimism |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://optimistic.etherscan.io/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Optimism |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://polygonscan.com/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Polygon |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://polygonscan.com/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Polygon |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://polygonscan.com/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Polygon |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://polygonscan.com/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Polygon |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://polygonscan.com/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Polygon |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://polygonscan.com/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Polygon |
| BridgeAxelar.sol | [0x415eD48593bA66AB29172a48b344eb62E7FfcDBC](https://polygonscan.com/address/0x415eD48593bA66AB29172a48b344eb62E7FfcDBC) | Polygon |
| ReceiverAxelar.sol | [0xDf7eb07E2539E0c12D8D967792dEF763512AA951](https://polygonscan.com/address/0xDf7eb07E2539E0c12D8D967792dEF763512AA951) | Polygon |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://polygonscan.com/address/0xD2bc3186655442e321eF00e82259005557015975) | Polygon |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://polygonscan.com/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Polygon |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://polygonscan.com/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Polygon |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://polygonscan.com/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Polygon |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://sonicscan.org/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Sonic |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://sonicscan.org/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Sonic |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://sonicscan.org/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Sonic |
| GovBridgeV2.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://sonicscan.org/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Sonic |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://sonicscan.org/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Sonic |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://sonicscan.org/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Sonic |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://sonicscan.org/address/0xD2bc3186655442e321eF00e82259005557015975) | Sonic |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://sonicscan.org/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Sonic |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://sonicscan.org/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Sonic |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://sonicscan.org/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Sonic |
| NodeRegistryV2.sol | [0xE442fFC9FFEF2588B4620C29FDeBD03971eb4319](https://sonicscan.org/address/0xE442fFC9FFEF2588B4620C29FDeBD03971eb4319) | Sonic |
| EPOA.sol | [0xab5a107009E25e6A9ee507ef18EC63878188BAb8](https://sonicscan.org/address/0xab5a107009E25e6A9ee507ef18EC63878188BAb8) | Sonic |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://taikoscan.io/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Taiko |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://taikoscan.io/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Taiko |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://taikoscan.io/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Taiko |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://taikoscan.io/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Taiko |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://taikoscan.io/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Taiko |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://taikoscan.io/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Taiko |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://taikoscan.io/address/0xD2bc3186655442e321eF00e82259005557015975) | Taiko |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://taikoscan.io/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Taiko |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://taikoscan.io/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Taiko |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://taikoscan.io/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Taiko |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://uniscan.xyz/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Unichain |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://uniscan.xyz/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Unichain |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://uniscan.xyz/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Unichain |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://uniscan.xyz/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | Unichain |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://uniscan.xyz/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | Unichain |
| ChainIdAdapter.sol | [0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a](https://uniscan.xyz/address/0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a) | Unichain |
| GasPriceOracle.sol | [0x59B0C6a13C27840522f02402964b51953c36C827](https://uniscan.xyz/address/0x59B0C6a13C27840522f02402964b51953c36C827) | Unichain |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://uniscan.xyz/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | Unichain |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://uniscan.xyz/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Unichain |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://explorer.unit0.dev/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | Units (Unit Zero) |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://explorer.unit0.dev/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | Units (Unit Zero) |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://explorer.unit0.dev/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | Units (Unit Zero) |
| BridgeV3.sol | [0x9291c5586217348542720C5FB1028c9C976C7b50](https://explorer.unit0.dev/address/0x9291c5586217348542720C5FB1028c9C976C7b50) | Units (Unit Zero) |
| ChainIdAdapter.sol | [0xD2bc3186655442e321eF00e82259005557015975](https://explorer.unit0.dev/address/0xD2bc3186655442e321eF00e82259005557015975) | Units (Unit Zero) |
| GasPriceOracle.sol | [0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6](https://explorer.unit0.dev/address/0x6f09fe05b2B9Ac652942b1A4E94598C8c6695fF6) | Units (Unit Zero) |
| EywaOracle.sol | [0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1](https://explorer.unit0.dev/address/0xEE1D1178e288F6B066969f99F104F69Bf53c5bD1) | Units (Unit Zero) |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://explorer.unit0.dev/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | Units (Unit Zero) |
| Receiver.sol | [0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26](https://www.oklink.com/x-layer/address/0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26) | X Layer |
| GateKeeper.sol | [0x072CAe5518Fb2681347F80D143Eb07c37353B97C](https://www.oklink.com/x-layer/address/0x072CAe5518Fb2681347F80D143Eb07c37353B97C) | X Layer |
| ExecutorFeeManager.sol | [0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9](https://www.oklink.com/x-layer/address/0x0Ad89b3e12a4ad21E52F521bEB0C005bbb1a4Ea9) | X Layer |
| BridgeLZ.sol | [0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7](https://www.oklink.com/x-layer/address/0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7) | X Layer |
| ReceiverLZ.sol | [0x0e46c66C2D0a7906cE06cE57f0212d11984273e9](https://www.oklink.com/x-layer/address/0x0e46c66C2D0a7906cE06cE57f0212d11984273e9) | X Layer |
| ChainIdAdapter.sol | [0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a](https://www.oklink.com/x-layer/address/0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a) | X Layer |
| GasPriceOracle.sol | [0xfF681cf7570023624A9aAf20716d2A7FEBdFc1e6](https://www.oklink.com/x-layer/address/0xfF681cf7570023624A9aAf20716d2A7FEBdFc1e6) | X Layer |
| LayerZeroOracle.sol | [0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222](https://www.oklink.com/x-layer/address/0xb0ED75BC5A32a3cbD23F132D040fD74A4be77222) | X Layer |
| NativeTreasury.sol | [0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5](https://www.oklink.com/x-layer/address/0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5) | X Layer |

Validation was performed across all 30 mainnet networks declared in `config/mainnet/output_config_bridge_mainnet.json`. (Ethereum, Arbitrum One, Optimism, Base, BNB Chain, Polygon, Avalanche C-Chain, Aurora, Berachain, Blast, Celo, Core DAO, Cronos, CrossFi, Fantom, Fraxtal, Gnosis, Haust, Kava EVM, Linea, Manta Pacific, Mantle, Metis Andromeda, Mode, Moonbeam, Sonic, Taiko, Unichain, Units, X Layer; the `monad` entry is reserved but contains no deployed addresses). All deployments compile byte-for-byte from the audit-scope sources at eywa-cdp `2e918faa73bccd46b89dd65051a59742580cb957` against pinned dependencies (`@openzeppelin/contracts@4.9.6` exact, `@layerzerolabs/lz-evm-oapp-v2@^2.3.44`, `@layerzerolabs/lz-evm-protocol-v2@^3.0.167`, `@layerzerolabs/lz-evm-messagelib-v2@^3.0.167`, `@axelar-network/axelar-gmp-sdk-solidity@^6.0.6`, `@routerprotocol/evm-gateway-contracts@^1.1.13`, `solidity-bytes-utils@^0.8.4`, `hardhat@^3.0.11`); solc version 0.8.20 with optimizer runs=200, evm target `shanghai` for 27 chains and `london` for the three chains that don't accept the `PUSH0` opcode (Kava EVM, Fantom, CrossFi).

On every network the same canonical CREATE2 addresses are reused: 

- `Receiver` at `0x53173e5803bE85BC81e47Ea1d917783eAcEfaE26`,
- `GateKeeper` at `0x072CAe5518Fb2681347F80D143Eb07c37353B97C`, 
- `BridgeV3` at `0x9291c5586217348542720C5FB1028c9C976C7b50`, 
- `BridgeLZ` at `0x3cF16222326b9fe499f2DAe5391dD3BbC619dFb7`, 
- `ReceiverLZ` at `0x0e46c66C2D0a7906cE06cE57f0212d11984273e9`, 
- `BridgeAxelar` at `0x415eD48593bA66AB29172a48b344eb62E7FfcDBC`, 
- `ReceiverAxelar` at `0xDf7eb07E2539E0c12D8D967792dEF763512AA951`, 
- `NativeTreasury` (legacy treasury, exposed as `routerOld`) at `0x86bEecEfAefC42a776F94696131f1FDe7c786Bb5`. 
- `ChainIdAdapter`, `GasPriceOracle`, `LayerZeroOracle` and `EywaOracle` are similarly canonical on most chains, with six chains (`berachain`, `core`, `cronos`, `moonbeam`, `unichain`, `xlayer`) using a fork of the chainIdAdapter at `0xF7b78E7d22d82a3F86e9eeE7562B32e149cE857a` (rather than the canonical `0xD2bc3186655442e321Ef00E82259005557015975` used by the other 24 chains) and the same six chains each carrying a per-chain `GasPriceOracle` override: `berachain` at `0x2b47493C5bE229CB96319bD3939Ae652a6599ce7`, `core` at `0x1FC7dB2Dc66Be96E3af4F4A6B6ECB27f62F69f52`, `cronos` at `0xB53ab6BC23f02C85Cc27e098E3CaE3D834184426`, `moonbeam` at `0x15de7D6DadDFe8ee5aEf86D9e2A698Ab4C71eF9b`, `unichain` at `0x59B0C6a13C27840522f02402964b51953c36C827`, `xlayer` at `0xfF681cf7570023624A9aAf20716d2A7FEBdFc1e6`.

The runtime bytecode of every contract was fetched via `eth_getCode` and compared against the locally compiled `deployedBytecode` after stripping the Solidity CBOR metadata footer (outer + every embedded footer carried by `new X()` creation code, e.g. `GateKeeper` embedding `NativeTreasury`) and masking declared `immutableReferences`. **325 of 325 entries match byte-for-byte** at the commit `2e918faa73bccd46b89dd65051a59742580cb957`.

The constructor-immutable slots are populated as expected: on contracts that take chain-id or peer addresses through their constructor (`BridgeLZ`, `ReceiverLZ`, `BridgeAxelar`, `NativeTreasury`, `EPOA`), each chain's runtime carries the chain-specific values in those slots — that's the only material variation between chains for the contracts using canonical CREATE2 addresses. Per-chain state was also confirmed: every contract reports `paused() == false`; bridge transports return their expected `tag()` (`"Eywa"` / `"LZ"` / `"Axelar"`); `BridgeV3.version()` returns the same string everywhere; `LayerZero` peers point to the canonical `ReceiverLZ`/`BridgeLZ` on the remote chain (`peers(eid) == bytes32(remote_addr)`); `Axelar` peers (`BridgeAxelar.receivers(uint64)`, `ReceiverAxelar.peers(string)`) likewise resolve to the canonical remote addresses on the chain pairs that are configured.

**Cross-chain wiring.** Every (source, remote) bridge-config slot was swept by `eth_call` and cross-checked against the official transport registries. Identifiers are correct (every `lzEid` matches LayerZero's V2 metadata feed, every `axelarId` matches Axelar's mainnet name registry). No on-chain value is wrong — every gap is an unset `0x0` slot.

**LayerZero peer setup — pushed on 14 chains** The peer-setup script populates both `BridgeLZ.peers` (send-side) and `ReceiverLZ.peers` (receive-side) on the chain it runs on. A working `A → B` LZ edge needs the send-side set on A *and* the receive-side set on B. On chains where the setup was never pushed, both maps are entirely empty — so no edge to or from such a chain transports messages, regardless of the state on the partner chain.

- **Pushed (peers set on both sides for every connected remote):** `arbitrum`, `aurora`, `avalanche`, `base`, `blast`, `bsc`, `ethereum`, `fantom`, `fraxtal`, `gnosis`, `kava`, `linea`, `manta`, `mantle`. (`fraxtal` missing only `unichain` / `xlayer` outbound.)
- **Partially pushed:** `celo` (~12 outbound peers missing), `cronos` (~18 outbound peers missing).
- **Not pushed (both peer maps empty):** `berachain`, `core`, `metis`, `mode`, `moonbeam`, `optimism`, `polygon`, `sonic`, `taiko`, `unichain`, `xlayer`.

Effective LZ connectivity is the bidirectional clique among the 14 fully-pushed chains, plus the partial reach via `celo` and `cronos`.

**Axelar — same pattern, 11 vs 5.** Same shape: where the setup script ran, both `BridgeAxelar.receivers(chainId)` and `ReceiverAxelar.peers('axelarId')` are populated; where it didn't, both are empty.

- **Pushed:** `arbitrum`, `avalanche`, `base`, `blast`, `bsc`, `ethereum`, `fantom`, `kava`, `linea`, `mantle`, `polygon`.
- **Not pushed:** `berachain`, `celo`, `fraxtal`, `moonbeam`, `optimism`.

Effective Axelar connectivity: the bidirectional clique among the 11 pushed chains.

**ChainIdAdapter — surgical gaps on two remote chains.** Forward and inverse mappings are always set or unset together (zero asymmetry inside the adapter itself). 15 connected pairs are unmapped, all on two specific remote chains:

- **Aurora** — unmapped on 11 chains: `berachain`, `core`, `metis`, `mode`, `moonbeam`, `optimism`, `polygon`, `sonic`, `taiko`, `unichain`, `xlayer`.
- **Linea** — unmapped on 4 chains: `core`, `cronos`, `unichain`, `xlayer`.

**GasPriceOracle — three minor chains drive the 96 gaps.** The `haust` GasPriceOracle has no per-chain feed for any other chain; and `crossfi`, `haust`, `unit0` are missing as remote feeds on most other chains:

- *Chains missing `crossfi`/`unit0` from their oracle:* `aurora`, `avalanche`, `blast`, `celo`, `fantom`, `fraxtal`, `gnosis`, `kava`, `linea`, `manta`, `mantle`, `metis`, `mode`, `optimism`, `sonic`, `taiko` (every chain except `arbitrum`, `base`, `bsc`, `crossfi`, `ethereum`, `polygon`, `unit0`).
- *Chains missing `haust` from their oracle:* every chain — `haust` is never registered as a remote price source.
- The `haust` oracle's own table is empty in every direction.

**Other bridge-config observations:**

- **`Receiver.thresholdLength() == 0` on every chain** (30 / 30); `thresholdAt(0)` reverts. The validator-set threshold list is empty everywhere — uninitialized at the moment of the verification.
- **`GateKeeper.defaultGasLimits(remote_chainId) == 0` on every (chain, remote) pair**. The mapping is unitialized at the moment of the verification.

Across the entire 30-chain deployment there are only 10 distinct role-holder addresses total. None of them are multisigs; the entire protocol's privileged surface is governed by externally-owned accounts.

**Protocol-contract Role holders (5):**
- `0x072CAe5518Fb2681347F80D143Eb07c37353B97C` — the **current GateKeeper**, which holds `GATEKEEPER_ROLE` on each transport (`BridgeV3` / `GovBridgeV2`, `BridgeLZ`, `BridgeAxelar`).
- `0x1cFBd51e558782bD24268Eaed312631cc7F2a99F` — the **legacy GateKeeper** (previous deployment), still listed as `GATEKEEPER_ROLE` member on `BridgeV3` / `GovBridgeV2` (this is the same legacy address that `routerOld.gateKeeper()` points to by design).
- `0x9291c5586217348542720C5FB1028c9C976C7b50` — the **`bridgeEywa` transport** (`BridgeV3` everywhere except `GovBridgeV2` on Sonic), holding `RECEIVER_ROLE` on `Receiver` so it can deliver inbound Eywa-DVN messages.
- `0x0e46c66C2D0a7906cE06cE57f0212d11984273e9` — the **`receiverLZ` transport**, holding `RECEIVER_ROLE` on `Receiver`.
- `0xDf7eb07E2539E0c12D8D967792dEF763512AA951` — the **`receiverAxelar` transport**, holding `RECEIVER_ROLE` on `Receiver`.

`Receiver.RECEIVER_ROLE` therefore has exactly the three transports as its members, which is the intended design: only those three contracts can call into `Receiver` to deliver cross-chain payloads.

**Centralization recommendation.** Critical roles must be held by a multisig (e.g. Gnosis Safe) on every chain rather than by an EOA. The client has been informed of the centralization issue and plans to reduce it in the near future.

Source is published and verified on the standard chain explorers. Bytecode comparison was done directly against the deployed runtime via the chain RPC (`eth_getCode`), bypassing the explorer.
    
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
| **Critical** | 2 |
| **High**     | 3 |
| **Medium**   | 7 |
| **Low**      | 19 |

## 2. Findings Report

### 2.1 Critical

#### 1. Missing Source Authenticity Verification in `ReceiverRouter`

##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b

##### Description
The `ReceiverRouter.iReceive()` function assumes its input parameters originate from a trusted source (the Router bridge); however, it lacks any verification to confirm that the caller is actually legitimate.  

A malicious user with no privileges could impersonate the bridge and fake the receipt of a cross-chain message from a trusted source, using arbitrary parameters.

This effectively compromises the Router bridge integration. If the threshold in the `Receiver` contract is greater than 1, it provides no meaningful protection; and if the threshold is set to 1, the system becomes vulnerable to unauthorized message execution.  

This issue is classified as **Critical** severity because `ReceiverRouter` may execute unverified and potentially harmful data, leading to unauthorized actions and a high risk of financial loss.

##### Recommendation
We recommend restricting the `iReceive()` function so that it can only be called by the legitimate Router bridge.  

Do not rely solely on the `requestSender` string for source authenticity. Instead, enforce that the caller is an approved Gateway contract and validate the message origin using the protocol’s official delivery verification mechanisms.

> **Client's Commentary:**
> Fixed at af8da87b9bfb7b89971492c19bf615dfaaa8d9f7
    
---

#### 2. Irrecoverable Cross-Chain Message Lockup Due to Hash-Locked `executeGasLimit`



##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/cb10b7ef6d920f725bbb293c2ba383bcdab4c8a5

##### Description

`executeGasLimit` is encoded into the cross-chain payload in [`GateKeeper._buildData()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/GateKeeper.sol#L741-L747) and cryptographically locked via `sentDataHash`:

```solidity!
collectedData = abi.encode(data, info, nonce, to, executeGasLimit);
sentDataHash[requestId] = keccak256(abi.encode(
    IBridge.SendParams({requestId, data: collectedData, to, chainIdTo}),
    nonce, msg.sender
));
```

On the source chain, `sendData()` succeeds — fees are paid, `sentDataHash` is written, and the message is dispatched across bridges. On the destination chain, [`Receiver._execute()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/Receiver.sol#L239-L258) performs a post-hoc gas check:

```solidity!
uint256 gasLeftStart = gasleft();
// ... entire _execute() body ...
uint256 gasLeftEnd = gasleft();
require(executeGasLimit >= gasLeftStart - gasLeftEnd,
        "Receiver: executeGasLimit exceeded"
);
```

If this check fails, the transaction reverts and the message rolls back to pending. Since `executeGasLimit` is part of the hash-locked `collectedData`, [`retry()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/GateKeeper.sol#L390-L394) validates the payload against the original hash and cannot modify it:

```solidity!
require(sentDataHash[params.requestId] == keccak256(abi.encode(
    params, nonce, protocol
)), "GateKeeper: wrong data");
```

The message enters a permanently undeliverable state — it fails identically on every attempt through any bridge. There is no mechanism to retry with a corrected `executeGasLimit`, cancel the message, or clear the pending state via admin override. The only resolution is a contract redeploy.

The likelihood is compounded by [`buildOptions()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/GateKeeper.sol#L570-L593), which is the standard API for creating options and silently reuses the bridge transport `gasLimit` as `executeGasLimit`. Any protocol using the normal API path can trigger this.

This issue is assessed as **Critical** severity: successfully sent cross-chain messages carrying value or critical state updates are permanently locked on the destination with no on-chain recovery, and the standard `buildOptions()` API makes misconfiguration likely for any integrating protocol.

##### Recommendation

We recommend removing `executeGasLimit` from `collectedData` and the `sentDataHash`, so that the gas limit is not hash-locked into the cross-chain payload.



---

### 2.2 High

#### 1. Refund Can Be Lost Due To `payExecutorGasFee()` Front-run

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b

##### Description  
The `ExecutorFeeManager.payExecutorGasFee()` function can be front-run to reroute gas-fee refunds.

An attacker may call the function with the same `requestId` and set their malicious `refundTarget`. When an executor calls `ExecutorFeeManager.refund()` to receive the refund, it will be transferred to the attacker.

This issue is classified as **High** severity because it leads to executor's funds being lost.

##### Recommendation  
We recommend restricting access to the `ExecutorFeeManager.payExecutorGasFee()` function by applying a proper access control modifier.

If the function is intended to be callable by external parties (not only the `GateKeeper` contract), we recommend adding a validation step to ensure that `refundTarget` is properly initialized before execution and that only the `GateKeeper` contract can set the `refundTarget`.

> **Client's Commentary:**
> Fixed at 4fe8b7709b38b0b184770ed8855e11005f0e7ce8
    
---

#### 2. `EywaDVN.assignJob()` Reverts After Payment Model Change



##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/cb10b7ef6d920f725bbb293c2ba383bcdab4c8a5

##### Description

[`EywaDVN.assignJob()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/DVN/EywaDVN.sol#L128) calls `GateKeeper.sendData()` without forwarding ETH:

```solidity!
fee = IGateKeeper(gateKeeper).sendData(data, DVN_, chainIdTo, currentOptions);
```

After the reaudit fix, [`sendData()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/GateKeeper.sol#L351-L369) requires `msg.value >= totalFee`. Since EywaDVN passes no value, the call deterministically reverts for any destination chain with non-zero oracle fees.

Prior to the fix, fees were pulled from EywaDVN's treasury via `INativeTreasury.getValue(totalFee)`. The payment model change removed this mechanism, but EywaDVN was never updated to forward `msg.value`. The contracts are not upgradeable (plain contracts with constructors, no proxy pattern), so fixing requires deploying a new EywaDVN and reconfiguring LZ DVN references across all chains.

EywaDVN's failure blocks all sends on the routes, where it's enabled. The `assignJob()` revert occurs at send time, so no messages are stuck in-flight. The protocol owner can reconfigure the DVN set via `endpoint.setConfig()` to remove EywaDVN and restore service without a contract upgrade.

This issue is assessed as **High** severity: the DVN service is fully non-functional on all routes with configured oracle fees, and restoring it requires cross-chain contract redeployment, though no funds are locked since the send reverts at the source.

##### Recommendation

We recommend deploying a new EywaDVN that maintains its own ETH balance (via a `receive()` function) and calls `GateKeeper.sendData{value: totalFee}(...)`, drawing from its pre-funded balance on each `assignJob` call. The DVN can be periodically replenished from the fees it collects via `withdrawFeeLib()`. Additionally, we recommend implementing a `withdrawNative()` admin function for balance management.



---

#### 3. ETH Locked in Receiver on Value-Carrying Messages With Threshold > 1



##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/cb10b7ef6d920f725bbb293c2ba383bcdab4c8a5

##### Description

[`BridgeV3.receiveV3()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/BridgeV3.sol#L226) forwards `msg.value` to the Receiver:

```solidity!
IReceiver(receiver).receiveData{value: msg.value}(
    sender,
    uint64(chainIdFrom),
    payload_,
    requestId
);
```

When `threshold > 1`, [`Receiver.receiveData()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/Receiver.sol#L139-L146) stores the payload and returns without executing. The ETH remains in the Receiver with no accounting. When [`execute()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/Receiver.sol#L175) is later called, it forwards `msg.value` from the *caller*, not the ETH deposited during `receiveData`:

```solidity!
target.functionCallWithValue(data, msg.value, "Receiver: receive failed");
```

The Receiver has no withdrawal or rescue function. The issue is specific to the Eywa bridge path — ReceiverAxelar, ReceiverLZ, and ReceiverRouter do not forward value.

This issue is assessed as **High** severity: ETH sent with `receiveV3` for multi-bridge consensus messages is permanently locked in the Receiver with no recovery mechanism.

##### Recommendation

We recommend adding a `mapping(bytes32 => uint256) public valueDeposits` in Receiver. In `receiveData`, when `threshold > 1` and `msg.value > 0`, record `valueDeposits[hashKey] += msg.value`. In `_execute()`, forward the escrowed amount: `target.functionCallWithValue(data, valueDeposits[hashKey], ...)` and clear `valueDeposits[hashKey]` after execution. This isolates each message's value and prevents cross-message sweeping. `execute()` remains `payable` for cases where the caller provides value directly — the total forwarded would be `valueDeposits[hashKey] + msg.value`. The fix should be contained within the Receiver contract to support future value forwarding from all bridge receivers (LZ, Axelar, Router), not just BridgeV3.



---

### 2.3 Medium

#### 1. `BridgeRouter` Cannot Set `FeePayer` When Fees Are Required

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b

##### Description  
The `BridgeRouter.setDappMetadata()` function does not forward received native value to the Gateway contract. As a result, when `gateway.iSendDefaultFee()` is non-zero, an address with `OPERATOR_ROLE` cannot successfully set the `FeePayer` identifier because the required fee is not transferred to the Gateway.

The fee associated with any cross-chain request initiated by a dApp is paid by the dApp's corresponding fee payer account on the Router Chain. To cover the relayer incentives and validation costs, the Router Chain deducts the estimated fee and incentive amount upfront from the fee payer address.

Because the protocol cannot register the fee payer identifier, the Router Chain is unable to deduct the required fees from the dApp’s fee payer account, preventing cross-chain requests from being executed. This issue is therefore classified as a **Medium** severity.

##### Recommendation
We recommend checking the current `iSendDefaultFee` value and forwarding the appropriate amount of native funds to the Gateway within the `BridgeRouter.setDappMetadata()` function.

> **Client's Commentary:**  
> Fixed at 37fcddbea88f7e9539a71c8855d8c56194d63426

---

#### 2. Incorrect Decoding of `options_` Causes Gas Fee Misestimation in `estimateGasFee()`

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b

##### Description  
The `BridgeRouter.estimateGasFee()` function decodes the `options_` bytes array by reading the first 32 bytes. According to Router Protocol documentation, the `options_` parameter should contain a `requestMetadata` struct with the following fields:

```solidity!
uint64 destGasLimit;
uint64 destGasPrice;
uint64 ackGasLimit;
uint64 ackGasPrice;
uint128 relayerFees;
uint8 ackType;
bool isReadCall;
string asmAddress;
```

https://docs.routerprotocol.com/develop/message-transfer-via-crosstalk/evm-guides/iDapp-functions/iSend/#5-requestmetadata

However, the `estimateGasFee()` function incorrectly assumes that the first 32 bytes represent a single gas fee value. In reality, the first 32 bytes contain multiple parameters, leading to incorrect decoding of the `options_` data.

This improper decoding may cause inaccurate gas fee estimations or failures when interacting with the Router Protocol.

##### Recommendation  
We recommend fetching the current `iSendDefaultFee` directly from the Gateway contract in the `BridgeRouter.estimateGasFee()` function and including this fee when forwarding cross-chain messages.

> **Client's Commentary:**  
> Fixed at 5b8d54c0479e4c2f0d422fab02ce705d94b193be

---

#### 3. Incorrect Use of `to` Address in `_send()` Function Breaks Message Routing

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b

##### Description  
The `BridgeRouter._send()` function incorrectly uses the `to` address specified by the caller of `GateKeeper.sendData()` as the destination address:

```solidity!
string memory destinationAddress = 
    Strings.toHexString(uint160(uint256(params.to)), 20);

// Encode destination address and data for Router Protocol
bytes memory payload = abi.encode(destinationAddress, params.data);
```

However, the actual destination should be the contract address stored in the `receivers` mapping (set via `BridgeRouter.setReceiver()`), which points to the `ReceiverRouter` contract on the destination chain that implements the `iReceive()` method and handles the cross-chain message.

Using the caller-provided `to` address bypasses this logic and may result in messages not being delivered or processed correctly.

##### Recommendation
We recommend using the receiver addresses stored in the `receivers` mapping when sending messages.

> **Client's Commentary:**  
> Fixed at b0a6776be7de3991321ad8d3b4bb18e510c0e3eb

---

#### 4. Cross-Chain Transfer May Revert Due to Missing Fee in `_send()` Function 

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b

##### Description  
The `BridgeRouter._send()` function may fail when attempting to initiate a cross-chain transfer through the Router Protocol Gateway because the required fee is not forwarded.

When the Gateway's `iSendDefaultFee` is non-zero, it enforces a minimum native funds payment:

```solidity!
if (msg.value < iSendDefaultFee) revert Utils.C03();
```

However, `BridgeRouter._send()` calls `IGateway(gateway).iSend()` without attaching any value, which leads to a revert on all cross-chain messages when a fee is required.

This issue is classified as a **Medium** severity issue because it prevents cross-chain transfers from being sent when a non-zero `iSendDefaultFee` is set on the Gateway.

##### Recommendation
We recommend forwarding the `iSendDefaultFee` to the `iSend()` call during `BridgeRouter._send()` execution:

```diff
--  IGateway(gateway).iSend(
++  IGateway(gateway).iSend{value: iSendDefaultFee}(
        routerVersion,
        routerRouteAmount,
        routerRouteRecipient,
        destChainId,
        options_,
        payload
);
```

> **Client's Commentary:**  
> Fixed at 924941a4c9305d78e2c34e612be3891882c171c2

---

#### 5. Post-Execution Gas Check Enables Third-Party Gas Griefing


##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/cb10b7ef6d920f725bbb293c2ba383bcdab4c8a5

##### Description

In [`Receiver._execute()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/Receiver.sol#L252), the target call forwards all available gas with no cap. The `executeGasLimit` check fires only after execution completes. Since [`execute()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/Receiver.sol#L175) is permissionless, a malicious target can deliberately consume all available gas, causing the caller to waste their entire gas budget on a guaranteed revert. In a batch `receiveV3` call, a single gas-heavy message can exhaust the remaining gas for all subsequent messages, reverting the entire batch.

This issue is assessed as **Medium** severity: in batch operations a single malicious or gas-heavy message can kill the entire batch, wasting gas spent on BLS verification and Merkle proofs for all messages.

##### Recommendation

We recommend against keeping the post-hoc gas check in `Receiver._execute()`, because it cannot prevent gas waste, as the gas is already spent before the check. Instead consider adding `uint256[] calldata gasLimits` as an extra parameter to `receiveV3` (outside the BLS-signed `ReceiveParams` structure, so no signing changes are needed). Each `receiveData`/`receiveHash` call in the loop should be wrapped in `try/catch` with a per-message gas cap: `try IReceiver(receiver).receiveData{value: ..., gas: gasLimits[i]}(...) {} catch { requestIdChecker[requestId] = false; }`. On failure, unsetting `requestIdChecker` allows the validator to retry that message individually. This is safe because on failure inner call reverts that is equal to undelivered state, only `VALIDATOR_ROLE` can call `receiveV3`, and the message content is BLS-verified.



---

#### 6. `receiveV3` Batch Revert on Multiple Value-Carrying Data Messages



##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/cb10b7ef6d920f725bbb293c2ba383bcdab4c8a5

##### Description

[`BridgeV3.receiveV3()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/BridgeV3.sol#L226) forwards the full `msg.value` on every data message in a batch loop. BridgeV3 does not accumulate ETH ([`GateKeeper._sendCustomBridge()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/GateKeeper.sol#L691) sends `value: 0` for `bridgeEywa`), so the second data message's `receiveData{value: msg.value}` call fails with insufficient balance, reverting the entire batch.

Validators can work around this by submitting messages individually — each `ReceiveParams` carries independent block headers and Merkle proofs, so no re-signing is needed.

This issue is assessed as **Medium** severity: batch processing, a core bridge optimization, breaks when validators send value with batches containing multiple data messages, though individual submission remains functional.

##### Recommendation

We recommend against using `msg.value` directly in the loop. This lead to unpredictable value distribution across messages. Instead consider adding `uint256[] calldata values` as an extra parameter to `receiveV3` (outside the BLS-signed `ReceiveParams` structure, so no signing changes are needed). Each data message (flag `0x00`) forwards `values[i]` instead of `msg.value`. The function should validate `sum(values) == msg.value` to ensure no ETH is left stranded on the contract. Combined with the M-5 try/catch pattern, failed messages should unset `requestIdChecker` and refund the corresponding `values[i]` to the caller.



---

#### 7. Excess ETH Burned When Protocol Treasury Is `address(0)`



##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/cb10b7ef6d920f725bbb293c2ba383bcdab4c8a5

##### Description

In [`GateKeeper.sendData()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/GateKeeper.sol#L364-L366) and [`retry()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/GateKeeper.sol#L426-L428), when `msg.value > totalFee`, the excess is refunded to the protocol's treasury via `.call{value}("")`. If `treasuries[msg.sender]` is `address(0)` (protocol not registered via `registerProtocol`), the low-level call to `address(0)` succeeds and the excess ETH is permanently burned. Any address can self-register as a protocol via [`setDelegate(address)`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/GateKeeper.sol#L230) without calling `registerProtocol`, leaving `treasuries` at the zero default.

For `sendData()` with `threshold > 1`, [`ExecutorFeeManager.payExecutorGasFee()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/ExecutorFeeManager.sol#L58) validates `require(refundTarget != address(0))`, catching the zero treasury earlier. The gap remains for `sendData()` with `threshold <= 1` and for `retry()`.

This issue is assessed as **Medium** severity: excess ETH sent by an unregistered protocol is silently and permanently burned with no revert or error, though a properly configured protocol will have a treasury set.

##### Recommendation

We recommend adding `require(treasuries[msg.sender] != address(0), "GateKeeper: treasury not set")` before the excess refund in both `sendData()` and `retry()`.



---

### 2.4 Low

#### 1. `getRequestMetadata()` Helper Not Implemented in `BridgeRouter` Contract  

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b

##### Description  
According to the `Router` Protocol's documentation, the `requestMetadata` struct can be encoded both on-chain and off-chain. Currently, this struct is encoded within the `options` parameter, which is passed by the caller of the `GateKeeper.sendData()` function. However, it is clearer and more maintainable to implement a dedicated getter function and use the resulting data directly within the `BridgeRouter._send()` function.

The implementation can be found here:  
https://docs.routerprotocol.com/develop/message-transfer-via-crosstalk/evm-guides/iDapp-functions/iSend/#5-requestmetadata

##### Recommendation  
We recommend implementing a getter function that returns the `requestMetadata` struct. This will enable on-chain encoding in a standardized and transparent manner.

> **Client's Commentary:**  
> Fixed at b8598642fb20a36d577440ecf7dedd1510252fca

---

#### 2. Missing `iAck` Handling in `BridgeRouter` Contract

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b

##### Description  
When contract calls are executed on the destination chain, the Gateway contract on that chain sends an acknowledgment back to the Router Chain. iDapps have the option to receive this acknowledgment on the source chain and execute logic based on it.

The Router Protocol documentation states:

```
To process the acknowledgment of their requests on the source chain,
developers must implement an iAck function in their source chain contracts.
```

Currently, callers of the `GateKeeper.sendData()` function are allowed to provide arbitrary `requestMetadata` (`currentOptions` array). As a result, they can specify a non-zero `ackType`, implying that the iDapp intends to process acknowledgments - but the `BridgeRouter` contract does not implement the `iAck` function to handle such acknowledgments.

More information related to the `requestMetadata` can be found here:  
https://docs.routerprotocol.com/develop/message-transfer-via-crosstalk/evm-guides/iDapp-functions/iSend/#5-requestmetadata

##### Recommendation  
We recommend either implementing the `iAck` function in the `BridgeRouter` contract to handle acknowledgments properly, or restricting the caller to only specify a zero `ackType` in the `requestMetadata`.

> **Client's Commentary:**  
> Fixed at a7502f44f57a62852abc9ca5b2506306685996c8

---

#### 3. `estimateGasFee()` Reverts When Executor Is Not Configured

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b

##### Description  
The `GateKeeper.estimateGasFee()` function does not validate whether the caller is associated with a configured executor, nor does it check the `isAutoExecutable` flag before estimating the execution fee:

```solidity!
uint256 executeFee = IExecutorFeeManager(
    executors[msg.sender]
).estimateExecutorGasFee(
    chainIdTo,
    currentOptions[currentOptions.length - 1]
);
```

In contrast, the `GateKeeper.sendData()` function includes a proper check:

```solidity!
if (isAutoExecutable[msg.sender]) {
    executeFee = _payForExecute(
        requestId,
        chainIdTo,
        currentOptions[currentOptions.length - 1]
    );
}
```

Due to the missing validation, calls to `GateKeeper.estimateGasFee()` - such as from `EywaDVN.getFee()` - may revert if no executor has been configured for the caller, breaking gas estimation for otherwise valid requests.

##### Recommendation
We recommend adding proper validation in `GateKeeper.estimateGasFee()` to match the logic in `GateKeeper.sendData()`.

> **Client's Commentary:**  
> Fixed at b6d313e7439508a9b979adacf1518c0b339d35bf

---

#### 4. Use of Revert Strings Instead of Custom Errors  

##### Status  
Acknowledged

##### Description  
All contracts within the audit scope use hardcoded revert strings for error handling. Since Solidity version 0.8.4, custom errors can be used as a more efficient alternative.  
Using custom errors reduces bytecode size and significantly saves gas, especially in cases where error strings are long or frequently used.

##### Recommendation  
We recommend replacing revert strings with custom errors to improve gas efficiency and maintain cleaner code.

> **Client's Commentary:**  
> We initially adopted revert strings before custom errors became widely used, prioritizing clarity and ease of debugging. To maintain a consistent coding style across the codebase, we continued with this approach.

---

#### 5. Centralization Risks

##### Status  
Acknowledged

##### Description  
The `OPERATOR_ROLE` holds excessive privileges and control over critical protocol parameters, creating significant centralization risks. They can modify bridge configurations, fee structures, threshold settings, and system states across all bridge implementations.

The current architecture relies heavily on operator trust, which contradicts the decentralized principles expected from cross-chain protocols. A malicious or compromised operator could severely affect the protocol’s functionality, security, and overall user experience.

##### Recommendation  
We recommend implementing a DAO-based governance model or using a multi-signature wallet to distribute control among multiple trusted parties.

> **Client's Commentary:**  
> We’re aware of the centralization risks associated with the current OPERATOR_ROLE. As part of our planned improvements, we intend to transition operator responsibilities to a multisig setup to reduce trust assumptions and improve security.

---

#### 6. Typographical Errors in Comments of `GateKeeper` and `Receiver` Contracts

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b

##### Description
There are a couple of typos in comments/parameter names in the scope of the project:

- `GateKeeper.sol`, line 45: comment uses `conract` instead of `contract`.
- `Receiver.sol`, line 144: the parameter is written as `sende` instead of `sender`.
  
This issue is classified as **Low** severity because the misspellings exist only in comments and parameter documentation, not in executable logic.

##### Recommendation
We recommend fixing the listed typos to improve code clarity and maintainability.

Optionally, add a linter or spell-check step for comments/documentation to catch similar issues automatically in future reviews.

> **Client's Commentary:**  
> Fixed at b26808739dccc32acf008038617ebb5a8e85b8d5

---

#### 7. Unused and Misapplied Imports in `ReceiverRouter` and `BridgeRouter`

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b

##### Description
The code contains imports that are either mistakenly added and unused or improperly applied, leading to code clutter and, in the case of `BridgeRouter`, a mismatch between expected API/interface usage and actual implementation relative to the Router Protocol integration.

In detail:

- **contracts/bridge/receive/ReceiverRouter.sol**  
  - `AxelarExpressExecutable` — mistakenly added and unused (no Axelar logic in this contract).  
  - `AddressToString` — imported alongside `StringToAddress` but not used.

- **contracts/bridge/send/BridgeRouter.sol**  
  - `Utils` — mistakenly added and unused.  
  - `IDapp` — imported but not used. The contract is intended to work via Router Protocol and **should inherit from `IDapp`**, but currently does not, risking divergence from integration specifications.

##### Recommendation
We recommend:  
1. Removing the unused imports `AxelarExpressExecutable` and `AddressToString` from `ReceiverRouter.sol`.  
2. Removing the unused `Utils` import from `BridgeRouter.sol`.  
3. Ensuring that `BridgeRouter.sol` inherits from `IDapp` as required by the Router Protocol integration.

> **Client's Commentary:**  
> Fixed at 2af615e8aa1f6ea1803dfacfc93e4692f6ffe54b


#### 8. Fee Estimation Requires Dummy Nonce in Options Configuration

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/3173d41cc28dc7f8b5b2dc23175ce4839b2afbc3
##### Description  
`GateKeeper.estimateGasFee` requires the last element of `currentOptions` to be an external nonce for decoding. Currently, `EywaDVN.getFee` passes `options` directly without appending a nonce, meaning operators must pre-configure `options` with a trailing dummy nonce element for estimation to work. While this currently functions because the DVN uses only EywaBridge (whose `estimateGasFees` expects `uint32` options), future changes to bridge usage could introduce incompatibilities. The code could be refactored so that if `options` already includes a dummy nonce element, both `assignJob` and `getFee` can reuse it.

##### Recommendation 
We recommend ensuring operators configure `EywaDVN.options` to include a trailing dummy nonce slot. Additionally, `EywaDVN.assignJob` could be refactored to copy `options` into `currentOptions` and replace the last element with the actual nonce, rather than allocating a new array with `optionsLength + 1` elements.

> **Client's Commentary**
> Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/0009916dbc4a6405e977cc000c31d7cbd662c5e0


#### 9. Missing Zero-Address Check in Public Withdraw Function

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/3173d41cc28dc7f8b5b2dc23175ce4839b2afbc3
##### Description  
The `withdrawFees` function is publicly accessible and transfers assets to the `treasury` address. If `treasury` is not set when fees have already accumulated, calling this function will send ETH to the zero address or attempt an ERC20 transfer to `address(0)`, resulting in permanently lost funds.

##### Recommendation  
We recommend adding `require(treasury != address(0), "GateKeeper: treasury not set");` at the start of the `withdrawFees` function to prevent accidental fund loss.

> **Client's Commentary**
> Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/41062ef4dc273ec7655913af84833adbb647c0a2


#### 10. Misspelled Interface Name and Missing Inheritance

##### Status  
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/3173d41cc28dc7f8b5b2dc23175ce4839b2afbc3
##### Description  
The interface `IValidatedDataReciever` is named with an incorrect spelling of "Receiver". Additionally, `EywaDVN` implements the `receiveValidatedData` function but does not explicitly inherit from `IValidatedDataReciever`, which reduces code clarity and integration safety.

##### Recommendation  
We recommend renaming the interface to `IValidatedDataReceiver` to fix the typo and updating `EywaDVN` to explicitly inherit from the corrected interface.

> **Client's Commentary**
> Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/3173d41cc28dc7f8b5b2dc23175ce4839b2afbc3

---

#### 11. EywaOracle Memory Cost Formula Uses Bytes Instead of Words


##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/f8b62aca0d358b09909e2a7eb33446c1d6fade72

##### Description  
The `estimateFeeByChain` function in `EywaOracle.sol` uses the EVM memory expansion cost formula from the Yellow Paper, but applies it to `callDataLength_` in bytes instead of converting to 32-byte words first.

The EVM formula is:

```solidity!
memory_size_word = (memory_byte_size + 31) / 32
memory_cost = (memory_size_word²) / 512 + (3 * memory_size_word)
```

The current implementation uses `callDataLength_` directly:

```solidity
uint256 payloadCost = 
    (GAS_MEMORY * callDataLength_ + 
     callDataLength_ * callDataLength_ / 512) * gasPriceB + 
    callDataLength_ * callDataPriceB;
```

This causes:
- Linear term: `3 * bytes` instead of `3 * words`, overcharge by ~32x
- Quadratic term: `bytes² / 512` instead of `words² / 512`, overcharge by ~1024x

The inflated `payloadCost` flows into `totalCost` and then into the fee returned to `BridgeV3.estimateGasFee`, which is used by `GateKeeper._calculateGasFee` to charge protocols via `INativeTreasury.getValue(totalFee)`. As a result, protocols systematically overpay for cross-chain messaging when EywaOracle is used.

For typical payload sizes (600–800 bytes), the overcharge is ~1–2% of the total fee. For larger payloads (1 KB+), it grows quadratically and becomes more significant.

This issue is classified as **Low** severity, because protocols systematically overpay on every cross-chain transaction when EywaOracle is used, the overcharge grows quadratically with payload size (up to ~22% for 1 KB+ payloads), and there is no mechanism for users to recover the excess fees without a contract upgrade.

##### Recommendation
We recommend converting `callDataLength_` to words before applying the memory cost formula:

```solidity
uint256 words = (callDataLength_ + 31) / 32;
uint256 payloadCost = (GAS_MEMORY * words + 
                        words * words / 512) * gasPriceB + 
                       callDataLength_ * callDataPriceB;
```

> **Client's Commentary**
> Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/90c72670d2d472281f38f33a94b1f42c90d7c429

---

#### 12. Permissionless `retry` Repeatedly Charges Protocol Treasury Without Reuse Guard

##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/f8b62aca0d358b09909e2a7eb33446c1d6fade72

##### Description

[`GateKeeper.retry()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/GateKeeper.sol#L376-L429) allows anyone to retry a previously sent message. When retrying through the Eywa bridge, [`_sendCustomBridge`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/GateKeeper.sol#L660-L685) pulls `totalFee` (= `gasFee + additionalFee`) from the protocol's NativeTreasury, but the caller only [reimburses `gasFee`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/GateKeeper.sol#L421-L422). The `additionalFee` remains in GateKeeper.

Since [`sentDataHash`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/GateKeeper.sol#L385-L389) is never cleared in the retry path, the same message can be retried unlimited times, each call charging the protocol treasury an `additionalFee`.

The accumulated fees can be moved to the global treasury via `withdrawFees`, so no funds are permanently lost. **Low** severity — the attacker does not profit, must pay `gasFee` per retry, and funds are recoverable through admin coordination.

##### Recommendation

We recommend having the caller reimburse `totalFee` instead of only `gasFee`.

> **Client's Commentary:**
> Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/f142ad18fa0d3809c51d1ce26ff2361a2130c07f

---

#### 13. `Receiver.execute` Bypasses `whenNotPaused` Modifier

##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/f8b62aca0d358b09909e2a7eb33446c1d6fade72

##### Description

The `whenNotPaused` modifier was added to [`receiveData`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/Receiver.sol#L110) and [`receiveHash`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/Receiver.sol#L142), but the permissionless [`execute`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/Receiver.sol#L158-L165) function is not protected. Messages fully confirmed before a pause can still be finalized by anyone, including the arbitrary external calls in [`_execute`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/Receiver.sol#L232-L234).

**Low** severity — no direct fund loss; this is a defense-in-depth gap requiring a specific conjunction of pre-confirmed messages and a vulnerability in a downstream execution target.

##### Recommendation

We recommend adding the `whenNotPaused` modifier to the `execute` function.

> **Client's Commentary:**
> Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/84458e1f72a5d7664bdcfcad4f25b57a2beea93e

---

#### 14. `buildOptions` Passes Zero Gas Limit to Secondary Bridges When `defaultGasLimits` Is Unset

##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/f8b62aca0d358b09909e2a7eb33446c1d6fade72

##### Description

In [`buildOptions`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/GateKeeper.sol#L573-L576), secondary bridges use `defaultGasLimits[chainIdTo]`. If [`setDefaultGasLimit`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/GateKeeper.sol#L215-L221) has not been called for a chain, the value is 0, producing options with zero gas limit that cause destination transactions to fail.

**Low** severity — operator configuration prerequisite, easily corrected by calling `setDefaultGasLimit`.

##### Recommendation

We recommend adding a `require(defaultGasLimits[chainIdTo] > 0)` check inside `buildOptions` for secondary bridges to surface the misconfiguration early.

> **Client's Commentary:**
> Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/f337ad5cd651e84b269831dc99532e11f8d8cdbf

---

#### 15. Sender-Side Threshold Decoupled from Receiver-Side Threshold

##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/f8b62aca0d358b09909e2a7eb33446c1d6fade72

##### Description

The delegate system allows a protocol's delegate to change the sender threshold via [`GateKeeper.setThreshold`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/GateKeeper.sol#L268-L277), but the receiver threshold in [`Receiver.setThreshold`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/Receiver.sol#L52-L62) remains OPERATOR_ROLE only. If a delegate lowers the sender threshold (e.g., 2 → 1) without coordinating with the operator to match it on the receiver side, the receiver still requires 2 confirmations that will never arrive, and messages become stuck until the operator corrects it.

**Low** severity — no permanent fund loss; messages are recoverable once the operator aligns the receiver threshold. Previously both sides were managed by the same OPERATOR_ROLE, so this coordination gap is newly introduced by the delegate model.

##### Recommendation

We recommend documenting this coordination requirement prominently for delegates, or providing an on-chain mechanism for the delegate to update the receiver-side threshold as well.

> **Client's Commentary:**
> Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/41aee11649e0f700c73aa9ea7c55d26a7ebcafe7


---

#### 16. Unregistered Protocol Treasury Causes Opaque Revert on Send

##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/f8b62aca0d358b09909e2a7eb33446c1d6fade72

##### Description

Sending is implicitly gated on the protocol having a deployed `NativeTreasury`, but this is never validated explicitly. In [`_sendCustomBridge`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/GateKeeper.sol#L660-L685), the code unconditionally calls `INativeTreasury(treasuries[protocol]).getValue(totalFee)`, and in [`_payForExecute`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/GateKeeper.sol#L687-L694) it similarly calls `INativeTreasury(treasuries[msg.sender]).getValue(executeGasFee)`.

If the protocol was not registered via [`registerProtocol`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/3ee2f3e0aac289b1af23e78ce3c86f1d28a8d2ee/contracts/bridge/GateKeeper.sol#L256-L259), `treasuries[protocol]` / `treasuries[msg.sender]` remains zero. The subsequent typed external call then fails because Solidity performs a contract-code existence check (`extcodesize`) before the call, so the send path reverts with an opaque low-level error instead of a clear configuration error.

##### Recommendation

We recommend validating that the protocol treasury is configured before attempting the external call, e.g. `require(treasuries[protocol] != address(0), "GateKeeper: protocol treasury not set")` and similarly for `treasuries[msg.sender]` in `_payForExecute`.

> **Client's Commentary:**
> Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/bf3b026b20fdf102518b4128c4c456d8c4598cd8

---

#### 17. `check` Call Return Value Ignored



##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2e918faa73bccd46b89dd65051a59742580cb957

##### Description

[`Receiver.execute()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/cb10b7ef6d920f725bbb293c2ba383bcdab4c8a5/contracts/bridge/Receiver.sol#L185) discards the return value of the `check` call:

```solidity
target.functionCall(check, "Receiver: check failed");
```

The prior implementation decoded and asserted it as `bool` ([commit f8b62ac, lines 250-251](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/f8b62aca0d358b09909e2a7eb33446c1d6fade72/contracts/bridge/Receiver.sol#L250-L251)):

```solidity
bytes memory result = target.functionCall(check);
require(abi.decode(result, (bool)), "Receiver: check failed");
```

Check functions that signal rejection by returning `false` instead of reverting are now silently bypassed. Future integrations relying on the previous interface semantics will behave incorrectly without any on-chain indication.

##### Recommendation

We recommend restoring the return value assertion or explicitly document that check functions must revert to block execution.

> **Client's Commentary:**
> https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/54e6175ee13e0bd88f167bf0ab5c94323a6aa100

---

#### 18. `buildOptions` Panics on Underflow in Multi-Bridge Configurations


##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2e918faa73bccd46b89dd65051a59742580cb957

##### Description

[`GateKeeper.buildOptions()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/cb10b7ef6d920f725bbb293c2ba383bcdab4c8a5/contracts/bridge/GateKeeper.sol#L573-L582) halves `gasLimit` upfront, then subtracts `defaultGasLimit` once per secondary bridge:

```solidity
uint256 executeGasLimit = gasLimit = gasLimit / 2;
if (length > 1) {
    for (uint256 i = 1; i < length; ++i) {
        gasLimit -= defaultGasLimit;   // panics if underflows
    }
}
```

If `defaultGasLimit * (numSecondaryBridges) > gasLimit / 2`, Solidity 0.8 panics. For a 2-bridge setup with `defaultGasLimit = 200_000`, any `gasLimit < 800_000` triggers the revert. The same input parameter simultaneously derives the execute gas limit, all secondary bridge limits, and the primary bridge remainder, with no way for the caller to control the splits independently, making the safe input range non-obvious.

##### Recommendation

We recommend adding `require(gasLimit / 2 >= defaultGasLimit * (length - 1), "GateKeeper: gasLimit too low")` before the loop, or separate `executeGasLimit` into its own parameter in the `buildOptions` function.

> **Client's Commentary:**
> https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/ab93862ba93e3c2af2131ba1f0980533a0ed55d1

---

#### 19. Redundant Post-Hoc Gas Check in `Receiver.execute()`



##### Status
Fixed in https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/2e918faa73bccd46b89dd65051a59742580cb957

##### Description

[`Receiver.execute()`](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/blob/cb10b7ef6d920f725bbb293c2ba383bcdab4c8a5/contracts/bridge/Receiver.sol#L170-L192) measures gas consumed across the full function body and reverts if it exceeds `executeGasLimit_`:

```solidity
uint256 gasLeftStart = gasleft();
// ... check call, data call, storage cleanup ...
uint256 gasLeftEnd = gasleft();
require(
    executeGasLimit_ >= gasLeftStart - gasLeftEnd, 
    "Receiver: executeGasLimit exceeded"
);
```

`executeGasLimit_` is now a free caller argument — it is no longer hash-locked in the payload. The caller already controls gas supply at the call site (EOA: tx gas limit; contract: `execute{gas: N}(...)`). If `executeGasLimit_` is set too low, the transaction reverts after both target calls complete and all storage is cleared, wasting the executor's full gas with no outcome.

##### Recommendation

We recommend removing the `gasLeftStart`, `gasLeftEnd`, and `require` lines. The check serves no purpose that is not already controlled by the caller.

> **Client's Commentary:**
> https://gitlab.ubertech.dev/blockchainlaboratory/eywa-cdp/-/commit/1e2545f41f100c4dc3b7074963b304f334da2fec

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