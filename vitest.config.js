import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'coverage/',
        '**/*.test.js',
        '**/*.spec.js',
        'tests/',
        '.github/',
        'data/',
        'journal/',
      ],
    },
    reporters: ['verbose', 'junit'],
    outputFile: {
      junit: 'test-results/junit.xml',
    },
  },
});
