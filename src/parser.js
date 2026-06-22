
import { AST_FORMAT, FRONT_MATTER } from "./constants.js";

const twigPlugin = await import("@zackad/prettier-plugin-twig");
const twigParser = twigPlugin.default.parsers.twig;

function splitSections(src) {
  const lines = src.split("\n");
  const lastSep = lines.reduce((last, line, i) => (line.trim() === "==" ? i : last), -1);
  if (lastSep === -1) {
    return { head: "", markup: src };
  }
  return {
    head: lines.slice(0, lastSep + 1).join("\n"),
    markup: lines.slice(lastSep + 1).join("\n"),
  };
}

const parser = {
  ...twigParser,
  astFormat: AST_FORMAT,
  parse(text, ...rest) {
    const { head, markup } = splitSections(text);
    const ast = twigParser.parse(markup, ...rest);

    ast[FRONT_MATTER] = head;
    return ast;
  },
};

export { parser };
