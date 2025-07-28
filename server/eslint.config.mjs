import tseslint from "typescript-eslint";
import js from "@eslint/js";

/**
 * A minimal, local ESLint v9 configuration for the server.
 * This is used temporarily until @joaoptgrilo/dev-config supports ESLint v9.
 */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {},
  },
];
