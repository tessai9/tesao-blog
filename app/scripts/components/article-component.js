import init, { markdown_to_html } from '../lib/markdown_parser.js';

// Start initializing the wasm module as soon as the script is loaded.
const wasmInitialized = init();

class ArticleComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._articlePath = null;
        this._feedbackTimeoutId = null;
    }

    connectedCallback() {
      // URL paramsから記事のファイル名を取得
      const urlParams = new URLSearchParams(window.location.search);
      const articlePath = urlParams.get('article');
      if (articlePath) {
          this._articlePath = articlePath;
          this._render();
      } else {
          this.shadowRoot.innerHTML = '<p>記事が選択されていません。</p>';
      }
    }

    async _fetchMarkdown() {
        try {
            const response = await fetch(`/articles/${this._articlePath}`);
            if (!response.ok) {
                if (response.status === 404) {
                    return '指定された記事が見つかりません。';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('error:', error);
            return '記事の読み込みに失敗しました。';
        }
    }

    async _render() {
        if (!this._articlePath) {
            this.shadowRoot.innerHTML = '<p>記事が選択されていません。</p>';
            return;
        }

        // Wait for the wasm module to be initialized before proceeding.
        await wasmInitialized;

        const markdownContent = await this._fetchMarkdown();

        let htmlContent;
        try {
            const article = markdown_to_html(markdownContent);
            htmlContent = article.html;
        } catch (error) {
            console.error('failed to convert markdown', error);
            htmlContent = '<p>記事の表示に失敗しました。</p>';
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 800px;
                    margin: 2rem auto;
                    padding: 0 1rem;
                }
                article {
                    background-color: #fff;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    margin-top: 0;
                    color: #333;
                    font-size: 2rem;
                }
                p {
                    line-height: 1.6;
                    color: #444;
                }
                pre {
                    background-color: #f8f9fa;
                    padding: 1rem;
                    border-radius: 4px;
                    overflow-x: auto;
                }
                code {
                    font-family: 'Consolas', 'Monaco', monospace;
                    background-color: #f8f9fa;
                    padding: 0.2em 0em;
                    border-radius: 3px;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 4px;
                }
                blockquote {
                    border-left: 4px solid #ddd;
                    margin: 0;
                    padding-left: 1rem;
                    color: #666;
                }
                .menu-container {
                    margin: 1rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
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
            <div class="menu-container">
                <button
                    class="share-button"
                    aria-label="記事のリンクをコピー"
                    type="button"
                >
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span>記事のリンクをコピー</span>
                </button>
                <span class="share-feedback" role="status" aria-live="polite"></span>
                <a href="/">記事一覧に戻る</a>
            </div>
            <article>
                ${htmlContent}
            </article>
        `;

        // Attach click event listener to share button
        const shareButton = this.shadowRoot.querySelector('.share-button');
        if (shareButton) {
            shareButton.addEventListener('click', () => this._handleShareClick());
        }
    }

    async _handleShareClick() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            this._showFeedback('コピーしました！', 'success');
        } catch (error) {
            console.error('Failed to copy URL:', error);
            this._showFeedback('コピーに失敗しました', 'error');
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
        this._feedbackTimeoutId = setTimeout(() => this._hideFeedback(), 2000);
    }

    _hideFeedback() {
        const feedbackElement = this.shadowRoot.querySelector('.share-feedback');
        if (!feedbackElement) return;

        feedbackElement.textContent = '';
        feedbackElement.className = 'share-feedback';
        this._feedbackTimeoutId = null;
    }

    disconnectedCallback() {
        // Clean up timeout when component is removed
        if (this._feedbackTimeoutId) {
            clearTimeout(this._feedbackTimeoutId);
            this._feedbackTimeoutId = null;
        }
    }
}

customElements.define('article-component', ArticleComponent);
