'use client';

import { useState } from 'react';
import { useGitStore } from '@/store/stores';
import { cn } from '@/lib/utils';

export function GitPanel() {
  const { status, currentBranch, branches, commits, setCurrentBranch, addCommit } = useGitStore();
  const [msg, setMsg] = useState('');
  const [showCommit, setShowCommit] = useState(false);
  const total = status.modified.length + status.staged.length + status.untracked.length + status.conflicts.length;

  const doCommit = () => { if (!msg.trim()) return; addCommit(`c${Date.now().toString(36)}`, msg.trim()); setMsg(''); setShowCommit(false); };
  const switchBranch = () => { const i = branches.indexOf(currentBranch); const n = branches[(i + 1) % branches.length]; if (n) setCurrentBranch(n); };

  const FileRow = ({ name, type }: { name: string; type: string }) => {
    const colors: Record<string, string> = { staged: 'bg-airis-green', modified: 'bg-airis-yellow', untracked: 'bg-airis-text-muted', conflict: 'bg-airis-red' };
    return (
      <div className="flex items-center gap-3 px-4 py-2 min-h-[40px] hover:bg-airis-surface-2/50">
        <div className={cn('w-2 h-2 rounded-full shrink-0', colors[type] || 'bg-airis-text-muted')} />
        <span className="text-sm font-mono text-airis-text text-truncate">{name}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-airis-black">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-airis-surface-2 border-b border-airis-border">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-airis-text-muted"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
        <span className="font-mono text-sm font-medium text-airis-text">{currentBranch}</span>
        <button onClick={switchBranch} className="ml-auto text-xs text-airis-text-muted px-2 py-1 rounded">Switch</button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none">
        {total === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-airis-text-muted/40 mb-3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <p className="text-airis-text-muted text-sm">Clean working tree</p>
          </div>
        ) : (
          <div className="py-2">
            {status.staged.length > 0 && <div><div className="px-4 py-1.5 text-2xs font-semibold uppercase text-airis-text-muted">Staged ({status.staged.length})</div>{status.staged.map(f => <FileRow key={f} name={f} type="staged" />)}</div>}
            {status.modified.length > 0 && <div><div className="px-4 py-1.5 text-2xs font-semibold uppercase text-airis-text-muted">Modified ({status.modified.length})</div>{status.modified.map(f => <FileRow key={f} name={f} type="modified" />)}</div>}
            {status.untracked.length > 0 && <div><div className="px-4 py-1.5 text-2xs font-semibold uppercase text-airis-text-muted">Untracked ({status.untracked.length})</div>{status.untracked.map(f => <FileRow key={f} name={f} type="untracked" />)}</div>}
          </div>
        )}

        {commits.length > 0 && (
          <div className="border-t border-airis-border py-2">
            <div className="px-4 py-1.5 text-2xs font-semibold uppercase text-airis-text-muted">History</div>
            {commits.map(c => (
              <div key={c.hash} className="flex items-start gap-2 px-4 py-2">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-airis-accent shrink-0" />
                <div className="min-w-0"><p className="text-sm text-airis-text text-truncate">{c.message}</p><p className="text-2xs text-airis-text-muted font-mono">{c.hash.slice(0, 8)}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!showCommit ? (
        <div className="flex gap-2 px-3 py-3 border-t border-airis-border">
          <button onClick={() => setShowCommit(true)} disabled={status.staged.length === 0}
            className={cn('flex-1 py-2.5 rounded-lg text-sm font-medium', status.staged.length > 0 ? 'bg-airis-accent text-white' : 'bg-airis-surface-2 text-airis-text-muted')}>Commit</button>
          <button className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-airis-surface-2 text-airis-text flex items-center justify-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>Push</button>
          <button className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-airis-surface-2 text-airis-text flex items-center justify-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>Pull</button>
        </div>
      ) : (
        <div className="px-3 py-3 border-t border-airis-border space-y-2" style={{ paddingBottom: 'var(--sab)' }}>
          <textarea placeholder="Commit message" value={msg} onChange={e => setMsg(e.target.value)} rows={2}
            className="w-full px-3 py-2 bg-airis-surface-2 border border-airis-border rounded-lg text-sm text-airis-text resize-none focus:outline-none focus:border-airis-accent" />
          <div className="flex gap-2">
            <button onClick={() => { setShowCommit(false); setMsg(''); }} className="flex-1 py-2 rounded-lg text-sm font-medium bg-airis-surface-2 text-airis-text">Cancel</button>
            <button onClick={doCommit} disabled={!msg.trim()} className={cn('flex-[2] py-2 rounded-lg text-sm font-medium', msg.trim() ? 'bg-airis-accent text-white' : 'bg-airis-surface-2 text-airis-text-muted')}>Commit</button>
          </div>
        </div>
      )}
    </div>
  );
}
