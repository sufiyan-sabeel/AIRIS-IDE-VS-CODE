'use client';

import { useEffect, useRef } from 'react';
import { useUIStore } from '@/store/stores';

export function GestureHandler() {
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    const handleStart = (e: TouchEvent) => {
      const t = e.touches[0]; if (!t) return;
      startX.current = t.clientX;
      startY.current = t.clientY;
    };
    const handleEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0]; if (!t) return;
      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 0.5) return;
      const state = useUIStore.getState();
      const aw = state.activeView;
      if (dx > 0 && !state.panelOpen && aw !== 'ai' && startX.current < 30) state.togglePanel('explorer');
      else if (dx < 0 && !state.panelOpen && aw === 'editor' && startX.current > window.innerWidth - 30) state.togglePanel('settings');
      else if (dx < 0 && state.panelOpen && state.panelSide === 'left') state.closePanel();
      else if (dx > 0 && state.panelOpen && state.panelSide === 'right') state.closePanel();
    };
    document.addEventListener('touchstart', handleStart, { passive: true });
    document.addEventListener('touchend', handleEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('touchend', handleEnd);
    };
  }, []);

  return null;
}
