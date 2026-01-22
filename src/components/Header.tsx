import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Menu, X, Shield } from 'lucide-react';

const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/merge', label: 'Merge' },
        { path: '/split', label: 'Split' },
        { path: '/compress', label: 'Compress' },
        { path: '/convert', label: 'Convert' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="glass-card mx-4 mt-4 mb-8 sticky top-4 z-50 shimmer">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold gradient-text">PDF Perfect</h1>
                            <p className="text-xs text-gray-600 font-medium">Free Offline PDF Tools</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${isActive(link.path)
                                        ? 'text-purple-600 bg-purple-50'
                                        : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                                    }`}
                            >
                                {link.label}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"></span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-bold text-green-700">100% Private</span>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-gray-200 fade-in">
                        <div className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${isActive(link.path)
                                            ? 'text-purple-600 bg-purple-50'
                                            : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex sm:hidden items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg mt-2">
                                <Shield className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-bold text-green-700">100% Private</span>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
