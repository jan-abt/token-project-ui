// app/components/ClientHome.js - Client component for state and rendering, receives tokenAddress prop

'use client'; // Enable client-side rendering

import TokenInfo from './TokenInfo';
import { useState } from 'react';

export default function ClientHome({ tokenAddress }) {
  const [isConnected, setIsConnected] = useState(false);

  // Callback to update connection state from TokenInfo
  const handleConnectionChange = (connected) => {
    setIsConnected(connected);
  };

  return (
    <>
      <h1>
        <span className="icon">{isConnected ? '📊' : '💼'}</span>
        {isConnected ? 'My Dashboard' : 'Token Wallet'}
      </h1>
      <TokenInfo onConnectionChange={handleConnectionChange} tokenAddress={tokenAddress} />
    </>
  );
}