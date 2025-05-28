const eslint = require('@eslint/js')
const json = require('@eslint/json')
const eslintPluginImport = require('eslint-plugin-import')
const nodePlugin = require('eslint-plugin-n')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const globals = require('globals')

module.exports = [
  { ignores: ['**/node_modules', '**/.yarn/**'] },
  { plugins: { json } },
  eslint.configs.recommended,
  nodePlugin.configs['flat/recommended-script'],
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },

      ecmaVersion: 'latest',
      sourceType: 'module'
    },

    rules: {
      'no-tabs': ['error', { allowIndentationTabs: true }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-process-exit': 'warn',
      'import/extensions': [
        'error',
        'ignorePackages',
        { js: 'never', jsx: 'never' }
      ]
    }
  }
]
