import { parser } from "./parser.js";
import { printer } from "./printer.js";
import { AST_FORMAT } from "./constants.js";

export const languages = [
  {
    name: "October HTM",
    parsers: [AST_FORMAT],
    extensions: [".htm"],
  },
];

export const parsers = {
  [AST_FORMAT]: parser,
};

export const printers = {
  [AST_FORMAT]: printer,
};

export const options = {
  octoberFormatPhp: {
    type: "boolean",
    category: "October HTM",
    default: true,
    description: "Format the PHP section with @prettier/plugin-php. When false, it is kept verbatim.",
  },
};

export default { languages, parsers, printers, options };