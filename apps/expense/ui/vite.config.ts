import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disabled in production for smaller bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
    rollupOptions: {
      output: {
        // Code splitting strategy for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 100,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Performance optimizations
  preview: {
    port: 4173,
  },
  resolve: {
    alias: {
      // Optimize module resolution
    },
  },
})
