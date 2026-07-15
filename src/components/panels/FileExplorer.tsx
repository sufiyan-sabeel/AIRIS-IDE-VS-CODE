'use client';

import { useWorkspaceStore, useEditorStore } from '@/store/stores';
import { cn } from '@/lib/utils';

export function FileExplorer() {
  const { files } = useWorkspaceStore();
  const { openFile, activeFile } = useEditorStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-airis-border">
        <h2 className="text-sm font-semibold text-airis-text">Explorer</h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-none py-2">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-airis-text-muted/40 mb-3"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            <p className="text-airis-text-muted text-sm">Empty workspace</p>
          </div>
        ) : (
          <Tree entries={files} onOpen={openFile} activeFile={activeFile} />
        )}
      </div>
    </div>
  );
}

function Tree({ entries, onOpen, activeFile, depth = 0 }: {
  entries: { path: string; name: string; type: string; children?: any[] }[];
  onOpen: (path: string) => void;
  activeFile: string | null;
  depth?: number;
}) {
  return (
    <div>
      {entries.map((e) => (
        <div key={e.path}>
          {e.type === 'directory' ? (
            <div>
              <div className="flex items-center gap-2 px-4 py-2 text-airis-text-secondary text-sm hover:bg-airis-surface-2/50" style={{ paddingLeft: `${12 + depth * 16}px` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-airis-yellow"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <span className="text-truncate">{e.name}</span>
              </div>
              {e.children && <Tree entries={e.children} onOpen={onOpen} activeFile={activeFile} depth={depth + 1} />}
            </div>
          ) : (
            <button onClick={() => onOpen(e.path)}
              className={cn('flex items-center gap-2 w-full text-left px-4 py-2 text-sm min-h-[40px] transition-colors', activeFile === e.path ? 'bg-airis-accent/10 text-airis-accent' : 'text-airis-text hover:bg-airis-surface-2/50')}
              style={{ paddingLeft: `${12 + depth * 16}px` }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
              <span className="text-truncate">{e.name}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
