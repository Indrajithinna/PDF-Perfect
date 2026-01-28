import React from 'react';
import { Github, Heart, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="glass-card mx-4 mb-4 mt-8">
            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-black gradient-text mb-4">PDF Perfect</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            Free, secure, and offline PDF tools. All processing happens in your browser -
                            your files never leave your device.
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>All systems operational</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 text-lg">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect Section */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 text-lg">Connect With Us</h4>
                        <p className="text-gray-600 text-sm mb-4">
                            Follow us on social media for updates and tips
                        </p>
                        <div className="flex space-x-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-purple-50 hover:to-indigo-50 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:scale-110 hover:-translate-y-1 group"
                                aria-label="Visit our GitHub"
                                title="Visit our GitHub"
                            >
                                <Github className="w-5 h-5 text-gray-700 group-hover:text-purple-600 transition-colors" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-cyan-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:scale-110 hover:-translate-y-1 group"
                                aria-label="Follow us on Twitter"
                                title="Follow us on Twitter"
                            >
                                <Twitter className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:scale-110 hover:-translate-y-1 group"
                                aria-label="Connect on LinkedIn"
                                title="Connect on LinkedIn"
                            >
                                <Linkedin className="w-5 h-5 text-gray-700 group-hover:text-blue-700 transition-colors" />
                            </a>
                            <a
                                href="mailto:contact@pdfperfect.com"
                                className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-green-50 hover:to-emerald-50 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:scale-110 hover:-translate-y-1 group"
                                aria-label="Send us an email"
                                title="Send us an email"
                            >
                                <Mail className="w-5 h-5 text-gray-700 group-hover:text-green-600 transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 mt-10 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            Made with <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> for PDF lovers
                        </p>
                        <p className="text-xs text-gray-500">
                            © {currentYear} PDF Perfect. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
