// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.23;

// contract MultiSig {
//   address[] public owners;
//   mapping(address account => bool isOwner) public isOwner; 
//   uint public numConfirmationsRequired = 2;

//   struct Transaction {
//     address to;
//     uint value;
//     bytes data;
//     bool executed;
//     uint numConfirmations;
//   }

//   mapping(uint txIndex => mapping(address owner => bool isConfirmed)) public isConfirmed; 
//   Transaction[] public transactions;

//   modifier onlyOwner() {
//     require(isOwner[msg.sender], "Only owner");
//     _;
//   }

//   receive() external payable {
//   }

//    function submitTransaction(address _to, uint _value, bytes memory _data) public onlyOwner {
//         uint txIndex = transactions.length;

//         transactions.push(
//             Transaction({
//                 to: _to,
//                 value: _value,
//                 data: _data,
//                 executed: false,
//                 numConfirmations: 0
//             })
//         );
//     }

//     function confirmTransaction(uint _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) {
//         Transaction storage transaction = transactions[_txIndex];
//         transaction.numConfirmations += 1;
//         isConfirmed[_txIndex][msg.sender] = true;
//     }

//     function executeTransaction(uint _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
//         Transaction storage transaction = transactions[_txIndex];

//         require(
//             transaction.numConfirmations >= numConfirmationsRequired,
//             "cannot execute tx"
//         );

//         transaction.executed = true;

//         (bool success, ) = transaction.to.call{value: transaction.value}(
//             transaction.data
//         );
//         require(success, "tx failed");
//     }
// }
