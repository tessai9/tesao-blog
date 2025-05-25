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
