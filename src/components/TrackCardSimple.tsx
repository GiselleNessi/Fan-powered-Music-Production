"use client";

import { useState } from "react";
import { Play, Pause, TrendingUp } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
// import { useCrowdfunding } from "@/hooks/useContracts"; // Hook doesn't exist yet
import { Track, Artist } from "@/types";

interface TrackCardSimpleProps {
    track: Track;
    artist: Artist;
}

export function TrackCardSimple({ track }: TrackCardSimpleProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const account = useActiveAccount();
    // const { contribute, isContributing } = useCrowdfunding(); // Hook doesn't exist yet
    const contribute = async () => ({ success: false, txHash: undefined }); // Placeholder
    const isContributing = false; // Placeholder

    const progress = (track.raisedAmount / track.targetAmount) * 100;

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        // TODO: Implement actual audio playback
    };

    const handleInvest = async () => {
        if (!account) return;

        try {
            // Simple investment with fixed amount
            await contribute();
        } catch (error) {
            console.error("Investment failed:", error);
        }
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300 group border border-blue-500/20">
            {/* Track Image */}
            <div className="relative h-32 bg-gradient-to-br from-blue-600 to-blue-800">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        onClick={handlePlayPause}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group-hover:scale-110"
                    >
                        {isPlaying ? (
                            <Pause className="h-6 w-6 text-white" />
                        ) : (
                            <Play className="h-6 w-6 text-white ml-1" />
                        )}
                    </button>
                </div>
            </div>

            {/* Track Info */}
            <div className="p-4">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-1">{track.title}</h3>
                    <p className="text-blue-400 font-medium text-sm">{track.artist.name}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>{track.raisedAmount} ETH raised</span>
                        <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Target and Invest Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-300">Target</div>
                        <div className="font-semibold text-white">{track.targetAmount} ETH</div>
                    </div>
                    <button
                        onClick={handleInvest}
                        disabled={!account || isContributing}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                        {isContributing ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <TrendingUp className="h-4 w-4" />
                                <span>Invest 0.1 ETH</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}


