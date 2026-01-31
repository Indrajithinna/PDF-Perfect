import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Button from '../components/Button';

const NotFound: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center fade-in">
            <div className="bg-red-50 p-6 rounded-full mb-6 animate-bounce">
                <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
            <h2 className="text-3xl font-bold gradient-text mb-6">Page Not Found</h2>
            <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/">
                <Button variant="primary" icon={<Home className="w-5 h-5" />}>
                    Back to Home
                </Button>
            </Link>
        </div>
    );
};

export default NotFound;
