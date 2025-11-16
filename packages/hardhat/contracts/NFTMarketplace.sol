// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ReentrancyGuard, Ownable {
    struct Listing {
        address seller;
        address nft;
        uint256 tokenId;
        uint256 price; // in wei
        bool active;
    }

    uint256 public nextListingId;
    mapping(uint256 => Listing) public listings; // id => Listing

    event Listed(
        uint256 indexed id,
        address indexed seller,
        address indexed nft,
        uint256 tokenId,
        uint256 price
    );

    event Cancelled(uint256 indexed id);
    event Purchased(uint256 indexed id, address indexed buyer);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Выставить NFT на продажу. NFT уходит в эскроу (этот контракт).
     * @param nft адрес контракта ERC721
     * @param tokenId id токена
     * @param price цена в wei
     */
    function list(address nft, uint256 tokenId, uint256 price) external nonReentrant {
        require(price > 0, "Price must be > 0");
        require(nft != address(0), "Invalid NFT");

        // Продавец должен сделать approve этому контракту для tokenId до вызова
        IERC721(nft).transferFrom(msg.sender, address(this), tokenId);

        listings[nextListingId] = Listing({
            seller: msg.sender,
            nft: nft,
            tokenId: tokenId,
            price: price,
            active: true
        });

        emit Listed(nextListingId, msg.sender, nft, tokenId, price);
        nextListingId++;
    }

    /**
     * @notice Отменить листинг и вернуть NFT продавцу.
     */
    function cancel(uint256 id) external nonReentrant {
        Listing storage lst = listings[id];
        require(lst.active, "Listing inactive");
        require(lst.seller == msg.sender, "Not seller");

        lst.active = false;

        IERC721(lst.nft).transferFrom(address(this), lst.seller, lst.tokenId);
        emit Cancelled(id);
    }

    /**
     * @notice Купить NFT из листинга.
     */
    function buy(uint256 id) external payable nonReentrant {
        Listing storage lst = listings[id];
        require(lst.active, "Listing inactive");
        require(msg.value == lst.price, "Wrong price");

        lst.active = false;

        // платим продавцу
        (bool sent, ) = payable(lst.seller).call{value: msg.value}("");
        require(sent, "Payment failed");

        // переводим NFT покупателю
        IERC721(lst.nft).transferFrom(address(this), msg.sender, lst.tokenId);

        emit Purchased(id, msg.sender);
    }

    function getListing(uint256 id) external view returns (Listing memory) {
        return listings[id];
    }

    /**
     * @notice Аварийное изъятие NFT владельцем контракта.
     */
    function rescueNFT(address nft, uint256 tokenId, address to) external onlyOwner {
        IERC721(nft).transferFrom(address(this), to, tokenId);
    }
}
