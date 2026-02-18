
import React, { useState, useEffect, useRef } from 'react';
import { Profile } from '../types';
import { PlusIcon, TrashIcon, CheckIcon, PencilIcon } from './icons';
import { IconDisplay } from './IconDisplay';

interface WorkspacePopoverProps {
  profiles: Profile[];
  activeProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onAddProfile: (name: string) => void;
  onDeleteProfile: (id: string) => void;
  onClose: () => void;
  onEditProfile: (profile: Profile) => void;
}

export const WorkspacePopover: React.FC<WorkspacePopoverProps> = (props) => {
  const { profiles, activeProfileId, onSelectProfile, onAddProfile, onDeleteProfile, onClose, onEditProfile } = props;
  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    const handleClickOutside = (event: MouseEvent) => { if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) onClose(); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleAddProfile = (e: React.FormEvent) => { e.preventDefault(); if(newProfileName.trim()){ onAddProfile(newProfileName.trim()); setNewProfileName(""); setIsAdding(false); } }
  const handleSelect = (id: string) => { onSelectProfile(id); onClose(); }

  return (
    <div ref={popoverRef} className="absolute top-full right-0 mt-2 w-64 bg-popover rounded-lg shadow-lg border border-border p-2 z-50">
      <div className="max-h-80 overflow-y-auto pr-1 space-y-1">
        {profiles.map(profile => (
            <div key={profile.id} className="flex items-center justify-between p-2 rounded-md cursor-pointer group hover:bg-accent" onClick={() => handleSelect(profile.id)} onDoubleClick={() => { onEditProfile(profile); onClose(); }}>
                <div className="flex items-center gap-3 truncate">
                   <IconDisplay profile={profile} />
                   <span className="truncate font-medium">{profile.name}</span>
                </div>
                <div className="flex items-center">
                  {activeProfileId === profile.id && <CheckIcon className="w-5 h-5 text-primary" />}
                  <button onClick={(e) => { e.stopPropagation(); onEditProfile(profile); onClose(); }} className="p-1 rounded-full hover:bg-secondary opacity-0 group-hover:opacity-100"><PencilIcon className="w-4 h-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteProfile(profile.id); }} className="p-1 rounded-full hover:bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100"><TrashIcon className="w-4 h-4" /></button>
                </div>
            </div>
        ))}
      </div>
      {isAdding ? (
        <form onSubmit={handleAddProfile} className="mt-2"><input type="text" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} placeholder="New Workspace..." className="w-full bg-secondary px-3 py-2 rounded-md" autoFocus onBlur={() => setIsAdding(false)}/></form>
      ) : (
        <button onClick={() => setIsAdding(true)} className="mt-2 w-full flex items-center justify-center gap-2 p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"><PlusIcon className="w-5 h-5" /><span>New Workspace</span></button>
      )}
    </div>
  );
};
