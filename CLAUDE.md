# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React 18 + TypeScript QR Code Generator with glassmorphism UI. Uses Vite for build tooling and the `qrcode-generator` library for QR code generation.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:5173
npm run build        # Type check and build for production (output: dist/)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint (TS/TSX files, max 0 warnings)
```

## Architecture

### State Management Pattern

The app uses a **custom hooks architecture** with no external state library:

- **`useQRCode`** ([src/hooks/useQRCode.ts](src/hooks/useQRCode.ts)): Central QR state management
  - Manages QR config, generated QR instance, and metadata (version, capacity, etc.)
  - Auto-regenerates QR code on config changes via `useEffect`
  - Returns `updateConfig()` for partial updates and `resetConfig()` for defaults

- **`useTheme`** ([src/hooks/useTheme.ts](src/hooks/useTheme.ts)): Theme state with localStorage persistence
  - Syncs theme to `data-theme` attribute on `<html>` for CSS variable switching
  - Persists user preference across sessions

### Component Structure

```
App.tsx (root)
├── Header (theme toggle)
├── ConfigPanel (left panel, input form)
└── PreviewPanel (right panel, QR display + export buttons)
```

**Key pattern**: Export handlers (PNG/SVG/JSON) are defined in [App.tsx](src/App.tsx) and passed as callbacks to PreviewPanel. This keeps the component purely presentational.

### Core QR Generation Logic

All QR generation logic lives in [src/lib/qrGenerator.ts](src/lib/qrGenerator.ts):

- **`generateQRCode(config)`**: Takes full config, returns `{ qr, info }`
  - Handles version auto-detection using capacity tables
  - Calculates capacity metrics (used/total/percentage)
  - **Important**: The underlying `qrcode-generator` library doesn't expose mask pattern control in its public API, so mask pattern selection is UI-only

- **`renderQRToCanvas()`** and **`renderQRToSVG()`**: Custom rendering functions
  - Implement module styles (square, rounded, dots, rounded-dots)
  - Handle quiet zones (margins) and custom colors
  - Canvas rendering uses quadratic curves for rounded corners

- **`determineOptimalVersion()`**: Finds smallest version that fits content based on error correction level and byte-encoded length

- **Capacity tables**: Hardcoded lookup tables for all 40 versions × 4 error correction levels (approximate byte mode capacities)

### Type System

[src/types/qr.ts](src/types/qr.ts) defines all QR-related types:

- **`QRConfig`**: User-configurable parameters (content, version, colors, etc.)
- **`QRInfo`**: Generated metadata (actual version used, capacity stats, etc.)
- **`QRCodeInstance`**: Interface for the `qrcode-generator` library object

When modifying QR parameters, update both the type definitions and the default config in `useQRCode.ts`.

### Theming System

Uses CSS variables defined in [src/styles/global.css](src/styles/global.css):

- Light/dark themes via `[data-theme="light|dark"]` selectors
- Variables like `--bg-primary`, `--text-primary`, `--accent`, etc.
- Glassmorphism achieved with `backdrop-filter: blur()` + semi-transparent backgrounds
- Animation easing: `cubic-bezier(0.4, 0, 0.2, 1)` for smooth, natural motion

## Deployment

GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) auto-deploys to GitHub Pages on push to `main`:

1. Runs on Node.js 20
2. Executes `npm ci` (not `npm install`) for reproducible builds
3. Builds with `npm run build`
4. Deploys `dist/` folder to GitHub Pages

**Note**: The `base` path in [vite.config.ts](vite.config.ts) is currently `/`. Update if deploying to a subpath (e.g., `/QR-Code-Generator/` for GitHub Pages with custom repo name).

## Known Limitations

- **Mask pattern selection**: The `qrcode-generator` library doesn't expose mask pattern control in its public API. The UI includes mask pattern selection for completeness, but it doesn't affect the actual QR code generation. To fully implement this, you'd need to fork the library or switch to one with mask pattern support.

- **No test suite**: The project doesn't have unit tests configured. Consider adding Vitest if implementing complex features.

## Key Files for Common Tasks

- **Add QR parameter**: Update `QRConfig` type → add to default config in `useQRCode.ts` → add form control in `ConfigPanel.tsx` → handle in `generateQRCode()`
- **Add export format**: Create render function in `qrGenerator.ts` → add export handler in `App.tsx` → add button in `PreviewPanel.tsx`
- **Modify styling**: Check component-specific CSS first, then global CSS variables in `src/styles/global.css`
- **Change QR library**: Update imports in `qrGenerator.ts` and `QRCodeInstance` interface in `types/qr.ts`
