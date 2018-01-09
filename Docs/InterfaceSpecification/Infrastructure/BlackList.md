# BlackList.sol

BlackList contract contains list of all banned addresses.

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

* ../Organizations/Voters.sol

## enums

* `enum OfferType`

  Types of offer.

## structs

* `struct Offer`

  Offer type.

## modifiers

* `modifier onlyVoter`

  Grant on action 

## events

* `event MakeAdditionOffer(address indexed offerMaker, address indexed object, uint id)`
  
  Addition offer event.

* `event MakeDeletingOffer(address indexed offerMaker, address indexed object, uint id)`
  
  Deletion offer event.

* `event VoteForOffer(address indexed voter, uint id)`
  
  Voting for offer event.
 
* `event ExecuteOffer(uint indexed id, bool indexed result)`

  Execution offer event.

## constructor

* `function BlackList(address votingContract)`

  Deploy new black list contract.

## fallback function

No

## external functions

No

## public functions

* `function makeAdditionOffer(address _address) onlyVoter public returns (uint)`

  Makes addition of new address offer.

* `function makeDeletingOffer(address _address) onlyVoter public returns (uint)`

  Makes deleting offer.

* `function voteForOffer(uint id) onlyVoter public`

  Makes voting offer.

* `function executeOffer(uint id) onlyVoter public returns (bool)`

  Executes offer.

## internal functions

No

## private functions

No

## public fields

* `mapping (address => bool) public inBlackList`

  Map of addresses in black list.

* `mapping (uint => Offer) public offers`

  Map of offers.

* `Voters public votersContract`

  Instance of Voters contract for this contract.

* `uint public currentId`

  Number of offers.

## internal fields

No

## private fields

No