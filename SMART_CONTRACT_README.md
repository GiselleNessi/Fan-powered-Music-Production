# Smart Contract Implementation

This document explains the smart contract implementation for the Artist Campaign Platform.

## Overview

The platform now uses **ERC-1155 Edition Drop** contracts to store campaign data on the blockchain, providing:

- ✅ **Cross-browser persistence** - Campaigns visible to all users
- ✅ **Decentralized storage** - No single point of failure
- ✅ **Gasless transactions** - EIP-7702 implementation
- ✅ **Base Sepolia testnet** - Safe testing environment

## Architecture

### Smart Contract: Edition Drop (ERC-1155)

**Why ERC-1155?**
- Lower gas costs compared to ERC-721
- Better for multiple campaigns
- Efficient batch operations
- Flexible metadata updates

### Contract Structure

```solidity
// Each campaign is stored as an NFT with metadata:
{
  name: "Campaign Title",
  description: "Campaign description",
  image: "Song URL",
  properties: {
    artistName: "Artist Name",
    artistWallet: "0x...",
    targetAmount: "0.1",
    raisedAmount: "0.05",
    createdAt: "1234567890",
    isActive: "true"
  }
}
```

## Implementation Files

### 1. Contract Configuration (`src/lib/contracts.ts`)
- Contract deployment logic
- Contract instance creation
- Base Sepolia chain configuration

### 2. Campaign Hook (`src/hooks/useCampaigns.ts`)
- Load campaigns from contract
- Create new campaigns
- Update raised amounts
- Error handling

### 3. Wallet Configuration (`src/config/wallets.ts`)
- EIP-7702 gasless transactions
- In-app wallet setup

### 4. Deployment Script (`scripts/deploy-contract.js`)
- Automated contract deployment
- Environment validation
- Contract address output

## Deployment Process

### 1. Set Environment Variables

Create `.env.local`:
```bash
# Required
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
PRIVATE_KEY=your_private_key_for_deployment

# Optional (set after deployment)
NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS=0x...
```

### 2. Deploy Contract

```bash
# Install dependencies
npm install

# Deploy to Base Sepolia
node scripts/deploy-contract.js
```

### 3. Update Environment

After deployment, add the contract address to `.env.local`:
```bash
NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS=0x1234...
```

### 4. Restart Development Server

```bash
npm run dev
```

## Gasless Transactions (EIP-7702)

### Benefits
- **No gas fees** for users
- **Better UX** - no need for ETH
- **Mobile friendly** - seamless experience
- **Sponsored by thirdweb** - they handle costs

### Implementation
```typescript
const walletConfig = {
  inAppWallet: inAppWallet({
    executionMode: {
      mode: "EIP7702",
      sponsorGas: true,
    },
  }),
};
```

## User Flow

### Creating a Campaign
1. User clicks "Create Campaign"
2. Fills out campaign form
3. Submits (gasless transaction)
4. Campaign stored on blockchain
5. Visible to all users immediately

### Tipping an Artist
1. User clicks "Support Artist"
2. Enters tip amount
3. Sends Base ETH (gasless transaction)
4. Raised amount updated on blockchain
5. All users see updated amount

## Cost Breakdown

### Contract Deployment
- **One-time cost**: ~0.01-0.05 Base ETH
- **Deployer pays**: You (using private key)

### Campaign Creation
- **Cost**: ~0.001-0.005 Base ETH per campaign
- **Who pays**: Campaign creator (gasless with EIP-7702)

### Tips
- **Cost**: ~0.0001-0.0005 Base ETH per tip
- **Who pays**: Tipper (gasless with EIP-7702)

### Reading Data
- **Cost**: Free (API calls)
- **Who pays**: No one

## Testing

### Base Sepolia Testnet
- **Chain ID**: 84532
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

### Test Flow
1. Get Base ETH from faucet
2. Deploy contract
3. Create test campaign
4. Send test tip
5. Verify on explorer

## Production Deployment

### Switch to Base Mainnet
1. Update chain ID to 8453
2. Deploy contract to mainnet
3. Update environment variables
4. Test thoroughly

### Security Considerations
- Contract is audited (thirdweb pre-built)
- No private keys in frontend
- All transactions are transparent
- Users control their wallets

## Troubleshooting

### Common Issues

**"Contract address not set"**
- Deploy contract first
- Add address to .env.local
- Restart dev server

**"Transaction failed"**
- Check wallet connection
- Ensure sufficient Base ETH
- Verify network (Base Sepolia)

**"Campaigns not loading"**
- Check contract address
- Verify network connection
- Check browser console for errors

### Support
- Check thirdweb documentation
- Verify Base network status
- Test with small amounts first

## Future Enhancements

### Potential Features
- Campaign categories
- Artist verification
- Social features
- Analytics dashboard
- Mobile app

### Technical Improvements
- IPFS metadata storage
- Multi-signature wallets
- Campaign milestones
- Automated payouts

---

**Built on Base • Powered by thirdweb** 🚀
