// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    node: true,
  },
  'parserOptions': {
    'sourceType': 'script',
  },
  extends: 'airbnb-base',
  // add your custom rules here
  'rules': {
    'import/extensions': ['error', 'always', {
      'js': 'never',
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-console': 0,
    'no-unused-vars': ["error", { "argsIgnorePattern": "^_" }],
  }
};
