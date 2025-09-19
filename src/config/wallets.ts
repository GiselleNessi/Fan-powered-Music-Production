import { inAppWallet } from "thirdweb/wallets";

export const walletConfig = {
  inAppWallet: inAppWallet({
    // Enable gasless transactions using EIP-7702
    executionMode: {
      mode: "EIP7702",
      sponsorGas: true,
    },
  }),
};

// Account abstraction configuration for gasless transactions
export const accountAbstractionConfig = {
  chain: "base-sepolia", // Base Sepolia testnet
  sponsorGas: true,
};
