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

フロントエンドはVanilla JavaScriptで実装する
markdownへの変換は別途Rustで実装してwasmにコンパイルしたものを使用する

### データ構造と関連付け

ArticleとThreadの関連付けは、ArticleのMarkdownファイルにメタデータを記述する方法で行う。

#### ディレクトリ構成

```
.
├── articles/
│   └── 2025-07-20-my-first-post.md
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

#### ArticleのMarkdownファイル

ファイルの先頭に`---`で囲んだYAML形式のフロントマターを記述し、関連するThreadのIDを管理する。

**例: `articles/2025-07-20-my-first-post.md`**
'''markdown
---
title: "初めての投稿"
date: "2025-07-20"
threads:
  - "thread-a8b4c1"
  - "thread-d9e7f2"
---

# これはArticleの本文です

日々の学習について記録します。
...
'''

#### ThreadのJSONファイル

各Threadは個別のJSONファイルとして管理し、ユニークなIDを持つ。

**例: `threads/thread-a8b4c1.json`**
'''json
{
  "id": "thread-a8b4c1",
  "posts": [
    {
      "post_id": "post-001",
      "author": "sumiyoshi",
      "content": "この記事から派生したThreadの最初の投稿です。",
      "timestamp": "2025-07-20T10:00:00Z"
    },
    {
      "post_id": "post-002",
      "author": "sumiyoshi",
      "content": "これは2つ目の返信です。",
      "timestamp": "2025-07-20T10:05:00Z"
    }
  ]
}
'''

`posts`配列の最初の要素が、Articleページに表示されるプレビュー対象となる。
