import { defineConfig } from 'vite'

export default defineConfig({
  base: '/ecosystem-battle-arena/', // Correct base for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    open: true, // Auto-open browser in development
  }
})