import React from 'react';
import { Link } from 'react-router-dom';
import {
    Combine,
    Scissors,
    Minimize2,
    FileInput,
    Image as ImageIcon,
    Shield,
    Zap,
    Download,
    Sparkles,
    Lock,
    Rocket,
    Droplet,
    Move
} from 'lucide-react';

interface ToolCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
    color: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description, link, color }) => {
    return (
        <Link to={link} className="tool-card group">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            <div className="mt-4 flex items-center text-purple-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Get Started</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
};

const Home: React.FC = () => {
    const tools = [
        {
            icon: <Combine className="w-8 h-8 text-white" />,
            title: 'Merge PDF',
            description: 'Combine multiple PDF files into a single document',
            link: '/merge',
            color: 'from-purple-500 to-indigo-600'
        },
        {
            icon: <Scissors className="w-8 h-8 text-white" />,
            title: 'Split PDF',
            description: 'Extract pages or split PDF into multiple files',
            link: '/split',
            color: 'from-pink-500 to-rose-600'
        },
        {
            icon: <Minimize2 className="w-8 h-8 text-white" />,
            title: 'Compress PDF',
            description: 'Reduce PDF file size without losing quality',
            link: '/compress',
            color: 'from-blue-500 to-cyan-600'
        },
        {
            icon: <FileInput className="w-8 h-8 text-white" />,
            title: 'Convert to PDF',
            description: 'Convert images and documents to PDF format',
            link: '/convert',
            color: 'from-green-500 to-emerald-600'
        },
        {
            icon: <ImageIcon className="w-8 h-8 text-white" />,
            title: 'PDF to Images',
            description: 'Extract all pages as high-quality images',
            link: '/pdf-to-images',
            color: 'from-orange-500 to-amber-600'
        },
        {
            icon: <Lock className="w-8 h-8 text-white" />,
            title: 'Password Protect',
            description: 'Secure your PDFs with password encryption',
            link: '/password-protect',
            color: 'from-red-500 to-pink-600'
        },
        {
            icon: <Droplet className="w-8 h-8 text-white" />,
            title: 'Add Watermark',
            description: 'Add text or image watermarks to your PDFs',
            link: '/watermark',
            color: 'from-teal-500 to-cyan-600'
        },
        {
            icon: <Move className="w-8 h-8 text-white" />,
            title: 'Organize Pages',
            description: 'Reorder, rotate, and manage PDF pages visually',
            link: '/page-organizer',
            color: 'from-yellow-500 to-orange-600'
        }
    ];

    const features = [
        {
            icon: <Shield className="w-7 h-7 text-purple-600" />,
            title: '100% Secure',
            description: 'All processing happens locally in your browser',
            gradient: 'from-purple-50 to-indigo-50'
        },
        {
            icon: <Zap className="w-7 h-7 text-blue-600" />,
            title: 'Lightning Fast',
            description: 'No uploads or downloads - instant processing',
            gradient: 'from-blue-50 to-cyan-50'
        },
        {
            icon: <Download className="w-7 h-7 text-green-600" />,
            title: 'Always Free',
            description: 'No limits, no subscriptions, no hidden fees',
            gradient: 'from-green-50 to-emerald-50'
        }
    ];

    const badges = [
        { icon: <Lock className="w-4 h-4" />, text: 'No File Size Limits', color: 'purple' },
        { icon: <Sparkles className="w-4 h-4" />, text: 'No Registration Required', color: 'blue' },
        { icon: <Zap className="w-4 h-4" />, text: 'Works Offline', color: 'green' },
        { icon: <Rocket className="w-4 h-4" />, text: 'Open Source', color: 'pink' },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-20 fade-in">
                <div className="inline-block mb-6">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200 float">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-bold text-purple-700">Professional PDF Tools</span>
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    <span className="gradient-text">PDF Perfect</span>
                </h1>

                <p className="text-xl md:text-2xl text-white mb-10 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                    Professional PDF tools that work offline. Fast, secure, and completely free.
                    <br />
                    <span className="text-lg opacity-90">Your files never leave your device.</span>
                </p>

                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`glass-card px-8 py-5 flex items-center space-x-4 slide-in hover:scale-105 transition-transform duration-300`}
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                                {feature.icon}
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-gray-800 text-lg">{feature.title}</h4>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tools Grid */}
            <div className="mb-16">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-white mb-3">
                        Choose Your Tool
                    </h2>
                    <p className="text-lg text-white opacity-90">
                        Select from our suite of powerful PDF tools
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool, index) => (
                        <div
                            key={index}
                            className="scale-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <ToolCard {...tool} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Info Section */}
            <div className="glass-card p-10 md:p-12 text-center max-w-5xl mx-auto fade-in">
                <div className="mb-8">
                    <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl mb-4">
                        <Shield className="w-12 h-12 text-purple-600" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
                        Why Choose PDF Perfect?
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
                        Unlike other PDF tools, PDF Perfect processes everything directly in your browser.
                        This means your files never leave your device, ensuring complete privacy and security.
                        No internet connection required after the initial page load!
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {badges.map((badge, index) => (
                        <div
                            key={index}
                            className={`px-6 py-3 bg-gradient-to-r from-${badge.color}-50 to-${badge.color}-100 border-2 border-${badge.color}-200 rounded-full flex items-center space-x-2 hover:scale-105 transition-transform duration-300 shadow-sm hover:shadow-md`}
                        >
                            <span className={`text-${badge.color}-600`}>{badge.icon}</span>
                            <span className={`text-sm font-bold text-${badge.color}-700`}>{badge.text}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-10 pt-8 border-t border-gray-200">
                    <p className="text-gray-500 text-sm">
                        Trusted by thousands of users worldwide • 100% Open Source • MIT Licensed
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
