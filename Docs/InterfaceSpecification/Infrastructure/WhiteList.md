# WhiteList.sol

White list of verified addresses

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

* ../Organizations/Makers.sol

## enums

No

## structs

No

## modifiers

* `modifier onlyMaker`

  Grant on action onlu for block makers (masternodes).

## events

* `event AdditionInToWhiteList(address indexed registrar, address indexed object)`

  Addition new address to white list event.

## constructor

* `function WhiteList(address makingContract) public`

  Deploy new white list contract.

## fallback function

No

## external functions

No

## public functions

* `function addInToWhiteList(address _address) onlyMaker public`

  Adds new address to white list.

* `function makersContract() public constant returns (Makers)`

  Returns block makers contract instance for this contract.

## internal functions

No

## private functions

No

## public fields

* `mapping(address => bool) public inWhiteList`

  List addresses in white list.

* `Makers public makersContract`

  Block makers contract instance for this contract.

## internal fields

No

## private fields

No