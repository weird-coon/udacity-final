module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/prefer-default-export': 0,
    'no-plusplus': 0,
  },
  globals: {
    APP_ENV: true,
  },
};
