'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { PanelContainer } from '@/components/layout/PanelContainer';
import { GestureHandler } from '@/components/layout/GestureHandler';
import { CommandPalette } from '@/components/panels/CommandPalette';
import { NotificationsContainer } from '@/components/notifications/NotificationsContainer';
import Workspace from '@/app/workspace';
import { useUIStore, useWorkspaceStore } from '@/store/stores';

export default function MainPage() {
  const { fullscreenEditor, commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { files, setFiles } = useWorkspaceStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut: Ctrl+P / Cmd+P for Quick Open, Ctrl+Shift+P / Cmd+Shift+P for Commands
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && e.key === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (isCmd && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  // Initialize demo workspace files
  useEffect(() => {
    if (files.length === 0) {
      setFiles([
        { path: '/workspace/src', name: 'src', type: 'directory', children: [
          { path: '/workspace/src/index.ts', name: 'index.ts', type: 'file' },
          { path: '/workspace/src/app.tsx', name: 'app.tsx', type: 'file' },
          { path: '/workspace/src/utils.ts', name: 'utils.ts', type: 'file' },
        ]},
        { path: '/workspace/package.json', name: 'package.json', type: 'file' },
        { path: '/workspace/README.md', name: 'README.md', type: 'file' },
        { path: '/workspace/src/components', name: 'components', type: 'directory', children: [
          { path: '/workspace/src/components/Header.tsx', name: 'Header.tsx', type: 'file' },
          { path: '/workspace/src/components/Footer.tsx', name: 'Footer.tsx', type: 'file' },
        ]},
      ]);
    }
  }, [files.length, setFiles]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-airis-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-airis-accent flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div className="w-8 h-8 border-2 border-airis-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-airis-black">
      <GestureHandler />
      {!fullscreenEditor && <TopBar />}
      <div className="flex-1 flex overflow-hidden relative">
        <PanelContainer />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <Workspace />
        </main>
      </div>
      {!fullscreenEditor && <BottomNav />}

      {/* Command Palette (overlay) */}
      <CommandPalette />

      {/* Notifications */}
      <NotificationsContainer />
    </div>
  );
}
