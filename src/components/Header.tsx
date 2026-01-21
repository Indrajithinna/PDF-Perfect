import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="glass-card mx-4 mt-4 mb-8 sticky top-4 z-50">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold gradient-text">PDF Perfect</h1>
                            <p className="text-xs text-gray-600">Free Offline PDF Tools</p>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                            Home
                        </Link>
                        <Link to="/merge" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                            Merge
                        </Link>
                        <Link to="/split" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                            Split
                        </Link>
                        <Link to="/compress" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                            Compress
                        </Link>
                        <Link to="/convert" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                            Convert
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            🔒 100% Private
                        </span>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
