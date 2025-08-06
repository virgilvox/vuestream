/**
 * Default Light Theme for VueStream
 */

import { baseTokens } from './tokens'
import type { ThemeTokens } from './tokens'

export const lightTheme: ThemeTokens = {
  ...baseTokens,
  colors: {
    ...baseTokens.colors,
    text: {
      primary: baseTokens.colors.surface[900],
      secondary: baseTokens.colors.surface[600],
      muted: baseTokens.colors.surface[400],
      inverse: baseTokens.colors.surface[0],
    },
    border: {
      light: baseTokens.colors.surface[200],
      medium: baseTokens.colors.surface[300],
      strong: baseTokens.colors.surface[400],
    },
  },
}

export default lightTheme