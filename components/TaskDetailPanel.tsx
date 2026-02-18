
import React, { useEffect, useState } from 'react';
import { Task, RepeatFrequency } from '../types';

interface TaskDetailPanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (taskId: string, updatedTaskData: Partial<Task>) => void;
}

export const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task, isOpen, onClose, onUpdateTask }) => {
  const [notes, setNotes] = useState(task?.notes || '');

  useEffect(() => {
    setNotes(task?.notes || '');
  }, [task]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value);
  const handleNotesBlur = () => { if (task && notes !== task.notes) { onUpdateTask(task.id, { notes }); } };
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (task) { onUpdateTask(task.id, { dueDate: e.target.value }); } };
  const handleRepeatChange = (e: React.ChangeEvent<HTMLSelectElement>) => { if (task) { onUpdateTask(task.id, { repeat: e.target.value as RepeatFrequency }); } }

  return (
    <aside className={`fixed top-0 right-0 h-full w-80 bg-background shadow-lg border-l border-border transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Task Details</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {task ? (
          <div className="flex-1 flex flex-col gap-6">
            <h4 className="text-lg font-semibold bg-secondary -mx-6 px-6 py-3">{task.text}</h4>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-muted-foreground mb-1">Due Date</label>
              <input id="dueDate" type="date" value={task.dueDate ? task.dueDate.split('T')[0] : ''} onChange={handleDueDateChange} className="w-full bg-secondary p-2 rounded-lg border-transparent focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="repeat" className="block text-sm font-medium text-muted-foreground mb-1">Repeat</label>
              <select id="repeat" value={task.repeat} onChange={handleRepeatChange} className="w-full bg-secondary p-2 rounded-lg border-transparent focus:ring-2 focus:ring-primary appearance-none">
                {Object.values(RepeatFrequency).map(freq => (<option key={freq} value={freq} className="capitalize">{freq}</option>))}
              </select>
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
              <textarea id="notes" value={notes} onChange={handleNotesChange} onBlur={handleNotesBlur} placeholder="Add some details..." className="flex-1 w-full bg-secondary p-2 rounded-lg border-transparent focus:ring-2 focus:ring-primary resize-none" />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Select a task to see details.</p></div>
        )}
      </div>
    </aside>
  );
};
