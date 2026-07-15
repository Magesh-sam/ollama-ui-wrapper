# Ollama UI Wrapper - Agent Instructions

This repository is a lightweight UI wrapper for Ollama built with React, Vite, Tailwind CSS v4, and Zustand. This document defines the development environment commands, tech stack details, and coding constraints that AI agents must follow when contributing to this codebase.

---

## Tech Stack & Project Architecture

- **Frontend Core**: React 19 & TypeScript 6
- **Build Tool**: Vite 8 (`vite.config.ts`)
- **Styling**: Tailwind CSS v4 (using CSS-based configuration in `@/index.css`)
- **State Management**: Zustand 5 (`src/store/`)
- **UI & Primitives**: shadcn/ui `base-lyra` style, backed by `@base-ui/react` primitives and `lucide` icons
- **API Clients**: Axios (`axios`) & native fetch for streaming
- **Notifications**: Sonner (`sonner` via `@/components/ui/sonner.tsx`)

---

## Development & Build Commands

Always use the **pnpm** package manager for this repository:

| Command | Action | Description |
| :--- | :--- | :--- |
| `pnpm install` | Install | Installs dependencies |
| `pnpm dev` | Run Dev | Starts the Vite local development server |
| `pnpm typecheck` | Type Check | Validates TypeScript types strictly (`tsc --noEmit`) |
| `pnpm lint` | Lint | Checks code format and syntax rules (`eslint .`) |
| `pnpm format` | Format | Code formatting with Prettier (`prettier --write`) |
| `pnpm build` | Build | Compiles the production bundle (`tsc -b && vite build`) |

---

## Strict Coding Constraints & Standards

### 1. TypeScript & Type Safety
- **Strict Typing**: All parameters, returns, and variables must have explicit, correct types. Avoid `any` at all costs.
- **Type Files**: Centralize shared types in `src/lib/types.ts` when appropriate.
- **Verification**: Run `pnpm typecheck` after every logical file edit.

### 2. React Standards
- **Functional Components**: Write pure functional components using hooks.
- **State Partitioning**: 
  - Use local `useState` only for single-component transient state (e.g., input values, toggle switches).
  - Use global Zustand stores (like `useChatStore.ts` or `useModelStore.tsx`) for shared state, sessions, and histories.
- **Refactoring & Modifying**: When modifying existing code, always add clear comments (prefixed with `// FUNCTIONALITY:`) describing the additions/modifications.

### 3. Styling & Aesthetics
- **Tailwind CSS v4**: Follow Tailwind v4 standards. Define theme variables, colors, and font styles in `src/index.css` inside the `@theme` block.
- **Design Philosophy**: Maintain a dark-themed visual layout (`oklch(0.148 0.004 228.8)` background) matching the official Ollama desktop client. Keep layout, padding, and theme variables consistent unless specifically instructed to modify them.
- **Custom UI Elements**: Leverage existing shadcn/ui primitives. When adding new shadcn components, pull them using `npx shadcn add <component>` ensuring compatibility with the `base-lyra` style.

### 4. API & Networking
- **Ollama Client**: Make API calls to the Ollama backend at `http://localhost:11434/api` (configured dynamically via `VITE_API_URL` or defaulting in `src/lib/utils.ts`).
- **Connection Checks**: Always wrap API calls in try-catch blocks. Proactively handle network failure and notify users using the `toast` function from `sonner`.
- **Response Streaming**: For chat interfaces, always implement streaming (`stream: true`) and process text chunk-by-chunk using `ReadableStream` reader interfaces.

---

## Commit & PR Guidelines
- **Commit Formatting**: Write descriptive, imperative commit messages (e.g., `feat: integrate sonner toaster for connection failures`).
- **Documentation**: Keep `walkthrough.md` updated in system logs to record verification outcomes for any major feature.
