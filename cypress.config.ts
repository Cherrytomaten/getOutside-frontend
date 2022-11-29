import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  retries: 1,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
