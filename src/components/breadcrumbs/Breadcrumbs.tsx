'use client';

import { useEditorStore } from '@/store/stores';

export function Breadcrumbs() {
  const { activeFile } = useEditorStore();

  if (!activeFile) return null;

  const parts = activeFile.split('/').filter(Boolean);

  return (
    <div className="flex items-center h-7 px-3 bg-airis-surface border-b border-airis-border overflow-x-auto scrollbar-none text-xs text-airis-text-muted shrink-0">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-1 whitespace-nowrap">
          {i > 0 && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-0.5 text-airis-text-muted/50">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
          <button
            className={`px-1 py-0.5 rounded hover:bg-airis-surface-2 transition-colors ${
              i === parts.length - 1 ? 'text-airis-text font-medium' : ''
            }`}
          >
            {i === 0 ? 'workspace' : part}
          </button>
        </span>
      ))}
    </div>
  );
}
