'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore, useEditorStore } from '@/store/stores';
import { Breadcrumbs } from '@/components/breadcrumbs/Breadcrumbs';
import { StatusBar } from '@/components/statusbar/StatusBar';
import { WelcomePage } from '@/components/welcome/WelcomePage';
import { cn } from '@/lib/utils';

const MonacoEditor = dynamic(
  () => import('@/components/editor/MonacoWrapper').then(m => ({ default: m.MonacoWrapper })),
  { ssr: false, loading: () => <LoadingView text="Loading editor..." /> }
);

const TerminalPanel = dynamic(
  () => import('@/components/terminal/TerminalPanel').then(m => ({ default: m.TerminalPanel })),
  { ssr: false, loading: () => <LoadingView text="Loading terminal..." /> }
);

const AIPanel = dynamic(
  () => import('@/components/ai/AIPanel').then(m => ({ default: m.AIPanel })),
  { ssr: false }
);

const GitPanel = dynamic(
  () => import('@/components/git/GitPanel').then(m => ({ default: m.GitPanel })),
  { ssr: false }
);

const ProblemsPanel = dynamic(
  () => import('@/components/problems/ProblemsPanel').then(m => ({ default: m.ProblemsPanel })),
  { ssr: false }
);

const OutputPanel = dynamic(
  () => import('@/components/output/OutputPanel').then(m => ({ default: m.OutputPanel })),
  { ssr: false }
);

const DebugPanel = dynamic(
  () => import('@/components/debug/DebugPanel').then(m => ({ default: m.DebugPanel })),
  { ssr: false }
);

function LoadingView({ text }: { text: string }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-airis-black">
      <div className="flex flex-col items-center gap-3 text-airis-text-muted">
        <div className="w-8 h-8 border-2 border-airis-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">{text}</span>
      </div>
    </div>
  );
}

type PanelView = 'problems' | 'output' | 'debug' | null;

const variants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function Workspace() {
  const { activeView, compactMode } = useUIStore();
  const { tabs } = useEditorStore();
  const [panelView, setPanelView] = useState<PanelView>(null);

  const hasEditorTabs = tabs.length > 0;

  const renderPanelContent = () => {
    switch (panelView) {
      case 'problems': return <ProblemsPanel />;
      case 'output': return <OutputPanel />;
      case 'debug': return <DebugPanel />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main content with breadcrumbs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'editor' && hasEditorTabs && <Breadcrumbs />}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            className="flex-1 flex flex-col overflow-hidden"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {activeView === 'editor' && (hasEditorTabs ? <MonacoEditor /> : <WelcomePage />)}
            {activeView === 'terminal' && <TerminalPanel compact={compactMode} />}
            {activeView === 'ai' && <AIPanel />}
            {activeView === 'git' && <GitPanel />}
            {activeView === 'files' && (hasEditorTabs ? <MonacoEditor /> : <WelcomePage />)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom panel (Problems/Output/Debug) */}
      {panelView && (
        <div className="h-48 border-t border-airis-border bg-airis-black flex flex-col">
          <div className="flex items-center gap-1 px-2 py-1 bg-airis-graphite border-b border-airis-border shrink-0">
            <button onClick={() => setPanelView('problems')}
              className={cn('text-xs px-3 py-1 rounded', panelView === 'problems' ? 'bg-airis-surface-2 text-airis-text' : 'text-airis-text-muted')}>Problems</button>
            <button onClick={() => setPanelView('output')}
              className={cn('text-xs px-3 py-1 rounded', panelView === 'output' ? 'bg-airis-surface-2 text-airis-text' : 'text-airis-text-muted')}>Output</button>
            <button onClick={() => setPanelView('debug')}
              className={cn('text-xs px-3 py-1 rounded', panelView === 'debug' ? 'bg-airis-surface-2 text-airis-text' : 'text-airis-text-muted')}>Debug</button>
            <span className="flex-1" />
            <button onClick={() => setPanelView(null)} className="text-airis-text-muted hover:text-airis-text px-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {renderPanelContent()}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <StatusBar />

      {/* Panel toggle buttons (visible when panel closed) */}
      {!panelView && activeView === 'editor' && (
        <div className="absolute bottom-[22px] left-2 z-10 flex gap-1">
          <button onClick={() => setPanelView('problems')}
            className="h-6 px-2 rounded-t bg-airis-surface/80 backdrop-blur border border-airis-border border-b-0 text-2xs text-airis-text-muted hover:text-airis-text flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Problems
          </button>
          <button onClick={() => setPanelView('output')}
            className="h-6 px-2 rounded-t bg-airis-surface/80 backdrop-blur border border-airis-border border-b-0 text-2xs text-airis-text-muted hover:text-airis-text flex items-center gap-1">
            Output
          </button>
        </div>
      )}
    </div>
  );
}
