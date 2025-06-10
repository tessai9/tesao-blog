import { formatToDateString } from "../utils/date.js";

class ArticleListComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        try {
            const response = await fetch('/articles');
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            // ディレクトリ内のファイル一覧を取得
            const files = Array.from(doc.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.endsWith('.md')) // .mdファイルのみを対象
                .map(href => {
                    const fileName = href.split('/').pop();
                    return {
                        title: fileName.replace('.md', ''),
                        date: new Date(formatToDateString(this.extractDateFromFileName(fileName))),
                        fileName: fileName
                    };
                });

            // ファイル名（日付）の降順でソート
            files.sort((a, b) => new Date(b.date) - new Date(a.date));

            this.render(files);
        } catch (error) {
          window.alert('記事の読み込みに失敗しました。');
          console.error('Error fetching articles:', error);
        }
    }

    extractDateFromFileName(fileName) {
        // ファイル名から日付を抽出（例: 20240320.md）
        const dateMatch = fileName.match(/^(\d{4}\d{2}\d{2})\./);
        return dateMatch ? dateMatch[1] : null;
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
