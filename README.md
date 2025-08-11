# How to make new blog article

1. Create markdown file.
1. Add yaml frontmatter on top of the file.
  ```yaml
  Date: YYYY-mm-dd
  Title: Blog title
  Tags: ["diary", "javascript"]
  ```
1. Just start writing what you are thinking.

# Deploy

## before you start

- Install node

## How to deploy

1. Run generating json command.
  ```shell
  $ node generate-articles-list.js
  ```
1. Push to repository.
  ```shell
  $ git add .
  $ git commit -m 'articles/yyyymmdd'
  $ git push origin master
  ```
