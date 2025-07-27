// app/components/ClientHome.js
'use client';

import TokenInfo from './TokenInfo';
import { useState, useEffect } from 'react';

export default function ClientHome({ chain }) { // Receive chain prop
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (chain) {
      console.log(`Client-side: Selected chain: ${chain.name}, token: ${chain.tokenAddress}`);
    }
  }, [chain]);

  const handleConnectionChange = (connected) => {
    setIsConnected(connected);
  };

  return (
    <>
      <h1>
        <span className="icon">{isConnected ? '📊' : '💼'}</span>
        {isConnected ? 'My Dashboard' : 'Token Wallet'}
      </h1>
      <TokenInfo 
        onConnectionChange={handleConnectionChange} 
        chain={chain} // Pass chain to TokenInfo
      />
    </>
  );
}