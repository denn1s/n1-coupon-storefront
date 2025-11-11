import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default tseslint.config(
  { ignores: ['dist', 'storybook-static'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@tanstack/query': pluginQuery,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...pluginQuery.configs.recommended.rules,

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^React$',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Enforce single quotes in JS, double quotes in JSX
      quotes: ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-double'],

      // No semicolons
      semi: ['error', 'never'],

      // Disable React in JSX scope warning (React 17+)
      'react/react-in-jsx-scope': 'off',

      // Your existing react-refresh rule
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)

