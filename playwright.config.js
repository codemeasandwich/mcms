const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src/__tests__/e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
