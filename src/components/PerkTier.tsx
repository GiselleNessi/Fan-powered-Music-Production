"use client";

import { Crown, Star, Award, Gem } from "lucide-react";
import { PerkTier as PerkTierType } from "@/types";

interface PerkTierProps {
    tier: PerkTierType;
    currentContribution: number;
    isUnlocked: boolean;
    isNextTier: boolean;
}

const tierIcons = {
    bronze: Award,
    silver: Star,
    gold: Crown,
    platinum: Gem,
};

const tierColors = {
    bronze: "from-amber-600 to-orange-600",
    silver: "from-gray-400 to-gray-600",
    gold: "from-yellow-500 to-yellow-600",
    platinum: "from-purple-500 to-pink-500",
};

export function PerkTier({ tier, currentContribution, isUnlocked, isNextTier }: PerkTierProps) {
    const Icon = tierIcons[tier.nftTier];
    const progress = Math.min((currentContribution / tier.minContribution) * 100, 100);

    return (
        <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${isUnlocked
                ? `border-${tier.color}-400 bg-${tier.color}-500/10`
                : isNextTier
                    ? "border-purple-400 bg-purple-500/10"
                    : "border-gray-600 bg-gray-800/50"
            }`}>
            {/* Tier Badge */}
            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${isUnlocked ? `bg-gradient-to-r ${tierColors[tier.nftTier]}` : "bg-gray-600"
                }`}>
                <Icon className="h-4 w-4 text-white" />
            </div>

            {/* Tier Info */}
            <div className="mb-3">
                <h3 className={`text-lg font-semibold ${isUnlocked ? "text-white" : "text-gray-400"
                    }`}>
                    {tier.name}
                </h3>
                <p className={`text-sm ${isUnlocked ? "text-gray-300" : "text-gray-500"
                    }`}>
                    {tier.minContribution} USDC minimum
                </p>
            </div>

            {/* Progress Bar */}
            {!isUnlocked && (
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        {tier.minContribution - currentContribution} USDC to unlock
                    </p>
                </div>
            )}

            {/* Benefits */}
            <div className="space-y-2">
                {tier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isUnlocked ? `bg-${tier.color}-400` : "bg-gray-600"
                            }`} />
                        <span className={`text-sm ${isUnlocked ? "text-gray-300" : "text-gray-500"
                            }`}>
                            {benefit}
                        </span>
                    </div>
                ))}
            </div>

            {/* Status */}
            {isUnlocked && (
                <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center space-x-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-sm font-medium">Unlocked</span>
                    </div>
                </div>
            )}
        </div>
    );
}
