# Product Overview

Tesao Blog is a lightweight, static blog platform that renders markdown articles directly in the browser using WebAssembly-powered markdown parsing.

## Core Capabilities

- **Client-side Markdown Rendering**: Articles are stored as markdown files and converted to HTML in the browser using a Rust/WASM parser
- **YAML Frontmatter Support**: Each article includes metadata (title, date, tags) parsed from YAML frontmatter
- **Static Article Index**: A JSON manifest tracks all articles for the listing page
- **Web Components Architecture**: UI built with native Custom Elements (Shadow DOM)

## Target Use Cases

- Personal blogging with minimal infrastructure
- Technical writing with code snippets and formatting
- Diary-style content organized by date

## Value Proposition

Zero-dependency frontend with high-performance markdown rendering via WebAssembly. No build step required for content authoring - just write markdown and regenerate the article index.

---
_Focus on patterns and purpose, not exhaustive feature lists_
