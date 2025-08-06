/**
 * Layout Presets for VueStream Canvas
 * 
 * Pre-defined layout configurations for common streaming scenarios
 */

export interface LayoutZoneDefinition {
  id: string
  x: number
  y: number
  width: number
  height: number
  label?: string
}

export interface LayoutPreset {
  id: string
  name: string
  description: string
  zones: LayoutZoneDefinition[]
  aspectRatio: number
  maxParticipants: number
}

/**
 * Calculate responsive zone positions based on canvas size
 */
export function calculateZonePositions(
  zones: LayoutZoneDefinition[],
  canvasWidth: number,
  canvasHeight: number
): LayoutZoneDefinition[] {
  return zones.map(zone => ({
    ...zone,
    x: zone.x * canvasWidth,
    y: zone.y * canvasHeight,
    width: zone.width * canvasWidth,
    height: zone.height * canvasHeight
  }))
}

/**
 * Single speaker layout - one large video
 */
export const SINGLE_SPEAKER_LAYOUT: LayoutPreset = {
  id: 'single-speaker',
  name: 'Single Speaker',
  description: 'One participant takes the full screen',
  aspectRatio: 16 / 9,
  maxParticipants: 1,
  zones: [
    {
      id: 'main',
      x: 0.05, // 5% margin
      y: 0.05,
      width: 0.9, // 90% width
      height: 0.9, // 90% height
      label: 'Main Speaker'
    }
  ]
}

/**
 * Picture-in-picture layout - main speaker with small secondary
 */
export const PICTURE_IN_PICTURE_LAYOUT: LayoutPreset = {
  id: 'picture-in-picture',
  name: 'Picture in Picture',
  description: 'Main speaker with small secondary video',
  aspectRatio: 16 / 9,
  maxParticipants: 2,
  zones: [
    {
      id: 'main',
      x: 0.025,
      y: 0.025,
      width: 0.95,
      height: 0.95,
      label: 'Main Speaker'
    },
    {
      id: 'pip',
      x: 0.7, // Top right corner
      y: 0.05,
      width: 0.25,
      height: 0.25,
      label: 'Secondary'
    }
  ]
}

/**
 * Side-by-side layout - two equal participants
 */
export const SIDE_BY_SIDE_LAYOUT: LayoutPreset = {
  id: 'side-by-side',
  name: 'Side by Side',
  description: 'Two participants sharing the screen equally',
  aspectRatio: 16 / 9,
  maxParticipants: 2,
  zones: [
    {
      id: 'left',
      x: 0.025,
      y: 0.05,
      width: 0.475,
      height: 0.9,
      label: 'Left Speaker'
    },
    {
      id: 'right',
      x: 0.5,
      y: 0.05,
      width: 0.475,
      height: 0.9,
      label: 'Right Speaker'
    }
  ]
}

/**
 * Grid layout - four equal participants
 */
export const FOUR_GRID_LAYOUT: LayoutPreset = {
  id: 'four-grid',
  name: 'Four Grid',
  description: 'Four participants in a 2x2 grid',
  aspectRatio: 16 / 9,
  maxParticipants: 4,
  zones: [
    {
      id: 'top-left',
      x: 0.025,
      y: 0.025,
      width: 0.475,
      height: 0.475,
      label: 'Top Left'
    },
    {
      id: 'top-right',
      x: 0.5,
      y: 0.025,
      width: 0.475,
      height: 0.475,
      label: 'Top Right'
    },
    {
      id: 'bottom-left',
      x: 0.025,
      y: 0.5,
      width: 0.475,
      height: 0.475,
      label: 'Bottom Left'
    },
    {
      id: 'bottom-right',
      x: 0.5,
      y: 0.5,
      width: 0.475,
      height: 0.475,
      label: 'Bottom Right'
    }
  ]
}

/**
 * Spotlight with gallery - main speaker with multiple small videos
 */
export const SPOTLIGHT_GALLERY_LAYOUT: LayoutPreset = {
  id: 'spotlight-gallery',
  name: 'Spotlight with Gallery',
  description: 'Main speaker with gallery of other participants',
  aspectRatio: 16 / 9,
  maxParticipants: 7,
  zones: [
    {
      id: 'spotlight',
      x: 0.025,
      y: 0.025,
      width: 0.7,
      height: 0.95,
      label: 'Spotlight Speaker'
    },
    {
      id: 'gallery-1',
      x: 0.75,
      y: 0.025,
      width: 0.225,
      height: 0.15,
      label: 'Gallery 1'
    },
    {
      id: 'gallery-2',
      x: 0.75,
      y: 0.19,
      width: 0.225,
      height: 0.15,
      label: 'Gallery 2'
    },
    {
      id: 'gallery-3',
      x: 0.75,
      y: 0.355,
      width: 0.225,
      height: 0.15,
      label: 'Gallery 3'
    },
    {
      id: 'gallery-4',
      x: 0.75,
      y: 0.52,
      width: 0.225,
      height: 0.15,
      label: 'Gallery 4'
    },
    {
      id: 'gallery-5',
      x: 0.75,
      y: 0.685,
      width: 0.225,
      height: 0.15,
      label: 'Gallery 5'
    },
    {
      id: 'gallery-6',
      x: 0.75,
      y: 0.85,
      width: 0.225,
      height: 0.125,
      label: 'Gallery 6'
    }
  ]
}

/**
 * All available layout presets
 */
export const LAYOUT_PRESETS: LayoutPreset[] = [
  SINGLE_SPEAKER_LAYOUT,
  PICTURE_IN_PICTURE_LAYOUT,
  SIDE_BY_SIDE_LAYOUT,
  FOUR_GRID_LAYOUT,
  SPOTLIGHT_GALLERY_LAYOUT
]

/**
 * Get layout preset by ID
 */
export function getLayoutPreset(id: string): LayoutPreset | undefined {
  return LAYOUT_PRESETS.find(preset => preset.id === id)
}

/**
 * Get suitable layout presets for participant count
 */
export function getLayoutsForParticipantCount(count: number): LayoutPreset[] {
  return LAYOUT_PRESETS.filter(preset => preset.maxParticipants >= count)
}