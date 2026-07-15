'use client';

import { useState } from 'react';
import { useKeybindingsStore } from '@/store/stores';
import { cn } from '@/lib/utils';
import { useEditorStore, useUIStore } from '@/store/stores';

const recentFiles = [
  { name: 'index.ts', path: '/workspace/src/index.ts', date: '2 min ago' },
  { name: 'app.tsx', path: '/workspace/src/app.tsx', date: '15 min ago' },
  { name: 'package.json', path: '/workspace/package.json', date: '1 hour ago' },
];

export function WelcomePage() {
  const { openFile } = useEditorStore();
  const { togglePanel } = useUIStore();

  return (
    <div className="flex-1 flex items-center justify-center bg-airis-black overflow-y-auto">
      <div className="max-w-md w-full px-6 py-12">
        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-airis-accent flex items-center justify-center shadow-lg shadow-airis-accent/20 mb-4">
            <span className="text-white font-bold text-3xl">A</span>
          </div>
          <h1 className="text-xl font-bold text-airis-text">AIRIS IDE</h1>
          <p className="text-sm text-airis-text-muted mt-1">Mobile coding environment</p>
        </div>

        {/* Quick actions */}
        <div className="space-y-2 mb-8">
          <ActionButton icon={openIcon} label="Open File" shortcut="Ctrl+O" onClick={() => togglePanel('explorer')} />
          <ActionButton icon={searchIcon} label="Search Files" shortcut="Ctrl+Shift+F" onClick={() => togglePanel('search')} />
          <ActionButton icon={terminalIcon} label="Open Terminal" shortcut="Ctrl+`" onClick={() => useUIStore.getState().setActiveView('terminal')} />
          <ActionButton icon={gitIcon} label="Source Control" shortcut="Ctrl+Shift+G" onClick={() => useUIStore.getState().setActiveView('git')} />
          <ActionButton icon={aiIcon} label="AI Assistant" shortcut="" onClick={() => useUIStore.getState().setActiveView('ai')} />
        </div>

        {/* Recent */}
        <div>
          <h2 className="text-xs font-semibold uppercase text-airis-text-muted tracking-wider mb-3">Recent</h2>
          <div className="space-y-1">
            {recentFiles.map((f, i) => (
              <button key={i} onClick={() => openFile(f.path, `// ${f.path}\n\n`)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-airis-surface-2 transition-colors text-left">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-airis-text-muted shrink-0"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                <span className="text-sm text-airis-text flex-1 text-truncate">{f.name}</span>
                <span className="text-xs text-airis-text-muted">{f.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Keybindings hint */}
        <div className="mt-8 pt-6 border-t border-airis-border">
          <p className="text-xs text-airis-text-muted text-center">
            Press <kbd className="px-1 py-0.5 rounded bg-airis-surface-2 text-airis-text text-2xs">Ctrl+P</kbd> to open the Command Palette
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, shortcut, onClick }: { icon: React.ReactNode; label: string; shortcut: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-airis-surface-2 transition-colors text-left group">
      <span className="w-8 h-8 rounded-lg bg-airis-surface-2 flex items-center justify-center text-airis-text-muted group-hover:text-airis-accent transition-colors">{icon}</span>
      <span className="text-sm text-airis-text flex-1">{label}</span>
      {shortcut && <kbd className="text-xs text-airis-text-muted px-2 py-0.5 rounded bg-airis-surface-2">{shortcut}</kbd>}
    </button>
  );
}

const openIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const searchIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const terminalIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
const gitIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>;
const aiIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>;
