/**
 * Overlay System for VueStream Canvas
 * 
 * Text overlays, logos, and branding elements for professional streaming
 */

import { Container, Text, Sprite, Texture, Graphics } from 'pixi.js'

export interface OverlayConfig {
  id: string
  type: 'text' | 'image' | 'logo' | 'lower-third'
  x: number
  y: number
  width?: number
  height?: number
  zIndex?: number
  visible?: boolean
}

export interface TextOverlayConfig extends OverlayConfig {
  type: 'text'
  content: string
  style?: {
    fontFamily?: string
    fontSize?: number
    fill?: string | number
    align?: 'left' | 'center' | 'right'
    fontWeight?: string
    stroke?: string | number
    strokeThickness?: number
  }
}

export interface ImageOverlayConfig extends OverlayConfig {
  type: 'image' | 'logo'
  source: string | Texture
  opacity?: number
  scale?: number
}

export interface LowerThirdConfig extends OverlayConfig {
  type: 'lower-third'
  title: string
  subtitle?: string
  backgroundColor?: number
  textColor?: number
  width: number
  height: number
}

export type AnyOverlayConfig = TextOverlayConfig | ImageOverlayConfig | LowerThirdConfig

export class OverlayManager {
  private container: Container
  private overlays: Map<string, Container>

  constructor(parentContainer: Container) {
    this.container = new Container()
    this.container.label = 'overlays'
    this.overlays = new Map()
    
    parentContainer.addChild(this.container)
  }

  /**
   * Create text overlay
   */
  createTextOverlay(config: TextOverlayConfig): Container {
    const overlay = new Container()
    overlay.label = `text-overlay-${config.id}`

    const textStyle = {
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 24,
      fill: 0xffffff,
      align: 'left' as const,
      fontWeight: '600',
      stroke: 0x000000,
      strokeThickness: 2,
      ...config.style
    }

    const textElement = new Text(config.content, textStyle as never)

    overlay.addChild(textElement)
    overlay.x = config.x
    overlay.y = config.y
    overlay.zIndex = config.zIndex ?? 100
    overlay.visible = config.visible ?? true

    this.container.addChild(overlay)
    this.overlays.set(config.id, overlay)

    return overlay
  }

  /**
   * Create image/logo overlay
   */
  async createImageOverlay(config: ImageOverlayConfig): Promise<Container> {
    const overlay = new Container()
    overlay.label = `image-overlay-${config.id}`

    let texture: Texture
    if (typeof config.source === 'string') {
      // Load texture from URL
      texture = await Texture.from(config.source)
    } else {
      texture = config.source
    }

    const sprite = new Sprite(texture)
    
    // Apply scaling if specified
    if (config.scale) {
      sprite.scale.set(config.scale)
    } else if (config.width && config.height) {
      // Fit to specified dimensions
      sprite.width = config.width
      sprite.height = config.height
    }

    sprite.alpha = config.opacity ?? 1

    overlay.addChild(sprite)
    overlay.x = config.x
    overlay.y = config.y
    overlay.zIndex = config.zIndex ?? 50
    overlay.visible = config.visible ?? true

    this.container.addChild(overlay)
    this.overlays.set(config.id, overlay)

    return overlay
  }

  /**
   * Create lower third overlay
   */
  createLowerThird(config: LowerThirdConfig): Container {
    const overlay = new Container()
    overlay.label = `lower-third-${config.id}`

    // Background
    const background = new Graphics()
    background
      .rect(0, 0, config.width, config.height)
      .fill(config.backgroundColor ?? 0x000000)
    background.alpha = 0.8

    // Title text
    const titleStyle = {
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 24,
      fill: config.textColor ?? 0xffffff,
      fontWeight: '700'
    }

    const titleText = new Text(config.title, titleStyle as never)
    titleText.x = 20
    titleText.y = config.subtitle ? 10 : (config.height - titleText.height) / 2

    overlay.addChild(background)
    overlay.addChild(titleText)

    // Subtitle if provided
    if (config.subtitle) {
      const subtitleStyle = {
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: 16,
        fill: config.textColor ?? 0xcccccc,
        fontWeight: '400'
      }

      const subtitleText = new Text(config.subtitle, subtitleStyle as never)
      subtitleText.x = 20
      subtitleText.y = titleText.y + titleText.height + 5

      overlay.addChild(subtitleText)
    }

    overlay.x = config.x
    overlay.y = config.y
    overlay.zIndex = config.zIndex ?? 75
    overlay.visible = config.visible ?? true

    this.container.addChild(overlay)
    this.overlays.set(config.id, overlay)

    return overlay
  }

  /**
   * Update text overlay content
   */
  updateTextOverlay(id: string, content: string): void {
    const overlay = this.overlays.get(id)
    if (overlay) {
      const textElement = overlay.children.find(child => child instanceof Text) as Text
      if (textElement) {
        textElement.text = content
      }
    }
  }

  /**
   * Update lower third content
   */
  updateLowerThird(id: string, title: string, subtitle?: string): void {
    const overlay = this.overlays.get(id)
    if (overlay) {
      const texts = overlay.children.filter(child => child instanceof Text) as Text[]
      if (texts.length > 0) {
        texts[0].text = title // Title
        if (texts.length > 1 && subtitle) {
          texts[1].text = subtitle // Subtitle
        }
      }
    }
  }

  /**
   * Show/hide overlay
   */
  setOverlayVisibility(id: string, visible: boolean): void {
    const overlay = this.overlays.get(id)
    if (overlay) {
      overlay.visible = visible
    }
  }

  /**
   * Move overlay to new position
   */
  moveOverlay(id: string, x: number, y: number): void {
    const overlay = this.overlays.get(id)
    if (overlay) {
      overlay.x = x
      overlay.y = y
    }
  }

  /**
   * Remove overlay
   */
  removeOverlay(id: string): void {
    const overlay = this.overlays.get(id)
    if (overlay) {
      this.container.removeChild(overlay)
      overlay.destroy()
      this.overlays.delete(id)
    }
  }

  /**
   * Clear all overlays
   */
  clearAllOverlays(): void {
    for (const [id] of this.overlays) {
      this.removeOverlay(id)
    }
  }

  /**
   * Get overlay by ID
   */
  getOverlay(id: string): Container | undefined {
    return this.overlays.get(id)
  }

  /**
   * List all overlay IDs
   */
  listOverlays(): string[] {
    return Array.from(this.overlays.keys())
  }

  /**
   * Destroy overlay manager
   */
  destroy(): void {
    this.clearAllOverlays()
    if (this.container.parent) {
      this.container.parent.removeChild(this.container)
    }
    this.container.destroy()
  }
}

/**
 * Common overlay presets
 */
export const OVERLAY_PRESETS = {
  watermark: (x: number, y: number): ImageOverlayConfig => ({
    id: 'watermark',
    type: 'logo',
    source: '/logo.png',
    x,
    y,
    scale: 0.5,
    opacity: 0.7,
    zIndex: 200
  }),

  lowerThird: (title: string, subtitle?: string): LowerThirdConfig => ({
    id: 'speaker-info',
    type: 'lower-third',
    title,
    subtitle,
    x: 50,
    y: -150, // Position from bottom
    width: 400,
    height: 80,
    backgroundColor: 0x1a1a1a,
    textColor: 0xffffff,
    zIndex: 150
  }),

  streamTitle: (title: string): TextOverlayConfig => ({
    id: 'stream-title',
    type: 'text',
    content: title,
    x: 50,
    y: 50,
    style: {
      fontSize: 32,
      fontWeight: '700',
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 3
    },
    zIndex: 100
  })
}