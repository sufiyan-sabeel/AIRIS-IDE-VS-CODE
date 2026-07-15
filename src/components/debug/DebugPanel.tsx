'use client';

import { useDebugStore } from '@/store/stores';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function DebugPanel() {
  const { running, setRunning, breakpoints, callStack, variables, watches, addWatch, removeWatch, addBreakpoint, removeBreakpoint } = useDebugStore();
  const [watchInput, setWatchInput] = useState('');
  const [activeSection, setActiveSection] = useState<'variables' | 'watch' | 'callstack'>('variables');

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-airis-border shrink-0">
        <button onClick={() => setRunning(!running)}
          className={cn('w-7 h-7 rounded flex items-center justify-center', running ? 'bg-airis-red text-white' : 'bg-airis-surface-2 text-airis-text-muted')}>
          {running
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
        </button>
        <button className="w-7 h-7 rounded bg-airis-surface-2 flex items-center justify-center text-airis-text-muted">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        </button>
        <button className="w-7 h-7 rounded bg-airis-surface-2 flex items-center justify-center text-airis-text-muted">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"/></svg>
        </button>
        <button className="w-7 h-7 rounded bg-airis-surface-2 flex items-center justify-center text-airis-text-muted">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>
        </button>
        <span className="flex-1" />
        <span className="text-2xs text-airis-text-muted">{running ? 'Running' : 'Stopped'}</span>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 px-3 py-1 border-b border-airis-border text-xs text-airis-text-muted">
        {(['variables', 'watch', 'callstack'] as const).map(s => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={cn('px-2 py-1 rounded capitalize', activeSection === s ? 'bg-airis-surface-2 text-airis-text' : '')}>{s}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none text-sm">
        {activeSection === 'variables' && (
          variables.length === 0
            ? <EmptySection text="No variables" />
            : variables.map((v, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-1.5 font-mono text-xs hover:bg-airis-surface-2/50">
                  <span className="text-airis-text-muted">{v.type}</span>
                  <span className="text-airis-cyan">{v.name}</span>
                  <span className="text-airis-text-muted">=</span>
                  <span className="text-airis-green text-truncate">{v.value}</span>
                </div>
              ))
        )}

        {activeSection === 'watch' && (
          <div>
            <div className="flex items-center gap-1 px-3 py-2 border-b border-airis-border">
              <input type="text" value={watchInput} onChange={e => setWatchInput(e.target.value)}
                placeholder="Add expression..."
                className="flex-1 bg-transparent text-xs text-airis-text placeholder-airis-text-muted/50 outline-none"
                onKeyDown={e => { if (e.key === 'Enter' && watchInput) { addWatch(watchInput); setWatchInput(''); }}} />
              <button onClick={() => { if (watchInput) { addWatch(watchInput); setWatchInput(''); }}} className="text-airis-accent text-xs">Add</button>
            </div>
            {watches.length === 0
              ? <EmptySection text="No watch expressions" />
              : watches.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-1.5 font-mono text-xs hover:bg-airis-surface-2/50">
                    <span className="text-airis-cyan">{w.expression}</span>
                    <span className="text-airis-text-muted">=</span>
                    <span className="text-airis-green">{w.value || '(not evaluated)'}</span>
                    <button onClick={() => removeWatch(w.expression)} className="ml-auto text-airis-text-muted hover:text-airis-red">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))
            }
          </div>
        )}

        {activeSection === 'callstack' && (
          callStack.length === 0
            ? <EmptySection text="No call stack" />
            : callStack.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-1.5 font-mono text-xs hover:bg-airis-surface-2/50">
                  <span className="w-4 h-4 rounded-full bg-airis-accent/20 text-airis-accent text-2xs flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="text-airis-text text-truncate">{f.name}</span>
                  <span className="text-airis-text-muted text-truncate ml-auto">{f.file}:{f.line}</span>
                </div>
              ))
        )}

        {/* Breakpoints section */}
        <div className="border-t border-airis-border mt-2">
          <div className="px-4 py-1.5 text-2xs font-semibold uppercase text-airis-text-muted tracking-wider">Breakpoints ({breakpoints.length})</div>
          {breakpoints.length === 0
            ? <div className="px-4 py-4 text-xs text-airis-text-muted text-center">No breakpoints set</div>
            : breakpoints.map((bp, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-1.5 font-mono text-xs hover:bg-airis-surface-2/50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f44747" stroke="none"><circle cx="12" cy="12" r="8"/></svg>
                  <span className="text-airis-text-muted">{bp.file}:{bp.line}</span>
                  <button onClick={() => removeBreakpoint(bp.file, bp.line)} className="ml-auto text-airis-text-muted hover:text-airis-red">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

function EmptySection({ text }: { text: string }) {
  return <div className="px-4 py-8 text-xs text-airis-text-muted text-center">{text}</div>;
}
