import { ContractAddresses } from "@/types";
import { CURRENT_NETWORK } from "@/config/networks";

// Contract addresses - these will be set when contracts are deployed
export const CONTRACT_ADDRESSES: ContractAddresses = {
  tipJar: process.env.NEXT_PUBLIC_TIP_JAR_CONTRACT_ADDRESS || "",
  crowdfund: process.env.NEXT_PUBLIC_CROWDFUND_CONTRACT_ADDRESS || "",
  nft: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "",
  usdc: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || "",
  split: process.env.NEXT_PUBLIC_SPLIT_CONTRACT_ADDRESS || "",
};

// USDC address for current network
export const USDC_ADDRESS = CURRENT_NETWORK.usdcAddress;

// Chain configuration
export const CHAIN_ID = CURRENT_NETWORK.chainId;
