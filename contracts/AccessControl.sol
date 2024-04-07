// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract AccessControl {
    address private owner;
    mapping(address => bool) public admins;

    constructor() {
        owner = msg.sender; 
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || owner == msg.sender, "Only admin or owner");
        _;
    }

    function addAdmin(address _user) public onlyOwner {
        admins[_user] = true;
    }

    function removeAdmin(address _user) public onlyOwner {
        admins[_user] = false;
    }

    function getOwnerAddress() public view onlyAdmin returns (address)   {
        return owner;
    }

    function changeOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }
}
