pragma solidity ^0.8.0;

import "hardhat/console.sol";

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

import "./libraries/Base64.sol";

contract PixiMint is ERC721, Ownable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  uint _numTiles;
  string private _webUrl;
  // We create a mapping from the nft's tokenId => that NFTs attributes.
  mapping(uint256 => uint) public tokenColors;

  event PixelMinted(address sender, uint256 tokenId, Pixel[] board);
  event PixelColorChanged(uint256 tokenId, uint color);

  struct Pixel {
    address owner;
    uint color;
    uint256 tokenId;
  }


  constructor(uint numTiles) ERC721("PixiMint", "PXMNT") {
    // Loop through all the characters, and save their values in our contract so
    // we can use them later when we mint our NFTs.
    _tokenIds.increment();
    for(uint i = 0; i < numTiles; i += 1) {
      tokenColors[i] = 0x000000;
    }
    _numTiles = numTiles;
    _webUrl = "https://piximint.com";
  }

  function setBaseURI(string memory url) external onlyOwner() {
    _webUrl = url;
  }

  function getBoard() public view returns (Pixel[] memory) {
    Pixel[] memory pixels = new Pixel[](_numTiles);

    for(uint i = 0; i < _numTiles; i += 1) {
      address owner;
      if (_exists(i)) {
        owner = ownerOf(i);
      }
      Pixel memory pixel = Pixel({
        owner: owner,
        color: tokenColors[i],
        tokenId: i
      });
      pixels[i] = pixel;
    }
    return pixels;
  }

  // Users would be able to hit this function and get their NFT based on the
  // characterId they send in!
  function mintPixi(uint256 tokenId) external {
    console.log("the token id", tokenId);
    // The magical function! Assigns the tokenId to the caller's wallet address.
    _safeMint(msg.sender, tokenId);
    Pixel[] memory board = getBoard();
    emit PixelMinted(msg.sender, tokenId, board);
  }

  function colorPixi(uint color, uint256 tokenId) external {
    require(color <= 0xFFFFFF, "Color out of range");
    require(ownerOf(tokenId) == msg.sender, "You do not have permissinion to alter this pixi");
    tokenColors[tokenId] = color;
    emit PixelColorChanged(tokenId, color);
  }


  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    string memory x = Strings.toString(_tokenId % 8);
    string memory y = Strings.toString(_tokenId / 8);
    uint color = tokenColors[_tokenId];
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "Pixel ', x, ',', y, '"',
            ', "description": "Piximint is a peice of collaborative artwork that lives on the Polygon blockchain. Each NFT is both the artwork itself and ownership over 1 of 64 pixels that make up the work. As a pixel owner you can choose the color of your pixel and change it at any time. To mint or modify your pixel, visit <a href=\'', _webUrl, '\'>', _webUrl, '</a>."',
            ', "external_url": "', _webUrl ,'"',
            ', "image": "', _webUrl ,'/api/image"',
            ', "attributes": [',
              '{ "display_type": "number",  "trait_type": "X coord",  "value": ', x ,'},',
              '{ "display_type": "number",  "trait_type": "Y coord",  "value": ', y ,'},',
              '{ "trait_type": "Color",  "value": ', Strings.toString(color) ,'}',
            ']}'
          )
        )
      )
    );

    string memory output = string(
      abi.encodePacked("data:application/json;base64,", json)
    );

    return output;
  }
}