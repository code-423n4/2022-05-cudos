# ✨ So you want to sponsor a contest

This `README.md` contains a set of checklists for our contest collaboration.

Your contest will use two repos: 
- **a _contest_ repo** (this one), which is used for scoping your contest and for providing information to contestants (wardens)
- **a _findings_ repo**, where issues are submitted. 

Ultimately, when we launch the contest, this contest repo will be made public and will contain the smart contracts to be reviewed and all the information needed for contest participants. The findings repo will be made public after the contest is over and your team has mitigated the identified issues.

Some of the checklists in this doc are for **C4 (🐺)** and some of them are for **you as the contest sponsor (⭐️)**.

---

# Contest setup

## 🐺 C4: Set up repos
- [ ] Create a new private repo named `YYYY-MM-sponsorname` using this repo as a template.
- [ ] Add sponsor to this private repo with 'maintain' level access.
- [ ] Send the sponsor contact the url for this repo to follow the instructions below and add contracts here. 
- [ ] Delete this checklist and wait for sponsor to complete their checklist.

## ⭐️ Sponsor: Provide contest details

Under "SPONSORS ADD INFO HERE" heading below, include the following:

- [ ] Name of each contract and:
  - [ ] source lines of code (excluding blank lines and comments) in each
  - [ ] external contracts called in each
  - [ ] libraries used in each
- [ ] Describe any novel or unique curve logic or mathematical models implemented in the contracts
- [ ] Does the token conform to the ERC-20 standard? In what specific ways does it differ?
- [ ] Describe anything else that adds any special logic that makes your approach unique
- [ ] Identify any areas of specific concern in reviewing the code
- [ ] Add all of the code to this repo that you want reviewed
- [ ] Create a PR to this repo with the above changes.

---

# Contest prep

## 🐺 C4: Contest prep
- [ ] Rename this repo to reflect contest date (if applicable)
- [ ] Rename contest H1 below
- [ ] Add link to report form in contest details below
- [ ] Update pot sizes
- [ ] Fill in start and end times in contest bullets below.
- [ ] Move any relevant information in "contest scope information" above to the bottom of this readme.
- [ ] Add matching info to the [code423n4.com public contest data here](https://github.com/code-423n4/code423n4.com/blob/main/_data/contests/contests.csv))
- [ ] Delete this checklist.

## ⭐️ Sponsor: Contest prep
- [ ] Make sure your code is thoroughly commented using the [NatSpec format](https://docs.soliditylang.org/en/v0.5.10/natspec-format.html#natspec-format).
- [ ] Modify the bottom of this `README.md` file to describe how your code is supposed to work with links to any relevent documentation and any other criteria/details that the C4 Wardens should keep in mind when reviewing. ([Here's a well-constructed example.](https://github.com/code-423n4/2021-06-gro/blob/main/README.md))
- [ ] Please have final versions of contracts and documentation added/updated in this repo **no less than 8 hours prior to contest start time.**
- [ ] Ensure that you have access to the _findings_ repo where issues will be submitted.
- [ ] Promote the contest on Twitter (optional: tag in relevant protocols, etc.)
- [ ] Share it with your own communities (blog, Discord, Telegram, email newsletters, etc.)
- [ ] Optional: pre-record a high-level overview of your protocol (not just specific smart contract functions). This saves wardens a lot of time wading through documentation.
- [ ] Delete this checklist and all text above the line below when you're ready.

---

# Cudos contest details
- $71,250 USDC main award pot
- $3,750 USDC gas optimization award pot
- Join [C4 Discord](https://discord.gg/code4rena) to register
- Submit findings [using the C4 form](https://code4rena.com/contests/2022-04-cudos-contest/submit)
- [Read our guidelines for more details](https://docs.code4rena.com/roles/wardens)
- Starts April 28, 2022 00:00 UTC
- Ends May 04, 2022 23:59 UTC

This repo will be made public before the start of the contest. (C4 delete this line when made public)


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

The [Gravity module](https://github.com/cosmos/gravity-bridge//tree/main/module/x/gravity/spec) is resposible for handling all transactions in the Cudos Network related to the bridge.

# Smart Contracts

The following contracts are in-scope for the audit.
### Contracts
#### [Gravity.sol](https://github.com/CudoVentures/cosmos-gravity-bridge/blob/cudos-master/solidity/contracts/Gravity.sol) (~600 sloc)

Stores a real time representation of the validator set of the Cudos Network. For optimisation hash is representing the full validator set and voting power. This contract's events are tracked by the oracle component of the bridge in order to perform actions triggered on the Ethereum network on the Cudos Network. 

#### [CosmosToken.sol](https://github.com/CudoVentures/cosmos-gravity-bridge/blob/cudos-master/solidity/contracts/CosmosToken.sol) (~15 sloc)

## Out of scope contracts
#### [CudosToken.sol](https://github.com/CudoVentures/cudos-token/blob/master/contracts/CudosToken.sol)

ERC-20 Cudos token contract. 

#### [CudosAccessControl.sol](https://github.com/CudoVentures/cudos-token/blob/master/contracts/CudosAccessControls.sol ) (~70 sloc)


Access controls contract managing user roles. Gravity.sol verifies ceraiain functions access based on the user defined roles. 

# Areas to focus

TBD


# Build

For local builds you can use the [Cudos Builders](https://github.com/CudoVentures/cudos-builders)
# References

Token repo: https://github.com/CudoVentures/cudos-token

Cudos-noded repo: https://github.com/CudoVentures/cudos-node

Gravity bridge repo: https://github.com/CudoVentures/cosmos-gravity-bridge

Bridge user doc: https://docs.cudos.org/learn/gravity-bridge.html

Network resources: https://docs.cudos.org/

Token transfer app: https://bridge.testnet.cudos.org/

Deployed contracts: TBD
