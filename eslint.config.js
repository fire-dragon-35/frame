import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/database.types.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  // Architecture boundaries (see FRAME.md §3, §9)
  {
    files: ['packages/core/src/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['@frame/ui', '@frame/themes', '@frame/ui/*', '@frame/themes/*'] },
      ],
    },
  },
  {
    files: ['packages/themes/src/**'],
    rules: { 'no-restricted-imports': ['error', { patterns: ['@frame/ui', '@frame/core'] }] },
  },
  {
    files: ['packages/site/src/**'],
    rules: { 'no-restricted-imports': ['error', { patterns: ['@frame/themes'] }] },
  },
  {
    files: ['packages/ui/src/**'],
    rules: { 'no-restricted-imports': ['error', { patterns: ['@frame/themes'] }] },
  },
  {
    files: ['packages/**/src/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='style']",
          message: 'Inline styles are not allowed in Frame packages. Use CSS Modules + tokens.',
        },
      ],
    },
  },
);
