#!/usr/bin/env node

/**
 * Test Script for Campaign Creation using Thirdweb REST API
 * 
 * This script tests the campaign creation functionality using the thirdweb REST API
 * which might be more reliable than the SDK approach.
 * 
 * Usage: node scripts/test-campaign-rest-api.js
 */

require("dotenv").config({ path: ".env.local" });

// Configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS;
const SECRET_KEY = process.env.NEXT_PUBLIC_THIRDWEB_SECRET;
const WALLET_ADDRESS = "0x44eAD8980ea70901206dd72Ea452E2F336CE9452"; // Your wallet address

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

async function testCampaignCreationWithRestAPI() {
    try {
        console.log("🚀 Starting campaign creation test with REST API...");
        console.log("📊 Test campaign data:", testCampaign);

        // Validate environment variables
        if (!CONTRACT_ADDRESS) {
            throw new Error("NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS not set in environment variables");
        }
        if (!SECRET_KEY) {
            throw new Error("NEXT_PUBLIC_THIRDWEB_SECRET not set in environment variables");
        }

        console.log("✅ Environment variables validated");
        console.log("📋 Contract address:", CONTRACT_ADDRESS);

        // Create campaign metadata
        const campaignMetadata = {
            name: testCampaign.title,
            description: testCampaign.description,
            image: testCampaign.songUrl,
            properties: {
                artistName: testCampaign.artistName,
                artistWallet: testCampaign.artistWallet,
                targetAmount: testCampaign.targetAmount.toString(),
                raisedAmount: testCampaign.raisedAmount.toString(),
                createdAt: new Date().toISOString(),
                isActive: "true"
            }
        };

        console.log("📝 Campaign metadata prepared:", campaignMetadata);

        // First, try lazy minting
        console.log("🎨 Step 1: Lazy minting NFT...");

        const lazyMintResponse = await fetch("https://api.thirdweb.com/v1/contracts/write", {
            method: "POST",
            headers: {
                "x-secret-key": SECRET_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                calls: [
                    {
                        contractAddress: CONTRACT_ADDRESS,
                        method: "function lazyMint(uint256 _amount, string _baseURIForTokens, bytes _data) returns (uint256 batchId)",
                        params: [
                            1, // _amount - number of NFTs to prepare
                            JSON.stringify(campaignMetadata), // _baseURIForTokens - metadata
                            "0x" // _data - empty bytes
                        ],
                    },
                ],
                chainId: 84532, // Base Sepolia
                from: WALLET_ADDRESS,
            }),
        });

        if (!lazyMintResponse.ok) {
            const errorText = await lazyMintResponse.text();
            console.error("❌ Lazy mint error:", errorText);
            throw new Error(`Failed to lazy mint: ${lazyMintResponse.status} ${lazyMintResponse.statusText} - ${errorText}`);
        }

        const lazyMintResult = await lazyMintResponse.json();
        console.log("✅ Lazy mint result:", lazyMintResult);

        // Then try claiming the NFT
        console.log("🎯 Step 2: Claiming NFT...");

        const claimResponse = await fetch("https://api.thirdweb.com/v1/contracts/write", {
            method: "POST",
            headers: {
                "x-secret-key": SECRET_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                calls: [
                    {
                        contractAddress: CONTRACT_ADDRESS,
                        method: "function claim(address _receiver, uint256 _quantity, address _currency, uint256 _pricePerToken, bytes32[] _proofs, uint256 _proofMaxQuantityPerTransaction) payable",
                        params: [
                            WALLET_ADDRESS, // _receiver - recipient address
                            1, // _quantity - number of NFTs to claim
                            "0x0000000000000000000000000000000000000000", // _currency - ETH (zero address)
                            0, // _pricePerToken - free claim
                            [], // _proofs - empty array
                            1 // _proofMaxQuantityPerTransaction
                        ],
                    },
                ],
                chainId: 84532, // Base Sepolia
                from: WALLET_ADDRESS,
            }),
        });

        if (!claimResponse.ok) {
            const errorText = await claimResponse.text();
            console.error("❌ Claim error:", errorText);
            throw new Error(`Failed to claim: ${claimResponse.status} ${claimResponse.statusText} - ${errorText}`);
        }

        const claimResult = await claimResponse.json();
        console.log("✅ Claim result:", claimResult);

        // Check for transaction IDs
        if (claimResult.result && claimResult.result.transactionIds) {
            console.log("🎉 Campaign NFT created successfully!");
            console.log("🎵 New campaign created on NFT Drop contract!");
            console.log("📋 Transaction IDs:", claimResult.result.transactionIds);

            // You can use these transaction IDs to track the transactions
            claimResult.result.transactionIds.forEach((txId, index) => {
                console.log(`🔗 Transaction ${index + 1}: ${txId}`);
            });
        } else {
            console.log("⚠️ Contract call succeeded but no transaction IDs returned");
            console.log("📋 Full result:", claimResult);
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
    testCampaignCreationWithRestAPI();
}

module.exports = { testCampaignCreationWithRestAPI, testCampaign };
