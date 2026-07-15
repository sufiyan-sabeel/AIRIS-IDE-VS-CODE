# Development Guide

## Prerequisites

- Node.js 18+
- npm 9+
- Modern browser (Chrome 100+, Edge 100+, Firefox 120+)
- Android device/emulator (for PWA testing)

## Setup

```bash
git clone https://github.com/sufiyan-sabeel/AIRIS-IDE-VS-CODE.git
cd AIRIS-IDE-VS-CODE
npm install
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (HTML, metadata, viewport)
│   ├── page.tsx            # Main page (AppShell wrapper)
│   ├── workspace.tsx       # Dynamic view router
│   ├── globals.css         # Tailwind base + custom styles
│   └── offline/
│       └── page.tsx        # Offline fallback
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx    # Main layout shell
│   │   ├── TopBar.tsx      # Top header bar
│   │   ├── BottomNav.tsx   # Bottom navigation
│   │   ├── PanelContainer.tsx  # Slide panel system
│   │   └── GestureHandler.tsx  # Touch gesture detection
│   ├── editor/
│   │   └── MonacoWrapper.tsx   # Monaco Editor wrapper
│   ├── terminal/
│   │   └── TerminalPanel.tsx   # xterm.js terminal
│   ├── ai/
│   │   └── AIPanel.tsx     # AI chat + provider config
│   ├── git/
│   │   └── GitPanel.tsx    # Git status/commit UI
│   └── panels/
│       ├── FileExplorer.tsx
│       ├── SearchPanel.tsx
│       ├── ExtensionsPanel.tsx
│       ├── SourceControl.tsx
│       └── SettingsPanel.tsx
├── store/
│   └── stores.ts           # Zustand stores
├── types/
│   └── index.ts            # TypeScript interfaces
└── lib/
    └── utils.ts            # Utility functions
```

## Scripts

- `npm run dev` - Start dev server (port 3000)
- `npm run build` - Production build
- `npm run start` - Serve production build
- `npm run lint` - ESLint
- `npm run typecheck` - TypeScript check

## Adding an AI Provider

1. Open AI Panel → Settings
2. Enter endpoint (e.g., https://api.openai.com/v1)
3. Enter API key
4. Enter model name
5. Save

The provider must support OpenAI-compatible `/chat/completions` API.

## PWA Testing

```bash
npm run build
npm run start
# Open on Android Chrome, check for install prompt
```

## Performance Guidelines

- All feature panels use next/dynamic with ssr:false
- Monaco Editor and xterm.js are dynamically imported
- Keep component bundles lean
- Use Zustand for state (no Redux overhead)
- Minimize re-renders with selective subscriptions

## Git Operations

Git operations use isomorphic-git (browser-based). No native Git CLI required.

Current limitation: Workspace files are in-memory/IndexedDB. Full git remote operations require configuration.
