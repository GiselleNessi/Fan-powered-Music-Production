/**
 * Utility functions for transaction handling
 */

/**
 * Generates a mock transaction hash in the proper Ethereum format
 * @returns A 66-character transaction hash (0x + 64 hex characters)
 */
export function generateMockTxHash(): string {
  return "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

/**
 * Validates if a transaction hash is in the correct format
 * @param txHash The transaction hash to validate
 * @returns True if the hash is valid, false otherwise
 */
export function isValidTxHash(txHash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(txHash);
}

/**
 * Gets the Base Sepolia explorer URL for a transaction
 * @param txHash The transaction hash
 * @returns The full URL to view the transaction on Base Sepolia
 */
export function getBaseSepoliaTxUrl(txHash: string): string {
  return `https://sepolia.basescan.org/tx/${txHash}`;
}

/**
 * Example valid transaction hashes for testing
 */
export const EXAMPLE_TX_HASHES = [
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
] as const;
