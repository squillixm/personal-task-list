
import React, { useState, useRef, useEffect } from 'react';
import { ChevronRightIcon } from './icons';

type SortBy = 'manual' | 'dueDate' | 'createdAt';

interface TaskListHeaderProps {
  viewSettings: {
    showCompleted: boolean;
    viewArchived: boolean;
    sortBy: SortBy;
  };
  onViewSettingsChange: {
    setShowCompleted: (value: boolean) => void;
    setViewArchived: (value: boolean) => void;
    setSortBy: (value: SortBy) => void;
  };
}

const sortOptions: { value: SortBy, label: string }[] = [
    { value: 'manual', label: 'Manual' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'createdAt', label: 'Date Added' },
]

export const TaskListHeader: React.FC<TaskListHeaderProps> = ({ viewSettings, onViewSettingsChange }) => {
    const { showCompleted, viewArchived, sortBy } = viewSettings;
    const { setShowCompleted, setViewArchived, setSortBy } = onViewSettingsChange;
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleArchivedClick = () => {
        setViewArchived(!viewArchived);
    }
    
    return (
        <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleArchivedClick} 
                    className={`px-3 py-1 text-sm font-semibold rounded-md ${viewArchived ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
                >
                    {viewArchived ? 'Active Tasks' : 'Archived'}
                </button>
            </div>
            
            <div className="flex items-center gap-4">
                {!viewArchived && (
                     <div className="flex items-center gap-2">
                        <label htmlFor="showCompleted" className="text-sm text-muted-foreground">Show completed</label>
                        <button
                            id="showCompleted"
                            onClick={() => setShowCompleted(!showCompleted)}
                            className={`relative inline-flex items-center h-5 w-9 transition-colors rounded-full ${showCompleted ? 'bg-primary' : 'bg-secondary'}`}
                        >
                            <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${showCompleted ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                        </button>
                    </div>
                )}
               
                <div className="relative" ref={sortRef}>
                    <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <span>Sort by: {sortOptions.find(o => o.value === sortBy)?.label}</span>
                        <ChevronRightIcon className="w-4 h-4 transition-transform rotate-90" />
                    </button>
                    {isSortOpen && (
                        <div className="absolute top-full right-0 mt-2 w-40 bg-popover border border-border rounded-md shadow-lg z-10">
                            {sortOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
