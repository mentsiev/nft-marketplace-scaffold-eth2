"use client";
import { useEffect, useState } from "react";


export default function ConnectWallet() {
const [account, setAccount] = useState<string | null>(null);


async function connect() {
if (!(window as any).ethereum) {
alert("Установите MetaMask");
return;
}
const accs = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
setAccount(accs[0]);
}


useEffect(() => {
if ((window as any).ethereum) {
(window as any).ethereum.request({ method: "eth_accounts" }).then((accs: string[]) => {
if (accs?.length) setAccount(accs[0]);
});
}
}, []);


return (
<div className="mb-4">
{account ? (
<div className="text-sm">Connected: {account}</div>
) : (
<button className="px-4 py-2 border rounded" onClick={connect}>Connect Wallet</button>
)}
</div>
);
}