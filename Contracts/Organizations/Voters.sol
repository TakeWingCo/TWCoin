pragma solidity ^0.4.17;


import "../Tokens/TokenOwner.sol";


contract Voters
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
		require(canVote[msg.sender]);
		_;
	}

	event MakeAdditionOffer(address indexed offerMaker, address indexed newVoter, bytes32[2] indexed enode, uint id);

	event MakeDeletingOffer(address indexed offerMaker, address indexed voter, bytes32[2] indexed enode, uint id);

	event VoteForOffer(address indexed voter, uint id);

	event ExecuteOffer(uint indexed id, bool indexed result);

	function Voters(address[] voters, bytes32[] enodes) public
	{
		require(voters.length * 2 == enodes.length);

		for (uint i = 0; i < voters.length; i++)
		{
			canVote[voters[i]] = true;
			voterEnodes[enodes[i * 2]][enodes[i * 2 + 1]] = true;
		}
	}

	function isVoter(address _address) public constant returns (bool)
	{
		return canVote[_address];
	}

	function getNumberOfVoters() public constant returns (uint)
	{
		return numberOfVoters;
	}

	function isVoterEnode(bytes32[2] enode) public constant returns (bool)
	{
		return voterEnodes[enode[0]][enode[1]];
	}

	function makeAdditionOffer(address newVoter, bytes32[2] newEnode) onlyVoter public returns (uint)
	{
		require(!canVote[newVoter]);
		
		offers[currentId].objectAddress = newVoter;
		offers[currentId].offerType = OfferType.Addition;
		offers[currentId].startDate = block.timestamp;
		offers[currentId].enode[0] = newEnode[0];
		offers[currentId].enode[1] = newEnode[1];

		MakeAdditionOffer(msg.sender, newVoter, newEnode, currentId);
		
		return  currentId++;
	}

	function makeDeletingOffer(address voter, bytes32[2] enode) onlyVoter public returns (uint)
	{
		require(canVote[voter]);

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

		if (offers[id].totalVoted >= numberOfVoters / 2)
		{
			offers[id].executed = true;

			if (offers[id].offerType == OfferType.Addition)
			{
				canVote[offers[id].objectAddress] = true;
				voterEnodes[offers[id].enode[0]][offers[id].enode[1]] = true;
			}
			else
			{
				canVote[offers[id].objectAddress] = false;
				voterEnodes[offers[id].enode[0]][offers[id].enode[1]] = false;
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

	function acceptOffer(uint id) onlyVoter public returns (bool)
	{
		return tokenOwnerContract.acceptOffer(id);
	}

	function setTokenOwnerContract(address _address) onlyVoter public
	{
		tokenOwnerContract = TokenOwner(_address);
	}

	// Mapping of voters.
	mapping (address => bool) canVote;

	mapping (uint => Offer) offers;

	mapping (bytes32 => mapping (bytes32 => bool)) voterEnodes;

	uint currentId;

	// Number of voters.
	uint public numberOfVoters;
	
	TokenOwner public tokenOwnerContract;
}