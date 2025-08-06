/**
 * Canvas Manager for VueStream
 * 
 * High-performance Pixi.js canvas management with video texture support
 */

import { Application, Container, Texture, Sprite } from 'pixi.js'
import type {
  CanvasConfig,
  CanvasState,
  VideoTextureSource,
  VideoTexture,
  LayoutZone,
  PerformanceMetrics,
  CanvasEvent,
  CanvasEventListener,
  TexturePool
} from './types'

export class CanvasManager {
  private state: CanvasState
  private config: CanvasConfig
  private eventListeners: Map<string, CanvasEventListener[]>
  private texturePool: TexturePool
  private performanceMonitor: {
    interval: number | null
    startTime: number
    frameCount: number
  }

  constructor(config: Partial<CanvasConfig> = {}) {
    this.config = {
      width: 1920,
      height: 1080,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
      preferWebGPU: true,
      ...config
    }

    this.state = {
      app: null,
      isInitialized: false,
      width: this.config.width,
      height: this.config.height,
      layers: new Map(),
      videoTextures: new Map(),
      layoutZones: new Map(),
      performance: {
        fps: 0,
        drawCalls: 0,
        textureCount: 0,
        geometryCount: 0,
        memoryUsage: 0,
        lastUpdate: Date.now()
      }
    }

    this.eventListeners = new Map()
    this.texturePool = {
      textures: new Map(),
      maxSize: 50,
      cleanupInterval: 30000 // 30 seconds
    }

    this.performanceMonitor = {
      interval: null,
      startTime: Date.now(),
      frameCount: 0
    }
  }

  /**
   * Initialize the Pixi.js application
   */
  async initialize(container: HTMLElement): Promise<void> {
    if (this.state.isInitialized) {
      console.warn('Canvas already initialized')
      return
    }

    try {
      // Create Pixi application
      this.state.app = new Application()
      
      await this.state.app.init({
        width: this.config.width,
        height: this.config.height,
        backgroundColor: this.config.backgroundColor,
        antialias: this.config.antialias,
        resolution: this.config.resolution,
        preserveDrawingBuffer: this.config.preserveDrawingBuffer,
        powerPreference: this.config.powerPreference as 'default' | 'high-performance' | 'low-power',
        preference: this.config.preferWebGPU ? 'webgpu' : 'webgl'
      })

      // Append canvas to container
      container.appendChild(this.state.app.canvas)

      // Create default layers
      this.createDefaultLayers()

      // Start performance monitoring
      this.startPerformanceMonitoring()

      // Start texture pool cleanup
      this.startTexturePoolCleanup()

      this.state.isInitialized = true
      this.emit('initialized', { config: this.config })

    } catch (error) {
      const canvasError = {
        code: 'INITIALIZATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        context: { config: this.config }
      }
      this.emit('error', canvasError)
      throw error
    }
  }

  /**
   * Create default layer structure
   */
  private createDefaultLayers(): void {
    if (!this.state.app) return

    const layers = [
      { name: 'background', zIndex: 0 },
      { name: 'video', zIndex: 10 },
      { name: 'overlays', zIndex: 20 },
      { name: 'ui', zIndex: 30 }
    ]

    layers.forEach(({ name, zIndex }) => {
      const container = new Container()
      container.zIndex = zIndex
      container.label = `layer-${name}`
      
      this.state.app!.stage.addChild(container)
      this.state.layers.set(name, {
        name,
        container,
        zIndex,
        visible: true
      })
    })

    // Sort layers by zIndex
    this.state.app.stage.sortChildren()
  }

  /**
   * Create video texture from MediaStream
   */
  async createVideoTexture(source: VideoTextureSource): Promise<VideoTexture> {
    if (!this.state.app) {
      throw new Error('Canvas not initialized')
    }

    try {
      // Create video element
      const videoElement = document.createElement('video')
      videoElement.srcObject = source.stream
      videoElement.autoplay = true
      videoElement.muted = true
      videoElement.playsInline = true
      
      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        videoElement.onloadedmetadata = () => resolve()
        videoElement.onerror = reject
        setTimeout(() => reject(new Error('Video load timeout')), 5000)
      })

      // Create Pixi texture from video element
      const texture = Texture.from(videoElement)
      
      // Create sprite
      const sprite = new Sprite(texture)
      sprite.label = `video-${source.id}`

      const videoTexture: VideoTexture = {
        id: source.id,
        texture,
        sprite,
        source: { ...source, element: videoElement },
        isActive: true,
        lastUpdate: Date.now()
      }

      this.state.videoTextures.set(source.id, videoTexture)
      this.emit('texture-created', { id: source.id, type: source.type })

      return videoTexture
    } catch (error) {
      const canvasError = {
        code: 'VIDEO_TEXTURE_CREATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        context: { source }
      }
      this.emit('error', canvasError)
      throw error
    }
  }

  /**
   * Add video texture to a layout zone
   */
  addVideoToZone(videoId: string, zoneId: string): void {
    const videoTexture = this.state.videoTextures.get(videoId)
    const zone = this.state.layoutZones.get(zoneId)

    if (!videoTexture || !zone) {
      throw new Error(`Video ${videoId} or zone ${zoneId} not found`)
    }

    // Remove from previous container if any
    if (videoTexture.sprite.parent) {
      videoTexture.sprite.parent.removeChild(videoTexture.sprite)
    }

    // Add to zone container
    zone.container.addChild(videoTexture.sprite)
    zone.videoTexture = videoTexture

    // Fit video to zone
    this.fitVideoToZone(videoTexture, zone)
    
    this.emit('layout-changed', { videoId, zoneId })
  }

  /**
   * Fit video sprite to layout zone
   */
  private fitVideoToZone(videoTexture: VideoTexture, zone: LayoutZone): void {
    const { sprite } = videoTexture
    const { width: zoneWidth, height: zoneHeight } = zone

    // Calculate scale to fit while maintaining aspect ratio
    const textureAspect = sprite.texture.width / sprite.texture.height
    const zoneAspect = zoneWidth / zoneHeight

    let scale: number
    if (textureAspect > zoneAspect) {
      // Texture is wider, fit to width
      scale = zoneWidth / sprite.texture.width
    } else {
      // Texture is taller, fit to height
      scale = zoneHeight / sprite.texture.height
    }

    sprite.scale.set(scale)
    
    // Center in zone
    sprite.x = (zoneWidth - sprite.width) / 2
    sprite.y = (zoneHeight - sprite.height) / 2
  }

  /**
   * Create layout zone
   */
  createLayoutZone(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    layerName = 'video'
  ): LayoutZone {
    const layer = this.state.layers.get(layerName)
    if (!layer) {
      throw new Error(`Layer ${layerName} not found`)
    }

    const container = new Container()
    container.x = x
    container.y = y
    container.label = `zone-${id}`

    layer.container.addChild(container)

    const zone: LayoutZone = {
      id,
      x,
      y,
      width,
      height,
      container,
      zIndex: layer.zIndex
    }

    this.state.layoutZones.set(id, zone)
    return zone
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.state.performance }
  }

  /**
   * Start performance monitoring
   */
  private startPerformanceMonitoring(): void {
    if (!this.state.app) return

    this.performanceMonitor.interval = window.setInterval(() => {
      this.updatePerformanceMetrics()
    }, 1000) // Update every second
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(): void {
    if (!this.state.app) return

    const now = Date.now()
    const deltaTime = now - this.performanceMonitor.startTime

    // Calculate FPS
    this.performanceMonitor.frameCount++
    if (deltaTime >= 1000) {
      this.state.performance.fps = Math.round(
        (this.performanceMonitor.frameCount * 1000) / deltaTime
      )
      this.performanceMonitor.frameCount = 0
      this.performanceMonitor.startTime = now
    }

    // Update other metrics
    this.state.performance.textureCount = this.state.videoTextures.size
    this.state.performance.lastUpdate = now

    this.emit('performance-update', this.state.performance)
  }

  /**
   * Texture pool management
   */
  private startTexturePoolCleanup(): void {
    setInterval(() => {
      this.cleanupTexturePool()
    }, this.texturePool.cleanupInterval)
  }

  private cleanupTexturePool(): void {
    const now = Date.now()
    const maxAge = 60000 // 1 minute

    for (const [key, entry] of this.texturePool.textures.entries()) {
      if (!entry.isInUse && (now - entry.lastUsed) > maxAge) {
        entry.texture.destroy()
        this.texturePool.textures.delete(key)
      }
    }
  }

  /**
   * Event system
   */
  on(eventType: string, listener: CanvasEventListener): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    this.eventListeners.get(eventType)!.push(listener)
  }

  off(eventType: string, listener: CanvasEventListener): void {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private emit(type: string, data?: unknown): void {
    const listeners = this.eventListeners.get(type)
    if (listeners) {
      const event: CanvasEvent = {
        type: type as CanvasEvent['type'],
        data,
        timestamp: Date.now()
      }
      listeners.forEach(listener => listener(event))
    }
  }

  /**
   * Resize canvas
   */
  resize(width: number, height: number): void {
    if (!this.state.app) return

    this.state.app.renderer.resize(width, height)
    this.state.width = width
    this.state.height = height
    this.config.width = width
    this.config.height = height

    this.emit('layout-changed', { width, height })
  }

  /**
   * Cleanup and destroy
   */
  destroy(): void {
    if (!this.state.isInitialized) return

    // Clear performance monitoring
    if (this.performanceMonitor.interval) {
      clearInterval(this.performanceMonitor.interval)
    }

    // Destroy video textures
    for (const videoTexture of this.state.videoTextures.values()) {
      videoTexture.texture.destroy()
      if (videoTexture.source.element) {
        videoTexture.source.element.srcObject = null
      }
    }

    // Clear texture pool
    for (const entry of this.texturePool.textures.values()) {
      entry.texture.destroy()
    }

    // Destroy Pixi application
    if (this.state.app) {
      this.state.app.destroy(true, true)
    }

    // Reset state
    this.state.isInitialized = false
    this.state.app = null
    this.state.layers.clear()
    this.state.videoTextures.clear()
    this.state.layoutZones.clear()
    this.texturePool.textures.clear()

    this.emit('destroyed')
  }

  /**
   * Get current state (read-only)
   */
  getState(): Readonly<CanvasState> {
    return this.state
  }
}