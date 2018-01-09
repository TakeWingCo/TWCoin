pragma solidity ^0.4.17;


import "../Organizations/Voters.sol";


contract TransferMatrix
{
	function TransferMatrix(address votingContract) public
	{
		votersContract = Voters(votingContract);
	}

	function canTransfer(address from, address to) public constant returns (uint)
	{

	}

	Voters public votersContract;
}