import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]



// Q1. What is the purpose of this ESLint configuration file?
// It defines linting rules and settings for JavaScript and React code to ensure consistent coding standards and catch common bugs during development.

// Q2. What is the role of globals.browser in this config?
// It provides predefined global variables (like window, document, etc.) for browser environments, preventing false undefined variable errors.

// Q3. Why is react-hooks plugin used here?
// To enforce the Rules of Hooks in React:

// Hooks must be called at the top level

// Hooks must be called in functional components or custom hooks

// Q4. What does 'react-refresh/only-export-components' do?
// It ensures only component modules are hot-reloadable when using Vite or React Fast Refresh.
// This avoids memory leaks by warning on unintended exports in HMR-enabled modules.

// Q5. What does 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }] mean?
// It throws an error on unused variables except those that match the pattern starting with uppercase letters or underscores (often used for constants).

// Q6. What is the use of { ignores: ['dist'] } in flat config?
// It tells ESLint to skip linting the dist folder, which usually contains compiled/bundled output not meant for linting.