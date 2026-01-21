import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="glass-card mx-4 mb-4 mt-8">
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold gradient-text mb-4">PDF Perfect</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Free, secure, and offline PDF tools. All processing happens in your browser -
                            your files never leave your device.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                                    About Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-gray-100 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                                <Github className="w-5 h-5 text-gray-700" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-6 text-center">
                    <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for PDF lovers
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        © 2024 PDF Perfect. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
