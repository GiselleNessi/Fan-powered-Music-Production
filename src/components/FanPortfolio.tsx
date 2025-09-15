"use client";

import { useState } from "react";
import { Trophy, Gift, TrendingUp, DollarSign, Crown, Star } from "lucide-react";
import { FanPortfolio as FanPortfolioType, PerkTier } from "@/types";
import { PerkTier as PerkTierComponent } from "./PerkTier";

interface FanPortfolioProps {
    portfolio: FanPortfolioType;
    perkTiers: PerkTier[];
}

export function FanPortfolio({ portfolio, perkTiers }: FanPortfolioProps) {
    const [activeTab, setActiveTab] = useState("overview");

    const totalNFTs = portfolio.nfts.tipBadges.length + portfolio.nfts.investmentNFTs.length + portfolio.nfts.perkNFTs.length;

    const getCurrentTier = (artistId: string) => {
        const tier = portfolio.perkTiers[artistId];
        if (!tier) return null;

        const currentTierIndex = perkTiers.findIndex(t => t.name === tier.name);
        const nextTier = perkTiers[currentTierIndex + 1];

        return {
            current: tier,
            next: nextTier,
            isNextTier: !!nextTier && portfolio.totalTipsSent >= nextTier.minContribution
        };
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Your Portfolio</h1>
                <p className="text-gray-300">Track your investments, rewards, and perks</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Invested</p>
                            <p className="text-2xl font-bold text-white">${portfolio.totalInvestments.toLocaleString()}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-300" />
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Tips</p>
                            <p className="text-2xl font-bold text-white">${portfolio.totalTipsSent.toLocaleString()}</p>
                        </div>
                        <Gift className="h-8 w-8 text-purple-300" />
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Royalties Earned</p>
                            <p className="text-2xl font-bold text-white">${portfolio.totalRoyaltiesEarned.toLocaleString()}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-300" />
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">NFTs Collected</p>
                            <p className="text-2xl font-bold text-white">{totalNFTs}</p>
                        </div>
                        <Trophy className="h-8 w-8 text-purple-300" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-8">
                {[
                    { id: "overview", label: "Overview", icon: Trophy },
                    { id: "nfts", label: "NFTs", icon: Crown },
                    { id: "perks", label: "Perks", icon: Star },
                    { id: "royalties", label: "Royalties", icon: DollarSign },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === tab.id
                            ? "bg-purple-600 text-white"
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="space-y-8">
                    {/* Recent Activity */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {[
                                { type: "tip", amount: 25, artist: "Luna Star", time: "2 hours ago" },
                                { type: "investment", amount: 100, track: "Midnight Dreams", time: "1 day ago" },
                                { type: "royalty", amount: 15, track: "Acoustic Soul", time: "3 days ago" },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === "tip" ? "bg-green-500/20" :
                                            activity.type === "investment" ? "bg-purple-500/20" :
                                                "bg-yellow-500/20"
                                            }`}>
                                            {activity.type === "tip" ? <Gift className="h-4 w-4 text-green-400" /> :
                                                activity.type === "investment" ? <TrendingUp className="h-4 w-4 text-purple-400" /> :
                                                    <DollarSign className="h-4 w-4 text-yellow-400" />}
                                        </div>
                                        <div>
                                            <p className="text-white">
                                                {activity.type === "tip" ? `Tipped ${activity.artist}` :
                                                    activity.type === "investment" ? `Invested in ${activity.track}` :
                                                        `Earned royalties from ${activity.track}`}
                                            </p>
                                            <p className="text-gray-400 text-sm">{activity.time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-purple-300 font-semibold">${activity.amount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "nfts" && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">Your NFT Collection</h3>

                    {/* NFT Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Tip Badges */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <Gift className="h-5 w-5 text-green-400" />
                                <h4 className="text-lg font-semibold text-white">Tip Badges</h4>
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">{portfolio.nfts.tipBadges.length}</div>
                            <p className="text-gray-400 text-sm">NFTs from tipping artists</p>
                        </div>

                        {/* Investment NFTs */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <TrendingUp className="h-5 w-5 text-purple-400" />
                                <h4 className="text-lg font-semibold text-white">Investment NFTs</h4>
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">{portfolio.nfts.investmentNFTs.length}</div>
                            <p className="text-gray-400 text-sm">NFTs from track investments</p>
                        </div>

                        {/* Perk NFTs */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <Crown className="h-5 w-5 text-yellow-400" />
                                <h4 className="text-lg font-semibold text-white">Perk NFTs</h4>
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">{portfolio.nfts.perkNFTs.length}</div>
                            <p className="text-gray-400 text-sm">NFTs from unlocked perks</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "perks" && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">Your Perk Tiers</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {perkTiers.map((tier, index) => {
                            const tierInfo = getCurrentTier("artist-1"); // This would be dynamic
                            const isUnlocked = tierInfo?.current?.name === tier.name;
                            const isNextTier = tierInfo?.next?.name === tier.name;
                            const currentContribution = portfolio.totalTipsSent; // This would be per-artist

                            return (
                                <PerkTierComponent
                                    key={tier.name}
                                    tier={tier}
                                    currentContribution={currentContribution}
                                    isUnlocked={isUnlocked}
                                    isNextTier={isNextTier}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === "royalties" && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Royalty Earnings</h3>
                    <p className="text-gray-400">Royalty tracking coming soon...</p>
                </div>
            )}
        </div>
    );
}
