# Markdown Parser

## Overview

This project, `markdown-parser`, is a library for converting markdown to HTML as wasm.  

The markdown notation follows library, [pulldown-cmark](https://docs.rs/pulldown-cmark/latest/pulldown_cmark/), definition by default, and additionally supports "Yaml frontmatter" like following notation.

```
---
Date: yyyy-mm-dd
Title: A blog title
Tags: ["tagA", "tagB", "tagC"]
---
```

Following properties are supported.

- Date: `yyyy-mm-dd`
- Title: string
- Tags: string array

## How to use

1. Just run `build-parser.sh` at the root directory, so the library is built and the built files are automatically put to `/scripts/lib`.
1. Import functions from the `lib/markdown_parser.js`.
    ```javascript
    import init, { markdown_to_html } from '../lib/markdown_parser.js';
    ```
1. Call `markdown_to_html` after initialization.
    ```javascript
    async() => {
      await init();
      return markdown_to_html("# some markdown contents");
    };
    ```
