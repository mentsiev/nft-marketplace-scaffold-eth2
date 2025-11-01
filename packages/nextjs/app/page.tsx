"use client";
import dynamic from "next/dynamic";
import ConnectWallet from "../src/components/ConnectWallet";
import MintForm from "../src/components/MintForm";
import ListForm from "../src/components/ListForm";
import ListingsGrid from "../src/components/ListingsGrid";


// ethers не всегда доступен на сервере, подхватим его из window
if (typeof window !== "undefined" && !(window as any).ethers) {
// @ts-ignore
import("ethers").then(mod => ((window as any).ethers = mod));
}


export default function Page() {
return (
<main className="max-w-3xl mx-auto p-6">
<h1 className="text-2xl font-bold mb-4">NFT Marketplace (Scaffold-ETH 2)</h1>
<ConnectWallet />
<MintForm />
<ListForm />
<h3 className="font-semibold mt-6 mb-2">Активные листинги</h3>
<ListingsGrid />
</main>
);
}