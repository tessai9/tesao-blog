# Technology Stack

## Architecture

Static site with client-side rendering. Markdown-to-HTML conversion happens in the browser via WebAssembly. No server-side processing required.

## Core Technologies

- **Language**: JavaScript (ES Modules), Rust (WASM)
- **Framework**: Vanilla Web Components (Custom Elements)
- **Runtime**: Browser (WASM for markdown parsing)

## Key Libraries

### Frontend
- Native Web Components API (Custom Elements, Shadow DOM)
- ES Modules for script loading

### Markdown Parser (Rust/WASM)
- `pulldown-cmark` - Markdown parsing
- `wasm-bindgen` - Rust/JS interop
- `serde_yaml` - YAML frontmatter parsing
- `chrono` - Date handling

## Development Standards

### Code Quality
- ES Modules (`type: "module"` in package.json)
- Japanese language for UI text and comments
- No build tooling for frontend (direct browser loading)

### File Naming
- Articles: `YYYYMMDD.md` (date-based naming)
- Components: `kebab-case-component.js`

## Development Environment

### Required Tools
- Node.js (for article index generation)
- Rust toolchain with `wasm32-unknown-unknown` target (for parser development)
- `wasm-bindgen-cli` (for WASM binding generation)

### Common Commands
```bash
# Generate article index
node generate-articles-list.js

# Build WASM parser (in markdown-parser/)
wasm-pack build --target web
```

## Key Technical Decisions

- **WASM for Parsing**: Chose Rust/WASM over JavaScript markdown libraries for performance and to leverage pulldown-cmark's robust parsing
- **Web Components**: Native Custom Elements over frameworks for simplicity and zero dependencies
- **Static JSON Index**: Pre-generated article list avoids runtime directory scanning

---
_Document standards and patterns, not every dependency_
