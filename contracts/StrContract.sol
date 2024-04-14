// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract StrContract {
  string public str = '';

  function setStr(string calldata _str) public {
    str = _str;
  }
}