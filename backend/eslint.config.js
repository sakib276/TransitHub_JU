/**
 * @file ESLint configuration for the TransitHub_JU backend.
 *
 * Enforces modern ECMAScript standards, Node.js globals, and
 * consistent code quality rules across all backend JavaScript files.
 */

import js from '@eslint/js';
import globals from 'globals';

/**
 * ESLint flat configuration array for backend JavaScript source files.
 */
export default [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
    ],
  },

  js.configs.recommended,

  {
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.node,
      },
    },

    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
