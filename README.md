# Cudos contest details
- $71,250 USDC main award pot
- $3,750 USDC gas optimization award pot
- Join [C4 Discord](https://discord.gg/code4rena) to register
- Submit findings [using the C4 form](https://code4rena.com/contests/2022-05-cudos-contest/submit)
- [Read our guidelines for more details](https://docs.code4rena.com/roles/wardens)
- Starts May 03, 2022 00:00 UTC
- Ends May 09, 2022 23:59 UTC

# Contest Scope
This contest is open for one week. Representatives from Cudos will be available in the Code Arena Discord to answer any questions during the contest period. The focus for the contest is to try and find any logic errors or ways to drain funds in a way that is advantageous for an attacker at the expense of users with funds invested in the protocol. Wardens should assume that governance variables are set sensibly (unless they can find a way to change the value of a governance variable, and not counting social engineering approaches for this).
# Overview

The Cudos Network is a special-purpose blockchain designed to provide high-performance, trustless, and permissionless cloud computing for all.
It is based on [Cosmos SDK](https://github.com/cosmos/cosmos-sdk/).
The focus of the contest is the Bridge which contains a Cosmos module, Solidity smart contracts and associated relaying/oracle code. 

It currently supports bridging of CUDOS tokens between the Ethereum and Cudos ecosystems. It is based on Althea's Gravity Bridge.

## Design Notes
- CUDOS Network supports sending the native Cudos token to an EMV based network.
- CUDOS Network Gravity Bridge is bidirectional. 
- CUDOS Network Gravity Bridge accepts transactions verified only by preaproved set of validators.
- Batches are automaticaly sent every X blocks.
- Minimum amount and minimum fee are required for a transfer. Those values can be changed only by admin defined in ``CudosAccessControls``.
- Every user can bridge tokens.
## Example flows

### Token transfer

Usage example:
#### Ethereum to Cudos Network
1. User sends 50 CUDOS to the Gravity.sol specifying the receiver address via the ``SendToCosmos``. The address is a Cudos network address.
2. Validators on the Cudos chain see that this has happened and mint 50 CUDOS for the address you specified on the Cudos chain.

#### Cudos Network to Ethereum
1. User wants to send 50 CUDOS with the gravity module to an Ethereum address. Calling the ``send-to-eth`` method they specify an Ethereum address and amount.
2. Validators on the Cudos chain lock the Cudos token in the gravity module and unlock 50 CUDOS on the Ethereum Network.

# Gravity module

The [Gravity module](https://github.com/code-423n4/2022-05-cudos/tree/main/module/x/gravity/spec) is resposible for handling all transactions in the Cudos Network related to the bridge.

# Smart Contracts

The following contracts are in-scope for the audit.
### Contracts
#### [Gravity.sol](https://github.com/code-423n4/2022-05-cudos/tree/main/solidity/contracts/Gravity.sol) (~600 sloc)

Stores a real time representation of the validator set of the Cudos Network. For optimisation hash is representing the full validator set and voting power. This contract's events are tracked by the oracle component of the bridge in order to perform actions triggered on the Ethereum network on the Cudos Network. 

#### [CosmosToken.sol](https://github.com/code-423n4/2022-05-cudos/tree/main/solidity/contracts/CosmosToken.sol) (~15 sloc)

## Out of scope contracts
#### [CudosToken.sol](https://github.com/CudoVentures/cudos-eth-token-contract/blob/main/contracts/CudosToken.sol)

ERC-20 Cudos token contract. 

#### [CudosAccessControl.sol](https://github.com/CudoVentures/cudos-eth-token-contract/blob/main/contracts/CudosAccessControls.sol) (~70 sloc)


Access controls contract managing user roles. Gravity.sol verifies ceraiain functions access based on the user defined roles. 


# Build

For local builds you can use the [Cudos Builders](https://github.com/CudoVentures/cudos-builders)
# References

Token repo: https://github.com/CudoVentures/cudos-eth-token-contract

Cudos-noded repo: https://github.com/CudoVentures/cudos-node

Gravity bridge repo: https://github.com/CudoVentures/cosmos-gravity-bridge

Bridge user doc: https://docs.cudos.org/learn/gravity-bridge.html

Network resources: https://docs.cudos.org/

# Test deployments

Gravity contracts: [0x8f8baFF99FCe5F6Df2abc073A55aB69D8aF13D22](https://rinkeby.etherscan.io/address/0x8f8baFF99FCe5F6Df2abc073A55aB69D8aF13D22)

Block Explorer:  [http://34.132.35.39:3000/](http://34.132.35.39:3000/)

Bridge UI:  [http://34.132.35.39:4000/](http://34.132.35.39:4000/)
