'use client';

import { useUIStore, useEditorStore } from '@/store/stores';
import { cn } from '@/lib/utils';

export function SettingsPanel() {
  const { theme, setTheme, compactMode, setCompactMode } = useUIStore();
  const { fontZoom, setFontZoom, autoSave, setAutoSave } = useEditorStore();

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-none">
      <div className="px-4 py-3 border-b border-airis-border"><h2 className="text-sm font-semibold text-airis-text">Settings</h2></div>
      <div className="p-4 space-y-6">
        <section>
          <h3 className="text-xs font-semibold uppercase text-airis-text-muted tracking-wider mb-3">Theme</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['dark', 'light', 'amoled'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={cn('py-3 rounded-lg text-sm font-medium border transition-colors', theme === t ? 'bg-airis-accent/10 border-airis-accent text-airis-accent' : 'bg-airis-surface-2 border-airis-border text-airis-text-muted')}>
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase text-airis-text-muted tracking-wider mb-3">Editor</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2"><span className="text-sm text-airis-text">Font Size</span><span className="text-sm text-airis-text-muted font-mono">{fontZoom}px</span></div>
              <div className="flex items-center gap-3">
                <button onClick={() => setFontZoom(fontZoom - 1)} className="touch-target-sm rounded-lg bg-airis-surface-2 border border-airis-border text-airis-text-muted text-sm">-</button>
                <div className="flex-1 h-1.5 bg-airis-surface-2 rounded-full relative"><div className="h-full bg-airis-accent rounded-full" style={{ width: `${((fontZoom-10)/18)*100}%` }} /></div>
                <button onClick={() => setFontZoom(fontZoom + 1)} className="touch-target-sm rounded-lg bg-airis-surface-2 border border-airis-border text-airis-text-muted text-sm">+</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div><span className="text-sm text-airis-text">Auto Save</span><p className="text-xs text-airis-text-muted">Save files automatically</p></div>
              <button onClick={() => setAutoSave(!autoSave)} className={cn('w-11 h-6 rounded-full transition-colors relative', autoSave ? 'bg-airis-accent' : 'bg-airis-surface-2 border border-airis-border')}>
                <div className={cn('w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform', autoSave ? 'translate-x-[22px]' : 'translate-x-0.5')} />
              </button>
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase text-airis-text-muted tracking-wider mb-3">Display</h3>
          <div className="flex items-center justify-between">
            <div><span className="text-sm text-airis-text">Compact Mode</span><p className="text-xs text-airis-text-muted">Reduce visual density</p></div>
            <button onClick={() => setCompactMode(!compactMode)} className={cn('w-11 h-6 rounded-full transition-colors relative', compactMode ? 'bg-airis-accent' : 'bg-airis-surface-2 border border-airis-border')}>
              <div className={cn('w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform', compactMode ? 'translate-x-[22px]' : 'translate-x-0.5')} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
