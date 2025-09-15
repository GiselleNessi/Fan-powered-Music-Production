"use client";

import { useState } from "react";
import { Plus, Music, TrendingUp, Users, DollarSign, Settings } from "lucide-react";

// Mock data for artist's tracks
const mockArtistTracks = [
    {
        id: "1",
        title: "Midnight Dreams",
        status: "active",
        targetAmount: 5000,
        raisedAmount: 3200,
        contributors: 45,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        royaltyShare: 15,
    },
    {
        id: "2",
        title: "Urban Pulse",
        status: "active",
        targetAmount: 8000,
        raisedAmount: 1200,
        contributors: 12,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        royaltyShare: 20,
    },
    {
        id: "3",
        title: "Acoustic Soul",
        status: "completed",
        targetAmount: 3000,
        raisedAmount: 3000,
        contributors: 28,
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        royaltyShare: 10,
    },
];

export default function ArtistDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    const totalRaised = mockArtistTracks.reduce((sum, track) => sum + track.raisedAmount, 0);
    const totalContributors = mockArtistTracks.reduce((sum, track) => sum + track.contributors, 0);
    const activeTracks = mockArtistTracks.filter(track => track.status === "active").length;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Artist Dashboard</h1>
                <p className="text-gray-300">Manage your tracks and connect with your fans</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Raised</p>
                            <p className="text-2xl font-bold text-white">${totalRaised.toLocaleString()}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-300" />
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Contributors</p>
                            <p className="text-2xl font-bold text-white">{totalContributors}</p>
                        </div>
                        <Users className="h-8 w-8 text-purple-300" />
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Active Tracks</p>
                            <p className="text-2xl font-bold text-white">{activeTracks}</p>
                        </div>
                        <Music className="h-8 w-8 text-purple-300" />
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Avg. Royalty</p>
                            <p className="text-2xl font-bold text-white">15%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-300" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-8">
                {[
                    { id: "overview", label: "Overview", icon: TrendingUp },
                    { id: "tracks", label: "My Tracks", icon: Music },
                    { id: "analytics", label: "Analytics", icon: Settings },
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
                                { action: "New contribution", track: "Midnight Dreams", amount: "$50", time: "2 hours ago" },
                                { action: "Track completed", track: "Acoustic Soul", amount: "$3,000", time: "1 day ago" },
                                { action: "New contribution", track: "Urban Pulse", amount: "$25", time: "3 days ago" },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                                    <div>
                                        <p className="text-white">{activity.action}</p>
                                        <p className="text-gray-400 text-sm">{activity.track}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-purple-300 font-semibold">{activity.amount}</p>
                                        <p className="text-gray-400 text-sm">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "tracks" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-white">My Tracks</h3>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                            <Plus className="h-4 w-4" />
                            <span>Create New Track</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {mockArtistTracks.map((track) => (
                            <div key={track.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white">{track.title}</h4>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${track.status === "active"
                                            ? "bg-green-500/20 text-green-300"
                                            : "bg-purple-500/20 text-purple-300"
                                            }`}>
                                            {track.status}
                                        </span>
                                    </div>
                                    <button className="text-gray-400 hover:text-white">
                                        <Settings className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Progress</span>
                                        <span className="text-white">{((track.raisedAmount / track.targetAmount) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                            style={{ width: `${Math.min((track.raisedAmount / track.targetAmount) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>${track.raisedAmount.toLocaleString()} raised</span>
                                        <span>${track.targetAmount.toLocaleString()} target</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-400">
                                        {track.contributors} contributors • {track.royaltyShare}% royalty
                                    </div>
                                    <button className="text-purple-300 hover:text-white text-sm font-medium">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "analytics" && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Analytics</h3>
                    <p className="text-gray-400">Analytics dashboard coming soon...</p>
                </div>
            )}
        </div>
    );
}
