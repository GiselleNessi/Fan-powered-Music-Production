import { getContract, createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// Create thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Define Base Sepolia chain
export const baseSepolia = defineChain({
  id: 84532,
  name: "Base Sepolia",
  rpc: "https://sepolia.base.org",
  nativeCurrency: {
    name: "Base ETH",
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

// Campaign contract address (will be set after deployment)
export const CAMPAIGN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS || "";

// Get campaign contract instance
export function getCampaignContract() {
  if (!CAMPAIGN_CONTRACT_ADDRESS) {
    throw new Error("Campaign contract address not set");
  }
  
  return getContract({
    client,
    chain: baseSepolia,
    address: CAMPAIGN_CONTRACT_ADDRESS,
  });
}

// Deploy campaign contract
export async function deployCampaignContract(_account: unknown) {
  // For now, return a placeholder - actual deployment would require server-side code
  // or a different approach since thirdweb v5 doesn't support client-side deployment
  throw new Error("Contract deployment requires server-side implementation");
}
