pragma solidity ^0.4.17;


import "../Tokens/TWCoin.sol";


contract Tender
{
	enum TenderState
	{
		Created,
		Activated,
		Expired,
		Closed
	}

	struct Expenditure
	{
		string name;
		uint principal;
		mapping (address => bool) potentialExecutors;
	}

	struct Offer
	{
		address executor;
		mapping (uint => Expenditure) expenditures;
		uint currentExpenditureId;
		uint offerPrincipal;
		bool acceptedByRegulator;
	}

	event MakeOffer(address indexed executor, uint indexed principal, uint id);

	event AddExpenditure(uint indexed offerId, uint indexed principal, string name, uint id);

	event AcceptByRegulator(uint indexed offerId);

	event AcceptOffer(uint offerId);

	event Spend(uint indexed offerId, uint indexed expenditureId, address indexed to, uint value);

	function Tender(uint _lastDate, address _regulator, address _twcoin) public
	{
		startDate = now;
		lastDate = _lastDate;
		creator = msg.sender;
		state = TenderState.Created;
		regulator = _regulator;
		token = TWCoin(_twcoin);
	}

	function makeOffer(uint offerPrincipal) public returns (uint)
	{
		require(now < lastDate);
		offers[currentOfferId].executor = msg.sender;
		offers[currentOfferId].offerPrincipal = offerPrincipal;

		MakeOffer(msg.sender, offerPrincipal, currentOfferId);

		return currentOfferId++;
	}

	function addExpenditure(uint id, string name, uint principal, address[] potentialExecutors) public returns (uint)
	{
		require(id < currentOfferId);
		require(offers[id].executor == msg.sender);
		require(!offers[id].acceptedByRegulator);

		uint expenditureId = offers[id].currentExpenditureId;
		offers[id].expenditures[expenditureId].name = name;
		offers[id].expenditures[expenditureId].principal = principal;

		for (uint i = 0; i < potentialExecutors.length; i++)
		{
			offers[id].expenditures[expenditureId].potentialExecutors[potentialExecutors[i]] = true;
		}

		AddExpenditure(id, principal, name, expenditureId);
		return expenditureId++;
	}

	function acceptByRegulator(uint id) public
	{
		require(id < currentOfferId);
		require(!offers[id].acceptedByRegulator);
		require(msg.sender == regulator);

		AcceptByRegulator(id);
		offers[id].acceptedByRegulator = true;
	}

	function acceptOffer(uint id) public
	{
		require(id < currentOfferId);
		require(msg.sender == creator);
		require(acceptedOfferId == -1);
		require(token.allowance(creator, this) >= offers[id].offerPrincipal);

		if (token.transferFrom(creator, this, offers[id].offerPrincipal))
		{
			contributed = offers[id].offerPrincipal;
			state = TenderState.Activated;
			acceptedOfferId = int(id);
			AcceptOffer(id);
		}
		else
		{
			revert();
		}
	}

	function spend(uint expenditureId, address to, uint value) public
	{
		require(state == TenderState.Activated);
		require(acceptedOfferId != -1);
		require(offers[uint(acceptedOfferId)].expenditures[expenditureId].principal >= value);
		require(offers[uint(acceptedOfferId)].expenditures[expenditureId].potentialExecutors[to]);

		if (token.transfer(to, value))
		{
			contributed -= value;
			offers[uint(acceptedOfferId)].expenditures[expenditureId].principal -= value;
			Spend(uint(acceptedOfferId), expenditureId, to, value);
		}
	}

	uint contributed;

	uint startDate;	

	uint lastDate;

	address creator;

	address regulator;

	mapping (uint => Offer) offers;

	uint currentOfferId;

	int acceptedOfferId = -1;

	TenderState public state;

	TWCoin public token;
}