/**
 * Theme Management Composable
 * 
 * Provides reactive theme state and switching functionality
 */

import { ref, computed, watch } from 'vue'
import { lightTheme, darkTheme } from '../themes'
import type { ThemeTokens } from '../themes'

export type ThemeMode = 'light' | 'dark' | 'system'

const themeMode = ref<ThemeMode>('system')
const systemTheme = ref<'light' | 'dark'>('light')

// Check system preference
const checkSystemTheme = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

// Initialize system theme
if (typeof window !== 'undefined') {
  systemTheme.value = checkSystemTheme()
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    systemTheme.value = e.matches ? 'dark' : 'light'
  })
}

// Load saved theme preference
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('vuestream-theme')
  if (saved && ['light', 'dark', 'system'].includes(saved)) {
    themeMode.value = saved as ThemeMode
  }
}

export function useTheme() {
  // Computed current theme
  const currentTheme = computed<'light' | 'dark'>(() => {
    if (themeMode.value === 'system') {
      return systemTheme.value
    }
    return themeMode.value
  })

  // Get theme tokens
  const tokens = computed<ThemeTokens>(() => {
    return currentTheme.value === 'dark' ? darkTheme : lightTheme
  })

  // Apply theme to DOM
  const applyTheme = (theme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      
      if (theme === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }

  // Set theme mode
  const setTheme = (mode: ThemeMode) => {
    themeMode.value = mode
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('vuestream-theme', mode)
    }
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    if (themeMode.value === 'light') {
      setTheme('dark')
    } else if (themeMode.value === 'dark') {
      setTheme('light')
    } else {
      // If system, toggle to opposite of current system preference
      setTheme(systemTheme.value === 'dark' ? 'light' : 'dark')
    }
  }

  // Watch for theme changes and apply to DOM
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  }, { immediate: true })

  // Check if current theme is dark
  const isDark = computed(() => currentTheme.value === 'dark')

  return {
    // State
    themeMode: readonly(themeMode),
    currentTheme: readonly(currentTheme),
    systemTheme: readonly(systemTheme),
    tokens: readonly(tokens),
    isDark: readonly(isDark),
    
    // Actions
    setTheme,
    toggleTheme,
  }
}

// Export types
export type { ThemeTokens }

function readonly<T>(refValue: T): T {
  return refValue
}