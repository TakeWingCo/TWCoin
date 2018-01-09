pragma solidity ^0.4.17;


import "./Voters.sol";


contract Makers
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
		bytes32[2] enode;
		mapping (address => bool) voted;
		uint totalVoted;
		uint startDate;
		bool executed;
	}

	modifier onlyVoter
	{
		require(votersContract.isVoter(msg.sender));
		_;
	}

	event MakeAdditionOffer(address indexed offerMaker, address indexed object, bytes32[2] indexed enode, uint id);

	event MakeDeletingOffer(address indexed offerMaker, address indexed object, bytes32[2] indexed enode, uint id);

	event VoteForOffer(address indexed voter, uint id);

	event ExecuteOffer(uint indexed id, bool indexed result);

	function Makers(address votingContract, address[] makers, bytes32[] enodes) public
	{
		require(makers.length * 2 == enodes.length);
		require(votingContract != 0x00);

		for (uint i = 0; i < makers.length; i++)
		{
			canMakeBlocks[makers[i]] = true;
			makerEnodes[enodes[i * 2]][enodes[i * 2 + 1]] = true;
		}

		votersContract = Voters(votingContract);
	}

	function isMakerEnode(bytes32[2] enode) public constant returns (bool)
	{
		return makerEnodes[enode[0]][enode[1]];
	}

	function isMaker(address _address) public constant returns (bool)
	{
		return canMakeBlocks[_address];
	}

	function makeAdditionOffer(address newMaker, bytes32[2] newEnode) onlyVoter public returns (uint)
	{
		require(!canMakeBlocks[newMaker]);
		
		offers[currentId].objectAddress = newMaker;
		offers[currentId].offerType = OfferType.Addition;
		offers[currentId].startDate = block.timestamp;
		offers[currentId].enode[0] = newEnode[0];
		offers[currentId].enode[1] = newEnode[1];

		MakeAdditionOffer(msg.sender, newMaker, newEnode, currentId);
		
		return currentId++;
	}

	function makeDeletingOffer(address voter, bytes32[2] enode) onlyVoter public returns (uint)
	{
		require(canMakeBlocks[voter]);

		offers[currentId].objectAddress = voter;
		offers[currentId].offerType = OfferType.Deleting;
		offers[currentId].startDate = block.timestamp;
		offers[currentId].enode[0] = enode[0];
		offers[currentId].enode[1] = enode[1];

		MakeDeletingOffer(msg.sender, voter, enode, currentId);

		return currentId++;
	}

	function voteForOffer(uint id) onlyVoter public
	{
		require(id < currentId);
		require(!offers[id].voted[msg.sender]);
		require(!offers[id].executed);

		offers[id].voted[msg.sender] = true;
		offers[id].totalVoted++;

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
				canMakeBlocks[offers[id].objectAddress] = true;
				makerEnodes[offers[id].enode[0]][offers[id].enode[1]] = true;
			}
			else
			{
				canMakeBlocks[offers[id].objectAddress] = false;
				makerEnodes[offers[id].enode[0]][offers[id].enode[1]] = false;
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

	uint currentId;

	mapping (uint => Offer) offers;

	mapping (address => bool) public canMakeBlocks;

	mapping (bytes32 => mapping (bytes32 => bool)) public makerEnodes;

	uint public numberOfMakers;

	Voters public votersContract;
}