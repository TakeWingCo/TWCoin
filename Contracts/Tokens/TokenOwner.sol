pragma solidity ^0.4.17;


import "./TWCoin.sol";


contract TokenOwner
{
	enum OfferType
	{
		MintingOffer,
		SterilizationOffer
	}

	struct Offer
	{
		OfferType offerType;
		uint value;
		address object;
		uint startDate;
		bool isAcceptedByCentralBank;
		bool isAcceptedBySpecialServices;
		bool executed;
	}

	event MakeMintingOffer(uint value, address to, uint id);

	event MakeSterilizationOffer(uint value, address from, uint id);

	event AcceptOffer(uint indexed id, address indexed acceptor);

	event ExecuteOffer(uint indexed id, bool result);

	function TokenOwner(address _centralBank, address _voters, address _evolutionBank, address _token) public
	{
		centralBank = _centralBank;
		voters = _voters;
		evolutionBank = _evolutionBank;
		token = TWCoin(_token);
	}

	function makeMintingOffer(uint _amount, address _address) public returns (uint)
	{
		require(msg.sender == address(evolutionBank));

		offers[currentId].offerType = OfferType.MintingOffer;
		offers[currentId].object = _address;
		offers[currentId].value = _amount;
		offers[currentId].startDate = block.timestamp;

		MakeMintingOffer(_amount, _address, currentId);

		return currentId++;
	}

	function makeSterilizationOffer(uint _amount, address _address) public returns (uint)
	{
		require(msg.sender == address(evolutionBank));

		offers[currentId].offerType = OfferType.SterilizationOffer;
		offers[currentId].object = _address;
		offers[currentId].value = _amount;
		offers[currentId].startDate = block.timestamp;

		MakeSterilizationOffer(_amount, _address, currentId);

		return currentId++;
	}

	function acceptOffer(uint id) public returns (bool)
	{
		require(id < currentId);

		if (msg.sender == centralBank)
		{
			offers[id].isAcceptedByCentralBank = true;
			AcceptOffer(id, msg.sender);
			return true;
		}
		else if (msg.sender == voters)
		{
			offers[id].isAcceptedBySpecialServices = true;
			AcceptOffer(id, msg.sender);
			return true;
		}
		else
		{
			return false;
		}
	}

	function executeOffer(uint id) public returns (bool)
	{
		require(id < currentId);
		require(offers[id].isAcceptedByCentralBank && offers[id].isAcceptedBySpecialServices);
		require(!offers[id].executed);

		if (offers[id].offerType == OfferType.MintingOffer)
		{
			if (token.mint(offers[id].value, offers[id].object))
			{
				ExecuteOffer(id, true);
				offers[id].executed = true;
				return true;
			}
			else
			{
				ExecuteOffer(id, false);
				return false;
			}
		}
		else if (offers[id].offerType == OfferType.SterilizationOffer)
		{
			if (token.sterilize(offers[id].value))
			{
				ExecuteOffer(id, true);
				offers[id].executed = true;
				return true;
			}
			else
			{
				ExecuteOffer(id, false);
				return false;
			}
		}
		else
		{
			return false;
		}
	}

	mapping (uint => Offer) offers;

	uint public currentId = 0;

	TWCoin public token;

	address public evolutionBank;

	address public centralBank;

	address public voters;
}