// app/components/TokenInfo.js - Component to display token properties and account balance with a Connect Wallet button, plus token transfer functionality

'use client'; // Enable client-side rendering for wallet interactions

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Extended ERC-20 ABI (includes name, symbol, totalSupply, balanceOf, and transfer)
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)"
];

export default function TokenInfo({ onConnectionChange, chain }) {

  // In TokenInfo.js (replace the existing hexedChainId block)
  const hexed = (chainId) => 
    chainId == null
    ? '0x7a69'  // Default to Hardhat chain ID (31337 in hex) as fallback
    : typeof chainId === 'number'
      ? '0x' + chainId.toString(16)
      : typeof chainId === 'string' && chainId.startsWith('0x')
        ? chainId
        : '0x' + parseInt(chainId, 10).toString(16);


  // Use chain directly
  const providerUrl = chain.rpc;
  const tokenAddress = chain.tokenAddress;
  const hexedChainId = hexed(chain.id)

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null); // State for signer (for transactions)
  const [account, setAccount] = useState(null);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [balance, setBalance] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recipient, setRecipient] = useState(''); // State for recipient address
  const [amount, setAmount] = useState(''); // State for transfer amount
  const [isTransferring, setIsTransferring] = useState(false); // State for transfer in progress
  const [transferMessage, setTransferMessage] = useState(''); // State for transfer success/error message

  // Select MetaMask provider if multiple wallets are installed
  const getEthereumProvider = () => {
    if (!window.ethereum) {
      return null;
    }
    if (window.ethereum.providers) {
      const metaMaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
      return metaMaskProvider || window.ethereum;
    }
    return window.ethereum.isMetaMask ? window.ethereum : null;
  };

  // Handle wallet connection
  const connectWallet = async () => {
    setErrorMessage('');
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      setErrorMessage('Please install or enable MetaMask. Other wallets like Phantom may not be fully compatible.');
      return;
    }

    setIsConnecting(true);
    try {
      const ethChainId =
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: hexedChainId,
            chainName: chain.name,
            rpcUrls: [providerUrl],
            nativeCurrency: chain.nativeCurrency,
            blockExplorerUrls: null, // Or add if available, e.g., ['https://sepolia.etherscan.io']
          }],
        });


      if (ethChainId !== hexedChainId) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexedChainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7a69', // Chain ID 31337 in hex
                chainName: 'Hardhat Local',
                rpcUrls: [providerUrl],
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                blockExplorerUrls: null,
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const browserProvider = new ethers.BrowserProvider(ethereum);
      const browserSigner = await browserProvider.getSigner(); // Get signer for transactions
      setProvider(browserProvider);
      setSigner(browserSigner);
      setAccount(accounts[0]);
      onConnectionChange(true); // Notify parent of connection

      ethereum.on('accountsChanged', (newAccounts) => {
        setAccount(newAccounts[0] || null);
        onConnectionChange(!!newAccounts[0]); // Update connection state
        if (!newAccounts[0]) {
          setTokenName('');
          setTokenSymbol('');
          setTotalSupply('');
          setBalance('');
        }
      });

      ethereum.on('chainChanged', (newChainId) => {
        if (newChainId !== HARDHAT_CHAIN_ID) {
          setErrorMessage('Please switch to the Hardhat network (chain ID 31337).');
          setAccount(null);
          setProvider(null);
          onConnectionChange(false);
        }
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setErrorMessage('Failed to connect wallet. Ensure MetaMask is set to Hardhat network (chain ID 31337).');
    } finally {
      setIsConnecting(false);
    }
  };

  // Fetch token data when provider and account are available
  useEffect(() => {
    const fetchTokenData = async () => {
      if (provider && account) {
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider); // Use dynamic tokenAddress prop
        try {
          const name = await tokenContract.name();
          setTokenName(name);
          const symbol = await tokenContract.symbol();
          setTokenSymbol(symbol);
          const supply = await tokenContract.totalSupply();
          setTotalSupply(ethers.formatEther(supply));
          const bal = await tokenContract.balanceOf(account);
          setBalance(ethers.formatEther(bal));
        } catch (error) {
          console.error('Error fetching token data:', error);
          setErrorMessage('Failed to fetch token data. Check token address and network.');
        }
      }
    };

    fetchTokenData();
  }, [provider, account, tokenAddress]); // Add tokenAddress to dependencies

  // Handle token transfer
  const handleTransfer = async () => {
    setTransferMessage('');
    setErrorMessage('');
    if (!signer || !recipient || !amount) {
      setErrorMessage('Please enter a valid recipient address and amount.');
      return;
    }

    if (!ethers.isAddress(recipient)) {
      setErrorMessage('Invalid recipient address.');
      return;
    }

    const amountInWei = ethers.parseUnits(amount, 18); // Assume 18 decimals for ERC-20
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer); // Use dynamic tokenAddress

    setIsTransferring(true);
    try {
      const tx = await tokenContract.transfer(recipient, amountInWei);
      await tx.wait(); // Wait for transaction confirmation
      setTransferMessage(`Transfer successful! Tx Hash: ${tx.hash}`);

      // Refresh balance after transfer
      const bal = await tokenContract.balanceOf(account);
      setBalance(ethers.formatEther(bal));
    } catch (error) {
      console.error('Transfer failed:', error);
      setErrorMessage('Transfer failed. Check console for details (e.g., insufficient balance or network error).');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="token-info">
      {errorMessage && <p className="error">{errorMessage}</p>}
      {!account ? (
        <div className="connect-container">
          <p>No wallet connected.</p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="connect-button"
          >
            {isConnecting ? 'Connecting...' : 'Connect with MetaMask'}
          </button>
        </div>
      ) : (
        <div className="token-details">
          <p><strong>Connected Account:</strong> {account}</p>
          <p><strong>Token Name:</strong> {tokenName}</p>
          <p><strong>Token Symbol:</strong> {tokenSymbol}</p>
          <p><strong>Total Supply:</strong> {totalSupply}</p>
          <p><strong>Your Balance:</strong> {balance}</p>

          {/* Transfer Form */}
          <div className="transfer-container">
            <h2>Send Tokens</h2>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
            />
            <button
              onClick={handleTransfer}
              disabled={isTransferring}
              className="transfer-button"
            >
              {isTransferring ? 'Transferring...' : 'Send'}
            </button>
            {transferMessage && <p className="success">{transferMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}