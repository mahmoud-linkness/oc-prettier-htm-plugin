import prettier from "prettier";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const fixture = fileURLToPath(new URL("./fixtures/home.htm", import.meta.url));
const pluginPath = fileURLToPath(new URL("../src/index.js", import.meta.url));

import { describe, expect, it } from "vitest";

describe("Prettier October HTM plugin", () => {
  it("formats October HTM and preserves front matter idempotently", async () => {
  const src = readFileSync(fixture, "utf8");
  const out = await prettier.format(src, {
    filepath: fixture,
    plugins: [pluginPath],
  });

  expect(out.startsWith(src.split("\n==\n")[0] + "\n==\n")).toBe(true);

    const out2 = await prettier.format(out, {
    filepath: fixture,
    plugins: [pluginPath],
  });
  expect(out2).toBe(out);
  });
});