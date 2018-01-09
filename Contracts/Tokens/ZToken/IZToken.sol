pragma solidity ^0.4.17;


interface IZToken
{
	function shieldedTxCapacity() public constant returns (uint);

	function shieldedTxAvailable() public constant returns (uint);
	
	function shield(bytes proof, bytes32 send_nf, bytes32 cm, uint64 value) public;
	
	function unshield(bytes proof, bytes32 spend_nf, bytes32 cm, bytes32 rt, uint64 value) public;
	
	function shieldedTransfer(
		bytes proof, bytes32 anchor, bytes32 spend_nf_1, bytes32 spend_nf_2,
		bytes32 send_nf_1, bytes32 send_nf_2, bytes32 cm_1, bytes32 cm_2) public;
    
	event LogShielding(address indexed from, uint256 value, bytes32 uuid);
    
	event LogUnshielding(address indexed from, uint256 value, bytes32 uuid);
    
	event LogShieldedTransfer(address indexed from, bytes32 uuid_1, bytes32 uuid_2);
}