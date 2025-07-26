// app/page.js - Server component with env vars for config values

import ClientHome from './components/ClientHome';

// Fetch token address from env var (set in Vercel or .env.local)
const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000'; // Fallback

// Fetch config values from env vars
const providerUrl = process.env.NEXT_PUBLIC_PROVIDER_URL || 'https://sepolia.infura.io/v3/fallback_key';
const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '0xaa36a7';

export default function Home() {
  console.log(`Final values - tokenAddress: ${tokenAddress}, providerUrl: ${providerUrl}, chainId: ${chainId}`);
  return (
    <div className="container">
      <ClientHome tokenAddress={tokenAddress} providerUrl={providerUrl} chainId={chainId} /> {/* Pass values to client component */}
    </div>
  );
}