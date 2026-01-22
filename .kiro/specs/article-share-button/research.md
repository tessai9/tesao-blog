# Research & Design Decisions

## Summary
- **Feature**: `article-share-button`
- **Discovery Scope**: Extension (adding share functionality to existing `article-component`)
- **Key Findings**:
  - Clipboard API (`navigator.clipboard.writeText`) has excellent browser support and is the modern standard
  - The existing `article-component` uses Shadow DOM with encapsulated styles - share button will follow the same pattern
  - HTTPS/localhost requirement is satisfied (static site deployment context)

## Research Log

### Clipboard API Browser Support
- **Context**: Need to verify browser compatibility for copy-to-clipboard functionality
- **Sources Consulted**:
  - [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
  - [MDN Clipboard.writeText()](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)
  - [Can I Use - Clipboard writeText](https://caniuse.com/mdn-api_clipboard_writetext)
- **Findings**:
  - `navigator.clipboard.writeText()` is widely supported in all modern browsers
  - Requires secure context (HTTPS or localhost)
  - Returns a Promise - allows async/await error handling
  - Must be triggered by user gesture (click event satisfies this)
  - Window must have focus for the operation to succeed
- **Implications**: No fallback mechanism needed for modern browsers; error handling should cover edge cases (permission denied, unfocused window)

### Existing Component Architecture
- **Context**: Understand integration approach with current `article-component`
- **Sources Consulted**: `app/scripts/components/article-component.js`
- **Findings**:
  - Component uses Shadow DOM with `mode: 'open'`
  - Styles are encapsulated within component template
  - `_render()` method generates all HTML including navigation link
  - URL is available via `window.location.href`
  - Japanese UI text pattern established (e.g., "記事一覧に戻る")
- **Implications**: Share button and feedback message should be added within `_render()` method; styles should match existing patterns

### SVG Icon Approach
- **Context**: Requirements specify inline SVG icon with text label
- **Sources Consulted**: Common share icon patterns
- **Findings**:
  - Inline SVG avoids external dependencies and HTTP requests
  - Standard share icon uses arrow-out-of-box or link symbol
  - SVG can be styled with CSS to match existing color scheme (#333, #444)
  - `aria-hidden="true"` on decorative SVG when text label is present
- **Implications**: Use simple inline SVG path; keep icon small (16-20px) to match text

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Inline in ArticleComponent | Add share button directly in existing component's `_render()` | Simple, no new files, follows existing pattern | Increases component complexity slightly | Recommended - matches project's minimal approach |
| Separate ShareButton Component | Create new Web Component for share functionality | Reusable, encapsulated | Over-engineering for single use case | Not recommended for this scope |

## Design Decisions

### Decision: Inline Share Button in ArticleComponent
- **Context**: Need to add share functionality with minimal architectural changes
- **Alternatives Considered**:
  1. Separate `share-button-component.js` - full encapsulation but unnecessary complexity
  2. Inline button in `article-component.js` - simple, follows existing patterns
- **Selected Approach**: Add button element and click handler directly in `article-component.js`
- **Rationale**: Project follows minimal-dependency philosophy; share button is article-specific and unlikely to be reused elsewhere
- **Trade-offs**: Slightly larger component file vs. simpler architecture
- **Follow-up**: Monitor if share functionality is needed elsewhere to justify extraction

### Decision: State-Based Feedback Display
- **Context**: Need to show success/error message temporarily after copy action
- **Alternatives Considered**:
  1. Replace button text temporarily
  2. Show separate status element
  3. Use browser tooltip/notification
- **Selected Approach**: Show separate status element that auto-hides after 2 seconds
- **Rationale**: Clear visual feedback without disrupting button state; matches Japanese UI text pattern
- **Trade-offs**: Requires state management for visibility timeout
- **Follow-up**: Ensure timeout is cleared on component disconnect

## Risks & Mitigations
- **Risk**: Clipboard API fails silently in some edge cases (unfocused window)
  - **Mitigation**: Wrap in try/catch, display error message to user
- **Risk**: HTTPS requirement not met in development
  - **Mitigation**: localhost is allowed; document requirement for deployment
- **Risk**: Screen reader announcement timing
  - **Mitigation**: Use `aria-live="polite"` to announce without interrupting

## References
- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) - Official API documentation
- [MDN Clipboard.writeText()](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) - Method specification
- [web.dev Copy Text Pattern](https://web.dev/patterns/clipboard/copy-text) - Best practices for clipboard operations
