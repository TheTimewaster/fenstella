module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:tailwindcss/recommended',
  ],
  rules: {
    'semi': ['warn', 'always'],
    'quotes': ['warn', 'single'],
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
