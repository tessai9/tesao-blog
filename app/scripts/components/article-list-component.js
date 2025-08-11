class ArticleListComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        try {
            const response = await fetch('/app/articles.json');
            const articles = await response.json();

            // 日付の降順でソート
            articles.sort((a, b) => new Date(b.date) - new Date(a.date));

            this.render(articles);
        } catch (error) {
          window.alert('記事の読み込みに失敗しました。');
          console.error('Error fetching articles:', error);
        }
    }

    render(articles) {
        const style = `
            :host {
                display: block;
                max-width: 800px;
                margin: 2rem auto;
                padding: 0 1rem;
            }
            .article-list {
                list-style: none;
                padding: 0;
            }
            .article-item {
                margin-bottom: 2rem;
                padding: 1rem;
                border-radius: 8px;
                background-color: #f8f9fa;
                transition: transform 0.2s;
            }
            .article-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .article-title {
                margin: 0 0 0.5rem 0;
                font-size: 1.5rem;
                color: #333;
            }
            .article-date {
                color: #666;
                font-size: 0.9rem;
            }
            .article-link {
                text-decoration: none;
                color: inherit;
                display: block;
            }
        `;

        const articleList = articles.map(article => `
            <li class="article-item">
                <a href="/article.html?article=${article.fileName}" class="article-link">
                    <h2 class="article-title">${article.title}</h2>
                    <div class="article-date">${new Date(article.date).toLocaleDateString('ja-JP')}</div>
                </a>
            </li>
        `).join('');

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <ul class="article-list">
                ${articleList}
            </ul>
        `;
    }
}

customElements.define('article-list-component', ArticleListComponent);
