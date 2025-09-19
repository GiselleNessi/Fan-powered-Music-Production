# Artist Campaign Platform

A simple Next.js application that allows artists to create campaigns for their tracks and receive Base ETH tips directly from fans. Built on Base and powered by thirdweb for Web3 functionality.

## Features

- **For Artists**: Create campaigns with track links, artist info, and wallet addresses
- **For Fans**: Browse campaigns, listen to tracks, and send Base ETH tips directly to artists
- **Web3 Integration**: Uses thirdweb for wallet connection and native Base ETH transfers
- **Base Blockchain**: Runs on Base Sepolia testnet for safe testing
- **Simple UI**: Clean, mobile-first design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Web3**: thirdweb React SDK, Base blockchain
- **Token**: Native Base ETH transfers
- **Styling**: Tailwind CSS with custom dark theme

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Required: thirdweb Client ID
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
```

### Getting a thirdweb Client ID

1. Go to [thirdweb.com](https://thirdweb.com)
2. Sign up for an account
3. Create a new project
4. Copy your Client ID from the dashboard
5. Add it to your `.env.local` file

## Network Configuration

### Base Sepolia (Current - Testing)
- **Chain ID**: 84532
- **Token**: Native Base ETH
- **Explorer**: [sepolia.basescan.org](https://sepolia.basescan.org)
- **RPC**: https://sepolia.base.org

### Base Mainnet (Production Ready)
- **Chain ID**: 8453
- **Token**: Native Base ETH
- **Explorer**: [basescan.org](https://basescan.org)
- **RPC**: https://mainnet.base.org

**Note**: This application is currently configured to use Base Sepolia testnet for safe testing. To switch to mainnet, update the chain configuration in the code.

## Getting Base ETH for Testing

### Base Sepolia (Testnet)
1. Get Base ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Bridge to Base Sepolia
3. Use the test Base ETH for tipping

### Base Mainnet
1. Bridge ETH from Ethereum to Base using [Base Bridge](https://bridge.base.org/)
2. Or buy Base ETH directly on Base through exchanges

## Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Artists

1. **Create a Campaign**:
   - Go to `/campaigns` and click "Create Campaign"
   - Fill in your campaign details:
     - Campaign title
     - Artist name
     - Song URL (Spotify, YouTube, SoundCloud, etc.)
     - Your wallet address
     - Description (optional)
     - Target amount (optional)
   - Click "Create Campaign"

2. **Share Your Campaign**:
   - Your campaign will appear on the campaigns page
   - Share the campaigns page URL with your fans
   - Fans can browse and support your campaign directly

### For Fans

1. **Browse Campaigns**:
   - Go to `/campaigns` to see all available campaigns
   - Click on any campaign to view details and listen to the track

2. **Support an Artist**:
   - Click "Support Artist" on any campaign
   - Connect your wallet (MetaMask, Coinbase Wallet, etc.)
   - Enter the tip amount in Base ETH
   - Click "Send Tip" and confirm the transaction
   - View the transaction on BaseScan

## Supported Music Platforms

- Spotify
- YouTube
- SoundCloud
- Bandcamp
- Apple Music
- Any valid URL (will be displayed as a clickable link)

## Project Structure

```
src/
├── app/
│   ├── campaigns/      # Campaign browsing and creation page
│   ├── create/         # Legacy create tip link page
│   ├── tip/           # Legacy tip page for fans
│   ├── layout.tsx     # Root layout with thirdweb provider
│   └── page.tsx       # Homepage
├── components/        # Reusable components
├── config/
│   └── networks.ts    # Network configuration
├── lib/
│   └── utils.ts       # Utility functions
└── types/
    └── index.ts       # TypeScript type definitions
```

## Key Features

### Address Validation
- Validates Ethereum addresses using regex
- Shows validation feedback in real-time

### Base ETH Handling
- Proper 18-decimal handling for Base ETH
- Amount parsing and formatting utilities
- Transaction state management

### Error Handling
- Environment variable validation
- Transaction error states
- User-friendly error messages

### Mobile-First Design
- Responsive layout
- Touch-friendly interface
- Optimized for mobile wallets

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Security Considerations

- All transactions are client-side and transparent
- No private keys are stored or transmitted
- Users maintain full control of their wallets
- Smart contract interactions are read-only except for transfers

## Troubleshooting

### Common Issues

1. **"Missing Environment Variables" error**:
   - Ensure all required environment variables are set in `.env.local`
   - Restart the development server after adding variables

2. **Wallet connection issues**:
   - Make sure you're on the correct network (Base Mainnet/Sepolia)
   - Try refreshing the page and reconnecting your wallet

3. **Transaction failures**:
   - Ensure you have sufficient Base ETH for gas fees and tips
   - Check that you have enough Base ETH balance
   - Verify the recipient address is correct

4. **Network mismatch**:
   - The app will show which network it's configured for
   - Switch your wallet to the correct network

### Getting Help

- Check the browser console for error messages
- Verify your environment variables are correct
- Ensure you're using a supported wallet
- Test on Base Sepolia first before using mainnet

## License

MIT License - feel free to use this code for your own projects.

## Built on Base • Powered by thirdweb

This application is built on the Base blockchain and powered by thirdweb's Web3 infrastructure:

- **Base**: A secure, low-cost, developer-friendly Ethereum L2 built by Coinbase
- **thirdweb**: Complete Web3 development framework with React components, SDKs, and infrastructure

### Why Base + thirdweb?

- **Base**: Fast, cheap transactions with Ethereum security
- **thirdweb**: Simplified Web3 development with pre-built components
- **Perfect Match**: Base's performance + thirdweb's developer experience

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.