# Project Structure

## Organization Philosophy

Flat, purpose-based organization. Frontend assets in `app/`, build tooling at root level, WASM parser in dedicated subdirectory.

## Directory Patterns

### Frontend Application (`app/`)
**Location**: `/app/`
**Purpose**: All browser-served static files
**Contents**: HTML pages, CSS, JavaScript components, article markdown files

### Web Components (`app/scripts/components/`)
**Location**: `/app/scripts/components/`
**Purpose**: Custom Element definitions
**Pattern**: One component per file, `kebab-case-component.js` naming
**Example**: `article-component.js`, `header-component.js`

### Utilities (`app/scripts/utils/`)
**Location**: `/app/scripts/utils/`
**Purpose**: Helper functions shared across components
**Example**: `date.js` for date formatting

### Libraries (`app/scripts/lib/`)
**Location**: `/app/scripts/lib/`
**Purpose**: Third-party or compiled dependencies (WASM modules)
**Example**: `markdown_parser.js`, `markdown_parser_bg.wasm`

### Articles (`app/articles/`)
**Location**: `/app/articles/`
**Purpose**: Markdown content files
**Pattern**: `YYYYMMDD.md` naming, YAML frontmatter required

### Markdown Parser (`markdown-parser/`)
**Location**: `/markdown-parser/`
**Purpose**: Rust crate compiled to WASM
**Build Output**: Copied to `app/scripts/lib/` after `wasm-pack build`

## Naming Conventions

- **Article Files**: `YYYYMMDD.md` (8-digit date)
- **Components**: `kebab-case-component.js`
- **HTML Pages**: Lowercase, descriptive (`index.html`, `article.html`)
- **CSS**: Single global stylesheet (`style.css`)

## Import Organization

```javascript
// WASM module imports
import init, { markdown_to_html } from '../lib/markdown_parser.js';

// Relative imports for local utilities
import { formatDate } from '../utils/date.js';
```

**No path aliases** - direct relative imports throughout.

## Code Organization Principles

- Components are self-contained with encapsulated styles (Shadow DOM)
- WASM initialization is lazy-loaded per component that needs it
- Article metadata flows from frontmatter through JSON index to components
- No shared state management - each component fetches its own data

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
