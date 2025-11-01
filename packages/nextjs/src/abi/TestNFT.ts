export const TEST_NFT_ABI = [
{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
{ "inputs": [{"internalType":"string","name":"tokenURI_","type":"string"}], "name":"mint", "outputs":[{"internalType":"uint256","name":"","type":"uint256"}], "stateMutability":"nonpayable", "type":"function" },
{ "inputs": [{"internalType":"uint256","name":"tokenId","type":"uint256"}], "name":"ownerOf", "outputs":[{"internalType":"address","name":"","type":"address"}], "stateMutability":"view", "type":"function" },
{ "inputs": [], "name": "name", "outputs": [{"internalType":"string","name":"","type":"string"}], "stateMutability":"view", "type":"function" },
{ "inputs": [], "name": "symbol", "outputs": [{"internalType":"string","name":"","type":"string"}], "stateMutability":"view", "type":"function" }
] as const;