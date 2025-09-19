"use client";

import { useState, useEffect } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { getContract } from "thirdweb";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { shortenAddress, isValidAddress, formatUSDC, parseUSDC, getTransactionUrl, getPlatformName } from "@/lib/utils";
import { USDC_CONTRACT_ADDRESS, CURRENT_NETWORK } from "@/config/networks";
import { Music, Plus, ExternalLink, CheckCircle, XCircle, Loader2, Heart } from "lucide-react";

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

export default function CampaignsPage() {
    const account = useActiveAccount();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [tipAmount, setTipAmount] = useState("");
    const [txState, setTxState] = useState<TransactionState>("idle");
    const [txHash, setTxHash] = useState("");
    const [error, setError] = useState("");

    // Create campaign form state
    const [newCampaign, setNewCampaign] = useState({
        title: "",
        description: "",
        songUrl: "",
        artistWallet: "",
        artistName: "",
        targetAmount: "",
    });

    // Quick amount buttons
    const quickAmounts = [1, 5, 10, 25];

    // Load campaigns from localStorage
    useEffect(() => {
        const savedCampaigns = localStorage.getItem('campaigns');
        if (savedCampaigns) {
            const parsed = JSON.parse(savedCampaigns).map((c: Campaign & { createdAt: string }) => ({
                ...c,
                createdAt: new Date(c.createdAt)
            }));

            // Filter out any mock campaigns that might still be in localStorage
            const filteredCampaigns = parsed.filter((campaign: Campaign) =>
                !['mock-1', 'mock-2'].includes(campaign.id) &&
                !['Midnight Dreams', 'Urban Pulse'].includes(campaign.title) &&
                !['Luna Star', 'City Beats'].includes(campaign.artistName)
            );

            setCampaigns(filteredCampaigns);

            // Update localStorage with filtered campaigns
            if (filteredCampaigns.length !== parsed.length) {
                localStorage.setItem('campaigns', JSON.stringify(filteredCampaigns));
            }
        }
    }, []);

    const saveCampaigns = (updatedCampaigns: Campaign[]) => {
        setCampaigns(updatedCampaigns);
        localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    };

    const createCampaign = () => {
        if (!newCampaign.title || !newCampaign.songUrl || !newCampaign.artistWallet || !newCampaign.artistName) {
            alert("Please fill in all required fields");
            return;
        }

        if (!isValidAddress(newCampaign.artistWallet)) {
            alert("Please enter a valid wallet address");
            return;
        }

        const campaign: Campaign = {
            id: Date.now().toString(),
            title: newCampaign.title,
            description: newCampaign.description,
            songUrl: newCampaign.songUrl,
            artistWallet: newCampaign.artistWallet,
            artistName: newCampaign.artistName,
            targetAmount: parseFloat(newCampaign.targetAmount) || 0,
            raisedAmount: 0,
            createdAt: new Date(),
            isActive: true,
        };

        const updatedCampaigns = [campaign, ...campaigns];
        saveCampaigns(updatedCampaigns);

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
    };

    const handleTip = async (campaign: Campaign) => {
        if (!tipAmount || parseFloat(tipAmount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        if (!account) {
            setError("Please connect your wallet first");
            return;
        }

        setError("");
        setTxState("sending");

        try {
            // Get the USDC contract
            const contract = getContract({
                client,
                chain: baseSepolia,
                address: USDC_CONTRACT_ADDRESS.BASE_SEPOLIA,
            });

            // Parse the amount to wei (USDC has 6 decimals)
            const amountWei = parseUSDC(tipAmount);

            // Prepare the transfer transaction
            const transaction = prepareContractCall({
                contract,
                method: "function transfer(address to, uint256 amount) returns (bool)",
                params: [campaign.artistWallet, amountWei],
            });

            // Send the transaction
            const result = await sendTransaction({
                transaction,
                account,
            });

            setTxHash(result.transactionHash);
            setTxState("success");

            // Update campaign raised amount
            const updatedCampaigns = campaigns.map(c =>
                c.id === campaign.id
                    ? { ...c, raisedAmount: c.raisedAmount + parseFloat(tipAmount) }
                    : c
            );
            saveCampaigns(updatedCampaigns);

        } catch (err: unknown) {
            console.error("Transaction failed:", err);
            const errorMessage = err instanceof Error ? err.message : "Transaction failed";
            setError(errorMessage);
            setTxState("error");
        }
    };

    const checkEnvironment = () => {
        const missingVars = [];
        if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) missingVars.push("NEXT_PUBLIC_THIRDWEB_CLIENT_ID");
        return missingVars;
    };

    const missingEnvVars = checkEnvironment();

    if (missingEnvVars.length > 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-red-400 mb-4">Missing Environment Variables</h2>
                    <p className="text-gray-300 mb-4">
                        The following environment variables are required to run this application:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        {missingEnvVars.map((varName) => (
                            <li key={varName} className="font-mono text-sm">{varName}</li>
                        ))}
                    </ul>
                    <p className="text-gray-300 mt-4">
                        Please check your .env.local file and ensure all required variables are set.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Artist Campaigns</h1>
                    <p className="text-gray-300">Discover and support your favorite artists</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Campaign
                </button>
            </div>

            {/* Create Campaign Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-white mb-6">Create New Campaign</h2>

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
                                <label className="block text-sm font-medium text-white mb-2">Target Amount (USDC)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={newCampaign.targetAmount}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, targetAmount: e.target.value })}
                                    placeholder="100"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={createCampaign}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Create Campaign
                            </button>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tip Modal */}
            {selectedCampaign && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold text-white mb-4">Support {selectedCampaign.artistName}</h3>

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
                                    <label className="block text-sm font-medium text-white mb-2">Tip Amount (USDC)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={tipAmount}
                                        onChange={(e) => setTipAmount(e.target.value)}
                                        placeholder="0.00"
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
                                                {amount}
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
                                    Your tip of {formatUSDC(parseFloat(tipAmount))} USDC has been sent to {selectedCampaign.artistName}.
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
                                <p className="text-gray-300 mb-4">{error}</p>
                                <button
                                    onClick={() => {
                                        setTxState("idle");
                                        setError("");
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

            {/* Campaigns Grid */}
            {campaigns.length === 0 ? (
                <div className="text-center py-12">
                    <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No campaigns yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to create a campaign and start receiving tips!</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Create Your First Campaign
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
                                        <span className="text-white">{formatUSDC(campaign.raisedAmount)} USDC</span>
                                    </div>
                                    {campaign.targetAmount > 0 && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Target</span>
                                                <span className="text-white">{formatUSDC(campaign.targetAmount)} USDC</span>
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

            {/* Network Info */}
            <div className="bg-gray-900/30 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400">
                    Network: {CURRENT_NETWORK.name} {CURRENT_NETWORK.isTestnet && "(Testnet)"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    USDC Contract: {shortenAddress(USDC_CONTRACT_ADDRESS.BASE_SEPOLIA)}
                </p>
                {CURRENT_NETWORK.isTestnet && (
                    <p className="text-xs text-blue-400 mt-2">
                        🧪 Testing Mode: All donations go to 0x44eAD8980ea70901206dd72Ea452E2F336CE9452
                    </p>
                )}
            </div>
        </div>
    );
}
