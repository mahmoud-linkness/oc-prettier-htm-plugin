import { doc } from 'prettier';

import { FRONT_MATTER } from './constants.js';

const twigPlugin = await import('@zackad/prettier-plugin-twig');
const twigPrinter = twigPlugin.default.printers.twig;

const { hardline, join } = doc.builders;

const block = (text) => join(hardline, text.split('\n'));

const printer = {
  ...twigPrinter,
  print(path, options, print) {
    const node = path.node ?? path.getValue();
    const printed = twigPrinter.print(path, options, print);
    const head = node && node[FRONT_MATTER];
    if (!head) return printed;

    const parts = [block(head.ini.trimEnd()), hardline, '=='];
    if (head.php !== null) {
      parts.push(hardline, block(head.php), hardline, '==');
    }
    parts.push(hardline, printed);
    return parts;
  }
};

export { printer };
