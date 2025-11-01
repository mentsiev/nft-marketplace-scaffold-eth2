// SPDX-License-Identifier: MIT
struct Listing {
address seller;
address nft;
uint256 tokenId;
uint256 price; // в wei
bool active;
}


uint256 public nextListingId;
mapping(uint256 => Listing) public listings; // id => Listing


event Listed(uint256 indexed id, address indexed seller, address indexed nft, uint256 tokenId, uint256 price);
event Cancelled(uint256 indexed id);
event Purchased(uint256 indexed id, address indexed buyer);


/**
* @notice Выставить NFT на продажу.
* @param nft адрес контракта ERC721
* @param tokenId id токена
* @param price цена в wei (>0)
*/
function list(address nft, uint256 tokenId, uint256 price) external nonReentrant {
require(price > 0, "Price must be > 0");


// Переводим NFT в эскроу маркетплейса
IERC721(nft).safeTransferFrom(msg.sender, address(this), tokenId);


uint256 id = nextListingId++;
listings[id] = Listing({
seller: msg.sender,
nft: nft,
tokenId: tokenId,
price: price,
active: true
});


emit Listed(id, msg.sender, nft, tokenId, price);
}


/**
* @notice Отменить листинг (только владелец листинга).
*/
function cancel(uint256 id) external nonReentrant {
Listing storage lst = listings[id];
require(lst.active, "Not active");
require(lst.seller == msg.sender, "Not seller");


lst.active = false;
IERC721(lst.nft).safeTransferFrom(address(this), lst.seller, lst.tokenId);
emit Cancelled(id);
}


/**
* @notice Купить NFT. Отправьте ровно `price` wei.
*/
function buy(uint256 id) external payable nonReentrant {
Listing storage lst = listings[id];
require(lst.active, "Not active");
require(msg.value == lst.price, "Wrong price");


lst.active = false;


//  Оплата продавцу
(bool ok, ) = payable(lst.seller).call{value: msg.value}("");
require(ok, "Payment failed");


//  Передача NFT покупателю
IERC721(lst.nft).safeTransferFrom(address(this), msg.sender, lst.tokenId);


emit Purchased(id, msg.sender);
}


function getListing(uint256 id) external view returns (Listing memory) {
return listings[id];
}

