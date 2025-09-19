// Core types for the FanVest platform

export interface Artist {
  id: string;
  name: string;
  walletAddress: string;
  profileImage?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    spotify?: string;
  };
  totalTips: number;
  totalInvestments: number;
  totalFans: number;
}

export interface Track {
  id: string;
  title: string;
  artist: Artist;
  description: string;
  audioUrl?: string;
  imageUrl?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  targetAmount: number;
  raisedAmount: number;
  contributors: number;
  deadline: Date;
  royaltyShare: number; // Percentage of streaming royalties to share
  createdAt: Date;
  updatedAt: Date;
}

export interface Tip {
  id: string;
  from: string; // Fan wallet address
  to: string; // Artist wallet address
  amount: number; // USDC amount
  message?: string;
  timestamp: Date;
  nftClaimed: boolean;
  nftId?: string;
}

export interface Investment {
  id: string;
  trackId: string;
  investor: string; // Fan wallet address
  amount: number; // USDC amount
  timestamp: Date;
  nftClaimed: boolean;
  nftId?: string;
  royaltyShare: number; // Percentage of this track's royalties
}

export interface PerkTier {
  name: string;
  minContribution: number; // Total USDC contributed to this artist
  benefits: string[];
  nftTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  color: string;
}

export interface FanPortfolio {
  walletAddress: string;
  totalTipsSent: number;
  totalInvestments: number;
  totalRoyaltiesEarned: number;
  nfts: {
    tipBadges: string[]; // NFT IDs
    investmentNFTs: string[]; // NFT IDs
    perkNFTs: string[]; // NFT IDs
  };
  perkTiers: {
    [artistId: string]: PerkTier;
  };
}

export interface ContractAddresses {
  tipJar: string;
  crowdfund: string;
  nft: string;
  usdc: string;
  split: string;
}

export interface TipJarStats {
  totalTips: number;
  totalAmount: number;
  recentTips: Tip[];
  topTippers: Array<{
    address: string;
    amount: number;
    count: number;
  }>;
}

export interface Campaign {
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

export interface CampaignStats {
  totalCampaigns: number;
  totalRaised: number;
  activeCampaigns: number;
  completedCampaigns: number;
  averageContribution: number;
}

