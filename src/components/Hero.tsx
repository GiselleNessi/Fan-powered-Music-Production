import { Music, Users, DollarSign, Award } from "lucide-react";

export function Hero() {
    return (
        <section className="text-center py-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    Crowdfund a Track
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Fan-powered music production where artists share work-in-progress tracks
                    and fans become investors in their success through USDC contributions.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                        Discover Tracks
                    </button>
                    <button className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                        Start as Artist
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                    <div className="text-center">
                        <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Music className="h-8 w-8 text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">127</div>
                        <div className="text-gray-400 text-sm">Active Tracks</div>
                    </div>
                    <div className="text-center">
                        <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Users className="h-8 w-8 text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">2.4K</div>
                        <div className="text-gray-400 text-sm">Contributors</div>
                    </div>
                    <div className="text-center">
                        <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <DollarSign className="h-8 w-8 text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">$89K</div>
                        <div className="text-gray-400 text-sm">Raised</div>
                    </div>
                    <div className="text-center">
                        <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Award className="h-8 w-8 text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">45</div>
                        <div className="text-gray-400 text-sm">Completed</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
