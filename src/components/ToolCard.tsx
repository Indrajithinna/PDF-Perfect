import React from 'react';
import { Link } from 'react-router-dom';

export interface ToolCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
    iconColor: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description, link, iconColor }) => {
    return (
        <Link to={link} className="tool-card group block h-full">
            <div className={`tool-card-icon ${iconColor} bg-opacity-10`}>
                {React.cloneElement(icon as React.ReactElement, { className: `w-7 h-7 ${iconColor.replace('bg-', 'text-')}` })}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
        </Link>
    );
};
