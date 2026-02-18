
import React from 'react';
import { Profile } from '../types';
import * as Icons from './icons';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    Briefcase: Icons.BriefcaseIcon,
    Chart: Icons.ChartIcon,
    Code: Icons.CodeIcon,
    Home: Icons.HomeIcon,
    Rocket: Icons.RocketIcon,
    User: Icons.UserIcon,
    Cart: Icons.CartIcon,
    Book: Icons.BookIcon,
    Bolt: Icons.BoltIcon,
    Default: Icons.ProjectIcon,
};

interface IconDisplayProps {
    profile: Profile;
    size?: 'sm' | 'md';
}

export const IconDisplay: React.FC<IconDisplayProps> = ({ profile, size = 'md' }) => {
    const IconComponent = iconMap[profile.iconName || 'Default'] || iconMap.Default;
    const colorClass = profile.color ? `text-${profile.color}-500` : 'text-foreground';

    const wrapperSize = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
    const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    return (
        <div className={`${wrapperSize} rounded-lg flex items-center justify-center bg-${profile.color}-500/10`}>
            <IconComponent className={`${iconSize} ${colorClass}`} />
        </div>
    );
};
