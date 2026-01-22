# Implementation Plan

## Task Format Template

### Major task only
- [x] 1. Create Share Button Component (P)
  - Create file `app/scripts/components/share-button-component.js`
  - Define custom element `share-button-component` extending `HTMLElement`
  - Implement Shadow DOM attachment in constructor
  - Support `url` attribute for target URL configuration (defaulting to window.location.href)
  - Implement render method to generate button with SVG icon and text label
  - Port styling from ArticleComponent to component-scoped Shadow DOM CSS
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

- [x] 2. Implement Clipboard Logic & Feedback (P)
  - Implement click event listener to trigger clipboard copy
  - Use `navigator.clipboard.writeText` to copy configured URL
  - Display "コピーしました！" on success and "コピーに失敗しました" on error
  - Implement 2-second timeout to auto-hide feedback
  - Add `disconnectedCallback` to clear any active timers
  - Ensure accessibility attributes (`aria-label`, `aria-live`, `<button>`) are correctly set
  - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 8.1, 8.2_

- [x] 3. Integrate into Article Component
  - Import `ShareButtonComponent` in `article-component.js`
  - Replace existing inline button HTML/CSS/JS with `<share-button-component>` tag
  - Pass current page URL or article link to the component's `url` attribute if needed (or rely on default)
  - Verify functionality and removal of legacy code (dead code cleanup)
  - _Requirements: 7.1, 7.2, 7.3, 7.4_
