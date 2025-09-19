"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { getContract } from "thirdweb";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { shortenAddress, isValidAddress, formatUSDC, parseUSDC, getTransactionUrl, getPlatformName } from "@/lib/utils";
import { USDC_CONTRACT_ADDRESS } from "@/config/networks";
import { Copy, ExternalLink, Music, Wallet, CheckCircle, XCircle, Loader2 } from "lucide-react";

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

type TransactionState = "idle" | "approving" | "sending" | "success" | "error";

function TipPageContent() {
    const searchParams = useSearchParams();
    const account = useActiveAccount();
    const [songUrl, setSongUrl] = useState("");
    const [artistWallet, setArtistWallet] = useState("");
    const [amount, setAmount] = useState("");
    const [txState, setTxState] = useState<TransactionState>("idle");
    const [txHash, setTxHash] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    // Quick amount buttons
    const quickAmounts = [1, 5, 10, 25];

    useEffect(() => {
        const song = searchParams.get("song");
        const to = searchParams.get("to");

        if (song) {
            setSongUrl(decodeURIComponent(song));
        }
        if (to && isValidAddress(to)) {
            setArtistWallet(to);
        }
    }, [searchParams]);

    const checkEnvironment = () => {
        const missingVars = [];
        if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) missingVars.push("NEXT_PUBLIC_THIRDWEB_CLIENT_ID");
        return missingVars;
    };

    const missingEnvVars = checkEnvironment();

    if (missingEnvVars.length > 0) {
        return (
            <div className="max-w-2xl mx-auto">
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

    const handleSendTip = async () => {
        console.log("🚀 Starting USDC tip transaction...");
        console.log("📊 Tip details:", {
            amount: amount,
            artistWallet: artistWallet,
            songUrl: songUrl
        });

        if (!amount || parseFloat(amount) <= 0) {
            console.log("❌ Invalid amount:", amount);
            setError("Please enter a valid amount");
            return;
        }

        if (!artistWallet || !isValidAddress(artistWallet)) {
            console.log("❌ Invalid artist wallet address:", artistWallet);
            setError("Invalid artist wallet address");
            return;
        }

        if (!account) {
            console.log("❌ No account connected");
            setError("Please connect your wallet first");
            return;
        }

        console.log("✅ Account connected:", {
            address: account.address
        });

        setError("");
        setTxState("sending");

        try {
            // Get the USDC contract
            console.log("🔗 Getting USDC contract...");
            const contract = getContract({
                client,
                chain: baseSepolia,
                address: USDC_CONTRACT_ADDRESS.BASE_SEPOLIA,
            });
            console.log("✅ USDC contract created:", {
                address: USDC_CONTRACT_ADDRESS.BASE_SEPOLIA,
                chainId: baseSepolia.id
            });

            // Parse the amount to wei (USDC has 6 decimals)
            console.log("💰 Parsing USDC amount to wei...");
            const amountWei = parseUSDC(amount);
            console.log(`💰 Converted ${amount} USDC to ${amountWei} wei`);

            // Prepare the transfer transaction
            console.log("📝 Preparing transfer transaction...");
            const transaction = prepareContractCall({
                contract,
                method: "function transfer(address to, uint256 amount) returns (bool)",
                params: [artistWallet, amountWei],
            });
            console.log("✅ Transaction prepared:", {
                method: "transfer",
                to: artistWallet,
                amount: amountWei.toString(),
                contract: USDC_CONTRACT_ADDRESS.BASE_SEPOLIA
            });

            // Send the transaction
            console.log("📤 Sending transaction...");
            const result = await sendTransaction({
                transaction,
                account,
            });

            console.log("✅ Transaction sent successfully:", result);
            setTxHash(result.transactionHash);
            setTxState("success");
        } catch (err: unknown) {
            console.error("❌ Transaction failed:", err);
            console.error("Error details:", {
                message: err instanceof Error ? err.message : "Unknown error",
                stack: err instanceof Error ? err.stack : undefined,
                error: err
            });
            const errorMessage = err instanceof Error ? err.message : "Transaction failed";
            setError(errorMessage);
            setTxState("error");
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const isValid = songUrl && artistWallet && isValidAddress(artistWallet) && amount && parseFloat(amount) > 0;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Support This Track</h1>
                <p className="text-gray-300 text-lg">
                    Send a USDC tip directly to the artist
                </p>
            </div>

            {/* Track Info Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
                <div className="space-y-4">
                    {/* Track Link */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Music className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-gray-400">Track</span>
                        </div>
                        {songUrl ? (
                            <a
                                href={songUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                {getPlatformName(songUrl)} - Listen to track
                            </a>
                        ) : (
                            <p className="text-gray-500">No track URL provided</p>
                        )}
                    </div>

                    {/* Artist Wallet */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-gray-400">Artist Wallet</span>
                        </div>
                        {artistWallet ? (
                            <p className="text-white font-mono text-sm">{shortenAddress(artistWallet)}</p>
                        ) : (
                            <p className="text-gray-500">No artist wallet provided</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tip Form */}
            {txState === "idle" && (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
                    <div className="space-y-6">
                        {/* Amount Input */}
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-white mb-2">
                                Tip Amount (USDC)
                            </label>
                            <input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                            />
                        </div>

                        {/* Quick Amount Buttons */}
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-3">Quick amounts</p>
                            <div className="grid grid-cols-4 gap-3">
                                {quickAmounts.map((quickAmount) => (
                                    <button
                                        key={quickAmount}
                                        onClick={() => setAmount(quickAmount.toString())}
                                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                    >
                                        {quickAmount} USDC
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Connect Wallet */}
                        <div className="flex justify-center">
                            <ConnectButton
                                client={client}
                                chain={baseSepolia}
                                theme="dark"
                                connectModal={{
                                    size: "compact",
                                }}
                            />
                        </div>

                        {/* Send Tip Button */}
                        <button
                            onClick={handleSendTip}
                            disabled={!isValid}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Send Tip
                        </button>

                        {error && (
                            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-red-400" />
                                    <p className="text-red-400">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Transaction States */}
            {txState === "sending" && (
                <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-8 text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Sending Tip...</h3>
                    <p className="text-gray-300">Please confirm the transaction in your wallet</p>
                </div>
            )}

            {txState === "success" && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-8">
                    <div className="text-center mb-6">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-green-400 mb-2">Tip Sent Successfully!</h3>
                        <p className="text-gray-300">
                            Your tip of {formatUSDC(parseFloat(amount))} USDC has been sent to the artist.
                        </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Transaction Details</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Amount:</span>
                                <span className="text-white">{formatUSDC(parseFloat(amount))} USDC</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">To:</span>
                                <span className="text-white font-mono">{shortenAddress(artistWallet)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Transaction:</span>
                                <a
                                    href={getTransactionUrl(txHash)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    View on Explorer
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Share Button */}
                    <div className="text-center">
                        <button
                            onClick={copyLink}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                        >
                            <Copy className="w-4 h-4" />
                            {copied ? "Link Copied!" : "Share This Page"}
                        </button>
                    </div>
                </div>
            )}

            {txState === "error" && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-8 text-center">
                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-400 mb-2">Transaction Failed</h3>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setTxState("idle");
                            setError("");
                        }}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Network Info */}
            <div className="bg-gray-900/30 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400">
                    Network: Base Sepolia (Testnet)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    USDC Contract: {shortenAddress(USDC_CONTRACT_ADDRESS.BASE_SEPOLIA)}
                </p>
            </div>
        </div>
    );
}

export default function TipPage() {
    return (
        <Suspense fallback={<div className="text-center py-12"><p className="text-gray-400">Loading...</p></div>}>
            <TipPageContent />
        </Suspense>
    );
}
