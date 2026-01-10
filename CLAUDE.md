# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run generate` - Generates `app/articles.json` from markdown files in `app/articles/`
- `./build-parser.sh` - Builds Rust WASM parser (requires wasm-pack and Rust toolchain)

## Deployment Workflow

1. Create/edit markdown file in `app/articles/` with YAML frontmatter
2. Run `npm run generate` to regenerate articles.json
3. Push to master branch

## Architecture

This is a static blog generator with two main parts:

**Frontend (Vanilla JS + Web Components)**
- No frameworks or npm dependencies for frontend code
- Uses Shadow DOM for component encapsulation
- Components: `header-component`, `article-component`, `article-list-component`
- WASM parser loaded asynchronously via ES modules

**Markdown Parser (Rust → WASM)**
- Located in `markdown-parser/`
- Uses pulldown-cmark for markdown parsing
- Custom YAML frontmatter parser (Date, Title, Tags fields)
- Built artifacts go to `app/scripts/lib/`

## Article Format

```yaml
---
Date: YYYY-mm-dd
Title: Blog title
Tags: ["tag1", "tag2"]
---

# Markdown content here
```

## Key Files

- `generate-articles-list.js` - Node script that builds article index JSON
- `markdown-parser/src/lib.rs` - Core parser logic
- `app/scripts/components/` - Web Component implementations
