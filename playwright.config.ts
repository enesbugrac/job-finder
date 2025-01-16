import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./__tests__",
  timeout: 60000,
  use: {
    baseURL: "http://localhost:3000",
    actionTimeout: 15000,
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    timeout: 120000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
};

export default config;
