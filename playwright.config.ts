import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./__tests__",
  use: {
    baseURL: "http://localhost:3000",
  },
};

export default config;
