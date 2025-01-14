// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract MultiSigWallet {
    mapping(address user => bool isOwner) public isOwner;
    uint public numConfirmationsRequired = 2;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
    }

    Transaction[] public transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    constructor(address owner2) {
      isOwner[msg.sender] = true;
      isOwner[owner2] = true;
    }

    receive() external payable {
    }

    function addTransaction(address _to, uint _value, bytes memory _data) public onlyOwner returns(uint txIndex)  {
      transactions.push(
        Transaction({
          to: _to,
          value: _value,
          data: _data,
          executed: false,
          numConfirmations: 0
        })
      );

      return transactions.length - 1;
    }

    function confirmTransaction(uint _txIndex) public onlyOwner {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
    }

    function executeTransaction(uint _txIndex) public onlyOwner {
        Transaction storage transaction = transactions[_txIndex];
        require(transaction.numConfirmations >= numConfirmationsRequired, "cannot execute tx");
        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "tx failed");
    }

    function getTransaction(uint _txIndex) public view returns (Transaction memory){
        return transactions[_txIndex];        
    }
}
