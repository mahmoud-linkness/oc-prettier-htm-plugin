<p align="center">
  <img src="./oc-prettier.svg" alt="oc-prettier-htm-plugin logo" width="160" height="160" />
</p>
<h1 align="center">oc-prettier-htm-plugin</h1>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](package.json)
[![Prettier](https://img.shields.io/badge/prettier-3.x-F7B93E?logo=prettier&logoColor=white)](https://prettier.io)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/mahmoud-linkness/oc-prettier-htm-plugin/pulls)

Prettier plugin to format [October CMS](https://octobercms.com/) `.htm` templates.

October `.htm` files have up to three sections separated by lines containing
only `==`:

```
[INI configuration]
==
[optional PHP]
==
[Twig + HTML markup]
```

Vanilla Prettier (and the Twig plugin) collapse the INI/PHP front matter into
garbage. This plugin handles each section appropriately:

- the **INI configuration** is kept verbatim,
- the **PHP** section is formatted with
  [`@prettier/plugin-php`](https://github.com/prettier/plugin-php),
- the **Twig + HTML markup** is formatted with
  [`@zackad/prettier-plugin-twig`](https://github.com/zackad/prettier-plugin-twig).

## Install

```bash
npm install --save-dev git+https://github.com/mahmoud-linkness/oc-prettier-htm-plugin.git#v0.1.0
```

## Usage

```jsonc
// .prettierrc.json
{
  "plugins": ["oc-prettier-htm-plugin"]
}
```

Then `.htm` files are formatted like any other file:

```bash
prettier --write "**/*.htm"
```

## Options

| Option             | Type      | Default | Description                                                              |
| ------------------ | --------- | ------- | ------------------------------------------------------------------------ |
| `octoberFormatPhp` | `boolean` | `true`  | Format the PHP section. When `false`, the PHP section is kept verbatim.  |

The options from the delegated plugins are re-exported, so they work too:

- Twig markup: `twigAlwaysBreakObjects`, `twigSingleQuote`, `twigMultiTags`, etc.
  (see [`@zackad/prettier-plugin-twig`](https://github.com/zackad/prettier-plugin-twig)).
- PHP section: `phpVersion`, `trailingCommaPHP`, `braceStyle`
  (see [`@prettier/plugin-php`](https://github.com/prettier/plugin-php)).

```jsonc
// .prettierrc.json
{
  "plugins": ["oc-prettier-htm-plugin"],
  "octoberFormatPhp": false
}
```
