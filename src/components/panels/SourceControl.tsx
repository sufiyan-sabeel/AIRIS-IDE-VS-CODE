'use client';

export function SourceControl() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-airis-border"><h2 className="text-sm font-semibold text-airis-text">Source Control</h2></div>
      <div className="flex-1 flex flex-col items-center justify-center text-airis-text-muted text-sm px-6 text-center">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-40"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <p>No changes yet</p>
      </div>
    </div>
  );
}
