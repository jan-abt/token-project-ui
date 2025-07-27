# MyToken dApp

A full-stack decentralized application (dApp) featuring an ERC-20 token smart contract (`MyToken`) deployed via Hardhat, and a Next.js frontend for wallet connection, token info display, and transfers using MetaMask and ethers.js.

## Overview
- **Smart Contract**: Basic ERC-20 token with transfer, approve, and allowance functions. Deployable to local Hardhat node (dev) or Sepolia testnet (prod).
- **Frontend**: Next.js app that connects to MetaMask, fetches token data, displays balance/supply, and enables transfers.
- **Tech Stack**: Solidity (0.8.30), Hardhat (with Ignition for deployments), Next.js, React, ethers.js.
- **Environments**: Dev (local Hardhat, chain ID 31337) and Prod (Sepolia, chain ID 11155111).

## Prerequisites
- Node.js (v18+ recommended)
- MetaMask browser extension (for wallet interactions)
- For Sepolia deployment: Infura API key and a funded Sepolia test account private key (exported from MetaMask).

## Setup
1. **Install Dependencies**:
   ```
   npm install
   ```
   This installs all required packages for both frontend (Next.js, ethers) and backend (Hardhat, @nomicfoundation/hardhat-ignition-ethers).

2. **Set Environment Variables**:
   Create a `.env.local` file in the root directory (for local overrides) and add the following variables. These are used by the Next.js frontend to configure the token address, RPC provider, and chain ID.
   ```
   NEXT_PUBLIC_TOKEN_ADDRESS=0xYourDeployedTokenAddressHere  # Update after deployment
   NEXT_PUBLIC_PROVIDER_URL=http://127.0.0.1:8545  # For dev; change to Infura URL for prod
   NEXT_PUBLIC_CHAIN_ID=31337  # For dev (Hardhat); 11155111 for Sepolia
   ```
   - For dev: Use the defaults above.
   - For prod: Update `NEXT_PUBLIC_PROVIDER_URL` to your Infura Sepolia endpoint (e.g., `https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY`), and set `NEXT_PUBLIC_CHAIN_ID=11155111`.
   - Additionally, for Hardhat config (in `hardhat.config.js`), set these in your environment or a `.env` file (loaded via `vars.get`):
     ```
     INFURA_API_KEY=your_infura_api_key
     SEPOLIA_TEST_ACCOUNT_1_PRIVATE_KEY=your_sepolia_private_key
     ```
   Note: Never commit `.env` or `.env.local` files—add them to `.gitignore`.

3. **Deploy the Smart Contract**:
   - For local Hardhat node:
     ```
     ./deploy.sh hardhat
     ```
     This starts a local Hardhat node, deploys `MyToken` to localhost (chain ID 31337), and logs the contract address. Copy the deployed token address and update `NEXT_PUBLIC_TOKEN_ADDRESS` in `.env.local`.
   - For Sepolia testnet:
     ```
     ./deploy.sh sepolia
     ```
     This deploys directly to Sepolia (chain ID 11155111). Ensure your Infura key and private key are set. Update `.env.local` with the deployed address and Sepolia configs.

4. **Run the Frontend**:
   ```
   ./run.sh
   ```
   This starts the Next.js app in development mode (accessible at http://localhost:3000). It will use `NODE_ENV=development` and load vars from `.env.local` (or defaults from `.env.development` if present).

## Usage
- Open http://localhost:3000 in your browser.
- Connect MetaMask (ensure it's on the correct network: Hardhat Local for dev, Sepolia for prod).
- View token info (name, symbol, supply, balance) and perform transfers.
- For prod: Fund your MetaMask with Sepolia ETH via a faucet (e.g., Infura's Sepolia faucet).

## Troubleshooting
- **Port Conflicts**: If port 3000 (frontend) or 8545 (Hardhat) is in use, the scripts will attempt to kill the process. Check with `lsof -ti tcp:3000` or `lsof -ti tcp:8545`.
- **Wallet Connection Issues**: Ensure MetaMask is installed and set to the correct chain. The app will prompt to add/switch networks if needed.
- **Env Var Overrides**: With the updated `run.sh`, `.env.local` takes precedence—great for local testing.
- **Deployment Errors**: For Sepolia, verify your account has ETH for gas. Check `node.log` for Hardhat node issues in dev.
- **Contract Verification**: (Optional) Add Etherscan API key to env and run `npx hardhat verify --network sepolia <address>` for public verification.

## Enhancements
- Add tests: Run `npx hardhat test` after adding test files.
- Multi-network Support: See `config/chains.js` for dynamic chain selection.
- Security: Consider auditing the contract or using OpenZeppelin libraries.

For contributions or issues, open a pull request!