# ブログアプリ設計

## 要件

日々の学習の記録や日記、頭の中のアウトプットをするための自分用ブログサイトを構築する  
投稿する日記はmarkdown形式で記述し、閲覧する時はHTMLに変換して表示する

ブログの使い方としては以下の２通り
1. 学習したことや日記をまとまった文章にして投稿する（Article）
2. 思いついたことや学習のアウトプットをツリー形式のスレッドで短文的に投稿する（Thread）

Article, Threadそれぞれで投稿の方法が異なり、
Articleはローカルでmarkdown形式で記述し、GitHubのpublic repositoryにpushすることで公開する
ThreadはWebアプリ上で投稿するが、その時に対象の投稿からスレッドに続けるか新たにブランチに切る（新しいスレッドを作成する）ことが選択できる

Threadの作成方法はいくつか想定しており、

- 新しくThreadを作成する
- 既存のThreadから別のThreadに分岐する
- Articleの下にThreadを作成する

が現状の案である

まずはbackendなしにArticle閲覧機能を実装し、その後Threadの投稿機能を実装する

## 設計

### アプリケーション構成

アプリケーションは基本的にVanilla JavaScriptのみで実装するが、
markdownへの変換のみ別途Rustで実装してwasmにコンパイルしたものを使用する  
なお、markdown parserの設計については`markdown-parser/design.md`に記載している

### ディレクトリ構成

```
.
├── articles/
│   └── 20250720.md
├── threads/
│   └── thread-a8b4c1.json
│   └── thread-d9e7f2.json
├── design.md
├── index.html
└── scripts/
    └── ...
```

- `articles/`: ArticleのMarkdownファイルを格納する。
- `threads/`: ThreadのJSONファイルを格納する。

### Article

ArticleはMarkdown形式で記載する  
ファイル名は任意の名前をつけることができる

Frontmatterに対応しており、ファイルの先頭に`---`で囲んだエリアにYAML形式で記述する  
対応しているパラメータは以下の通り
- Date
  - YYYY-mm-dd
- Title
  - string
- Tags
  - list of string

**例: `articles/20250720.md`**
'''markdown
---
Date: 2025-07-20
Title: 初めての投稿
Tags:
  - tagA
  - tagB
  - tagC
---

# これはArticleの本文です

日々の学習について記録します。
...
'''

### Thread

