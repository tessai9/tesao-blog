import init, { markdown_to_html } from '../lib/markdown_parser.js';

let wasmInitialized = false;
async function initializeWasm() {
    if (!wasmInitialized) {
        await init();
        wasmInitialized = true;
    }
}

class ArticleComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._src = null;
        initializeWasm().catch(err => console.error("Failed to initialize Wasm module for ArticleComponent:", err));
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
        
        if (!wasmInitialized) {
            await initializeWasm();
        }

        let htmlContent;
        try {
            htmlContent = markdown_to_html(markdownContent);
        } catch (error) {
            console.error('Error converting markdown to HTML:', error);
            htmlContent = '<p>Error converting markdown to HTML.</p>';
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 1em;
                    /* Consider removing default border if not desired for final look */
                    /* border: 1px solid #ccc; */ 
                    margin-bottom: 1em;
                }
                /* Add any specific styling for rendered HTML if needed */
            </style>
            <div>
                ${htmlContent}
            </div>
        `;
    }
}

customElements.define('article-component', ArticleComponent);
