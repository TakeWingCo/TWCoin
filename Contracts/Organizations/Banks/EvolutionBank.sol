pragma solidity^0.4.17;


import "../../Tokens/TokenOwner.sol";


contract EvolutionBank
{
	modifier onlyBanker
	{
		require(bankers[msg.sender]);
		_;
	}

	function EvolutionBank(address[] bankerList) public
	{
		for(uint i = 0; i < bankerList.length; i++)
		{
			bankers[bankerList[i]] = true;
		}
	}

	function setTokenOwnerContract(address _address) onlyBanker public
	{
		tokenOwnerContract = TokenOwner(_address);
	}

	function makeMintingOffer(uint _amount, address _address) onlyBanker public returns (uint)
	{
		return tokenOwnerContract.makeMintingOffer(_amount, _address);
	}

	function makeSterilizationOffer(uint _amount, address _address) onlyBanker public returns (uint)
	{
		return tokenOwnerContract.makeSterilizationOffer(_amount, _address);
	}

	TokenOwner public tokenOwnerContract;

	mapping(address => bool) public bankers;
}