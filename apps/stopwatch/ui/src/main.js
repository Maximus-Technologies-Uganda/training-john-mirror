"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var client_1 = require("react-dom/client");
var App_1 = require("./App");
var root = document.getElementById('root');
if (!root) {
    throw new Error('Root element not found');
}
client_1.default.createRoot(root).render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }));
