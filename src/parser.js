import prettier from 'prettier';

import { AST_FORMAT, FRONT_MATTER } from './constants.js';

const twigPlugin = await import('@zackad/prettier-plugin-twig');
const twigParser = twigPlugin.default.parsers.twig;
const phpPlugin = await import('@prettier/plugin-php');


function findBoundary(text, stopRegex) {
  const stopIdx = text.search(stopRegex);
  const head = stopIdx === -1 ? text : text.slice(0, stopIdx);
  const matches = [...head.matchAll(/(^|\s)==(?=\s|<|\{|$)/g)];
  if (matches.length === 0) {
    return null;
  }
  const last = matches[matches.length - 1];
  return last.index + last[1].length;
}


function splitSections(src) {
  const sep1 = findBoundary(src, /<|\{\{|\{%/);
  if (sep1 === null) {
    return { ini: null, php: null, markup: src };
  }
  const ini = src.slice(0, sep1).trimEnd();
  const rest = src.slice(sep1 + 2).replace(/^[ \t]*\r?\n/, '');

  if (!/^<\?/.test(rest)) {
    return { ini, php: null, markup: rest };
  }

  const sep2 = findBoundary(rest, /<(?!\?)|\{\{|\{%/);
  if (sep2 === null) {
    return { ini, php: null, markup: rest };
  }
  return {
    ini,
    php: rest.slice(0, sep2).trim(),
    markup: rest.slice(sep2 + 2).replace(/^[ \t]*\r?\n/, '')
  };
}


function tokenizeIni(text) {
  let i = 0;
  const n = text.length;
  const isSpace = (c) => c === ' ' || c === '\t' || c === '\n' || c === '\r';
  const skipSpace = () => {
    while (i < n && isSpace(text[i])) i++;
  };
  const readQuoted = () => {
    const quote = text[i];
    let out = quote;
    i++;
    while (i < n) {
      const c = text[i];
      out += c;
      i++;
      if (c === '\\' && i < n) {
        out += text[i];
        i++;
        continue;
      }
      if (c === quote) return out;
    }
    throw new Error('unterminated string');
  };
  const readBracket = () => {
    let depth = 0;
    let out = '';
    while (i < n) {
      const c = text[i];
      if (c === '"' || c === "'") {
        out += readQuoted();
        continue;
      }
      out += c;
      if (c === '[') depth++;
      if (c === ']') {
        depth--;
        i++;
        if (depth === 0) return out;
        continue;
      }
      i++;
    }
    throw new Error('unterminated bracket');
  };
  const readBare = () => {
    let out = '';
    while (i < n && !isSpace(text[i])) {
      out += text[i];
      i++;
    }
    if (out === '') throw new Error('expected a value');
    return out;
  };

  const readLine = () => {
    let out = '';
    while (i < n && text[i] !== '\n') {
      out += text[i];
      i++;
    }
    return out.trimEnd();
  };

  const statements = [];
  for (;;) {
    skipSpace();
    if (i >= n) break;
    if (text[i] === '#' || text[i] === ';') {
      statements.push({ type: 'comment', text: readLine() });
      continue;
    }
    if (text[i] === '[') {
      statements.push({ type: 'section', text: readBracket() });
      continue;
    }
    let key = '';
    while (i < n && /[A-Za-z0-9_.-]/.test(text[i])) {
      key += text[i];
      i++;
    }
    if (key === '') throw new Error('unexpected character');
    skipSpace();
    if (text[i] !== '=') throw new Error('expected "="');
    i++;
    skipSpace();
    const c = text[i];
    const value = c === '"' || c === "'" ? readQuoted() : c === '[' ? readBracket() : readBare();
    statements.push({ type: 'pair', key, value });
  }
  return statements;
}

function formatIni(ini) {
  const trimmed = ini.trim();
  if (trimmed === '') {
    return ini;
  }
  try {
    const statements = tokenizeIni(trimmed);
    const lines = [];
    for (const statement of statements) {
      if (statement.type === 'section') {
        if (lines.length > 0) lines.push('');
        lines.push(statement.text);
      } else if (statement.type === 'comment') {
        lines.push(statement.text);
      } else {
        lines.push(`${statement.key} = ${statement.value}`);
      }
    }
    return lines.join('\n');
  } catch {
    return ini;
  }
}

async function formatPhp(php, options) {
  const trimmed = php.trim();
  if (!trimmed.startsWith('<?')) {
    return php;
  }
  // @prettier/plugin-php only parses the full `<?php` open tag; October's
  // short `<?` tag is left untouched otherwise, so swap it in and back out.
  const isShortTag = /^<\?(?!php\b|=)/i.test(trimmed);
  const tagged = isShortTag ? trimmed.replace(/^<\?/, '<?php') : trimmed;
  // A reflowed section can have code right after the open tag on the same
  // line; the php plugin keeps that as-is instead of breaking it onto its
  // own line, so force the break ourselves before formatting.
  const input = tagged.replace(/^<\?php[ \t]*(?!\n)/, '<?php\n');
  try {
    const out = await prettier.format(input, {
      parser: 'php',
      plugins: [phpPlugin],
      printWidth: options.printWidth,
      tabWidth: options.tabWidth,
      useTabs: options.useTabs,
      endOfLine: options.endOfLine,
      singleQuote: options.singleQuote,
      phpVersion: options.phpVersion,
      trailingCommaPHP: options.trailingCommaPHP,
      braceStyle: options.braceStyle
    });
    const result = out.trimEnd();
    return isShortTag ? result.replace(/^<\?php/, '<?') : result;
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

    const formattedPhp = php === null || options.octoberFormatPhp === false ? php : await formatPhp(php, options);
    const formattedIni = ini === null || options.octoberFormatIni === false ? ini : formatIni(ini);
    ast[FRONT_MATTER] = ini === null ? null : { ini: formattedIni, php: formattedPhp };
    return ast;
  }
};

export { parser };
