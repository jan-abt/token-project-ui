// app/config/chains.js
export const chains = {
  hardhat: {
    id: process.env.NEXT_PUBLIC_CHAIN_ID, // '0x7a69' in hex
    name: 'Hardhat',
    rpc: 'http://127.0.0.1:8545',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    tokenAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS
  },
  sepolia: {
    id: process.env.NEXT_PUBLIC_CHAIN_ID, // '0xaa36a7' in hex
    name: 'Sepolia',
    rpc: process.env.NEXT_PUBLIC_PROVIDER_URL,
    nativeCurrency: { name: 'Ether', symbol: 'SepoliaETH', decimals: 18 },
    tokenAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS
  },
  // Add more networks as needed, e.g., mainnet
};