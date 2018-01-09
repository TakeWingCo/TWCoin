# Tender.sol

Tender contract for digital economy

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

* ../Tokens/TWCoin.sol

## enums

* `enum TenderState`

  Teneder state.

## structs

* `struct Expenditure`

  Expenditure struct.

* `struct Offer`

  Offer struct.

## modifiers

No

## events

* `event MakeOffer(address indexed executor, uint indexed principal, uint id)`

  Makes offer.

* `event AddExpenditure(uint indexed offerId, uint indexed principal, string name, uint id)`

  Adds expenditure.

* `event AcceptByRegulator(uint indexed offerId)`

  Accepts offer (for regulator).

* `event AcceptOffer(uint offerId)`

  Accepts offer (for organizator).

* `event Spend(uint indexed offerId, uint indexed expenditureId, address indexed to, uint value)`

  Spends tokens to expenditure.

## constructor

* `function Tender(uint _lastDate, address _regulator, address TWCoin) public`

  Deploy new Tneder contract.

## fallback function

No

## external functions

No

## public functions

* `function makeOffer(uint offerPrincipal) public returns (uint)`

  Makes new offer.

* `function addExpenditure(uint id, string name, uint principal, address[] potentialExecutors) public returns (uint)`

  Adds new expenditure.

* `function acceptByRegulator(uint id) public`

  Accepts offer (for regulator).

* `function acceptOffer(uint id) public`

  Accepts offer (for organizator).

* `function spend(uint expenditureId, address to, uint value) public`

  Spends tokens to expenditure.

## internal functions

No

## private functions

No

## public fields

No

## internal fields

No

## private fields

* `TenderState public state`

  Current state of Tender.

* `TWCoin public token`

  TWCoin instance for this contract.