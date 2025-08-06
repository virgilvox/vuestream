/**
 * Canvas Types and Interfaces for VueStream
 * 
 * Type definitions for Pixi.js canvas operations, video textures, and layout management
 */

import type { Application, Container, Texture, Sprite } from 'pixi.js'

export interface CanvasConfig {
  width: number
  height: number
  backgroundColor: number | string
  antialias: boolean
  resolution: number
  preserveDrawingBuffer: boolean
  powerPreference: 'default' | 'high-performance' | 'low-power'
  preferWebGPU: boolean
}

export interface VideoTextureSource {
  id: string
  type: 'camera' | 'screen' | 'stream'
  stream: MediaStream
  element?: HTMLVideoElement
  track?: MediaStreamTrack
}

export interface VideoTexture {
  id: string
  texture: Texture
  sprite: Sprite
  source: VideoTextureSource
  isActive: boolean
  lastUpdate: number
}

export interface LayoutZone {
  id: string
  x: number
  y: number
  width: number
  height: number
  container: Container
  videoTexture?: VideoTexture
  zIndex: number
}

export interface CanvasLayer {
  name: string
  container: Container
  zIndex: number
  visible: boolean
}

export interface PerformanceMetrics {
  fps: number
  drawCalls: number
  textureCount: number
  geometryCount: number
  memoryUsage: number
  lastUpdate: number
}

export interface CanvasState {
  app: Application | null
  isInitialized: boolean
  width: number
  height: number
  layers: Map<string, CanvasLayer>
  videoTextures: Map<string, VideoTexture>
  layoutZones: Map<string, LayoutZone>
  performance: PerformanceMetrics
}

export interface TexturePoolEntry {
  texture: Texture
  lastUsed: number
  isInUse: boolean
  width: number
  height: number
}

export interface TexturePool {
  textures: Map<string, TexturePoolEntry>
  maxSize: number
  cleanupInterval: number
}

export interface CanvasError {
  code: string
  message: string
  timestamp: number
  context?: unknown
}

export type CanvasEventType = 
  | 'initialized'
  | 'destroyed'
  | 'texture-created'
  | 'texture-destroyed'
  | 'layout-changed'
  | 'performance-update'
  | 'error'

export interface CanvasEvent {
  type: CanvasEventType
  data?: unknown
  timestamp: number
}

export type CanvasEventListener = (event: CanvasEvent) => void