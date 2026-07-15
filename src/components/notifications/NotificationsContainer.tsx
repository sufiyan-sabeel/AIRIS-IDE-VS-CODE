'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNotificationsStore, type Notification } from '@/store/stores';

export function NotificationsContainer() {
  const { toasts, dismissToast } = useNotificationsStore();

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 max-w-[320px] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="pointer-events-auto bg-airis-surface-2 border border-airis-border rounded-xl shadow-xl overflow-hidden"
          >
            <div className="flex items-start gap-3 p-3">
              <span className="mt-0.5">{getIcon(toast.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-airis-text">{toast.message}</p>
                {toast.actions && toast.actions.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {toast.actions.map((a, i) => (
                      <button key={i} onClick={a.action} className="text-xs text-airis-accent font-medium">{a.label}</button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => dismissToast(toast.id)} className="text-airis-text-muted hover:text-airis-text shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function getIcon(type: Notification['type']): React.ReactNode {
  const colors = { info: 'text-airis-accent', warning: 'text-airis-yellow', error: 'text-airis-red', success: 'text-airis-green' };
  const paths = {
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    warning: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    error: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>,
    success: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
  };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={colors[type]}>{paths[type]}</svg>;
}
