'use client';

import { useStatusBarStore, useGitStore, useEditorStore, useUIStore } from '@/store/stores';

export function StatusBar() {
  const { language, encoding, indentation, line, column, selectedCount } = useStatusBarStore();
  const { currentBranch } = useGitStore();
  const { fontZoom } = useEditorStore();
  const { activeView } = useUIStore();

  const rightItems = [
    { label: `Ln ${line}, Col ${column}${selectedCount > 1 ? ` (${selectedCount} selected)` : ''}`, onClick: () => {} },
    { label: `Spaces: ${fontZoom > 14 ? 4 : 2}`, onClick: () => {} },
    { label: encoding, onClick: () => {} },
    { label: 'LF', onClick: () => {} },
    { label: language, onClick: () => {}, highlight: true },
  ];

  return (
    <div className="flex items-center justify-between h-[22px] px-2 bg-airis-accent/5 border-t border-airis-border text-2xs text-airis-text-muted shrink-0 overflow-hidden">
      <div className="flex items-center gap-0">
        <button className="flex items-center gap-1 px-2 h-[22px] hover:bg-airis-surface-2 transition-colors text-airis-accent">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-0.5"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
          {currentBranch}
        </button>
        {activeView === 'editor' && (
          <>
            <span className="w-px h-3 bg-airis-border mx-0.5" />
            <span className="px-2 h-[22px] leading-[22px]">Errors: 0</span>
            <span className="px-2 h-[22px] leading-[22px] text-airis-yellow">Warnings: 0</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-0">
        {rightItems.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            className={`px-2 h-[22px] leading-[22px] hover:bg-airis-surface-2 transition-colors whitespace-nowrap ${item.highlight ? 'text-airis-text hover:text-airis-accent' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
