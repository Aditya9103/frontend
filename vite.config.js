import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  test: {
    // Use jsdom to simulate a browser environment for React components
    environment: 'jsdom',

    // Auto-import @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
    setupFiles: ['./src/core/testing/setupTests.js'],

    globals: true, // Allow describe/it/expect without imports

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/core/testing/**',
        'dist/**',
        '*.config.*',
      ],
      thresholds: {
        branches: 60,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
})
