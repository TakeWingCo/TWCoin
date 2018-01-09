# Makers.sol

Contract for block makers (masternodes)

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

* ./Voters.sol

## enums

* `enum OfferType`

  Type for offer.

## structs

* `struct Offer`

  Offer type.

## modifiers

* `modifier onlyVoter`

  Grant on action only for voter.

## events

* `event MakeAdditionOffer(address indexed offerMaker, address indexed object, bytes32[2] indexed enode, uint id)`

  Offer addition event.

* `event MakeDeletingOffer(address indexed offerMaker, address indexed object, bytes32[2] indexed enode, uint id)`

  Offer deleting event.

* `event VoteForOffer(address indexed voter, uint id)`

  Offer voting event.

* `event ExecuteOffer(uint indexed id, bool indexed result)`

  Execution offer event.

## constructor

* `function Makers(address votingContract, address[] makers, bytes32[] enodes) public`

  Deploy block makers contract.

## fallback function

No

## external functions

No

## public functions

* `function isMaker(address _address) public constant returns (bool)`

  Returns true if address is block maker (master node).

* `function makeAdditionOffer(address newMaker, bytes32[2] newEnode) onlyVoter public returns (uint)`

  Makes addition offer.

* `function makeDeletingOffer(address voter, bytes32[2] enode) onlyVoter public returns (uint)`

  Makes deleting offer.

* `function voteForOffer(uint id) onlyVoter public`

  Votes fo offer.

* `function executeOffer(uint id) onlyVoter public returns (bool)`

  Executes offer.

## internal functions

No

## private functions

No

## public fields

* `mapping (address => bool) public canMakeBlocks`

  Map of block maker addresses.

* `uint public numberOfMakers`

  Number of block makers (mster nodes).

* `Voters public votersContract`

  Voters contract instance for this contract.

## internal fields

No

## private fields

* `uint currentId`

  Number of offers.

* `mapping (uint => Offer) offers`

  Map of offers.