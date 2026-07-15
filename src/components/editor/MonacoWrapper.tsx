'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { OnMount, OnChange } from '@monaco-editor/react';
import { useEditorStore, useUIStore } from '@/store/stores';
import { cn } from '@/lib/utils';

const Editor = dynamic(() => import('@monaco-editor/react').then(m => m.default), { ssr: false });

export function MonacoWrapper() {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const { tabs, activeFile, files, updateContent, fontZoom } = useEditorStore();
  const { fullscreenEditor, setFullscreenEditor } = useUIStore();
  const [mounted, setMounted] = useState(false);

  const activeTab = tabs.find(t => t.path === activeFile);
  const content = activeFile && files[activeFile] !== undefined ? files[activeFile] : '';

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    setMounted(true);
    editor.updateOptions({
      fontSize: fontZoom,
      fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace",
      minimap: { enabled: false },
      lineNumbersMinChars: 3,
      padding: { top: 8, bottom: 8 },
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      wordWrap: 'on',
      automaticLayout: true,
      scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6, useShadows: false },
      bracketPairColorization: { enabled: true },
      tabSize: 2,
      insertSpaces: true,
      mouseWheelZoom: true,
    });
  }, [fontZoom]);

  useEffect(() => {
    if (editorRef.current && mounted) editorRef.current.updateOptions({ fontSize: fontZoom });
  }, [fontZoom, mounted]);

  const handleChange: OnChange = useCallback((value) => {
    if (activeFile && value !== undefined) updateContent(activeFile, value);
  }, [activeFile, updateContent]);

  if (!activeTab) {
    return (
      <div className="flex-1 flex items-center justify-center bg-airis-black">
        <div className="flex flex-col items-center gap-4 text-airis-text-muted px-8 text-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-30"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <div><p className="text-base font-medium text-airis-text-secondary">No file open</p><p className="text-sm mt-1 max-w-[260px]">Open a file from the Explorer</p></div>
          <button onClick={() => useUIStore.getState().togglePanel('explorer')} className="px-4 py-2 bg-airis-accent text-white text-sm rounded-lg font-medium touch-target">Open Files</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-airis-black">
      <div className="flex items-center h-9 bg-airis-surface overflow-x-auto scrollbar-none border-b border-airis-border shrink-0">
        {tabs.map(tab => <TabItem key={tab.path} tab={tab} isActive={tab.path === activeFile} />)}
      </div>
      <div className="flex-1 relative overflow-hidden">
        <Editor key={`${activeFile}-${fontZoom}`} defaultLanguage={activeTab.language} language={activeTab.language} value={content}
          onChange={handleChange} onMount={handleMount} theme="vs-dark"
          options={{
            fontSize: fontZoom, fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace",
            lineNumbers: 'on', minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on',
            automaticLayout: true, padding: { top: 8 }, smoothScrolling: true, cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on', bracketPairColorization: { enabled: true }, tabSize: 2,
            insertSpaces: true, mouseWheelZoom: true, folding: true,
          }} />
      </div>
      <div className="absolute bottom-2 right-2 z-10">
        <button onClick={() => setFullscreenEditor(!fullscreenEditor)}
          className="w-9 h-9 rounded-lg bg-airis-surface/90 backdrop-blur border border-airis-border flex items-center justify-center text-airis-text-muted"
          aria-label={fullscreenEditor ? 'Exit fullscreen' : 'Fullscreen'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {fullscreenEditor
              ? <><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></>
              : <><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></>}
          </svg>
        </button>
      </div>
    </div>
  );
}

function TabItem({ tab, isActive }: { tab: { path: string; name: string; dirty: boolean }; isActive: boolean }) {
  const { closeFile, setActiveFile } = useEditorStore();
  return (
    <button onClick={() => setActiveFile(tab.path)}
      className={cn('flex items-center gap-1.5 px-3 h-full text-xs border-r border-airis-border shrink-0 transition-colors min-w-0',
        isActive ? 'bg-airis-black text-airis-text border-b-2 border-b-airis-accent' : 'bg-airis-surface text-airis-text-muted hover:text-airis-text')}>
      <span className="text-truncate max-w-[100px]">{tab.name}</span>
      {tab.dirty && <span className="text-airis-yellow text-2xs">●</span>}
      <button onClick={e => { e.stopPropagation(); closeFile(tab.path); }}
        className="ml-0.5 w-4 h-4 flex items-center justify-center rounded hover:bg-airis-surface-2 text-airis-text-muted shrink-0">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </button>
  );
}
