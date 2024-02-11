// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {IBank} from './IBank.sol';

contract Bank is IBank {
    mapping(address account => uint256 balance) public balanceOf;
    address immutable owner;

    constructor () {
      owner = msg.sender;
    }

    modifier onlyOwner {
      require(owner == msg.sender, "Only ownder can do this");
      _;
    }

    function deposit() public payable {
      balanceOf[msg.sender] += msg.value;
      emit Deposit(msg.sender, msg.value);
    }

    receive() external payable {
      deposit();
    }

    function withdraw(uint256 amount) external{
      require(amount != 0, "Amount must be greater than zero");
      address payable client = payable(msg.sender);
      uint256 balance = balanceOf[client];
      if(amount > balance){
        revert WithdrawalAmountExceedsBalance(client, amount, balance);
      }
      unchecked{
        balanceOf[client] -= amount;
      }
      client.transfer(amount);
      emit Withdrawal(client, amount);
    } 

    function withdrawAll() external onlyOwner {
      uint256 contractBalance = address(this).balance;
      require(contractBalance != 0, "Amount must be greater than zero");
      
      address payable ownerPayable = payable(owner);
      ownerPayable.transfer(contractBalance);
      emit Withdrawal(owner, contractBalance);
    } 
}