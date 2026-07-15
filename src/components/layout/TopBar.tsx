'use client';

import { useUIStore, useEditorStore } from '@/store/stores';
import { cn } from '@/lib/utils';

export function TopBar() {
  const { togglePanel, activeView, setActiveView, setCommandPaletteOpen } = useUIStore();
  const { tabs } = useEditorStore();
  const dirtyCount = tabs.filter((t) => t.dirty).length;

  return (
    <header
      className="flex items-center h-header px-3 bg-airis-graphite border-b border-airis-border shrink-0 relative z-30"
      style={{ paddingTop: 'var(--sat)' }}
    >
      <div className="flex items-center gap-2 mr-2 shrink-0">
        <div className="w-7 h-7 rounded-md bg-airis-accent flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-xs">A</span>
        </div>
        <span className="text-airis-text-secondary text-sm font-medium hidden sm:block text-truncate max-w-[100px]">
          AIRIS IDE
        </span>
      </div>

      <div className="flex-1" />

      <button onClick={() => togglePanel('search')} className="touch-target text-airis-text-muted hover:text-airis-text" aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>

      <button
        onClick={() => setActiveView('ai')}
        className={cn('touch-target rounded-lg transition-colors', activeView === 'ai' ? 'text-airis-accent bg-airis-accent/10' : 'text-airis-text-muted hover:text-airis-text')}
        aria-label="AI Assistant"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
      </button>

      <button onClick={() => togglePanel('settings')} className="touch-target text-airis-text-muted hover:text-airis-text" aria-label="Settings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>

      {dirtyCount > 0 && (
        <div className="flex items-center gap-1 ml-1">
          <div className="w-2 h-2 rounded-full bg-airis-yellow" />
          <span className="text-airis-text-muted text-2xs">{dirtyCount}</span>
        </div>
      )}
    </header>
  );
}
