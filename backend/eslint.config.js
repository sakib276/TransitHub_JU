import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["docs/**", "node_modules/**"]),
  {
    files: ["src/**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      camelcase: "error",
      curly: ["error", "all"],
      indent: ["error", 2, { SwitchCase: 1 }],
      "keyword-spacing": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "space-before-blocks": "error",
      "space-infix-ops": "error",
    },
  },
  {
    files: ["src/**/*.test.js", "src/**/tests/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        afterAll: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
        vi: "readonly",
      },
    },
  },
]);
