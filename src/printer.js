import { doc } from "prettier";
import { FRONT_MATTER } from "./constants.js";

const twigPlugin = await import("@zackad/prettier-plugin-twig");
const twigPrinter = twigPlugin.default.printers.twig;

const { hardline, join } = doc.builders;

const printer = {
  ...twigPrinter,
  print(path, options, print) {
    const node = path.node ?? path.getValue();
    const printed = twigPrinter.print(path, options, print);
    const head = node && node[FRONT_MATTER];
    if (head === undefined || head === null) return printed;
    if (head === "") return printed;
    const headDoc = join(hardline, head.split("\n"));
    return [headDoc, hardline, printed];
  },
};

export { printer };