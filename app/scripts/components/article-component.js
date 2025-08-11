import init, { markdown_to_html } from '../lib/markdown_parser.js';

// Start initializing the wasm module as soon as the script is loaded.
const wasmInitialized = init();

class ArticleComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._articlePath = null;
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
            const response = await fetch(`/app/articles/${this._articlePath}`);
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
            </style>
            <article>
                ${htmlContent}
            </article>
            <a href="/">記事一覧に戻る</a>
        `;
    }
}

customElements.define('article-component', ArticleComponent);
