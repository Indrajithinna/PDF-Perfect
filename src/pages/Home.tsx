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
    Download
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
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
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
        }
    ];

    const features = [
        {
            icon: <Shield className="w-6 h-6 text-purple-600" />,
            title: '100% Secure',
            description: 'All processing happens locally in your browser'
        },
        {
            icon: <Zap className="w-6 h-6 text-purple-600" />,
            title: 'Lightning Fast',
            description: 'No uploads or downloads - instant processing'
        },
        {
            icon: <Download className="w-6 h-6 text-purple-600" />,
            title: 'Always Free',
            description: 'No limits, no subscriptions, no hidden fees'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16 fade-in">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    <span className="gradient-text">PDF Perfect</span>
                </h1>
                <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                    Professional PDF tools that work offline. Fast, secure, and completely free.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="glass-card px-6 py-4 flex items-center space-x-3 slide-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {feature.icon}
                            <div className="text-left">
                                <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                                <p className="text-xs text-gray-600">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tools Grid */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-white text-center mb-8">
                    Choose Your Tool
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <div
                            key={index}
                            className="fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <ToolCard {...tool} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Info Section */}
            <div className="glass-card p-8 text-center max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Why Choose PDF Perfect?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                    Unlike other PDF tools, PDF Perfect processes everything directly in your browser.
                    This means your files never leave your device, ensuring complete privacy and security.
                    No internet connection required after the initial page load!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        No File Size Limits
                    </span>
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        No Registration Required
                    </span>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        Works Offline
                    </span>
                    <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
                        Open Source
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Home;
