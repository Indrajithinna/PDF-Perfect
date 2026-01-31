import React from 'react';
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
                        <h4 className="font-bold text-gray-800 mb-4 text-lg">Contact Us</h4>
                        <p className="text-gray-600 text-sm mb-4">
                            Have any complaints or suggestions for improvement? Reach out to us below.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <a
                                href="https://github.com/Indrajithinna"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 border border-gray-100 hover:border-purple-200 transition-all duration-300 group"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                    <Github className="w-5 h-5 text-gray-700 group-hover:text-purple-600" />
                                </div>
                                <span className="text-gray-600 font-medium group-hover:text-purple-700">Indrajithinna</span>
                            </a>

                            <a
                                href="mailto:indrajithinna@gmail.com"
                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-green-50 border border-gray-100 hover:border-green-200 transition-all duration-300 group"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                    <Mail className="w-5 h-5 text-gray-700 group-hover:text-green-600" />
                                </div>
                                <span className="text-gray-600 font-medium group-hover:text-green-700">indrajithinna@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 mt-10 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            Made with <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" /> for PDF lovers
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
