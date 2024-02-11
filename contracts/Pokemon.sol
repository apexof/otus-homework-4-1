// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract Pokemon is ERC721, Ownable {
    uint256 private _nextTokenId;
    using Strings for uint256;

    constructor()
        ERC721("Pokemon", "PKMN")
        Ownable(msg.sender)
    {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string.concat(baseURI, tokenId.toString(), ".json") : "";
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://raw.githubusercontent.com/apexof/pokemons/main/json/";
    }
}
