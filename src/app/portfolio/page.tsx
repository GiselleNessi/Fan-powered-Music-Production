"use client";

import { FanPortfolio } from "@/components/FanPortfolio";
import { FanPortfolio as FanPortfolioType, PerkTier } from "@/types";

// Mock data for fan portfolio
const mockPortfolio: FanPortfolioType = {
    walletAddress: "0x1234567890123456789012345678901234567890",
    totalTipsSent: 150,
    totalInvestments: 500,
    totalRoyaltiesEarned: 25,
    nfts: {
        tipBadges: ["nft-1", "nft-2", "nft-3"],
        investmentNFTs: ["nft-4", "nft-5"],
        perkNFTs: ["nft-6"],
    },
    perkTiers: {
        "artist-1": {
            name: "Supporter",
            minContribution: 50,
            benefits: ["Badge NFT", "Shoutout on social"],
            nftTier: "bronze",
            color: "green",
        },
    },
};

const mockPerkTiers: PerkTier[] = [
    {
        name: "Supporter",
        minContribution: 50,
        benefits: ["Badge NFT", "Shoutout on social"],
        nftTier: "bronze",
        color: "green",
    },
    {
        name: "Fan",
        minContribution: 200,
        benefits: ["Exclusive demo access", "Behind-the-scenes content"],
        nftTier: "silver",
        color: "blue",
    },
    {
        name: "Investor",
        minContribution: 500,
        benefits: ["Concert ticket priority", "Merch discounts", "Royalty share"],
        nftTier: "gold",
        color: "yellow",
    },
    {
        name: "Patron",
        minContribution: 1000,
        benefits: ["1-on-1 video call", "Co-writing session", "Executive producer credit"],
        nftTier: "platinum",
        color: "purple",
    },
];

export default function PortfolioPage() {
    return (
        <FanPortfolio
            portfolio={mockPortfolio}
            perkTiers={mockPerkTiers}
        />
    );
}

