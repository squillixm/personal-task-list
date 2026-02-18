
import React from 'react';
import { Task, Profile } from '../types';
import { TaskItem } from './TaskItem';
import { AddTaskForm } from './AddTaskForm';
import { TaskListHeader } from './TaskListHeader';

type SortBy = 'manual' | 'dueDate' | 'createdAt';

interface TaskListProps {
  tasks: any[]; // Can include projectName, etc.
  profileId: string;
  activeWorkspace: Profile | null;
  isOverview: boolean;
  onToggle: (taskId: string) => void;
  onAddTask: (parentId: string | null, taskData: Omit<Task, 'id' | 'subTasks' | 'archived' | 'createdAt'>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updatedTaskData: Partial<Task>) => void;
  onSelectTask: (taskId: string | null) => void;
  selectedTaskId: string | null;
  viewSettings: { showCompleted: boolean; viewArchived: boolean; sortBy: SortBy; };
  onViewSettingsChange: { setShowCompleted: (v: boolean) => void; setViewArchived: (v: boolean) => void; setSortBy: (v: SortBy) => void; };
  onMoveTask: (draggedId: string, targetId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, profileId, activeWorkspace, isOverview, ...props }) => {
  const tasksByProject = isOverview ? tasks.reduce((acc, task) => {
    (acc[task.projectName] = acc[task.projectName] || []).push(task);
    return acc;
  }, {}) : {};

  return (
    <div className="flex-1 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) props.onSelectTask(null); }}>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {!props.viewSettings.viewArchived && (
          <div className="mb-4">
            <AddTaskForm onAddTask={(taskData) => props.onAddTask(profileId, taskData)} />
          </div>
        )}
        <TaskListHeader viewSettings={props.viewSettings} onViewSettingsChange={props.onViewSettingsChange} />
        
        {isOverview ? (
          <div className="space-y-6">
            {Object.keys(tasksByProject).length > 0 ? Object.entries(tasksByProject).map(([projectName, projectTasks]) => (
              <div key={projectName}>
                <h2 className="text-lg font-bold mb-2" style={{color: `var(--tw-color-${(projectTasks as any[])[0].projectColor}-500)`}}>{projectName}</h2>
                <div className="divide-y divide-border">
                  {(projectTasks as Task[]).map((task) => <TaskItem key={task.id} task={task} level={0} isSortable={props.viewSettings.sortBy === 'manual' && !isOverview} isOverview={isOverview} {...props} />)}
                </div>
              </div>
            )) : <p className="text-muted-foreground text-center py-8">This workspace has no active projects with tasks.</p>}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tasks.map((task) => <TaskItem key={task.id} task={task} level={0} isSortable={props.viewSettings.sortBy === 'manual'} isOverview={isOverview} {...props} />)}
            {tasks.length === 0 && !props.viewSettings.viewArchived && <p className="text-muted-foreground text-center py-8">No tasks here. Add one above!</p>}
          </div>
        )}
        
        {activeWorkspace?.subProfiles.length === 0 && (
           <div className="text-center py-10">
                <h2 className="text-xl font-semibold">This workspace is empty.</h2>
                <p className="text-muted-foreground mt-2">Create a new project from the dropdown in the top-left to get started.</p>
            </div>
        )}
      </div>
    </div>
  );
};
