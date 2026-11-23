# Lido ConsolidationMigrator Deployment Verification Report

###### tags: `Lido`

## 1. Introduction

### 1.1 Disclaimer
The deployment verification makes no statements or warranties regarding the utility, safety, or security of the code, the suitability of the business model, investment advice, endorsement of the platform or its products, the regulatory regime for the business model, or any other claims about the fitness of the contracts for a particular purpose or their bug-free status. 
    
        
### 1.2 Executive Summary
This report covers the deployment verification of the new ConsolidationMigrator instance: the `ConsolidationMigrator` implementation behind a single `OssifiableProxy` - two deployed addresses in total, deployed from the `lidofinance/core` repository at the code state of commit `af095e48bbc1c3841c2c9936219c8461af01056b`, the audited commit of the Certora and Statemind "Staking Router v3" engagements ([Certora Audit](https://docs.lido.fi/security/audits/#07-2026-certora-staking-router-v3-audit), [Statemind Audit](https://docs.lido.fi/security/audits/#07-2026-statemind-staking-router-v3-audit)). The new instance enables validator consolidations within the Curated Module v2 (`sourceModuleId = 4`, `targetModuleId = 4`); the original instance deployed during the Staking Router v3 upgrade performs migrations from the legacy Curated Module (`sourceModuleId = 1`) into it. The ConsolidationMigrator code was not audited by MixBytes; this engagement verifies that the deployed bytecode is exactly the third-party-audited code and that the deployment configuration, initialization, and access-control handover are correct.

The deployment verification was conducted over 1 working day via on-chain state inspection at block `26426916`, local recompilation of the audited commit `af095e48bbc1c3841c2c9936219c8461af01056b` with the repository's pinned Foundry configuration, byte-level bytecode comparison of both deployed addresses, decoding and classification of every transaction in the deployment sequence, and access-control analysis of every role granted or revoked during deployment.

The verification vectors below were checked:

* **Bytecode identity vs the audited commit.** The deployed implementation and proxy were compared byte-for-byte against a local Foundry build of the audited commit (solc `0.8.25` for the implementation, `0.8.9` for the proxy, via-IR, optimizer with 200 runs). Both are identical at every byte outside the constructor-immutable slots and the CBOR metadata hash, and the metadata difference is fully explained by a single whitespace-only formatting change (see Deployment Verification Details).
* **Bytecode identity vs the original SRv3 instance.** The new implementation was additionally compared against the original Staking Router v3 `ConsolidationMigrator` implementation `0x6Fb4c152F092373dD71f0C07C83c1E77406599aB`: the two are byte-identical, including the metadata hash, at every byte outside the constructor-immutable slots.
* **Proxy topology.** The proxy's EIP-1967 implementation and admin slots were read on-chain and matched against the deployment parameters and the Lido Aragon Agent.
* **Initialization safety.** Initializer state was read from the ERC-7201 namespaced storage slot on both the proxy and the raw implementation: the proxy is initialized at version 1, and the raw implementation carries the `_disableInitializers` petrified mark, so neither can be initialization-front-run.
* **Constructor and initializer arguments.** Both creation transactions' constructor arguments and the `initialize` calldata embedded in the proxy creation were decoded and matched against the on-chain getters.
* **Access control.** Every `grantRole`/`renounceRole` call in the deployment sequence was decoded and re-verified live on-chain, including confirmation that the deployment EOA holds no residual role on the contract.
* **Rollout state.** The `PUBLISH_ROLE` registry of the `ConsolidationBus` was read on-chain to establish the deployment's position in the governance sequence.

Out of scope of this verification is the security of the ConsolidationMigrator contract logic itself, which was reviewed by Certora and Statemind at commit `af095e48`; MixBytes did not audit the contract code. The `StakingRouter`, `ConsolidationBus`, `ConsolidationGateway`, and Curated Module v2 contracts the migrator interacts with were out of scope as well; they were reviewed only as integration points visible in the deployed configuration and are covered by the Staking Router v3 upgrade engagements.

### 1.3 Project Overview

#### Summary
    
Title | Description
--- | ---
Client | Lido
Category| Liquid Staking
Project | ConsolidationMigrator - Deployment Verification
Type| Solidity
Platform| EVM
Timeline| 16.11.2026 - 16.11.2026
    
#### Scope

File | Link
--- | ---
contracts/0.8.25/consolidation/ConsolidationMigrator.sol | https://github.com/lidofinance/core/blob/af095e48bbc1c3841c2c9936219c8461af01056b/contracts/0.8.25/consolidation/ConsolidationMigrator.sol
contracts/0.8.9/proxy/OssifiableProxy.sol | https://github.com/lidofinance/core/blob/af095e48bbc1c3841c2c9936219c8461af01056b/contracts/0.8.9/proxy/OssifiableProxy.sol



#### Versions Log

Date                                      | Commit Hash | Note
-------------------------------------------| --- | ---
16.11.2026 | af095e48bbc1c3841c2c9936219c8461af01056b | Deployment Verification Commit
    
The scope of this engagement is the verification of the two mainnet deployments listed below against the codebase audited by Certora and Statemind at commit `af095e48bbc1c3841c2c9936219c8461af01056b`. No new code review was performed.

#### Mainnet Deployments

File| Address | Blockchain
--- | --- | ---
ConsolidationMigrator.sol (proxy) | [0xc8a7F4917cA03FDCD24a5E11A48Ab448318976e7](https://etherscan.io/address/0xc8a7F4917cA03FDCD24a5E11A48Ab448318976e7) | Ethereum
ConsolidationMigrator.sol (implementation) | [0x5d2DDD6817180C2135b4652503bD555C2d3Bb392](https://etherscan.io/address/0x5d2DDD6817180C2135b4652503bD555C2d3Bb392) | Ethereum

#### Deployment Verification Details

**Deployment sequence.** The deployment was executed from the EOA `0x8dB3077406432D73FBe6c5EEBd1435c6846D40D7` on 11.11.2026 in 6 consecutive transactions (blocks `26391690`-`26391696`), all with successful status. Every transaction was decoded and classified: 2 contract creations (the `ConsolidationMigrator` implementation in transaction `0x8ca2fc82a3ecda5e72654ee8cc3b25c84632687a72b4d1f42bde558342dc170c`, then the `OssifiableProxy` in `0x916ce6fde2ef908d5064f7df5de195de7e4036cf4e4ab093e61a9cee93dc3b40` with the `initialize` call embedded in the constructor calldata), 3 `grantRole` calls, and 1 `renounceRole` call. No unexplained or out-of-pattern transaction exists in the sequence; the deployment EOA has issued no other contract-interacting transactions before or since.

**Bytecode identity.** The repository was built locally with Foundry at the audited commit `af095e48bbc1c3841c2c9936219c8461af01056b` using the repository's own configuration (solc `v0.8.25+commit.b61c2a91` for the implementation and `v0.8.9` for the proxy, via-IR, optimizer enabled with 200 runs). The on-chain runtime code of the implementation equals the local build at every byte outside the four constructor-immutable slots (`STAKING_ROUTER`, `CONSOLIDATION_BUS`, `SOURCE_MODULE_ID`, `TARGET_MODULE_ID`) and the 32-byte CBOR metadata hash; the on-chain runtime code of the proxy equals the local build at every byte outside the metadata hash. The metadata difference is fully accounted for: the deployer-verified source set is byte-for-byte identical to the audited commit for every file in the compilation closure except `contracts/0.8.25/sr/SRTypes.sol`, where the deployed source retains a two-space indent on one closing brace that the format-fix commit `8a8ddb4307decf3641dbf987cc0fa14e1a975b31` removed; that fix is the only change between the audited merge commit `af095e48` and its first parent, so the deployed source corresponds to the audited code state modulo a whitespace-only edit in a types-only file. The new implementation is byte-identical, including the metadata hash, to the original Staking Router v3 `ConsolidationMigrator` implementation `0x6Fb4c152F092373dD71f0C07C83c1E77406599aB` deployed during the audited upgrade, differing only in the immutable module ids (source `1` / target `4` on the original instance, source `4` / target `4` on the new one). Dependencies are pinned with no semver ranges: `@openzeppelin/contracts-v4.4` resolves to `@openzeppelin/contracts@4.4.1` and `@openzeppelin/contracts-v5.2` to `@openzeppelin/contracts@5.2.0`, and every OpenZeppelin file in the verified source matches the published packages byte-for-byte.

**Proxy topology and initialization.** The proxy is an `OssifiableProxy` whose runtime code is byte-identical to the audited `OssifiableProxy.sol`. On-chain EIP-1967 slots: the implementation slot holds `0x5d2DDD6817180C2135b4652503bD555C2d3Bb392` and the admin slot holds the Lido Aragon Agent `0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c`; the beacon slot is empty. Initializer state (ERC-7201 slot `0xf0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00`): the proxy is initialized at version 1 via the `initialize` call embedded in the proxy constructor calldata, and the raw implementation carries the `_disableInitializers` mark (`0xffffffffffffffff`), so neither the proxy nor the raw implementation can be initialization-front-run.

**Constructor and initializer arguments.** The implementation creation transaction's constructor arguments decode to StakingRouter `0xFdDf38947aFB03C621C71b06C9C70bce73f12999`, ConsolidationBus `0xd907CE33B4Be423823d1CFFe80BD147E8b8554C8`, `sourceModuleId = 4`, `targetModuleId = 4`; the proxy creation transaction's constructor arguments decode to implementation `0x5d2DDD6817180C2135b4652503bD555C2d3Bb392`, admin `0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c`, and initializer calldata `initialize(0x8dB3077406432D73FBe6c5EEBd1435c6846D40D7)` granting `DEFAULT_ADMIN_ROLE` to the deployment EOA as a bootstrap step. All values match the on-chain getters (`getStakingRouter()`, `getConsolidationBus()`, `sourceModuleId()`, `targetModuleId()`), and StakingRouter module `4` resolves to the Curated Module v2 (`curated-onchain-v2`) at `0xDa5F930cE326EB5205085D66c72A4E79d60cB8C1`. The `ConsolidationBus` address is the proxy deployed during the audited Staking Router v3 upgrade (implementation `0xFfDe8Acab9D7037f29198Ad03ad6d05bac8B0a2E`, admin the Aragon Agent), and the constructor immutables read back on-chain equal the decoded creation arguments.

**Access control.** All role transitions in the deployment sequence were decoded and re-verified live on-chain. `ALLOW_PAIR_ROLE` and `DISALLOW_PAIR_ROLE` were granted to the CMC committee Safe `0x2570e0b22AD904501dfB0d49575991ACB801dD91`, `DEFAULT_ADMIN_ROLE` was granted to the Aragon Agent `0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c`, and the deployment EOA then renounced its bootstrap `DEFAULT_ADMIN_ROLE`. The live role registry is:

Contract | Role | Holder
--- | --- | ---
ConsolidationMigrator (proxy) | `DEFAULT_ADMIN_ROLE` | Aragon Agent `0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c`
ConsolidationMigrator (proxy) | `ALLOW_PAIR_ROLE` | CMC committee Safe `0x2570e0b22AD904501dfB0d49575991ACB801dD91`
ConsolidationMigrator (proxy) | `DISALLOW_PAIR_ROLE` | CMC committee Safe `0x2570e0b22AD904501dfB0d49575991ACB801dD91`

The deployment EOA holds no role on the contract (verified via `hasRole` for all three roles). The committee address is a 5-of-9 Gnosis Safe; the same Safe holds `DISALLOW_PAIR_ROLE` on the original Staking Router v3 migrator `0x9Dc70b5A4f4F5E4AF9058C983D560564F031f1D7`, where `ALLOW_PAIR_ROLE` is held by the Easy Track EVMScriptExecutor `0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977` - on the new instance both pair-management roles are assigned directly to the committee, consistent with the direct intra-module consolidation flow for the Curated Module v2 discussed on the [Research Forum](https://research.lido.fi/t/future-of-the-curated-module-cmv2-landscape/10929/50).

**Rollout state.** `ConsolidationBus.addConsolidationRequests` is gated by `PUBLISH_ROLE`; the new migrator does not hold it yet (`hasRole` returns `false`), and the role's only current holder is the original migrator `0x9Dc70b5A4f4F5E4AF9058C983D560564F031f1D7`. Granting `PUBLISH_ROLE` to the new migrator is an item of the upcoming DAO vote - the `ConsolidationBus`'s `DEFAULT_ADMIN_ROLE` is held by the Aragon Agent, so the grant can only be enacted through governance. Until the vote passes, the new migrator cannot submit consolidation batches (`submitConsolidationBatch` would revert at the bus), so no misconfiguration window exists in the current state.

No inconsistency between the third-party audit reports and the deployed contracts was found: the deployed bytecode is exactly the audited code, the deployment configuration matches the parameters described by the client, and the access-control handover leaves no residual privileges with the deployer.
    
## 2. About MixBytes

**MixBytes** is a blockchain security firm specializing in the analysis of decentralized protocols and smart contract systems.

The company helps Web3 teams build resilient protocol architecture, smart contract logic, and economic mechanisms through a combination of AI-assisted analysis and senior human expertise.

Rather than focusing solely on one-time audits before deployment, MixBytes works with protocols across their entire lifecycle — from early architecture design to production audits and ongoing protocol evolution.

Our team consists of experienced security researchers, engineers, and protocol analysts with deep expertise in DeFi systems, adversarial protocol analysis, and smart contract security.

Over the years, MixBytes has worked with many of the most widely used protocols in the ecosystem, including **Lido**, **Aave**, **Curve**, **1inch**, **OKX**, **Mantle**, **Fluid**, **Gearbox**, **Resolv**, and others, helping teams identify vulnerabilities, strengthen protocol design, and improve the robustness of decentralized systems.

To enhance analysis efficiency and coverage, MixBytes also develops and uses internal AI-assisted tooling that helps surface potential risk signals during development and code review. These tools augment the work of senior auditors but do not replace expert analysis.

### Protocol Security Lifecycle

MixBytes supports protocols across the full lifecycle of their development and operation.
- **Design Review.** Independent assessment of protocol architecture and economic design before critical decisions are embedded in production code.
- **AI Tooling.** AI-assisted analysis integrated into development workflows to surface potential risk signals during protocol development.
- **Smart Contract Audit.** Comprehensive manual verification of smart contract logic and protocol invariants before production deployment.
- **Security Retainer.** Continuous expert support for protocol upgrades, integrations, governance changes, and evolving attack surfaces after launch.

### Contacts

- [**Website**](https://mixbytes.io/)
- [**GitHub**](https://github.com/mixbytes/audits_public)
- [**X**](https://x.com/MixBytes)
- **Mail:** [hello@mixbytes.io](mailto:hello@mixbytes.io)
