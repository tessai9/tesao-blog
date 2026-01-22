# Research & Design Decisions: Share Button Component

---
**Purpose**: Capture discovery findings, architectural investigations, and rationale that inform the technical design.
---

## Summary
- **Feature**: `share-button-component`
- **Discovery Scope**: Extension (Refactoring/Extraction)
- **Key Findings**:
  - The share button functionality already exists within `article-component.js`.
  - The logic (clipboard interaction, feedback timeout, event handling) is self-contained and suitable for extraction.
  - The visual style is defined in `article-component.js` shadow DOM and can be migrated directly.
  - No new external dependencies are required; `navigator.clipboard` is sufficient.

## Research Log

### Existing Implementation Analysis
- **Context**: extracting logic from `article-component.js` to `share-button-component.js`.
- **Sources Consulted**: `app/scripts/components/article-component.js`.
- **Findings**:
  - **HTML**: Uses a `<button>` with an SVG icon and a `<span>` for the label. A separate `<span>` is used for feedback.
  - **CSS**: Scoped styles for `.share-button` (hover/focus states) and `.share-feedback` (opacity transition).
  - **Logic**: `_handleShareClick` writes to clipboard. `_showFeedback` manages a 2-second timeout to hide the success/error message.
  - **Cleanup**: `disconnectedCallback` ensures the timeout is cleared.
- **Implications**: The new component should essentially wrap this existing logic, exposing a `url` attribute to make the target link configurable (Requirement 2).

### Web Component Structure
- **Context**: Defining the new custom element.
- **Findings**:
  - Needs to extend `HTMLElement`.
  - Must use `attachShadow({ mode: 'open' })`.
  - Should observe `url` attribute changes via `attributeChangedCallback` (though for this simple case, reading on click or getter might suffice, observing ensures reactivity).
- **Implications**: Standard Web Component lifecycle methods (`connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`) will be used.

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| **Standalone Custom Element** | Encapsulated logic/styles in a single file | reusable, isolation, standard-compliant | None | **Selected Approach** |
| Logic Mixin | Shared JS class/mixin for logic only | code reuse | doesn't solve UI duplication | Rejected |

## Design Decisions

### Decision: Attribute-based Configuration
- **Context**: The component needs to know what URL to copy.
- **Selected Approach**: Use a `url` attribute. If missing, default to `window.location.href`.
- **Rationale**: Follows standard HTML element patterns (`<a href="...">`). Makes the component declarative and easy to test.
- **Trade-offs**: Requires observing attributes if dynamic updates are needed (unlikely for article pages but good practice).

### Decision: Internal State for Feedback
- **Context**: User needs feedback ("Copied!") after clicking.
- **Selected Approach**: Manage feedback state (visible/hidden, success/error) internally within the component's Shadow DOM.
- **Rationale**: The feedback is UI-centric and transient; it doesn't need to be exposed to the parent component. Keeps the interface clean.

### Decision: Style Migration
- **Context**: Ensuring visual consistency.
- **Selected Approach**: Copy relevant CSS from `article-component.js` to `share-button-component.js`.
- **Rationale**: `article-component.js` styles are currently scoped to its shadow root. To reuse them in a shadow-dom encapsulated child, they must be duplicated or imported. Duplication is simpler for this standalone component to avoid build steps or complex CSS sharing strategies in a vanilla JS setup.

## Risks & Mitigations
- **Risk**: `navigator.clipboard` requires a secure context (HTTPS) or localhost.
  - **Mitigation**: This is a browser limitation. The current app implementation already assumes this environment. Error handling in the component will catch failures (e.g., permission denied) and show the error feedback.
