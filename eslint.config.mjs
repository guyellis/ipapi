import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import securityPlugin from 'eslint-plugin-security';
import sortKeysFixPlugin from 'eslint-plugin-sort-keys-fix';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', '*.mjs', '*.js'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  jestPlugin.configs['flat/recommended'],
  securityPlugin.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        NodeJS: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
    },
    plugins: {
      import: importPlugin,
      'sort-keys-fix': sortKeysFixPlugin,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': [2],
      '@typescript-eslint/no-unused-vars': [2],
      'import/default': [0],
      'import/extensions': [2, { json: 'always', ts: 'never' }],
      'import/no-named-as-default': [0],
      'import/no-named-as-default-member': [0],
      'import/prefer-default-export': [0],
      'jest/no-disabled-tests': [2],
      'jest/no-focused-tests': [2],
      'jest/no-identical-title': [2],
      'jest/prefer-to-have-length': [2],
      'jest/valid-expect': [2],
      'no-param-reassign': [2, { ignorePropertyModificationsFor: ['draft'] }],
      quotes: [2, 'single'],
      'security/detect-object-injection': [0],
      semi: [2],
      'sort-keys-fix/sort-keys-fix': [2],
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
      jest: { version: 29 },
      react: { version: 'detect' },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'security/detect-non-literal-fs-filename': [0],
    },
  }
);
