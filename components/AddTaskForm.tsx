
import React, { useState } from 'react';
import { Task, RepeatFrequency } from '../types';
import { CalendarIcon } from './icons';

interface AddTaskFormProps {
  onAddTask: (taskData: Omit<Task, 'id' | 'subTasks' | 'archived' | 'createdAt'>) => void;
  isSubtask?: boolean;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, isSubtask = false }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask({
        text: text.trim(),
        completed: false,
        dueDate,
        notes,
        repeat: RepeatFrequency.NONE,
      });
      setText('');
      setDueDate('');
      setNotes('');
      setIsExpanded(false);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-3 transition-all duration-300">
        <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={handleFocus}
            placeholder={isSubtask ? "Add a sub-task..." : "Add a new task..."}
            className="w-full bg-transparent focus:outline-none placeholder-muted-foreground font-medium"
        />
        {isExpanded && (
            <div className="mt-3 space-y-3">
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes..."
                    className="w-full bg-secondary text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={3}
                />
                <div className="flex justify-between items-center">
                    <div className="relative">
                        <CalendarIcon className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                         <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="bg-secondary rounded-md pl-8 pr-2 py-1.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setIsExpanded(false)} className="px-4 py-2 rounded-md text-sm font-semibold hover:bg-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
        )}
    </form>
  );
};
