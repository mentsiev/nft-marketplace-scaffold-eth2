"use client";
import { useState } from "react";
import { TEST_NFT_ABI } from "../abi/TestNFT";
import { TESTNFT_ADDRESS } from "../config";


export default function MintForm() {
const [uri, setUri] = useState("");


async function mint() {
if (!(window as any).ethereum) return alert("Установите MetaMask");
const [from] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
const provider = new (window as any).ethers.BrowserProvider((window as any).ethereum);
const signer = await provider.getSigner();
const contract = new (window as any).ethers.Contract(TESTNFT_ADDRESS, TEST_NFT_ABI, signer);
const tx = await contract.mint(uri);
await tx.wait();
alert("NFT minted!");
}


return (
<div className="border p-4 rounded mb-4">
<h3 className="font-semibold mb-2">Mint TestNFT</h3>
<input className="border p-2 mr-2 w-96" placeholder="ipfs://..." value={uri} onChange={e => setUri(e.target.value)} />
<button className="px-4 py-2 border rounded" onClick={mint}>Mint</button>
</div>
);
}