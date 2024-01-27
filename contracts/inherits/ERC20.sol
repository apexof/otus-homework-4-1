// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IERC20, IERC20Errors} from '../../interfaces/ERC20/IERC20.sol';

contract ERC20Token is IERC20, IERC20Errors {
  uint256 public totalSupply;
  address private owner;

  mapping(address account => uint256 balance) public balanceOf;
  mapping(address owner => mapping(address spender => uint256 value)) public allowance;

  constructor (uint256 _totalSupply) {
    owner = msg.sender;
    totalSupply = _totalSupply;
    balanceOf[owner] = _totalSupply;
  }

  function approve(address spender, uint256 value) external returns (bool){
    allowance[msg.sender][spender] = value;
    emit Approval(msg.sender, spender, value);
    return true;
  }

  function transfer(address to, uint256 value) external returns (bool){
    uint256 senderBalance = balanceOf[msg.sender];
    if(value > senderBalance){
      revert ERC20InsufficientBalance(msg.sender, senderBalance, value);
    }
    balanceOf[msg.sender] -= value;
    balanceOf[to] += value;
    if(to == address(0)){
      totalSupply -= value;
    }
    emit Transfer(msg.sender, to, value);

    return true;
  }

  function transferFrom(address from, address to, uint256 value) external returns (bool){
    address spender = msg.sender;
    uint _allowance = allowance[from][spender];
    if(value > _allowance){
      revert ERC20InsufficientAllowance(spender, _allowance, value);
    }
    if(value > balanceOf[from]){
      revert ERC20InsufficientBalance(from, balanceOf[from], value);
    }
    allowance[from][spender] -= value;
    balanceOf[from] -= value;
    balanceOf[to] += value;
    if(to == address(0)){
      totalSupply -= value;
    }
    emit Transfer(from, to, value);

    return true;
  }

  modifier onlyOwner {
    require(msg.sender == owner, 'Only owner can do this!');
    _;
  }

  function mint(uint256 value) public onlyOwner {
    balanceOf[owner] += value;
    totalSupply += value;

    emit Transfer(address(0), owner, value);
  }

    function mint(uint256 value, address to) public onlyOwner {
    balanceOf[to] += value;
    totalSupply += value;

    emit Transfer(address(0), to, value);
  }

  function burn(uint256 value) public onlyOwner {
    address sender = msg.sender;
    uint256 senderBalance = balanceOf[sender];

    if(value > senderBalance){
      revert ERC20InsufficientBalance(sender, senderBalance, value);
    }

    balanceOf[sender] -= value;
    totalSupply -= value;
  }
}