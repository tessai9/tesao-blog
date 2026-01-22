# Requirements Document

## Introduction
This refactoring extracts the share button functionality from `article-component` into a standalone `share-button-component`. The new component will be a reusable Web Component that copies a configurable URL to the clipboard, displays feedback messages, and maintains full accessibility support. This follows the project's Web Components architecture pattern of self-contained custom elements.

## Requirements

### Requirement 1: Component Definition
**Objective:** As a developer, I want a standalone share button Web Component, so that I can reuse it across different pages and contexts.

#### Acceptance Criteria
1. The Share Button Component shall be defined as a custom element with the tag name `share-button-component`.
2. The Share Button Component shall use Shadow DOM for style encapsulation.
3. The Share Button Component shall be located at `app/scripts/components/share-button-component.js` following project naming conventions.
4. The Share Button Component shall be importable as an ES Module.

### Requirement 2: URL Configuration
**Objective:** As a developer, I want to configure which URL the share button copies, so that I can use the component in different contexts.

#### Acceptance Criteria
1. The Share Button Component shall accept a `url` attribute to specify the URL to copy.
2. If no `url` attribute is provided, the Share Button Component shall use `window.location.href` as the default source.
3. When the `url` attribute changes, the Share Button Component shall use the new URL for subsequent copy operations.

### Requirement 3: Visual Appearance
**Objective:** As a user, I want the share button to have a consistent appearance, so that it matches the existing UI design.

#### Acceptance Criteria
1. The Share Button Component shall render a button with an inline SVG link icon and text label.
2. The Share Button Component shall encapsulate all styles within its Shadow DOM.
3. The Share Button Component shall apply hover and focus states for visual feedback.
4. The Share Button Component shall use colors consistent with the existing design (#333 text, #ddd border).

### Requirement 4: Clipboard Functionality
**Objective:** As a user, I want to copy the URL to my clipboard by clicking the button, so that I can share the link easily.

#### Acceptance Criteria
1. When the user clicks the share button, the Share Button Component shall copy the configured URL to the system clipboard.
2. The Share Button Component shall use the Clipboard API (`navigator.clipboard.writeText`) for the copy operation.
3. If the clipboard operation fails, the Share Button Component shall handle the error gracefully.

### Requirement 5: User Feedback
**Objective:** As a user, I want visual confirmation when the URL is copied, so that I know the action succeeded.

#### Acceptance Criteria
1. When the URL is successfully copied, the Share Button Component shall display "コピーしました！" as a success message.
2. If the copy operation fails, the Share Button Component shall display "コピーに失敗しました" as an error message.
3. When 2 seconds have elapsed since displaying the message, the Share Button Component shall hide the feedback message.
4. When a new copy action occurs, the Share Button Component shall clear any existing feedback timer.

### Requirement 6: Accessibility
**Objective:** As a user with assistive technology, I want the share button to be fully accessible, so that I can use it regardless of how I interact with the page.

#### Acceptance Criteria
1. The Share Button Component shall provide an accessible label via `aria-label` attribute.
2. The Share Button Component shall use a native `<button>` element for keyboard accessibility.
3. The Share Button Component shall include an ARIA live region (`aria-live="polite"`) for screen reader feedback announcements.
4. The Share Button Component shall be activatable via Enter or Space keys.

### Requirement 7: Integration with Article Component
**Objective:** As a developer, I want to replace the inline share button in article-component with the new component, so that the codebase is cleaner and more maintainable.

#### Acceptance Criteria
1. The Article Component shall import and use `share-button-component` instead of inline share button implementation.
2. The Article Component shall remove all share-button-related CSS, HTML, and JavaScript after integration.
3. The Article Component shall pass the current page URL to the share button component.
4. Where the Share Button Component is used in Article Component, the existing functionality shall be preserved.

### Requirement 8: Lifecycle Management
**Objective:** As a developer, I want the component to properly manage its lifecycle, so that resources are cleaned up when the component is removed.

#### Acceptance Criteria
1. When the component is disconnected from the DOM, the Share Button Component shall clear any active timeouts.
2. The Share Button Component shall not leak event listeners or timers when removed from the DOM.