'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store/stores';

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

const variants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function Workspace() {
  const { activeView, compactMode } = useUIStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeView}
        className="flex-1 flex flex-col overflow-hidden"
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        {activeView === 'editor' && <MonacoEditor />}
        {activeView === 'terminal' && <TerminalPanel compact={compactMode} />}
        {activeView === 'ai' && <AIPanel />}
        {activeView === 'git' && <GitPanel />}
        {activeView === 'files' && <MonacoEditor />}
      </motion.div>
    </AnimatePresence>
  );
}
