module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:security/recommended',
  ],
  globals: {
    NodeJS: 'readonly',
  },
  overrides: [{
    files: ['**/*.ts'],
    rules: {
      'security/detect-non-literal-fs-filename': [0],
    },
  }],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: [
    'jest',
    'security',
    'sort-keys-fix',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': [2],
    '@typescript-eslint/no-unused-vars': [2],
    'import/default': [0],
    'import/extensions': [2, {
      json: 'always', // Always require .json extensions
      ts: 'never', // Never require .ts extensions
    }],
    'import/no-named-as-default': [0],
    'import/no-named-as-default-member': [0],
    'import/prefer-default-export': [0],
    'jest/no-disabled-tests': [2],
    'jest/no-focused-tests': [2],
    'jest/no-identical-title': [2],
    'jest/prefer-to-have-length': [2],
    'jest/valid-expect': [2],
    'no-param-reassign': [2, {
      ignorePropertyModificationsFor: ['draft'],
    }],
    quotes: [2, 'single'],
    'security/detect-object-injection': [0],
    'semi': [2],
    'sort-keys-fix/sort-keys-fix': [2],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      // use <root>/tsconfig.json
      typescript: {
        // always try to resolve types under `<roo/>@types`
        // directory even it doesn't contain any source code,
        // like `@types/unist`
        alwaysTryTypes: true,
      },
    },
    react: {
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
                         // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                         // default to latest and warns if missing
                         // It will default to "detect" in the future
    },
  },
};
