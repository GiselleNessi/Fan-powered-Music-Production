"use client";

import { useState } from "react";
import { TrackCard } from "@/components/TrackCard";
import { Hero } from "@/components/Hero";
import { Track, Artist, Tip } from "@/types";

// Mock data - will be replaced with real data from contracts
const mockArtists: Artist[] = [
  {
    id: "1",
    name: "Luna Star",
    walletAddress: "0x44eAD8980ea70901206dd72Ea452E2F336CE9452",
    profileImage: "/api/placeholder/100/100",
    bio: "Electronic music producer creating ethereal soundscapes",
    totalTips: 1250,
    totalInvestments: 3200,
    totalFans: 45,
  },
  {
    id: "2",
    name: "City Beats",
    walletAddress: "0x44eAD8980ea70901206dd72Ea452E2F336CE9452",
    profileImage: "/api/placeholder/100/100",
    bio: "Hip-hop artist bringing urban energy to every track",
    totalTips: 800,
    totalInvestments: 1200,
    totalFans: 12,
  },
  {
    id: "3",
    name: "River Stone",
    walletAddress: "0x44eAD8980ea70901206dd72Ea452E2F336CE9452",
    profileImage: "/api/placeholder/100/100",
    bio: "Singer-songwriter with soulful acoustic melodies",
    totalTips: 950,
    totalInvestments: 2800,
    totalFans: 28,
  },
];

const mockTracks: Track[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: mockArtists[0],
    description: "An ethereal electronic track exploring themes of night and dreams",
    status: "active",
    targetAmount: 5000,
    raisedAmount: 3200,
    contributors: 45,
    imageUrl: "/api/placeholder/300/200",
    audioUrl: "/api/placeholder/audio",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    royaltyShare: 15, // 15% of streaming royalties
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Urban Pulse",
    artist: mockArtists[1],
    description: "A high-energy hip-hop track celebrating city life",
    status: "active",
    targetAmount: 8000,
    raisedAmount: 1200,
    contributors: 12,
    imageUrl: "/api/placeholder/300/200",
    audioUrl: "/api/placeholder/audio",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    royaltyShare: 20, // 20% of streaming royalties
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Acoustic Soul",
    artist: mockArtists[2],
    description: "Intimate acoustic guitar with heartfelt lyrics",
    status: "active",
    targetAmount: 3000,
    raisedAmount: 2800,
    contributors: 28,
    imageUrl: "/api/placeholder/300/200",
    audioUrl: "/api/placeholder/audio",
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    royaltyShare: 10, // 10% of streaming royalties
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

// Mock tips data
const mockTips: Tip[] = [
  {
    id: "1",
    from: "0x1111111111111111111111111111111111111111",
    to: mockArtists[0].walletAddress,
    amount: 25,
    message: "Love this track!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    nftClaimed: false,
  },
  {
    id: "2",
    from: "0x2222222222222222222222222222222222222222",
    to: mockArtists[0].walletAddress,
    amount: 50,
    message: "Can't wait for the full release!",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    nftClaimed: true,
    nftId: "nft-1",
  },
  {
    id: "3",
    from: "0x3333333333333333333333333333333333333333",
    to: mockArtists[1].walletAddress,
    amount: 15,
    message: "Keep it up!",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    nftClaimed: false,
  },
];

export default function Home() {
  const [tips, setTips] = useState<Tip[]>(mockTips);

  const handleTipSent = (newTip: Tip) => {
    setTips(prev => [newTip, ...prev]);
  };

  // Group tips by artist
  const getTipsForArtist = (artistId: string) => {
    return tips.filter(tip => tip.to === mockArtists.find(a => a.id === artistId)?.walletAddress);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Hero />

      {/* Featured Tracks */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Tracks</h2>
          <button className="text-blue-400 hover:text-white transition-colors">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              artist={track.artist}
              tips={getTipsForArtist(track.artist.id)}
              onTipSent={handleTipSent}
            />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Discover Artists</h3>
            <p className="text-gray-300">Browse tracks and artists you love</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Tip or Invest</h3>
            <p className="text-gray-300">Send quick tips or invest in track campaigns</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Get Rewards</h3>
            <p className="text-gray-300">Receive NFTs and unlock exclusive perks</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">4</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Earn Royalties</h3>
            <p className="text-gray-300">Share in streaming revenue from successful tracks</p>
          </div>
        </div>
      </section>
    </div>
  );
}
