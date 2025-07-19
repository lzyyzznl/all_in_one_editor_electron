# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Markdown富文本编辑器** - A modern cross-platform Markdown editor built with Electron, Vue 3, TypeScript, and TipTap. Features rich text editing, file management, and real-time preview.

## Key Technologies

- **Framework**: Electron + Vue 3 + TypeScript
- **Editor**: TipTap (rich text editor) with markdown support
- **UI Library**: Element Plus with UnoCSS for styling
- **Build System**: Electron Forge + Vite
- **Package Manager**: pnpm

## Architecture

### Core Structure

```
src/
├── main.ts              # Electron main process (window management, IPC)
├── preload.ts           # Preload script for secure IPC bridge
├── renderer.ts          # Vue app initialization
├── App.vue              # Root Vue component
├── components/          # Vue components
│   ├── FileBrowserApp.vue   # Main app layout (sidebar + editor)
│   ├── FileTree.vue         # File tree navigation
│   ├── MdEditor.vue         # Markdown editor with TipTap
│   └── TocTree.vue          # Table of contents
└── utils/
    ├── file-service-electron.ts  # File operations via Electron IPC
    ├── types.ts                  # TypeScript interfaces
    └── element-plus.ts           # Element Plus configuration
```

### IPC Communication

Main process (`main.ts`) exposes file system operations via IPC:
- `showOpenDialog`, `showSaveDialog` - Native file dialogs
- `readFile`, `writeFile` - File I/O operations
- `readDirectory` - Directory listing
- `createDirectory`, `deleteFile`, `renameFile` - File management
- `showItemInFolder` - OS file explorer integration

Preload script provides secure bridge via `window.electronAPI`.

### File Management

- **ElectronFileService** (`utils/file-service-electron.ts`): Abstraction layer for file operations
- **FileTreeNode** interface: Unified file/directory representation
- **FileContent** interface: Tab state management with modification tracking
- Supports: .md, .txt, .log, .json, .js, .ts, .html, .css, .vue files

## Development Commands

### Setup
```bash
pnpm install          # Install dependencies
```

### Development
```bash
pnpm start            # Start in development mode with hot reload
```

### Building
```bash
pnpm run make         # Build production executable
pnpm run package      # Package for distribution
pnpm run make:appimage # Build Linux AppImage specifically
```

### Code Quality
```bash
pnpm run lint         # Run ESLint on .ts,.tsx files
```

## Configuration Files

- **forge.config.js**: Electron Forge build configuration
- **vite.renderer.config.ts**: Vite configuration for renderer process
- **vite.main.config.ts**: Vite configuration for main process
- **uno.config.ts**: UnoCSS atomic CSS configuration
- **tsconfig.json**: TypeScript configuration

## Key Components

### FileBrowserApp.vue
Main application shell with:
- Collapsible sidebar with file tree
- Tab-based multi-file editing
- Responsive layout
- Theme switching (light/dark)

### MdEditor.vue
Rich text editor featuring:
- TipTap-based WYSIWYG editing
- Real-time markdown preview
- Toolbar with formatting options
- Code syntax highlighting
- Character count
- Table of contents generation

### FileTree.vue
File system browser with:
- Hierarchical directory navigation
- File operations (create, rename, delete)
- Keyboard navigation
- Loading states

## Build Targets

Supports multiple platforms:
- Windows (.exe via Squirrel)
- macOS (.zip, .dmg)
- Linux (.deb, .rpm, .AppImage)

## File Patterns

- Vue SFC: `*.vue` files with `<template>`, `<script setup>`, `<style>`
- TypeScript: `*.ts` files with strict typing
- Styling: UnoCSS atomic classes with dark mode variants
- Icons: Iconify with Material Symbols

## State Management

- Reactive state via Vue 3 Composition API
- Tab state tracked in `FileBrowserState.openFiles` Map
- File modification status via `FileContent.modified` flag
- Directory state cached in `FileTreeNode.children`


# 基本约束
所有对话内容都使用中文，不允许使用英文