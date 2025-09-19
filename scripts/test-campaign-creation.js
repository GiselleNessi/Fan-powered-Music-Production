#!/usr/bin/env node

/**
 * Test Script for Campaign Creation
 * 
 * This script tests the campaign creation functionality using the thirdweb SDK
 * without needing to use the UI.
 * 
 * Usage: node scripts/test-campaign-creation.js
 */

const { createThirdwebClient, getContract, sendTransaction, defineChain } = require("thirdweb");
const { claimTo } = require("thirdweb/extensions/erc1155");
const { privateKeyToAccount } = require("thirdweb/wallets");
require("dotenv").config({ path: ".env.local" });

// Configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

// Base Sepolia chain configuration
const baseSepolia = defineChain({
    id: 84532,
    name: "Base Sepolia",
    rpc: "https://sepolia.base.org",
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
    blockExplorers: [
        {
            name: "BaseScan",
            url: "https://sepolia.basescan.org",
        },
    ],
});

// Test campaign data
const testCampaign = {
    title: "Good Vibez",
    description: "good vibez only",
    songUrl: "https://open.spotify.com/track/2YNLzBRGyCAzHEGPO3J2Sb?si=087488d5adb14aec",
    artistWallet: "0x44eAD8980ea70901206dd72Ea452E2F336CE9452",
    artistName: "Gi",
    targetAmount: 2,
    raisedAmount: 0,
};

async function testCampaignCreation() {
    try {
        console.log("🚀 Starting campaign creation test...");
        console.log("📊 Test campaign data:", testCampaign);

        // Validate environment variables
        if (!CONTRACT_ADDRESS) {
            throw new Error("NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS not set in environment variables");
        }
        if (!PRIVATE_KEY) {
            throw new Error("PRIVATE_KEY not set in environment variables");
        }
        if (!CLIENT_ID) {
            throw new Error("NEXT_PUBLIC_THIRDWEB_CLIENT_ID not set in environment variables");
        }

        console.log("✅ Environment variables validated");

        // Create thirdweb client
        const client = createThirdwebClient({
            clientId: CLIENT_ID,
        });

        // Create account from private key
        const account = privateKeyToAccount({
            client,
            privateKey: PRIVATE_KEY,
        });

        console.log("✅ Account created:", account.address);

        // Get contract instance
        const contract = getContract({
            client,
            address: CONTRACT_ADDRESS,
            chain: baseSepolia,
        });

        console.log("✅ Contract instance created:", contract.address);

        // Create NFT metadata
        const nftMetadata = {
            name: testCampaign.title,
            description: testCampaign.description,
            image: testCampaign.songUrl,
            attributes: [
                {
                    trait_type: "Artist Name",
                    value: testCampaign.artistName,
                },
                {
                    trait_type: "Artist Wallet",
                    value: testCampaign.artistWallet,
                },
                {
                    trait_type: "Target Amount",
                    value: testCampaign.targetAmount.toString(),
                },
                {
                    trait_type: "Raised Amount",
                    value: testCampaign.raisedAmount.toString(),
                },
                {
                    trait_type: "Created At",
                    value: new Date().toISOString(),
                },
                {
                    trait_type: "Is Active",
                    value: "true",
                },
            ],
        };

        console.log("📝 NFT metadata prepared:", nftMetadata);

        // Claim campaign NFT from ERC1155 Drop contract
        console.log("🎯 Claiming campaign NFT...");

        const claimTransaction = claimTo({
            contract,
            to: account.address, // Claim to the user's wallet
            tokenId: BigInt(0), // Campaign NFT tokenId (you can increment this for each new campaign)
            quantity: BigInt(1), // Claim 1 copy of the campaign NFT
        });

        const claimResult = await sendTransaction({
            transaction: claimTransaction,
            account,
        });

        console.log("✅ Campaign NFT claimed successfully!");
        console.log("🎵 User claimed campaign NFT from ERC1155 Drop contract!");
        console.log("📋 Claim result:", claimResult);

        // Extract transaction hash if available
        if (claimResult.transactionHash) {
            console.log("🔗 Claim transaction hash:", claimResult.transactionHash);
            console.log("🔍 View claim on BaseScan:", `https://sepolia.basescan.org/tx/${claimResult.transactionHash}`);
        }

        console.log("🎉 Test completed successfully!");

    } catch (error) {
        console.error("❌ Test failed:", error);
        console.error("Error details:", error.message);

        if (error.stack) {
            console.error("Stack trace:", error.stack);
        }

        process.exit(1);
    }
}

// Run the test
if (require.main === module) {
    testCampaignCreation();
}

module.exports = { testCampaignCreation, testCampaign };
