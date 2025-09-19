// Network configuration for the application

export const NETWORKS = {
  BASE_SEPOLIA: {
    chainId: 84532,
    name: "Base Sepolia",
    rpcUrl: "https://sepolia.base.org",
    explorerUrl: "https://sepolia.basescan.org",
    isTestnet: true,
  },
  BASE_MAINNET: {
    chainId: 8453,
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    isTestnet: false,
  },
} as const;

// Use Base Sepolia for testing
export const CURRENT_NETWORK = NETWORKS.BASE_SEPOLIA;

// USDC Contract Addresses
export const USDC_CONTRACT_ADDRESS = {
  BASE_SEPOLIA: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
  BASE_MAINNET: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base Mainnet USDC
} as const;

// Helper function to get network info
export function getNetworkInfo(chainId: number) {
  return Object.values(NETWORKS).find(network => network.chainId === chainId) || CURRENT_NETWORK;
}

// Helper function to check if we're on testnet
export function isTestnet(chainId?: number) {
  const network = chainId ? getNetworkInfo(chainId) : CURRENT_NETWORK;
  return network.isTestnet;
}

