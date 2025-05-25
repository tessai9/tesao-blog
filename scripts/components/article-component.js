class ArticleComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._src = null;
    }

    static get observedAttributes() {
        return ['src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src' && oldValue !== newValue) {
            this._src = newValue;
            this._render();
        }
    }

    connectedCallback() {
        if (this._src) {
            this._render();
        }
    }

    async _fetchMarkdown(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error fetching markdown:', error);
            return 'Error loading article.';
        }
    }

    async _render() {
        if (!this._src) {
            this.shadowRoot.innerHTML = '<p>No article source specified.</p>';
            return;
        }

        const markdownContent = await this._fetchMarkdown(this._src);
        // For now, just display the raw markdown.
        // Later, we'll integrate the markdown-to-HTML conversion.
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 1em;
                    border: 1px solid #ccc;
                    margin-bottom: 1em;
                }
                pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
            </style>
            <div>
                <pre>${markdownContent}</pre>
            </div>
        `;
    }
}

customElements.define('article-component', ArticleComponent);
