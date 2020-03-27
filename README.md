![owl logo](https://dvc.org/img/logo-github-readme.png)

[![Maintainability](https://api.codeclimate.com/v1/badges/5872e0a572ec8b74bd8d/maintainability)](https://codeclimate.com/github/iterative/dvc.org/maintainability)
[![CircleCI](https://circleci.com/gh/iterative/dvc.org.svg?style=svg)](https://circleci.com/gh/iterative/dvc.org)

[DVC](https://github.com/iterative/dvc) project documentation and website source
code.

## Installation

Make sure you have the latest LTS version of [Node.js](https://nodejs.org) and
[Yarn](https://yarnpkg.com) installed.

Run `yarn command`.

## Commands

- `yarn develop` - run dev server with hot reload.
- `yarn build` - build static assets to `public` folder.
- `yarn serve` - run static server over the `public` folder content to check
  build results.
- `yarn lint-ts` - lint `.ts` and `.tsx` for compilance with code style and
  check its for type errors.
- `yarn lint-css` - lint `.css` files for compilance with code style.

## ENV variables

- `GA_ID` – id of the Google Analytics counter.
- `ANALYZE` - boolean prop to run webpack-analyzer
- `SENTRY_DSN` - sentry dsn url for tracking errors

## Technologies

This docs engine was built using [Gatsby.js](https://www.gatsbyjs.org/).
[Algolia](https://www.algolia.com/products/search/) uses to provide full text
search.

Please feel free to use it for your own sites and
[reach out to us](https://dvc.org/support) if you have any questions.

# Contributing

We welcome contributions to the DVC docs by the community!

You can refer to our
[Contributing guide](https://dvc.org/doc/user-guide/contributing/docs) for more
details. Thank you!

**If you need help:**

If you have any questions, please join the [community](https://dvc.org/chat) and
use the `#dev-docs` channel to discuss any issues in our website or docs. We are
very responsive and happy to help.

# Writing blog posts

Create `.md` file in the `content/blog` folder. File name will be used as
`slug`.

Write frontmatter in the following format:

```yml
---
title: Hello World
date: '2015-05-01T22:12:03.284Z'
description: 'Hello World'
descriptionLong: |
  Some long
  multiline
  text
picture: /uploads/image.jpeg
pictureComment: Some Comment
author: ../authors/author_name.md
tags:
  - Open Source
  - Machine Learning
  - Data Science
  - Version Control
  - AI
---

```

- `title` - **Required.** Title of the post.
- `date` - **Required.** Post date. Will be used to sort posts and in RSS.
- `description` - **Required.** Short description to show in the feed.
- `descriptionLong` - Optional long description to show before image on the post
  page. If not set, `description` will be used instead.
- `picture` - Optional cover image.
- `pictureComment` - Optional cover image comment.
- `author` - **Required** Relative path to `.md` file with information about the
  author.
- `tags` - Optional list of tags.

## Adding authors

Create `.md` file in the `content/authors` folder.

Write frontmatter in the following format:

```yml
path: ../authors/relative_path_to_file.md
name: Author's Name
avatar: /uploads/avatar.jpeg
```

- `path` - **Required** String that the CMS will insert to the author field in
  the blog post. Should be equal to the path from the blog post to the author's
  `.md` file.
- `name` – **Required** Author's name.
- `avatar` - **Required** relative path to the author's avatar.

# Copyright

This project is distributed under the Apache license version 2.0 (see the
LICENSE file in the project root).

By submitting a pull request for this project, you agree to license your
contribution under the Apache license version 2.0 to this project.

If you use images, please make a reference to the original site.
