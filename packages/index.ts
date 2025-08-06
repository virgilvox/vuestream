/**
 * VueStream - Professional Livestream Studio Component
 * 
 * A modular, extensible Vue 3 component library for building professional
 * livestream applications with WebRTC and Pixi.js
 */

import type { App } from 'vue'

// Core exports
export * from './core'
export * from './components' 
export * from './composables'
export * from './store'
export * from './storage'
export * from './themes'

// Theme management
export { useTheme } from './composables'
export type { ThemeMode, ThemeTokens } from './composables'

// Types
export interface VueStreamOptions {
  signalingServer?: string
  stunServers?: string[]
  turnServers?: RTCIceServer[]
  theme?: 'light' | 'dark' | string
  storageAdapter?: string
}

// Plugin installation
export default {
  install(app: App, options: VueStreamOptions = {}) {
    // Configure global properties
    app.config.globalProperties.$vuestream = {
      version: '1.0.0',
      options
    }
    
    // Register global components can be done here if needed
    // But we prefer explicit imports for better tree-shaking
  }
}