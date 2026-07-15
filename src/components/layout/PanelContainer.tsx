'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store/stores';
import { FileExplorer } from '@/components/panels/FileExplorer';
import { SearchPanel } from '@/components/panels/SearchPanel';
import { ExtensionsPanel } from '@/components/panels/ExtensionsPanel';
import { SourceControl } from '@/components/panels/SourceControl';
import { SettingsPanel } from '@/components/panels/SettingsPanel';
import { cn } from '@/lib/utils';

const variants = {
  left: { hidden: { x: '-100%' }, visible: { x: 0, transition: { type: 'spring', damping: 28, stiffness: 300 } }, exit: { x: '-100%', transition: { duration: 0.2 } } },
  right: { hidden: { x: '100%' }, visible: { x: 0, transition: { type: 'spring', damping: 28, stiffness: 300 } }, exit: { x: '100%', transition: { duration: 0.2 } } },
};

export function PanelContainer() {
  const { activePanel, panelOpen, panelSide, closePanel } = useUIStore();

  const renderPanel = () => {
    switch (activePanel) {
      case 'explorer': return <FileExplorer />;
      case 'search': return <SearchPanel />;
      case 'extensions': return <ExtensionsPanel />;
      case 'source-control': return <SourceControl />;
      case 'settings': return <SettingsPanel />;
      default: return null;
    }
  };

  if (!activePanel) return null;

  const v = panelSide === 'right' ? variants.right : variants.left;

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          <motion.div key="overlay" className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }} onClick={closePanel} />
          <motion.aside key="panel"
            className={cn('fixed top-0 bottom-0 z-40 bg-airis-graphite shadow-2xl flex flex-col', 'w-[85vw] max-w-[400px] border-r border-airis-border', panelSide === 'right' && 'border-r-0 border-l border-airis-border')}
            style={{ paddingTop: 'var(--sat)' }}
            variants={v} initial="hidden" animate="visible" exit="exit">
            {renderPanel()}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
