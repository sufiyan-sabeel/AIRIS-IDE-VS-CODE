'use client';

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useAIStore } from '@/store/stores';
import { cn } from '@/lib/utils';

const actions = [
  { label: 'Explain', prompt: 'Explain the selected code:', icon: '?' },
  { label: 'Generate', prompt: 'Generate code for:', icon: '+' },
  { label: 'Refactor', prompt: 'Refactor this code:', icon: '~' },
  { label: 'Debug', prompt: 'Debug this code. Issue:', icon: '!' },
  { label: 'Analyze', prompt: 'Analyze the project:', icon: '#' },
];

export function AIPanel() {
  const { provider, chatHistory, isProcessing, addMessage, clearChat, setIsProcessing, setProvider } = useAIStore();
  const [input, setInput] = useState('');
  const [showConfig, setShowConfig] = useState(!provider);
  const [endpoint, setEndpoint] = useState(provider?.endpoint || '');
  const [apiKey, setApiKey] = useState(provider?.apiKey || '');
  const [model, setModel] = useState(provider?.model || 'gpt-3.5-turbo');
  const [name, setName] = useState(provider?.name || 'Custom');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const send = async () => {
    const t = input.trim(); if (!t || isProcessing || !provider) return;
    addMessage({ role: 'user', content: t, timestamp: Date.now() }); setInput(''); setIsProcessing(true);
    try {
      const res = await callAI(provider, t, chatHistory);
      addMessage({ role: 'assistant', content: res, timestamp: Date.now() });
    } catch (err) { addMessage({ role: 'assistant', content: `**Error:** ${err instanceof Error ? err.message : 'Request failed'}`, timestamp: Date.now() }); }
    finally { setIsProcessing(false); }
  };

  const keyDown = (e: KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  if (showConfig) {
    return (
      <div className="flex flex-col h-full bg-airis-black">
        <div className="flex items-center justify-between px-4 py-3 border-b border-airis-border">
          <h2 className="text-sm font-semibold text-airis-text">AI Configuration</h2>
          {provider && <button onClick={() => setShowConfig(false)} className="text-xs text-airis-accent px-2 py-1">Back</button>}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-airis-accent/10 flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-airis-accent"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            </div>
            <p className="text-airis-text text-sm font-medium">Connect your AI provider</p>
            <p className="text-airis-text-muted text-xs mt-1">No API keys sent to our servers</p>
          </div>
          <input type="text" placeholder="Provider name" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-airis-surface-2 border border-airis-border rounded-lg text-sm text-airis-text focus:outline-none focus:border-airis-accent" />
          <input type="text" placeholder="API Endpoint" value={endpoint} onChange={e => setEndpoint(e.target.value)}
            className="w-full px-3 py-2.5 bg-airis-surface-2 border border-airis-border rounded-lg text-sm text-airis-text focus:outline-none focus:border-airis-accent" />
          <input type="password" placeholder="API Key" value={apiKey} onChange={e => setApiKey(e.target.value)}
            className="w-full px-3 py-2.5 bg-airis-surface-2 border border-airis-border rounded-lg text-sm text-airis-text focus:outline-none focus:border-airis-accent" />
          <input type="text" placeholder="Model (e.g., gpt-4)" value={model} onChange={e => setModel(e.target.value)}
            className="w-full px-3 py-2.5 bg-airis-surface-2 border border-airis-border rounded-lg text-sm text-airis-text focus:outline-none focus:border-airis-accent" />
          <button onClick={() => { setProvider({ id: 'custom', name, endpoint, apiKey, model }); setShowConfig(false); }}
            disabled={!endpoint || !apiKey}
            className={cn('w-full py-3 rounded-lg font-medium text-sm', endpoint && apiKey ? 'bg-airis-accent text-white' : 'bg-airis-surface-2 text-airis-text-muted')}>Save</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-airis-black">
      <div className="flex items-center justify-between px-4 py-3 border-b border-airis-border">
        <div className="flex items-center gap-2"><h2 className="text-sm font-semibold text-airis-text">AIRIS AI</h2>{provider && <span className="text-2xs text-airis-text-muted px-1.5 py-0.5 rounded bg-airis-surface-2">{provider.name}</span>}</div>
        <div className="flex gap-2">
          <button onClick={() => clearChat()} className="text-xs text-airis-text-muted px-2 py-1 rounded">Clear</button>
          <button onClick={() => setShowConfig(true)} className="text-xs text-airis-accent px-2 py-1 rounded">Settings</button>
        </div>
      </div>

      {chatHistory.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-airis-accent/20 to-airis-cyan/10 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-airis-accent"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <p className="text-airis-text font-medium text-sm">How can I help you code?</p>
          <p className="text-airis-text-muted text-xs mt-1 mb-4 max-w-[280px]">Ask me to explain, generate, refactor, or debug</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-none p-3 space-y-3">
          {chatHistory.map((m, i) => (
            <div key={i} className={cn('max-w-[85%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed', m.role === 'user' ? 'ml-auto bg-airis-accent text-white rounded-br-md' : 'mr-auto bg-airis-surface-2 text-airis-text rounded-bl-md')}>{m.content}</div>
          ))}
          {isProcessing && <div className="mr-auto bg-airis-surface-2 rounded-2xl rounded-bl-md px-3 py-2.5 text-sm"><span className="inline-flex gap-1"><span className="w-1.5 h-1.5 bg-airis-text-muted rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-airis-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-1.5 h-1.5 bg-airis-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></span></div>}
          <div ref={chatEndRef} />
        </div>
      )}

      {chatHistory.length === 0 && (
        <div className="flex gap-2 px-3 pb-2 overflow-x-auto scrollbar-none">
          {actions.map(a => (
            <button key={a.label} onClick={() => setInput(a.prompt + ' ')}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-airis-surface-2 text-airis-text-muted border border-airis-border">{a.label}</button>
          ))}
        </div>
      )}

      <div className="px-3 py-2 border-t border-airis-border space-y-2" style={{ paddingBottom: 'var(--sab)' }}>
        <div className="flex items-end gap-2">
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={keyDown}
            placeholder="Ask AIRIS..." rows={1}
            className="flex-1 px-3 py-2.5 bg-airis-surface-2 border border-airis-border rounded-xl text-sm text-airis-text placeholder-airis-text-muted/50 resize-none focus:outline-none focus:border-airis-accent min-h-[40px] max-h-[120px]" />
          <button onClick={send} disabled={!input.trim() || isProcessing || !provider}
            className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', input.trim() && !isProcessing && provider ? 'bg-airis-accent text-white' : 'bg-airis-surface-2 text-airis-text-muted')} aria-label="Send">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

async function callAI(config: { endpoint: string; apiKey: string; model: string }, message: string, history: { role: string; content: string }[]): Promise<string> {
  const msgs = [{ role: 'system', content: 'You are AIRIS, an expert coding assistant integrated into a mobile IDE.' }, ...history.map(h => ({ role: h.role, content: h.content }))];
  const res = await fetch(`${config.endpoint.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({ model: config.model, messages: msgs, max_tokens: 4096, temperature: 0.7 }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text().catch(() => 'Unknown')}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? 'No response.';
}
