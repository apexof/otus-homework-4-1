// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

interface INativeBank {
    error WithdrawalAmountExceedsBalance(address account, uint256 amount, uint256 balance);
    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);
    function balanceOf(address account) external view returns(uint256);
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}

contract Bank is INativeBank {
    mapping(address account => uint256 balance) public balanceOf;

    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    receive() external payable {
        deposit();
     }

    function withdraw(uint256 amount) external{
        require(amount != 0, "amount 0");
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
}