import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        // Test globals
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        vi: 'readonly',
        setImmediate: 'readonly',
      },
    },
    rules: {
      'indent': 'off', // Disable strict indentation for existing code
      'linebreak-style': 'off', // Disable linebreak-style for Windows compatibility
      'quotes': 'off', // Disable strict quote enforcement for existing code
      'semi': ['error', 'always'],
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      'no-console': 'off', // Allow console statements in CLI tools
      'prefer-const': 'warn',
      'no-var': 'warn',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      'no-case-declarations': 'off', // Allow declarations in case blocks
    },
  },
  {
    ignores: [
      'node_modules/',
      'coverage/',
      'dist/',
      'build/',
      'review-artifacts/',
      '*.min.js',
      'apps/*/ui/dist/',
      'apps/*/ui/test-results/',
      '**/playwright.config.js', // Generated TypeScript output
    ],
  },
];
