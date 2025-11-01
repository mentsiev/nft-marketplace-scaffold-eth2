// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
* @title TestNFT
* @dev Простой ERC721 с публичным mint для демонстрации маркетплейса.
*/
contract TestNFT is ERC721URIStorage, Ownable {
uint256 private _tokenId;


constructor() ERC721("TestNFT", "TNFT") {}


function mint(string memory tokenURI_) external returns (uint256) {
uint256 newId = _tokenId++;
_safeMint(msg.sender, newId);
_setTokenURI(newId, tokenURI_);
return newId;
}
}