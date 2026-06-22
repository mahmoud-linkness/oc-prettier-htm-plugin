import { resolve } from "path";
import { URL, fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
      test: resolve(__dirname, "test")
    }
  },
  test: {
    dir: "test",
    include: ["**/*.test.js"]
  }
});