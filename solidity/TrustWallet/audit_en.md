# Audit of TST Token smart contracts

###### Contract

URL of the audited contract: https://github.com/TrustWallet/contracts-trust/tree/0b4ccc05402e1517ef44688e8a488f7dbc01cfac/contracts

## Classification of identified issues

##### CRITICAL: possible stealing of Ether/tokens, or their permanent blocking with no opportunity of recovering access, or any other loss of Ether/tokens payable to any party (e.g., as dividends).
##### SERIOUS: possible violations of contract operations, where the manual amendment or complete replacement of the contract is required to recover proper operations.
##### WARNINGS: possible violation of the contract’s planned logic, or possible DoS attack on the contract.
##### REMARKS: any other remarks.


## Audit methodology

The code of the contract may be viewed manually in order to identify known vulnerabilities, logic errors, and compliance with the White Paper. Unit tests can be written to check any questionable aspects as required.

## Identified issues

### [CRITICAL]

- not found

### [SERIOUS]

- not found

### [WARNINGS]

- not found

### [REMARKS]

##### 1. [Migration.sol#L17](https://github.com/TrustWallet/contracts-trust/blob/0b4ccc05402e1517ef44688e8a488f7dbc01cfac/contracts/Migration.sol#L17)

According to [specification](https://github.com/TrustWallet/contracts-trust/issues/5) `Reserve` pool vesting period is 
2 years, and intermediate partial releases are not expected. At the same time, in `Migration.sol` there are intermediate 
partial releases of tokens every 183 days.

*Updated in the whitepaper.*

##### 2. [Migration.sol#L19](https://github.com/TrustWallet/contracts-trust/blob/0b4ccc05402e1517ef44688e8a488f7dbc01cfac/contracts/Migration.sol#L19)

According to [specification](https://github.com/TrustWallet/contracts-trust/issues/5) `Advisors/Partners` pool is vested 
over 1 year with 25% released every 3 months starting from the date of first Token Distribution.
At the same time, in `Migration.sol` release logic is the following: to release 20% every 3 months and the first release
is immediate. Which contradicts the specification at least in numbers.

*Fixed in [2a85f6c](https://github.com/TrustWallet/contracts-trust/commit/2a85f6c1ff593b43e8d0c38b7b6d04d055ea6e3f).*

### [SUMMARY]

The code of the token and vesting contract is flawless and well written. There was a few concerns regarding accordance of
the migration code with the specification which are fixed as of 22 jun 2018.
