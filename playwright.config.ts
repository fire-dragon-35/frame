import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './apps/playground/e2e',
  webServer: {
    command: 'pnpm --filter @frame/playground dev --port 5199',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: 'http://localhost:5199' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
