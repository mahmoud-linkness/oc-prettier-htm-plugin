# oc-prettier-htm-plugin

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
TODO
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

```jsonc
// .prettierrc.json
{
  "plugins": ["oc-prettier-htm-plugin"],
  "octoberFormatPhp": false
}
```
