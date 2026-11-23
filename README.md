<p align="center">
  <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 512 512" fill="none">
    <defs>
      <linearGradient id="paper" x1="112" y1="74" x2="389" y2="431" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF"/>
        <stop offset="1" stop-color="#D9DCE8"/>
      </linearGradient>
      <linearGradient id="leaf" x1="267" y1="399" x2="445" y2="256" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F04B18"/>
        <stop offset=".52" stop-color="#FF6A1A"/>
        <stop offset="1" stop-color="#FF9A1F"/>
      </linearGradient>
      <linearGradient id="cyan" x1="140" y1="174" x2="300" y2="174" gradientUnits="userSpaceOnUse">
        <stop stop-color="#17D8D3"/><stop offset="1" stop-color="#23C7D9"/>
      </linearGradient>
      <linearGradient id="pink" x1="140" y1="236" x2="333" y2="236" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F45C8B"/><stop offset="1" stop-color="#F13E70"/>
      </linearGradient>
    </defs>
    <path d="M155 76H315L393 154V366C393 391.4 372.4 412 347 412H155C129.6 412 109 391.4 109 366V122C109 96.6 129.6 76 155 76Z" stroke="url(#paper)" stroke-width="20" stroke-linejoin="round"/>
    <path d="M315 78V126C315 142.6 328.4 156 345 156H390" stroke="url(#paper)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="151" y="163" width="157" height="22" rx="11" fill="url(#cyan)"/>
    <rect x="151" y="207" width="119" height="22" rx="11" fill="#FFC328"/>
    <rect x="151" y="251" width="190" height="22" rx="11" fill="url(#pink)"/>
    <rect x="151" y="295" width="144" height="22" rx="11" fill="#A86BE8"/>
    <rect x="151" y="339" width="122" height="22" rx="11" fill="#21CFCB"/>
    <path d="M286 430C268 389 273 341 301 301C330 260 383 235 445 226C448 286 437 335 411 369C386 401 339 413 286 430Z" fill="url(#leaf)"/>
    <path d="M286 430C295 376 329 324 400 263" stroke="#202431" stroke-width="12" stroke-linecap="round"/>
    <path d="M286 430C282 402 283 379 291 356" stroke="#202431" stroke-width="7" stroke-linecap="round"/>
    <path d="M406 107C409 124 416 131 433 134C416 137 409 144 406 161C403 144 396 137 379 134C396 131 403 124 406 107Z" fill="#FF9A1F"/>
    <path d="M448 165C450 176 455 181 466 183C455 185 450 190 448 201C446 190 441 185 430 183C441 181 446 176 448 165Z" fill="#FFC328"/>
  </svg>
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
