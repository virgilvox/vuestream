/**
 * Dark Theme for VueStream
 */

import { baseTokens } from './tokens'
import type { ThemeTokens } from './tokens'

export const darkTheme: ThemeTokens = {
  ...baseTokens,
  colors: {
    ...baseTokens.colors,
    surface: {
      0: baseTokens.colors.surface[950],
      50: baseTokens.colors.surface[900],
      100: baseTokens.colors.surface[800],
      200: baseTokens.colors.surface[700],
      300: baseTokens.colors.surface[600],
      400: baseTokens.colors.surface[500],
      500: baseTokens.colors.surface[400],
      600: baseTokens.colors.surface[300],
      700: baseTokens.colors.surface[200],
      800: baseTokens.colors.surface[100],
      900: baseTokens.colors.surface[50],
      950: baseTokens.colors.surface[0],
    },
    text: {
      primary: baseTokens.colors.surface[50],
      secondary: baseTokens.colors.surface[400],
      muted: baseTokens.colors.surface[500],
      inverse: baseTokens.colors.surface[900],
    },
    border: {
      light: baseTokens.colors.surface[700],
      medium: baseTokens.colors.surface[600],
      strong: baseTokens.colors.surface[500],
    },
  },
}

export default darkTheme