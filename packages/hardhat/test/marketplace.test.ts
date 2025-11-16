import { expect } from "chai";
import { ethers, deployments } from "hardhat";

describe("NFTMarketplace", function () {
  // Перед каждым тестом прогоняем все deploy-скрипты
  beforeEach(async () => {
    await deployments.fixture(); // поднимет NFTMarketplace и TestNFT по deploy-скриптам
  });

  it("should list and buy NFT", async () => {
    const [seller, buyer] = await ethers.getSigners();

    // Получаем инфу о деплое контрактов
    const nftDeployment = await deployments.get("TestNFT");
    const mpDeployment = await deployments.get("NFTMarketplace");

    // Получаем инстансы контрактов через адреса
    const nft = await ethers.getContractAt("TestNFT", nftDeployment.address, seller);
    const mp = await ethers.getContractAt("NFTMarketplace", mpDeployment.address, seller);

    // mint NFT продавцу
    const mintTx = await nft.mint("ipfs://demo-uri");
    await mintTx.wait();

    const tokenId = 0;
    const price = ethers.parseEther("0.01");

    // продаемому контракту даём право забирать NFT
    await nft.approve(mpDeployment.address, tokenId);

    // list NFT на маркетплейсе
    const listTx = await mp.list(await nft.getAddress(), tokenId, price);
    await listTx.wait();

    // покупатель покупает
    const mpBuyer = await ethers.getContractAt("NFTMarketplace", mpDeployment.address, buyer);
    const buyTx = await mpBuyer.buy(0, { value: price });
    await buyTx.wait();

    // проверяем, что владелец NFT стал buyer
    expect(await nft.ownerOf(tokenId)).to.equal(buyer.address);
  });

  it("seller can cancel listing", async () => {
    const [seller] = await ethers.getSigners();

    const nftDeployment = await deployments.get("TestNFT");
    const mpDeployment = await deployments.get("NFTMarketplace");

    const nft = await ethers.getContractAt("TestNFT", nftDeployment.address, seller);
    const mp = await ethers.getContractAt("NFTMarketplace", mpDeployment.address, seller);

    // mint + list
    await (await nft.mint("ipfs://demo-uri")).wait();
    const price = ethers.parseEther("0.01");

    await nft.approve(mpDeployment.address, 0);

    // даём маркетплейсу право забирать токен 0
    await (await mp.list(await nft.getAddress(), 0, price)).wait();

    // cancel
    await (await mp.cancel(0)).wait();

    // владелец NFT снова seller
    expect(await nft.ownerOf(0)).to.equal(seller.address);

    // листинг помечен как неактивный
    const listing = await mp.getListing(0);
    expect(listing.active).to.equal(false);
  });
});
