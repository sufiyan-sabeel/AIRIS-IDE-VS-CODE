# AIRIS Mobile IDE - Mobile UI Design

## Layout

```
Portrait:
┌──────────────────────┐
│    TopBar (48px)     │
├──────────────────────┤
│                      │
│    Main Content      │
│   (Editor/Terminal/  │
│    AI/Git)           │
│                      │
├──────────────────────┤
│   BottomNav (56px)   │
│ [📁][📝][>_][🤖][⎇] │
└──────────────────────┘

Landscape (compact):
┌──────────────────────────────┐
│  TopBar (40px)               │
├──────────────────────────────┤
│  Content Area (full height)  │
├──────────────────────────────┤
│  BottomNav (48px, icon-only) │
└──────────────────────────────┘
```

## TopBar

- Fixed height: 48px portrait, 40px landscape
- Left: AIRIS logo (blue rounded square + "A") + project name (hidden <640px)
- Right: Search, AI, Settings buttons (44px touch targets)
- Background: graphite (#0a0a0a), border-bottom
- Safe area inset top applied

## BottomNav (Thumb Zone)

- Fixed height: 56px portrait, 48px landscape
- Five tabs: Files, Editor, Terminal, AIRIS, Git
- Active tab: accent blue color
- Touch targets: minimum 44px height
- Badge indicators for dirty files and git changes
- Safe area inset bottom applied
- Flexible space-around distribution

## Slide Panels

- Width: 85vw (max 400px) with spring animation
- Overlay: black 60% opacity with backdrop blur
- Swipe from left edge to open Explorer
- Swipe from right edge to open Settings
- Swipe panel to close it
- Accessible via bottom nav and top bar buttons

## Editor

- Full width when panels closed
- Tab bar: horizontal scroll, border-bottom for active
- Monaco Editor: vs-dark theme, minimap disabled
- Floating fullscreen button (bottom-right)
- Dirty file indicator (yellow dot)
- Font zoom via Settings panel (10-28px range)

## Terminal

- Black background, green/yellow/blue accent
- Virtual keyboard bar with Esc, Tab, Ctrl+C, arrows, Enter, Backspace
- Compact mode (80px) activated by tapping Terminal tab again
- Multi-terminal tabs with add/close
- Scrollback: 2000 lines normal, 200 compact

## AI Panel

- Star icon + gradient background for branding
- Chat bubble UI (blue for user, dark for assistant)
- Quick action buttons: Explain, Generate, Refactor, Debug, Analyze
- Loading indicator (bouncing dots)
- Provider config screen (endpoint, API key, model)
- No hardcoded keys - user must configure

## Git Panel

- Branch display with switch button
- File lists grouped by status (staged/modified/untracked)
- Color coding: green=staged, yellow=modified, gray=untracked, red=conflict
- Commit, Push, Pull action buttons
- Commit message input with Cancel/Commit
- Commit history log

## Color Scheme (Dark)

| Token | Value | Usage |
|-------|-------|-------|
| airis-black | #000000 | Main background |
| airis-graphite | #0a0a0a | Header/nav surfaces |
| airis-surface | #121212 | Elevated surfaces |
| airis-surface-2 | #1a1a1a | Input backgrounds |
| airis-border | #2a2a2a | Borders |
| airis-accent | #007acc | Primary interactive |
| airis-cyan | #4fc1ff | Secondary accent |
| airis-green | #4ec9b0 | Success/staged |
| airis-red | #f44747 | Errors/conflicts |
| airis-yellow | #d7ba7d | Dirty/warnings |
| airis-text | #e0e0e0 | Primary text |
| airis-text-muted | #666666 | Secondary/muted |

## Animations

- Panel slides: 300ms spring (damping 28, stiffness 300)
- Content transitions: 200ms fade + slide (8px)
- Active states: immediate color change
- Loading spinner: 1s rotate
- Bouncing dots: 3 dots staggered 150ms

## Responsive Breakpoints

- < 640px: Mobile (default), icon+label in bottom nav
- 640-1023px: Tablet, wider panels
- >= 1024px: Desktop, optional two-column layout
