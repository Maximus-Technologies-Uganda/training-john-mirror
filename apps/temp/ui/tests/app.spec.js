"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const vitest_1 = require("vitest");
const react_1 = require("@testing-library/react");
const App_1 = require("../src/App");
(0, vitest_1.describe)('Temp App', function () {
    (0, vitest_1.it)('renders the Temp placeholder heading', function () {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(App_1.default, {}));
        (0, vitest_1.expect)(react_1.screen.getByRole('heading', { name: /temp ui/i })).toBeInTheDocument();
    });
});
