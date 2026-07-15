'use client';

import { useProblemsStore } from '@/store/stores';
import { cn } from '@/lib/utils';

export function ProblemsPanel() {
  const { problems, filter, setFilter } = useProblemsStore();
  const errors = problems.filter(p => p.type === 'error');
  const warnings = problems.filter(p => p.type === 'warning');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-airis-border text-xs text-airis-text-muted">
        <button className="flex items-center gap-1 text-airis-red font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {errors.length} Errors
        </button>
        <button className="flex items-center gap-1 text-airis-yellow font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          {warnings.length} Warnings
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none">
        {problems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-airis-text-muted text-sm px-6 text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40 mb-2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <p>No problems detected</p>
          </div>
        ) : (
          problems.map((p, i) => (
            <div key={i} className="flex items-start gap-2 px-4 py-2 text-sm hover:bg-airis-surface-2/50 min-h-[36px]">
              {p.type === 'error' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-airis-red mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-airis-yellow mt-0.5 shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-airis-text text-truncate">{p.message}</p>
                <p className="text-2xs text-airis-text-muted font-mono">{p.file}:{p.line}:{p.column}{p.code ? ` (${p.code})` : ''}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
