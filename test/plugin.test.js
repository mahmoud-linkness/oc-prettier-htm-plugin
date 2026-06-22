import prettier from "prettier";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const fixture = fileURLToPath(new URL("./fixtures/index.htm", import.meta.url));
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

  // PHP section is reformatted: brace on its own line, indented body.
  expect(out).toContain("function onInit()\n{\n");
  expect(out).toContain('  if (get_class($this->item) == "OFFLINE\\Mall\\Models\\Variant") {');

    const out2 = await prettier.format(out, {
    filepath: fixture,
    plugins: [pluginPath],
  });
  expect(out2).toBe(out);
  });

  const SRC = ["url = \"/\"", "==", "<?php", "    function onInit() {", "$x=1;", "}", "?>", "==", "<div></div>"].join("\n");

  it("formats the PHP section by default", async () => {
    const out = await prettier.format(SRC, { filepath: "x.htm", plugins: [pluginPath] });
    expect(out).toContain("function onInit()\n{\n  $x = 1;");
  });

  it("keeps the PHP section verbatim when octoberFormatPhp is false", async () => {
    const out = await prettier.format(SRC, {
      filepath: "x.htm",
      plugins: [pluginPath],
      octoberFormatPhp: false,
    });
    expect(out).toContain("<?php\n    function onInit() {\n$x=1;\n}\n?>");
  });
});