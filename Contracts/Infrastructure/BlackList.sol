pragma solidity ^0.4.17;


import "../Organizations/Voters.sol";


contract BlackList
{
	enum OfferType
	{
		Addition,
		Deleting
	}

	struct Offer
	{
		OfferType offerType;
		address objectAddress; // Object of voting.
		mapping(address => bool) voted;
		uint totalVoted;
		uint startDate;
		bool executed;
	}

	modifier onlyVoter
	{
		require(votersContract.isVoter(msg.sender));
		_;
	}

	event MakeAdditionOffer(address indexed offerMaker, address indexed object, uint id);

	event MakeDeletingOffer(address indexed offerMaker, address indexed object, uint id);

	event VoteForOffer(address indexed voter, uint id);

	event ExecuteOffer(uint indexed id, bool indexed result);

	function BlackList(address votingContract) public
	{
		votersContract = Voters(votingContract);
	}

	function makeAdditionOffer(address _address) onlyVoter public returns (uint)
	{
		require(!inBlackList[_address]);

		offers[currentId].objectAddress = _address;
		offers[currentId].offerType = OfferType.Addition;
		offers[currentId].startDate = block.timestamp;

		MakeAdditionOffer(msg.sender, _address, currentId);

		return currentId++;
	}

	function makeDeletingOffer(address _address) onlyVoter public returns (uint)
	{
		require(inBlackList[_address]);

		offers[currentId].objectAddress = _address;
		offers[currentId].offerType = OfferType.Deleting;
		offers[currentId].startDate = block.timestamp;

		MakeDeletingOffer(msg.sender, _address, currentId);

		return currentId++;
	}

	function voteForOffer(uint id) onlyVoter public
	{
		require(id < currentId);
		require(!offers[id].voted[msg.sender]);
		require(!offers[id].executed);

		offers[id].voted[msg.sender] = true;
		offers[id].totalVoted++;

		offers[currentId].startDate = block.timestamp;

		VoteForOffer(msg.sender, id);
	}

	function executeOffer(uint id) onlyVoter public returns (bool)
	{
		require(id < currentId);
		require(!offers[id].executed);

		if (offers[id].totalVoted >= votersContract.numberOfVoters() / 2)
		{
			offers[id].executed = true;

			if (offers[id].offerType == OfferType.Addition)
			{
				inBlackList[offers[id].objectAddress] = true;
			}
			else
			{
				inBlackList[offers[id].objectAddress] = false;
			}
			
			ExecuteOffer(id, true);
			return true;
		}
		else
		{
			ExecuteOffer(id, false);
			return false;
		}
	}

	mapping(address => bool) public inBlackList;

	mapping(uint => Offer) public offers;

	Voters public votersContract;

	uint public currentId;
}