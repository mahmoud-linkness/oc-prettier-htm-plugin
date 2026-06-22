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
garbage. This plugin keeps everything up to and including the last `==` line
**verbatim** and formats only the final markup section, delegating to
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
