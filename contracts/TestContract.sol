// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract TestContract {
  uint public i;

  function callMe(uint j) public {
    i += j;
  }
}