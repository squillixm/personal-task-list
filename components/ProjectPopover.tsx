
import React, { useState, useEffect, useRef } from 'react';
import { Profile } from '../types';
import { PlusIcon, TrashIcon, CheckIcon, ArchiveIcon, PencilIcon } from './icons';
import { IconDisplay } from './IconDisplay';

interface ProjectPopoverProps {
  workspace: Profile;
  activeProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onAddSubProfile: (parentId: string, name: string) => void;
  onDeleteSubProfile: (profileId: string) => void;
  onClose: () => void;
  onEditProfile: (profile: Profile) => void;
  onUpdateProfile: (profileId: string, data: Partial<Profile>) => void;
}

export const ProjectPopover: React.FC<ProjectPopoverProps> = (props) => {
  const { workspace, activeProfileId, onSelectProfile, onAddSubProfile, onDeleteSubProfile, onClose, onEditProfile, onUpdateProfile } = props;
  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [showArchived, setShowArchived] = useState(false);
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

  const handleAddProfile = (e: React.FormEvent) => { e.preventDefault(); if(newProfileName.trim()){ onAddSubProfile(workspace.id, newProfileName.trim()); setNewProfileName(""); setIsAdding(false); } }
  const handleSelect = (id: string) => { onSelectProfile(id); onClose(); }

  const profileList = [workspace, ...workspace.subProfiles];
  const activeProjects = profileList.filter(p => !p.archived);
  const archivedProjects = profileList.filter(p => p.archived);

  return (
    <div ref={popoverRef} className="absolute top-full left-0 mt-2 w-72 bg-popover rounded-lg shadow-lg border border-border p-2 z-50">
      <div className="max-h-80 overflow-y-auto pr-1 space-y-1">
        {activeProjects.map(profile => (
            <div key={profile.id} className="flex items-center justify-between p-2 rounded-md cursor-pointer group hover:bg-accent" onClick={() => handleSelect(profile.id)} onDoubleClick={() => { onEditProfile(profile); onClose(); }}>
                <div className="flex items-center gap-3 truncate">
                   <IconDisplay profile={profile} />
                   <span className="truncate font-medium">{profile.name}</span>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {activeProfileId === profile.id && <CheckIcon className="w-5 h-5 text-primary opacity-100" />}
                    <button onClick={(e) => { e.stopPropagation(); onEditProfile(profile); onClose(); }} className="p-1 rounded-full hover:bg-secondary"><PencilIcon className="w-4 h-4" /></button>
                    {profile.id !== workspace.id && <button onClick={(e) => { e.stopPropagation(); onUpdateProfile(profile.id, { archived: true }); }} className="p-1 rounded-full hover:bg-secondary"><ArchiveIcon className="w-4 h-4" /></button>}
                    {profile.id !== workspace.id && <button onClick={(e) => { e.stopPropagation(); onDeleteSubProfile(profile.id); }} className="p-1 rounded-full hover:bg-red-500/10 text-red-500"><TrashIcon className="w-4 h-4" /></button>}
                </div>
            </div>
        ))}
        {archivedProjects.length > 0 && (
          <div>
            <button onClick={() => setShowArchived(!showArchived)} className="w-full text-left text-xs font-semibold text-muted-foreground p-2 hover:bg-accent rounded-md">{showArchived ? 'Hide' : 'Show'} Archived</button>
            {showArchived && archivedProjects.map(profile => ( 
                <div key={profile.id} className="flex items-center justify-between p-2 rounded-md cursor-pointer group hover:bg-accent text-muted-foreground" onClick={() => handleSelect(profile.id)}>
                    <div className="flex items-center gap-3 truncate"><IconDisplay profile={profile} /><span className="truncate font-medium line-through">{profile.name}</span></div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {activeProfileId === profile.id && <CheckIcon className="w-5 h-5 text-primary opacity-100" />}
                        <button onClick={(e) => { e.stopPropagation(); onUpdateProfile(profile.id, { archived: false }); }} className="p-1 rounded-full hover:bg-secondary"><ArchiveIcon className="w-4 h-4" /></button>
                    </div>
                </div>
             ))}
          </div>
        )}
      </div>
      {isAdding ? (
        <form onSubmit={handleAddProfile} className="mt-2"><input type="text" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} placeholder="New Project..." className="w-full bg-secondary px-3 py-2 rounded-md" autoFocus onBlur={() => setIsAdding(false)}/></form>
      ) : (
        <button onClick={() => setIsAdding(true)} className="mt-2 w-full flex items-center justify-center gap-2 p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"><PlusIcon className="w-5 h-5" /><span>New Project</span></button>
      )}
    </div>
  );
};
