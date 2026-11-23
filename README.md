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

Push the markdown file to `master` and GitHub Actions takes care of the rest
(building the Rust/wasm markdown parser and regenerating `app/articles.json`).

```shell
$ git add app/articles/yyyymmdd.md
$ git commit -m 'articles/yyyymmdd'
$ git push origin master
```

Note: only commit articles you want published — drafts should stay
uncommitted until ready.
