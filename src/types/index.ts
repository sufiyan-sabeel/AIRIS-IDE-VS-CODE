export type Theme = 'dark' | 'light' | 'amoled';
export type ActiveView = 'files' | 'editor' | 'terminal' | 'ai' | 'git';
export type PanelType = 'explorer' | 'search' | 'extensions' | 'source-control' | 'settings';
export type PanelSide = 'left' | 'right';

export interface FileTab {
  path: string;
  name: string;
  language: string;
  dirty: boolean;
}

export interface AIProviderConfig {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  model: string;
}

export interface GitStatus {
  modified: string[];
  staged: string[];
  untracked: string[];
  conflicts: string[];
}

export interface TerminalInstance {
  id: string;
  name: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface FileEntry {
  path: string;
  name: string;
  type: 'file' | 'directory';
  children?: FileEntry[];
}
