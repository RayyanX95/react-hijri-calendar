// ESLint v9+ flat config migration (CommonJS)

const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const typescript = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-plugin-prettier');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['node_modules', 'dist', '**/*.d.ts'],
  },
  js.configs.recommended,
  // Prettier recommended config for flat config
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx,js,jsx}', 'demo/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'import/no-unresolved': 'error',
      'import/named': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];
