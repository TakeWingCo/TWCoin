# TokenOwner.sol

Conract-controller for TWCoin

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

* ./TWCoin.sol

## enums

* `enum OfferType`

  Types of offer.

## structs

* `struct Offer`

Offer type.

## modifiers

No

## events

* `event MakeMintingOffer(uint value, address to, uint id)`

  Minting offer creation event.

* `event MakeSterilizationOffer(uint value, address from, uint id)`

  Sterilization offer creation event.

* `event AcceptOffer(uint indexed id, address indexed acceptor)`

  Acception offer event.

* `event ExecuteOffer(uint indexed id, bool result)`

  Offer execution event.

## constructor

* `function TokenOwner(address _centralBank, address _voters, address _evolutionBank, address _token) public`

  Deploy new TokenOwner contract.

## fallback function

No

## external functions

No

## public functions

* `function makeMintingOffer(uint _amount, address _address) public returns (uint)`

  Makes minting offer.

* `function makeSterilizationOffer(uint _amount, address _address) public returns (uint)`

  Makes sterilization offer.

* `function acceptOffer(uint id) public returns (bool)`

  Accepts offer.

* `function executeOffer(uint id) public returns (bool)`

  Executes offer.

## internal functions

No

## private functions

No

## public fields

* `uint public currentId`

  Number of offers.

* `TWCoin public token`

  TWCoin instance for this contract.

* `address public evolutionBank`

  Address of evolution bank contract.

* `address public centralBank`

  Address of central bank contract.

* `address public voters`

  Address of voting contract.

## internal fields

No

## private fields

* `mapping (uint => Offer) offers`

  Map of offers.