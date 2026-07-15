'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useTerminalStore } from '@/store/stores';
import { cn } from '@/lib/utils';

export function TerminalPanel({ compact = false }: { compact?: boolean }) {
  const termRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const { terminals, activeTerminal, addTerminal, removeTerminal, setActiveTerminal } = useTerminalStore();

  useEffect(() => {
    if (!termRef.current || xtermRef.current) return;
    const term = new Terminal({
      cursorBlink: true, cursorStyle: 'bar', fontSize: compact ? 11 : 13,
      fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace",
      theme: { background: '#000', foreground: '#e0e0e0', cursor: '#e0e0e0', selectionBackground: '#333',
        green: '#4ec9b0', yellow: '#d7ba7d', blue: '#3794ff', cyan: '#4fc1ff' },
      allowTransparency: true, convertEol: true, scrollback: compact ? 200 : 2000,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    fitRef.current = fit;
    term.open(termRef.current);
    term.writeln('\x1b[1;34mAIRIS Terminal\x1b[0m\r\n');
    term.write('$ ');

    let line = '';
    term.onData(d => {
      if (d === '\r') { term.writeln(''); term.write('$ '); line = ''; }
      else if (d === '\x7f') { if (line.length > 0) { line = line.slice(0,-1); term.write('\b \b'); } }
      else { line += d; term.write(d); }
    });

    const resize = () => { try { fit.fit(); } catch {} };
    resize(); window.addEventListener('resize', resize);
    const obs = new ResizeObserver(resize); if (termRef.current) obs.observe(termRef.current);
    xtermRef.current = term;
    return () => { window.removeEventListener('resize', resize); obs.disconnect(); term.dispose(); xtermRef.current = null; };
  }, []);

  useEffect(() => {
    if (xtermRef.current) { xtermRef.current.options.fontSize = compact ? 11 : 13; try { fitRef.current?.fit(); } catch {} }
  }, [compact]);

  const vk = (key: string) => {
    const t = xtermRef.current; if (!t) return;
    const k: Record<string, string> = { tab: '\t', ctrl_c: '\x03', ctrl_d: '\x04', esc: '\x1b', up: '\x1b[A', down: '\x1b[B', left: '\x1b[D', right: '\x1b[C', enter: '\r', backspace: '\x7f' };
    if (k[key]) t.write(k[key]);
  };

  const keys = compact
    ? ['esc', 'tab', 'ctrl_c', 'enter', 'backspace']
    : ['esc', 'tab', 'ctrl_c', 'up', 'down', 'left', 'right', 'enter', 'backspace'];
  const labels: Record<string, string> = { esc: 'Esc', tab: '⇥', ctrl_c: '^C', up: '↑', down: '↓', left: '←', right: '→', enter: '⏎', backspace: '⌫' };

  return (
    <div className={cn('flex flex-col bg-black', compact ? 'flex-shrink-0' : 'flex-1')}>
      <div className="flex items-center justify-between px-2 h-8 bg-airis-graphite border-b border-airis-border shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {terminals.map(t => (
            <div key={t.id} className="flex items-center">
              <button onClick={() => setActiveTerminal(t.id)}
                className={cn('text-xs px-2 py-1 rounded whitespace-nowrap', t.id === activeTerminal ? 'bg-airis-surface-2 text-airis-text' : 'text-airis-text-muted')}>{t.name}</button>
              {terminals.length > 1 && <button onClick={() => removeTerminal(t.id)} className="w-4 h-4 flex items-center justify-center text-airis-text-muted"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
            </div>
          ))}
        </div>
        <button onClick={addTerminal} className="w-6 h-6 flex items-center justify-center text-airis-text-muted" aria-label="New terminal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      <div className={cn('relative', compact ? 'h-20' : 'flex-1')}><div ref={termRef} className="absolute inset-0" /></div>
      <div className="flex items-center gap-1 px-2 py-1.5 bg-airis-graphite border-t border-airis-border overflow-x-auto scrollbar-none shrink-0">
        {keys.map(k => (
          <button key={k} onTouchEnd={e => { e.preventDefault(); vk(k); }}
            className={cn('h-8 min-w-[32px] px-2 flex items-center justify-center rounded text-xs font-medium shrink-0',
              ['enter','backspace','esc'].includes(k) ? 'bg-airis-surface-2 text-airis-text border border-airis-border' : 'bg-airis-surface text-airis-text-muted')}>
            {labels[k] ?? k}
          </button>
        ))}
      </div>
    </div>
  );
}
