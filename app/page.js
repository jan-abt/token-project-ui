// app/page.js - Server component to read deployment address and Hardhat config values, pass to client component

import ClientHome from './components/ClientHome';
import fs from 'fs/promises'; // Server-side import for fs
import path from 'path'; // For path resolution

// Get the absolute path to the deployment file (adjust to your workspace structure)
const deploymentFile = path.join(process.cwd(), '..', 'token-project-backend', 'ignition', 'deployments', 'chain-11155111', 'deployed_addresses.json');

// Get the absolute path to hardhat.config.js
const hardhatConfigFile = path.join(process.cwd(), '..', 'token-project-backend', 'hardhat.config.js');

// Fetch token address from deployment file
async function getTokenAddress() {
  try {
    await fs.access(deploymentFile); // Check if file exists
    const data = await fs.readFile(deploymentFile, 'utf8');
    const addresses = JSON.parse(data);
    return addresses["MyTokenModule#MyToken"] || '0x0000000000000000000000000000000000000000'; // Fallback if key missing
  } catch (error) {
    console.error('Error reading deployment file:', error);
    return '0x0000000000000000000000000000000000000000'; // Fallback address
  }
}

// Fetch values from hardhat.config.js
function getHardhatConfigValues() {
  try {
    const config = require(hardhatConfigFile); // Require the config file
    const sepoliaConfig = config.networks.sepolia;
    const infuraApiKey = sepoliaConfig.url.match(/\/v3\/(.+)/)[1]; // Extract key from URL (for demonstration; avoid exposing)
    const providerUrl = sepoliaConfig.url; // Full RPC URL
    const chainId = sepoliaConfig.chainId.toString(16); // Convert to hex with '0x'
    return { infuraApiKey, providerUrl, chainId: `0x${chainId}` };
  } catch (error) {
    console.error('Error reading hardhat.config.js:', error);
    return {
      infuraApiKey: 'fallback_key', // Fallback (use env vars in production)
      providerUrl: 'https://sepolia.infura.io/v3/fallback_key',
      chainId: '0xaa36a7'
    };
  }
}

export default async function Home() {
  const tokenAddress = await getTokenAddress(); // Fetch address server-side
  const { providerUrl, chainId } = getHardhatConfigValues(); // Fetch config values

  return (
    <div className="container">
      <ClientHome tokenAddress={tokenAddress} providerUrl={providerUrl} chainId={chainId} /> {/* Pass dynamic values to client component */}
    </div>
  );
}