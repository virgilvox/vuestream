<template>
  <div 
    ref="canvasContainer"
    class="studio-canvas"
    :class="{
      'is-initialized': isInitialized,
      'is-loading': !isInitialized
    }"
  >
    <!-- Loading state -->
    <div v-if="!isInitialized" class="canvas-loading">
      <div class="loading-spinner"></div>
      <p class="vs-text-secondary">Initializing Canvas...</p>
    </div>

    <!-- Debug overlay -->
    <div v-if="showDebug && isInitialized" class="debug-overlay">
      <div class="debug-panel vs-panel p-4">
        <h4 class="text-sm font-medium vs-text-primary mb-2">Performance</h4>
        <div class="debug-stats">
          <div class="stat">
            <span class="label">FPS:</span>
            <span class="value">{{ performance.fps }}</span>
          </div>
          <div class="stat">
            <span class="label">Textures:</span>
            <span class="value">{{ performance.textureCount }}</span>
          </div>
          <div class="stat">
            <span class="label">Size:</span>
            <span class="value">{{ canvasSize.width }}×{{ canvasSize.height }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls overlay -->
    <div v-if="showControls && isInitialized" class="controls-overlay">
      <div class="controls-panel vs-panel p-3">
        <div class="controls-row">
          <button
            @click="toggleDebug"
            class="vs-btn vs-btn-ghost text-xs"
          >
            Debug {{ showDebugLocal ? 'Off' : 'On' }}
          </button>
          <button
            @click="resize(1920, 1080)"
            class="vs-btn vs-btn-ghost text-xs"
          >
            1080p
          </button>
          <button
            @click="resize(1280, 720)"
            class="vs-btn vs-btn-ghost text-xs"
          >
            720p
          </button>
        </div>
        
        <div class="controls-row">
          <select 
            @change="onLayoutChange"
            class="layout-select text-xs"
            :value="currentLayout?.id || ''"
          >
            <option value="">Select Layout</option>
            <option 
              v-for="layout in availableLayouts" 
              :key="layout.id" 
              :value="layout.id"
            >
              {{ layout.name }}
            </option>
          </select>
          
          <button
            @click="addDemoOverlay"
            class="vs-btn vs-btn-ghost text-xs"
          >
            Add Overlay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineEmits, defineProps } from 'vue'
import { useCanvas } from '../composables'
import type { CanvasConfig } from '../core'

interface Props {
  config?: Partial<CanvasConfig>
  showDebug?: boolean
  showControls?: boolean
  autoResize?: boolean
}

interface Emits {
  initialized: []
  error: [error: Error]
  resize: [size: { width: number; height: number }]
}

const props = withDefaults(defineProps<Props>(), {
  showDebug: false,
  showControls: false,
  autoResize: true
})

const emit = defineEmits<Emits>()

// Template refs
const canvasContainer = ref<HTMLElement | null>(null)

// Canvas composable
const {
  isInitialized,
  canvasSize,
  performance,
  currentLayout,
  availableLayouts,
  initialize,
  resize,
  applyLayout,
  createOverlay,
  onCanvasEvent,
  manager
} = useCanvas(props.config)

// Local state
const showDebugLocal = ref(props.showDebug)

// Initialize canvas when container is ready
onMounted(async () => {
  if (canvasContainer.value) {
    try {
      await initialize(canvasContainer.value)
      emit('initialized')
    } catch (error) {
      console.error('Failed to initialize canvas:', error)
      emit('error', error as Error)
    }
  }
})

// Set up event listeners
onCanvasEvent('error', (event) => {
  emit('error', new Error((event.data as { message?: string })?.message || 'Unknown canvas error'))
})

// Watch for canvas size changes
watch(canvasSize, (newSize) => {
  emit('resize', newSize)
}, { deep: true })

// Handle window resize if autoResize is enabled
if (props.autoResize) {
  const handleResize = () => {
    if (!canvasContainer.value || !isInitialized.value) return
    
    const { clientWidth, clientHeight } = canvasContainer.value
    if (clientWidth > 0 && clientHeight > 0) {
      resize(clientWidth, clientHeight)
    }
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
}

// Methods
const toggleDebug = () => {
  showDebugLocal.value = !showDebugLocal.value
}

const onLayoutChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target.value) {
    applyLayout(target.value)
  }
}

const addDemoOverlay = async () => {
  try {
    // Add a demo text overlay
    await createOverlay({
      id: `demo-${Date.now()}`,
      type: 'text',
      content: 'VueStream Demo',
      x: 50,
      y: 100,
      style: {
        fontSize: 32,
        fill: 0xffffff,
        fontWeight: '700',
        stroke: 0x000000,
        strokeThickness: 2
      }
    })
  } catch (error) {
    console.error('Failed to create overlay:', error)
  }
}

// Expose canvas manager for parent components
defineExpose({
  manager,
  isInitialized,
  canvasSize,
  performance,
  resize
})
</script>

<style scoped>
.studio-canvas {
  @apply relative w-full h-full bg-surface-900 rounded-lg overflow-hidden;
  min-height: 400px;
}

.studio-canvas.is-loading {
  @apply flex items-center justify-center;
}

.canvas-loading {
  @apply flex flex-col items-center gap-4;
}

.loading-spinner {
  @apply w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin;
}

.debug-overlay {
  @apply absolute top-4 right-4 z-10;
}

.controls-overlay {
  @apply absolute bottom-4 right-4 z-10;
}

.controls-panel {
  @apply flex flex-col gap-2;
}

.controls-row {
  @apply flex gap-2;
}

.layout-select {
  @apply vs-input text-xs min-w-32;
}

.debug-panel {
  @apply min-w-48;
}

.debug-stats {
  @apply space-y-1;
}

.stat {
  @apply flex justify-between text-xs;
}

.stat .label {
  @apply vs-text-secondary;
}

.stat .value {
  @apply vs-text-primary font-mono;
}

/* Dark theme adjustments */
.dark .studio-canvas {
  @apply bg-surface-800;
}

.dark .loading-spinner {
  @apply border-primary-800 border-t-primary-400;
}
</style>