import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Heart, Mail } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="glass-card mx-4 mb-4 mt-8">
            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-black gradient-text mb-4">PDF Perfect</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                            Free, secure, and offline PDF tools. All processing happens in your browser -
                            your files never leave your device.
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>All systems operational</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-4 text-lg">Quick Links</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 dark:bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/merge" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 dark:bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        Merge PDF
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/split" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 dark:bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        Split PDF
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/compress" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 dark:bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        Compress PDF
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/convert" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 dark:bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        Convert PDF
                                    </Link>
                                </li>
                            </ul>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link to="/ocr" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 dark:bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        OCR PDF
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 dark:bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 dark:bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        Terms
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 dark:bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/Indrajithinna/PDF-Perfect/issues" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 dark:bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        Report Bug
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Connect Section */}
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-4 text-lg">Contact Us</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            Have any complaints or suggestions for improvement? Reach out to us below.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <a
                                href="https://github.com/Indrajithinna"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300 group"
                            >
                                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                    <Github className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                                </div>
                                <span className="text-gray-600 dark:text-gray-300 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-400">Indrajithinna</span>
                            </a>

                            <a
                                href="mailto:indrajithinna@gmail.com"
                                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-100 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-700 transition-all duration-300 group"
                            >
                                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                    <Mail className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400" />
                                </div>
                                <span className="text-gray-600 dark:text-gray-300 font-medium group-hover:text-green-700 dark:group-hover:text-green-400">indrajithinna@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            Made with <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" /> for PDF lovers
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            © {currentYear} PDF Perfect. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
