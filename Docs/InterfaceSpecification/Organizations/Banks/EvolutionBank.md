# EvolutionBank.sol

Contract of Evolution bank

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

## structs

## modifiers

* `modifier onlyBanker`

  Grant on action only for bankers.

## events

## constructor

* `function EvolutionBank(address[] bankerList) public`

  Deploy EvolutionBank contract

## fallback function

## external functions

## public functions

* `function setTokenOwnerContract(address _address) onlyBanker public`

  Set token owner contract address after deploy.

* `function tokenOwnerContract() public returns (TokenOwner)`

  Returns TokenOwner instance for this contract.

* `function makeMintingOffer(uint _amount, address _address) onlyBanker public returns (uint)`

  Makes minting offer.

* `function makeSterilizationOffer(uint _amount, address _address) onlyBanker public returns (uint)`

  Makes sterilization offer.

## internal functions

## private functions

## public fields

* `mapping(address => bool) public bankers`

  List of bankers.

* `TokenOwner public tokenOwnerContract`

  TokenOwner instance for this contract.

## internal fields

## private fields