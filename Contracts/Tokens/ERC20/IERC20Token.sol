pragma solidity ^0.4.17;


interface IERC20Token
{
	function totalSupply() public constant returns (uint);

	function balanceOf(address _owner) public constant returns (uint);

	function transfer(address _to, uint _value) public returns (bool);
	
	function transferFrom(address _from, address _to, uint _value) public returns (bool);
	
	function approve(address _spender, uint _value) public returns (bool);
	
	function allowance(address _owner, address _spender) public constant returns (uint);
	
	event Transfer(address indexed _from, address indexed _to, uint _value);
	
	event Approval(address indexed _owner, address indexed _spender, uint _value);
}