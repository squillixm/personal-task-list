
import React, { useState } from 'react';
import { Task } from '../types';
import { AddTaskForm } from './AddTaskForm';
import { TrashIcon, ChevronRightIcon, PlusIcon, CalendarIcon, ArchiveIcon } from './icons';
import { CheckIcon } from './icons/CheckIcon';

interface TaskItemProps {
  task: Task & { projectName?: string, projectColor?: string };
  level: number;
  onToggle: (taskId: string) => void;
  onAddTask: (parentId: string | null, taskData: Omit<Task, 'id' | 'subTasks' | 'archived' | 'createdAt'>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updatedTaskData: Partial<Task>) => void;
  onSelectTask: (taskId: string | null) => void;
  selectedTaskId: string | null;
  onMoveTask: (draggedId: string, targetId: string) => void;
  isSortable: boolean;
  isOverview: boolean;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return undefined;
    try {
        const date = new Date(dateString + 'T00:00:00');
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    } catch (e) {
        console.error(`Could not parse date: ${dateString}`);
        return dateString;
    }
}

export const TaskItem: React.FC<TaskItemProps> = (props) => {
  const { task, level, onToggle, onAddTask, onDeleteTask, onUpdateTask, onSelectTask, selectedTaskId, onMoveTask, isSortable, isOverview } = props;
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleUpdateText = () => { if (editText.trim() && editText.trim() !== task.text) { onUpdateTask(task.id, { text: editText.trim() }); } setIsEditing(false); };
  const progress = task.subTasks.length > 0 ? (task.subTasks.filter(t => t.completed).length / task.subTasks.length) * 100 : 0;
  const formattedDueDate = formatDate(task.dueDate);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => { e.dataTransfer.setData('taskId', task.id); e.currentTarget.style.opacity = '0.5'; };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => { e.currentTarget.style.opacity = '1'; setIsDraggingOver(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingOver(true); };
  const handleDragLeave = () => setIsDraggingOver(false);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); const draggedId = e.dataTransfer.getData('taskId'); if (draggedId && draggedId !== task.id) { onMoveTask(draggedId, task.id); } setIsDraggingOver(false); };

  const getCheckboxClasses = (isSubtask: boolean) => {
      const base = `transition-all duration-200 flex items-center justify-center border-2`;
      const size = isSubtask ? 'w-4 h-4' : 'w-5 h-5';
      const checkedState = task.completed ? 'bg-primary border-primary' : 'border-muted';
      const shape = 'data-[checkbox-style=circle]:rounded-full data-[checkbox-style=square]:rounded-md';
      return `${base} ${size} ${checkedState} ${shape}`;
  }

  const checkbox = (isSubtask: boolean) => (
    <div className={getCheckboxClasses(isSubtask)} data-checkbox-style={document.documentElement.dataset.checkboxStyle}>
      {task.completed && <CheckIcon className="w-3/4 text-primary-foreground" />}
    </div>
  )

  const canDrag = isSortable && level === 0 && !isOverview;

  return (
    <div draggable={canDrag} onDragStart={canDrag ? handleDragStart : undefined} onDragEnd={canDrag ? handleDragEnd : undefined} onDragOver={canDrag ? handleDragOver : undefined} onDragLeave={canDrag ? handleDragLeave : undefined} onDrop={canDrag ? handleDrop : undefined} className={`transition-all duration-200 group/item relative ${selectedTaskId === task.id ? 'bg-accent' : 'hover:bg-accent/50'} ${canDrag ? 'cursor-grab' : ''}`}>
      {isDraggingOver && <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-10" />}
      <div className={`flex items-start gap-3 data-[spacing=compact]:py-2 data-[spacing=normal]:py-3 data-[spacing=spacious]:py-4`} style={{ paddingLeft: `${level * 2.5}rem` }} data-spacing={document.documentElement.dataset.spacing} >
        <button onClick={() => onToggle(task.id)} className="mt-1 flex-shrink-0">{checkbox(level > 0)}</button>
        <div className="flex-1 cursor-pointer pt-0.5" onClick={() => onSelectTask(task.id)}>
          {isEditing ? ( <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onBlur={handleUpdateText} onKeyDown={(e) => e.key === 'Enter' && handleUpdateText()} className={`w-full bg-transparent border-b border-primary focus:outline-none ${level > 0 ? 'text-sm' : 'text-lg font-medium'}`} autoFocus /> ) : ( <p className={`${task.completed ? 'line-through text-muted-foreground' : ''} ${level > 0 ? 'text-sm' : 'text-lg font-medium'}`} onDoubleClick={() => setIsEditing(true)}> {task.text} </p> )}
          <div className="flex items-center gap-4 mt-1">
            {progress > 0 && <div className="w-24 bg-secondary rounded-full h-1"><div className="bg-primary h-1 rounded-full" style={{width: `${progress}%`}}></div></div>}
            {formattedDueDate && ( <div className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarIcon className="w-3 h-3" /><span>{formattedDueDate}</span></div> )}
            {task.projectName && <span className={`text-xs px-2 py-0.5 rounded-full bg-${task.projectColor}-500/10 text-${task.projectColor}-500`}>{task.projectName}</span>}
          </div>
        </div>
        <div className="flex items-center opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0" data-icon-size={document.documentElement.dataset.iconSize}>
          <button onClick={() => onUpdateTask(task.id, {archived: true})} title="Archive task" className="p-1 rounded-full hover:bg-accent"><ArchiveIcon className="action-icon"/></button>
          <button onClick={() => setIsAddingSubtask(!isAddingSubtask)} title="Add sub-task" className="p-1 rounded-full hover:bg-accent"><PlusIcon className="action-icon"/></button>
          <button onClick={() => onDeleteTask(task.id)} title="Delete task" className="p-1 rounded-full hover:bg-red-500/10 text-red-500"><TrashIcon className="action-icon"/></button>
        </div>
        {task.subTasks.length > 0 && <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 rounded-full hover:bg-accent mr-2"><ChevronRightIcon className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`} /></button>}
      </div>
      <div className={`${isExpanded ? 'max-h-full' : 'max-h-0'} overflow-hidden transition-all duration-300`}>
        {isAddingSubtask && ( <div style={{ paddingLeft: `${(level + 1) * 2.5 + 2.75}rem` }} className="pb-2 pr-4"><AddTaskForm onAddTask={(data) => { onAddTask(task.id, data); setIsAddingSubtask(false); }} isSubtask/></div> )}
        <div className="space-y-0">{task.subTasks.map((subTask) => (<TaskItem {...props} key={subTask.id} task={subTask} level={level + 1} />))}</div>
      </div>
    </div>
  );
};
