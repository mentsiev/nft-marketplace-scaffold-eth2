"use client";
import { useState } from "react";
import { NFT_MARKETPLACE_ABI } from "../abi/NFTMarketplace";
import { MARKETPLACE_ADDRESS, TESTNFT_ADDRESS } from "../config";


export default function ListForm() {
const [tokenId, setTokenId] = useState("");
const [priceEth, setPriceEth] = useState("");


async function list() {
if (!(window as any).ethereum) return alert("Установите MetaMask");
const provider = new (window as any).ethers.BrowserProvider((window as any).ethereum);
const signer = await provider.getSigner();


// Перевод в эскроу делает сам контракт list() через safeTransferFrom, поэтому approve не нужен.
const mp = new (window as any).ethers.Contract(MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, signer);
const price = (window as any).ethers.parseEther(priceEth || "0");


const tx = await mp.list(TESTNFT_ADDRESS, BigInt(tokenId), price);
await tx.wait();
alert("Listed!");
}


return (
<div className="border p-4 rounded mb-4">
<h3 className="font-semibold mb-2">List NFT</h3>
<input className="border p-2 mr-2 w-48" placeholder="tokenId" value={tokenId} onChange={e => setTokenId(e.target.value)} />
<input className="border p-2 mr-2 w-48" placeholder="price (ETH)" value={priceEth} onChange={e => setPriceEth(e.target.value)} />
<button className="px-4 py-2 border rounded" onClick={list}>List</button>
</div>
);
}