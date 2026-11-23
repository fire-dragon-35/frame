import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tooling/vitest.setup.ts'],
    include: [
      'packages/**/*.test.{ts,tsx}',
      'templates/**/*.test.{ts,tsx}',
      'apps/**/*.test.{ts,tsx}',
    ],
    exclude: ['**/node_modules/**', '**/e2e/**'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});
