'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LogChannel {
  id: string;
  name: string;
  lines: string[];
}

export function OutputPanel() {
  const [activeChannel, setActiveChannel] = useState('main');
  const channels: LogChannel[] = [
    { id: 'main', name: 'Log', lines: ['[INFO] AIRIS IDE started', '[INFO] Workspace loaded', '[INFO] Extension host initialized'] },
    { id: 'extensions', name: 'Extensions', lines: ['[EXT] Loading extensions...', '[EXT] No extensions installed'] },
    { id: 'git', name: 'Git Output', lines: ['[GIT] No repository configured'] },
  ];
  const active = channels.find(c => c.id === activeChannel) || channels[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-airis-border overflow-x-auto scrollbar-none shrink-0">
        {channels.map(ch => (
          <button key={ch.id} onClick={() => setActiveChannel(ch.id)}
            className={cn('text-xs px-3 py-1 rounded whitespace-nowrap transition-colors', ch.id === activeChannel ? 'bg-airis-surface-2 text-airis-text' : 'text-airis-text-muted hover:text-airis-text')}>
            {ch.name}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-none p-3 font-mono text-xs leading-relaxed">
        {active.lines.map((line, i) => (
          <div key={i} className="text-airis-text-muted">{line}</div>
        ))}
      </div>
    </div>
  );
}
