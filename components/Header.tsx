
import React, { useState } from 'react';
import { SettingsIcon, BellIcon, UserIcon, ChevronDownIcon } from './icons';
import { Profile } from '../types';
import { WorkspacePopover } from './WorkspacePopover';
import { ProjectPopover } from './ProjectPopover';
import { IconDisplay } from './IconDisplay';

interface HeaderProps {
  workspaces: Profile[];
  activeWorkspace: Profile | null;
  activeProfile: Profile | null;
  onSelectProfile: (id: string) => void;
  onAddWorkspace: (name: string) => void;
  onDeleteWorkspace: (id: string) => void;
  onAddSubProfile: (parentId: string, name: string) => void;
  onDeleteSubProfile: (profileId: string) => void;
  onSettingsClick: () => void;
  onEditProfile: (profile: Profile) => void;
  onUpdateProfile: (profileId: string, data: Partial<Profile>) => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const [isWorkspacePopoverOpen, setIsWorkspacePopoverOpen] = useState(false);
  const [isProjectPopoverOpen, setIsProjectPopoverOpen] = useState(false);

  const headerStyle = `flex-shrink-0 flex items-center justify-between p-4 h-20 border-b border-border sticky top-0 z-40 transition-all duration-300`;
  const glassmorphismStyle = `data-[glass=true]:bg-card/80 data-[glass=true]:backdrop-blur-sm`;
  
  return (
    <header className={`${headerStyle} ${glassmorphismStyle}`} data-glass={document.documentElement.dataset.glassmorphism}>
      <div className="relative">
        <button onClick={() => setIsProjectPopoverOpen(true)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary">
          {props.activeProfile && <IconDisplay profile={props.activeProfile} size="sm" />}
          <h2 className="text-xl font-bold text-foreground">{props.activeProfile?.name || 'Select a project'}</h2>
          <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
        </button>
        {isProjectPopoverOpen && props.activeWorkspace && (
          <ProjectPopover
            workspace={props.activeWorkspace}
            activeProfileId={props.activeProfile?.id ?? null}
            onSelectProfile={props.onSelectProfile}
            onAddSubProfile={props.onAddSubProfile}
            onDeleteSubProfile={props.onDeleteSubProfile}
            onClose={() => setIsProjectPopoverOpen(false)}
            onEditProfile={props.onEditProfile}
            onUpdateProfile={props.onUpdateProfile}
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" aria-label="Notifications"><BellIcon className="w-5 h-5" /></button>
        <button onClick={props.onSettingsClick} className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" aria-label="Open settings"><SettingsIcon className="w-5 h-5" /></button>
        <div className="relative">
            <button onClick={() => setIsWorkspacePopoverOpen(true)} className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" aria-label="User profile"><UserIcon className="w-5 h-5" /></button>
            {isWorkspacePopoverOpen && (
                 <WorkspacePopover
                    profiles={props.workspaces}
                    activeProfileId={props.activeWorkspace?.id ?? null}
                    onSelectProfile={props.onSelectProfile}
                    onAddProfile={props.onAddWorkspace}
                    onDeleteProfile={props.onDeleteWorkspace}
                    onClose={() => setIsWorkspacePopoverOpen(false)}
                    onEditProfile={props.onEditProfile}
                 />
            )}
        </div>
      </div>
    </header>
  );
};
