import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Menu, X, Shield, Moon, Sun } from 'lucide-react';

const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const location = useLocation();

    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/merge', label: 'Merge' },
        { path: '/split', label: 'Split' },
        { path: '/compress', label: 'Compress' },
        { path: '/convert', label: 'Convert' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <nav className="glass-card container mx-auto px-6 py-3 flex items-center justify-between dark:bg-slate-900/80 dark:border-slate-700">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3 group" title="Return to Home">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">PDF Perfect</h1>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)
                                ? 'text-violet-700 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-300'
                                : 'text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-white/50 dark:hover:bg-slate-800'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-lg text-gray-500 hover:text-violet-600 hover:bg-violet-50 dark:text-gray-400 dark:hover:text-violet-300 dark:hover:bg-slate-800 transition-colors"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-lg backdrop-blur-sm">
                        <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Secure</span>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {
                    mobileMenuOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 mx-4 p-4 glass-card md:hidden flex flex-col space-y-2 animate-fade-in">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl font-medium transition-colors ${isActive(link.path)
                                        ? 'bg-violet-50 text-violet-700'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )
                }
            </nav >
        </header >
    );
};

export default Header;
