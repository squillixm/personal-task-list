
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Profile, Task, Settings, RepeatFrequency, Theme } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TaskList } from './components/TaskList';
import { Header } from './components/Header';
import { SettingsModal } from './components/SettingsModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { TaskDetailPanel } from './components/TaskDetailPanel';
import { findTask, findProfile, findParentTask, findWorkspaceForProfile, findParentProfile } from './utils/dataUtils';
import { DEFAULT_PROFILES, DEFAULT_SETTINGS } from './constants';

type SortBy = 'manual' | 'dueDate' | 'createdAt';

const App: React.FC = () => {
  const [profiles, setProfiles] = useLocalStorage<Profile[]>('profiles', DEFAULT_PROFILES);
  const [activeProfileId, setActiveProfileId] = useLocalStorage<string | null>('activeProfileId', '1-sub-1');
  const [settings, setSettings] = useLocalStorage<Settings>('settings', DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [showCompleted, setShowCompleted] = useState(true);
  const [viewArchived, setViewArchived] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('manual');

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', settings.darkMode);
    Object.values(Theme).forEach(theme => html.classList.remove(theme));
    html.classList.add(settings.theme);

    html.style.fontSize = settings.fontSize === 'sm' ? '14px' : settings.fontSize === 'lg' ? '18px' : '16px';
    html.classList.remove('font-sans', 'font-serif', 'font-mono');
    html.classList.add(`font-${settings.fontFamily}`);

    html.dataset.spacing = settings.spacing;
    html.dataset.cornerRadius = settings.cornerRadius;
    html.dataset.glassmorphism = String(settings.glassmorphism);
    html.dataset.checkboxStyle = settings.checkboxStyle;
    html.dataset.iconSize = settings.iconSize;

    if (settings.autoArchive) { /* ... auto-archive logic ... */ }
  }, [settings]);

  const activeProfile = useMemo(() => {
    if (!activeProfileId) return profiles.length > 0 ? profiles[0] : null;
    const { profile } = findProfile(profiles, activeProfileId);
    return profile ?? (profiles.length > 0 ? profiles[0] : null);
  }, [profiles, activeProfileId]);

  const activeWorkspace = useMemo(() => {
    if (!activeProfileId) return profiles.length > 0 ? profiles[0] : null;
    return findWorkspaceForProfile(profiles, activeProfileId);
  }, [profiles, activeProfileId]);

  const selectedTaskInfo = useMemo(() => {
    if (!selectedTaskId || !activeProfileId) return null;
    return findTask(profiles, selectedTaskId);
  }, [profiles, selectedTaskId, activeProfileId]);

  const updateProfile = useCallback((profileId: string, updatedData: Partial<Profile>) => {
    setProfiles(prev => {
        const newProfiles = JSON.parse(JSON.stringify(prev));
        const { profile } = findProfile(newProfiles, profileId);
        if (profile) Object.assign(profile, updatedData);
        return newProfiles;
    });
  }, [setProfiles]);

  const updateTask = useCallback((taskId: string, updatedTaskData: Partial<Task>) => {
    setProfiles(prevProfiles => {
      const newProfiles = JSON.parse(JSON.stringify(prevProfiles));
      const taskInfo = findTask(newProfiles, taskId);
      if (taskInfo && taskInfo.task) Object.assign(taskInfo.task, updatedTaskData);
      return newProfiles;
    });
  }, [setProfiles]);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setProfiles(prevProfiles => {
      const newProfiles = JSON.parse(JSON.stringify(prevProfiles));
      const taskInfo = findTask(newProfiles, taskId);
      if (taskInfo && taskInfo.task) {
        const newCompletedStatus = !taskInfo.task.completed;
        taskInfo.task.completed = newCompletedStatus;
        taskInfo.task.completionDate = newCompletedStatus ? new Date().toISOString() : undefined;
      }
      return newProfiles;
    });
  }, [setProfiles]);
  
  const addTask = useCallback((parentId: string | null, taskData: Omit<Task, 'id' | 'subTasks' | 'archived' | 'createdAt'>) => {
    const newTask: Task = { ...taskData, id: crypto.randomUUID(), subTasks: [], archived: false, createdAt: Date.now(), repeat: taskData.repeat || RepeatFrequency.NONE };
    setProfiles(prevProfiles => {
        const newProfiles = JSON.parse(JSON.stringify(prevProfiles));
        let parentIdToUse = parentId ?? activeProfileId;
        if (activeProfile?.id === activeWorkspace?.id) {
            parentIdToUse = activeWorkspace?.subProfiles?.filter(p => !p.archived)[0]?.id ?? null;
        }
        if (!parentIdToUse) return newProfiles;

        const { profile } = findProfile(newProfiles, parentIdToUse);
        if (profile) profile.tasks.push(newTask);
        else {
            const taskInfo = findTask(newProfiles, parentIdToUse);
            if (taskInfo?.task) taskInfo.task.subTasks.push(newTask);
        }
        return newProfiles;
    });
  }, [activeProfileId, activeProfile, activeWorkspace, setProfiles]);

  const deleteTask = useCallback((taskId: string) => {
    setProfiles(prevProfiles => {
      const newProfiles = JSON.parse(JSON.stringify(prevProfiles));
      const { parent } = findParentTask(newProfiles, taskId);
      if (parent) {
        const index = parent.findIndex(t => t.id === taskId);
        if (index > -1) parent.splice(index, 1);
      }
      return newProfiles;
    });
    if (selectedTaskId === taskId) setSelectedTaskId(null);
  }, [setProfiles, selectedTaskId]);

  const addWorkspace = useCallback((name: string) => {
      const newSubProfile: Profile = { id: crypto.randomUUID() + '-sub', name: 'General', tasks: [], subProfiles: [] };
      const newWorkspace: Profile = { id: crypto.randomUUID(), name, tasks: [], subProfiles: [newSubProfile] };
      setProfiles(prev => [...prev, newWorkspace]);
      setActiveProfileId(newSubProfile.id);
  }, [setProfiles]);

  const deleteWorkspace = useCallback((profileId: string) => {
    if (window.confirm("Are you sure you want to delete this workspace and all its projects? This cannot be undone.")) {
        const isDeletingActive = activeWorkspace?.id === profileId;
        setProfiles(prev => {
            const newProfiles = prev.filter(p => p.id !== profileId);
            if (isDeletingActive) {
                const firstWorkspace = newProfiles[0];
                if (firstWorkspace) {
                    const firstProject = firstWorkspace.subProfiles[0];
                    setActiveProfileId(firstProject?.id ?? firstWorkspace.id);
                } else {
                    setActiveProfileId(null);
                }
            }
            return newProfiles;
        });
    }
  }, [activeWorkspace?.id, setProfiles, setActiveProfileId]);

  const addSubProfile = useCallback((parentId: string, name: string) => {
    const newSubProfile: Profile = { id: crypto.randomUUID(), name, tasks: [], subProfiles: [] };
    setProfiles(prev => {
        const newProfiles = JSON.parse(JSON.stringify(prev));
        const { profile: parent } = findProfile(newProfiles, parentId);
        if (parent) parent.subProfiles.push(newSubProfile);
        return newProfiles;
    });
    setActiveProfileId(newSubProfile.id);
  }, [setProfiles]);
  
  const deleteSubProfile = useCallback((profileId: string) => {
    if (window.confirm("Are you sure you want to delete this project and all its tasks? This cannot be undone.")) {
      let parentProfileId: string | null = findParentProfile(profiles, profileId)?.id ?? null;
      setProfiles(prev => {
        const newProfiles = JSON.parse(JSON.stringify(prev));
        const findAndRemove = (currentProfiles: Profile[]): boolean => {
          for (const p of currentProfiles) {
            if (p.subProfiles) {
              const index = p.subProfiles.findIndex(sub => sub.id === profileId);
              if (index > -1) { p.subProfiles.splice(index, 1); return true; }
              if (findAndRemove(p.subProfiles)) { return true; }
            }
          }
          return false;
        }
        findAndRemove(newProfiles);
        return newProfiles;
      });
      if (activeProfileId === profileId) setActiveProfileId(parentProfileId);
    }
  }, [activeProfileId, profiles, setProfiles]);
  
  const moveTask = useCallback((draggedId: string, targetId: string) => {
    setProfiles(prevProfiles => {
        const newProfiles = JSON.parse(JSON.stringify(prevProfiles));
        const { task: draggedTask } = findTask(newProfiles, draggedId);
        if (!draggedTask) return prevProfiles;

        const { parent: sourceParentList } = findParentTask(newProfiles, draggedId);
        if (!sourceParentList) return prevProfiles;
        const dragIndex = sourceParentList.findIndex(t => t.id === draggedId);
        sourceParentList.splice(dragIndex, 1);

        const { parent: targetParentList } = findParentTask(newProfiles, targetId);
        if (!targetParentList) return prevProfiles;
        const dropIndex = targetParentList.findIndex(t => t.id === targetId);
        targetParentList.splice(dropIndex, 0, draggedTask);

        return newProfiles;
    });
  }, [setProfiles]);

  const { isOverview, tasksToDisplay } = useMemo(() => {
    const isOverview = activeProfile?.id === activeWorkspace?.id;
    let tasks: (Task & { projectName?: string; projectColor?: string; })[] = [];
    if (isOverview) {
      tasks = activeWorkspace?.subProfiles.filter(p => !p.archived).flatMap(p => p.tasks.map(t => ({ ...t, projectName: p.name, projectColor: p.color }))) ?? [];
    } else {
      tasks = activeProfile?.tasks ?? [];
    }
    tasks = tasks.filter(task => viewArchived ? task.archived : !task.archived);
    if (!showCompleted && !viewArchived) tasks = tasks.filter(task => !task.completed);
    
    if (sortBy !== 'manual') {
      tasks = [...tasks].sort((a, b) => {
          if (sortBy === 'dueDate') {
              if (!a.dueDate) return 1; if (!b.dueDate) return -1;
              return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          if (sortBy === 'createdAt') return b.createdAt - a.createdAt;
          return 0;
      });
    }
    return { isOverview, tasksToDisplay: tasks };
  }, [activeProfile, activeWorkspace, showCompleted, viewArchived, sortBy]);


  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header 
        workspaces={profiles}
        activeWorkspace={activeWorkspace}
        activeProfile={activeProfile}
        onSelectProfile={setActiveProfileId}
        onAddWorkspace={addWorkspace}
        onDeleteWorkspace={deleteWorkspace}
        onAddSubProfile={addSubProfile}
        onDeleteSubProfile={deleteSubProfile}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onEditProfile={setEditingProfile}
        onUpdateProfile={updateProfile}
      />
      <div className="flex">
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeProfile ? (
            <TaskList
              key={activeProfile.id}
              tasks={tasksToDisplay}
              profileId={activeProfile.id}
              activeWorkspace={activeWorkspace}
              isOverview={isOverview}
              onToggle={toggleTaskCompletion} onAddTask={addTask} onDeleteTask={deleteTask} onUpdateTask={updateTask}
              onSelectTask={setSelectedTaskId} selectedTaskId={selectedTaskId}
              viewSettings={{ showCompleted, viewArchived, sortBy }}
              onViewSettingsChange={{ setShowCompleted, setViewArchived, setSortBy }}
              onMoveTask={moveTask}
            />
          ) : ( <div className="flex-1 flex items-center justify-center"><p>Create or select a workspace to get started.</p></div> )}
        </main>
        <TaskDetailPanel task={selectedTaskInfo?.task || null} isOpen={!!selectedTaskId} onClose={() => setSelectedTaskId(null)} onUpdateTask={updateTask} />
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onSettingsChange={setSettings} />
      <ProfileEditModal isOpen={!!editingProfile} profile={editingProfile} onClose={() => setEditingProfile(null)} onUpdate={updateProfile} />
    </div>
  );
};

export default App;
