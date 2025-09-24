module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
    commonjs: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    fetch: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
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
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    '*.min.js',
  ],
};
