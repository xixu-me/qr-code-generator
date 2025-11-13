# QR Code Generator

A modern, feature-rich QR Code Generator with full technical parameter control and a beautiful glassmorphism UI.

![React](https://img.shields.io/badge/React-18.2-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Functionality

- **QR Code Generation**: Generate QR codes from text, URLs, or any UTF-8 content
- **Advanced Parameter Control**: Fine-tune all technical aspects of QR code generation
- **Real-time Preview**: See changes instantly as you adjust parameters
- **Multiple Export Formats**: Export as PNG, SVG, or configuration JSON

### Technical Parameters

- **QR Version**: Choose from 1-40 or use auto-detection for optimal sizing
- **Error Correction**: Four levels (L, M, Q, H) with capacity trade-offs
- **Mask Pattern**: Select specific patterns (0-7) or auto-select best mask
- **Quiet Zone**: Adjustable margin/border size
- **Module Styles**: Square, rounded, dots, or rounded dots
- **Custom Colors**: Full color picker with contrast validation

### User Experience

- **Glassmorphism Design**: Modern frosted-glass aesthetic with smooth animations
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Non-linear easing for polished interactions
- **Capacity Indicators**: Real-time feedback on data usage and QR code capacity
- **Technical Details**: Display version, error correction, mask pattern, and more

## 🚀 Live Demo

Visit the live application: [https://qrcg.xi-xu.me](https://qrcg.xi-xu.me)

## 📦 Installation & Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/xixu-me/QR-Code-Generator.git
   cd QR-Code-Generator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready static files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **QR Library**: qrcode-generator
- **Styling**: Custom CSS with CSS Variables for theming
- **State Management**: React Hooks (useState, useEffect, useCallback)

### Key Components

#### `qrGenerator.ts`

Core QR code generation logic with functions for:

- Version determination and capacity calculation
- QR code generation with configurable parameters
- Canvas and SVG rendering with custom styles
- Contrast checking for color validation

#### `useQRCode` Hook

Manages QR code state and configuration:

- Real-time QR code regeneration on config changes
- Error handling and validation
- Config reset functionality

#### `useTheme` Hook

Handles theme management:

- Persistent theme preference in localStorage
- Dynamic theme switching
- CSS variable updates

## 🎨 Design System

### Color Scheme

The application uses CSS variables for consistent theming:

- **Light Mode**: Soft pastels with purple-blue gradients
- **Dark Mode**: Dark grays with subtle accents

### Glassmorphism Effect

Achieved through:

- `backdrop-filter: blur()` for frosted glass effect
- Semi-transparent backgrounds with `rgba()`
- Layered shadows for depth
- Subtle borders for definition

### Animation Principles

- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` for smooth, natural motion
- **Duration**: 0.3-0.5s for most interactions
- **Transforms**: Prefer transform over position changes for performance
- **Micro-interactions**: Hover states, button presses, panel transitions

## 🚢 Deployment

### GitHub Pages (Automated)

The repository includes a GitHub Actions workflow that automatically:

1. Builds the application on push to `main` branch
2. Deploys to GitHub Pages
3. Makes the site available at your GitHub Pages URL

### Manual Deployment

If you prefer manual deployment:

```bash
npm run build
# Upload the contents of dist/ to your hosting provider
```

## 🔧 Configuration

### Vite Configuration

The `vite.config.ts` file is pre-configured for GitHub Pages:

```typescript
export default defineConfig({
  base: '/QR-Code-Generator/',  // Update this for your repo name
  // ...
})
```

If deploying to a different path, update the `base` value accordingly.

### QR Code Library

The application uses `qrcode-generator` which provides:

- Versions 1-40 support
- All error correction levels
- Automatic encoding optimization

**Note**: The library doesn't expose direct mask pattern control in the public API. The mask pattern selector in the UI is implemented for structural completeness and could be enhanced with a library that supports manual mask selection.

## 📊 Technical Details

### QR Code Parameters Explained

#### Version (1-40)

- Determines the size and data capacity
- Version 1: 21×21 modules
- Version 40: 177×177 modules
- Auto mode selects the smallest version that fits the data

#### Error Correction Levels

- **L (Low)**: ~7% correction capability
- **M (Medium)**: ~15% correction capability
- **Q (Quartile)**: ~25% correction capability
- **H (High)**: ~30% correction capability

Higher correction = larger QR code for same data

#### Mask Patterns (0-7)

- Determines how data is distributed in the QR code
- Different patterns optimize readability under various conditions
- Auto mode selects the pattern with best characteristics

#### Quiet Zone

- Empty border around the QR code
- Minimum 4 modules recommended by spec
- Adjustable for aesthetic or space constraints

## 📝 License

Copyright (c) Xi Xu. All rights reserved.

Licensed under the [MIT](LICENSE) license.

## 🙏 Acknowledgments

- QR Code generation powered by [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator)
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Inspired by modern glassmorphism design trends

---

**Enjoy generating beautiful QR codes!** 🎉
