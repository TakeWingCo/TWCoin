pragma solidity ^0.4.17;


import "../../Owned.sol";


contract OwnedToken is Owned
{
	//function mint(uint _amount, address _to) public returns (bool);

	//function sterilize(uint _amount) onlyOwner public returns (bool);

	event Mint(uint _amount, address _to);

	event Sterilize(uint _amount);
}