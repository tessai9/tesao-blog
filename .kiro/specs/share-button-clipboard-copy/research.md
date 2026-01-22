# Research & Design Decisions

## Summary
- **Feature**: `share-button-clipboard-copy`
- **Discovery Scope**: Extension (modifying existing share-button-component.js)
- **Key Findings**:
  - Existing component already has clipboard copy and feedback infrastructure
  - Web Share API requires title attribute to be passed from parent component
  - Both APIs are well-supported in modern browsers with graceful degradation possible

## Research Log

### Web Share API Browser Support
- **Context**: Need to verify Web Share API availability for hybrid approach
- **Sources Consulted**: MDN Web Docs, Can I Use
- **Findings**:
  - `navigator.share()` supported on mobile browsers (iOS Safari, Chrome Android) and some desktop browsers
  - Requires HTTPS context (satisfied by production deployment)
  - Returns a Promise that resolves when share completes or user cancels
  - Accepts `{ title, url, text }` object parameters
- **Implications**: Feature detection via `navigator.share` is reliable; fallback to clipboard is straightforward

### Clipboard API Browser Support
- **Context**: Verify clipboard fallback reliability
- **Sources Consulted**: MDN Web Docs
- **Findings**:
  - `navigator.clipboard.writeText()` has broad support in modern browsers
  - Requires secure context (HTTPS or localhost)
  - Async API returns Promise
- **Implications**: Existing implementation already uses this API correctly

### Article Title Retrieval
- **Context**: How to pass article title to share-button-component
- **Sources Consulted**: Existing codebase analysis
- **Findings**:
  - `article-component.js` parses markdown and extracts title via WASM parser
  - Title not currently exposed to share-button-component
  - Options: (1) pass as attribute, (2) use document.title, (3) query DOM
- **Implications**: Attribute-based approach is cleanest and follows existing patterns

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Attribute passing | Pass title via HTML attribute from parent | Clean API, follows existing url pattern | Requires parent component update | Recommended |
| Document.title query | Read from document.title in share component | No parent changes needed | May not reflect article title accurately | Fallback option |

## Design Decisions

### Decision: Use attribute for title passing
- **Context**: Share button needs article title for Web Share API and clipboard
- **Alternatives Considered**:
  1. Pass title as attribute from article-component
  2. Query document.title directly
  3. Traverse DOM to find title element
- **Selected Approach**: Pass title as attribute (`title` attribute on share-button-component)
- **Rationale**: Consistent with existing `url` attribute pattern; explicit data flow; testable
- **Trade-offs**: Requires article-component modification, but provides cleaner API
- **Follow-up**: Verify title extraction from markdown parser output

### Decision: Hybrid share approach (Web Share API with clipboard fallback)
- **Context**: Need to support both mobile and desktop users effectively
- **Alternatives Considered**:
  1. Clipboard only
  2. Web Share API only
  3. Hybrid with feature detection
- **Selected Approach**: Feature detection - use Web Share API when available, clipboard when not
- **Rationale**: Best UX on both platforms; progressive enhancement aligns with project philosophy
- **Trade-offs**: Slightly more complex logic, but unified user experience
- **Follow-up**: Test on various browsers and devices

## Risks & Mitigations
- Risk: Web Share API may be cancelled by user without error - Mitigation: Handle both resolve and reject cases gracefully
- Risk: Title attribute may be empty or missing - Mitigation: Fallback to document.title or URL-only format
- Risk: Clipboard API may fail on older browsers - Mitigation: Show clear error message to user

## References
- [Web Share API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) — API documentation
- [Clipboard API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) — Clipboard writeText documentation
