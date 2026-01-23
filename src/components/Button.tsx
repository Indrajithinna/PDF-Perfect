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
        primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 focus:ring-violet-500 border border-transparent',
        secondary: 'bg-white text-violet-700 border-2 border-violet-100 hover:border-violet-600 hover:bg-violet-50 focus:ring-violet-500',
        outline: 'bg-transparent text-gray-700 border border-gray-200 hover:border-violet-500 hover:text-violet-700 focus:ring-violet-500',
        danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md hover:shadow-xl hover:shadow-red-500/20 hover:-translate-y-0.5 focus:ring-red-500 border border-transparent',
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm gap-2',
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
