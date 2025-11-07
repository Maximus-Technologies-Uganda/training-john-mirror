"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var plugin_react_1 = require("@vitejs/plugin-react");
var path_1 = require("path");
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            reportsDirectory: './coverage',
            exclude: [
                'node_modules/',
                'dist/',
                'build/',
                '**/*.config.*',
                '**/types/**',
            ],
            lines: 50,
            functions: 50,
            branches: 50,
            statements: 50,
        },
        include: ['tests/**/*.test.{ts,tsx}'],
    },
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, './src'),
        },
    },
});
