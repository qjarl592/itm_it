// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721.sol";

contract Purchase {

    event PurchaseSuccess(address buyer, address seller, uint256 tokenId, uint price);

    function purchase(address buyer, address payable seller, uint256 tokenId, uint256 price, address addressOfErc721Contract) public payable {
        require(msg.value / 1 ether == price, "value must be same with price");
        require(msg.sender == buyer);
        require(msg.sender != seller, "you can't buy your own token");
        require(seller == ERC721(addressOfErc721Contract).ownerOf(tokenId));

        seller.transfer(msg.value);

        emit PurchaseSuccess(buyer, seller, tokenId, price);

        _transferFromTranction(seller, buyer, tokenId, addressOfErc721Contract);
    }

    function _transferFromTranction (
        address from,
        address to,
        uint256 tokenId,
        address addressOfErc721Contract) private {
            ERC721(addressOfErc721Contract).safeTransferFrom(from, to, tokenId);
    }
    
}