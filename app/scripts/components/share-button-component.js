const FEEDBACK_DISPLAY_TIME = 2000;

export class ShareButtonComponent extends HTMLElement {
    static get observedAttributes() {
        return ['url', 'title'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._feedbackTimeoutId = null;
        this._isProcessing = false;
    }

    get url() {
        return this.getAttribute('url') || window.location.href;
    }

    get title() {
        return this.getAttribute('title') || document.title;
    }

    connectedCallback() {
        this._render();
        const button = this.shadowRoot.querySelector('.share-button');
        if (button) {
            button.addEventListener('click', () => this._handleShareClick());
        }
    }

    disconnectedCallback() {
        if (this._feedbackTimeoutId) {
            clearTimeout(this._feedbackTimeoutId);
            this._feedbackTimeoutId = null;
        }
    }

    _formatShareText(title, url) {
        if (title) {
            return `${title}\n${url}`;
        }
        return url;
    }

    async _handleShareClick() {
        if (this._isProcessing) {
            return;
        }

        this._isProcessing = true;

        try {
            const shareText = this._formatShareText(this.title, this.url);
            await navigator.clipboard.writeText(shareText);
            this._showFeedback('クリップボードにコピーしました！', 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            this._showFeedback('コピーに失敗しました', 'error');
        } finally {
            this._isProcessing = false;
        }
    }

    _showFeedback(message, type) {
        const feedbackElement = this.shadowRoot.querySelector('.share-feedback');
        if (!feedbackElement) return;

        // Clear any existing timeout
        if (this._feedbackTimeoutId) {
            clearTimeout(this._feedbackTimeoutId);
        }

        // Update message and styling
        feedbackElement.textContent = message;
        feedbackElement.className = `share-feedback visible ${type}`;

        // Auto-hide after 2 seconds
        this._feedbackTimeoutId = setTimeout(() => this._hideFeedback(), FEEDBACK_DISPLAY_TIME);
    }

    _hideFeedback() {
        const feedbackElement = this.shadowRoot.querySelector('.share-feedback');
        if (!feedbackElement) return;

        feedbackElement.textContent = '';
        feedbackElement.className = 'share-feedback';
        this._feedbackTimeoutId = null;
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                .share-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: none;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    color: #333;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: background-color 0.2s, border-color 0.2s;
                }
                .share-button:hover {
                    background-color: #f8f9fa;
                    border-color: #333;
                }
                .share-button:focus {
                    outline: 2px solid #333;
                    outline-offset: 2px;
                }
                .share-button svg {
                    flex-shrink: 0;
                }
                .share-feedback {
                    font-size: 0.875rem;
                    opacity: 0;
                    transition: opacity 0.2s;
                    margin-left: 0.5rem;
                }
                .share-feedback.visible {
                    opacity: 1;
                }
                .share-feedback.success {
                    color: #28a745;
                }
                .share-feedback.error {
                    color: #dc3545;
                }
            </style>
            <button
                class="share-button"
                aria-label="記事をシェア"
                type="button"
            >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>記事をシェア</span>
            </button>
            <span class="share-feedback" role="status" aria-live="polite"></span>
        `;
    }
}

customElements.define('share-button-component', ShareButtonComponent);

