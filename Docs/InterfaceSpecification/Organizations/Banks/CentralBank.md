# CentralBank.sol

Contract of Central bank - main regulator

## Contains

* version
* imports
* enums
* structs
* modifiers
* events
* constructor
* fallback function
* external functions
* public functions
* internal functions
* private functions
* public fields
* internal fields
* private fields

## version

Solidity version - 0.4.17

## imports

* ../../Tokens/TokenOwner.sol

## enums

No

## structs

No

## modifiers

* `modifier onlyBanker`

  Grant on action only for bankers.

## events

No

## constructor

* `function CentralBank(address[] bankerList) public`

  Deploy contract of central bank.

## fallback function

No

## external functions

No

## public functions

* `function acceptOffer(uint id) onlyBanker public returns (bool)`

  Accept offer to mint/liquidate tokens.

* `function setTokenOwnerContract(address _address) onlyBanker public`

  Set token owner contract address after deploy.

* `function tokenOwnerContract() public returns (TokenOwner)`

  Returns TokenOwner instance for this contract.

## internal functions

No

## private functions

No

## public fields

* `mapping(address => bool) public bankers`

  List of bankers.

* `TokenOwner public tokenOwnerContract`

  TokenOwner instance for this contract.

## internal fields

No

## private fields

No