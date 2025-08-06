/**
 * Canvas Composable for VueStream
 * 
 * Vue 3 composable for managing Pixi.js canvas operations
 */

import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { CanvasManager } from '../core/canvas/CanvasManager'
import type {
  CanvasConfig,
  VideoTextureSource,
  VideoTexture,
  LayoutZone,
  PerformanceMetrics,
  CanvasEvent
} from '../core/canvas/types'
import type { LayoutPreset } from '../core/canvas/layouts'
import type { AnyOverlayConfig } from '../core/canvas/overlays'

export interface UseCanvasOptions extends Partial<CanvasConfig> {
  autoStart?: boolean
  container?: Ref<HTMLElement | null>
}

export interface UseCanvasReturn {
  // State
  isInitialized: Ref<boolean>
  canvasSize: Ref<{ width: number; height: number }>
  performance: Ref<PerformanceMetrics>
  videoTextures: Ref<Map<string, VideoTexture>>
  layoutZones: Ref<Map<string, LayoutZone>>
  currentLayout: Ref<LayoutPreset | null>
  availableLayouts: Ref<LayoutPreset[]>
  
  // Actions
  initialize: (container: HTMLElement) => Promise<void>
  destroy: () => void
  resize: (width: number, height: number) => void
  
  // Video texture management
  createVideoTexture: (source: VideoTextureSource) => Promise<VideoTexture>
  addVideoToZone: (videoId: string, zoneId: string) => void
  removeVideoFromZone: (videoId: string) => void
  
  // Layout management
  createLayoutZone: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    layerName?: string
  ) => LayoutZone
  removeLayoutZone: (id: string) => void
  applyLayout: (layoutId: string) => void
  
  // Overlay management
  createOverlay: (config: AnyOverlayConfig) => Promise<void>
  updateOverlay: (id: string, updates: Partial<AnyOverlayConfig>) => void
  removeOverlay: (id: string) => void
  
  // Events
  onCanvasEvent: (eventType: string, callback: (event: CanvasEvent) => void) => void
  
  // Canvas manager access
  manager: CanvasManager
}

export function useCanvas(options: UseCanvasOptions = {}): UseCanvasReturn {
  const {
    autoStart = false,
    container: containerRef,
    ...canvasConfig
  } = options

  // Create canvas manager instance
  const manager = new CanvasManager(canvasConfig)

  // Reactive state
  const isInitialized = ref(false)
  const canvasSize = ref({ width: 1920, height: 1080 })
  const performance = ref<PerformanceMetrics>({
    fps: 0,
    drawCalls: 0,
    textureCount: 0,
    geometryCount: 0,
    memoryUsage: 0,
    lastUpdate: Date.now()
  })
  
  const videoTextures = ref(new Map<string, VideoTexture>()) as Ref<Map<string, VideoTexture>>
  const layoutZones = ref(new Map<string, LayoutZone>()) as Ref<Map<string, LayoutZone>>
  const currentLayout = ref<LayoutPreset | null>(null)
  const availableLayouts = ref(manager.getAvailableLayouts())

  // Event listeners storage
  const eventListeners = new Map<string, ((event: CanvasEvent) => void)[]>()

  /**
   * Initialize canvas
   */
  const initialize = async (container: HTMLElement): Promise<void> => {
    try {
      await manager.initialize(container)
      
      // Update reactive state
      const state = manager.getState()
      isInitialized.value = state.isInitialized
      canvasSize.value = { width: state.width, height: state.height }
      videoTextures.value = new Map(state.videoTextures)
      layoutZones.value = new Map(state.layoutZones)
      
    } catch (error) {
      console.error('Failed to initialize canvas:', error)
      throw error
    }
  }

  /**
   * Destroy canvas
   */
  const destroy = (): void => {
    manager.destroy()
    isInitialized.value = false
    videoTextures.value.clear()
    layoutZones.value.clear()
    eventListeners.clear()
  }

  /**
   * Resize canvas
   */
  const resize = (width: number, height: number): void => {
    manager.resize(width, height)
    canvasSize.value = { width, height }
  }

  /**
   * Create video texture
   */
  const createVideoTexture = async (source: VideoTextureSource): Promise<VideoTexture> => {
    const texture = await manager.createVideoTexture(source)
    
    // Update reactive state
    videoTextures.value = new Map(manager.getState().videoTextures)
    
    return texture
  }

  /**
   * Add video to layout zone
   */
  const addVideoToZone = (videoId: string, zoneId: string): void => {
    manager.addVideoToZone(videoId, zoneId)
    
    // Update reactive state
    layoutZones.value = new Map(manager.getState().layoutZones)
  }

  /**
   * Remove video from zone
   */
  const removeVideoFromZone = (videoId: string): void => {
    const texture = videoTextures.value.get(videoId)
    if (texture && texture.sprite.parent) {
      texture.sprite.parent.removeChild(texture.sprite as never)
    }
    
    // Update layout zones
    for (const [, zone] of layoutZones.value.entries()) {
      if (zone.videoTexture?.id === videoId) {
        zone.videoTexture = undefined
        layoutZones.value = new Map(layoutZones.value)
        break
      }
    }
  }

  /**
   * Create layout zone
   */
  const createLayoutZone = (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    layerName = 'video'
  ): LayoutZone => {
    const zone = manager.createLayoutZone(id, x, y, width, height, layerName)
    
    // Update reactive state
    layoutZones.value = new Map(manager.getState().layoutZones)
    
    return zone
  }

  /**
   * Remove layout zone
   */
  const removeLayoutZone = (id: string): void => {
    const zone = layoutZones.value.get(id)
    if (zone) {
      // Remove video if present
      if (zone.videoTexture) {
        removeVideoFromZone(zone.videoTexture.id)
      }
      
      // Remove container from parent
      if (zone.container.parent) {
        zone.container.parent.removeChild(zone.container as never)
      }
      
      layoutZones.value.delete(id)
      layoutZones.value = new Map(layoutZones.value)
    }
  }

  /**
   * Apply layout preset
   */
  const applyLayout = (layoutId: string): void => {
    manager.applyLayout(layoutId)
    
    // Update reactive state
    layoutZones.value = new Map(manager.getState().layoutZones)
    currentLayout.value = manager.getCurrentLayout()
  }

  /**
   * Create overlay
   */
  const createOverlay = async (config: AnyOverlayConfig): Promise<void> => {
    await manager.createOverlay(config)
  }

  /**
   * Update overlay
   */
  const updateOverlay = (id: string, updates: Partial<AnyOverlayConfig>): void => {
    manager.updateOverlay(id, updates)
  }

  /**
   * Remove overlay
   */
  const removeOverlay = (id: string): void => {
    manager.removeOverlay(id)
  }

  /**
   * Register event listener
   */
  const onCanvasEvent = (eventType: string, callback: (event: CanvasEvent) => void): void => {
    if (!eventListeners.has(eventType)) {
      eventListeners.set(eventType, [])
    }
    eventListeners.get(eventType)!.push(callback)
    
    // Register with manager
    manager.on(eventType, callback)
  }

  // Set up built-in event listeners
  onCanvasEvent('performance-update', (event) => {
    performance.value = event.data as PerformanceMetrics
  })

  onCanvasEvent('texture-created', () => {
    videoTextures.value = new Map(manager.getState().videoTextures)
  })

  onCanvasEvent('texture-destroyed', () => {
    videoTextures.value = new Map(manager.getState().videoTextures)
  })

  onCanvasEvent('layout-changed', () => {
    const state = manager.getState()
    layoutZones.value = new Map(state.layoutZones)
    currentLayout.value = manager.getCurrentLayout()
    if (state.width !== canvasSize.value.width || state.height !== canvasSize.value.height) {
      canvasSize.value = { width: state.width, height: state.height }
    }
  })

  // Auto-initialize if container ref is provided
  if (autoStart && containerRef) {
    onMounted(() => {
      watch(containerRef, async (container) => {
        if (container && !isInitialized.value) {
          await initialize(container)
        }
      }, { immediate: true })
    })
  }

  // Cleanup on unmount
  onUnmounted(() => {
    destroy()
  })

  return {
    // State
    isInitialized,
    canvasSize,
    performance,
    videoTextures,
    layoutZones,
    currentLayout,
    availableLayouts,
    
    // Actions
    initialize,
    destroy,
    resize,
    
    // Video texture management
    createVideoTexture,
    addVideoToZone,
    removeVideoFromZone,
    
    // Layout management
    createLayoutZone,
    removeLayoutZone,
    applyLayout,
    
    // Overlay management
    createOverlay,
    updateOverlay,
    removeOverlay,
    
    // Events
    onCanvasEvent,
    
    // Canvas manager access
    manager
  }
}