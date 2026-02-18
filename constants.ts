
import { Profile, Settings, RepeatFrequency, Theme } from './types';

export const DEFAULT_SETTINGS: Settings = {
  theme: Theme.BLUE,
  darkMode: false,
  autoArchive: false,
  autoArchiveDays: 30,
  fontSize: 'base',
  fontFamily: 'sans',
  cornerRadius: 'lg',
  spacing: 'normal',
  glassmorphism: true,
  checkboxStyle: 'square',
  iconSize: 'base',
};

export const DEFAULT_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Work',
    iconName: 'Briefcase',
    color: 'indigo',
    tasks: [], // Workspaces do not have tasks directly
    subProfiles: [
        {
            id: '1-sub-1',
            name: 'Website Launch',
            iconName: 'Rocket',
            color: 'rose',
            tasks: [
                 { id: '1-0', text: 'Launch Website', completed: false, subTasks: [], repeat: RepeatFrequency.NONE, archived: false, createdAt: Date.now() },
                 { id: '1-1', text: 'Design Homepage', completed: true, completionDate: new Date().toISOString(), subTasks: [ { id: '1-1-1', text: 'Create wireframe', completed: true, subTasks: [], repeat: RepeatFrequency.NONE, archived: false, createdAt: Date.now() - 2000 }, { id: '1-1-2', text: 'Design mockup', completed: true, subTasks: [], repeat: RepeatFrequency.NONE, archived: false, createdAt: Date.now() - 1000 }, ], dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], repeat: RepeatFrequency.NONE, archived: false, createdAt: Date.now() - 4000, },
            ],
            subProfiles: []
        },
        {
            id: '1-sub-2',
            name: 'Q4 Report',
            iconName: 'Chart',
            color: 'green',
            tasks: [
                { id: '1-2', text: 'Write Content', completed: true, subTasks: [ { id: '1-2-1', text: 'Draft welcome text', completed: true, subTasks: [], repeat: RepeatFrequency.NONE, archived: false, createdAt: Date.now() }, { id: '1-2-2', text: 'About page content', completed: true, subTasks: [], repeat: RepeatFrequency.NONE, archived: false, createdAt: Date.now() }, ], notes: 'Focus on clear and concise messaging.', repeat: RepeatFrequency.NONE, archived: false, createdAt: Date.now() - 3000, },
                { id: '1-3', text: 'Setup Analytics', completed: true, subTasks: [ { id: '1-3-1', text: 'Install tracking code', completed: true, subTasks: [], repeat: RepeatFrequency.NONE, archived: false, createdAt: Date.now() }, { id: '1-3-2', text: 'Test reports', completed: true, subTasks: [], repeat: RepeatFrequency.NONE, archived: false, createdAt: Date.now() }, ], repeat: RepeatFrequency.NONE, archived: false, createdAt: Date.now(), },
            ],
            subProfiles: []
        }
    ],
  },
   {
    id: '3',
    name: 'Personal',
    iconName: 'User',
    color: 'blue',
    tasks: [],
    subProfiles: [
        { id: '3-sub-1', name: 'Groceries', iconName: 'Cart', color: 'slate', tasks: [ { id: crypto.randomUUID(), text: 'Buy groceries', completed: false, subTasks: [], repeat: RepeatFrequency.WEEKLY, archived: false, createdAt: Date.now() }, ], subProfiles: [] }
    ]
   }
];

export const ICON_LIST = ['Briefcase', 'Chart', 'Code', 'Home', 'Rocket', 'User', 'Cart', 'Book', 'Bolt'];
export const COLOR_LIST = ['slate', 'rose', 'blue', 'green', 'indigo'];
