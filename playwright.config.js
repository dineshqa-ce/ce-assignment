const { defineConfig } = require('@playwright/test');
const config = require('../goal/config.json');

// Helper function to generate BrowserStack connection options
function getBrowserStackOptions({ browser, os, osVersion, device, viewport, name }) {
  const capabilities = {
    browser, os, osVersion, device, viewport, name,
    build: 'El-Pais-Tests',
    'browserstack.username': config.BrowserStack_Username,
    'browserstack.accessKey': config.BrowserStack_Key,
  };

  return {
    wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
      JSON.stringify(capabilities)
    )}`,
  };
}

module.exports = defineConfig({
  timeout: 120*1000, // Global timeout for tests
  fullyParallel: true, // Ensures tests run in parallel across workers
  workers: 5, // Number of parallel workers

  use: {
    baseURL: config.BASE_URL,
    screenshot: 'on', // Capture screenshot on failure
    trace: 'on', // Enable tracing for better debugging
  },

  reporter: [
    ['list'],
    ['allure-playwright'],
  ],

  projects: [
    {
      name: 'Chrome @ BrowserStack',
      use: {
        browserName: 'chromium',
        headless: false,
        channel: 'chrome',
        connectOptions: getBrowserStackOptions({
          browser: 'chrome',
          os: 'Windows',
          osVersion: '10',
          name: 'El Pais Opinion Test - Chrome',
        }),
      },
    },

    {
      name: 'Firefox @ BrowserStack',
      use: {
        browserName: 'firefox',
        headless: false,
        connectOptions: getBrowserStackOptions({
          browser: 'firefox',
          os: 'Windows',
          osVersion: '10',
          name: 'El Pais Opinion Test - Firefox',
        }),
      },
    },

    {
      name: 'Safari @ BrowserStack',
      use: {
        browserName: 'webkit',
        headless: false,
        connectOptions: getBrowserStackOptions({
          browser: 'safari',
          os: 'OS X',
          osVersion: 'Monterey',
          name: 'El Pais Opinion Test - Safari',
        }),
      },
    },

    {
      name: 'Mobile Safari @ BrowserStack',
      use: {
        browserName: 'webkit',
        viewport: { width: 375, height: 812 },
        connectOptions: getBrowserStackOptions({
          device: 'iPhone 12',
          os: 'iOS',
          osVersion: '14.0',
          name: 'El Pais Opinion Test - Mobile Safari',
        }),
      },
    },
  ],
});
