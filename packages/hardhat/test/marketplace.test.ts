import { expect } from "chai";
import { ethers, deployments } from "hardhat";


describe("NFTMarketplace", function () {
beforeEach(async () => {
await deployments.fixture(["NFTMarketplace", "TestNFT"]);
});


it("should list and buy NFT", async () => {
const [seller, buyer] = await ethers.getSigners();


const nft = await ethers.getContract("TestNFT", seller);
const mp = await ethers.getContract("NFTMarketplace", seller);


// mint NFT
const mintTx = await nft.connect(seller).mint("ipfs://demo-uri");
await mintTx.wait();


const tokenId = 0; // первый токен


// approve не нужен, т.к. мы safeTransferFrom в маркетплейс вызываем из контракта…
// но мы переводим NFT внутрь маркетплейса через list() — он сам вызывает safeTransferFrom


const price = ethers.parseEther("0.01");


const listTx = await mp.connect(seller).list(await nft.getAddress(), tokenId, price);
await listTx.wait();


// buy from buyer
const mpBuyer = mp.connect(buyer);
const buyTx = await mpBuyer.buy(0, { value: price });
await buyTx.wait();


expect(await nft.ownerOf(tokenId)).to.equal(buyer.address);
});


it("seller can cancel listing", async () => {
const [seller] = await ethers.getSigners();
const nft = await ethers.getContract("TestNFT", seller);
const mp = await ethers.getContract("NFTMarketplace", seller);


await (await nft.mint("ipfs://demo"))!.wait();
const price = ethers.parseEther("0.01");


await (await mp.list(await nft.getAddress(), 0, price))!.wait();
await (await mp.cancel(0))!.wait();


expect(await nft.ownerOf(0)).to.equal(seller.address);
});
});