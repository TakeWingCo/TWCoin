# TWCoin.sol

Contract TWCoin is the main cryptocurrency in TWCoin blockchain ecosystem

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

* ../ZSLPrecompile.sol
* ../ZSLMerkleTree.sol
* ../ZSLSafeMath.sol
* ./ERC20/IERC20Token.sol
* ./ZToken/IZToken.sol
* ./OwnedToken/OwnedToken.sol

## enums

No

## structs

No

## modifiers

No

## events

No

## constructor

* function TWCoin() ZSLMerkleTree(ZTOKEN_TREE_DEPTH)
  Deploy new TWCoin contract and makes mesage sender owner.

## fallback function

No

## external functions

No

## public functions

* `function ZTOKEN_TREE_DEPTH() public constant returns (uint)`

  Returns depth of Merklee tree for this contract.

* `function name() public constant returns (string)`

  Returns name of token.

* `function symbol() public constant returns (string)`

  Returns symbol of token.

* `function decimals() public constant returns (uint)`

  Returns number of decimals for token.

* `function total_supply() public constant returns (uint)`

  Returns current total supply of tokens.

* `function shieldingCount() public constant returns (uint)`

  Returns count of shieldings for this token.

* `function unshieldingCount() public constant returns (uint)`

  Returns count of unshieldings for this token.

* `function shieldedTransferCount() public constant returns (uint)`

  Returns count of shielded transfer for this token.

* `function totalSupply() public constant returns (uint)`

  Returns current total supply for token.

* `function balanceOf(address _owner) public constant returns (uint)`

  Returns balance of address.

* `function mint(uint _amount, address _to) onlyOwner public returns (bool)`

  Mint _amount tokens to _to address.

* `function sterilize(uint _amount) onlyOwner public returns (bool) `

  Liquidate _amount tokens.

* `function transfer(address _recipient, uint _value) public returns (bool)`

  Transfer _value tokens to _recipient.

* `function transferFrom(address _from, address _to, uint _value) public returns (bool success)`

  Transfer _value tokens from _from address to _to address.

* `function approve(address _spender, uint _value) public returns (bool success)`

  Approve to _spender spend _value tokens.

* `function allowance(address _owner, address _spender) public constant returns (uint remaining)`

  Returns allowance to spend by _spender from _owner.

* `function shieldedTxCapacity() public constant returns (uint)`

  Returns shielded transaction capacity.

* `function shieldedTxAvailable() public constant returns (uint)`

  Returns shielded transaction available.

* `function shield(bytes proof, bytes32 send_nf, bytes32 cm, uint64 value) public`

  Shield some tokens.

* `function unshield(bytes proof, bytes32 spend_nf, bytes32 cm, bytes32 rt, uint64 value) public`

  Unshield some tokens.

* `function shieldedTransfer(bytes proof, bytes32 anchor, bytes32 spend_nf_1, bytes32 spend_nf_2, bytes32 send_nf_1, bytes32 send_nf_2, bytes32 cm_1, bytes32 cm_2) public`

  Make shielded transfer.

## internal functions

No

## private functions

No

## public fields

* `mapping(address => uint) public balances`

  TWCoin balances.

* `uint constant public ZTOKEN_TREE_DEPTH`

  Merkle tree depth.

* `string public constant name`

  Token name.

* `string public constant symbol`

  Token symbol.

* `uint8 public constant decimals`

  Number of decimals for this token.

* `uint public total_supply`

  Current total supply.

* `uint public shieldingCount`

  Count of shieldings.

* `uint public unshieldingCount`

  Count of unshieldings.

* `uint public shieldedTransferCount`

  Count of shielded transfers.

## internal fields

No

## private fields

* `address private address_zsl`

  Address of zsl contract.

* `ZSLPrecompile private zsl`

  Instance of zsl contract.

* `mapping (bytes32 => uint) private mapNullifiers`

  Map of nullifiers.

* `mapping(address => mapping (address => uint256)) private allowed`

  Map of allowed maps.