"use client";
import { NFT_MARKETPLACE_ABI } from "../abi/NFTMarketplace";
import { MARKETPLACE_ADDRESS } from "../config";


export default function BuyButton({ id, priceWei }: { id: bigint; priceWei: bigint }) {
async function buy() {
if (!(window as any).ethereum) return alert("Установите MetaMask");
const provider = new (window as any).ethers.BrowserProvider((window as any).ethereum);
const signer = await provider.getSigner();
const mp = new (window as any).ethers.Contract(MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, signer);
const tx = await mp.buy(id, { value: priceWei });
await tx.wait();
alert("Purchased!");
}


return <button className="px-3 py-1 border rounded" onClick={buy}>Buy</button>;
}