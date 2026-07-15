import { create } from 'zustand';
import type { Theme, ActiveView, PanelType, FileTab, AIProviderConfig, GitStatus, TerminalInstance, ChatMessage, FileEntry, PanelSide } from '@/types';

// ─── UI Store ───────────────────────────────────────────────
interface UIState {
  theme: Theme;
  activeView: ActiveView;
  activePanel: PanelType | null;
  panelOpen: boolean;
  panelSide: PanelSide;
  compactMode: boolean;
  commandPaletteOpen: boolean;
  fullscreenEditor: boolean;
  setTheme: (t: Theme) => void;
  setActiveView: (v: ActiveView) => void;
  togglePanel: (p: PanelType) => void;
  closePanel: () => void;
  setCompactMode: (c: boolean) => void;
  setCommandPaletteOpen: (o: boolean) => void;
  setFullscreenEditor: (f: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'dark',
  activeView: 'editor',
  activePanel: null,
  panelOpen: false,
  panelSide: 'left',
  compactMode: false,
  commandPaletteOpen: false,
  fullscreenEditor: false,
  setTheme: (t) => {
    document.documentElement.classList.remove('dark', 'light', 'amoled');
    document.documentElement.classList.add(t);
    set({ theme: t });
  },
  setActiveView: (v) => {
    const s = get();
    if (v === 'files') {
      if (s.activePanel === 'explorer' && s.panelOpen) { set({ panelOpen: false }); return; }
      set({ activePanel: 'explorer', panelOpen: true, panelSide: 'left' }); return;
    }
    if (v === 'git') {
      if (s.activePanel === 'source-control' && s.panelOpen) { set({ panelOpen: false }); return; }
      set({ activePanel: 'source-control', panelOpen: true, panelSide: 'left' }); return;
    }
    if (v === 'terminal') {
      if (s.activeView === 'terminal') { set({ compactMode: !s.compactMode }); return; }
      set({ activeView: v, compactMode: false, panelOpen: false }); return;
    }
    set({ activeView: v, panelOpen: false });
  },
  togglePanel: (p) => {
    const { activePanel, panelOpen } = get();
    if (activePanel === p && panelOpen) { set({ panelOpen: false }); return; }
    const side: PanelSide = (p === 'extensions' || p === 'settings') ? 'right' : 'left';
    set({ activePanel: p, panelOpen: true, panelSide: side });
  },
  closePanel: () => set({ panelOpen: false }),
  setCompactMode: (c) => set({ compactMode: c }),
  setCommandPaletteOpen: (o) => set({ commandPaletteOpen: o }),
  setFullscreenEditor: (f) => set({ fullscreenEditor: f, panelOpen: f ? false : get().panelOpen }),
}));

// ─── Editor Store ────────────────────────────────────────────
interface EditorState {
  tabs: FileTab[];
  activeFile: string | null;
  files: Record<string, string>;
  fontZoom: number;
  autoSave: boolean;
  lastSaved: Record<string, number>;
  openFile: (path: string, content?: string) => void;
  closeFile: (path: string) => void;
  setActiveFile: (path: string | null) => void;
  updateContent: (path: string, content: string) => void;
  setFontZoom: (z: number) => void;
  setAutoSave: (a: boolean) => void;
}

const langMap: Record<string, string> = {
  ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
  json: 'json', html: 'html', css: 'css', md: 'markdown', py: 'python',
  rs: 'rust', go: 'go', cpp: 'cpp', c: 'c', java: 'java', swift: 'swift',
  kt: 'kotlin', rb: 'ruby', php: 'php', sh: 'shell', yaml: 'yaml',
};

export const useEditorStore = create<EditorState>((set, get) => ({
  tabs: [], activeFile: null, files: {}, fontZoom: 14, autoSave: true, lastSaved: {},
  openFile: (path, content) => {
    const { tabs, files } = get();
    const name = path.split('/').pop() || path;
    const ext = path.split('.').pop() || '';
    const language = langMap[ext] || 'plaintext';
    if (!tabs.find((t) => t.path === path)) set({ tabs: [...tabs, { path, name, language, dirty: false }] });
    if (content !== undefined) set({ files: { ...files, [path]: content } });
    set({ activeFile: path });
    const ui = useUIStore.getState();
    if (ui.panelOpen && ui.activePanel === 'explorer') ui.closePanel();
  },
  closeFile: (path) => {
    const { tabs, activeFile, files } = get();
    const newTabs = tabs.filter((t) => t.path !== path);
    const newFiles = { ...files }; delete newFiles[path];
    set({ tabs: newTabs, files: newFiles, activeFile: activeFile === path ? (newTabs[0]?.path ?? null) : activeFile });
  },
  setActiveFile: (path) => set({ activeFile: path }),
  updateContent: (path, content) => {
    const { tabs, autoSave, lastSaved } = get();
    const now = Date.now();
    const newTabs = tabs.map((t) => t.path === path ? { ...t, dirty: true } : t);
    const updates: Partial<EditorState> = { files: { ...get().files, [path]: content }, tabs: newTabs };
    if (autoSave && path === get().activeFile) {
      const last = lastSaved[path] ?? 0;
      if (now - last > 2000) {
        updates.lastSaved = { ...lastSaved, [path]: now };
        updates.tabs = newTabs.map((t) => t.path === path ? { ...t, dirty: false } : t);
      }
    }
    set(updates);
  },
  setFontZoom: (z) => set({ fontZoom: Math.max(10, Math.min(28, z)) }),
  setAutoSave: (a) => set({ autoSave: a }),
}));

// ─── Terminal Store ──────────────────────────────────────────
interface TerminalState {
  terminals: TerminalInstance[];
  activeTerminal: string;
  addTerminal: () => void;
  removeTerminal: (id: string) => void;
  setActiveTerminal: (id: string) => void;
}

let termCount = 1;
export const useTerminalStore = create<TerminalState>((set, get) => ({
  terminals: [{ id: 'term-1', name: 'Terminal 1' }], activeTerminal: 'term-1',
  addTerminal: () => { termCount++; const id = `term-${termCount}`; set({ terminals: [...get().terminals, { id, name: `Terminal ${termCount}` }], activeTerminal: id }); },
  removeTerminal: (id) => { const { terminals, activeTerminal } = get(); const f = terminals.filter((t) => t.id !== id); set({ terminals: f, activeTerminal: activeTerminal === id ? (f[0]?.id ?? 'term-1') : activeTerminal }); },
  setActiveTerminal: (id) => set({ activeTerminal: id }),
}));

// ─── Git Store ───────────────────────────────────────────────
interface GitState {
  status: GitStatus;
  currentBranch: string;
  branches: string[];
  commits: { hash: string; message: string; date: string }[];
  setStatus: (s: GitStatus) => void;
  setCurrentBranch: (b: string) => void;
  setBranches: (b: string[]) => void;
  addCommit: (hash: string, message: string) => void;
}

export const useGitStore = create<GitState>((set, get) => ({
  status: { modified: [], staged: [], untracked: [], conflicts: [] },
  currentBranch: 'main', branches: ['main'], commits: [],
  setStatus: (s) => set({ status: s }),
  setCurrentBranch: (b) => set({ currentBranch: b }),
  setBranches: (b) => set({ branches: b }),
  addCommit: (hash, message) => set({ commits: [{ hash, message, date: new Date().toISOString() }, ...get().commits] }),
}));

// ─── AI Store ────────────────────────────────────────────────
interface AIState {
  provider: AIProviderConfig | null;
  chatHistory: ChatMessage[];
  isProcessing: boolean;
  setProvider: (p: AIProviderConfig | null) => void;
  addMessage: (m: ChatMessage) => void;
  clearChat: () => void;
  setIsProcessing: (v: boolean) => void;
}

export const useAIStore = create<AIState>((set) => ({
  provider: null, chatHistory: [], isProcessing: false,
  setProvider: (p) => set({ provider: p }),
  addMessage: (m) => { const s = useAIStore.getState(); set({ chatHistory: [...s.chatHistory, m] }); },
  clearChat: () => set({ chatHistory: [] }),
  setIsProcessing: (v) => set({ isProcessing: v }),
}));

// ─── Workspace Store ─────────────────────────────────────────
interface WorkspaceState {
  rootDir: string;
  files: FileEntry[];
  setRootDir: (d: string) => void;
  setFiles: (f: FileEntry[]) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  rootDir: '/workspace', files: [],
  setRootDir: (d) => set({ rootDir: d }),
  setFiles: (f) => set({ files: f }),
}));
