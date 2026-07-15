# AIRIS Mobile IDE Architecture

## Overview

AIRIS Mobile IDE is a mobile-first Progressive Web Application (PWA) that adapts VS Code's core editing technology (Monaco Editor) into a touch-optimized development environment for Android devices.

## Core Principles

1. **Mobile-First**: All layouts and interactions designed for touch screens
2. **PWA Native**: Installable, offline-capable, full-screen on Android
3. **VS Code Compatible**: Leverages Monaco Editor for editing capabilities
4. **Provider Abstraction**: AI features are provider-agnostic - no hardcoded API keys
5. **Performance Conscious**: Lazy loading, code splitting, low-end device support

## Architecture

```
┌──────────────────────────────────────┐
│          Service Worker              │
│   (Offline cache, PWA lifecycle)     │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│           Application Shell           │
│  ┌──────────┐  ┌──────────────────┐  │
│  │  TopBar   │  │   Main Content  │  │
│  │  - Logo  │  │  ┌────────────┐ │  │
│  │  - AI    │  │  │ Monaco Ed  │ │  │
│  │  - Sett. │  │  │ Terminal   │ │  │
│  └──────────┘  │  │ AI Panel   │ │  │
│                │  │ Git Panel  │ │  │
│  ┌──────────┐  │  └────────────┘ │  │
│  │ BottomNav│  └──────────────────┘  │
│  └──────────┘                        │
│  ┌───────────────────────────────┐   │
│  │    Slide Panels (Animate)     │   │
│  │  Explorer / Search / Git     │   │
│  └───────────────────────────────┘   │
└──────────────────────────────────────┘
```

## Component Tree

```
RootLayout
└── MainPage
    └── AppShell (flex col, h-full)
        ├── GestureHandler (swipe detection)
        ├── TopBar (header, z-30)
        ├── Content Area (flex-1 flex)
        │   ├── PanelContainer
        │   │   └── AnimatePresence
        │   │       ├── Overlay (bg-black/60)
        │   │       └── MotionPanel (slide)
        │   │           ├── FileExplorer
        │   │           ├── SearchPanel
        │   │           ├── ExtensionsPanel
        │   │           ├── SourceControl
        │   │           └── SettingsPanel
        │   └── Workspace (AnimatePresence mode=wait)
        │       ├── MonacoEditor (dynamic import)
        │       ├── TerminalPanel (dynamic import)
        │       ├── AIPanel (dynamic import)
        │       └── GitPanel (dynamic import)
        └── BottomNav (footer, z-30)
```

## State Management (Zustand)

- **useUIStore**: Theme, active view, panel state, fullscreen mode
- **useEditorStore**: Tabs, file content, font zoom, auto-save
- **useTerminalStore**: Terminal instances
- **useGitStore**: Git status, branches, commits
- **useAIStore**: Provider config, chat history
- **useWorkspaceStore**: File tree

## Data Flow

```
Touch Gesture → GestureHandler → useUIStore.setActiveView/togglePanel
                                   → Workspace re-renders active view
                                   → Dynamic import loads component
                                   
Editor Input → Monaco onChange → useEditorStore.updateContent
                                   → Auto-save after 2s debounce

AI Chat → AIPanel.send → fetch(AI endpoint) → useAIStore.addMessage

Git Tab → useGitStore.status → GitPanel renders changes
```

## Key Technologies

| Technology | Purpose |
|-----------|---------|
| Next.js 14 | React framework, routing, SSR shell |
| Monaco Editor | Code editing engine |
| xterm.js | Terminal emulation |
| Framer Motion | Slide panel animations |
| Zustand | Lightweight state management |
| Tailwind CSS | Utility-first responsive styling |
| isomorphic-git | Browser-based git operations |
| next-pwa | PWA manifest and service worker |

## Performance Strategy

- All heavy components (Monaco, Terminal) use `next/dynamic` with `ssr: false`
- Route-level code splitting via Next.js App Router
- Monaco Editor chunks via webpack config
- Service worker caches shell for instant loading
- Minimal bundle for initial render
