import prettier from "prettier";

import { AST_FORMAT, FRONT_MATTER } from "./constants.js";

const twigPlugin = await import("@zackad/prettier-plugin-twig");
const twigParser = twigPlugin.default.parsers.twig;
const phpPlugin = await import("@prettier/plugin-php");

// October .htm files have up to three `==`-separated sections:
// [INI configuration] == [PHP] == [Twig + HTML markup].
function splitSections(src) {
  const lines = src.split("\n");
  const firstSep = lines.findIndex((line) => line.trim() === "==");
  if (firstSep === -1) {
    return { ini: null, php: null, markup: src };
  }
  const rest = lines.slice(firstSep + 1);
  const secondRel = rest.findIndex((line) => line.trim() === "==");
  const ini = lines.slice(0, firstSep).join("\n");
  if (secondRel === -1) {
    return { ini, php: null, markup: rest.join("\n") };
  }
  return {
    ini,
    php: rest.slice(0, secondRel).join("\n"),
    markup: rest.slice(secondRel + 1).join("\n"),
  };
}

async function formatPhp(php, options) {
  const trimmed = php.trim();
  if (!trimmed.startsWith('<?')) {
    return php;
  }
  try {
    const out = await prettier.format(trimmed, {
      parser: "php",
      plugins: [phpPlugin],
      printWidth: options.printWidth,
      tabWidth: options.tabWidth,
      useTabs: options.useTabs,
      endOfLine: options.endOfLine,
      singleQuote: options.singleQuote,
      phpVersion: options.phpVersion,
      trailingCommaPHP: options.trailingCommaPHP,
      braceStyle: options.braceStyle,
    });
    return out.trimEnd();
  } catch {
    return php;
  }
}

const parser = {
  ...twigParser,
  astFormat: AST_FORMAT,
  async parse(text, ...rest) {
    const options = rest[rest.length - 1];
    const { ini, php, markup } = splitSections(text);
    const ast = await twigParser.parse(markup, ...rest);

    const formattedPhp =
      php === null || options.octoberFormatPhp === false ? php : await formatPhp(php, options);
    ast[FRONT_MATTER] = ini === null ? null : { ini, php: formattedPhp };
    return ast;
  },
};

export { parser };
