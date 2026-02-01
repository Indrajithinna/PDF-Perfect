import React from 'react';
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
    CheckCircle2,
    Move,
    PenTool,
    Hash,
    Unlock,
    FileText as FileTextIcon,
    Type,
    Layers,
    ScanText
} from 'lucide-react';

import { ToolCard } from '../components/ToolCard';

const Home: React.FC = () => {
    const tools = [
        {
            icon: <Combine />,
            title: 'Merge PDF',
            description: 'Combine multiple PDF files into a single document effortlessly.',
            link: '/merge',
            iconColor: 'bg-violet-600'
        },
        {
            icon: <Scissors />,
            title: 'Split PDF',
            description: 'Extract specific pages or split pages into separate documents.',
            link: '/split',
            iconColor: 'bg-pink-600'
        },
        {
            icon: <Minimize2 />,
            title: 'Compress PDF',
            description: 'Reduce file size while optimization for maximum quality.',
            link: '/compress',
            iconColor: 'bg-indigo-600'
        },
        {
            icon: <FileInput />,
            title: 'Convert to PDF',
            description: 'Convert Word, Excel, PowerPoint, and images to PDF format.',
            link: '/convert',
            iconColor: 'bg-sky-600'
        },
        {
            icon: <ImageIcon />,
            title: 'PDF to Images',
            description: 'Extract pages as high-quality PNG or JPG images.',
            link: '/pdf-to-images',
            iconColor: 'bg-emerald-600'
        },
        {
            icon: <Lock />,
            title: 'Password Protect',
            description: 'Encrypt your PDF with a password to ensure security.',
            link: '/password-protect',
            iconColor: 'bg-rose-600'
        },
        {
            icon: <Unlock />,
            title: 'Unlock PDF',
            description: 'Remove passwords and restrictions from your PDF files.',
            link: '/unlock',
            iconColor: 'bg-red-500'
        },
        {
            icon: <Droplet />,
            title: 'Add Watermark',
            description: 'Stamp text or image watermarks over your PDF pages.',
            link: '/watermark',
            iconColor: 'bg-cyan-600'
        },
        {
            icon: <Move />,
            title: 'Organize Pages',
            description: 'Sort, rotate, and delete pages visually.',
            link: '/page-organizer',
            iconColor: 'bg-orange-600'
        },
        {
            icon: <PenTool />,
            title: 'Sign PDF',
            description: 'Add your signature to PDF documents easily.',
            link: '/sign',
            iconColor: 'bg-blue-600'
        },
        {
            icon: <Hash />,
            title: 'Page Numbers',
            description: 'Add page numbers to your document with custom formatting.',
            link: '/page-numbers',
            iconColor: 'bg-teal-600'
        },
        {
            icon: <FileTextIcon />,
            title: 'Edit Metadata',
            description: 'Modify title, author, subject, and keywords metadata.',
            link: '/metadata',
            iconColor: 'bg-purple-600'
        },
        {
            icon: <Layers />,
            title: 'Flatten PDF',
            description: 'Make fillable forms uneditable and merge layers.',
            link: '/flatten',
            iconColor: 'bg-slate-600'
        },
        {
            icon: <Type />,
            title: 'PDF to Text',
            description: 'Extract raw text content from PDF documents.',
            link: '/pdf-to-text',
            iconColor: 'bg-gray-600',
            badge: 'New'
        },
        {
            icon: <ScanText />,
            title: 'OCR PDF',
            description: 'Recognize text in scanned documents and images.',
            link: '/ocr',
            iconColor: 'bg-yellow-600',
            badge: 'Beta'
        }
    ];

    const features = [
        {
            icon: <Shield className="w-6 h-6 text-emerald-600" />,
            title: '100% Secure',
            description: 'Files are processed locally. No data leaves your device.',
            bg: 'bg-emerald-50'
        },
        {
            icon: <Zap className="w-6 h-6 text-amber-600" />,
            title: 'Instant Speed',
            description: 'No uploads or downloads required. Zero latency.',
            bg: 'bg-amber-50'
        },
        {
            icon: <Download className="w-6 h-6 text-blue-600" />,
            title: 'Free Forever',
            description: 'No hidden costs, subscriptions, or sign-ups.',
            bg: 'bg-blue-50'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            {/* Hero Section */}
            <div className="text-center mb-24 max-w-4xl mx-auto animate-fade-in">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 border border-violet-100 dark:border-violet-900 rounded-full mb-8 backdrop-blur-sm shadow-sm">
                    <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span className="text-sm font-semibold text-violet-800 dark:text-violet-200">v2.1 • New Generation PDF Tools</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-gray-900 dark:text-white">
                    Master Your Documents with <span className="gradient-text">PDF Perfect</span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                    A professional suite of PDF tools that runs entirely in your browser.
                    <span className="block mt-2 font-medium text-gray-900 dark:text-gray-100">Secure, Private, and Offline-Ready.</span>
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`glass-card p-6 flex items-start space-x-4 hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300 delay-${(index + 1) * 100}`}
                        >
                            <div className={`p-3 rounded-xl flex-shrink-0 ${feature.bg} dark:bg-opacity-10`}>
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{feature.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tools Grid */}
            <div className="mb-24">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Powerful Tools</h2>
                        <p className="text-gray-500 dark:text-gray-400">Everything you need to manage your PDFs</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool, index) => (
                        <div
                            key={index}
                            className={`animate-fade-in`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <ToolCard {...tool} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA / Trust Section */}
            <div className="glass-card p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500"></div>

                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Why Professionals Trust PDF Perfect?</h3>

                <div className="flex flex-wrap justify-center gap-8 mb-10">
                    {[
                        'No File Size Limits',
                        'Bank-Grade Privacy',
                        'Works Without Internet',
                        'Open Source transparency'
                    ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-medium">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>

                <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 px-4 py-2 rounded-lg border border-gray-100 dark:border-slate-700">
                    <Rocket className="w-4 h-4 text-violet-500" />
                    <span>MIT Licensed &bull; Free for personal and commercial use</span>
                </div>
            </div>
        </div>
    );
};

export default Home;
