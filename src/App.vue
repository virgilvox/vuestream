<script setup lang="ts">
import { ref } from 'vue'
import { ThemeSwitcher, StudioCanvas } from '../packages/components'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import { useTheme } from '../packages/composables'

const { isDark } = useTheme()

// Canvas demo state
const showCanvasDemo = ref(false)
const canvasError = ref<string | null>(null)

const handleCanvasInitialized = () => {
  console.log('Canvas initialized successfully')
  canvasError.value = null
}

const handleCanvasError = (error: Error) => {
  console.error('Canvas error:', error)
  canvasError.value = error.message
}

const toggleCanvasDemo = () => {
  showCanvasDemo.value = !showCanvasDemo.value
  canvasError.value = null
}
</script>

<template>
  <div class="min-h-screen vs-bg-surface vs-transition">
    <!-- Header -->
    <header class="vs-card mb-8 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold vs-text-primary">VueStream</h1>
          <p class="vs-text-secondary">Professional Livestream Studio Component</p>
        </div>
        <ThemeSwitcher />
      </div>
    </header>

    <!-- Main content -->
    <main class="container mx-auto max-w-4xl px-6">
      <!-- Welcome section -->
      <section class="mb-12">
        <div class="vs-card p-8 text-center">
          <h2 class="mb-4 text-3xl font-bold vs-text-primary">
            Design System Demo
          </h2>
          <p class="mb-6 text-lg vs-text-secondary">
            Exploring the VueStream design system with PrimeVue integration
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <Button 
              label="Primary Action" 
              severity="primary"
              class="vs-transition"
            />
            <Button 
              label="Secondary" 
              severity="secondary"
              outlined
              class="vs-transition"
            />
            <Button 
              label="Success" 
              severity="success"
              class="vs-transition"
            />
          </div>
        </div>
      </section>

      <!-- Components showcase -->
      <section class="mb-12">
        <h3 class="mb-6 text-2xl font-semibold vs-text-primary">Components</h3>
        
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Form components -->
          <Card class="vs-transition">
            <template #title>Form Elements</template>
            <template #content>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium vs-text-primary mb-2">
                    Input Field
                  </label>
                  <InputText 
                    placeholder="Enter some text..." 
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium vs-text-primary mb-2">
                    Custom Styled Input
                  </label>
                  <input 
                    type="text"
                    placeholder="Custom styled input"
                    class="vs-input"
                  />
                </div>
              </div>
            </template>
          </Card>

          <!-- Color palette -->
          <Card class="vs-transition">
            <template #title>Color Palette</template>
            <template #content>
              <div class="space-y-4">
                <div>
                  <p class="text-sm vs-text-secondary mb-2">Primary Colors</p>
                  <div class="flex gap-2">
                    <div class="h-8 w-8 rounded bg-primary-400"></div>
                    <div class="h-8 w-8 rounded bg-primary-500"></div>
                    <div class="h-8 w-8 rounded bg-primary-600"></div>
                    <div class="h-8 w-8 rounded bg-primary-700"></div>
                  </div>
                </div>
                <div>
                  <p class="text-sm vs-text-secondary mb-2">Surface Colors</p>
                  <div class="flex gap-2">
                    <div class="h-8 w-8 rounded bg-surface-100 border"></div>
                    <div class="h-8 w-8 rounded bg-surface-200 border"></div>
                    <div class="h-8 w-8 rounded bg-surface-300 border"></div>
                    <div class="h-8 w-8 rounded bg-surface-400 border"></div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </section>

      <!-- Typography -->
      <section class="mb-12">
        <Card class="vs-transition">
          <template #title>Typography Scale</template>
          <template #content>
            <div class="space-y-4">
              <div>
                <h1 class="text-title font-bold vs-text-primary">Title - 2rem</h1>
                <h2 class="text-headline font-semibold vs-text-primary">Headline - 1.5rem</h2>
                <p class="text-body vs-text-primary">Body text - 1rem</p>
                <p class="text-label vs-text-secondary">Label text - 0.875rem</p>
                <p class="text-caption vs-text-muted">Caption text - 0.75rem</p>
              </div>
            </div>
          </template>
        </Card>
      </section>

      <!-- Custom components demo -->
      <section class="mb-12">
        <Card class="vs-transition">
          <template #title>Custom Component Classes</template>
          <template #content>
            <div class="space-y-6">
              <div>
                <h4 class="mb-3 font-medium vs-text-primary">Button Variants</h4>
                <div class="flex flex-wrap gap-3">
                  <button class="vs-btn vs-btn-primary">Primary Button</button>
                  <button class="vs-btn vs-btn-secondary">Secondary Button</button>
                  <button class="vs-btn vs-btn-ghost">Ghost Button</button>
                </div>
              </div>
              
              <div>
                <h4 class="mb-3 font-medium vs-text-primary">Cards & Panels</h4>
                <div class="grid gap-4 md:grid-cols-2">
                  <div class="vs-card p-4">
                    <p class="vs-text-primary">Regular card with shadow</p>
                  </div>
                  <div class="vs-panel p-4">
                    <p class="vs-text-primary">Panel with backdrop blur</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </section>

      <!-- Canvas Demo -->
      <section class="mb-12">
        <Card class="vs-transition">
          <template #title>
            <div class="flex items-center justify-between">
              <span>Pixi.js Canvas Demo</span>
              <Button 
                :label="showCanvasDemo ? 'Hide Canvas' : 'Show Canvas'"
                @click="toggleCanvasDemo"
                severity="secondary"
                outlined
                size="small"
              />
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <p class="vs-text-secondary">
                High-performance canvas rendering with Pixi.js v8, featuring WebGPU support,
                video texture management, and professional layout engine.
              </p>
              
              <!-- Error display -->
              <div v-if="canvasError" class="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <p class="text-red-700 dark:text-red-300 text-sm">
                  <strong>Canvas Error:</strong> {{ canvasError }}
                </p>
              </div>

              <!-- Canvas container -->
              <div v-if="showCanvasDemo" class="canvas-demo-container">
                <StudioCanvas
                  :config="{
                    width: 800,
                    height: 450,
                    backgroundColor: 0x1a1a1a,
                    antialias: true,
                    preferWebGPU: true
                  }"
                  :show-debug="true"
                  :show-controls="true"
                  :auto-resize="false"
                  @initialized="handleCanvasInitialized"
                  @error="handleCanvasError"
                  class="rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700"
                />
              </div>

              <div v-if="showCanvasDemo" class="canvas-info">
                <h4 class="text-sm font-medium vs-text-primary mb-2">Canvas Features</h4>
                <ul class="text-sm vs-text-secondary space-y-1">
                  <li>• WebGPU/WebGL rendering with automatic fallback</li>
                  <li>• Real-time performance monitoring</li>
                  <li>• Video texture support for MediaStream integration</li>
                  <li>• Layer-based rendering architecture</li>
                  <li>• Efficient texture pooling and memory management</li>
                  <li>• Layout zone system for dynamic video positioning</li>
                </ul>
              </div>
            </div>
          </template>
        </Card>
      </section>

      <!-- Theme info -->
      <section class="mb-12">
        <Card class="vs-transition">
          <template #title>Theme Information</template>
          <template #content>
            <div class="space-y-2">
              <p class="vs-text-primary">
                <strong>Current theme:</strong> {{ isDark ? 'Dark' : 'Light' }}
              </p>
              <p class="vs-text-secondary">
                The design system automatically switches between light and dark themes
                with smooth transitions and proper contrast ratios.
              </p>
            </div>
          </template>
        </Card>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Any additional component-specific styles */
.container {
  @apply mx-auto px-4 sm:px-6 lg:px-8;
}
</style>
