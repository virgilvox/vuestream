import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@core': fileURLToPath(new URL('./packages/core', import.meta.url)),
      '@components': fileURLToPath(new URL('./packages/components', import.meta.url)),
      '@composables': fileURLToPath(new URL('./packages/composables', import.meta.url)),
      '@store': fileURLToPath(new URL('./packages/store', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./packages/layouts', import.meta.url)),
      '@overlays': fileURLToPath(new URL('./packages/overlays', import.meta.url)),
      '@storage': fileURLToPath(new URL('./packages/storage', import.meta.url)),
      '@themes': fileURLToPath(new URL('./packages/themes', import.meta.url))
    },
  },
})
