<template>
  <div class="vs-theme-switcher">
    <button
      @click="toggleTheme"
      class="vs-btn vs-btn-ghost p-2"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <component
        :is="isDark ? SunIcon : MoonIcon"
        class="h-5 w-5"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '../composables'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.vs-theme-switcher {
  @apply flex items-center;
}
</style>