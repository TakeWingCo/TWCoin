pragma solidity ^0.4.17;


contract Owned
{
    address public owner;

    modifier onlyOwner
	{
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner
	{
        owner = newOwner;
    }
}