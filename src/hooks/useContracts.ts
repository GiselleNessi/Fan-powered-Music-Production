"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { generateMockTxHash } from "@/utils/transactionUtils";

// Mock hooks for development - replace with actual contract hooks when contracts are deployed
export function useContractInstances() {
  return {
    tipJarContract: null,
    crowdfundContract: null,
    usdcContract: null,
  };
}

// Mock hook for tip jar operations
export function useTipJar() {
  const [isSendingTip, setIsSendingTip] = useState(false);
  const [isClaimingBadge, setIsClaimingBadge] = useState(false);
  const [isApprovingUSDC, setIsApprovingUSDC] = useState(false);
  const account = useActiveAccount();

  const sendTip = async ({ args }: { args: [string, bigint, string] }) => {
    if (!account) throw new Error("No account connected");
    
    setIsSendingTip(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.1; // 90% success rate
      
      if (!isSuccess) {
        throw new Error("Transaction failed - network error");
      }
      
      // Generate mock transaction hash (proper 66-character format)
      const mockTxHash = generateMockTxHash();
      
      setIsSendingTip(false);
      console.log("Mock tip sent:", args);
      
      return { success: true, txHash: mockTxHash };
    } catch (error) {
      setIsSendingTip(false);
      throw error;
    }
  };

  const claimTipBadge = async ({ args }: { args: [bigint] }) => {
    if (!account) throw new Error("No account connected");
    
    setIsClaimingBadge(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsClaimingBadge(false);
    
    console.log("Mock badge claimed:", args);
  };

  const approveUSDC = async ({ args }: { args: [string, bigint] }) => {
    if (!account) throw new Error("No account connected");
    
    setIsApprovingUSDC(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.05; // 95% success rate
      
      if (!isSuccess) {
        throw new Error("Approval failed - insufficient allowance");
      }
      
      setIsApprovingUSDC(false);
      console.log("Mock USDC approved:", args);
      
      return { success: true };
    } catch (error) {
      setIsApprovingUSDC(false);
      throw error;
    }
  };

  return {
    sendTip,
    claimTipBadge,
    approveUSDC,
    isSendingTip,
    isClaimingBadge,
    isApprovingUSDC,
  };
}

// Mock hook for crowdfunding operations
export function useCrowdfunding() {
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [isApprovingUSDC, setIsApprovingUSDC] = useState(false);
  const account = useActiveAccount();

  const createCampaign = async ({ args }: { args: [string, string, bigint, bigint, bigint] }) => {
    if (!account) throw new Error("No account connected");
    
    setIsCreatingCampaign(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCreatingCampaign(false);
    
    console.log("Mock campaign created:", args);
  };

  const contribute = async ({ args }: { args: [bigint, bigint] }) => {
    if (!account) throw new Error("No account connected");
    
    setIsContributing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.1; // 90% success rate
      
      if (!isSuccess) {
        throw new Error("Transaction failed - insufficient funds");
      }
      
      // Generate mock transaction hash (proper 66-character format)
      const mockTxHash = generateMockTxHash();
      
      setIsContributing(false);
      console.log("Mock contribution made:", args);
      
      return { success: true, txHash: mockTxHash };
    } catch (error) {
      setIsContributing(false);
      throw error;
    }
  };

  const approveUSDC = async ({ args }: { args: [string, bigint] }) => {
    if (!account) throw new Error("No account connected");
    
    setIsApprovingUSDC(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.05; // 95% success rate
      
      if (!isSuccess) {
        throw new Error("Approval failed - insufficient allowance");
      }
      
      setIsApprovingUSDC(false);
      console.log("Mock USDC approved:", args);
      
      return { success: true };
    } catch (error) {
      setIsApprovingUSDC(false);
      throw error;
    }
  };

  return {
    createCampaign,
    contribute,
    approveUSDC,
    isCreatingCampaign,
    isContributing,
    isApprovingUSDC,
  };
}