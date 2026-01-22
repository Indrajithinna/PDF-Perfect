import React from 'react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
    size = 'md',
    text = 'Loading...',
    fullScreen = false
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className={`${sizeClasses[size]} rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`${sizeClasses[size]} rounded-full border-4 border-transparent border-b-indigo-600 animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                </div>
            </div>
            {text && (
                <p className={`${textSizeClasses[size]} font-medium text-gray-700 animate-pulse`}>
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return content;
};

export default Loading;
