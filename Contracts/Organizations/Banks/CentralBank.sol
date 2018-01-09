pragma solidity ^0.4.17;


import "../../Tokens/TokenOwner.sol";


contract CentralBank
{
	modifier onlyBanker
	{
		require(bankers[msg.sender]);
		_;
	}

	function CentralBank(address[] bankerList) public
	{
		for(uint i = 0; i < bankerList.length; i++)
		{
			bankers[bankerList[i]] = true;
		}
	}

	function acceptOffer(uint id) onlyBanker public returns (bool)
	{
		return tokenOwnerContract.acceptOffer(id);
	}

	function setTokenOwnerContract(address _address) onlyBanker public
	{
		tokenOwnerContract = TokenOwner(_address);
	}

	TokenOwner public tokenOwnerContract;

	mapping(address => bool) public bankers;
}