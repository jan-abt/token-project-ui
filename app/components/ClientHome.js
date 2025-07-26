// app/components/ClientHome.js - Client component for state and rendering, receives tokenAddress prop

'use client'; // Enable client-side rendering

import TokenInfo from './TokenInfo';
import { useState } from 'react';

export default function ClientHome({ tokenAddress, providerUrl, chainId }) {
  const [isConnected, setIsConnected] = useState(false);

  // Callback to update connection state from TokenInfo
  const handleConnectionChange = (connected) => {
    setIsConnected(connected);
  };

  // const PROVIDER_URL = 'http://127.0.0.1:8545'; // Local Hardhat node
  // const HARDHAT_CHAIN_ID = '0x7a69'; // Chain ID 31337 in hex

  return (
    <>
      <h1>
        <span className="icon">{isConnected ? '📊' : '💼'}</span>
        {isConnected ? 'My Dashboard' : 'Token Wallet'}
      </h1>
      <TokenInfo 
        onConnectionChange={handleConnectionChange} 
        tokenAddress={tokenAddress}
        providerUrl={providerUrl}
        chainId={chainId}
      />
    </>
  );
}