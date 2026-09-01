/**
 * @file Vitest configuration for the TransitHub_JU backend.
 *
 * Configures the Node.js test environment, globals, and test file
 * matching patterns for backend unit and integration test suites.
 */

import { defineConfig } from 'vitest/config';

/**
 * Vitest configuration object.
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.js'],
  },
});
