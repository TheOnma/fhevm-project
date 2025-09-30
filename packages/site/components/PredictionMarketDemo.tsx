"use client";

import { useFhevm } from "@fhevm/react";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { usePredictionMarket } from "@/hooks/usePredictionMarket";
import { useState } from "react";
import Image from "next/image";

export function PredictionMarketDemo() {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  } = useMetaMaskEthersSigner();

  const { instance } = useFhevm({
    provider,
    chainId,
    enabled: true,
  });

  const market = usePredictionMarket({
    instance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  const [amount, setAmount] = useState<number>(1);
  const [showFullAddress, setShowFullAddress] = useState<boolean>(false);
  const [selectedMarket, setSelectedMarket] = useState<'btc' | 'eth'>('btc');
  const [lastBetResult, setLastBetResult] = useState<string>('');

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 rounded-lg p-8 text-center max-w-md mx-auto">
          <div className="mb-6">
            <Image 
              src="/icon.png" 
              alt="Secret Market Icon" 
              width={64} 
              height={64} 
              className="mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-white mb-2">Secret Market</h2>
            <p className="text-gray-300">Private Prediction Markets</p>
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            onClick={connect}
          >
            Log In with Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!market.contractAddress) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 rounded-lg p-8 text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <Image 
              src="/icon.png" 
              alt="Secret Market Icon" 
              width={64} 
              height={64} 
              className="mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-white mb-4">Secret Market</h2>
            <p className="text-gray-300 mb-6">Private Prediction Markets</p>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">🚀 Production Deployment</h3>
            <p className="text-blue-200 mb-4">
              This is a demo of Secret Market - a private prediction market platform powered by FHEVM technology.
            </p>
            <div className="text-left space-y-2 text-sm text-gray-300">
              <p>✅ <strong>Encrypted Betting:</strong> All bet amounts are encrypted using FHEVM</p>
              <p>✅ <strong>Private Positions:</strong> Your betting strategy remains completely private</p>
              <p>✅ <strong>Multi-Market Support:</strong> Bitcoin and Ethereum predictions</p>
              <p>✅ <strong>Professional UI:</strong> Dark theme inspired by Polymarket</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-2">To Run Locally:</h4>
            <div className="text-left text-sm text-gray-300 space-y-1">
              <p>1. Clone the repository</p>
              <p>2. Run <code className="bg-gray-700 px-2 py-1 rounded">npm run hardhat-node</code></p>
              <p>3. Run <code className="bg-gray-700 px-2 py-1 rounded">npm run dev:mock</code></p>
              <p>4. Connect MetaMask to localhost:8545</p>
            </div>
          </div>

          <div className="mt-6">
            <a 
              href="https://github.com/TheOnma/fhevm-project" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image 
                src="/icon.png" 
                alt="Secret Market Icon" 
                width={32} 
                height={32} 
                className="mr-3"
              />
              <h1 className="text-2xl font-bold text-white">Secret Market</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">Private Prediction Markets</span>
              {isConnected && accounts && accounts[0] ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <button
                    className="text-gray-300 text-sm hover:text-white transition-colors"
                    onClick={() => setShowFullAddress(!showFullAddress)}
                    title="Click to toggle full address"
                  >
                    {showFullAddress ? accounts[0] : `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`}
                  </button>
                </div>
              ) : (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  onClick={connect}
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* BTC Market Card */}
          <div 
            className={`bg-gray-900 rounded-lg border-2 p-6 cursor-pointer transition-all ${
              selectedMarket === 'btc' 
                ? 'border-blue-500 bg-blue-900/20' 
                : 'border-gray-800 hover:border-gray-700'
            }`}
            onClick={() => setSelectedMarket('btc')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">₿</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Will BTC close above $100k this year?
                  </h2>
                  <p className="text-gray-300 text-sm">Private Prediction Market</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-white">65%</span>
                </div>
                <p className="text-gray-300 text-sm">Current Chance</p>
              </div>
            </div>
            {selectedMarket === 'btc' && (
              <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                <p className="text-blue-200 text-sm font-medium">✓ Selected for betting</p>
              </div>
            )}
          </div>

          {/* ETH Market Card */}
          <div 
            className={`bg-gray-900 rounded-lg border-2 p-6 cursor-pointer transition-all ${
              selectedMarket === 'eth' 
                ? 'border-purple-500 bg-purple-900/20' 
                : 'border-gray-800 hover:border-gray-700'
            }`}
            onClick={() => setSelectedMarket('eth')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Ξ</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    What price will Ethereum hit September 29-October 5?
                  </h2>
                  <p className="text-gray-300 text-sm">Private Prediction Market</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-white">3%</span>
                </div>
                <p className="text-gray-300 text-sm">Current Chance</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-300 text-sm">Target Price</span>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 text-lg">↑</span>
                  <span className="text-white font-bold text-lg">$4,800</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-300 text-sm">Yes</span>
                <span className="text-green-400 font-bold text-lg">3%</span>
              </div>
            </div>
            {selectedMarket === 'eth' && (
              <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                <p className="text-purple-200 text-sm font-medium">✓ Selected for betting</p>
              </div>
            )}
          </div>
        </div>

          {/* Status Message */}
          {market.message && (
            <div className={`mb-4 p-4 rounded-lg ${
              market.message.includes('Connecting') 
                ? 'bg-blue-900/20 border border-blue-500/30' 
                : 'bg-yellow-900/20 border border-yellow-500/30'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  market.message.includes('Connecting') ? 'bg-blue-500' : 'bg-yellow-500'
                }`}></div>
                <p className={`text-sm font-medium ${
                  market.message.includes('Connecting') ? 'text-blue-200' : 'text-yellow-200'
                }`}>
                  {market.message.includes('deployment not found') 
                    ? 'Market not available on current network. Please switch to localhost or deploy the contract.'
                    : market.message}
                </p>
              </div>
            </div>
          )}

        {/* Your Stakes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Your Encrypted Stakes</h3>
            <button
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              onClick={() => market.refreshMyStakes()}
            >
              🔄 Refresh
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-semibold">YES</span>
                <span className="text-gray-300 text-sm">Encrypted</span>
              </div>
              <div className="bg-gray-900 rounded p-2">
                <p className="text-white font-mono text-xs break-all">
                  {market.myYesStakeHandle || "0x0000000000000000000000000000000000000000000000000000000000000000"}
                </p>
              </div>
              {market.myYesStakeHandle && market.myYesStakeHandle !== "0x0000000000000000000000000000000000000000000000000000000000000000" && (
                <p className="text-green-400 text-xs mt-2">✓ Active stake detected</p>
              )}
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-400 font-semibold">NO</span>
                <span className="text-gray-300 text-sm">Encrypted</span>
              </div>
              <div className="bg-gray-900 rounded p-2">
                <p className="text-white font-mono text-xs break-all">
                  {market.myNoStakeHandle || "0x0000000000000000000000000000000000000000000000000000000000000000"}
                </p>
              </div>
              {market.myNoStakeHandle && market.myNoStakeHandle !== "0x0000000000000000000000000000000000000000000000000000000000000000" && (
                <p className="text-red-400 text-xs mt-2">✓ Active stake detected</p>
              )}
            </div>
          </div>
        </div>

        {/* Betting Interface */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Place Your Bet</h3>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Selected Market:</span>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedMarket === 'btc' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-purple-600 text-white'
              }`}>
                {selectedMarket === 'btc' ? '₿ Bitcoin' : 'Ξ Ethereum'}
              </div>
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">You are betting on:</p>
            <p className="text-white font-semibold">
              {selectedMarket === 'btc' 
                ? 'Will BTC close above $100k this year?'
                : 'What price will Ethereum hit September 29-October 5?'
              }
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bet Amount
              </label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                min={1}
                value={amount}
                aria-label="Bet amount"
                onChange={(e) => setAmount(parseInt(e.target.value || "1", 10))}
              />
            </div>
            <div className="flex space-x-3">
              <button
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                disabled={!market.canPlace}
                onClick={async () => {
                  console.log(`Placing ${selectedMarket} bet: YES, amount: ${amount}`);
                  setLastBetResult(`Placing ${selectedMarket.toUpperCase()} YES bet...`);
                  try {
                    await market.placeBet(1, amount);
                    setLastBetResult(`✅ ${selectedMarket.toUpperCase()} YES bet placed successfully!`);
                    // Refresh stakes after successful bet
                    setTimeout(() => {
                      market.refreshMyStakes();
                    }, 1000);
                  } catch (error) {
                    setLastBetResult(`❌ Bet failed: ${error}`);
                  }
                }}
              >
                Bet YES
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                disabled={!market.canPlace}
                onClick={async () => {
                  console.log(`Placing ${selectedMarket} bet: NO, amount: ${amount}`);
                  setLastBetResult(`Placing ${selectedMarket.toUpperCase()} NO bet...`);
                  try {
                    await market.placeBet(0, amount);
                    setLastBetResult(`✅ ${selectedMarket.toUpperCase()} NO bet placed successfully!`);
                    // Refresh stakes after successful bet
                    setTimeout(() => {
                      market.refreshMyStakes();
                    }, 1000);
                  } catch (error) {
                    setLastBetResult(`❌ Bet failed: ${error}`);
                  }
                }}
              >
                Bet NO
              </button>
            </div>
          </div>
          
          {/* Bet Result Feedback */}
          {lastBetResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              lastBetResult.includes('✅') 
                ? 'bg-green-900/20 border border-green-500/30' 
                : lastBetResult.includes('❌')
                ? 'bg-red-900/20 border border-red-500/30'
                : 'bg-blue-900/20 border border-blue-500/30'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  lastBetResult.includes('✅') 
                    ? 'bg-green-500' 
                    : lastBetResult.includes('❌')
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`}></div>
                <p className={`text-sm font-medium ${
                  lastBetResult.includes('✅') 
                    ? 'text-green-200' 
                    : lastBetResult.includes('❌')
                    ? 'text-red-200'
                    : 'text-blue-200'
                }`}>
                  {lastBetResult}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">🔒 Private Bets</h4>
              <p>Your bet amounts are encrypted using FHEVM technology, keeping your positions private.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">⚡ Real-time</h4>
              <p>Place bets instantly on the blockchain with encrypted computation for privacy.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">🎯 Decentralized</h4>
              <p>No central authority controls the market - it&apos;s fully decentralized and transparent.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


