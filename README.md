# VueStream

Professional livestream studio component built with Vue 3, Pixi.js, and WebRTC.

## Overview

VueStream is a modular, extensible Vue 3 component library that provides professional livestreaming capabilities. It leverages Pixi.js for high-performance canvas rendering and WebRTC for real-time media streaming.

## Features

- 🎥 **WebRTC Streaming**: Real-time peer-to-peer video/audio streaming
- 🎨 **Canvas Rendering**: High-performance video manipulation with Pixi.js
- 🧩 **Modular Architecture**: Clean separation of concerns with plugin support
- 🎛️ **Professional UI**: Clean, accessible interface design
- 📱 **Responsive**: Works across desktop and mobile devices
- 🛠️ **TypeScript**: Full type safety and IntelliSense support

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test:unit
```

## Project Structure

```
packages/
├── core/           # WebRTC, media, canvas core functionality
├── components/     # Vue UI components
├── composables/    # Reusable composition functions
├── store/          # Pinia state management
├── layouts/        # Layout templates
├── overlays/       # Overlay components
├── storage/        # Storage adapters
└── themes/         # Design tokens and themes
```

## Development

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Styling**: TailwindCSS + Design Tokens
- **State**: Pinia
- **Testing**: Vitest + Vue Test Utils
- **Code Quality**: ESLint + Prettier + TypeScript

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## License

MIT