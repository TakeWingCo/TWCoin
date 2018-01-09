# Voters.sol

Contract for block voters

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

* ../Tokens/TokenOwner.sol

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

* `function Voters(address[] voters, bytes32[] enodes) public`

  Deploy new Voters contract.

## fallback function

No

## external functions

No

## public functions

* `function isVoter(address _address) public constant returns (bool)`

  Returns true if address is block voter.

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

* `uint public numberOfVoters`

  Number of voters.
	
* `TokenOwner public tokenOwnerContract`

  Token owner instacne for this contract.

## internal fields

No

## private fields

* `mapping (address => bool) canVote`

  Map of voters.

* `mapping (uint => Offer) offers`

  Map of offers.

* `uint currentId`

  Number of offers.