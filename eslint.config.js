import globals from 'globals';
import pluginJs from '@eslint/js';
import { configs as litConfigs } from 'eslint-plugin-lit';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  pluginJs.configs.recommended, // ESLint recommended
  litConfigs['flat/recommended'], // Lit recommended
  {
    files: ['**/*.js'],
    plugins: {
      prettier: eslintPluginPrettier, // Add Prettier plugin
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          tabWidth: 2,
          useTabs: false,
          singleQuote: true,
          semi: true,
          trailingComma: 'es5',
          printWidth: 140,
        },
      ],
      ...eslintConfigPrettier.rules, // Disable conflicting ESLint rules
      'lit/attribute-value-entities': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['~', './src']],
        },
      },
    },
  },
];
