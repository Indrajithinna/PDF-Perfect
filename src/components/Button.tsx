import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    type = 'button',
    className = '',
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantStyles = {
        primary: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5 focus:ring-purple-500',
        secondary: 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-600 hover:text-white focus:ring-purple-500',
        outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:border-purple-500 hover:text-purple-600 focus:ring-purple-500',
        danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg hover:-translate-y-0.5 focus:ring-red-500',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-6 py-3 text-base gap-2',
        lg: 'px-8 py-4 text-lg gap-3',
    };

    const widthStyle = fullWidth ? 'w-full' : '';
    const disabledStyle = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}
        >
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    <span>{children}</span>
                </>
            )}
        </button>
    );
};

export default Button;
