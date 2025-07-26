// app/page.js - Server component to read deployment address and pass to client component

import ClientHome from './components/ClientHome';
import fs from 'fs/promises'; // Server-side import for fs
import path from 'path'; // For path resolution

// Get the absolute path to the deployment file (adjust to your workspace structure)
const deploymentFile = path.join(process.cwd(), '..', 'token-project-backend', 'ignition', 'deployments', 'chain-11155111', 'deployed_addresses.json');

async function getTokenAddress() {
  try {
    // Check if file exists to avoid ENOENT error
    await fs.access(deploymentFile); // Throws if file doesn't exist
    const data = await fs.readFile(deploymentFile, 'utf8');
    const addresses = JSON.parse(data);
    return addresses["MyTokenModule#MyToken"] || '0x0000000000000000000000000000000000000000'; // Fallback if key missing
  } catch (error) {
    console.error('Error reading deployment file:', error);
    return '0x0000000000000000000000000000000000000000'; // Fallback address if file not found or invalid
  }
}

export default async function Home() {
  const tokenAddress = await getTokenAddress(); // Fetch address server-side

  return (
    <div className="container">
      <ClientHome tokenAddress={tokenAddress} /> {/* Pass dynamic address to client component */}
    </div>
  );
}