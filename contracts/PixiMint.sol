pragma solidity ^0.8.0;

import "hardhat/console.sol";

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Strings.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

import "./libraries/Base64.sol";

function uint2hexstr(uint i) pure returns (string memory) {
    if (i == 0) return "0";
    uint j = i;
    uint length;
    while (j != 0) {
        length++;
        j = j >> 4;
    }
    uint mask = 15;
    bytes memory bstr = new bytes(length);
    uint k = length;
    while (i != 0) {
        uint curr = (i & mask);
        bstr[--k] = curr > 9 ?
            bytes1(uint8(55 + curr)) :
            bytes1(uint8(48 + curr)); // 55 = 65 - 10
        i = i >> 4;
    }
    return string(bstr);
}

contract PixiMint is ERC721, Ownable {
  uint _numTiles;
  string private _webUrl;
  mapping(uint256 => uint) public tokenColors;

  event PixelMinted(address sender, uint256 tokenId, Pixel[] board);
  event PixelColorChanged(uint256 tokenId, uint color);

  struct Pixel {
    address owner;
    uint color;
    uint256 tokenId;
  }

  constructor(uint numTiles) ERC721("PixiMint", "PXMNT") {
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

  function mintPixi(uint256 tokenId) external {
    require(tokenId < _numTiles, "Invalid token number");
    _safeMint(msg.sender, tokenId);
    Pixel[] memory board = getBoard();
    emit PixelMinted(msg.sender, tokenId, board);
  }

  function colorPixi(uint color, uint256 tokenId) external {
    require(color < 0xFFFFFF, "Color out of range");
    require(ownerOf(tokenId) == msg.sender, "You do not have permission to alter this pixel");
    tokenColors[tokenId] = color;
    emit PixelColorChanged(tokenId, color);
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    string memory x = Strings.toString(_tokenId % 8);
    string memory y = Strings.toString(_tokenId / 8);
    string memory color = uint2hexstr(tokenColors[_tokenId]);
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "Pixel ', x, ',', y, '"',
            ', "description": "Piximint is a piece of collaborative artwork that lives on the Ethereum/Polygon network. Each NFT is both the artwork itself and ownership over 1 of 64 pixels that make up the work. As a pixel owner you can choose the color of your pixel and change it at any time. To mint or modify your pixel, visit <a href=\'', _webUrl, '\'>', _webUrl, '</a>."',
            ', "external_url": "', _webUrl ,'"',
            ', "image": "', _webUrl ,'/api/image"',
            ', "attributes": [',
              '{ "display_type": "number",  "trait_type": "X coord",  "value": ', x ,'},',
              '{ "display_type": "number",  "trait_type": "Y coord",  "value": ', y ,'},',
              '{ "trait_type": "Color", "value": ', color ,'}',
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