import prettier from "prettier";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

import { describe, expect, it } from "vitest";

const pluginPath = fileURLToPath(new URL("../src/index.js", import.meta.url));
const read = (name) => readFileSync(fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url)), "utf8");
const format = (src, opts = {}) =>
  prettier.format(src, { filepath: "x.htm", plugins: [pluginPath], ...opts });

// Split the same way the plugin does: lines that are exactly `==`.
function sections(src) {
  const lines = src.split("\n");
  const first = lines.findIndex((l) => l.trim() === "==");
  if (first === -1) return { ini: null, php: null, markup: src };
  const rest = lines.slice(first + 1);
  const second = rest.findIndex((l) => l.trim() === "==");
  const ini = lines.slice(0, first).join("\n");
  if (second === -1) return { ini, php: null, markup: rest.join("\n") };
  return { ini, php: rest.slice(0, second).join("\n"), markup: rest.slice(second + 1).join("\n") };
}

const cases = [
  { file: "with-php.htm", hasFrontMatter: true, hasPhp: true },
  { file: "without-php.htm", hasFrontMatter: true, hasPhp: false },
  { file: "markup-only.htm", hasFrontMatter: false, hasPhp: false },
];

describe("Prettier October HTM plugin", () => {
  for (const { file, hasFrontMatter, hasPhp } of cases) {
    describe(file, () => {
      const src = read(file);

      it("is idempotent", async () => {
        const out = await format(src);
        const out2 = await format(out);
        expect(out2).toBe(out);
      });

      it(hasFrontMatter ? "normalizes the INI section" : "adds no front matter", async () => {
        const out = await format(src);
        if (hasFrontMatter) {
          expect(out.startsWith(sections(src).ini + "\n==\n")).toBe(true);
        } else {
          expect(out.includes("\n==\n")).toBe(false);
        }
      });

      if (hasFrontMatter) {
        it("keeps the INI section verbatim when octoberFormatIni is false", async () => {
          const out = await format(src, { octoberFormatIni: false });
          expect(sections(out).ini).toBe(sections(src).ini);
        });
      }

      if (file === "markup-only.htm") {
        it("keeps a twig tag's key=value attributes on one line (zackad/prettier-plugin-twig#153)", async () => {
          const out = await format(src);
          expect(out).toContain("{% component 'tinyMCE' file = 'x' class = 'y' %}");
        });
      }

      if (hasPhp) {
        it("formats the PHP section by default", async () => {
          // Brace moves to its own line: proof of formatting regardless of the
          // fixture's on-disk state (it may get reformatted on save).
          const out = await format(src);
          expect(sections(out).php).toContain("function onInit()\n{\n");
        });

        it("keeps the PHP section verbatim when octoberFormatPhp is false", async () => {
          const out = await format(src, { octoberFormatPhp: false });
          expect(sections(out).php).toBe(sections(src).php);
        });
      }
    });
  }

  describe("broken.htm", () => {
    const src = read("broken.htm");

    it("recovers the ini/markup boundary and inserts a clean `==` separator", async () => {
      const out = await format(src);
      expect(out).toContain('\n==\n<section class="container-fluid');
      expect(out.startsWith('url = "/cookie-policy"')).toBe(true);
    });

    it("reflows the squashed ini keys to one per line", async () => {
      const out = await format(src);
      expect(out).toContain(
        [
          'url = "/cookie-policy"',
          'layout = "default"',
          'title = "Cookie Policy"',
          "seoOptionsEnabledInSitemap = 0",
          "seoOptionsUseUpdatedAt = 0",
          'seoOptionsRobotIndex = "noindex"',
          'seoOptionsRobotFollow = "nofollow"',
          'seoOptionsOgCard = "summary_large_image"'
        ].join("\n")
      );
    });

    it("is idempotent", async () => {
      const out = await format(src);
      const out2 = await format(out);
      expect(out2).toBe(out);
    });
  });

  describe("broken-with-php.htm", () => {
    const src = read("broken-with-php.htm");

    it("recovers ini, php and markup as three clean sections", async () => {
      const out = await format(src);
      expect(out.startsWith('url = "/"\nlayout = "default"')).toBe(true);
      expect(out).toContain('\n==\n<?');
      expect(out).toContain('function onInit()\n{\n');
      expect(out).toContain('\n==\n<section>');
    });

    it("is idempotent", async () => {
      const out = await format(src);
      const out2 = await format(out);
      expect(out2).toBe(out);
    });
  });

  describe("broken-reversed.htm", () => {
    const src = read("broken-reversed.htm");

    it("recovers ini, php and markup as three clean sections", async () => {
      const out = await format(src);
      expect(out.startsWith('url = "/"\nlayout = "default"\ntitle = "Home"')).toBe(true);
      expect(out).toContain('\n==\n<?');
      expect(out).toContain('function onInit()\n{\n');
      expect(out).toContain('\n==\n<section>');
    });

    it("is idempotent", async () => {
      const out = await format(src);
      const out2 = await format(out);
      expect(out2).toBe(out);
    });
  });

  describe("ini comments", () => {
    const src = ['## leftover heading junk url = "/"', 'layout = "default" title = "Home"', '==', '<div></div>'].join(
      "\n"
    );

    it("keeps the comment line and still reflows the rest", async () => {
      const out = await format(src);
      expect(out.startsWith('## leftover heading junk url = "/"\nlayout = "default"\ntitle = "Home"\n==\n')).toBe(
        true
      );
    });
  });
});
