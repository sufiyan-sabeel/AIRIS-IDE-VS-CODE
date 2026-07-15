'use client';

import { useState } from 'react';
import { useWorkspaceStore, useEditorStore } from '@/store/stores';
import { cn } from '@/lib/utils';

export function FileExplorer() {
  const { files, setFiles } = useWorkspaceStore();
  const { openFile, activeFile } = useEditorStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; path: string } | null>(null);

  const handleFilePress = (path: string) => {
    openFile(path, `// ${path}\n\n`);
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent, path: string) => {
    e.preventDefault();
    const pos = 'touches' in e
      ? { x: e.touches[0]?.clientX ?? 0, y: e.touches[0]?.clientY ?? 0 }
      : { x: e.clientX, y: e.clientY };
    setContextMenu(pos);
  };

  const handleCreateFile = () => {
    const name = prompt('File name:');
    if (!name) return;
    const newPath = `/workspace/${name}`;
    setFiles([...files, { path: newPath, name, type: 'file' }]);
    setContextMenu(null);
  };

  const handleCreateFolder = () => {
    const name = prompt('Folder name:');
    if (!name) return;
    const newPath = `/workspace/${name}`;
    setFiles([...files, { path: newPath, name, type: 'directory', children: [] }]);
    setContextMenu(null);
  };

  const handleDelete = (path: string) => {
    if (!confirm(`Delete ${path}?`)) return;
    setFiles(files.filter(f => f.path !== path));
    setContextMenu(null);
  };

  const handleRename = (oldPath: string, oldName: string) => {
    const name = prompt('New name:', oldName);
    if (!name || name === oldName) return;
    const newPath = oldPath.replace(oldName, name);
    setFiles(files.map(f => f.path === oldPath ? { ...f, path: newPath, name } : f));
    setContextMenu(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-airis-border">
        <h2 className="text-sm font-semibold text-airis-text">Explorer</h2>
        <div className="flex gap-1">
          <button onClick={handleCreateFile} className="touch-target-sm text-airis-text-muted hover:text-airis-text rounded-md" aria-label="New file" title="New File">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button onClick={handleCreateFolder} className="touch-target-sm text-airis-text-muted hover:text-airis-text rounded-md" aria-label="New folder" title="New Folder">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
          </button>
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto scrollbar-none py-2" onContextMenu={(e) => e.preventDefault()}>
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-airis-text-muted/40 mb-3"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            <p className="text-airis-text-muted text-sm">No files</p>
            <button onClick={handleCreateFile} className="mt-2 text-xs text-airis-accent">Create a new file</button>
          </div>
        ) : (
          <FileTree
            entries={files}
            onOpen={handleFilePress}
            onContextMenu={handleContextMenu}
            activeFile={activeFile}
          />
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-airis-surface-2 border border-airis-border rounded-lg shadow-xl py-1 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button onClick={handleCreateFile} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-airis-text hover:bg-airis-surface-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>New File
            </button>
            <button onClick={handleCreateFolder} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-airis-text hover:bg-airis-surface-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>New Folder
            </button>
            <div className="h-px bg-airis-border my-1" />
            <button onClick={() => handleRename(contextMenu.path, contextMenu.path.split('/').pop() || '')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-airis-text hover:bg-airis-surface-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>Rename
            </button>
            <button onClick={() => handleDelete(contextMenu.path)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-airis-red hover:bg-airis-surface-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function FileTree({
  entries,
  onOpen,
  onContextMenu,
  activeFile,
  depth = 0,
}: {
  entries: { path: string; name: string; type: string; children?: any[] }[];
  onOpen: (path: string) => void;
  onContextMenu: (e: React.MouseEvent | React.TouchEvent, path: string) => void;
  activeFile: string | null;
  depth?: number;
}) {
  return (
    <div>
      {entries.map((e) => (
        <div key={e.path}>
          {e.type === 'directory' ? (
            <div>
              <div
                className="flex items-center gap-2 px-4 py-2 text-airis-text-secondary text-sm hover:bg-airis-surface-2/50 transition-colors"
                style={{ paddingLeft: `${12 + depth * 16}px` }}
                onContextMenu={(ev) => onContextMenu(ev, e.path)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-airis-yellow shrink-0"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <span className="text-truncate">{e.name}</span>
              </div>
              {e.children && (
                <FileTree entries={e.children} onOpen={onOpen} onContextMenu={onContextMenu} activeFile={activeFile} depth={depth + 1} />
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpen(e.path)}
              onContextMenu={(ev) => onContextMenu(ev, e.path)}
              onTouchEnd={(ev) => {
                // Long press for context menu
                if (ev.currentTarget.dataset.longpress === 'true') {
                  onContextMenu(ev, e.path);
                }
              }}
              className={cn(
                'flex items-center gap-2 w-full text-left px-4 py-2 text-sm min-h-[40px] transition-colors',
                activeFile === e.path ? 'bg-airis-accent/10 text-airis-accent' : 'text-airis-text hover:bg-airis-surface-2/50'
              )}
              style={{ paddingLeft: `${12 + depth * 16}px` }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60 shrink-0"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
              <span className="text-truncate">{e.name}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
