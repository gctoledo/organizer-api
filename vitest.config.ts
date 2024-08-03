import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/src/http/**'],
    coverage: {
      include: ['src/**/*.ts'],
      provider: 'v8',
    },
  },
  plugins: [tsconfigPaths()],
})
