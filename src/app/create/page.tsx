"use client";

import { useState } from "react";
import { isValidAddress, isValidSongUrl, getPlatformName } from "@/lib/utils";
import { Copy, ExternalLink, Music, Wallet } from "lucide-react";

export default function CreatePage() {
    const [songUrl, setSongUrl] = useState("");
    const [artistWallet, setArtistWallet] = useState("");
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [errors, setErrors] = useState<{ songUrl?: string; artistWallet?: string }>({});

    const validateInputs = () => {
        const newErrors: { songUrl?: string; artistWallet?: string } = {};

        if (!songUrl.trim()) {
            newErrors.songUrl = "Song URL is required";
        } else if (!isValidSongUrl(songUrl)) {
            newErrors.songUrl = "Please enter a valid music platform URL (Spotify, YouTube, SoundCloud, etc.)";
        }

        if (!artistWallet.trim()) {
            newErrors.artistWallet = "Artist wallet address is required";
        } else if (!isValidAddress(artistWallet)) {
            newErrors.artistWallet = "Please enter a valid Ethereum address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateLink = () => {
        if (!validateInputs()) return;

        const encodedSong = encodeURIComponent(songUrl.trim());
        const link = `${window.location.origin}/tip?song=${encodedSong}&to=${artistWallet.trim()}`;
        setGeneratedLink(link);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const checkEnvironment = () => {
        const missingVars = [];
        if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) missingVars.push("NEXT_PUBLIC_THIRDWEB_CLIENT_ID");
        return missingVars;
    };

    const missingEnvVars = checkEnvironment();

    if (missingEnvVars.length > 0) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-red-400 mb-4">Missing Environment Variables</h2>
                    <p className="text-gray-300 mb-4">
                        The following environment variables are required to run this application:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        {missingEnvVars.map((varName) => (
                            <li key={varName} className="font-mono text-sm">{varName}</li>
                        ))}
                    </ul>
                    <p className="text-gray-300 mt-4">
                        Please check your .env.local file and ensure all required variables are set.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Create Tip Link</h1>
                <p className="text-gray-300 text-lg">
                    Share your music and wallet address to receive tips from fans
                </p>
            </div>

            {/* Form */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
                <div className="space-y-6">
                    {/* Song URL Input */}
                    <div>
                        <label htmlFor="songUrl" className="block text-sm font-medium text-white mb-2">
                            <Music className="inline w-4 h-4 mr-2" />
                            Song URL
                        </label>
                        <input
                            id="songUrl"
                            type="url"
                            value={songUrl}
                            onChange={(e) => setSongUrl(e.target.value)}
                            placeholder="https://open.spotify.com/track/..."
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.songUrl && (
                            <p className="mt-2 text-sm text-red-400">{errors.songUrl}</p>
                        )}
                        {songUrl && isValidSongUrl(songUrl) && (
                            <p className="mt-2 text-sm text-green-400">
                                ✓ {getPlatformName(songUrl)} link detected
                            </p>
                        )}
                    </div>

                    {/* Artist Wallet Input */}
                    <div>
                        <label htmlFor="artistWallet" className="block text-sm font-medium text-white mb-2">
                            <Wallet className="inline w-4 h-4 mr-2" />
                            Artist Wallet Address
                        </label>
                        <input
                            id="artistWallet"
                            type="text"
                            value={artistWallet}
                            onChange={(e) => setArtistWallet(e.target.value)}
                            placeholder="0x..."
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                        />
                        {errors.artistWallet && (
                            <p className="mt-2 text-sm text-red-400">{errors.artistWallet}</p>
                        )}
                        {artistWallet && isValidAddress(artistWallet) && (
                            <p className="mt-2 text-sm text-green-400">
                                ✓ Valid Ethereum address
                            </p>
                        )}
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generateLink}
                        disabled={!songUrl.trim() || !artistWallet.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Generate Tip Link
                    </button>
                </div>
            </div>

            {/* Generated Link */}
            {generatedLink && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-4">Your Tip Link is Ready!</h3>

                    {/* Preview */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-400 mb-1">Track Link</p>
                                <a
                                    href={songUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-2 truncate"
                                >
                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                    {getPlatformName(songUrl)} - {songUrl}
                                </a>
                            </div>
                        </div>
                        <div className="mt-3">
                            <p className="text-sm text-gray-400 mb-1">Artist Wallet</p>
                            <p className="text-white font-mono text-sm">{artistWallet}</p>
                        </div>
                    </div>

                    {/* Shareable Link */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-white">
                            Shareable Tip Link
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={generatedLink}
                                readOnly
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm font-mono"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
                            >
                                <Copy className="w-4 h-4" />
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>

                    <p className="text-sm text-gray-300 mt-4">
                        Share this link with your fans. They can use it to send USDC tips directly to your wallet!
                    </p>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-900/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
                <div className="space-y-3 text-gray-300">
                    <div className="flex items-start gap-3">
                        <span className="bg-blue-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                        <p>Enter your song URL from any major music platform (Spotify, YouTube, SoundCloud, etc.)</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="bg-blue-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                        <p>Add your wallet address where you want to receive USDC tips</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="bg-blue-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                        <p>Generate and share the tip link with your fans</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="bg-blue-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                        <p>Fans can send USDC tips directly to your wallet - no platform fees!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
