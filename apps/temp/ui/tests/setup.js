"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
const vitest_1 = require("vitest");
const react_1 = require("@testing-library/react");
// Cleanup after each test
(0, vitest_1.afterEach)(function () {
    (0, react_1.cleanup)();
});
// Custom expect matchers from jest-dom
vitest_1.expect.extend({});
