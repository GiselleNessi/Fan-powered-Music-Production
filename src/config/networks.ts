// Network configuration for the application

export const NETWORKS = {
  BASE_SEPOLIA: {
    chainId: 84532,
    name: "Base Sepolia",
    rpcUrl: "https://sepolia.base.org",
    explorerUrl: "https://sepolia.basescan.org",
    usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    isTestnet: true,
  },
  BASE_MAINNET: {
    chainId: 8453,
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    isTestnet: false,
  },
} as const;

// Current network configuration
export const CURRENT_NETWORK = NETWORKS.BASE_SEPOLIA;

// Helper function to get network info
export function getNetworkInfo(chainId: number) {
  return Object.values(NETWORKS).find(network => network.chainId === chainId) || CURRENT_NETWORK;
}

// Helper function to check if we're on testnet
export function isTestnet(chainId?: number) {
  const network = chainId ? getNetworkInfo(chainId) : CURRENT_NETWORK;
  return network.isTestnet;
}
