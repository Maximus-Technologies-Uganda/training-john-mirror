"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_1 = require("@vitejs/plugin-react");
var node_path_1 = require("node:path");
exports.default = (0, vite_1.defineConfig)({
    root: '.',
    plugins: [(0, plugin_react_1.default)()],
    resolve: {
        alias: {
            '@': node_path_1.default.resolve(__dirname, 'src'),
        },
    },
    server: {
        port: 5173,
    },
});
