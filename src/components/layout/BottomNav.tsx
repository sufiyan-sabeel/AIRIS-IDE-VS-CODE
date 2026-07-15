'use client';

import { useUIStore, useEditorStore, useGitStore } from '@/store/stores';
import { cn } from '@/lib/utils';
import type { ActiveView } from '@/types';

interface Tab { id: ActiveView | 'files'; label: string; icon: React.ReactNode; }

const tabs: Tab[] = [
  { id: 'files', label: 'Files', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
  { id: 'editor', label: 'Editor', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { id: 'terminal', label: 'Terminal', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> },
  { id: 'ai', label: 'AIRIS', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> },
  { id: 'git', label: 'Git', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg> },
];

export function BottomNav() {
  const { activeView, activePanel, panelOpen, setActiveView } = useUIStore();
  const { tabs: fileTabs } = useEditorStore();
  const { status } = useGitStore();

  const isActive = (id: string) => {
    if (id === 'files') return activePanel === 'explorer' && panelOpen;
    return activeView === id;
  };

  const getBadge = (id: string): number | null => {
    if (id === 'editor') { const d = fileTabs.filter(t => t.dirty).length; return d > 0 ? d : null; }
    if (id === 'git') { const t = status.modified.length + status.staged.length + status.untracked.length; return t > 0 ? t : null; }
    return null;
  };

  return (
    <nav className="flex items-center justify-around h-nav px-2 bg-airis-graphite border-t border-airis-border shrink-0 relative z-30" style={{ paddingBottom: 'var(--sab)' }}>
      {tabs.map((tab) => {
        const active = isActive(tab.id);
        const badge = getBadge(tab.id);
        return (
          <button key={tab.id} onClick={() => setActiveView(tab.id as ActiveView)}
            className={cn('flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-1 px-1 transition-colors relative min-h-[44px]', active ? 'text-airis-accent' : 'text-airis-text-muted active:text-airis-text')}
            aria-label={tab.label}
          >
            <span className="w-5 h-5 flex items-center justify-center">{tab.icon}</span>
            <span className="text-[10px] leading-none font-medium">{tab.label}</span>
            {badge !== null && (
              <span className="absolute -top-0.5 right-1/2 translate-x-[14px] bg-airis-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[14px] text-center leading-tight">{badge}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
