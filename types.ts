
export enum RepeatFrequency {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum Theme {
    SLATE = 'slate',
    BLUE = 'blue',
    GREEN = 'green',
    ROSE = 'rose',
    INDIGO = 'indigo',
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  notes?: string;
  subTasks: Task[];
  repeat: RepeatFrequency;
  archived: boolean;
  createdAt: number;
  completionDate?: string;
}

export interface Profile {
  id: string;
  name: string;
  tasks: Task[];
  subProfiles: Profile[];
  color?: string;
  iconName?: string;
  archived?: boolean;
}

export interface Settings {
    theme: Theme;
    darkMode: boolean;
    autoArchive: boolean;
    autoArchiveDays: number;
    fontSize: 'sm' | 'base' | 'lg';
    fontFamily: 'sans' | 'serif' | 'mono';
    cornerRadius: 'none' | 'md' | 'lg';
    spacing: 'compact' | 'normal' | 'spacious';
    glassmorphism: boolean;
    checkboxStyle: 'square' | 'circle';
    iconSize: 'sm' | 'base' | 'lg';
}
