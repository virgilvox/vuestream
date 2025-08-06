# VueStream Architecture

## Overview

VueStream is a professional livestream studio component built with Vue 3, leveraging Pixi.js for high-performance canvas rendering and WebRTC for real-time media streaming. The architecture emphasizes modularity, extensibility, and clean separation of concerns.

## Core Design Principles

### 1. Modular Architecture
- **Package-based structure**: Each major feature is isolated in its own package
- **Plugin system**: Extensible architecture for custom features
- **Composable-first**: Logic encapsulated in reusable composables
- **File size limits**: Maximum 500 lines per file (target 200-300)

### 2. Technology Stack
- **Vue 3**: Modern reactive framework with Composition API
- **Pixi.js v8**: High-performance 2D rendering engine
- **WebRTC**: Real-time peer-to-peer media streaming
- **TypeScript**: Full type safety and better developer experience
- **Pinia**: Centralized state management

### 3. UI/UX Philosophy
- **Professional design**: Clean, minimalist interface
- **No decorative elements**: Focus on functionality
- **Icon libraries**: Consistent iconography (Heroicons/Lucide)
- **Theme support**: Dark/light modes with design tokens
- **Accessibility**: WCAG 2.1 AA compliance

## Architecture Layers

### 1. Core Layer (`packages/core/`)
Handles fundamental media operations:
- **Media Engine**: WebRTC peer connections and stream management
- **Canvas Engine**: Pixi.js initialization and texture management
- **Signaling**: Configurable WebRTC signaling architecture
- **Recording**: MediaRecorder API integration

### 2. Component Layer (`packages/components/`)
Provides the UI building blocks:
- **StudioCanvas**: Main streaming viewport with Pixi.js
- **MediaControls**: Camera/mic/screen controls
- **ParticipantList**: Manage stream participants
- **LayoutSelector**: Choose and customize layouts
- **Sidebar**: Extensible tab-based interface

### 3. State Layer (`packages/store/`)
Centralized state management with Pinia:
- **Media Store**: Device and stream states
- **Participants Store**: Connected peers management
- **Canvas Store**: Layout and rendering state
- **Settings Store**: User preferences and configuration

### 4. Composables Layer (`packages/composables/`)
Reusable logic hooks:
- **useMedia**: Device enumeration and control
- **useCanvas**: Pixi.js operations and rendering
- **useLayout**: Layout calculations and transitions
- **useOverlay**: Overlay management and animations

## Key Components

### StudioCanvas
The heart of the streaming interface:
```
- Pixi.js Application instance
- Video texture management
- Dynamic layout zones
- Overlay rendering layers
- Performance optimizations
```

### MediaControls
Professional control interface:
```
- Device selection dropdowns
- Mute/unmute toggles
- Audio level meters
- Screen share controls
- Recording management
```

### ParticipantList
Stream participant management:
```
- Video preview cards
- Add/remove from canvas
- Individual controls
- Role indicators
- Connection status
```

## Pixi.js Integration

### Canvas Architecture
```
Stage (root)
├── Background Layer
├── Video Container
│   ├── Participant Video Sprites
│   └── Screen Share Sprites
├── Overlay Container
│   ├── Logo Sprites
│   ├── Banner Graphics
│   └── Lower Thirds
└── UI Layer
```

### Video Texture Management
- Dynamic texture creation from MediaStream
- Efficient texture pooling
- Automatic cleanup on disconnect
- Smooth transitions between layouts

## WebRTC Architecture

### Signaling
- Configurable signaling server URL
- Default public STUN/TURN servers
- Adapter pattern for custom signaling
- Automatic reconnection logic

### Media Flow
```
Local Media → Peer Connection → Remote Peers
     ↓              ↓                ↓
Canvas Texture  Signaling      Canvas Texture
```

## Storage System

### Adapter Pattern
```typescript
interface StorageAdapter {
  upload(file: File): Promise<string>
  retrieve(id: string): Promise<Blob>
  delete(id: string): Promise<void>
  list(): Promise<Asset[]>
}
```

### Built-in Adapters
- **LocalAdapter**: IndexedDB with localStorage fallback
- **CloudAdapter**: S3-compatible storage
- **MemoryAdapter**: Temporary in-memory storage

## Layout System

### Predefined Layouts
1. **Grid**: Equal-sized participant tiles
2. **Spotlight**: Featured speaker with thumbnails
3. **PiP**: Picture-in-picture mode
4. **Sidebar**: Main content with side panel

### Custom Layouts
- Constraint-based positioning
- Responsive scaling
- Smooth transitions
- Persistable configurations

## Development Workflow

### File Structure
```
src/
├── packages/
│   ├── core/
│   ├── components/
│   ├── composables/
│   ├── store/
│   ├── layouts/
│   ├── overlays/
│   ├── storage/
│   └── themes/
├── examples/
├── docs/
└── tests/
```

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Comprehensive testing
- Clear documentation

## Performance Considerations

### Optimization Strategies
- Texture pooling and reuse
- Efficient render loops
- Debounced resize handlers
- Lazy loading for UI components
- Web Workers for heavy processing

### Target Metrics
- 60 FPS canvas rendering
- <100ms component initialization
- <2s WebRTC connection time
- Minimal memory footprint

## Extensibility

### Plugin System
```typescript
interface VueStreamPlugin {
  name: string
  install(app: VueStreamApp): void
  sidebar?: SidebarTab
  overlay?: OverlayComponent
  layout?: LayoutTemplate
}
```

### Custom Components
- Register custom sidebar tabs
- Add new overlay types
- Create layout templates
- Extend storage adapters

## Security Considerations

- Secure WebRTC connections
- Input validation
- CORS handling
- Permission management
- Content Security Policy

## Future Considerations

- Virtual backgrounds
- AI-powered features
- Advanced audio processing
- Multi-bitrate streaming
- Cloud recording options