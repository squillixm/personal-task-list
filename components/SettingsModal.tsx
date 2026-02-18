
import React, { useEffect } from 'react';
import { Settings, Theme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
}

const themeColors: { [key in Theme]: string } = { [Theme.SLATE]: 'bg-slate-500', [Theme.BLUE]: 'bg-blue-500', [Theme.GREEN]: 'bg-green-500', [Theme.ROSE]: 'bg-rose-500', [Theme.INDIGO]: 'bg-indigo-500', }
const fontOptions = [ { value: 'sans', label: 'Inter', className: 'font-sans' }, { value: 'serif', label: 'Lora', className: 'font-serif' }, { value: 'mono', label: 'Roboto Mono', className: 'font-mono' } ];
const fontSizeOptions = [ { value: 'sm', label: 'Small' }, { value: 'base', label: 'Medium' }, { value: 'lg', label: 'Large' } ];
const cornerRadiusOptions = [ { value: 'none', label: 'Sharp' }, { value: 'md', label: 'Normal' }, { value: 'lg', label: 'Round' } ];
const spacingOptions = [ { value: 'compact', label: 'Compact' }, { value: 'normal', label: 'Normal' }, { value: 'spacious', label: 'Spacious' } ];
const checkboxOptions = [ { value: 'square', label: 'Square' }, { value: 'circle', label: 'Circle' } ];
const iconSizeOptions = [ { value: 'sm', label: 'Small' }, { value: 'base', label: 'Medium' }, { value: 'lg', label: 'Large' } ];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => { onSettingsChange({ ...settings, [key]: value }); };
  
  return (
    <div className="fixed inset-0 bg-black/50 data-[glass=true]:backdrop-blur-sm flex items-center justify-center z-50" data-glass={document.documentElement.dataset.glassmorphism} onClick={onClose}>
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="mb-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
               <div className="flex items-center justify-between"><label className="font-medium">Theme</label><div className="flex gap-2">{Object.values(Theme).map((theme) => (<button key={theme} onClick={() => updateSetting('theme', theme)} className={`w-8 h-8 rounded-full transition-all duration-200 ${themeColors[theme]} ${settings.theme === theme ? 'ring-4 ring-offset-2 ring-offset-background ring-primary' : ''}`} aria-label={`Select ${theme} theme`} />))}</div></div>
               <div className="flex items-center justify-between"><label className="font-medium">Dark Mode</label><button onClick={() => updateSetting('darkMode', !settings.darkMode)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.darkMode ? 'bg-primary' : 'bg-secondary'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
               <div className="flex items-center justify-between"><label className="font-medium">Glass Effect</label><button onClick={() => updateSetting('glassmorphism', !settings.glassmorphism)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.glassmorphism ? 'bg-primary' : 'bg-secondary'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.glassmorphism ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
               <div className="flex items-center justify-between"><label className="font-medium">Checkbox Style</label><div className="flex items-center gap-1 bg-secondary p-1 rounded-lg">{checkboxOptions.map(opt => ( <button key={opt.value} onClick={() => updateSetting('checkboxStyle', opt.value as Settings['checkboxStyle'])} className={`px-3 py-1 text-sm rounded-md ${settings.checkboxStyle === opt.value ? 'bg-background shadow' : 'hover:bg-background/50'}`}>{opt.label}</button>))}</div></div>
               <div className="flex items-center justify-between"><label className="font-medium">Icon Size</label><div className="flex items-center gap-1 bg-secondary p-1 rounded-lg">{iconSizeOptions.map(opt => ( <button key={opt.value} onClick={() => updateSetting('iconSize', opt.value as Settings['iconSize'])} className={`px-3 py-1 text-sm rounded-md ${settings.iconSize === opt.value ? 'bg-background shadow' : 'hover:bg-background/50'}`}>{opt.label}</button>))}</div></div>
               <div className="flex items-center justify-between"><label className="font-medium">Font Size</label><div className="flex items-center gap-1 bg-secondary p-1 rounded-lg">{fontSizeOptions.map(opt => ( <button key={opt.value} onClick={() => updateSetting('fontSize', opt.value as Settings['fontSize'])} className={`px-3 py-1 text-sm rounded-md ${settings.fontSize === opt.value ? 'bg-background shadow' : 'hover:bg-background/50'}`}>{opt.label}</button>))}</div></div>
               <div className="flex items-center justify-between"><label className="font-medium">Font</label><div className="flex items-center gap-1 bg-secondary p-1 rounded-lg">{fontOptions.map(opt => ( <button key={opt.value} onClick={() => updateSetting('fontFamily', opt.value as Settings['fontFamily'])} className={`px-3 py-1 text-sm rounded-md ${opt.className} ${settings.fontFamily === opt.value ? 'bg-background shadow' : 'hover:bg-background/50'}`}>{opt.label}</button>))}</div></div>
               <div className="flex items-center justify-between"><label className="font-medium">Corners</label><div className="flex items-center gap-1 bg-secondary p-1 rounded-lg">{cornerRadiusOptions.map(opt => ( <button key={opt.value} onClick={() => updateSetting('cornerRadius', opt.value as Settings['cornerRadius'])} className={`px-3 py-1 text-sm rounded-md ${settings.cornerRadius === opt.value ? 'bg-background shadow' : 'hover:bg-background/50'}`}>{opt.label}</button>))}</div></div>
               <div className="flex items-center justify-between"><label className="font-medium">Spacing</label><div className="flex items-center gap-1 bg-secondary p-1 rounded-lg">{spacingOptions.map(opt => ( <button key={opt.value} onClick={() => updateSetting('spacing', opt.value as Settings['spacing'])} className={`px-3 py-1 text-sm rounded-md ${settings.spacing === opt.value ? 'bg-background shadow' : 'hover:bg-background/50'}`}>{opt.label}</button>))}</div></div>
          </div>
          <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Archiving</h3>
              <div className="flex items-center justify-between bg-secondary p-3 rounded-lg"><label htmlFor="autoArchiveToggle" className="font-medium">Auto-archive completed</label><button id="autoArchiveToggle" onClick={() => updateSetting('autoArchive', !settings.autoArchive)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.autoArchive ? 'bg-primary' : 'bg-muted'}`} ><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.autoArchive ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
              {settings.autoArchive && ( <div className="flex items-center gap-4 bg-secondary p-3 rounded-lg"><label htmlFor="archiveDays" className="whitespace-nowrap">Archive tasks older than</label><input id="archiveDays" type="number" value={settings.autoArchiveDays} onChange={(e) => updateSetting('autoArchiveDays', Number(e.target.value))} className="w-20 bg-background p-1 rounded text-center focus:ring-2 focus:ring-primary" min="1" /><span>days</span></div>)}
          </div>
        </div>
        <div className="p-6 flex justify-end border-t border-border">
            <button onClick={onClose} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">Done</button>
        </div>
      </div>
    </div>
  );
};
