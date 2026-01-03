import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.js'], // ← Un seul fichier !
    testTimeout: 10000
  }
})
