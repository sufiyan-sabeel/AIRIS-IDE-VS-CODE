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

// ─── Problems Store ────────────────────────────────────────────
export interface Problem {
  type: 'error' | 'warning' | 'info';
  message: string;
  file: string;
  line: number;
  column: number;
  code?: string;
}

interface ProblemsState {
  problems: Problem[];
  activeFileProblems: Problem[];
  filter: string;
  addProblem: (p: Problem) => void;
  clearProblems: () => void;
  setFilter: (f: string) => void;
}

export const useProblemsStore = create<ProblemsState>((set, get) => ({
  problems: [],
  activeFileProblems: [],
  filter: '',
  addProblem: (p) => set({ problems: [...get().problems, p] }),
  clearProblems: () => set({ problems: [], activeFileProblems: [] }),
  setFilter: (f) => set({ filter: f }),
}));

// ─── Notifications Store ───────────────────────────────────────
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  actions?: { label: string; action: () => void }[];
  timestamp: number;
}

interface NotificationsState {
  notifications: Notification[];
  toasts: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'timestamp'>) => void;
  addToast: (n: Omit<Notification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  dismissToast: (id: string) => void;
  clearAll: () => void;
}

let notifId = 0;
export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  toasts: [],
  addNotification: (n) => {
    const id = `n-${++notifId}`;
    set({ notifications: [...get().notifications, { ...n, id, timestamp: Date.now() }] });
  },
  addToast: (n) => {
    const id = `t-${++notifId}`;
    const toast = { ...n, id, timestamp: Date.now() };
    set({ toasts: [...get().toasts, toast] });
    setTimeout(() => {
      const state = useNotificationsStore.getState();
      set({ toasts: state.toasts.filter(t => t.id !== id) });
    }, 5000);
  },
  dismissNotification: (id) => set({ notifications: get().notifications.filter(n => n.id !== id) }),
  dismissToast: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
  clearAll: () => set({ notifications: [] }),
}));

// ─── Debug Store ────────────────────────────────────────────────
interface DebugState {
  running: boolean;
  breakpoints: { file: string; line: number }[];
  callStack: { name: string; file: string; line: number }[];
  variables: { name: string; value: string; type: string }[];
  watches: { expression: string; value: string }[];
  setRunning: (r: boolean) => void;
  addBreakpoint: (file: string, line: number) => void;
  removeBreakpoint: (file: string, line: number) => void;
  setCallStack: (cs: DebugState['callStack']) => void;
  setVariables: (v: DebugState['variables']) => void;
  addWatch: (expr: string) => void;
  removeWatch: (expr: string) => void;
}

export const useDebugStore = create<DebugState>((set, get) => ({
  running: false,
  breakpoints: [],
  callStack: [],
  variables: [],
  watches: [],
  setRunning: (r) => set({ running: r }),
  addBreakpoint: (file, line) => set({ breakpoints: [...get().breakpoints, { file, line }] }),
  removeBreakpoint: (file, line) => set({ breakpoints: get().breakpoints.filter(b => !(b.file === file && b.line === line)) }),
  setCallStack: (cs) => set({ callStack: cs }),
  setVariables: (v) => set({ variables: v }),
  addWatch: (expr) => set({ watches: [...get().watches, { expression: expr, value: '' }] }),
  removeWatch: (expr) => set({ watches: get().watches.filter(w => w.expression !== expr) }),
}));

// ─── Status Bar Store ───────────────────────────────────────────
interface StatusBarState {
  language: string;
  encoding: string;
  indentation: string;
  lineEnding: string;
  line: number;
  column: number;
  selectedCount: number;
  setLanguage: (l: string) => void;
  setCursor: (line: number, col: number, count: number) => void;
  setIndentation: (i: string) => void;
}

export const useStatusBarStore = create<StatusBarState>((set) => ({
  language: 'plaintext', encoding: 'UTF-8', indentation: 'Spaces: 2', lineEnding: 'LF',
  line: 1, column: 1, selectedCount: 0,
  setLanguage: (l) => set({ language: l }),
  setCursor: (line, col, count) => set({ line, column: col, selectedCount: count }),
  setIndentation: (i) => set({ indentation: i }),
}));

// ─── Keybindings Store ─────────────────────────────────────────
export interface Keybinding {
  id: string;
  label: string;
  keys: string[];
  when?: string;
}

interface KeybindingsState {
  bindings: Keybinding[];
}

export const useKeybindingsStore = create<KeybindingsState>(() => ({
  bindings: [
    { id: 'workbench.action.showCommands', label: 'Command Palette', keys: ['Ctrl+P'] },
    { id: 'workbench.action.quickOpen', label: 'Quick Open', keys: ['Ctrl+P'] },
    { id: 'workbench.action.toggleSidebar', label: 'Toggle Explorer', keys: ['Ctrl+B'] },
    { id: 'workbench.action.terminal.toggleTerminal', label: 'Toggle Terminal', keys: ['Ctrl+`'] },
    { id: 'editor.action.formatDocument', label: 'Format Document', keys: ['Shift+Alt+F'] },
    { id: 'editor.action.commentLine', label: 'Toggle Line Comment', keys: ['Ctrl+/'] },
    { id: 'editor.action.addSelectionToNextFindMatch', label: 'Add Cursor Above', keys: ['Ctrl+Alt+↑'] },
    { id: 'editor.action.moveLinesUpAction', label: 'Move Line Up', keys: ['Alt+↑'] },
    { id: 'workbench.action.toggleFullScreen', label: 'Toggle Fullscreen', keys: ['F11'] },
    { id: 'workbench.action.splitEditor', label: 'Split Editor', keys: ['Ctrl+\\'] },
  ],
}));
