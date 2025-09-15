# Crowdfund a Track

A fan-powered music production platform where artists share work-in-progress tracks and fans become investors in their success through USDC contributions.

## Features

- **Artist Dashboard**: Upload tracks, manage campaigns, and track contributions
- **Fan Interface**: Discover tracks, contribute USDC, and earn rewards
- **NFT Rewards**: Contributors receive NFTs as proof of early support
- **Royalty Sharing**: Contributors share in streaming royalties when tracks succeed
- **USDC Integration**: Secure cryptocurrency payments using USDC
- **Thirdweb Integration**: Web3 wallet connection and contract interaction

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Web3**: Thirdweb SDK for wallet connection and contract interaction
- **UI Components**: Lucide React icons, Headless UI
- **Styling**: Tailwind CSS with custom gradients and glassmorphism effects

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Thirdweb account and client ID

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fundraising-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
NEXT_PUBLIC_CROWDFUND_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=usdc_contract_address_here
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=nft_contract_address_here
NEXT_PUBLIC_CHAIN_ID=84532  # Base Sepolia testnet
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── artist/            # Artist dashboard page
│   ├── create/            # Create campaign page
│   ├── layout.tsx         # Root layout with Thirdweb provider
│   └── page.tsx           # Home page with track discovery
├── components/            # Reusable UI components
│   ├── Header.tsx         # Navigation header
│   ├── Hero.tsx           # Hero section
│   └── TrackCard.tsx      # Track card component
└── lib/                   # Utility functions
    └── utils.ts           # Class name utilities
```

## Smart Contracts

The application integrates with smart contracts for:
- Crowdfunding campaigns
- USDC payments
- NFT minting for contributors
- Royalty distribution

Contract addresses will be provided once deployed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
