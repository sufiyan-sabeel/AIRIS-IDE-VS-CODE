import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'AIRIS IDE - Offline' };
export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-airis-black text-airis-text p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-airis-accent flex items-center justify-center mb-6"><span className="text-white font-bold text-2xl">A</span></div>
      <h1 className="text-lg font-semibold mb-2">Offline</h1>
      <p className="text-airis-text-muted text-sm max-w-[280px] mb-6">AIRIS IDE is in offline mode</p>
      <button onClick={() => window.location.reload()} className="px-6 py-3 bg-airis-accent text-white rounded-xl text-sm font-medium">Retry</button>
    </div>
  );
}
