'use client';

import { useState } from 'react';

export function SearchPanel() {
  const [query, setQuery] = useState('');
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-airis-border"><h2 className="text-sm font-semibold text-airis-text">Search</h2></div>
      <div className="p-3"><input type="text" placeholder="Search files..." value={query} onChange={e => setQuery(e.target.value)}
        className="w-full px-3 py-2.5 bg-airis-surface-2 border border-airis-border rounded-lg text-sm text-airis-text placeholder-airis-text-muted/50 focus:outline-none focus:border-airis-accent" /></div>
      <div className="flex-1 flex items-center justify-center text-airis-text-muted text-sm">
        {query ? 'Results will appear here' : 'Search across your project'}
      </div>
    </div>
  );
}
