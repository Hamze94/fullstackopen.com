import globals from "globals";
import { defineConfig } from "eslint/config";
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default defineConfig([
  js.configs.recommended,
  {
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node } },
  {
    ignores: ['dist/**'],
  },

]);
