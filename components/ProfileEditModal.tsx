
import React, { useState, useEffect } from 'react';
import { Profile } from '../types';
import { ICON_LIST, COLOR_LIST } from '../constants';
import * as Icons from './icons';

interface ProfileEditModalProps {
    isOpen: boolean;
    profile: Profile | null;
    onClose: () => void;
    onUpdate: (profileId: string, updatedData: Partial<Profile>) => void;
}

const iconMap: { [key: string]: React.FC<{ className?: string }> } = { Briefcase: Icons.BriefcaseIcon, Chart: Icons.ChartIcon, Code: Icons.CodeIcon, Home: Icons.HomeIcon, Rocket: Icons.RocketIcon, User: Icons.UserIcon, Cart: Icons.CartIcon, Book: Icons.BookIcon, Bolt: Icons.BoltIcon, };

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, profile, onClose, onUpdate }) => {
    const [name, setName] = useState('');
    const [iconName, setIconName] = useState('Briefcase');
    const [color, setColor] = useState('slate');

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setIconName(profile.iconName || 'Briefcase');
            setColor(profile.color || 'slate');
        }
    }, [profile]);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !profile) return null;

    const handleSave = () => {
        onUpdate(profile.id, { name, iconName, color });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 data-[glass=true]:backdrop-blur-sm flex items-center justify-center z-50" data-glass={document.documentElement.dataset.glassmorphism} onClick={onClose}>
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Edit Profile</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-secondary p-2 rounded-lg border-transparent focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {COLOR_LIST.map(c => (
                                <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full bg-${c}-500 transition-all ${color === c ? 'ring-4 ring-offset-2 ring-offset-background ring-primary' : ''}`} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Icon</label>
                        <div className="grid grid-cols-6 gap-2">
                            {ICON_LIST.map(i => {
                                const Icon = iconMap[i];
                                return ( <button key={i} onClick={() => setIconName(i)} className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${iconName === i ? `bg-${color}-500 text-white` : 'bg-secondary hover:bg-accent'}`}><Icon className="w-6 h-6" /></button> )
                            })}
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-accent transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};
