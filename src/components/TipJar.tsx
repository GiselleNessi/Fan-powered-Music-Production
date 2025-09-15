"use client";

import { useState } from "react";
import { Heart, Gift, TrendingUp } from "lucide-react";
import { useTipJar } from "@/hooks/useContracts";
import { useNotifications } from "@/hooks/useNotificationContext";
import { useActiveAccount } from "thirdweb/react";
import { Artist, Tip } from "@/types";

interface TipJarProps {
    artist: Artist;
    tips: Tip[];
    onTipSent?: (tip: Tip) => void;
}

const TIP_AMOUNTS = [5, 10, 25, 50, 100];

export function TipJar({ artist, tips, onTipSent }: TipJarProps) {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState("");
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const account = useActiveAccount();
    const { sendTip, approveUSDC, isSendingTip, isApprovingUSDC } = useTipJar();
    const { showTipSuccess, showTipError, showApprovalSuccess, showApprovalError } = useNotifications();

    const totalTips = tips.reduce((sum, tip) => sum + tip.amount, 0);
    const recentTips = tips.slice(0, 5);

    const handleTip = async () => {
        if (!account || !selectedAmount && !customAmount) return;

        const amount = selectedAmount || parseFloat(customAmount);
        if (amount <= 0) return;

        try {
            // First approve USDC spending
            const approvalResult = await approveUSDC({
                args: [artist.walletAddress, BigInt(amount * 1e6)], // USDC has 6 decimals
            });

            if (approvalResult?.success) {
                showApprovalSuccess(amount);
            }

            // Then send tip
            const tipResult = await sendTip({
                args: [artist.walletAddress, BigInt(amount * 1e6), message],
            });

            if (tipResult?.success && tipResult?.txHash) {
                showTipSuccess(amount, artist.name, tipResult.txHash);

                // Create tip object for UI update
                const newTip: Tip = {
                    id: Date.now().toString(),
                    from: account.address,
                    to: artist.walletAddress,
                    amount,
                    message: message || undefined,
                    timestamp: new Date(),
                    nftClaimed: false,
                };

                onTipSent?.(newTip);

                // Reset form
                setSelectedAmount(null);
                setCustomAmount("");
                setMessage("");
                setIsOpen(false);
            }
        } catch (error: unknown) {
            console.error("Error sending tip:", error);

            // Handle specific error types
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage.includes("Approval failed")) {
                showApprovalError(errorMessage);
            } else {
                showTipError(errorMessage);
            }
        }
    };

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount("");
    };

    const handleCustomAmountChange = (value: string) => {
        setCustomAmount(value);
        setSelectedAmount(null);
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white">Tip Jar</h3>
                        <p className="text-gray-400 text-sm">Support {artist.name} directly</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">${totalTips.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Total Tips</div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-lg font-bold text-white">{tips.length}</div>
                    <div className="text-gray-400 text-xs">Tips</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-white">{artist.totalFans}</div>
                    <div className="text-gray-400 text-xs">Fans</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-white">
                        {tips.length > 0 ? (totalTips / tips.length).toFixed(0) : 0}
                    </div>
                    <div className="text-gray-400 text-xs">Avg Tip</div>
                </div>
            </div>

            {/* Tip Button */}
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    disabled={!account}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                    <Heart className="h-5 w-5" />
                    <span>{account ? "Send a Tip" : "Connect Wallet to Tip"}</span>
                </button>
            ) : (
                <div className="space-y-4">
                    {/* Amount Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Choose Amount (USDC)
                        </label>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            {TIP_AMOUNTS.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => handleAmountSelect(amount)}
                                    className={`py-2 px-3 rounded-lg font-medium transition-colors ${selectedAmount === amount
                                        ? "bg-blue-600 text-white"
                                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                                        }`}
                                >
                                    ${amount}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            placeholder="Custom amount"
                            value={customAmount}
                            onChange={(e) => handleCustomAmountChange(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Message (optional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Leave a message for the artist..."
                            rows={2}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-2 px-4 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleTip}
                            disabled={!account || (!selectedAmount && !customAmount) || isSendingTip || isApprovingUSDC}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                        >
                            {(isSendingTip || isApprovingUSDC) ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>{isApprovingUSDC ? "Approving..." : "Sending..."}</span>
                                </>
                            ) : (
                                <>
                                    <Heart className="h-4 w-4" />
                                    <span>Send Tip</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Recent Tips */}
            {recentTips.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Recent Tips
                    </h4>
                    <div className="space-y-2">
                        {recentTips.map((tip) => (
                            <div key={tip.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-gray-300">
                                        ${tip.amount} {tip.message && `- "${tip.message}"`}
                                    </span>
                                </div>
                                <span className="text-gray-400">
                                    {tip.timestamp.toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
