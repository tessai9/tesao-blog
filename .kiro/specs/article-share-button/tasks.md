# Implementation Plan

## Tasks

- [x] 1. Add share button UI to article component
- [x] 1.1 Add share button HTML structure with SVG icon and text label
  - Add a container div for the share button and feedback elements within the render method
  - Include an inline SVG link icon (16x16) with `aria-hidden="true"`
  - Add text label "リンクをコピー" next to the icon
  - Position the share container after the article content and before the back navigation link
  - Include `aria-label="記事のリンクをコピー"` for accessibility
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2_

- [x] 1.2 Style the share button to match existing article UI
  - Add CSS rules for `.share-container` with appropriate spacing
  - Style `.share-button` with colors matching existing link style (#333, hover states)
  - Align the SVG icon and text vertically
  - Add hover and focus states for visual feedback
  - Ensure button uses native `<button>` element for keyboard accessibility
  - _Requirements: 1.4, 4.2_

- [x] 2. Implement clipboard copy functionality
- [x] 2.1 Add click handler to copy article URL to clipboard
  - Create async `_handleShareClick()` method
  - Use `navigator.clipboard.writeText()` with `window.location.href`
  - Wrap clipboard operation in try/catch for error handling
  - Attach click event listener to the share button element
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Implement user feedback system
- [x] 3.1 Add feedback message display functionality
  - Create `_showFeedback(message, type)` method to display status messages
  - Add `.share-feedback` element with `role="status"` and `aria-live="polite"` for screen reader announcements
  - Style success messages (e.g., green text) and error messages (e.g., red text)
  - Display "コピーしました！" on success, "コピーに失敗しました" on error
  - _Requirements: 3.1, 3.3, 4.3_

- [x] 3.2 Implement auto-hide timer for feedback messages
  - Create `_hideFeedback()` method to clear the feedback element
  - Set 2-second timeout after showing feedback message
  - Store timeout ID to clear previous timer when new feedback is shown
  - Clear timeout when component is disconnected (cleanup)
  - _Requirements: 3.2_

- [x] 4. Manual verification
- [x] 4.1 Verify share button functionality in browser
  - Open an article page and confirm share button appears
  - Click the button and verify URL is copied to clipboard (paste to confirm)
  - Verify success message appears and disappears after 2 seconds
  - Test keyboard navigation (Tab to button, Enter/Space to activate)
  - Test with screen reader to verify announcements
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_
