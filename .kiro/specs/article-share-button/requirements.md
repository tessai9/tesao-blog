# Requirements Document

## Project Description (Input)
Copy Blog link to clipboard with share button in the article

## Introduction
This feature adds a share button to the article view that allows readers to copy the current article's URL to their clipboard. The button will be integrated into the existing `article-component` Web Component, following the project's vanilla JavaScript and Shadow DOM architecture. Visual feedback will confirm the copy action to users.

## Requirements

### Requirement 1: Share Button Display
**Objective:** As a reader, I want to see a share button on each article page, so that I can easily find the option to share the article.

#### Acceptance Criteria
1. When the article content is rendered, the Article Component shall display a share button within the article view.
2. The Article Component shall render the share button with an inline SVG icon accompanied by a text label.
3. The Article Component shall position the share button in a visible location that does not obstruct the article content.
4. The Article Component shall style the share button consistently with the existing article UI design.

### Requirement 2: Copy URL to Clipboard
**Objective:** As a reader, I want to copy the article URL to my clipboard by clicking the share button, so that I can easily share the article link with others.

#### Acceptance Criteria
1. When the user clicks the share button, the Article Component shall copy the current article's full URL to the system clipboard.
2. The Article Component shall use the Clipboard API to perform the copy operation.
3. The Article Component shall include the complete URL with query parameters (e.g., `article.html?article=20260110.md`).

### Requirement 3: User Feedback
**Objective:** As a reader, I want to receive visual confirmation when the URL is copied, so that I know the action was successful.

#### Acceptance Criteria
1. When the URL is successfully copied to the clipboard, the Article Component shall display a visual confirmation message (e.g., "Copied!" or "コピーしました！").
2. The Article Component shall display the confirmation message for a brief duration (approximately 2 seconds) before reverting to the default state.
3. If the clipboard copy operation fails, the Article Component shall display an error message indicating the failure.

### Requirement 4: Accessibility
**Objective:** As a reader using assistive technology, I want the share button to be accessible, so that I can use the share functionality regardless of how I interact with the page.

#### Acceptance Criteria
1. The Article Component shall provide an accessible label for the share button (e.g., `aria-label`).
2. The Article Component shall ensure the share button is keyboard-navigable and can be activated with Enter or Space keys.
3. When the copy action completes, the Article Component shall announce the result to screen readers using appropriate ARIA live regions.
