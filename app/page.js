// app/page.js
import ClientHome from './components/ClientHome';
import { chains } from './config/chains.js'; // Adjust path

// Fetch from env (server-side)
const network = process.env.NEXT_PUBLIC_NETWORK;
const selectedChain = chains[network];

export default function Home() {
  console.log(`Selected chain: ${selectedChain.name}, Token: ${selectedChain.tokenAddress}`);
  return (
    <div className="container">
      <ClientHome chain={selectedChain} /> {/* Pass the full chain object */}
    </div>
  );
}