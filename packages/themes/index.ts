/**
 * VueStream Themes Package
 * 
 * Design tokens and theme configurations
 */

export * from './tokens'
export { default as lightTheme } from './default'
export { default as darkTheme } from './dark'

// Re-export for convenience
export { lightTheme as defaultTheme } from './default'