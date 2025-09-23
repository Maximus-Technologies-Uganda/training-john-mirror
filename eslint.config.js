const js = require('@eslint/js');

module.exports = [
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
      },
    },
    rules: {
      'indent': 'off', // Disable strict indentation for existing code
      'linebreak-style': 'off', // Disable linebreak-style for Windows compatibility
      'quotes': 'off', // Disable strict quote enforcement for existing code
      'semi': ['error', 'always'],
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
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
      '*.min.js',
    ],
  },
];
