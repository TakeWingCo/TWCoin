pragma solidity ^0.4.17;


import "../ZSLPrecompile.sol";
import "../ZSLMerkleTree.sol";
import "../ZSLSafeMath.sol";
import "./ERC20/IERC20Token.sol";
import "./ZToken/IZToken.sol";
import "./OwnedToken/OwnedToken.sol";


contract TWCoin is OwnedToken, IZToken, IERC20Token, ZSLMerkleTree, SafeMath
{
	// Depth of the merkle tree decides how many notes this contract can store 2^depth.
    uint constant public ZTOKEN_TREE_DEPTH = 32;

	string public constant name = "TWCoin";

	string public constant symbol = "KGS";

	uint8 public constant decimals = 2;

	uint public total_supply;

	uint public shieldingCount;

	uint public unshieldingCount;

	uint public shieldedTransferCount;

	function TWCoin() ZSLMerkleTree(ZTOKEN_TREE_DEPTH)
    {
        owner = msg.sender;
        total_supply = 0;

        // Create contract for precompiles and commitment tree
        address_zsl = new ZSLPrecompile();
        zsl = ZSLPrecompile(address_zsl);
    }

    function totalSupply() public constant returns (uint)
    {
        return total_supply;
    }

    function balanceOf(address _owner) public constant returns (uint)
    {
        return balances[_owner];
    }

	// Owner method: Mint tokens to a certain target address, and thus increase total supply.
    function mint(uint _amount, address _to) onlyOwner public returns (bool)
	{
        balances[_to] = safeAdd(balances[_to], _amount);
        total_supply = safeAdd(total_supply, _amount);
        Mint(_amount, _to);
		return true;
    }

    // Sterilize some tokens.
    function sterilize(uint _amount) onlyOwner public returns (bool)
    {
        balances[owner] = safeSubtract(balances[owner], _amount);
        total_supply = safeSubtract(total_supply, _amount);
        Sterilize(_amount);
		return true;
    }

    // Send tokens from public pool of funds (not private shielded funds).
    function transfer(address _recipient, uint _value) public returns (bool)
	{
        require(balances[msg.sender] >= _value);// check if the sender has enough
        balances[msg.sender] = safeSubtract(balances[msg.sender], _value);// check for underflow
        balances[_recipient] = safeAdd(balances[_recipient], _value);// check for overflow
        Transfer(msg.sender, _recipient, _value);
		return true;
    }

    // Send _value amount of tokens from address _from to address _to.
	function transferFrom(address _from, address _to, uint _value) public returns (bool success)
	{
		uint allowance = allowed[_from][msg.sender];
		if (allowance < _value || balances[_from] < _value)// Check balance.
		{
			return false;
		}

    	balances[_from] -= _value;
		balances[_to] += _value;
    	allowed[_from][msg.sender] -= _value;
    	Transfer(_from, _to, _value);
		return true;
	}

	// Allow _spender to withdraw from your account, multiple times, up to the _value amount.
	// If this function is called again it overwrites the current allowance with _value.
	function approve(address _spender, uint _value) public returns (bool success)
	{
		if ((_value != 0) && (allowed[msg.sender][_spender] != 0))
		{
			return false;
		}

    	allowed[msg.sender][_spender] = _value;
    	Approval(msg.sender, _spender, _value);
		return true;
	}

    // Returns the amount which _spender is still allowed to withdraw from _owner.
	function allowance(address _owner, address _spender) public constant returns (uint remaining)
	{
		return allowed[_owner][_spender];
	}

	/**
     * @return capacity Maxmimum number of shielded transactions this contract can process
     */
    function shieldedTxCapacity() public constant returns (uint) {
        return capacity() / 2;
    }

    /**
     * @return available The number of shielded transactions that can be still be processed
     */
    function shieldedTxAvailable() public constant returns (uint) {
        return shieldedTxCapacity() - shieldedTransferCount;
    }

    /**
     * Add shielding of non-private funds
     * ztoken.shield(proof, send_nf, cm, value, {from:eth.accounts[0],gas:5470000});
     */
    function shield(bytes proof, bytes32 send_nf, bytes32 cm, uint64 value) public {
        require(balances[msg.sender] >= value);// check if the sender has enough funds to shield
        require(mapNullifiers[send_nf] == 0);// check if nullifier has been used before
        require(!commitmentExists(cm));
        assert(zsl.verifyShielding(proof, send_nf, cm, value));// verfy proof
        addCommitment(cm);// will assert if cm has already been added or the tree is full
        mapNullifiers[send_nf] = 1;
        balances[msg.sender] = safeSubtract(balances[msg.sender], value);// check for underflow
        LogShielding(msg.sender, value, sha3(cm));
        shieldingCount++;
    }

    /**
     * Add unshielding of private funds
     * ztoken.unshield(proof, spend_nf, cm, rt, value, {from:eth.accounts[0],gas:5470000});
     */
    function unshield(bytes proof, bytes32 spend_nf, bytes32 cm, bytes32 rt, uint64 value) public {
        require(mapNullifiers[spend_nf] == 0);// check if nullifier has been used before
        require(commitmentExists(cm));
        assert(zsl.verifyUnshielding(proof, spend_nf, rt, value));// verfy proof
        mapNullifiers[spend_nf] = 1;
        balances[msg.sender] = safeAdd(balances[msg.sender], value);// check for overflow
        LogUnshielding(msg.sender, value, sha3(cm));
        unshieldingCount++;
    }

    /**
     * Add shielded transfer of privatefunds
     * ztoken.shieldedTransfer(proof, anchor, in_spend_nf_1, in_spend_nf_2, out_send_nf_1, out_send_nf_2, out_cm_1, out_cm_2, {from:eth.accounts[0], gas:5470000});
     */
    function shieldedTransfer(
        bytes proof, bytes32 anchor,
        bytes32 spend_nf_1, bytes32 spend_nf_2,
        bytes32 send_nf_1, bytes32 send_nf_2,
        bytes32 cm_1, bytes32 cm_2
    ) public {
        require(mapNullifiers[send_nf_1] == 0);
        require(mapNullifiers[send_nf_2] == 0);
        require(mapNullifiers[spend_nf_1] == 0);
        require(mapNullifiers[spend_nf_2] == 0);
        require(!commitmentExists(cm_1));
        require(!commitmentExists(cm_2));
        assert(zsl.verifyShieldedTransfer(
            proof, anchor,
            spend_nf_1, spend_nf_2,
            send_nf_1, send_nf_2,
            cm_1, cm_2 ));
        addCommitment(cm_1);
        addCommitment(cm_2);
        mapNullifiers[send_nf_1] = 1;
        mapNullifiers[send_nf_2] = 1;
        LogShieldedTransfer(msg.sender, sha3(cm_1), sha3(cm_2));
        shieldedTransferCount++;
    }

	// Address for ZSL contract
    address private address_zsl;

	// ZSL contract
    ZSLPrecompile private zsl;

	// Map of send and spending nullifiers (when creating and consuming shielded notes)
    mapping (bytes32 => uint) private mapNullifiers;

    // Address balances.
	mapping(address => uint) public balances;

    // Allowed for other balances.
	mapping(address => mapping (address => uint256)) private allowed;
}