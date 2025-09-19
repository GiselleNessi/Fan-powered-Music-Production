"use client";

import { useState } from "react";
import { Play, Pause, Heart, Share2, Clock, DollarSign, Gift, TrendingUp } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
// import { useCrowdfunding } from "@/hooks/useContracts"; // Hook doesn't exist yet
import { Track, Artist, Tip } from "@/types";
// import { TipJar } from "./TipJar"; // Component doesn't exist yet

interface TrackCardProps {
    track: Track;
    artist: Artist;
    tips: Tip[];
    onTipSent?: (tip: Tip) => void;
}

export function TrackCard({ track, artist }: TrackCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showTipJar, setShowTipJar] = useState(false);
    const [contributionAmount, setContributionAmount] = useState("");

    const account = useActiveAccount();
    // const { contribute, approveUSDC, isContributing, isApprovingUSDC } = useCrowdfunding(); // Hook doesn't exist yet
    const contribute = async () => ({ success: false, txHash: undefined }); // Placeholder
    const approveUSDC = async () => ({ success: false, txHash: undefined }); // Placeholder
    const isContributing = false; // Placeholder
    const isApprovingUSDC = false; // Placeholder
    // const { showInvestmentSuccess, showInsufficientFunds, showInvestmentError, showApprovalSuccess, showApprovalError } = useNotifications();

    const progress = (track.raisedAmount / track.targetAmount) * 100;
    // Ensure deadline is a Date object
    const deadline = track.deadline instanceof Date ? track.deadline : new Date(track.deadline);
    const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        // TODO: Implement actual audio playback
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        // TODO: Implement like functionality
    };

    const handleContribute = async () => {
        if (!account || !contributionAmount) return;

        const amount = parseFloat(contributionAmount);
        if (amount <= 0) return;

        try {
            // First approve USDC spending
            const approvalResult = await approveUSDC();

            if (approvalResult?.success) {
                // showApprovalSuccess(amount);
            }

            // Then contribute to campaign
            const contributionResult = await contribute();

            if (contributionResult?.success && contributionResult?.txHash) {
                // showInvestmentSuccess(amount, track.title, contributionResult.txHash);
                // Reset form
                setContributionAmount("");
            }
        } catch (error: unknown) {
            console.error("Error contributing:", error);

            // Handle specific error types
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage.includes("insufficient funds")) {
                // showInsufficientFunds(amount, Math.random() * amount * 0.8); // Mock available balance
            } else if (errorMessage.includes("Approval failed")) {
                // showApprovalError(errorMessage);
            } else {
                // showInvestmentError(errorMessage);
            }
        }
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300 group border border-blue-500/20">
            {/* Track Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-600 to-blue-800">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        onClick={handlePlayPause}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 transition-all duration-300 group-hover:scale-110"
                    >
                        {isPlaying ? (
                            <Pause className="h-8 w-8 text-white" />
                        ) : (
                            <Play className="h-8 w-8 text-white ml-1" />
                        )}
                    </button>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                        onClick={handleLike}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isLiked ? "bg-red-500/80 text-white" : "bg-white/20 text-white hover:bg-white/30"
                            }`}
                    >
                        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    </button>
                    <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors">
                        <Share2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Track Info */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{track.title}</h3>
                    <p className="text-blue-400 font-medium">{track.artist.name}</p>
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">{track.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-lg font-bold text-white">{track.raisedAmount} ETH</div>
                        <div className="text-xs text-gray-400">Raised</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-white">{track.contributors}</div>
                        <div className="text-xs text-gray-400">Contributors</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-white">{track.royaltyShare}%</div>
                        <div className="text-xs text-gray-400">Royalty Share</div>
                    </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-gray-300">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{daysLeft} days left</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-300">Target</div>
                        <div className="font-semibold text-white">{track.targetAmount} ETH</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {/* Investment Section */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-blue-400" />
                            <span className="text-sm font-medium text-white">Invest in this track</span>
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                placeholder="Amount (ETH)"
                                value={contributionAmount}
                                onChange={(e) => setContributionAmount(e.target.value)}
                                step="0.01"
                                min="0.01"
                                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <button
                                onClick={handleContribute}
                                disabled={!account || !contributionAmount || isContributing || isApprovingUSDC}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-1"
                            >
                                {(isContributing || isApprovingUSDC) ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                        <span className="text-xs">{isApprovingUSDC ? "Approving..." : "Investing..."}</span>
                                    </>
                                ) : (
                                    <>
                                        <DollarSign className="h-3 w-3" />
                                        <span className="text-xs">Invest</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Tip Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Gift className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-gray-300">Quick tip for {artist.name}</span>
                        </div>
                        <button
                            onClick={() => setShowTipJar(!showTipJar)}
                            className="text-blue-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            {showTipJar ? "Hide" : "Tip"} →
                        </button>
                    </div>
                </div>

                {/* Tip Jar (collapsible) */}
                {showTipJar && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        {/* <TipJar
                            artist={artist}
                            tips={tips}
                            onTipSent={onTipSent}
                        /> */}
                        <p className="text-gray-400 text-sm">Tip functionality coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
