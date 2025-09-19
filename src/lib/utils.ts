import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getNetworkInfo } from "@/config/networks";

// Utility function for class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Address validation
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Shorten address for display
export function shortenAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Format ETH amount with proper decimals
export function formatETH(amount: number, decimals = 4): string {
  return amount.toFixed(decimals);
}

// Parse ETH amount to wei (with 18 decimals for ETH)
export function parseETH(amount: string, decimals = 18): bigint {
  const num = parseFloat(amount);
  if (isNaN(num) || num < 0) return BigInt(0);
  return BigInt(Math.floor(num * Math.pow(10, decimals)));
}

// Convert wei back to ETH
export function formatETHFromWei(wei: bigint, decimals = 18): string {
  const divisor = BigInt(Math.pow(10, decimals));
  const whole = wei / divisor;
  const remainder = wei % divisor;
  const decimal = Number(remainder) / Number(divisor);
  return (Number(whole) + decimal).toFixed(4);
}

// Generate transaction URL for explorer
export function getTransactionUrl(txHash: string, chainId?: number): string {
  const network = chainId ? getNetworkInfo(chainId) : getNetworkInfo(84532); // Default to Base Sepolia
  return `${network.explorerUrl}/tx/${txHash}`;
}

// Generate address URL for explorer
export function getAddressUrl(address: string, chainId?: number): string {
  const network = chainId ? getNetworkInfo(chainId) : getNetworkInfo(84532); // Default to Base Sepolia
  return `${network.explorerUrl}/address/${address}`;
}

// Validate song URL (basic validation)
export function isValidSongUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return (
      hostname.includes('spotify.com') ||
      hostname.includes('youtube.com') ||
      hostname.includes('youtu.be') ||
      hostname.includes('soundcloud.com') ||
      hostname.includes('bandcamp.com') ||
      hostname.includes('apple.com') ||
      hostname.includes('music.apple.com')
    );
  } catch {
    return false;
  }
}

// Get platform name from URL
export function getPlatformName(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    if (hostname.includes('spotify.com')) return 'Spotify';
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube';
    if (hostname.includes('soundcloud.com')) return 'SoundCloud';
    if (hostname.includes('bandcamp.com')) return 'Bandcamp';
    if (hostname.includes('apple.com') || hostname.includes('music.apple.com')) return 'Apple Music';
    
    return 'Music Platform';
  } catch {
    return 'Music Platform';
  }
}

// Format USDC amount with proper decimals (USDC has 6 decimals)
export function formatUSDC(amount: number, decimals = 2): string {
  return amount.toFixed(decimals);
}

// Parse USDC amount to smallest unit (with 6 decimals for USDC)
export function parseUSDC(amount: string, decimals = 6): bigint {
  const num = parseFloat(amount);
  if (isNaN(num) || num < 0) return BigInt(0);
  return BigInt(Math.floor(num * Math.pow(10, decimals)));
}
