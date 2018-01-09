pragma solidity ^0.4.17;


import "../Organizations/Makers.sol";


contract WhiteList
{
	modifier onlyMaker
	{
		require(makersContract.isMaker(msg.sender));
		_;
	}

	event AdditionInToWhiteList(address indexed registrar, address indexed object);

	function WhiteList(address makingContract) public
	{
		makersContract = Makers(makingContract);
	}

	function addInToWhiteList(address _address) onlyMaker public
	{
		inWhiteList[_address] = true;
		AdditionInToWhiteList(msg.sender, _address);
	}

	mapping(address => bool) public inWhiteList;

	Makers public makersContract;
}