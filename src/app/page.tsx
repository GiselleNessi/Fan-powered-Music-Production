"use client";

import { useState } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { sendTransaction, prepareTransaction } from "thirdweb";
import { shortenAddress, isValidAddress, formatETH, parseETH, getTransactionUrl, getPlatformName } from "@/lib/utils";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Music, Users, Heart, Plus, Search, ExternalLink, CheckCircle, XCircle, Loader2 } from "lucide-react";

// Create thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id",
});

// Define Base Sepolia chain for thirdweb
const baseSepolia = defineChain({
  id: 84532,
  name: "Base Sepolia",
  rpc: "https://sepolia.base.org",
});


interface Campaign {
  id: string;
  title: string;
  description: string;
  songUrl: string;
  artistWallet: string;
  artistName: string;
  targetAmount: number;
  raisedAmount: number;
  createdAt: Date;
  isActive: boolean;
}

type TransactionState = "idle" | "sending" | "success" | "error";

export default function Home() {
  const account = useActiveAccount();
  const { campaigns, loading, error, creating, success, createCampaign: createCampaignContract, updateRaisedAmount, clearMessages } = useCampaigns();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [tipAmount, setTipAmount] = useState("");
  const [txState, setTxState] = useState<TransactionState>("idle");
  const [txHash, setTxHash] = useState("");
  const [txError, setTxError] = useState("");

  // Create campaign form state
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    songUrl: "",
    artistWallet: "",
    artistName: "",
    targetAmount: "",
  });

  // Quick amount buttons (in Base ETH)
  const quickAmounts = [0.001, 0.005, 0.01, 0.025];

  // Campaigns are now loaded from smart contract via useCampaigns hook

  const createCampaign = async () => {
    if (!newCampaign.title || !newCampaign.songUrl || !newCampaign.artistWallet || !newCampaign.artistName) {
      alert("Please fill in all required fields");
      return;
    }

    if (!isValidAddress(newCampaign.artistWallet)) {
      alert("Please enter a valid wallet address");
      return;
    }

    if (!account) {
      alert("Please connect your wallet first to create a campaign");
      return;
    }

    try {
      await createCampaignContract({
        title: newCampaign.title,
        description: newCampaign.description,
        songUrl: newCampaign.songUrl,
        artistWallet: newCampaign.artistWallet,
        artistName: newCampaign.artistName,
        targetAmount: parseFloat(newCampaign.targetAmount) || 0,
        raisedAmount: 0,
      });

      // Reset form
      setNewCampaign({
        title: "",
        description: "",
        songUrl: "",
        artistWallet: "",
        artistName: "",
        targetAmount: "",
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create campaign:", error);
      alert("Failed to create campaign. Please try again.");
    }
  };

  const handleTip = async (campaign: Campaign) => {

    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      setTxError("Please enter a valid amount");
      return;
    }

    if (!account) {
      setTxError("Please connect your wallet first");
      return;
    }

    // Note: In thirdweb v5, chain validation is handled by the ConnectButton
    // The account object doesn't contain chain information directly

    setTxError("");
    setTxState("sending");

    try {
      // Parse the amount to wei (Base ETH has 18 decimals)
      const amountWei = parseETH(tipAmount);

      // For native Base ETH transfers, we need to send ETH directly without contract data

      // Validate the recipient address
      if (!isValidAddress(campaign.artistWallet)) {
        throw new Error(`Invalid recipient address: ${campaign.artistWallet}`);
      }



      const transaction = prepareTransaction({
        client,
        chain: baseSepolia,
        to: campaign.artistWallet as `0x${string}`,
        value: amountWei,
        data: "0x" as `0x${string}`,
      });

      const result = await sendTransaction({
        account,
        transaction,
      });

      // Extract transaction hash from the result
      const txHash = result.transactionHash;

      if (!txHash) {
        throw new Error("No transaction hash found in result");
      }

      setTxHash(txHash);
      setTxState("success");

      // Update campaign raised amount in smart contract
      const newRaisedAmount = (parseFloat(campaign.raisedAmount.toString()) + parseFloat(tipAmount)).toString();
      await updateRaisedAmount(campaign.id, newRaisedAmount);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Transaction failed";
      setTxError(errorMessage);
      setTxState("error");
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white">
            Support Artists Directly
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Artists create campaigns for their tracks. Fans discover and support them with Base ETH tips. No platform fees, no middlemen - just direct support.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {account ? "Create Campaign" : "Create Campaign (Connect Wallet)"}
          </button>
        </div>
      </div>

      {/* Campaigns Section */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Active Campaigns</h2>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No campaigns yet</h3>
            <p className="text-gray-500 mb-6">Be the first to create a campaign and start receiving tips!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {account ? "Create Your First Campaign" : "Create Your First Campaign (Connect Wallet)"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{campaign.title}</h3>
                    <p className="text-blue-400 font-medium">{campaign.artistName}</p>
                  </div>

                  {campaign.description && (
                    <p className="text-gray-300 text-sm line-clamp-3">{campaign.description}</p>
                  )}

                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-gray-400" />
                    <a
                      href={campaign.songUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {getPlatformName(campaign.songUrl)}
                    </a>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Raised</span>
                      <span className="text-white">{formatETH(campaign.raisedAmount)} Base ETH</span>
                    </div>
                    {campaign.targetAmount > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Target</span>
                          <span className="text-white">{formatETH(campaign.targetAmount)} Base ETH</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                        <div className="text-center text-xs text-gray-400">
                          {Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)}% funded
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedCampaign(campaign)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Support Artist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Artists Create Campaigns</h3>
            <p className="text-gray-300">Create a campaign with your track link, artist name, and wallet address</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Fans Discover & Support</h3>
            <p className="text-gray-300">Browse campaigns, listen to tracks, and send Base ETH tips directly to artists</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">100% to Artists</h3>
            <p className="text-gray-300">All tips go directly to the artist&apos;s wallet - no platform fees or middlemen</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <Music className="w-5 h-5 text-blue-400" />
            For Artists
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Create campaigns in seconds with track links
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Receive Base ETH tips directly to your wallet
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Works with Spotify, YouTube, SoundCloud, and more
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              No registration or verification required
            </li>
          </ul>
        </div>

        <div className="bg-gray-900/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            For Fans
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Discover new artists and their tracks
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Send instant Base ETH tips with any Web3 wallet
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Transparent transactions on Base blockchain
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Low gas fees and fast transactions
            </li>
          </ul>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gradient-to-r from-blue-900/20 to-green-900/20 rounded-2xl p-8 border border-blue-500/20">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Why Use Our Platform?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Instant Setup</h3>
            <p className="text-gray-300 text-sm">Create campaigns in under 30 seconds</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-semibold text-white mb-2">No Fees</h3>
            <p className="text-gray-300 text-sm">100% of tips go to artists</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Secure</h3>
            <p className="text-gray-300 text-sm">Built on Base blockchain</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Global</h3>
            <p className="text-gray-300 text-sm">Support artists worldwide</p>
          </div>
        </div>
      </section>

      {/* Create Campaign Modal */}
      {showCreateForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowCreateForm(false);
            clearMessages();
          }}
        >
          <div
            className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Campaign</h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  clearMessages();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Campaign Title *</label>
                <input
                  type="text"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  placeholder="My New Track"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Artist Name *</label>
                <input
                  type="text"
                  value={newCampaign.artistName}
                  onChange={(e) => setNewCampaign({ ...newCampaign, artistName: e.target.value })}
                  placeholder="Your artist name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Song URL *</label>
                <input
                  type="url"
                  value={newCampaign.songUrl}
                  onChange={(e) => setNewCampaign({ ...newCampaign, songUrl: e.target.value })}
                  placeholder="https://open.spotify.com/track/..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Your Wallet Address *</label>
                <input
                  type="text"
                  value={newCampaign.artistWallet}
                  onChange={(e) => setNewCampaign({ ...newCampaign, artistWallet: e.target.value })}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  placeholder="Tell fans about your track..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Target Amount (Base ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={newCampaign.targetAmount}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetAmount: e.target.value })}
                  placeholder="0.1"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {!account ? (
                <div className="text-center bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-300 mb-4">You need to connect your wallet to create a campaign and claim your NFT</p>
                  <ConnectButton
                    client={client}
                    chain={baseSepolia}
                    theme="dark"
                    connectModal={{ size: "compact" }}
                    accountAbstraction={{
                      chain: baseSepolia,
                      sponsorGas: true,
                    }}
                  />
                  <p className="text-xs text-gray-400 mt-3">
                    🔒 Gasless transactions powered by Account Abstraction
                  </p>
                </div>
              ) : (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-300 font-medium">Wallet Connected</p>
                      <p className="text-green-400 text-sm">{account.address.slice(0, 6)}...{account.address.slice(-4)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success/Error Messages */}
              {success && (
                <div className="bg-green-900/50 border border-green-500 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-green-300 text-sm">
                      {success}
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-red-300 text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={createCampaign}
                  disabled={!account || creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Claiming NFT...
                    </>
                  ) : account ? (
                    "Create Campaign & Claim NFT"
                  ) : (
                    "Connect Wallet to Continue"
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    clearMessages();
                  }}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tip Modal */}
      {selectedCampaign && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCampaign(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Support {selectedCampaign.artistName}</h3>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Track</p>
                <a
                  href={selectedCampaign.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {getPlatformName(selectedCampaign.songUrl)} - Listen
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Artist</p>
                <p className="text-white">{selectedCampaign.artistName}</p>
                <p className="text-gray-400 text-sm font-mono">{shortenAddress(selectedCampaign.artistWallet)}</p>
              </div>
            </div>

            {txState === "idle" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Tip Amount (Base ETH)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    placeholder="0.001"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">Quick amounts</p>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setTipAmount(amount.toString())}
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                      >
                        {amount} Base ETH
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <ConnectButton
                    client={client}
                    chain={baseSepolia}
                    theme="dark"
                    connectModal={{ size: "compact" }}
                    accountAbstraction={{
                      chain: baseSepolia,
                      sponsorGas: true,
                    }}
                  />
                </div>

                <button
                  onClick={() => handleTip(selectedCampaign)}
                  disabled={!tipAmount || parseFloat(tipAmount) <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Send Tip
                </button>
              </div>
            )}

            {txState === "sending" && (
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-300">Sending tip...</p>
              </div>
            )}

            {txState === "success" && (
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-green-400 mb-2">Tip Sent!</h4>
                <p className="text-gray-300 mb-4">
                  Your tip of {formatETH(parseFloat(tipAmount))} Base ETH has been sent to {selectedCampaign.artistName}.
                </p>
                <a
                  href={getTransactionUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Transaction
                </a>
                <button
                  onClick={() => {
                    setSelectedCampaign(null);
                    setTxState("idle");
                    setTipAmount("");
                    setTxHash("");
                  }}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {txState === "error" && (
              <div className="text-center">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-red-400 mb-2">Transaction Failed</h4>
                <p className="text-gray-300 mb-4">{txError}</p>
                <button
                  onClick={() => {
                    setTxState("idle");
                    setTxError("");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {txState === "idle" && (
              <button
                onClick={() => setSelectedCampaign(null)}
                className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Built on Base */}
      <div className="bg-gray-900/30 rounded-lg p-4 text-center">
        <p className="text-lg font-bold text-gray-300">
          Built on Base • Powered by thirdweb
        </p>
      </div>
    </div>
  );
}
