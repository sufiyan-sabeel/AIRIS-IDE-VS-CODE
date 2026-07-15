'use client';

export function ExtensionsPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-airis-border"><h2 className="text-sm font-semibold text-airis-text">Extensions</h2></div>
      <div className="flex-1 flex flex-col items-center justify-center text-airis-text-muted text-sm px-6 text-center">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-40"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        <p>No extensions installed</p>
        <p className="text-xs mt-1 opacity-60">Marketplace coming soon</p>
      </div>
    </div>
  );
}
