"use client";

import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { Music, User, Home, Plus, TestTube } from "lucide-react";
import Link from "next/link";
import { CURRENT_NETWORK } from "@/config/networks";

// Create a thirdweb client
const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "demo-client-id",
});

export function Header() {
    return (
        <header className="bg-black/80 backdrop-blur-md border-b border-blue-500/20">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
                        <Music className="h-8 w-8" />
                        <span className="text-xl font-bold">Crowdfund a Track</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
                            <Home className="h-4 w-4" />
                            <span>Discover</span>
                        </Link>
                        <Link href="/portfolio" className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
                            <User className="h-4 w-4" />
                            <span>My Portfolio</span>
                        </Link>
                        <Link href="/artist" className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
                            <User className="h-4 w-4" />
                            <span>Artist Dashboard</span>
                        </Link>
                        <Link href="/create" className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <Plus className="h-4 w-4" />
                            <span>Create Campaign</span>
                        </Link>
                    </nav>

                    {/* Network Indicator & Wallet Connection */}
                    <div className="flex items-center space-x-4">
                        {/* Network Indicator */}
                        <div className="flex items-center space-x-2 px-3 py-1 bg-gray-800 rounded-lg border border-blue-500/20">
                            <TestTube className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-blue-400 font-medium">
                                {CURRENT_NETWORK.name}
                            </span>
                        </div>

                        {/* Wallet Connection */}
                        <ConnectButton
                            client={client}
                            theme="dark"
                        />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="md:hidden mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-around">
                        <Link href="/" className="flex flex-col items-center space-y-1 text-white/80 hover:text-white transition-colors">
                            <Home className="h-5 w-5" />
                            <span className="text-xs">Discover</span>
                        </Link>
                        <Link href="/portfolio" className="flex flex-col items-center space-y-1 text-white/80 hover:text-white transition-colors">
                            <User className="h-5 w-5" />
                            <span className="text-xs">Portfolio</span>
                        </Link>
                        <Link href="/artist" className="flex flex-col items-center space-y-1 text-white/80 hover:text-white transition-colors">
                            <User className="h-5 w-5" />
                            <span className="text-xs">Artist</span>
                        </Link>
                        <Link href="/create" className="flex flex-col items-center space-y-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors">
                            <Plus className="h-5 w-5" />
                            <span className="text-xs">Create</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
