"use client";
import { useEffect, useState } from "react";
import BuyButton from "./BuyButton";
import { NFT_MARKETPLACE_ABI } from "../abi/NFTMarketplace";
import { MARKETPLACE_ADDRESS } from "../config";


interface Listing { seller: string; nft: string; tokenId: bigint; price: bigint; active: boolean; }


export default function ListingsGrid() {
const [listings, setListings] = useState<{ id: bigint; data: Listing }[]>([]);


useEffect(() => {
(async () => {
if (!(window as any).ethereum) return;
const provider = new (window as any).ethers.BrowserProvider((window as any).ethereum);
const mp = new (window as any).ethers.Contract(MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, provider);
const nextId: bigint = await mp.nextListingId();
const arr: { id: bigint; data: Listing }[] = [];
for (let i = 0n; i < nextId; i++) {
const data: Listing = await mp.getListing(i);
if (data.active) arr.push({ id: i, data });
}
setListings(arr);
})();
}, []);


return (
<div className="grid gap-4">
{listings.length === 0 && <div>Нет активных листингов.</div>}
{listings.map(({ id, data }) => (
<div key={id.toString()} className="border p-4 rounded flex items-center justify-between">
<div>
<div className="text-sm text-gray-600">Listing #{id.toString()}</div>
<div>Seller: {data.seller}</div>
<div>TokenId: {data.tokenId.toString()}</div>
<div>Price: {(Number(data.price) / 1e18).toString()} ETH</div>
</div>
<BuyButton id={id} priceWei={data.price} />
</div>
))}
</div>
);
}