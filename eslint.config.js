import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest';
import pluginSecurity from 'eslint-plugin-security';
import pluginSortKeysFix from 'eslint-plugin-sort-keys-fix';

export default [
  {
    ignores: ['dist/', '.git', 'db/', 'node_modules/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        NodeJS: 'readonly',
      },
    },
  },
  ...tseslint.configs.recommended,
  pluginSecurity.configs.recommended,
  {
    plugins: {
      import: pluginImport,
      jest: pluginJest,
      'sort-keys-fix': pluginSortKeysFix,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'import/default': 'off',
      'import/extensions': ['error', {
        json: 'always',
        ts: 'never',
      }],
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/prefer-default-export': 'off',
      'jest/no-disabled-tests': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'error',
      'jest/valid-expect': 'error',
      'no-param-reassign': ['error', {
        ignorePropertyModificationsFor: ['draft'],
      }],
      quotes: ['error', 'single'],
      'security/detect-object-injection': 'off',
      semi: 'error',
      'sort-keys-fix/sort-keys-fix': 'error',
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
    },
  }
];
