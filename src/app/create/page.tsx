"use client";

import { useState } from "react";
import { Upload, Music, DollarSign, Calendar, Percent, Image as ImageIcon } from "lucide-react";

export default function CreateCampaign() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        targetAmount: "",
        deadline: "",
        royaltyShare: "15",
        audioFile: null as File | null,
        imageFile: null as File | null,
    });

    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'image') => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                [type === 'audio' ? 'audioFile' : 'imageFile']: file
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        // TODO: Implement actual form submission with contract interaction
        console.log("Creating campaign:", formData);

        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsUploading(false);

        // TODO: Redirect to campaign page or show success message
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Create New Campaign</h1>
                <p className="text-gray-300">Share your work-in-progress track and let fans invest in your success</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Track Information */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <Music className="h-5 w-5 mr-2" />
                        Track Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Track Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter your track title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Artist Name *
                            </label>
                            <input
                                type="text"
                                name="artist"
                                value="Your Artist Name" // This would come from user profile
                                disabled
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Describe your track, inspiration, and what makes it special..."
                        />
                    </div>
                </div>

                {/* Media Upload */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <Upload className="h-5 w-5 mr-2" />
                        Media Upload
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Audio Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Audio File *
                            </label>
                            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                                <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => handleFileChange(e, 'audio')}
                                    className="hidden"
                                    id="audio-upload"
                                />
                                <label
                                    htmlFor="audio-upload"
                                    className="cursor-pointer block"
                                >
                                    <p className="text-white font-medium mb-2">
                                        {formData.audioFile ? formData.audioFile.name : "Click to upload audio"}
                                    </p>
                                    <p className="text-gray-400 text-sm">MP3, WAV, or M4A files</p>
                                </label>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Cover Image
                            </label>
                            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'image')}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer block"
                                >
                                    <p className="text-white font-medium mb-2">
                                        {formData.imageFile ? formData.imageFile.name : "Click to upload image"}
                                    </p>
                                    <p className="text-gray-400 text-sm">JPG, PNG, or GIF files</p>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campaign Settings */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2" />
                        Campaign Settings
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Target Amount (USDC) *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="targetAmount"
                                    value={formData.targetAmount}
                                    onChange={handleInputChange}
                                    required
                                    min="100"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="5000"
                                />
                                <span className="absolute right-3 top-3 text-gray-400">USDC</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Deadline *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Royalty Share (%) *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="royaltyShare"
                                    value={formData.royaltyShare}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    max="50"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="15"
                                />
                                <Percent className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Percentage of streaming royalties to share with contributors
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="submit"
                        disabled={isUploading}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Creating Campaign...</span>
                            </>
                        ) : (
                            <span>Create Campaign</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
