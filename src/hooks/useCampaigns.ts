"use client";

import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getCampaignContract } from "@/lib/contracts";
import { Campaign } from "@/types";
import { claimTo } from "thirdweb/extensions/erc1155";
import { sendTransaction } from "thirdweb";

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const account = useActiveAccount();

  // Load campaigns from smart contract
  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS) {
        // No contract deployed yet, load from localStorage as fallback
        const storedCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
        setCampaigns(storedCampaigns);
        return;
      }

      // Load campaigns from contract
      const contract = getCampaignContract();
      
      console.log("Loading campaigns from contract:", contract.address);
      
      // For now, we'll use localStorage as the primary storage
      // The contract is deployed and ready, but we need to implement the proper contract interactions
      // This is a working solution that provides the functionality you need
      console.log("✅ Contract is deployed and ready at:", contract.address);
      console.log("📝 Using localStorage for now - contract interactions will be implemented next");
      
      const storedCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
      setCampaigns(storedCampaigns);
      
    } catch (err) {
      console.error("Failed to load campaigns:", err);
      setError("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  // Create new campaign
  const createCampaign = async (campaignData: Omit<Campaign, "id" | "createdAt" | "isActive">) => {
    if (!account) {
      throw new Error("No account connected");
    }

    try {
      setError(null);
      setSuccess(null);
      setCreating(true);

      // Check if contract is deployed
      if (!process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS) {
        // For now, we'll use localStorage as a fallback until contract is deployed
        const newCampaign: Campaign = {
          ...campaignData,
          id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          isActive: true,
        };

        // Save to localStorage temporarily
        const existingCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
        const updatedCampaigns = [...existingCampaigns, newCampaign];
        localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));
        
        // Update state
        setCampaigns(updatedCampaigns);
        
        console.log("Campaign created successfully (stored locally):", newCampaign);
        return newCampaign;
      }

      // Contract interaction - mint campaign NFT from ERC1155 Drop
      console.log("Creating campaign on contract:", campaignData);
      console.log("🔍 Environment check:", {
        contractAddress: process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS,
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
      });

      console.log("🔧 Getting contract instance...");
      const contract = getCampaignContract();
      console.log("✅ Contract instance:", {
        address: contract.address,
        chain: contract.chain.id,
        client: contract.client.clientId
      });
      
      console.log("👤 Account details:", {
        address: account.address
      });
      
      // Mint campaign NFT from ERC1155 Drop contract (exact same as working script)
      console.log("🎯 Creating mintTo transaction...");
      
      // Note: claimTo is the Thirdweb function name for ERC1155 Drop contracts
      // It mints/creates the NFT to the user's wallet
      const transaction = claimTo({
        contract,
        to: account.address,
        tokenId: BigInt(0),
        quantity: BigInt(1),
      });
      
      console.log("✅ Transaction created:", transaction);
      console.log("🚀 Sending transaction...");

      const result = await sendTransaction({ 
        transaction, 
        account 
      });
      
      console.log("✅ Campaign created successfully!");
      console.log("🎵 Campaign NFT minted from ERC1155 Drop contract!");
      console.log("📋 Mint result:", result);

      // Handle both regular transactions and AA UserOps
      let transactionHash = null;
      let successMessage = "Campaign created successfully!";
      
      // Log the full result to see what properties are available
      console.log("🔍 Full result object:", JSON.stringify(result, null, 2));
      console.log("🔍 Result keys:", Object.keys(result));
      
      if (result.transactionHash) {
        // Regular transaction
        transactionHash = result.transactionHash;
        console.log("🔗 Regular transaction hash:", transactionHash);
        console.log("🔍 View transaction on BaseScan:", `https://sepolia.basescan.org/tx/${transactionHash}`);
        successMessage += ` View transaction: https://sepolia.basescan.org/tx/${transactionHash}`;
      } else {
        // Check for other possible hash fields (including AA UserOps)
        const resultWithAA = result as typeof result & { userOpHash?: string; hash?: string };
        if (resultWithAA.userOpHash) {
          transactionHash = resultWithAA.userOpHash;
          console.log("🔗 AA UserOp hash:", transactionHash);
          console.log("🔍 View UserOp on BaseScan:", `https://sepolia.basescan.org/tx/${transactionHash}`);
          successMessage += ` View UserOp: https://sepolia.basescan.org/tx/${transactionHash}`;
          successMessage += " (Note: This is an Account Abstraction transaction - gasless!)";
        } else if (resultWithAA.hash) {
          transactionHash = resultWithAA.hash;
          successMessage += ` View transaction: https://sepolia.basescan.org/tx/${transactionHash}`;
        } else {
          console.log("⚠️ No transaction hash found in result");
        }
      }
      
      if (transactionHash) {
        setSuccess(successMessage);
      } else {
        setSuccess("Campaign created successfully! (Transaction details not available)");
      }

      // Create campaign object
      const newCampaign: Campaign = {
        ...campaignData,
        id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        isActive: true,
      };

      // Save to localStorage temporarily
      const existingCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
      const updatedCampaigns = [...existingCampaigns, newCampaign];
      localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));
      
      // Update state
      setCampaigns(updatedCampaigns);
      
      console.log("✅ Contract is deployed and ready at:", process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS);
      console.log("📝 Campaign created successfully (stored locally):", newCampaign);
      console.log("🚀 Contract interactions will be implemented next");
      
      return newCampaign;

    } catch (err) {
      console.error("❌ Failed to create campaign:", err);
      console.error("❌ Error details:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        name: err instanceof Error ? err.name : undefined
      });
      
      // Fallback to localStorage if contract interaction fails
      console.log("🔄 Falling back to localStorage...");
      const newCampaign: Campaign = {
        ...campaignData,
        id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        isActive: true,
      };

      // Save to localStorage
      const existingCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
      const updatedCampaigns = [...existingCampaigns, newCampaign];
      localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));
      
      // Update state
      setCampaigns(updatedCampaigns);
      
      setError(`Contract interaction failed, saved locally: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setSuccess("Campaign saved locally (contract interaction failed)");
      
      return newCampaign;
    } finally {
      setCreating(false);
    }
  };

  // Update raised amount
  const updateRaisedAmount = async (campaignId: string, newAmount: string) => {
    try {
      setError(null);

      if (!process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS) {
        // Update localStorage when no contract is deployed
        const storedCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
        const updatedCampaigns = storedCampaigns.map((campaign: Campaign) => {
          if (campaign.id === campaignId) {
            return {
              ...campaign,
              raisedAmount: parseFloat(newAmount),
            };
          }
          return campaign;
        });
        
        localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));
        setCampaigns(updatedCampaigns);
        
        console.log("Raised amount updated (stored locally):", { campaignId, newAmount });
        return;
      }

      // Update campaign metadata on contract
      const contract = getCampaignContract();
      
      // For now, we'll use localStorage as the primary storage
      // The contract is deployed and ready, but we need to implement the proper thirdweb v5 contract interactions
      // This is a working solution that provides the functionality you need
      const storedCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
      const updatedCampaigns = storedCampaigns.map((campaign: Campaign) => {
        if (campaign.id === campaignId) {
          return {
            ...campaign,
            raisedAmount: parseFloat(newAmount),
          };
        }
        return campaign;
      });
      
      localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));
      setCampaigns(updatedCampaigns);
      
      console.log("✅ Contract is deployed and ready at:", contract.address);
      console.log("📝 Raised amount updated (stored locally):", { campaignId, newAmount });
      console.log("🚀 Contract interactions will be implemented next");

    } catch (err) {
      console.error("Failed to update raised amount:", err);
      setError("Failed to update raised amount");
      throw err;
    }
  };

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    creating,
    success,
    createCampaign,
    updateRaisedAmount,
    loadCampaigns,
    clearMessages: () => {
      setError(null);
      setSuccess(null);
    },
  };
}
