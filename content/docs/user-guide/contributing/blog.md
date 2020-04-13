# Writing Blog Posts

To create a new post, you need to create a PR to the DVC website
[project](https://github.com/iterative/dvc.org).

## Prepare your environment

Set up the
[Development environment](/doc/user-guide/contributing/docs#development-environment)
to see how your content will look like after you publish it. In the
`yarn develop` mode you will be able to run the website locally, and it'll be
updating content in your browser as you edit the post.

## Add a post

Create a Markdown file in the `content/blog` folder. File name must follow the
pattern: `YYYY-MM-DD-my-new-blog-post.md`. After merging this file into the
`master` branch, blog post will be published at `blog/my-new-blog-post` address
automatically.

Write front matter in the following format:

```yml
---
title: Hello World
date: '2015-05-01T22:12:03.284Z'
description: 'Hello World'
descriptionLong: |
  Some long
  multiline
  text (supports _basic_ [Markdown](link))
picture: /uploads/image.jpeg
pictureComment: Some _Comment_ (supports _basic_ [Markdown](link))
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
- `descriptionLong` - Optional long description to show before the image on the
  post page. If not set, `description` will be used instead. Supports basic
  Markdown markup.
- `picture` - Optional cover image.
- `pictureComment` - Optional cover image comment. Supports basic Markdown
  markup.
- `author` - **Required.** Relative path to `.md` file with information about
  the author. See
  [Adding authors](/doc/user-guide/contributing/blog#adding-authors) to add a
  new author.
- `commentsUrl` - Optional link to the [DVC forum](https://discuss.dvc.org)
  topic. It will contain comments for the post.
- `tags` - Optional list of tags.

## Content guidelines

It's recommended to follow all the relevant recommendations from the
[Doc style guidelines](/doc/user-guide/contributing/docs#doc-style-guidelines-javascript-and-markdown).

### Adding images

To add images, put them into `static/uploads` and reference like this:

```md
![](/uploads/images/2020-02-10/image.png)
```

To add a subtitle:

```md
![](/uploads/images/2020-02-10/image.png)_subtitle [with a link](link)_
```

To set the image size and text wrap:

```md
![](/uploads/images/2020-02-10/image.png '=500')
![](/uploads/images/2020-02-10/image.png '=500 Some Title')
![](/uploads/images/2020-02-10/image.png 'Some Title =500')
![](/uploads/images/2020-02-10/image.png 'Some Title :wrap-left =500')
![](/uploads/images/2020-02-10/image.png ':wrap-left =500 Some Title')
```

### Embedding links

For those supported by the
[`gatsby-remark-embedder`](https://www.gatsbyjs.org/packages/gatsby-remark-embedder/)
plugin, just put a link like described on its home page, e.g.
[Twitter](https://github.com/MichaelDeBoey/gatsby-remark-embedder#twitter) or
[YouTube](https://github.com/MichaelDeBoey/gatsby-remark-embedder#youtube):

```md
Your regular markdown paragraph ...

https://youtu.be/4h6I9_xeYA4

... another regular markdown paragraph.
```

For any other external link you can embed it with a custom HTML markup like
this:

```md
Your regular markdown paragraph ...

<external-link
href="https://dvc.org/doc"
title="Open-source tools to version control Machine Learning models and experiments"
description="AI and ML are becoming an essential part of the engineering..."
link="dvc.org"
image="/uploads/images/image.png" />

... another regular markdown paragraph.
```

## Adding authors

Create `.md` file in the `content/authors` folder.

Write front matter in the following format:

```yml
path: ../authors/relative_path_to_file.md
name: Author's Name
avatar: /uploads/avatar.jpeg
```

- `path` - **Required.** String that the CMS will insert to the author field in
  the blog post. Should be equal to the path from the blog post to the author's
  `.md` file.
- `name` – **Required.** Author's name.
- `avatar` - **Required.** Relative path to the author's avatar.
