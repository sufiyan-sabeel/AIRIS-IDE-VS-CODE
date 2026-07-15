'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore, useEditorStore } from '@/store/stores';

interface Command {
  id: string;
  label: string;
  description: string;
  category: string;
  action: () => void;
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { tabs, openFile } = useEditorStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const commands: Command[] = [
    { id: 'files.new', label: 'New File', description: 'Create a new empty file', category: 'File', action: () => {} },
    { id: 'files.open', label: 'Open File...', description: 'Quick open a file by name', category: 'File', action: () => {} },
    { id: 'editor.save', label: 'Save', description: 'Save current file', category: 'Editor', action: () => {} },
    { id: 'editor.saveAll', label: 'Save All', description: 'Save all open files', category: 'Editor', action: () => {} },
    { id: 'editor.close', label: 'Close Editor', description: 'Close current editor tab', category: 'Editor', action: () => {} },
    { id: 'view.explorer', label: 'Toggle Explorer', description: 'Show/hide file explorer', category: 'View', action: () => { useUIStore.getState().togglePanel('explorer'); } },
    { id: 'view.search', label: 'Toggle Search', description: 'Show/hide search panel', category: 'View', action: () => { useUIStore.getState().togglePanel('search'); } },
    { id: 'view.terminal', label: 'Toggle Terminal', description: 'Show/hide terminal', category: 'View', action: () => { useUIStore.getState().setActiveView('terminal'); } },
    { id: 'view.git', label: 'Toggle Source Control', description: 'Show/hide git panel', category: 'View', action: () => { useUIStore.getState().setActiveView('git'); } },
    { id: 'view.ai', label: 'Toggle AIRIS AI', description: 'Open AI assistant chat', category: 'View', action: () => { useUIStore.getState().setActiveView('ai'); } },
    { id: 'editor.wordWrap', label: 'Toggle Word Wrap', description: 'Toggle word wrap in editor', category: 'Editor', action: () => {} },
    { id: 'editor.fontZoomIn', label: 'Zoom In', description: 'Increase editor font size', category: 'Editor', action: () => { const s = useEditorStore.getState(); s.setFontZoom(s.fontZoom + 1); } },
    { id: 'editor.fontZoomOut', label: 'Zoom Out', description: 'Decrease editor font size', category: 'Editor', action: () => { const s = useEditorStore.getState(); s.setFontZoom(s.fontZoom - 1); } },
    { id: 'editor.fontReset', label: 'Reset Zoom', description: 'Reset editor font size to default', category: 'Editor', action: () => { useEditorStore.getState().setFontZoom(14); } },
    { id: 'theme.dark', label: 'Dark Theme', description: 'Switch to dark theme', category: 'Preferences', action: () => { useUIStore.getState().setTheme('dark'); } },
    { id: 'theme.light', label: 'Light Theme', description: 'Switch to light theme', category: 'Preferences', action: () => { useUIStore.getState().setTheme('light'); } },
    { id: 'theme.amoled', label: 'AMOLED Theme', description: 'Switch to AMOLED dark theme', category: 'Preferences', action: () => { useUIStore.getState().setTheme('amoled'); } },
    { id: 'view.fullscreen', label: 'Toggle Fullscreen', description: 'Toggle fullscreen editor mode', category: 'View', action: () => { const s = useUIStore.getState(); s.setFullscreenEditor(!s.fullscreenEditor); } },
  ];

  // Quick open: show open tabs as results
  const quickOpenResults = query.startsWith('>') ? [] : tabs
    .filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
    .map(t => ({
      id: `file:${t.path}`,
      label: t.name,
      description: t.path,
      category: 'File',
      action: () => { useEditorStore.getState().setActiveFile(t.path); setCommandPaletteOpen(false); }
    }));

  // Command mode: prefix with >
  const isCommandMode = query.startsWith('>');
  const filteredCommands = isCommandMode
    ? commands.filter(c => {
        const q = query.slice(1).toLowerCase();
        return c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
      })
    : [];

  const results = isCommandMode ? filteredCommands : quickOpenResults;

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setCommandPaletteOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); return; }
    if (e.key === 'Enter' && results[selectedIndex]) {
      results[selectedIndex].action();
      setCommandPaletteOpen(false);
    }
  }, [results, selectedIndex, setCommandPaletteOpen]);

  // Scroll selected into view
  useEffect(() => {
    if (resultsRef.current) {
      const el = resultsRef.current.children[selectedIndex] as HTMLElement;
      el?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-[500px] bg-airis-graphite border border-airis-border rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-airis-border">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-airis-text-muted shrink-0">
                {isCommandMode
                  ? <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9L15 15"/><path d="M15 9L9 15"/></>
                  : <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>
                }
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder={isCommandMode ? 'Type a command name...' : 'Type > for commands, or search files...'}
                className="flex-1 bg-transparent text-sm text-airis-text placeholder-airis-text-muted/50 outline-none py-1"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-airis-text-muted hover:text-airis-text px-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>

            {results.length > 0 && (
              <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto scrollbar-none py-1">
                {results.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    onClick={() => { cmd.action(); setCommandPaletteOpen(false); }}
                    onPointerEnter={() => setSelectedIndex(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      i === selectedIndex ? 'bg-airis-accent/10 text-airis-accent' : 'text-airis-text hover:bg-airis-surface-2'
                    }`}
                  >
                    <span className="text-2xs text-airis-text-muted uppercase font-semibold w-16 shrink-0">{cmd.category}</span>
                    <span className="flex-1 text-truncate">{cmd.label}</span>
                    <span className="text-xs text-airis-text-muted text-truncate max-w-[200px]">{cmd.description}</span>
                  </button>
                ))}
              </div>
            )}

            {query && results.length === 0 && (
              <div className="px-4 py-8 text-center text-airis-text-muted text-sm">No matching results</div>
            )}

            <div className="px-3 py-2 border-t border-airis-border flex items-center gap-3 text-2xs text-airis-text-muted">
              <span><kbd className="px-1 py-0.5 rounded bg-airis-surface-2 text-xs">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1 py-0.5 rounded bg-airis-surface-2 text-xs">↵</kbd> Open</span>
              <span><kbd className="px-1 py-0.5 rounded bg-airis-surface-2 text-xs">Esc</kbd> Close</span>
              <span className="ml-auto"><kbd className="px-1 py-0.5 rounded bg-airis-surface-2 text-xs">&gt;</kbd> Commands</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
