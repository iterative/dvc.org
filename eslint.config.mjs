import eslint from '@eslint/js'
import json from '@eslint/json'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import * as pluginImportX from 'eslint-plugin-import-x'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
// eslint-disable-next-line import-x/default
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import * as tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/public/**',
      '**/.cache/**',
      '.log/**',
      '**/.yarn/**',
      '**/tmp/**'
    ]
  },
  eslint.configs.recommended,
  json.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser
    },
    rules: {
      'no-useless-escape': 'warn',
      'no-tabs': [
        'error',
        {
          allowIndentationTabs: true
        }
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase']
        },
        {
          selector: 'variableLike',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow'
        }
      ],
      '@typescript-eslint/no-unused-vars': 'error'
    }
  },
  pluginImportX.flatConfigs.recommended,
  pluginImportX.flatConfigs.typescript,
  {
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: './tsconfig.json',
          alwaysTryTypes: true // Always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        })
      ]
    },
    rules: {
      'import-x/prefer-default-export': 'off',
      'import-x/extensions': [
        'error',
        'ignorePackages',
        { ts: 'never', tsx: 'never', js: 'never', jsx: 'never' }
      ],
      'import-x/order': [
        'error',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object'
          ],
          pathGroups: [
            {
              pattern: '@/components/**',
              group: 'external',
              position: 'after'
            },
            { pattern: '@/composites/**', group: 'external', position: 'after' }
          ],
          'newlines-between': 'always'
        }
      ]
    }
  },
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  eslintPluginReactHooks.configs['recommended-latest'],
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: {
      react
    },
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off'
    }
  },
  // JavaScript-specific rules
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  eslintPluginPrettierRecommended
)
