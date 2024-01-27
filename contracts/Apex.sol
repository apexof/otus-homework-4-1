// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract APEXToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Apexof", "APEX") {
        _mint(msg.sender, initialSupply);
    }
}