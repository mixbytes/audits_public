# Audit of UBCoin Token smart contracts

###### Contract

URL of the audited contract: https://github.com/ubcoin/ubcoin/blob/f93ba05064c88fc74d1ce90f8570e0b1d724849a/contracts/UBCoinToken.sol (and its dependencies)

Deployed contract https://etherscan.io/address/0x2d3e7d4870a51b918919e7b851fe19983e4c38d5#code

## Classification of identified issues

##### CRITICAL: possible stealing of Ether/tokens, or their permanent blocking with no opportunity of recovering access, or any other loss of Ether/tokens payable to any party (e.g., as dividends).
##### SERIOUS: possible violations of contract operations, where the manual amendment or complete replacement of the contract is required to recover proper operations.
##### WARNINGS: possible violation of the contract’s planned logic, or possible DoS attack on the contract.
##### REMARKS: any other remarks.


## Audit methodology

The code of the contract may be viewed manually in order to identify known vulnerabilities, logic errors, and compliance with the White Paper. Unit tests can be written to check any questionable aspects as required.

## Identified issues

### 1. [CRITICAL]

- not found

### 2. [SERIOUS]

- not found

### 3. [WARNINGS]

##### 3.1 [UBCoinToken.sol#L32](https://github.com/ubcoin/ubcoin/blob/f93ba05064c88fc74d1ce90f8570e0b1d724849a/contracts/UBCoinToken.sol#L32)

If function `tokenFallback` of `ReceivingContractCallback` for some address fails then whole transaction (with `transfer` or `transferFrom` in it) will also fail. If it isn't expected behaviour we recommend use low-level method `call` which will return `false` when called function fails.

### 4. [REMARKS]

##### 4.1 [MintableToken.sol#L26](https://github.com/ubcoin/ubcoin/blob/f93ba05064c88fc74d1ce90f8570e0b1d724849a/contracts/MintableToken.sol#L26)

According to [ERC-20 standard](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#transfer-1):
> A token contract which creates new tokens SHOULD trigger a Transfer event with the _from address set to 0x0 when tokens are created.


##### 4.2 [UBCoinToken.sol#L12](https://github.com/ubcoin/ubcoin/blob/f93ba05064c88fc74d1ce90f8570e0b1d724849a/contracts/UBCoinToken.sol#L12)

According to [ERC-20 standard](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#decimals) type of returned value for `decimals` should be `uint8`

