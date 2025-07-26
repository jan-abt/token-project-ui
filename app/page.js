// app/page.js - Server component to read deployment address, with env vars for config values

import ClientHome from './components/ClientHome';
import fs from 'fs/promises'; // Server-side import for fs
import path from 'path'; // For path resolution

// Get the absolute path to the deployment file (adjust to your workspace structure)
const deploymentFile = path.join(process.cwd(), '..', 'token-project-backend', 'ignition', 'deployments', `chain-${process.env.CHAIN_ID}`, 'deployed_addresses.json');

// Fetch token address from deployment file
async function getTokenAddress() {
  console.log('Attempting to read deployment file:', deploymentFile);
  try {
    await fs.access(deploymentFile); // Check if file exists
    const data = await fs.readFile(deploymentFile, 'utf8');
    const addresses = JSON.parse(data);
    console.log('Deployment addresses:', addresses);
    return addresses["MyTokenModule#MyToken"] || '0x0000000000000000000000000000000000000000'; // Use env var as fallback
  } catch (error) {
    console.error('Error reading deployment file:', error.message);
    return process.env.TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000'; // Fallback from env
  }
}

export default async function Home() {
  const tokenAddress = await getTokenAddress(); // Fetch address server-side
  const providerUrl = process.env.PROVIDER_URL; // From env
  const chainId = process.env.CHAIN_ID; // From env

  console.log(`Final values - tokenAddress: ${tokenAddress}, providerUrl: ${providerUrl}, chainId: ${chainId}`);
  return (
    <div className="container">
      <ClientHome tokenAddress={tokenAddress} providerUrl={providerUrl} chainId={chainId} /> {/* Pass dynamic values to client component */}
    </div>
  );
}